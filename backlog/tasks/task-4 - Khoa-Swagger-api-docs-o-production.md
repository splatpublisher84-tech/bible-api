---
id: TASK-4
title: Khoa Swagger /api-docs o production
status: Done
assignee: []
created_date: '2026-07-10 17:09'
updated_date: '2026-07-17 11:29'
labels:
  - security
dependencies: []
priority: medium
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Đổi hướng: Swagger /api-docs CẦN công khai — là tài liệu gửi client tích hợp. Giữ code flag trong main.ts (tắt mặc định ở production, bật lại bằng ENABLE_SWAGGER=1). Đã set secret ENABLE_SWAGGER=1 trên Fly (17/07/2026) → Swagger vẫn mở sau các lần deploy tới. Muốn tắt sau này: flyctl secrets unset ENABLE_SWAGGER -a bible-api-ibsnxg
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Prod đang chạy v28 (code cũ, chưa có flag). Secret ENABLE_SWAGGER=1 đã set + machine restart OK, /api-docs 200, /health 200. Flag chỉ có tác dụng thật từ lần deploy chứa commit 5b1abb3.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Quyết định giữ Swagger công khai cho client; set ENABLE_SWAGGER=1 trên Fly thay vì revert code. Verified: secrets list có ENABLE_SWAGGER, app healthy, /api-docs vẫn 200.
<!-- SECTION:FINAL_SUMMARY:END -->
