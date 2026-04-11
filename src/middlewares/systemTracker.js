const MAX_HOURLY = 24;
const MEMORY_INTERVAL = 60_000; // sample every 60s

const state = {
  hourly: [],       // { hour, queries, durations[], errors }
  memory: [],       // { time, heapUsed, heapTotal, rss }
};

function getHourKey() {
  return new Date().toISOString().slice(0, 13);
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const i = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, i)];
}

// --- DB Query Tracking ---

function getBucket() {
  const hourKey = getHourKey();
  let bucket = state.hourly.find(h => h.hour === hourKey);
  if (!bucket) {
    bucket = { hour: hourKey, queries: 0, errors: 0, durations: [] };
    state.hourly.push(bucket);
    if (state.hourly.length > MAX_HOURLY) state.hourly.shift();
  }
  return bucket;
}

function trackQuery(durationMs, error) {
  const bucket = getBucket();
  bucket.queries++;
  if (error) bucket.errors++;
  if (bucket.durations.length < 500) {
    bucket.durations.push(durationMs);
  }
}

// --- Memory Tracking ---

function sampleMemory() {
  const mem = process.memoryUsage();
  const entry = {
    time: new Date().toISOString(),
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024),   // MB
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
    rss: Math.round(mem.rss / 1024 / 1024),
  };
  state.memory.push(entry);
  // Keep last 24h of samples (1 per minute = 1440 max)
  if (state.memory.length > 1440) state.memory.shift();
}

// Start sampling
sampleMemory();
setInterval(sampleMemory, MEMORY_INTERVAL);

// --- Export Metrics ---

function getSystemMetrics() {
  const dbHourly = state.hourly.map(h => {
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

  // Downsample memory: pick 1 per 5 minutes for the response
  const memSampled = [];
  for (let i = 0; i < state.memory.length; i += 5) {
    memSampled.push(state.memory[i]);
  }
  // Always include the latest
  if (state.memory.length > 0 && memSampled[memSampled.length - 1] !== state.memory[state.memory.length - 1]) {
    memSampled.push(state.memory[state.memory.length - 1]);
  }

  return {
    db_hourly: dbHourly,
    memory: memSampled,
  };
}

module.exports = { trackQuery, getSystemMetrics };
