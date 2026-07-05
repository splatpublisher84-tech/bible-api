#!/usr/bin/env bash
# Dựng lại DB local từ đầu: xoá volume -> Postgres sạch -> drizzle-kit migrate (schema) -> seed data.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ docker compose down -v && up -d ..."
docker compose down -v
docker compose up -d

echo "→ chờ Postgres ready ..."
for _ in $(seq 1 30); do
  docker exec bible_postgres pg_isready -U bible_user >/dev/null 2>&1 && break
  sleep 1
done

echo "→ drizzle-kit migrate (tạo schema từ drizzle/) ..."
npx drizzle-kit migrate

echo "→ seed data (sql/seed.sql) ..."
docker exec -i bible_postgres psql -q -v ON_ERROR_STOP=1 -U bible_user -d bible_db < sql/seed.sql

echo "✅ DB sẵn sàng (schema + data)."
