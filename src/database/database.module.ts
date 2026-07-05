import { Global, Inject, Logger, Module, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { trackQuery } from '../metrics/metrics.store';
import { DRIZZLE } from './drizzle.provider';
import { schema } from './schema';

const POOL = Symbol('PG_POOL');

@Global()
@Module({
  providers: [
    {
      provide: POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          host: config.get<string>('DB_HOST'),
          port: Number(config.get('DB_PORT') ?? 5432),
          user: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          statement_timeout: 10_000,
          // Supabase direct connection: self-signed cert (vẫn mã hoá TLS)
          ...(config.get('NODE_ENV') === 'production'
            ? { ssl: { rejectUnauthorized: false } }
            : {}),
        });
        // Cải tiến so với bản cũ: KHÔNG process.exit(-1) khi idle error — chỉ log,
        // để pool tự phục hồi (bản Express cũ tự kill process, dễ gây downtime).
        pool.on('error', (err) => {
          new Logger('PgPool').error(`Unexpected idle client error: ${err.message}`);
        });

        // Đo thời gian MỌI query (drizzle đi qua pool.query) -> feed metrics (như bản cũ)
        const originalQuery = pool.query.bind(pool);
        pool.query = ((...args: unknown[]) => {
          const start = Date.now();
          return (originalQuery as (...a: unknown[]) => Promise<unknown>)(...args).then(
            (res) => {
              trackQuery(Date.now() - start, false);
              return res;
            },
            (err) => {
              trackQuery(Date.now() - start, true);
              throw err;
            }
          );
        }) as typeof pool.query;

        return pool;
      },
    },
    {
      provide: DRIZZLE,
      inject: [POOL],
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(POOL) private readonly pool: Pool) {}

  // Đóng pool khi app tắt (graceful shutdown — bật shutdown hooks ở main.ts)
  async onModuleDestroy() {
    await this.pool.end();
  }
}
