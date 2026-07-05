import { RequestMethod } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ZodValidationPipe } from 'nestjs-zod';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

// Cấu hình ảnh hưởng response, dùng chung cho production (main.ts) và test (e2e)
// để test phản ánh đúng hành vi thật.
export function configureApp(app: NestFastifyApplication) {
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
      { path: 'demo', method: RequestMethod.GET },
      { path: 'dashboard', method: RequestMethod.GET },
    ],
  });
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
}
