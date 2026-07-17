---
id: TASK-22
title: Chot spec san pham M1 (1 trang) qua phong van hoi thoai
status: To Do
assignee: []
created_date: '2026-07-17 17:32'
updated_date: '2026-07-17 17:37'
labels: []
dependencies: []
priority: high
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Owner + AI lam viec truc tiep trong hoi thoai (KHONG dung command — /spec-interview da bi cat o TASK-20 vi thieu bang chung): AI phong van owner TUNG CAU MOT, roi viet spec 1 trang: Objective / Context / Out of scope / Acceptance criteria / Boundaries. Truoc khi chot, soi draft qua 2-3 lang kinh challenge (pre-mortem 'gia su ship xong that bai — vi sao?', MVP-cut 'bo duoc gi nua?', edge-case). Spec la artifact dung 1 lan; chot xong luu vao task nay va la dau vao cho TASK-18 (danh gia ban nhap so voi spec) -> TASK-19 (thuc thi). Cac task treo cho spec: TASK-5/6/9/15/16.

CAU HOI DAU TIEN (da dat 18/07, cho tra loi): Vi sao API nay ton tai — muc tieu 6-12 thang toi: (a) backend cho app doc Kinh Thanh cua chinh owner, (b) API cong khai cho dev khac, (c) hoc tap/portfolio, (d) khac? Tra loi xong moi biet 'nguoi dung' la ai de hoi tiep.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Phong van xong, spec 1 trang duoc owner duyet, luu vao task
- [ ] #2 TASK-18 co the bat dau tu spec nay
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
NGHIEN CUU SKILL BRAINSTORM (18/07): Khong co A/B nao do skill-vs-hoi-thoai-thuong (noi ro: bang chung khong ton tai). Bang chung tot nhat toan nganh (VelvetShark, first-person longitudinal, '90% task cua toi') lai chinh la 1 one-shot prompt — ung ho null hypothesis. Superpowers brainstorming: phan CONTENT duoc khen that (chan phan xa rush-to-deliver, 1 cau hoi/luot, YAGNI, 2-3 phuong an + trade-off), phan bi che la harness always-on — dung cai ma viec cai skill mua ve. Anthropic doc-coauthoring: khong co usage report nhung co trick dang steal (fresh-context reader test). VERDICT: khong cai gi, nhung PHONG VAN THEO 5 KY THUAT: (1) hard gate — khong de xuat giai phap truoc khi phong van xong va owner duyet tom tat; (2) mo dau bang 'dump het nhung gi ban da biet/muon' (info-dump truoc), roi moi hoi 1 cau/luot vao cho trong, uu tien multiple-choice; (3) soi draft qua lang kinh co ten: pre-mortem / inversion / MVP-cut-YAGNI / scope-decomposition; (4) moi quyet dinh lon: dua 2-3 phuong an + trade-off + recommendation, chong first-idea lock-in; (5) self-review (placeholder/mau thuan/mo ho) roi cho 1 subagent SACH CONTEXT doc spec 1 trang va bao cho nao kho hieu. Cau 1 da dat van giu nguyen.
<!-- SECTION:NOTES:END -->
