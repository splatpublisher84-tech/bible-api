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

- [x] **Supabase** — sở hữu: `splatpublisher84@gmail.com` _(xác nhận 17/07/2026)_
- [x] **Fly.io** — sở hữu: `splatpublisher84@gmail.com`, org `personal` _(xác nhận 17/07/2026 — đã login, set secret và deploy thành công từ máy này)_
- [x] **GitHub org `splatpublisher84-tech`** — admin: `splatpublisher84@gmail.com` _(xác nhận 17/07/2026)_
- [x] **Tài khoản git `nvs266@gmail.com`** (người commit gốc) — tài khoản cá nhân của chính người vận hành hiện tại (cùng người với `splatpublisher84@gmail.com`)

## 3. Sự cố thường gặp

### 3.1. Database không kết nối được (Supabase pause)
**Triệu chứng:** `/api/status` báo `database: error`, `getaddrinfo ENOTFOUND db.<...>.supabase.co`.
**Nguyên nhân hay gặp:** Supabase free tier **tự pause sau ~1 tuần không hoạt động**.
**Cách khôi phục** _(quy trình chuẩn Supabase — người làm 19/06/2026 không còn nhớ chi tiết,
ghi lại theo docs; lần tới gặp sự cố hãy cập nhật thời gian thực tế)_:
1. Đăng nhập https://supabase.com/dashboard bằng `splatpublisher84@gmail.com`.
2. Chọn project Bible API — project pause sẽ hiện trạng thái "Paused" kèm nút **Restore project**.
3. Bấm Restore và chờ (thường 1–5 phút tùy kích thước DB; DB này ~41MB nên nhanh).
4. Verify: `curl -s https://bible-api-ibsnxg.fly.dev/api/status | jq .database` → `status: ok`.
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

### 4.1 Deploy tự động (GitHub Actions — tag-based)
Workflow `.github/workflows/deploy.yml`: chạy khi **push tag `v*`** hoặc bấm tay (workflow_dispatch).
Không deploy mỗi lần push `main`.

**Setup 1 lần:**
1. Tạo Fly token: `flyctl tokens create deploy -a bible-api-ibsnxg` → copy.
2. GitHub → Settings → Secrets and variables → Actions → thêm secret **`FLY_API_TOKEN`**.
3. (Khuyên) GitHub → Settings → Environments → tạo **`production`** → bật **Required reviewers** (thêm chính bạn) = nút duyệt tay trước khi deploy.

**Deploy 1 phiên bản:**
```bash
git tag v1.0.0 && git push origin v1.0.0    # → workflow chạy: (duyệt) → flyctl deploy → smoke test
```
- `fly.toml` có health-check `/health` → Fly **tự rollback** nếu máy mới không healthy.
- Smoke fail → job đỏ; rollback tay: `flyctl releases -a bible-api-ibsnxg` → `flyctl deploy --image <prev>`.

## 5. Rollback
```bash
flyctl releases list
flyctl deploy --image <previous-image>
```

## 6. Secrets

- Đặt qua: `flyctl secrets set KEY=VALUE` (KHÔNG commit `.env`).
- Biến cần có: `DB_HOST/PORT/USER/PASSWORD/NAME`, `METRICS_KEY`, (tuỳ chọn) `ALLOWED_ORIGINS`, `LOG_LEVEL`.
- ⚠️ Nếu dự án nhận từ người khác: **nên xoay vòng (đổi) toàn bộ secret** — mật khẩu DB,
  `METRICS_KEY` — vì người cũ có thể vẫn biết. **Quyết định 17/07/2026: KHÔNG đổi** —
  người vận hành hiện tại cũng là chủ mọi tài khoản (mục 2), không có "người cũ" bên ngoài.

## 7. Liên hệ / bàn giao
- **Đầu mối duy nhất (on-call + vận hành + owner mọi tài khoản):** `splatpublisher84@gmail.com`
  (email cá nhân: `nvs266@gmail.com` — cùng một người; xem mục 2).
- Không có người bàn giao gốc bên ngoài hay nhóm vận hành riêng — dự án 1 người.
- Cộng tác viên data (PR #7, 12 bản dịch): `@nvhai272` (GitHub).
