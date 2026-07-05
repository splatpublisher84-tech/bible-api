import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../../database/drizzle.provider';

// startTime bắt lúc load module (khớp bản cũ — reset khi restart process)
const startTime = Date.now();

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

@Injectable()
export class StatusService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  // KHÔNG BAO GIỜ throw — lỗi DB trả trong body với status 200 (giữ đúng hành vi cũ).
  async getStatus() {
    const status: Record<string, unknown> = {
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
      await this.db.execute(sql`SELECT 1`);
      const dbLatency = Date.now() - dbStart;
      status.database = { status: 'ok', latency: `${dbLatency}ms` };

      const [translationsRes, versesRes, booksRes, dbSizeRes] = await Promise.all([
        this.db.execute(sql`SELECT count(*)::int AS count FROM translations`),
        this.db.execute(sql`SELECT count(*)::int AS count FROM verses`),
        this.db.execute(sql`SELECT count(*)::int AS count FROM books`),
        this.db.execute(sql`SELECT pg_database_size(current_database()) AS bytes`),
      ]);

      const dbBytes = Number(dbSizeRes.rows[0].bytes);
      const dbMB = Math.round(dbBytes / 1024 / 1024);
      const supabaseLimitMB = 500;
      const dbUsagePercent = Math.round((dbMB / supabaseLimitMB) * 100);

      status.data = {
        translations: translationsRes.rows[0].count,
        books: booksRes.rows[0].count,
        verses: versesRes.rows[0].count,
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
      status.database = { status: 'error', message: (err as Error).message };
    }

    return status;
  }
}
