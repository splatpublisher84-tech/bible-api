import { Controller, Get, NotFoundException } from '@nestjs/common';

// Route gốc (ngoài prefix /api). /demo, /dashboard ở ViewsModule.
@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'Bible API is running!',
      version: '1.0.0',
      endpoints: { health: '/health' },
    };
  }

  @Get('health')
  health() {
    return { status: 'OK', timestamp: new Date() };
  }

  // Endpoint debug để test Sentry — INERT (trả 404) trừ khi bật env SENTRY_DEBUG=1.
  // Bật cờ → gọi /api/debug/sentry → ném lỗi 500 → AllExceptionsFilter báo lên Sentry.
  // An toàn để nằm luôn trong code (không có cờ thì như route không tồn tại).
  @Get('debug/sentry')
  debugSentry() {
    if (process.env.SENTRY_DEBUG !== '1') {
      throw new NotFoundException('Not found');
    }
    throw new Error('Sentry test error — cố ý để kiểm tra tích hợp Sentry');
  }
}
