import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { CacheControlInterceptor } from './common/cache-control.interceptor';
import { clientIpTracker } from './common/client-ip';
import { DatabaseModule } from './database/database.module';
import { MetricsModule } from './metrics/metrics.module';
import { BooksModule } from './modules/books/books.module';
import { StatusModule } from './modules/status/status.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { VersesModule } from './modules/verses/verses.module';
import { VotdModule } from './modules/votd/votd.module';
import { ViewsModule } from './views/views.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    // Rate limit: 500 req / 15 phút / IP (khớp express-rate-limit cũ)
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 15 * 60 * 1000, limit: 500 }],
      errorMessage: 'Too many requests, please try again later.',
      // Đếm theo IP client THẬT (Fly-Client-IP), không phải IP proxy Fly dùng chung. Xem common/client-ip.ts.
      getTracker: clientIpTracker,
    }),
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    TranslationsModule,
    BooksModule,
    VersesModule,
    VotdModule,
    StatusModule,
    MetricsModule,
    ViewsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CacheControlInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
