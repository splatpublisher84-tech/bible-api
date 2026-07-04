const MAX_LOGS = 100;
const MAX_HOURLY = 24;

const INTERNAL_PATHS = new Set([
  '/',
  '/health',
  '/dashboard',
  '/demo',
  '/api/status',
  '/api/metrics',
]);

function classifyRequest(path) {
  if (INTERNAL_PATHS.has(path)) return 'internal';
  if (path.startsWith('/api-docs')) return 'internal';
  if (path.startsWith('/api/')) return 'client';
  return 'internal';
}

const state = {
  logs: [],
  hourly: [],
  totals: { client: 0, internal: 0, errors: 0 },
  endpoints: {},
  startTime: Date.now(),
};

function getHourKey() {
  return new Date().toISOString().slice(0, 13);
}

function createBucket(hourKey) {
  return {
    hour: hourKey,
    client: 0,
    internal: 0,
    errors: 0,
    errors_4xx: 0,
    errors_5xx: 0,
    durations: [], // raw durations for percentile calculation
    _total_ms: 0,
    _count: 0,
    db_ok: true, // health tracking
  };
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const i = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, i)];
}

function requestTracker(req, res, next) {
  if (req.path === '/favicon.ico') return next();

  const start = Date.now();
  const originalEnd = res.end;

  res.end = (...args) => {
    const duration = Date.now() - start;
    const source = classifyRequest(req.path);

    const entry = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      source,
      time: new Date().toISOString(),
    };

    state.logs.unshift(entry);
    if (state.logs.length > MAX_LOGS) state.logs.pop();

    state.totals[source]++;
    if (res.statusCode >= 400) state.totals.errors++;

    const key = `${req.method} ${req.route?.path || req.path}`;
    if (!state.endpoints[key]) state.endpoints[key] = { client: 0, internal: 0 };
    state.endpoints[key][source]++;

    const hourKey = getHourKey();
    let bucket = state.hourly.find((h) => h.hour === hourKey);
    if (!bucket) {
      bucket = createBucket(hourKey);
      state.hourly.push(bucket);
      if (state.hourly.length > MAX_HOURLY) state.hourly.shift();
    }
    bucket[source]++;
    bucket._count++;
    bucket._total_ms += duration;

    // Track durations for percentiles (cap at 500 per hour to limit memory)
    if (bucket.durations.length < 500) {
      bucket.durations.push(duration);
    }

    // Error breakdown
    if (res.statusCode >= 400 && res.statusCode < 500) bucket.errors_4xx++;
    if (res.statusCode >= 500) bucket.errors_5xx++;
    if (res.statusCode >= 400) bucket.errors++;

    // Health: mark degraded if any 5xx or very slow response
    if (res.statusCode >= 500 || duration > 5000) {
      bucket.db_ok = false;
    }

    originalEnd.apply(res, args);
  };

  next();
}

function getMetrics() {
  const topEndpoints = Object.entries(state.endpoints)
    .map(([endpoint, counts]) => ({
      endpoint,
      client: counts.client,
      internal: counts.internal,
      total: counts.client + counts.internal,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const hourly = state.hourly.map((h) => {
    const sorted = [...h.durations].sort((a, b) => a - b);
    const total = h.client + h.internal;
    return {
      hour: h.hour,
      client: h.client,
      internal: h.internal,
      total,
      errors: h.errors,
      errors_4xx: h.errors_4xx,
      errors_5xx: h.errors_5xx,
      avg_ms: h._count > 0 ? Math.round(h._total_ms / h._count) : 0,
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
    };
  });

  // Health timeline: one status per hour
  const health = state.hourly.map((h) => {
    const total = h.client + h.internal;
    const avgMs = h._count > 0 ? Math.round(h._total_ms / h._count) : 0;
    let status = 'ok';
    if (h.errors_5xx > 0 && total > 0 && h.errors_5xx / total > 0.5) status = 'down';
    else if (h.errors_5xx > 0 || avgMs > 3000) status = 'degraded';
    return { hour: h.hour, status, avg_ms: avgMs };
  });

  return {
    totals: {
      ...state.totals,
      total: state.totals.client + state.totals.internal,
      uptime: Date.now() - state.startTime,
    },
    hourly,
    health,
    top_endpoints: topEndpoints,
    recent_logs: state.logs.slice(0, 50),
  };
}

module.exports = { requestTracker, getMetrics };
