import * as Sentry from '@sentry/nestjs';

// Sentry — PHẢI init trước mọi import khác (auto-instrument http/pg/fastify).
// Import ĐẦU TIÊN trong main.ts. Env-gated: chỉ bật khi có SENTRY_DSN
// (dev/local không cần; free tier 5k lỗi/tháng).
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    // Lấy mẫu trace thấp để nằm trong free tier (10k performance units/tháng)
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
    sendDefaultPii: false,
  });
}
