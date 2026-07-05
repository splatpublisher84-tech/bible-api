import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getMetrics, getSystemMetrics } from './metrics.store';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  get(@Query('key') key?: string) {
    const configured = this.config.get<string>('METRICS_KEY');
    if (configured && key !== configured) {
      throw new UnauthorizedException('Invalid or missing metrics key');
    }
    return { ...getMetrics(), system: getSystemMetrics() };
  }
}
