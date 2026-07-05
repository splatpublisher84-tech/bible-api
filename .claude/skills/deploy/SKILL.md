---
name: deploy
description: Deploy Bible API to Fly.io with pre-flight checks
---

## Deploy to Fly.io

Run these steps in order:

### 1. Pre-flight checks (run in parallel)
```bash
npm test
git status
git diff --cached
```

### 2. If there are uncommitted changes
- Stage and commit with a descriptive message
- Push to GitHub: `git push origin main`

### 3. Deploy
```bash
flyctl deploy
```

### 4. Post-deploy verification (run in parallel)
```bash
curl -s https://bible-api-ibsnxg.fly.dev/health | jq
curl -s 'https://bible-api-ibsnxg.fly.dev/api/verses/kjv_strongs/43/3/16' | jq
```

### 5. Report results
Show the user:
- Deploy status (success/fail)
- Health check result
- API response verification
- Dashboard link: https://bible-api-ibsnxg.fly.dev/dashboard
