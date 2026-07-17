---
id: TASK-12
title: Rotate secret ke thua (DB password)
status: Done
assignee: []
created_date: '2026-07-10 17:09'
updated_date: '2026-07-17 11:50'
labels:
  - ops
dependencies: []
priority: medium
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Du an ke thua, chua xac nhan da doi DB password (± METRICS_KEY)
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Quyết định của owner 17/07/2026: KHÔNG rotate. Chấp nhận rủi ro secret kế thừa (DB_PASSWORD, METRICS_KEY) — người vận hành hiện tại cũng chính là chủ các tài khoản (xem TASK-11).
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Đóng không thực hiện (won't do) theo quyết định owner — không rotate DB_PASSWORD/METRICS_KEY.
<!-- SECTION:FINAL_SUMMARY:END -->
