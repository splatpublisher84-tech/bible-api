---
id: TASK-3
title: Rate-limit theo route (/api/search siet chat hon)
status: Done
assignee: []
created_date: '2026-07-10 17:09'
updated_date: '2026-07-11 17:10'
labels:
  - security
dependencies: []
priority: medium
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Search FTS nang DB -> limit thap hon GET verse tinh. Dung @Throttle() per-route
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
DONE + verified local: @Throttle 100/15ph tren SearchController. Xac nhan bang header: /api/search -> X-RateLimit-Limit:100, /api/translations -> 500 (global). Key theo Fly-Client-IP (dung getTracker da co).
<!-- SECTION:NOTES:END -->
