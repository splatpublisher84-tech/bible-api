import type { ThrottlerGetTrackerFunction } from '@nestjs/throttler';

/**
 * Lấy IP client THẬT để rate-limit (dùng làm key cho @nestjs/throttler).
 *
 * App chạy sau reverse proxy Fly.io → nó chỉ thấy IP của proxy, không thấy client.
 * Fly đặt header `Fly-Client-IP` = IP kết nối thật → dùng nó làm key thay cho req.ip
 * (req.ip = IP proxy Fly dùng chung → 500/15ph biến thành giới hạn ~toàn cục).
 *
 * Phòng thủ nhiều lớp: nếu client cố gửi kèm một `Fly-Client-IP` giả, Node gộp các header
 * trùng tên thành chuỗi "giả, thật" (hoặc mảng) → ta lấy PHẦN SAU CÙNG (giá trị do proxy
 * thêm vào), bỏ phần client tự chèn phía trước. Tránh dùng `X-Forwarded-For` (client bịa entry trái).
 *
 * ⚠️ KHÔNG bật `new FastifyAdapter({ trustProxy: true })` — nó khiến req.ip = entry trái nhất
 *    của X-Forwarded-For (client bịa được) → attacker xoay IP giả để vượt rate-limit.
 * ⚠️ ĐIỀU KIỆN AN TOÀN: Fly là proxy NGOÀI CÙNG và tự đặt Fly-Client-IP. Cần VERIFY thực nghiệm
 *    trên app live (curl với Fly-Client-IP giả, xem tracker nhận gì) trước khi tin tuyệt đối.
 * 🔮 Khi thêm Cloudflare (TASK-2): đổi sang `cf-connecting-ip` + khoá origin chỉ nhận IP Cloudflare.
 */
export const clientIpTracker: ThrottlerGetTrackerFunction = (req) => {
  const header = req.headers?.['fly-client-ip'];
  // Nhiều giá trị (mảng, hoặc Node gộp thành "a, b") → lấy cái proxy thêm sau cùng, bỏ phần client chèn.
  const lastValue = Array.isArray(header) ? header.at(-1) : header;
  const flyClientIp = lastValue?.split(',').pop()?.trim();
  return flyClientIp || req.ip || 'unknown'; // fallback req.ip: local dev (không có proxy)
};
