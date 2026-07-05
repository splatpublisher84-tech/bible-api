# 0006 — Refactor sang NestJS + Fastify + TypeScript + Drizzle

**Trạng thái:** Accepted (2026-07)

## Bối cảnh
Bản gốc: Express 5 + JavaScript thuần + `pg` (raw SQL). Mục tiêu: nâng lên tech stack
enterprise 2026, dễ bảo trì/onboard, type-safe, có migration bài bản — nhưng **giữ 100%
API contract** (đây là read-only public REST API).

## Quyết định
- **Framework:** NestJS 11 trên **Fastify** (không phải Express) — cấu trúc module rõ,
  throughput cao hơn. Bên dưới vẫn HTTP GET-only như cũ.
- **Ngôn ngữ:** TypeScript strict (thay JS + jsconfig/checkJs).
- **Data:** **Drizzle ORM** map vào DB có sẵn; **drizzle-kit làm chủ schema** (`schema.ts` →
  `drizzle/` migrations). Data seed tách riêng `sql/seed.sql`.
- **Validation:** `nestjs-zod` (tái dùng Zod schema cũ → DTO + OpenAPI). KHÔNG dùng
  ptsq/tRPC vì sẽ phá REST contract.
- **Cross-cutting:** @nestjs/cache-manager (Keyv, xem ADR 0002), @nestjs/throttler,
  nestjs-pino, @nestjs/swagger, @fastify/helmet, OpenTelemetry (env-gated).
- **Test:** Vitest + SWC (emit decorator metadata cho DI). CI: GitHub Actions.

## Hệ quả
- ➕ Type-safe end-to-end; module hoá; migration versioned; observability chuẩn (OTel).
- ➕ Parity đã verify: golden-master 24/24 endpoint (status+body+cache) khớp bản Express;
  test suite 28/28.
- ➕ Sửa vài bug/latent issue của bản cũ: `pool.on('error')` không còn `process.exit`;
  `setInterval` metrics dùng `unref`; sequence seed được setval; `bk.id === Number(b)`.
- ➖ Nhiều dependency + nghi thức build/migrate hơn (đáng khi schema/feature còn tiến hoá).
- ⚠️ **Prod deploy:** phải baseline migration `0000` (DB prod đã có schema) trước khi migrate.

## Lý do
Người dùng (senior ~10 năm) chủ động chọn stack enterprise được đánh giá cao 2026 để học +
làm portfolio; ưu tiên parity tuyệt đối, chấp nhận độ phức tạp. Quyết định từng lựa chọn con
(Fastify vs Express, nestjs-zod vs ptsq, Keyv, OTel) đã research nguồn hiện hành trước khi chốt.
