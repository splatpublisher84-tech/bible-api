# Runbook: Dependabot npm PR fail `npm ci` (thiếu `@esbuild/*` trong lock)

## Triệu chứng
PR npm của Dependabot (thường là group `production-dependencies`) đỏ ở CI:
- **Lint · Typecheck · Build** và **Integration tests** fail **rất nhanh (~6–30s)**.
- Log lỗi ở bước `npm ci`:
  ```
  npm error code EUSAGE
  npm error `npm ci` can only install packages when your package.json and
  package-lock.json ... are in sync.
  npm error Missing: @esbuild/linux-x64@X.Y.Z from lock file
  ... (và ~25 biến thể @esbuild/* / @emnapi/* khác)
  ```
Các PR github-actions (checkout, setup-node, codeql...) **không** dính lỗi này — chỉ PR đụng `package-lock.json`.

## Nguyên nhân (đã verify, có nguồn)
Dependabot regenerate `package-lock.json` bằng npm/arborist **bundled cũ của riêng nó**, chạy trên linux-x64 → chỉ giữ `@esbuild/linux-x64`, **bỏ mất các biến thể platform khác** (optional deps). Đây là hành vi thượng nguồn của npm khi resolve không sạch (npm/cli#4828, #8320), không phải bug cấu hình repo.

⚠️ **KHÔNG có config nào commit vào repo chặn được**: Dependabot không đọc field `packageManager` (dependabot-core#4830, chưa làm); Corepack/`setup-node` chỉ đổi npm mà **CI** chạy, không đổi npm mà **Dependabot** tạo lock; không có knob `.npmrc` hay option `dependabot.yml` cho việc này. → Cách duy nhất: **regenerate lock trên Linux rồi push ngược vào nhánh PR**.

## Fix (đã chứng minh chạy — xem commit `463243c` và PR #5)
Yêu cầu: Docker chạy (`open -a Docker`), node image **khớp version pin trong `ci.yml`** (hiện `24.13.0`).

⚠️ **PHẢI regen trên Linux.** Regen trên macOS tạo lock mà Linux `npm ci` từ chối (chính gotcha này).

```bash
# 1. Worktree sạch từ main (không đụng working tree đang dở)
git fetch origin
git worktree add --detach /tmp/pr-fix origin/main
cd /tmp/pr-fix

# 2. Bump ĐÚNG các dep Dependabot muốn, chỉ sửa lock (giữ range package.json)
#    Thay <dep>@<ver> bằng đúng các version trong title/PR của Dependabot.
docker run --rm -v "$PWD":/app -w /app node:24.13.0-slim sh -c \
  'npm install dotenv@X pg@Y zod@Z --package-lock-only --no-audit --no-fund'
git checkout -- package.json          # revert range về cũ; lock giữ version mới

# 3. GROUND TRUTH: npm ci + build phải pass trên Linux trước khi push
docker run --rm -v "$PWD":/app -w /app node:24.13.0-slim sh -c \
  'npm ci --no-audit --no-fund && npm run typecheck && npm run build'

# 4. Commit lock + force-push vào ĐÚNG nhánh của PR (KHÔNG kèm "[dependabot skip]"
#    để Dependabot không force-push đè lên commit của mình)
git add package-lock.json
git commit -m "chore(deps): regenerate lockfile on linux to fix npm ci"
git push --force-with-lease origin HEAD:<dependabot-branch-name>

# 5. Chờ CI xanh → merge PR. Dọn: git worktree remove --force /tmp/pr-fix
```

Ghi chú:
- `npm update <dep>` hoặc `npm install <dep>@ver --no-save` thường **không** bump được vì npm giữ version đã-lock khi nó vẫn thỏa range → dùng cách "install (đổi cả package.json) rồi `git checkout -- package.json`" ở bước 2.
- Nếu chỉ cần lock hợp lệ (không cần bump gì thêm): trên Linux `rm -rf node_modules package-lock.json && npm install` sẽ ghi lại đủ mọi biến thể platform (workaround npm/cli#4828), nhưng diff sẽ to hơn.
