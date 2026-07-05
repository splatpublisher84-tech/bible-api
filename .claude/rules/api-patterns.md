# API Development Patterns (NestJS)

## Architecture: Module → Controller → Service → Repository (Drizzle)
```
Request → Fastify (helmet/CORS/throttler/pino)
        → ZodValidationPipe → CacheControlInterceptor
        → Controller → Service → Repository (Drizzle) → PostgreSQL
        → AllExceptionsFilter (khi throw)
```

## Thêm 1 endpoint (trong `src/modules/<resource>/`)
1. **DTO** (`*.dto.ts`): `createZodDto(z.object({...}))` — tái dùng cho validate + Swagger.
2. **Repository** (`*.repository.ts`): `@Injectable`, `@Inject(DRIZZLE) db: DrizzleDB`, viết query Drizzle.
3. **Service** (`*.service.ts`): logic; ném `NotFoundException`/`BadRequestException`... khi lỗi.
4. **Controller** (`*.controller.ts`): `@Get()`, nhận `@Param()/@Query() dto: XDto`.
5. **Module** (`*.module.ts`): khai báo controllers + providers; `exports` nếu service khác cần.

⚠️ **Class được inject / DTO dùng làm `@Param()/@Query()` PHẢI là value import** (`import {X}`),
KHÔNG `import type` — nếu không NestJS DI + ValidationPipe hỏng (Biome `useImportType` đã tắt).

## Validation (nestjs-zod)
```typescript
// x.dto.ts
export class SearchQueryDto extends createZodDto(
  z.object({
    q: z.string().min(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
) {}
// controller
search(@Query() query: SearchQueryDto) { ... }   // ZodValidationPipe (global) tự parse+coerce
```

## Caching
```typescript
@CacheControl(86400)            // 24h cho data tĩnh (translations/books/verses/votd)
@Controller('translations')
// @CacheControl(300) cho /search. Interceptor set header + memoize Keyv theo ngày UTC.
```

## Error Handling
- Ném exception Nest chuẩn (`throw new NotFoundException('Translation not found')`).
- `AllExceptionsFilter` (`src/common/`) map về format cũ: `{ error }` / Zod → `{ error, details }` / 404 route → `{ error:'Not found' }`.

## Security & cross-cutting (đã cấu hình global)
- `@fastify/helmet` · CORS GET-only · `@nestjs/throttler` (500/15min) · `nestjs-pino`.
- CSP riêng cho `/demo` (nonce) & `/dashboard` (CDN) trong `src/views/`.
