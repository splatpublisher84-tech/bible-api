import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { type Observable, of, tap } from 'rxjs';
import { CACHE_CONTROL_KEY } from './cache-control.decorator';

// 1) Set header Cache-Control (kể cả trên response lỗi — set trước khi handler chạy, giống cũ).
// 2) Memoize server-side theo URL (L1 in-memory / Keyv) — chỉ cache response thành công.
@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const seconds = this.reflector.getAllAndOverride<number | undefined>(CACHE_CONTROL_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (seconds == null) return next.handle();

    const http = ctx.switchToHttp();
    const req = http.getRequest<FastifyRequest>();
    const reply = http.getResponse<FastifyReply>();
    reply.header('Cache-Control', `public, max-age=${seconds}`);

    // Scope key theo ngày UTC: response phụ thuộc thời gian (vd /votd mặc định "today")
    // tự hết hạn qua nửa đêm UTC thay vì kẹt cả TTL 24h -> giữ đúng parity với bản cũ.
    const utcDay = new Date().toISOString().slice(0, 10);
    const key = `http:${utcDay}:${req.url}`;
    const cached = await this.cache.get(key);
    if (cached !== undefined && cached !== null) return of(cached);

    return next.handle().pipe(
      tap((body) => {
        void this.cache.set(key, body, seconds * 1000);
      })
    );
  }
}
