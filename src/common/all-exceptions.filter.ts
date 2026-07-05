import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import type { FastifyReply } from 'fastify';
import { ZodValidationException } from 'nestjs-zod';
import type { ZodError } from 'zod';

// Giữ ĐÚNG format lỗi của bản Express cũ:
//  - ZodError  -> 400 { error: 'Validation error', details: [{ path, message }] }
//  - AppError  -> <status> { error: <message> }
//  - 404 route-miss -> { error: 'Not found' }
//  - còn lại   -> 500 { error: 'Internal server error' } (+ log)
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError() as ZodError;
      const details = zodError.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      return reply.status(400).send({ error: 'Validation error', details });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      let message = exception.message;
      // Nest báo route không khớp bằng "Cannot GET /x" -> chuẩn hoá về 'Not found' như cũ
      if (status === HttpStatus.NOT_FOUND && /^Cannot\s+\w+\s+/i.test(message)) {
        message = 'Not found';
      }
      return reply.status(status).send({ error: message });
    }

    // Chỉ báo lỗi 500 THẬT lên Sentry (no-op nếu chưa init) — không spam 4xx/validation.
    Sentry.captureException(exception);
    this.logger.error(
      exception instanceof Error ? (exception.stack ?? exception.message) : String(exception)
    );
    return reply.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: 'Internal server error' });
  }
}
