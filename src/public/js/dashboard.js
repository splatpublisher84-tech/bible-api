// --- Utility ---
function esc(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

// --- Config ---
const metricsKey = document.querySelector('meta[name="metrics-key"]')?.content;
const metricsUrl = `/api/metrics${metricsKey ? `?key=${encodeURIComponent(metricsKey)}` : ''}`;

// --- Chart.js dark theme defaults ---
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#334155';
Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;

// --- Chart instances ---
let trafficChart = null;
let responseTimeChart = null;
let errorRateChart = null;
let dbQueryChart = null;
let memoryChart = null;

// --- Navigation ---
const pages = ['overview', 'traffic', 'logs', 'costs', 'endpoints'];
const titles = {
  overview: 'Overview',
  traffic: 'Traffic',
  logs: 'Logs',
  costs: 'Costs & System',
  endpoints: 'API Reference',
};

function switchPage(page) {
  pages.forEach((p) => {
    document.getElementById(`page-${p}`).classList.toggle('active', p === page);
  });
  document.querySelectorAll('.nav-item[data-page]').forEach((item) => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  document.getElementById('pageTitle').textContent = titles[page] || page;
}

document.querySelectorAll('.nav-item[data-page]').forEach((item) => {
  item.addEventListener('click', () => switchPage(item.dataset.page));
});
document.getElementById('refreshBtn').addEventListener('click', loadAll);

// --- Traffic Chart (stacked bar) ---
function renderTrafficChart(hourly) {
  const ctx = document.getElementById('trafficCanvas');
  if (!ctx) return;
  if (!hourly || hourly.length === 0) return;

  const labels = hourly.map((h) => `${h.hour.slice(11)}h`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Client',
        data: hourly.map((h) => h.client),
        backgroundColor: '#3b82f6',
        borderRadius: 2,
      },
      {
        label: 'Internal',
        data: hourly.map((h) => h.internal),
        backgroundColor: '#475569',
        borderRadius: 2,
      },
      {
        label: 'Errors',
        data: hourly.map((h) => h.errors),
        backgroundColor: '#ef4444',
        borderRadius: 2,
      },
    ],
  };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 } },
    },
    plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false } },
  };

  if (trafficChart) {
    trafficChart.data = data;
    trafficChart.update();
  } else {
    trafficChart = new Chart(ctx, { type: 'bar', data, options: opts });
  }
}

// --- Response Time Chart (line p50/p95/p99) ---
function renderResponseTimeChart(hourly) {
  const ctx = document.getElementById('responseTimeCanvas');
  if (!ctx) return;
  if (!hourly || hourly.length === 0) return;

  const labels = hourly.map((h) => `${h.hour.slice(11)}h`);
  const data = {
    labels,
    datasets: [
      {
        label: 'p50',
        data: hourly.map((h) => h.p50 ?? 0),
        borderColor: '#22c55e',
        backgroundColor: '#22c55e22',
        tension: 0.3,
        pointRadius: 2,
        fill: false,
      },
      {
        label: 'p95',
        data: hourly.map((h) => h.p95 ?? 0),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b22',
        tension: 0.3,
        pointRadius: 2,
        fill: false,
      },
      {
        label: 'p99',
        data: hourly.map((h) => h.p99 ?? 0),
        borderColor: '#ef4444',
        backgroundColor: '#ef444422',
        tension: 0.3,
        pointRadius: 2,
        fill: false,
      },
    ],
  };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { callback: (v) => `${v}ms` } },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}ms` },
      },
    },
  };

  if (responseTimeChart) {
    responseTimeChart.data = data;
    responseTimeChart.update();
  } else {
    responseTimeChart = new Chart(ctx, { type: 'line', data, options: opts });
  }
}

// --- Error Rate Chart (line 4xx/5xx) ---
function renderErrorRateChart(hourly) {
  const ctx = document.getElementById('errorRateCanvas');
  if (!ctx) return;
  if (!hourly || hourly.length === 0) return;

  const labels = hourly.map((h) => `${h.hour.slice(11)}h`);
  const data = {
    labels,
    datasets: [
      {
        label: '4xx',
        data: hourly.map((h) => h.errors_4xx ?? 0),
        borderColor: '#fbbf24',
        backgroundColor: '#fbbf2422',
        tension: 0.3,
        pointRadius: 2,
        fill: true,
      },
      {
        label: '5xx',
        data: hourly.map((h) => h.errors_5xx ?? 0),
        borderColor: '#ef4444',
        backgroundColor: '#ef444433',
        tension: 0.3,
        pointRadius: 2,
        fill: true,
      },
    ],
  };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 1 } } },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false },
    },
  };

  if (errorRateChart) {
    errorRateChart.data = data;
    errorRateChart.update();
  } else {
    errorRateChart = new Chart(ctx, { type: 'line', data, options: opts });
  }
}

// --- DB Query Performance Chart ---
function renderDbQueryChart(dbHourly) {
  const ctx = document.getElementById('dbQueryCanvas');
  if (!ctx) return;
  if (!dbHourly || dbHourly.length === 0) return;

  const labels = dbHourly.map((h) => `${h.hour.slice(11)}h`);
  const data = {
    labels,
    datasets: [
      {
        label: 'Avg',
        data: dbHourly.map((h) => h.avg_ms),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f622',
        tension: 0.3,
        pointRadius: 2,
        fill: false,
      },
      {
        label: 'p95',
        data: dbHourly.map((h) => h.p95),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b22',
        tension: 0.3,
        pointRadius: 2,
        fill: false,
      },
      {
        label: 'p99',
        data: dbHourly.map((h) => h.p99),
        borderColor: '#ef4444',
        backgroundColor: '#ef444422',
        tension: 0.3,
        pointRadius: 2,
        fill: false,
      },
    ],
  };
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { callback: (v) => `${v}ms` } },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) =>
            ctx.dataset.label +
            ': ' +
            ctx.parsed.y +
            'ms (' +
            (dbHourly[ctx.dataIndex]?.queries ?? 0) +
            ' queries)',
        },
      },
    },
  };

  if (dbQueryChart) {
    dbQueryChart.data = data;
    dbQueryChart.update();
  } else {
    dbQueryChart = new Chart(ctx, { type: 'line', data, options: opts });
  }
}

// --- Memory Usage Chart ---
function renderMemoryChart(memory) {
  const ctx = document.getElementById('memoryCanvas');
  if (!ctx) return;
  if (!memory || memory.length === 0) return;

  const labels = memory.map((m) => {
    const d = new Date(m.time);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });
  const data = {
    labels,
    datasets: [
      {
        label: 'Heap Used',
        data: memory.map((m) => m.heapUsed),
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf633',
        tension: 0.3,
        pointRadius: 0,
        fill: true,
      },
      {
        label: 'RSS',
        data: memory.map((m) => m.rss),
        borderColor: '#64748b',
        backgroundColor: '#64748b22',
        tension: 0.3,
        pointRadius: 0,
        fill: true,
        borderDash: [4, 2],
      },
    ],
  };

  // 256MB line for Fly.io limit
  const maxMem = Math.max(...memory.map((m) => m.rss), 256);
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
      y: {
        beginAtZero: true,
        max: Math.min(maxMem + 20, 300),
        ticks: { callback: (v) => `${v}MB` },
      },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}MB` },
      },
      annotation: undefined, // no annotation plugin, use a simple line dataset instead
    },
  };

  // Add 256MB limit line as a dataset
  if (data.datasets.length < 3) {
    data.datasets.push({
      label: 'Limit (256MB)',
      data: memory.map(() => 256),
      borderColor: '#ef4444',
      borderDash: [6, 3],
      pointRadius: 0,
      fill: false,
      borderWidth: 1,
    });
  }

  if (memoryChart) {
    memoryChart.data = data;
    memoryChart.update();
  } else {
    memoryChart = new Chart(ctx, { type: 'line', data, options: opts });
  }
}

// --- Health Timeline ---
function renderHealthTimeline(health) {
  const container = document.getElementById('healthTimeline');
  if (!container || !health || health.length === 0) {
    if (container) container.innerHTML = '<div class="chart-empty">No data yet</div>';
    return;
  }

  const slots = health
    .map((h) => {
      const cls =
        h.status === 'ok'
          ? 'health-ok'
          : h.status === 'degraded'
            ? 'health-degraded'
            : h.status === 'down'
              ? 'health-down'
              : 'health-unknown';
      const title = `${h.hour.slice(11)}h — ${h.status.toUpperCase()}${h.avg_ms ? ` (${h.avg_ms}ms)` : ''}`;
      return `<div class="health-slot ${cls}" title="${esc(title)}"></div>`;
    })
    .join('');

  const first = `${health[0].hour.slice(11)}h`;
  const last = `${health[health.length - 1].hour.slice(11)}h`;

  container.innerHTML =
    '<div class="health-timeline">' +
    slots +
    '</div>' +
    '<div class="health-labels"><span>' +
    esc(first) +
    '</span><span>' +
    esc(last) +
    '</span></div>';
}

// --- Top Endpoints ---
function renderTopEndpoints(containerId, endpoints, simple) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!endpoints || endpoints.length === 0) {
    el.innerHTML = '<div class="chart-empty">No data yet</div>';
    return;
  }
  if (simple) {
    el.innerHTML = endpoints
      .map((e) => {
        const maxTotal = endpoints[0].total;
        const clientW = maxTotal > 0 ? (e.client / maxTotal) * 100 : 0;
        const internalW = maxTotal > 0 ? (e.internal / maxTotal) * 100 : 0;
        return (
          '<div style="padding:6px 0;border-bottom:1px solid #1e293b;">' +
          '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">' +
          '<span class="ep-name">' +
          esc(e.endpoint) +
          '</span>' +
          '<span style="font-size:12px;font-weight:600;">' +
          e.total +
          '</span>' +
          '</div>' +
          '<div class="ep-bar">' +
          '<div class="ep-bar-client" style="width:' +
          clientW +
          '%"></div>' +
          '<div class="ep-bar-internal" style="width:' +
          internalW +
          '%"></div>' +
          '</div></div>'
        );
      })
      .join('');
    return;
  }
  const tbody = endpoints
    .map((e) => {
      const maxTotal = endpoints[0].total;
      const clientW = maxTotal > 0 ? (e.client / maxTotal) * 100 : 0;
      const internalW = maxTotal > 0 ? (e.internal / maxTotal) * 100 : 0;
      return (
        '<tr><td class="ep-name">' +
        esc(e.endpoint) +
        '</td>' +
        '<td style="color:#3b82f6">' +
        e.client +
        '</td>' +
        '<td style="color:#64748b">' +
        e.internal +
        '</td>' +
        '<td style="font-weight:600">' +
        e.total +
        '</td>' +
        '<td><div class="ep-bar"><div class="ep-bar-client" style="width:' +
        clientW +
        '%"></div><div class="ep-bar-internal" style="width:' +
        internalW +
        '%"></div></div></td></tr>'
      );
    })
    .join('');
  el.querySelector('tbody').innerHTML = tbody;
}

// --- Load Status ---
async function loadStatus() {
  try {
    const res = await fetch('/api/status');
    const d = await res.json();

    document.getElementById('apiStatus').textContent = d.api.status.toUpperCase();
    document.getElementById('apiDot').className =
      `status-dot ${d.api.status === 'ok' ? 'status-ok' : 'status-error'}`;
    document.getElementById('apiUptime').textContent = `Uptime: ${d.api.uptime}`;
    document.getElementById('uptimeCard').textContent = d.api.uptime;

    document.getElementById('dbStatus').textContent = d.database.status.toUpperCase();
    document.getElementById('dbDot').className =
      `status-dot ${d.database.status === 'ok' ? 'status-ok' : 'status-error'}`;
    document.getElementById('dbLatency').textContent = d.database.latency
      ? `Latency: ${d.database.latency}`
      : d.database.message || '';

    document.getElementById('translations').textContent = d.data.translations ?? '-';
    document.getElementById('verses').textContent = d.data.verses?.toLocaleString() ?? '-';
    document.getElementById('books').textContent = d.data.books ? `${d.data.books} books` : '';

    document.getElementById('memory').textContent = d.system.memory_used;
    document.getElementById('nodeVersion').textContent = d.system.node_version;
    document.getElementById('env').textContent = d.system.env;

    if (d.costs) {
      const s = d.costs.supabase;
      const f = d.costs.flyio;

      document.getElementById('dbSize').textContent = s.db_size;
      document.getElementById('dbLimit').textContent =
        `${s.db_usage_percent}% of ${s.db_limit} free tier`;
      document.getElementById('dbProgress').style.width = `${s.db_usage_percent}%`;
      document.getElementById('dbProgress').className =
        'progress-fill ' +
        (s.db_usage_percent >= 80
          ? 'progress-danger'
          : s.db_usage_percent >= 50
            ? 'progress-warn'
            : 'progress-ok');
      document.getElementById('supabaseTier').textContent = s.tier;

      document.getElementById('dbSizeOverview').textContent = s.db_size;
      document.getElementById('dbLimitOverview').textContent =
        `${s.db_usage_percent}% of ${s.db_limit}`;
      document.getElementById('dbProgressOverview').style.width = `${s.db_usage_percent}%`;
      document.getElementById('dbProgressOverview').className =
        'progress-fill ' +
        (s.db_usage_percent >= 80
          ? 'progress-danger'
          : s.db_usage_percent >= 50
            ? 'progress-warn'
            : 'progress-ok');

      document.getElementById('flyEstimate').textContent = f.estimate;
      document.getElementById('flyVm').textContent = f.vm;
      document.getElementById('flyAutoStop').textContent = f.auto_stop ? 'ON' : 'OFF';
      document.getElementById('flyMinMachines').textContent = f.min_machines;
      document.getElementById('flyTier').textContent = f.tier;

      if (s.warning) {
        document.getElementById('warningBanner').style.display = 'block';
        document.getElementById('warningTitle').textContent = 'Cost Warning';
        document.getElementById('warningText').textContent = s.warning;
      } else {
        document.getElementById('warningBanner').style.display = 'none';
      }
    }

    document.getElementById('lastUpdate').textContent =
      `Updated: ${new Date(d.timestamp).toLocaleTimeString()}`;
  } catch (_e) {
    document.getElementById('apiStatus').textContent = 'ERROR';
    document.getElementById('apiDot').className = 'status-dot status-error';
    document.getElementById('lastUpdate').textContent = 'Failed to load';
  }
}

// --- Load Metrics ---
async function loadMetrics() {
  try {
    const res = await fetch(metricsUrl);
    const m = await res.json();

    // Overview cards
    document.getElementById('clientRequests').textContent = m.totals.client.toLocaleString();
    document.getElementById('clientRequestsDetail').textContent =
      `${m.totals.total.toLocaleString()} total (${m.totals.internal} internal)`;
    document.getElementById('totalErrors').textContent = m.totals.errors;

    // Traffic cards
    document.getElementById('trafficTotal').textContent = m.totals.total.toLocaleString();
    document.getElementById('trafficClient').textContent = m.totals.client.toLocaleString();
    document.getElementById('trafficInternal').textContent = m.totals.internal.toLocaleString();
    document.getElementById('trafficErrors').textContent = m.totals.errors;

    // Charts
    renderTrafficChart(m.hourly);
    renderResponseTimeChart(m.hourly);
    renderErrorRateChart(m.hourly);
    renderHealthTimeline(m.health);

    // System metrics (Phase 2)
    if (m.system) {
      renderDbQueryChart(m.system.db_hourly);
      renderMemoryChart(m.system.memory);
    }

    // Top endpoints
    renderTopEndpoints('overviewTopEndpoints', m.top_endpoints, true);
    renderTopEndpoints('trafficEndpoints', m.top_endpoints, false);

    // Logs
    if (m.recent_logs && m.recent_logs.length > 0) {
      document.getElementById('logBody').innerHTML = m.recent_logs
        .map((l) => {
          const time = new Date(l.time).toLocaleTimeString();
          const statusCls =
            l.status < 300
              ? 'log-2xx'
              : l.status < 400
                ? 'log-3xx'
                : l.status < 500
                  ? 'log-4xx'
                  : 'log-5xx';
          const sourceCls = l.source === 'client' ? 'source-client' : 'source-internal';
          const sourceLabel = l.source === 'client' ? 'CLIENT' : 'INTERNAL';
          return (
            '<tr><td>' +
            esc(time) +
            '</td>' +
            '<td><span class="source-badge ' +
            sourceCls +
            '">' +
            sourceLabel +
            '</span></td>' +
            '<td>' +
            esc(l.method) +
            '</td><td>' +
            esc(l.path) +
            '</td>' +
            '<td><span class="log-status ' +
            statusCls +
            '">' +
            l.status +
            '</span></td>' +
            '<td>' +
            l.duration +
            'ms</td></tr>'
          );
        })
        .join('');
    }
  } catch (_e) {
    /* ignore */
  }
}

// --- Main ---
function loadAll() {
  loadStatus();
  loadMetrics();
}

loadAll();
setInterval(loadAll, 30000);
