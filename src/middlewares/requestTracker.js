const MAX_LOGS = 100;
const MAX_HOURLY = 24;

const INTERNAL_PATHS = new Set([
  '/', '/health', '/dashboard', '/demo',
  '/api/status', '/api/metrics',
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

function requestTracker(req, res, next) {
  if (req.path === '/favicon.ico') return next();

  const start = Date.now();
  const originalEnd = res.end;

  res.end = function (...args) {
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

    const key = req.method + ' ' + (req.route?.path || req.path);
    if (!state.endpoints[key]) state.endpoints[key] = { client: 0, internal: 0 };
    state.endpoints[key][source]++;

    const hourKey = getHourKey();
    let bucket = state.hourly.find(h => h.hour === hourKey);
    if (!bucket) {
      bucket = { hour: hourKey, client: 0, internal: 0, errors: 0, avg_ms: 0, _total_ms: 0, _count: 0 };
      state.hourly.push(bucket);
      if (state.hourly.length > MAX_HOURLY) state.hourly.shift();
    }
    bucket[source]++;
    bucket._count++;
    if (res.statusCode >= 400) bucket.errors++;
    bucket._total_ms += duration;
    bucket.avg_ms = Math.round(bucket._total_ms / bucket._count);

    originalEnd.apply(res, args);
  };

  next();
}

function getMetrics() {
  const topEndpoints = Object.entries(state.endpoints)
    .map(([endpoint, counts]) => ({ endpoint, client: counts.client, internal: counts.internal, total: counts.client + counts.internal }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return {
    totals: { ...state.totals, total: state.totals.client + state.totals.internal, uptime: Date.now() - state.startTime },
    hourly: state.hourly.map(h => ({
      hour: h.hour,
      client: h.client,
      internal: h.internal,
      total: h.client + h.internal,
      errors: h.errors,
      avg_ms: h.avg_ms,
    })),
    top_endpoints: topEndpoints,
    recent_logs: state.logs.slice(0, 50),
  };
}

module.exports = { requestTracker, getMetrics };
