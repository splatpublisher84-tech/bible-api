// In-memory metrics — port nguyên requestTracker + systemTracker cũ (giữ đúng shape /api/metrics
// cho dashboard). Cải tiến: timer dùng unref() để không giữ process sống (fix leak + graceful shutdown).

const MAX_LOGS = 100;
const MAX_HOURLY = 24;
const MEMORY_INTERVAL = 60_000;

const INTERNAL_PATHS = new Set([
  '/',
  '/health',
  '/dashboard',
  '/demo',
  '/api/status',
  '/api/metrics',
]);

export function classifyRequest(path: string): 'client' | 'internal' {
  if (INTERNAL_PATHS.has(path)) return 'internal';
  if (path.startsWith('/api-docs')) return 'internal';
  if (path.startsWith('/api/')) return 'client';
  return 'internal';
}

function getHourKey(): string {
  return new Date().toISOString().slice(0, 13);
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const i = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, i)];
}

// ---------------- Request metrics ----------------

interface LogEntry {
  method: string;
  path: string;
  status: number;
  duration: number;
  source: 'client' | 'internal';
  time: string;
}
interface ReqBucket {
  hour: string;
  client: number;
  internal: number;
  errors: number;
  errors_4xx: number;
  errors_5xx: number;
  durations: number[];
  _total_ms: number;
  _count: number;
  db_ok: boolean;
}

const reqState = {
  logs: [] as LogEntry[],
  hourly: [] as ReqBucket[],
  totals: { client: 0, internal: 0, errors: 0 } as Record<string, number>,
  endpoints: {} as Record<string, { client: number; internal: number }>,
  startTime: Date.now(),
};

function createBucket(hourKey: string): ReqBucket {
  return {
    hour: hourKey,
    client: 0,
    internal: 0,
    errors: 0,
    errors_4xx: 0,
    errors_5xx: 0,
    durations: [],
    _total_ms: 0,
    _count: 0,
    db_ok: true,
  };
}

export function recordRequest(entry: {
  method: string;
  path: string;
  status: number;
  duration: number;
  routeKey: string;
}) {
  const source = classifyRequest(entry.path);

  reqState.logs.unshift({
    method: entry.method,
    path: entry.path,
    status: entry.status,
    duration: entry.duration,
    source,
    time: new Date().toISOString(),
  });
  if (reqState.logs.length > MAX_LOGS) reqState.logs.pop();

  reqState.totals[source]++;
  if (entry.status >= 400) reqState.totals.errors++;

  const key = `${entry.method} ${entry.routeKey}`;
  if (!reqState.endpoints[key]) reqState.endpoints[key] = { client: 0, internal: 0 };
  reqState.endpoints[key][source]++;

  const hourKey = getHourKey();
  let bucket = reqState.hourly.find((h) => h.hour === hourKey);
  if (!bucket) {
    bucket = createBucket(hourKey);
    reqState.hourly.push(bucket);
    if (reqState.hourly.length > MAX_HOURLY) reqState.hourly.shift();
  }
  bucket[source]++;
  bucket._count++;
  bucket._total_ms += entry.duration;
  if (bucket.durations.length < 500) bucket.durations.push(entry.duration);
  if (entry.status >= 400 && entry.status < 500) bucket.errors_4xx++;
  if (entry.status >= 500) bucket.errors_5xx++;
  if (entry.status >= 400) bucket.errors++;
  if (entry.status >= 500 || entry.duration > 5000) bucket.db_ok = false;
}

export function getMetrics() {
  const topEndpoints = Object.entries(reqState.endpoints)
    .map(([endpoint, counts]) => ({
      endpoint,
      client: counts.client,
      internal: counts.internal,
      total: counts.client + counts.internal,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const hourly = reqState.hourly.map((h) => {
    const sorted = [...h.durations].sort((a, b) => a - b);
    return {
      hour: h.hour,
      client: h.client,
      internal: h.internal,
      total: h.client + h.internal,
      errors: h.errors,
      errors_4xx: h.errors_4xx,
      errors_5xx: h.errors_5xx,
      avg_ms: h._count > 0 ? Math.round(h._total_ms / h._count) : 0,
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
    };
  });

  const health = reqState.hourly.map((h) => {
    const total = h.client + h.internal;
    const avgMs = h._count > 0 ? Math.round(h._total_ms / h._count) : 0;
    let status = 'ok';
    if (h.errors_5xx > 0 && total > 0 && h.errors_5xx / total > 0.5) status = 'down';
    else if (h.errors_5xx > 0 || avgMs > 3000) status = 'degraded';
    return { hour: h.hour, status, avg_ms: avgMs };
  });

  return {
    totals: {
      ...reqState.totals,
      total: reqState.totals.client + reqState.totals.internal,
      uptime: Date.now() - reqState.startTime,
    },
    hourly,
    health,
    top_endpoints: topEndpoints,
    recent_logs: reqState.logs.slice(0, 50),
  };
}

// ---------------- System metrics (DB + memory) ----------------

interface DbBucket {
  hour: string;
  queries: number;
  errors: number;
  durations: number[];
}
interface MemSample {
  time: string;
  heapUsed: number;
  heapTotal: number;
  rss: number;
}

const sysState = {
  hourly: [] as DbBucket[],
  memory: [] as MemSample[],
};

function getDbBucket(): DbBucket {
  const hourKey = getHourKey();
  let bucket = sysState.hourly.find((h) => h.hour === hourKey);
  if (!bucket) {
    bucket = { hour: hourKey, queries: 0, errors: 0, durations: [] };
    sysState.hourly.push(bucket);
    if (sysState.hourly.length > MAX_HOURLY) sysState.hourly.shift();
  }
  return bucket;
}

export function trackQuery(durationMs: number, error: boolean) {
  const bucket = getDbBucket();
  bucket.queries++;
  if (error) bucket.errors++;
  if (bucket.durations.length < 500) bucket.durations.push(durationMs);
}

function sampleMemory() {
  const mem = process.memoryUsage();
  sysState.memory.push({
    time: new Date().toISOString(),
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
    rss: Math.round(mem.rss / 1024 / 1024),
  });
  if (sysState.memory.length > 1440) sysState.memory.shift();
}

let memTimer: NodeJS.Timeout | undefined;

export function startMemorySampling() {
  sampleMemory();
  memTimer = setInterval(sampleMemory, MEMORY_INTERVAL);
  memTimer.unref?.(); // không giữ process sống (fix leak so với bản cũ)
}

export function stopMemorySampling() {
  if (memTimer) clearInterval(memTimer);
  memTimer = undefined;
}

export function getSystemMetrics() {
  const dbHourly = sysState.hourly.map((h) => {
    const sorted = [...h.durations].sort((a, b) => a - b);
    return {
      hour: h.hour,
      queries: h.queries,
      errors: h.errors,
      avg_ms: sorted.length > 0 ? Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length) : 0,
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
    };
  });

  const memSampled: MemSample[] = [];
  for (let i = 0; i < sysState.memory.length; i += 5) {
    memSampled.push(sysState.memory[i]);
  }
  if (
    sysState.memory.length > 0 &&
    memSampled[memSampled.length - 1] !== sysState.memory[sysState.memory.length - 1]
  ) {
    memSampled.push(sysState.memory[sysState.memory.length - 1]);
  }

  return { db_hourly: dbHourly, memory: memSampled };
}
