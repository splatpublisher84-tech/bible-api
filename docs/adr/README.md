# Architecture Decision Records (ADR)

Mỗi file ghi lại **một quyết định kiến trúc**: bối cảnh, quyết định, hệ quả, và *lý do*.
ADR vá lại phần "tại sao" — thứ dễ mất nhất khi bàn giao (repo này gộp 1 "Initial commit" → mất lịch sử).

## Quy ước trung thực

Dự án này được kế thừa; lý do gốc của người thiết kế phần lớn **không có tài liệu**. Vì vậy:
- **Quyết định** và **Hệ quả**: suy ra từ code → đáng tin.
- **Lý do**: nếu đánh dấu `[SUY LUẬN]` nghĩa là phỏng đoán, **cần người bàn giao xác nhận**.
- Lý do nào có bằng chứng (git, comment) thì ghi rõ nguồn.

## Trạng thái
`Accepted` = đang áp dụng · `Incomplete` = áp dụng nhưng dở dang · `Superseded` = đã bị thay thế.

## Trạng thái (mới)
`Amended` = quyết định gốc còn nhưng đã bổ sung/điều chỉnh (ghi trong file).

## Danh sách
- [0001 — Một bảng `verses` cho mọi bản dịch](0001-single-verses-table.md)
- [0002 — Cache HTTP header + server-side Keyv (Amended 2026)](0002-http-only-caching.md)
- [0003 — Metrics in-memory, không dùng dịch vụ ngoài](0003-in-memory-metrics.md)
- [0004 — VOTD chọn theo hash khi calendar rỗng](0004-votd-hash-fallback.md)
- [0005 — Supabase SSL `rejectUnauthorized: false`](0005-supabase-ssl.md)
- [0006 — Refactor sang NestJS + Fastify + TS + Drizzle (2026)](0006-nestjs-drizzle-refactor.md)
