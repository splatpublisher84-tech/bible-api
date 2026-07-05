# 0002 — Cache bằng HTTP header (+ server-side Keyv sau refactor)

**Trạng thái:** Accepted → **Amended (refactor 2026)**

## Bối cảnh
Dữ liệu Kinh Thánh gần như tĩnh. App chạy trên VM Fly.io chỉ 256MB RAM.

## Quyết định
Middleware `cache` (`src/middlewares/cache.js`) **chỉ đặt header `Cache-Control`**
(24h cho data tĩnh, 5m cho search). KHÔNG có lớp cache in-memory (Redis/LRU).

## Hệ quả
- ➕ Không thêm hạ tầng; browser/CDN lo việc cache.
- ➖ Mỗi request *chạm tới server* vẫn xuống DB (không có cache phía app).
- ➖ Quy mô lớn (nhiều request không trùng) có thể dồn tải lên DB.

## Lý do
`[SUY LUẬN]` Dữ liệu tĩnh + VM RAM nhỏ → để CDN/browser cache là đủ, tránh tốn RAM cho Redis.
**Cần xác nhận.**

## Cập nhật 2026 (refactor NestJS)
Đã **thêm** server-side cache (`@nestjs/cache-manager` + Keyv, L1 in-memory) qua
`CacheControlInterceptor` (`src/common/`), **song song** với header (header vẫn giữ nguyên: 24h/5m).
- Cache key **scope theo ngày UTC** (`http:<utcDay>:<url>`) để response phụ thuộc thời gian
  (vd `/api/votd` mặc định "today") tự roll qua nửa đêm — KHÔNG phục vụ verse cũ.
- ➕ Giảm tải DB cho request lặp trùng URL.
- ➖ Data tĩnh có thể cũ ≤ TTL sau khi import bản dịch mới (nhất quán với `Cache-Control` đã quảng cáo;
  cache in-memory per-process nên Fly auto-stop cũng xoá cache thường xuyên).
- Redis L2 (`@keyv/redis`) để dành khi scale lớn.
