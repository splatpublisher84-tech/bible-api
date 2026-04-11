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
1. `npm test` — all tests must pass
2. `git status` — no uncommitted changes
3. Check for `.env` secrets NOT in code
4. Commit and push to GitHub first

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
