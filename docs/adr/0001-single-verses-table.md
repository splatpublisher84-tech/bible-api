# 0001 — Một bảng `verses` cho mọi bản dịch

**Trạng thái:** Accepted

## Bối cảnh
Hệ thống phục vụ nhiều bản dịch, mỗi bản ~31.000 câu (hiện 2 bản = ~62.000 dòng).

## Quyết định
Lưu TẤT CẢ câu của mọi bản dịch trong **một bảng `verses`**, phân biệt bằng cột
`translation_id` — thay vì tạo bảng riêng cho mỗi bản dịch. (`src/database/schema.ts` — bảng `verses`)

## Hệ quả
- ➕ Schema đơn giản; thêm bản dịch = thêm dữ liệu, không cần đổi cấu trúc.
- ➖ Mọi truy vấn câu **phải** filter `translation_id` (có index `idx_verses_translation`).
- ➖ Bảng lớn dần theo số bản dịch; ràng buộc `UNIQUE(translation_id, book_id, chapter, verse)`.

## Lý do
`[SUY LUẬN]` Tránh nhân bản schema cho mỗi bản dịch và đơn giản hoá truy vấn chung.
**Cần xác nhận** với người thiết kế gốc.
