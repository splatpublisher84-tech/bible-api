---
id: TASK-10
title: Chuyen Dependabot sang Renovate (fix tan goc bug lockfile)
status: Done
assignee: []
created_date: '2026-07-10 17:09'
updated_date: '2026-07-17 12:32'
labels:
  - pr
dependencies: []
priority: medium
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Đổi hướng 17/07/2026: KHÔNG fix tay lockfile các PR Dependabot nữa. PR #2–#5 cũ đã bị bot gom thành #8 (dev deps) + #9 (prod deps), cả hai đỏ CI vì bug lockfile upstream (xem .claude/rules/dependabot-lockfile.md). Quyết định: chuyển sang Renovate — regen lockfile bằng npm thật nên không dính bug; bật automerge cho patch/minor khi CI xanh.

Các bước:
1. User cài GitHub App Renovate (Mend) cho repo splatpublisher84-tech/bible-api (cần quyền admin, làm trên trình duyệt)
2. Merge PR 'Configure Renovate' (renovate.json, preset config:recommended + automerge patch/minor)
3. Xóa .github/dependabot.yml (giữ security alerts của GitHub)
4. Đóng PR #8, #9 không merge — Renovate sẽ tự mở PR mới với lockfile chuẩn
5. Verify: PR đầu tiên của Renovate xanh CI
6. Cập nhật/archive runbook dependabot-lockfile.md (không còn áp dụng)
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Lý do chọn Renovate thay vì workflow tự-vá lockfile: giải quyết tận gốc, ít mảnh tự chế. Tham khảo: docs.renovatebot.com/bot-comparison

Hoàn tất 17/07/2026: Renovate app cài (Renovate Only + Scan and Alert), PR #10 merge với config automerge patch/minor + group actions + schedule thứ Hai + lockFileMaintenance monthly. PR Dependabot #8/#9 đã tự đóng. dependabot.yml xóa; runbook dependabot-lockfile.md đánh dấu lỗi thời.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Chuyển Dependabot → Renovate hoàn tất: config merged (PR #10), dependabot.yml removed, runbook archived. Verify cuối: chờ đợt chạy đầu của Renovate (sáng thứ Hai) mở PR xanh CI.
<!-- SECTION:FINAL_SUMMARY:END -->
