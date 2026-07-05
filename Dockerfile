# syntax = docker/dockerfile:1

ARG NODE_VERSION=24.13.0
FROM node:${NODE_VERSION}-slim AS base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"

# ---- Build stage: full deps + compile TS (NestJS) ----
FROM base AS build
ENV HUSKY=0
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential python-is-python3
COPY package-lock.json package.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build
# Bỏ devDependencies khỏi node_modules cho image gọn
RUN npm prune --omit=dev

# ---- Final stage: chỉ dist + node_modules production ----
FROM base
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
EXPOSE 3000
CMD [ "node", "dist/main" ]
