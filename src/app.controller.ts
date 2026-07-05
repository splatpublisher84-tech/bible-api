import { Controller, Get } from '@nestjs/common';

// Route gốc (ngoài prefix /api). /demo, /dashboard thêm ở Phase 4.
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
}
