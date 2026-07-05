# 0005 — Supabase SSL `rejectUnauthorized: false`

**Trạng thái:** Accepted (đã từng thử đảo ngược rồi revert)

## Bối cảnh
Kết nối trực tiếp (direct connection) tới Supabase PostgreSQL dùng **self-signed certificate**.

## Quyết định
Ở production, `database.module.ts` đặt `ssl: { rejectUnauthorized: false }`
(`src/database/database.module.ts`).

## Hệ quả
- ➕ Kết nối được tới Supabase direct connection.
- ➖ Không xác thực certificate của server. Kết nối **vẫn mã hoá TLS**, nhưng về lý thuyết
  dễ bị MITM hơn so với verify đầy đủ.

## Lý do
**Có bằng chứng (không phải suy luận):** bắt buộc vì Supabase direct connection dùng
self-signed cert. Git history xác nhận từng thử bật xác thực lại rồi phải revert —
commit `5e2c269` *"Revert SSL rejectUnauthorized for Supabase compatibility"*.
