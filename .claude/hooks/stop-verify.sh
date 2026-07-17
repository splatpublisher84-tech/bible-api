#!/bin/bash
# Stop hook: chặn agent kết thúc lượt khi code đang sửa dở còn đỏ (typecheck/biome).
# An toàn: check stop_hook_active chống infinite loop; fail-open cho mọi lỗi ngoài code.
# Log mọi lần chạy vào ~/.claude/bible-api-stop-hook.log để TASK-21 (review 2026-08-07) có dữ liệu.

LOG="$HOME/.claude/bible-api-stop-hook.log"
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG"; }

INPUT=$(cat)
# Đang trong vòng lặp do chính hook này chặn -> cho dừng, tránh loop vô hạn
if echo "$INPUT" | grep -q '"stop_hook_active":[[:space:]]*true'; then
  log "pass (stop_hook_active)"
  exit 0
fi

cd "$(dirname "$0")/../.." || { log "pass (cd failed)"; exit 0; }

# Không có thay đổi chưa commit trong src/ hoặc test/ -> không có gì để verify
if git diff --quiet HEAD -- src test 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard src test 2>/dev/null)" ]; then
  log "pass (no changes)"
  exit 0
fi

FAIL=""
OUT=$(npm run typecheck 2>&1) || FAIL="typecheck"
if [ -z "$FAIL" ]; then
  OUT=$(npm run check 2>&1) || FAIL="biome check"
fi

if [ -n "$FAIL" ]; then
  log "BLOCK ($FAIL failed)"
  echo "Stop hook: '$FAIL' đang đỏ với thay đổi chưa commit trong src/test. Sửa xong mới được kết thúc lượt. Output:" >&2
  echo "$OUT" | tail -30 >&2
  exit 2
fi

log "pass (verified)"
exit 0
