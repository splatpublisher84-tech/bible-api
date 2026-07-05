# Deployment Rules

## Infrastructure
- **Hosting:** Fly.io (app: `bible-api-ibsnxg`, region: `iad`)
- **Database:** Supabase PostgreSQL (free tier, 500MB limit)
- **VM:** shared-cpu-1x, 256MB RAM, auto-stop enabled, min 0 machines

## Deploy Command
```bash
flyctl deploy
```

## Pre-deploy Checklist
1. `npm run check` + `npm run typecheck` — lint/format + types sạch
2. `npm run build` — TS compile được (`nest build` → `dist/`)
3. `npm test` — all tests pass (cần DB)
4. `git status` — no uncommitted changes; commit + push GitHub trước
5. `.env` secrets KHÔNG nằm trong code

## Database migrations (Drizzle)
- Prod **đã có schema+data** → **ĐỪNG** `drizzle-kit migrate` mù (migration `0000_init` sẽ đụng bảng đã tồn tại).
- Lần đầu: **baseline** — đánh dấu `0000` đã áp dụng trong `drizzle.__drizzle_migrations`, rồi chỉ migrate các bản mới sau này.
- Dockerfile là multi-stage: cài dev deps → `npm run build` → chạy `node dist/main` (không tự migrate).

## Post-deploy Verification
```bash
curl -s https://bible-api-ibsnxg.fly.dev/health | jq
curl -s https://bible-api-ibsnxg.fly.dev/api/status | jq
```

## Rollback
```bash
flyctl releases list
flyctl deploy --image <previous-image>
```

## Important Notes
- Supabase SSL: must use `rejectUnauthorized: false` (Supabase uses self-signed certs for direct connections)
- Fly.io auto-stops machine when idle → first request after idle takes ~3-5s (cold start)
- Memory limit is 256MB — monitor via dashboard Memory chart, alert if RSS > 200MB
- Environment variables set via `flyctl secrets set KEY=VALUE`
