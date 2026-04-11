const MAX_LOGS = 50;
const MAX_HOURLY = 24;

const state = {
  logs: [],           // recent requests (ring buffer)
  hourly: [],         // requests per hour (last 24h)
  totals: { requests: 0, errors: 0 },
  endpoints: {},      // count per endpoint
  startTime: Date.now(),
};

// Initialize hourly buckets
function getHourKey() {
  const d = new Date();
  return d.toISOString().slice(0, 13); // "2026-04-11T13"
}

function requestTracker(req, res, next) {
  // Skip static assets and health checks
  if (req.path.startsWith('/api-docs') || req.path === '/favicon.ico') {
    return next();
  }

  const start = Date.now();

  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    const entry = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      time: new Date().toISOString(),
    };

    // Recent logs
    state.logs.unshift(entry);
    if (state.logs.length > MAX_LOGS) state.logs.pop();

    // Totals
    state.totals.requests++;
    if (res.statusCode >= 400) state.totals.errors++;

    // Per-endpoint count
    const key = req.method + ' ' + req.route?.path || req.path;
    state.endpoints[key] = (state.endpoints[key] || 0) + 1;

    // Hourly aggregation
    const hourKey = getHourKey();
    let hourBucket = state.hourly.find(h => h.hour === hourKey);
    if (!hourBucket) {
      hourBucket = { hour: hourKey, count: 0, errors: 0, avg_ms: 0, _total_ms: 0 };
      state.hourly.push(hourBucket);
      if (state.hourly.length > MAX_HOURLY) state.hourly.shift();
    }
    hourBucket.count++;
    if (res.statusCode >= 400) hourBucket.errors++;
    hourBucket._total_ms += duration;
    hourBucket.avg_ms = Math.round(hourBucket._total_ms / hourBucket.count);

    originalEnd.apply(res, args);
  };

  next();
}

function getMetrics() {
  const topEndpoints = Object.entries(state.endpoints)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([endpoint, count]) => ({ endpoint, count }));

  return {
    totals: { ...state.totals, uptime: Date.now() - state.startTime },
    hourly: state.hourly.map(h => ({
      hour: h.hour,
      count: h.count,
      errors: h.errors,
      avg_ms: h.avg_ms,
    })),
    top_endpoints: topEndpoints,
    recent_logs: state.logs.slice(0, 30),
  };
}

module.exports = { requestTracker, getMetrics };
