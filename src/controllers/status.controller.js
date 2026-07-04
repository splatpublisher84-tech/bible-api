const pool = require('../config/database');

const startTime = Date.now();

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

async function getStatus(req, res) {
  const status = {
    api: { status: 'ok', uptime: formatUptime(Date.now() - startTime) },
    database: { status: 'unknown' },
    data: {},
    system: {
      memory_used: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      node_version: process.version,
      env: process.env.NODE_ENV || 'development',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const dbStart = Date.now();
    await pool.query('SELECT 1');
    const dbLatency = Date.now() - dbStart;
    status.database = { status: 'ok', latency: `${dbLatency}ms` };

    const [translations, verses, books, dbSize] = await Promise.all([
      pool.query('SELECT count(*)::int AS count FROM translations'),
      pool.query('SELECT count(*)::int AS count FROM verses'),
      pool.query('SELECT count(*)::int AS count FROM books'),
      pool.query('SELECT pg_database_size(current_database()) AS bytes'),
    ]);

    const dbBytes = Number(dbSize.rows[0].bytes);
    const dbMB = Math.round(dbBytes / 1024 / 1024);
    const supabaseLimitMB = 500;
    const dbUsagePercent = Math.round((dbMB / supabaseLimitMB) * 100);

    status.data = {
      translations: translations.rows[0].count,
      books: books.rows[0].count,
      verses: verses.rows[0].count,
    };

    status.costs = {
      supabase: {
        db_size: `${dbMB}MB`,
        db_limit: `${supabaseLimitMB}MB`,
        db_usage_percent: dbUsagePercent,
        tier: 'Free',
        warning:
          dbUsagePercent >= 80
            ? `Database usage at ${dbUsagePercent}% — consider upgrading or cleaning up`
            : null,
      },
      flyio: {
        vm: 'shared-cpu-1x, 256MB',
        auto_stop: true,
        min_machines: 0,
        tier: 'Free allowance',
        estimate: '$0-2/month',
      },
    };
  } catch (err) {
    status.database = { status: 'error', message: err.message };
  }

  res.json(status);
}

module.exports = { getStatus };
