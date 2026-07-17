---
id: TASK-14
title: Bat auto-deploy tag-based (CD)
status: Done
assignee: []
created_date: '2026-07-10 17:09'
updated_date: '2026-07-17 12:38'
labels:
  - ops
dependencies: []
priority: low
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Set FLY_API_TOKEN (GH secret) + reviewer cho environment production
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Xác minh 17/07/2026: deploy.yml đã tồn tại và chạy thật thành công (tag v1.0.2 → run xanh 11/07, chứng minh FLY_API_TOKEN đã set). Reviewer gate cho environment production: owner xác nhận ĐÃ BẬT. Lưu ý: @nvhai272 có write access (branch feature/data-seeds nằm trong repo chính) nên đánh tag được, nhưng gate chặn deploy đến khi owner duyệt. Quyết định: không thêm tag ruleset — gate là đủ.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
CD tag-based đã hoạt động đầy đủ: FLY_API_TOKEN set (verified qua run v1.0.2 thành công), reviewer gate bật. Quy trình release: git tag vX.Y.Z + push → chờ owner approve → deploy + smoke test.
<!-- SECTION:FINAL_SUMMARY:END -->
