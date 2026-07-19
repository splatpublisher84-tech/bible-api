---
id: TASK-27
title: Go full-text search khoi API surface (FR-4)
status: To Do
assignee: []
created_date: '2026-07-19 07:40'
updated_date: '2026-07-19 07:47'
labels:
  - backend
  - cleanup
dependencies: []
priority: high
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implements: FR-4 (AC-4.1) — spec doc-1. App khong co tinh nang tim kiem; search ton tai nguyen (GIN index nang Supabase 500MB, query nang tren VM 256MB). Go: src/modules/verses/search.controller.ts, VersesService.search(), SearchQueryDto, khai bao GIN index idx_verses_text_search trong schema.ts + migration DROP INDEX tren prod, throttle rieng /search. Kiem tra khong con noi nao khac dung search truoc khi xoa (demo.html/dashboard co the goi /api/search).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 GET /api/search tra 404 theo format loi chuan {error:'Not found'}
- [ ] #2 GIN index idx_verses_text_search bi drop tren prod (co migration), schema.ts khong con khai bao
- [ ] #3 npm run check + typecheck + build + test pass sau khi go
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Go code search: xoa src/modules/verses/search.controller.ts; bo SearchController khoi verses.module.ts; xoa VersesService.search() (verses.service.ts:36-40); xoa VersesRepository.search() (verses.repository.ts:39-67, bo import bookNames); xoa SearchQueryDto (verses.dto.ts:21-28).
2. Go GIN index: xoa khai bao idx_verses_text_search trong src/database/schema.ts:78-79; npx drizzle-kit generate -> migration 0001 DROP INDEX (kiem tra file sinh ra). Prod: KHONG migrate mu — xac nhan baseline 0000 trong drizzle.__drizzle_migrations truoc; neu chua baseline thi DROP INDEX tay tren Supabase + danh dau migration. Hoi owner truoc khi chay tren prod.
3. Go tham chieu: demo.html (tab+section+JS search, L47-55/87/112-122/147-273/303-304); dashboard.html:249 (dong tr /api/search); schema.spec.ts:61-72 (test FTS duy nhat); README.md L28/93/106/175; AGENTS.md L79/87/97/105. Metrics/throttle global/app.setup: khong can sua (da xac nhan).
4. Verify: npm run check + typecheck + build + test; chay app local, curl /api/search?q=love -> 404 {error:'Not found'} (AllExceptionsFilter map san); /api/verses + /api/votd van chay; /demo khong con tab search. AC-2 (drop index prod) hoan tat luc deploy.
Ngoai scope: votd_calendar, book_aliases, route /demo (chi go phan search trong demo).
<!-- SECTION:PLAN:END -->
