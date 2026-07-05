# AGENTS.md

Bible API — REST backend phục vụ dữ liệu Kinh Thánh từ PostgreSQL.
Hỗ trợ nhiều bản dịch, tên sách đa ngôn ngữ (Anh/Việt), tìm kiếm toàn văn,
Verse of the Day. **Đang chạy production** (KHÔNG phải dự án scaffold/giai đoạn đầu).

- **Live:** https://bible-api-ibsnxg.fly.dev
- **Stack:** NestJS 11 (Fastify) + TypeScript + Drizzle ORM + PostgreSQL 16 + Docker
- **Trạng thái:** Feature-complete. 7 nhóm endpoint đã implement đầy đủ + có test.
  Refactor từ Express+JS+pg → NestJS+TS+Drizzle (2026), giữ nguyên contract API.

## Commands

```bash
npm run dev          # Dev, auto-reload (nest start --watch)
npm run build        # Compile TS -> dist/ (nest build)
npm start            # Production (node dist/main) — cần build trước
npm test             # Test (vitest + SWC) — CẦN PostgreSQL có dữ liệu
npm run typecheck    # tsc --noEmit
npm run check        # Biome lint + format check
docker-compose up -d # Bật PostgreSQL local
docker-compose down  # Tắt

# Import bản dịch mới (module Bible SuperSearch -> SQL)
node scripts/convert-module-to-pg.js <module_dir> <translation_id> <output.sql>
```

## Setup lần đầu (máy mới)

Test là **integration test**, cần DB thật có sẵn dữ liệu, KHÔNG chạy được với DB rỗng.
1. `docker-compose up -d`
2. Nạp lần lượt theo thứ tự (file tự ghi rõ thứ tự trong comment đầu file):
   `sql/001_schema.sql` → `002_seed.sql` → `003_data_cadman.sql`
   → `004_data_kjv_strongs.sql` → `005_book_names_temp.sql` → `006_votd.sql`
3. `npm test`

## Kiến trúc: Module → Controller → Service → Repository (Drizzle)

```
Request → helmet/CORS/throttler/pino → Zod validate (nestjs-zod pipe)
        → CacheControlInterceptor (header + Keyv) → Controller → Service
        → Repository (Drizzle) → PostgreSQL → AllExceptionsFilter (format lỗi)
```

| Đường dẫn | Vai trò |
|---|---|
| `src/main.ts` | Bootstrap NestFastify: helmet, CORS, static, swagger, OTel hook, metrics hook |
| `src/app.setup.ts` | `configureApp()` — global prefix `/api`, ZodValidationPipe, exception filter (dùng chung main + test) |
| `src/app.module.ts` | Root module: Config, Logger(pino), Throttler, Cache(Keyv), Database + các module |
| `src/database/` | schema.ts (Drizzle, map DB có sẵn), database.module.ts (pool + wrap query đo metrics) |
| `src/modules/<res>/` | Mỗi resource: `*.repository.ts` (Drizzle SQL) + `*.service.ts` (logic) + `*.dto.ts` (Zod) + `*.controller.ts` |
| `src/common/` | AllExceptionsFilter (format lỗi cũ), CacheControl decorator + interceptor |
| `src/metrics/` | metrics.store.ts (in-memory request/DB/memory tracking), /api/metrics |
| `src/views/` | ViewsController (/demo CSP-nonce, /dashboard) + demo.html/dashboard.html |
| `src/tracing.ts` | OpenTelemetry SDK (import đầu tiên ở main; env-gated) |

**Lưu ý refactor:** validation reuse Zod schema qua `nestjs-zod`; lỗi giữ đúng format cũ
(`{error}` / `{error,details}` / 404 `Not found`) qua AllExceptionsFilter; Cache-Control giữ y hệt
(86400 data, 300 search) + thêm server-side cache Keyv; DB semantics giữ nguyên (FTS `simple`,
votd `NULLS LAST` + hash fallback, Strong markup raw).

## Endpoints (đã hoạt động)

- `GET /api/translations`, `/api/translations/:abbr`
- `GET /api/books?translation=`, `/api/books/:id/chapters?translation=`
- `GET /api/verses/:translation/:book/:chapter[/:verse]`
- `GET /api/search?q=&translation=&limit=&offset=`
- `GET /api/votd?date=&translation=`
- `GET /api/status` (health + data stats), `GET /api/metrics?key=METRICS_KEY`
- `GET /health`, `/`, `/api-docs` (Swagger song ngữ), `/dashboard`, `/demo`

## Data model

- **1 bảng `verses` cho TẤT CẢ bản dịch** (phân biệt bằng `translation_id`, không tách bảng).
- `books` (66 sách, cấu trúc) + `book_names` (tên đa ngôn ngữ theo bản dịch).
- `translations`, `testaments`, `chapter_info` (metadata pre-computed).
- Tìm kiếm: GIN index trên **biểu thức** `to_tsvector('simple', text)` (KHÔNG có cột `text_search_vector`). Config `simple` → không stemming theo ngôn ngữ.
- Đã nạp: Cadman (vi, id=1) + KJV Strong's (en, id=2), ~62.000 câu.

## Quy ước (conventions)

- **Luôn dùng parameterized query** (`$1`, `$2`) — KHÔNG nối chuỗi.
- Validate bằng Zod ở route; lỗi trả `{ error, details }` qua errorHandler.
- `LIMIT` mọi list query (mặc định 20, tối đa 100).
- Cache = HTTP header thôi (KHÔNG cache in-memory): 24h cho data tĩnh, 5m cho search.
- DB query tự được track qua wrapper trong `database.js`. statement_timeout = 10s.

## Deployment & Infra

- **Fly.io** (`bible-api-ibsnxg`, region iad, shared-cpu-1x 256MB, auto-stop) + **Supabase PostgreSQL** (free tier 500MB).
- Deploy: `flyctl deploy` (hoặc skill `/deploy`). Secret: `flyctl secrets set KEY=VALUE`.
- Supabase SSL: phải `rejectUnauthorized: false` (self-signed cert, vẫn mã hoá TLS).
- Cold start ~3-5s sau khi máy idle (auto-stop).

## Environment variables (qua .env)

`PORT` (3000), `NODE_ENV`, `DB_HOST/PORT/USER/PASSWORD/NAME`, `METRICS_KEY`,
`ALLOWED_ORIGINS` (CORS, tuỳ chọn), `LOG_LEVEL` (tuỳ chọn).

## Ranh giới & điều cần biết (boundaries)

- ❌ KHÔNG commit `.env` (chứa mật khẩu DB). Secret production đặt qua Fly.io.
- ⚠️ KHÔNG có write/admin API — dữ liệu chỉ đổi qua SQL migration / script import.
- 🔴 **Code chết đã biết:** `votd_calendar` rỗng → VOTD luôn chọn theo hash (`hashDate()` trong `votd.controller.js`), nhánh calendar không bao giờ chạy. Bảng `book_aliases` không endpoint nào dùng.
- 🟡 Strong's (`{G2316}`) nằm thô trong text KJV, API không parse — client tự xử.
- 🟡 `METRICS_KEY` truyền qua URL (`?key=`) và nhúng trong HTML dashboard — lộ trong log/referrer. Cân nhắc chuyển sang header.
