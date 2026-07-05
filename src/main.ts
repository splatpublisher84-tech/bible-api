import 'reflect-metadata';
import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // Prefix /api cho toàn bộ API; các route gốc (/, /health) được loại trừ.
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(new ZodValidationPipe()); // validate + coerce mọi DTO (Zod)
  app.useGlobalFilters(new AllExceptionsFilter()); // giữ đúng format lỗi cũ
  app.enableShutdownHooks(); // để pool đóng khi tắt (DatabaseModule.onModuleDestroy)

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
