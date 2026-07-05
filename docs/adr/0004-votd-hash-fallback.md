# 0004 — VOTD chọn theo hash khi calendar rỗng

**Trạng thái:** Incomplete (calendar chưa có dữ liệu)

## Bối cảnh
Verse of the Day cần trả "câu của ngày". Có bảng `votd_calendar` (map ngày → câu)
và pool `votd_verses` (365+ câu theo chủ đề).

## Quyết định
`votd.service.ts`: thử `findByCalendarDay()` trước; nếu không có →
fallback `hashDate(date) % số_câu` để chọn (deterministic).
Hiện `votd_calendar` **rỗng** (không có dữ liệu trong `sql/seed.sql`) → **luôn dùng hash**.

## Hệ quả
- ➕ Cùng một ngày luôn ra cùng một câu, không cần điền calendar thủ công.
- ➖ Không kiểm soát được câu nào rơi vào ngày nào (random theo hash).
- ➖ Nhánh calendar là **code chết** cho tới khi nạp dữ liệu `votd_calendar`.

## Lý do
`[SUY LUẬN]` Cần fallback để tính năng chạy ngay khi chưa kịp curate 365 ngày.
**Cần quyết định:** nạp dữ liệu `votd_calendar`, hay bỏ hẳn nhánh calendar cho gọn?
