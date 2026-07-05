import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// Dùng SWC để transform test — bắt buộc cho NestJS: emit decorator metadata
// (esbuild mặc định của Vitest không emit -> DI hỏng trong test).
export default defineConfig({
  test: {
    globals: false,
    include: ['tests/**/*.test.ts', 'src/**/*.spec.ts'],
    testTimeout: 20000,
    hookTimeout: 30000,
    env: { LOG_LEVEL: 'silent' }, // tắt log pino khi chạy test cho sạch output
  },
  plugins: [
    swc.vite({
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
        target: 'es2022',
      },
    }),
  ],
});
