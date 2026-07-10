import { Controller, Get, NotFoundException, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { clientIpTracker } from './common/client-ip';

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

  // Debug: xem Fly xử lý header Fly-Client-IP thế nào (verify chống-spoof cho rate-limit).
  // INERT (404) trừ khi bật IP_DEBUG=1. Dùng lại được khi thêm Cloudflare (TASK-2).
  @Get('debug/ip')
  debugIp(@Req() req: FastifyRequest) {
    if (process.env.IP_DEBUG !== '1') {
      throw new NotFoundException('Not found');
    }
    return {
      flyClientIp: req.headers['fly-client-ip'] ?? null,
      xForwardedFor: req.headers['x-forwarded-for'] ?? null,
      reqIp: req.ip,
      rateLimitTracker: clientIpTracker(req, {} as never),
    };
  }
}
