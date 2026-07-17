---
id: TASK-17
title: 'Audit usage thuc te: endpoint + tinh nang nao dang duoc dung'
status: To Do
assignee: []
created_date: '2026-07-17 13:26'
updated_date: '2026-07-17 13:31'
labels: []
dependencies: []
priority: high
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Thu thap bang chung truoc khi cat bo tinh nang (best practice: dua tren data, khong doan). Nguon: /api/metrics top_endpoints + dashboard, log Fly.io. Ket qua: danh sach endpoint kem so hit, danh dau ung vien loai bo (0 hit). Lien quan TASK-15 (votd_calendar, book_aliases).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Co bang endpoint x so hit trong >=1 tuan
- [ ] #2 Danh sach ung vien loai bo kem bang chung
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Huy 17/07/2026: du an chua co nguoi dung that (ban nhap) -> khong co traffic de audit. Chien luoc doi sang: chot spec san pham truoc (M1) roi danh gia code theo spec.
<!-- SECTION:NOTES:END -->
