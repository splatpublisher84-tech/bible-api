// OpenTelemetry — PHẢI init trước khi Nest/app import module khác (để auto-instrumentation vá kịp).
// Vì vậy file này được import ĐẦU TIÊN trong main.ts.
// Env-gated: chỉ bật khi OTEL_ENABLED=true hoặc có OTEL_EXPORTER_OTLP_ENDPOINT
// (dev không cần collector; production trỏ OTLP endpoint là có traces + DB spans ngay).
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeSDK } from '@opentelemetry/sdk-node';

const enabled =
  process.env.OTEL_ENABLED === 'true' || Boolean(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);

if (enabled) {
  const sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME ?? 'bible-api',
    traceExporter: new OTLPTraceExporter(),
    instrumentations: [
      getNodeAutoInstrumentations({
        // fs quá ồn; http + pg (DB spans) là phần giá trị nhất
        '@opentelemetry/instrumentation-fs': { enabled: false },
      }),
    ],
  });
  sdk.start();

  const shutdown = () => {
    void sdk.shutdown().finally(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
