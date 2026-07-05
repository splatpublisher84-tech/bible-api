# Database Rules (Drizzle ORM)

## Schema = nguồn sự thật
- **`src/database/schema.ts`** định nghĩa toàn bộ schema (Drizzle pg-core).
- Đổi schema: sửa `schema.ts` → `npx drizzle-kit generate` → commit migration trong `drizzle/`.
- Áp dụng: `npm run db:migrate` (`drizzle-kit migrate`). Dựng lại toàn bộ: `npm run db:reset`.
- ⚠️ **Prod đã có schema** → baseline migration `0000` trước (đừng migrate mù).

## Connection
- Pool + Drizzle trong `src/database/database.module.ts` (`@Global`), inject qua token `DRIZZLE` (kiểu `DrizzleDB`).
- `statement_timeout: 10s`; SSL prod (`rejectUnauthorized: false` cho Supabase).
- `pool.query` được wrap để đo thời gian mọi query → `metrics.store.trackQuery`.

## Schema Pattern
- **1 bảng `verses` cho MỌI bản dịch** (phân biệt bằng `translation_id`).
- `book_names` = tên sách theo từng bản dịch; `chapter_info` = metadata; `book_aliases` (chưa dùng).
- FTS: **GIN index trên biểu thức** `to_tsvector('simple', text)` (khai báo trong `schema.ts` bằng `.using('gin', sql\`...\`)`).

## Query Guidelines
- Dùng Drizzle query builder (`eq/and/asc/sql`) — an toàn tham số sẵn, KHÔNG nối chuỗi.
- `LIMIT` mọi list query (mặc định 20, tối đa 100 — enforce ở Zod DTO).
- Tận dụng index: GIN cho search; `translation_id`, `(book_id, chapter)` cho verses.

## Repository Pattern (`src/modules/<res>/*.repository.ts`)
```typescript
@Injectable()
export class XRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}
  find() { return this.db.select({...}).from(table).where(eq(...)); }
}
```

## Data seed
- `sql/seed.sql` = data-only (pg_dump) + fix sequence. Nạp: `npm run db:seed`.
