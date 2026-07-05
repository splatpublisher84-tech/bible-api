# Runbook — Vận hành Bible API

Sổ tay xử lý sự cố & vận hành. Phần **facts** đã được kiểm chứng từ code/cấu hình.
Phần `[CẦN ĐIỀN]` là kiến thức con người — người bàn giao hoặc người sở hữu tài khoản
phải điền, KHÔNG được đoán.

## 1. Hạ tầng (inventory)

| Thành phần | Giá trị | Nguồn |
|---|---|---|
| App hosting | Fly.io — app `bible-api-ibsnxg`, region `iad` | `fly.toml` |
| VM | shared-cpu-1x, **256MB RAM**, auto-stop, min 0 máy | `fly.toml` |
| Database | Supabase PostgreSQL (free tier, **500MB**) | `/api/status` |
| Repo | GitHub `splatpublisher84-tech/bible-api` | git remote |
| Live URL | https://bible-api-ibsnxg.fly.dev | |
| Dashboard | https://bible-api-ibsnxg.fly.dev/dashboard | |

## 2. Quyền truy cập — XÁC NHẬN GẤP

Không có quyền = không sửa được khi sập. Kiểm tra và ghi lại:

- [ ] **Supabase** — ai sở hữu? `[CẦN ĐIỀN]` _(đã resume DB được 19/06/2026 → có vẻ có quyền)_
- [ ] **Fly.io** — ai sở hữu? `[CẦN ĐIỀN]` _(máy này chưa `flyctl auth login`)_
- [ ] **GitHub org `splatpublisher84-tech`** — ai admin? `[CẦN ĐIỀN]`
- [ ] **Tài khoản git `nvs266@gmail.com`** (người commit gốc) — của ai? `[CẦN ĐIỀN]`

## 3. Sự cố thường gặp

### 3.1. Database không kết nối được (Supabase pause)
**Triệu chứng:** `/api/status` báo `database: error`, `getaddrinfo ENOTFOUND db.<...>.supabase.co`.
**Nguyên nhân hay gặp:** Supabase free tier **tự pause sau ~1 tuần không hoạt động**.
**Cách khôi phục:** `[CẦN ĐIỀN — bạn vừa làm ngày 19/06/2026, ghi lại CHÍNH XÁC các bước:
đăng nhập Supabase dashboard → chọn project → Resume? mất bao lâu?]`
**Phòng ngừa:** cân nhắc ping định kỳ giữ DB "ấm", hoặc nâng tier.

### 3.2. Request đầu tiên chậm 3-5s (cold start)
**Nguyên nhân:** `min_machines_running = 0` + `auto_stop_machines` → máy tắt khi idle (`fly.toml`).
**Bình thường**, không phải lỗi. Nếu cần phản hồi nhanh: đặt `min_machines_running = 1` (tốn tiền hơn).

### 3.3. Hết RAM (256MB)
**Theo dõi:** chart Memory ở `/dashboard`. Cảnh báo nếu RSS > 200MB.
**Lưu ý code (sau refactor):** `database.module.ts` `pool.on('error')` **chỉ log** (KHÔNG còn
`process.exit(-1)` như bản Express cũ) → tránh downtime do lỗi idle thoáng qua. Graceful shutdown
đóng pool khi nhận SIGTERM/SIGINT (Nest shutdown hooks).

### 3.4. DB gần đầy (500MB)
**Theo dõi:** `/api/status` → `costs.supabase.db_usage_percent`. Hiện ~8% (41MB).
Mỗi bản dịch ~ vài chục MB. Nạp 3-4 bản nữa là chạm ngưỡng → nâng tier.

## 4. Deploy

Quy trình (theo skill `/deploy`):
```bash
npm run check && npm run typecheck   # lint/format + types
npm run build                        # TS -> dist/ (nest build) — BẮT BUỘC (bản NestJS)
npm test                             # phải pass (CẦN DB có dữ liệu — xem AGENTS.md)
git status && git push origin main   # commit + push trước
flyctl deploy                        # Dockerfile multi-stage tự build TS -> node dist/main
# verify:
curl -s https://bible-api-ibsnxg.fly.dev/health | jq
curl -s 'https://bible-api-ibsnxg.fly.dev/api/verses/kjv_strongs/43/3/16' | jq
```
> ✅ Bug abbr `kjv`→`kjv_strongs` trong `SKILL.md` đã sửa.
> ⚠️ **Migration Drizzle:** prod đã có schema → **đừng** `drizzle-kit migrate` mù (0000_init đụng bảng).
> Baseline `0000` một lần (đánh dấu applied trong `drizzle.__drizzle_migrations`) rồi mới migrate bản mới.

## 5. Rollback
```bash
flyctl releases list
flyctl deploy --image <previous-image>
```

## 6. Secrets

- Đặt qua: `flyctl secrets set KEY=VALUE` (KHÔNG commit `.env`).
- Biến cần có: `DB_HOST/PORT/USER/PASSWORD/NAME`, `METRICS_KEY`, (tuỳ chọn) `ALLOWED_ORIGINS`, `LOG_LEVEL`.
- ⚠️ Nếu dự án nhận từ người khác: **nên xoay vòng (đổi) toàn bộ secret** — mật khẩu DB,
  `METRICS_KEY` — vì người cũ có thể vẫn biết. `[CẦN ĐIỀN: đã đổi chưa? ngày nào?]`

## 7. Liên hệ / bàn giao
`[CẦN ĐIỀN: ai là người liên hệ khi sự cố? người bàn giao gốc? nhóm vận hành?]`
