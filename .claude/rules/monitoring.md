# Monitoring & Dashboard Rules

## Dashboard Architecture
- **HTML:** `src/views/dashboard.html` (slim, structure only)
- **CSS:** `src/public/css/dashboard.css` (all styles)
- **JS:** `src/public/js/dashboard.js` (Chart.js charts + data fetching)
- **Charts:** Chart.js 4 via CDN (`https://cdn.jsdelivr.net`)

## Metrics Endpoint
`GET /api/metrics?key=METRICS_KEY` returns:
- `totals`: client, internal, errors counts
- `hourly[]`: per-hour breakdown with durations[], percentiles, health status
- `top_endpoints[]`: sorted by total hits, client/internal split
- `recent_logs[]`: last 50 requests
- `system.db_hourly[]`: DB query avg/p95/p99 per hour
- `system.memory[]`: heap/RSS samples (every 5min)

## Tracking Components
- `src/metrics/metrics.store.ts` — in-memory request + DB + memory tracking (giữ đúng shape cũ; timer `unref`)
- `src/main.ts` — Fastify `onResponse` hook → `recordRequest` (status/duration cuối cùng, phân loại client/internal)
- `src/database/database.module.ts` — `pool.query` wrapped → `trackQuery` (đo mọi query)
- `src/metrics/metrics.controller.ts` — `GET /api/metrics` (kiểm `?key=`)
- Dashboard served qua `src/views/views.controller.ts`; assets qua `@fastify/static` (`/static`)

## Adding New Charts
1. Add `<canvas id="newCanvas">` in dashboard.html
2. Add render function in dashboard.js following existing pattern
3. Call render function in `loadMetrics()` with appropriate data
4. Use dark theme defaults (already configured globally in dashboard.js)

## Internal vs Client Classification
- Internal: paths starting with `/api/status`, `/api/metrics`, `/health`, `/dashboard`, `/static`
- Client: everything else (actual API consumers)
