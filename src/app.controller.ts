import { Controller, Get } from '@nestjs/common';

// Controller tạm để smoke-test Phase 1. Health/root thật sẽ làm ở Phase 3.
@Controller()
export class AppController {
  @Get('_ping')
  ping() {
    return { status: 'ok', framework: 'nestjs+fastify' };
  }
}
