import './tracing'; // PHẢI đầu tiên — init OpenTelemetry trước mọi import khác
import 'reflect-metadata';
import { join } from 'node:path';
import helmet from '@fastify/helmet';
import { FastifyOtelInstrumentation } from '@fastify/otel';
import fastifyStatic from '@fastify/static';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { recordRequest } from './metrics/metrics.store';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  // OTel: instrumentation route-level cho Fastify (auto-instrumentations-node đã bỏ fastify từ 2026).
  // http + pg spans do NodeSDK trong tracing.ts lo; cái này thêm span theo route.
  if (process.env.OTEL_ENABLED === 'true' || process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    const otel = new FastifyOtelInstrumentation({ recordExceptions: true });
    await app.register(otel.plugin());
  }

  // Security headers. CSP nới cho swagger-ui; /demo & /dashboard tự set CSP riêng chặt hơn.
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Static assets -> dist/public (dashboard css/js)
  await app.register(fastifyStatic, {
    root: join(__dirname, 'public'),
    prefix: '/static/',
    decorateReply: false,
  });

  configureApp(app);

  // CORS GET-only (khớp bản cũ): origin từ ALLOWED_ORIGINS hoặc '*'
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET'],
  });

  app.enableShutdownHooks();

  // Metrics: ghi nhận mỗi response (status + duration cuối) qua Fastify onResponse hook
  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook('onResponse', (request, reply, done) => {
    const path = (request.url || '').split('?')[0];
    if (path !== '/favicon.ico') {
      recordRequest({
        method: request.method,
        path,
        status: reply.statusCode,
        duration: Math.round(reply.elapsedTime ?? 0),
        routeKey: request.routeOptions?.url ?? path,
      });
    }
    done();
  });

  // Swagger UI tại /api-docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Bible API')
    .setDescription('REST API dữ liệu Kinh Thánh (song ngữ Anh/Việt)')
    .setVersion('1.0.0')
    .build();
  SwaggerModule.setup('api-docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
