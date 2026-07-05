import {
  Injectable,
  Module,
  type OnApplicationBootstrap,
  type OnModuleDestroy,
} from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { startMemorySampling, stopMemorySampling } from './metrics.store';

// Bật/tắt memory sampler theo vòng đời app (thay cho setInterval treo lúc import ở bản cũ).
@Injectable()
export class MetricsLifecycle implements OnApplicationBootstrap, OnModuleDestroy {
  onApplicationBootstrap() {
    startMemorySampling();
  }
  onModuleDestroy() {
    stopMemorySampling();
  }
}

@Module({
  controllers: [MetricsController],
  providers: [MetricsLifecycle],
})
export class MetricsModule {}
