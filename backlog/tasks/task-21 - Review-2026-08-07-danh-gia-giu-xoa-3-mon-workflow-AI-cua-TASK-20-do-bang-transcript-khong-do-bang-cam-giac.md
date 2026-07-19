---
id: TASK-21
title: >-
  Review 2026-08-07: danh gia giu/xoa 4 mon workflow AI cua TASK-20 (do bang
  transcript, khong do bang cam giac)
status: To Do
assignee: []
created_date: '2026-07-17 17:05'
updated_date: '2026-07-19 07:05'
labels: []
dependencies:
  - TASK-20
priority: medium
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Kill-criteria review cho 3 mon dung o TASK-20 (AGENTS.md boundaries 3 tang / Stop hook / /ship), sau ~3 tuan su dung. Bang chung cong dong (nghien cuu 18/07): review khong co so lieu chuan bi truoc se sup thanh 'thoi, giu lai' — vi vay task nay NHUNG SAN lenh do, chi viec chay:

CACH DO TUNG MON:
1. /ship — dem so lan goi:
   grep -c 'command-name>/ship' ~/.claude/projects/-Users-sonnv-coding-xxx-splat-bible-api/*.jsonl
2. Stop hook — dem dong log (hook phai tu ghi log, yeu cau nay da nam trong design TASK-20):
   wc -l ~/.claude/ship-hook.log (hoac file log hook ghi); phan biet so lan CHAN (block) vs so lan pass
3. AGENTS.md boundaries — khong co metric; danh gia bang: (a) grep transcript xem co cau tra loi nao vien dan boundaries khong, (b) co lan nao minh bat duoc agent vi pham ranh gioi ma le ra muc nay phai chan? Chap nhan judgment call.
Tuy chon: chay /insights lay bao cao 30 ngay lam y kien thu hai.

TIEU CHI QUYET DINH (per mon): dung >= vai lan/tuan + co it nhat 1 lan chan loi that -> GIU; cai dat xong nam im -> XOA (khong 'de day biet dau can'). Ghi ket qua + quyet dinh vao TASK-20 (AC cuoi) roi Done ca hai task.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Chay du 3 phep do, ghi so lieu vao notes
- [ ] #2 Quyet dinh giu/xoa tung mon, cap nhat TASK-20 va xoa mon bi loai khoi repo
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
CAP NHAT 18/07 (vong nghien cuu goc nhin nguoc): (1) Dung /checkup (built-in tu CC 2.1.205; may nay 2.1.212 — verified) lam engine chinh cua review: no tu audit setup, tim skill/command/hook khong dung, dedupe CLAUDE.md dua tren usage history. Grep transcript trong description giu lai lam kiem chung doc lap (khong tin 1 nguon). (2) /ship la ung vien bi xoa so 1: bang chung mil22 (HN 48289950, dem invocation thuc) — slash command la loai config hay bi lo ra 'gan nhu khong bao gio goi' nhat. (3) Stop hook la mon it rui ro lo thoi nhat — enforcement deterministic khong mat gia theo the he model (context recall decay khong ap dung cho gate). (4) Ly do van giu review theo ngay thay vi 'prune khi dau': config chet KHONG phat tin hieu dau — no chi lang le ton context; 'prune on pain' ve cau truc khong bao gio kich hoat cho dead weight.

MO RONG SCOPE (19/07, sau hop nhat 2 phien): review 4 mon, khong phai 3 — them /spec-interview (phien song song da dung + chay lua that thanh cong cho spec M1 thay vi cat nhu quyet dinh 17/07; mau thuan ghi o TASK-20 notes). CACH DO MON 4: (a) dem lan goi: grep -c 'command-name>/spec-interview' ~/.claude/projects/*/*.jsonl; (b) bang chung chat luong da co: 1 lan dung that ra spec doc-1 duoc owner duyet, bat duoc 2 gia dinh sai cua owner (public-API, da-ngon-ngu) — can nhac them tieu chi 'co tao ra artifact duoc dung tiep khong' (doc-1 dang la nguon su that cho TASK-18). Tieu chi giu/xoa van nhu cu: co dung that + co gia tri that -> GIU; nam im -> XOA.
<!-- SECTION:NOTES:END -->
