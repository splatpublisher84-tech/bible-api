# 0003 — Metrics in-memory, không dùng dịch vụ ngoài

**Trạng thái:** Accepted

## Bối cảnh
Cần theo dõi traffic, latency, DB query, memory — nhưng dự án ở free tier, quy mô nhỏ.

## Quyết định
`src/metrics/metrics.store.ts` (port từ requestTracker/systemTracker cũ) giữ metrics **trong RAM**,
expose qua `GET /api/metrics` và `/dashboard`. Không dùng dịch vụ ngoài (Datadog, Grafana Cloud...).
_Bổ sung 2026: có thêm OpenTelemetry (env-gated) cho traces/metrics chuẩn — xem ADR 0006._

## Hệ quả
- ➕ Miễn phí, không thêm hạ tầng, không gửi dữ liệu ra ngoài.
- ➖ Metrics **mất khi restart / auto-stop** (Fly tắt máy khi idle).
- ➖ Tốn RAM (giới hạn buffer: ~100 log gần nhất, mẫu memory 24h) trên VM 256MB.

## Lý do
`[SUY LUẬN]` Quy mô nhỏ + free tier → monitoring ngoài là thừa và tốn kém.
**Cần xác nhận.**
