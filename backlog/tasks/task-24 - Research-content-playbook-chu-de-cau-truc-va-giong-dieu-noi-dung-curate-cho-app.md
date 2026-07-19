---
id: TASK-24
title: >-
  Research content playbook: chu de, cau truc va giong dieu noi dung curate cho
  app
status: In Progress
assignee:
  - '@snowstorm6'
created_date: '2026-07-18 14:54'
updated_date: '2026-07-19 06:41'
labels: []
dependencies: []
documentation:
  - backlog/docs/doc-1 - Bible-API-Product-Spec.md
priority: high
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Tiep noi TASK-25 (thi truong/ban dich da research, bo ban dich dang treo): nghien cuu content trong app phai la gi de user mo moi ngay. 5 goc: (1) phan tich cau truc content daily cua doi thu (YouVersion/Hallow/Glorify/Abide/Bible Chat); (2) nhu cau chu de thuc cua user qua keyword ASO/search theo ngon ngu; (3) khac biet van hoa theo thi truong (Hispanic/Catholic vs Protestant, PH/VN); (4) retention mechanics (notification, streak, cau hoi tuong tac); (5) chuan chat luong + ranh gioi than hoc (bai hoc content bi phan ung, guideline da he phai). Dau ra: content playbook — chu de uu tien theo ngon ngu, template 1 ngay content (verse+pray+question), guideline giong dieu, mechanic giu chan dang dua vao spec M1.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Bao cao 5 goc co nguon, dau ra dang content playbook dung duoc de soan content
- [x] #2 Danh sach de xuat anh huong den spec M1 (neu co: doi cau truc votd/explore/question)
- [ ] #3 Owner doc va quyet: chot content playbook + chot lai bo ban dich dang treo o TASK-25
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Chay workflow gon ~7 agents (5 goc + verify nhe trong tung agent + synthesize)
2. Luu bao cao vao task notes
3. Trinh owner quyet AC#3 (playbook + chot bo ban dich TASK-25)
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
CONTENT PLAYBOOK — KET QUA RESEARCH (19/07/2026, 6 agents; bao cao goc kem URL day du: scratchpad w7q3u1mz8.output):

1) TEMPLATE 1 NGAY (tong <=3-5 phut, format Glorify/YouVersion Daily Refresh validate):
Verse (1-4 cau, NGUYEN VAN ban dich, reference chinh xac) -> Reflection 80-150 tu (tran 400 tu/ngay theo chuan YouVersion partner) -> Cau hoi suy ngam 3 lua chon khong dung/sai (CHUA app lon nao lam cho nguoi lon -> differentiator, la BET can do) -> Prayer dong 40-80 tu (cho phep luu). Audio = multiplier nhung de v2. Kho explore: taxonomy theo CAM XUC/HOAN CANH (anxiety, grief...), KHONG theo sach/than hoc; dong goi series 5-7 ngay (completion cao nhat o plan 3-21 ngay).

2) ~24 CHU DE UU TIEN: Tier1 evergreen v1 (viet ban es RIENG, khong dich may): Anxiety&Fear, Love, Strength, Hope, Peace, Healing, Encouragement, Prayer. Tier2: Forgiveness, Faith, Grace, Grief, Marriage, Worry-Depression, Rest-Sleep, Gratitude, Family, Temptation, Humility, LoveThyNeighbor. Theo mua (pack rieng): AnoNuevo (spike 1/1 lon nhat), Cuaresma/Lent+Easter, Adviento/Christmas, BackToSchool. Verse anchor: John3:16 >> Jer29:11 ~ Phil4:13 > Isa41:10, Phil4:6-7, 1Pet5:7, Isa40:31, Rom8:38-39.

3) GUIDELINE PER-MARKET:
- en: giong am, ngan, 'mere Christianity'; frame verse dung ngu canh (Jer29:11 la 'nguyen tac' khong phai 'God promises YOU').
- es/US-Hispanic (chinh): PHAI toggle song ngu es<->en per-item (gia dinh 2 ngon ngu; 58% congregant Hispanic Protestant la gen1); Christ-centered trung lap he phai (65% nuoi day Catholic, ~24% cuu Catholic sang evangelical); de tai gia dinh/hy sinh/biet on; RV1909 co -> prayer/reflection phai espanol hien dai am. CAM: Duc Me/thanh/novena trong core daily nhung KHONG che devotion Guadalupe; novena chi o explore opt-in.
- vi: Cadman = Tin Lanh -> 100% tu vung he Tin Lanh (Duc Chua Troi, Ma-thi-o, Giang); prayer van phong Tin Lanh VN (xung 'con', ket 'trong danh Chua Gie-xu, Amen'); Cong giao vi (Thien Chua, Gioan, 73 sach) = BO CONTENT RIENG khong phai toggle. CAM 'Thuong De', dich may prayer.
- tl: 78.8% Catholic, 79% cau nguyen hang ngay (top the gioi) -> habit san; English hoat dong tot, Taglish la tang cuong; lich Simbang Gabi 16-24/12, Holy Week, Santo Nino thang1. CAM giong sua he phai, khong nhac INC.
- pt-BR/fr: CHUA co research van hoa rieng — khong launch content 2 ngon ngu nay chi bang guideline chung.

4) RETENTION MECHANICS (xep theo bang chung) + ANH HUONG SPEC API:
#1 Streak nguong cuc thap (mo app = tinh; Hallow +26% retention YoY) — client-side v1 duoc, khong dung API.
#2 Push 2 mui (content 8-10AM + streak-saver 7PM gio dia phuong) — API daily content phai resolve theo NGAY LOCAL + locale.
#3 Series 5-7 ngay — ANH HUONG SPEC LON NHAT: can schema series(series->day_index->content) + tien do, khac kho verse roi hien tai.
#4 Widget VOTD — dung lai endpoint votd, payload gon cache dai.
#6 Prayer list luu — chi khi sync server (API chua co user).
#7 Season campaign — field season/active_from cho content.
Benchmark muc tieu (proxy, khong co so faith rieng): D1>30%, D7>15%, D30>8%.

5) CHECKLIST THAN HOC DA HE PHAI: doc ca chuong truoc khi gan verse vao chu de; verse hien thi nguyen van + double-check reference (loi #1 cua AI apps); prayer huong thang God/Jesus/HolySpirit — khong qua Mary/thanh, khong che thuc hanh Catholic (backlash Hallow 2 chieu); cau hoi mo khong gia dinh lap truong; chi 66 sach chung + FAQ deuterocanon; GHI RO 'content do nguoi soan, khong AI' (backlash Pray.com; co cau that). CAM trong core: Mary/thanh/rosary/purgatory, faith-alone vs works, sola scriptura, Eucharist, chinh tri, prosperity gospel, end-times, tongues, predestination.

6) CAVEATS: chua co volume search es chinh xac (can ahrefs/Semrush truoc khi chot thu tu topic es); khong co benchmark retention faith rieng; cau hoi 3-lua-chon la bet chua benchmark; gio push la best-practice nganh chua A/B; pt/fr thieu research van hoa.

QUYET DINH OWNER (19/07): kho chu de v1 chi gom lop 1 (topic theo cam xuc/hoan canh) + lop 2 (verse gan chu de, tra ca kho client shuffle) — DUNG nhu spec da phong van. Series 5-7 ngay: LUI lam ung vien v2 (khi co tin hieu retention that), khong dua vao spec M1. Lam ro them: cau hoi 3 lua chon la format chua app lon nao dung trong daily devotional dai chung (doi thu chi co quiz dung/sai cho tre em hoac journaling mo) — la differentiator can do sau launch, khong phai chac thang.

QUYET DINH OWNER (19/07, tiep): (a) viec chon ngon ngu/ban dich TIEP TUC DE SAU (TASK-25 van treo — khong chot trong vong nay); (b) kho chu de v1 CHOT: 8 chu de Tier 1 (Lo au & so hai, Tinh yeu thuong, Suc manh, Hy vong, Binh an, Chua lanh, Khich le, Cau nguyen), chi lop 1 + lop 2; Tier 2 va pack theo mua de sau. (c) Thu tu block trong 1 ngay content: owner dang can nhac (verse->reflection->pray vs verse->pray->reflection) — xem phan tich trong conversation, de xuat cua AI: verse -> reflection -> question -> pray (pray dong).

QUYET DINH OWNER (19/07, chot content playbook): Template 1 ngay = 4 block theo thu tu verse -> reflection SIEU NGAN (1-2 cau: 1 y boi canh + 1 y ap dung) -> question 3 lua chon -> pray dong (40-80 tu). Reflection la phan them so voi y tuong goc 3 phan; chon ban sieu ngan de can bang cong soan. Schema nen: (a) cot reflection co the mo rong do dai sau; (b) chua cho kha nang pray-theo-lua-chon-question (v1 dung 1 pray chung). Kho chu de v1: 8 chu de Tier 1, lop 1+2. CONTENT PLAYBOOK COI NHU CHOT — con bo ngon ngu/ban dich van treo (TASK-25), AC#3 se check not khi chot phan do.

SPEC POINTER (19/07): cac quyet dinh content playbook da gom vao doc-1 'Bible API Product Spec' (FR-1 template 4 block, FR-2 8 chu de lop 1+2, Content guideline, Out of scope). Chi tiet research + guideline day du van o notes task nay.
<!-- SECTION:NOTES:END -->
