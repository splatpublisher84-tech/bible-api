---
id: TASK-25
title: 'Research thi truong: chon ngon ngu + ban dich cho ban release dau cua app'
status: In Progress
assignee:
  - '@snowstorm6'
created_date: '2026-07-18 13:05'
updated_date: '2026-07-19 06:41'
labels: []
dependencies: []
documentation:
  - backlog/docs/doc-1 - Bible-API-Product-Spec.md
priority: high
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
App mobile doc Kinh Thanh (spec M1 dang phong van, xem TASK-20 notes) can quyet: ban release dau support nhung ngon ngu nao cho noi dung curated (chu de, pray, question suy ngam) va nhung ban dich Kinh Thanh pho bien tuong ung nao. Research: cac app tuong tu (YouVersion, Bible.com, Glorify, Hallow, Abide...) dang support ngon ngu/ban dich nao, thi truong nao de vao, cong curate noi dung theo tung phuong an. Ket qua research la dau vao de chot spec M1 (spec dang cho quyet dinh nay).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Danh sach ngon ngu de xuat cho ban dau kem ly do (thi truong, cong curate)
- [x] #2 Moi ngon ngu co ban dich Kinh Thanh pho bien de xuat (uu tien public domain / co san trong PR #7)
- [x] #3 Owner chot phuong an -> ghi vao spec M1
- [x] #4 Moi ngon ngu (vi/en/tl/pt/es/fr): danh sach DAY DU ban dich public domain tiem nang (khong chi 1 ban) + danh sach ban dich co ban quyen tiem nang kem chu so huu, de danh mo rong/xin license sau
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
KET QUA DEEP-RESEARCH (18/07/2026, 101 agents, 19 nguon, 25 claims verify — 23 confirmed / 2 refuted):
KHUYEN NGHI: release dau 1 ngon ngu curate = TIENG VIET, ban dich chinh Cadman 1934; giu KJV Strong's (+co the them WEB/ASV) lam ban tieng Anh doc tham chieu KHONG curate rieng. Khong them ngon ngu curate thu 2 cho toi khi co tin hieu user that.
CAN CU (verified 3-0 tru khi ghi khac):
- Cadman 1934 da PUBLIC DOMAIN toan bo (NT 1/1/2019, OT 1/1/2021 — ebible.org) va van la ban Tin Lanh tieng Viet chuan muc (RVV11 chi la ban hieu dinh; luu y gioi tre dung RVV11 nhieu hon).
- MOI ban tieng Viet hien dai deu co ban quyen, can license: NVB (VBI), VIE2010/RVV11 (Bible Society VN/UBS), KTHD (Biblica), BPT (Bible League © 2010).
- Tieng Anh: chi KJV/WEB/ASV/YLT/Darby la PD (KJV co Crown patent rieng o UK); NIV/ESV/NKJV/NLT/CSB/NASB deu khoa ban quyen (ESV toi da 500 cau lien tiep).
- YouVersion ap dao tuyet doi: ~3.800 ban dich / 2.400 ngon ngu, ~1 ty luot cai (2025) — khong the canh tranh bang do phu; loi the cua app la noi dung curate.
- Ngach vi it bi phuc vu: Hallow chi 7 ngon ngu, KHONG co tieng Viet (verified). Glorify/Abide/Dwell/bolls: khong co claim survive — chi la suy luan.
- Quy mo Tin Lanh VN nho: 0,5-1,6 trieu, ~2/3 dan toc thieu so — ky vong user base nho. CHUA co data ve nguoi Viet hai ngoai (My/Uc) — thi truong tiem nang chua danh gia.
Cho owner chot (AC#3) roi ghi vao spec M1 (TASK-20 notes).

DINH CHINH scope (owner, 18/07): cau hoi that la app nen support NHUNG ngon ngu/quoc gia nao co nhieu user tiem nang nhat — KHONG tap trung rieng thi truong VN. Research vong 1 o tren over-index vao tieng Viet do de bai sai; giu lai phan license (Cadman PD, ban Anh PD) van co gia tri. Chay research vong 2 voi workflow gon hon.

KET QUA RESEARCH VONG 2 (18/07/2026, workflow gon 6 agents, key claims da verify):
KHUYEN NGHI RELEASE DAU: 3 ngon ngu VI + EN + TL (Tagalog).
- VI: Cadman 1934 (PD) — thi truong nha, gan nhu khong canh tranh, validate san pham.
- EN: WEB (hien dai, PD, nen lam mac dinh) + KJV — lingua franca phuc vu Philippines/Nigeria/India/diaspora, khong dat cuoc vao US (YouVersion 1 ty install + Hallow/Glorify von lon).
- TL: Ang Biblia 1905 (PD, phai dung dung ban 1905, khong phai revised 1915/33). Philippines = khoang trong tot nhat: 144M Co Doc nhan 2050 (Pew), YouVersion pho bien nhat tai do nhung khong co devotional ban dia chat luong, user song ngu -> noi dung curate EN tai dung duoc.
VONG 2 (khi co tin hieu organic): PT-BR (Almeida 1911 PD; Brazil = ~60% user Glorify, tiem nang lon nhat nhung canh tranh ban dia cao) va/hoac ES (RV1909 PD; RV1960 khoa (c) UBS); FR (LSG 1910 = ban pho bien nhat MA PD — truong hop vang) cho Phi Phap ngu. ID chi khi chap nhan TSI/AYT CC BY-SA. BO QUA: ZH (WeDevote + rao China), KO (KRV 1961 'het ban quyen' la SUSPECT).
GTM: launch theo lich phung vu (Mua Chay/Phuc Sinh/Giang Sinh), localize ASO metadata (+38-128%/locale), growth qua mang luoi hoi thanh.
CAVEATS: PD tinh theo luat My — can kiem luat ban quyen dia phuong (PH/ID/KR); khong co case study solo-indie co so lieu; gia dinh 'PH tai dung noi dung EN' la suy luan chua validate.
Nguon chinh: pewresearch.org 2050, youversion.com 1B installs, ebible.org (RV1909/LSG), bible-discovery.com (Ang Biblia 1905), bloomberglinea.com (Glorify Brazil), americanbible.org (RV1960).
Cho owner chot phuong an (AC#3).

QUYET DINH OWNER (18/07/2026, AC#3): OM HET nhom tiem nang + hoi tiem nang o release dau — 6 ngon ngu, toan bo ban dich public domain:
- VI: Cadman 1934 | EN: WEB (mac dinh) + KJV | TL: Ang Biblia 1905 (dung ban 1905) | PT-BR: Almeida 1911 | ES: Reina-Valera 1909 | FR: Louis Segond 1910.
- BO: ID (license phuc tap), ZH (WeDevote + rao China), KO (KRV suspect).
- Noi dung curate (chu de, pray, question): SOAN DU CA 6 NGON NGU (owner chot, da duoc canh bao ve khoi luong cong viec).
- Nho kiem luat ban quyen dia phuong (PH...) truoc khi phat hanh tai nuoc do.
Quyet dinh da ghi vao spec M1 (TASK-20 notes).

MO RONG scope (owner, 18/07): ngon ngu da chot, nhung can kiem ke ban dich ky hon — moi ngon ngu co bao nhieu ban PD dung duoc, va note kem cac ban co ban quyen tiem nang (ai giu quyen) cho ke hoach mo rong. Chay research vong 3.

KIEM KE BAN DICH VONG 3 (18/07/2026, 7 agents, nguon kem tung muc trong bao cao — file goc: scratchpad wsovhet12.output):

BO LAUNCH KHUYEN NGHI (PD/tu do, co data so tru khi ghi khac):
- vi: VI1934 Cadman (PD, USFM/SQL ebible.org) + KTHD/Open Vietnamese Contemporary Biblica 2015 (CC BY-SA 4.0, ebible.org vieovcb) — 1 co + 1 hien dai.
- en: WEB (PD, default) + BSB Berean (PD/CC0 2023, ban hien dai dep nhat nhom free) + KJV (PD, tru UK Crown patent); tuy chon ASV/YLT/Darby/LSV(CC BY-SA).
- tl: ASND Ang Salita ng Dios Biblica (CC BY-SA 4.0, USFM qua open.bible) lam CHU LUC + Ang Biblia 1905 (PD toan cau; CHUA co USFM chinh tac — chi SWORD/text cong dong, can convert). Revision 1915/1933 KHONG PD (1933 -> 2029).
- pt: Almeida Recebida (PD, XML/MySQL/USFM get.bible) lam mac dinh + Biblia Livre BLIVRE (CC BY 3.0 BR, GitHub); ARC 1911 (PD) CHI khi kiem duoc nguon sach — file mang lan lon voi ARC 1969/95 (c) SBB. TB 1917: PD My nhung PD Brazil tu 2027.
- es: RV1909 (PD toan cau, USFM ebible.org) mac dinh + VBL Version Biblia Libre (CC BY-SA); tuy chon PDDPT (CC BY). RVG la CC BY-NC-ND — KHONG dung (cam monetize).
- fr: LSG 1910 (PD toan cau) mac dinh + neo-Crampon Libre francl (CC BY-SA, ban Cong giao — quan trong vi user Phap ngu da so goc Cong giao); tuy chon Darby fr/Ostervald.

BAN (c) TIEM NANG (mo rong sau, kem duong xin):
- vi: RVV11/VIE2010 (UBS/BSV — qua API.Bible kha thi nhat), NPD-CGKPV 1998 (#1 Cong giao, lien he truc tiep), BPT (Bible League), NVB (nvbible.org).
- en: NIV (Biblica — kho), ESV (Crossway API free non-commercial khong bundle), NLT/CSB (API.Bible tra phi), NKJV, NASB (lockman.org).
- tl: MBB/RTPV05 (Philippine Bible Society — #1 user PH mong doi, translations@bible.org.ph), ABTAG01.
- pt: NVI pt (Biblica), ARA/NTLH/ARC69/NAA (SBB — chat), ACF (Trinitarian — de xin nhat nhom (c), quota 1100 cau).
- es: RV1960 (#1 tuyet doi, ABS/UBS qua API.Bible), NVI, NTV (Tyndale), DHH.
- fr: Segond 21 (#1, SBG), BDS Semeur (Biblica — de xin nhat), TOB/NEG.

CAVEATS: (1) Cac moc PD cua ebible.org dan chieu LUAT MY — kiem luat noi phat hanh (KJV Crown patent UK; TB1917 Brazil 2027; AngBiblia 1933 -> 2029). (2) CC BY-SA bat buoc attribution + share-alike tren text. (3) Coi chung nham phien ban cung ten (ARC 1911 vs 1969/95; AngBiblia 1905 vs 2001). (4) API.Bible KHONG cho cache/bundle text — xung dot self-host, chi hop khi chap nhan goi API ngoai. (5) Repo tong hop (damarals/biblias, abibliadigital) lan ban (c) — khong dung lam nguon.

MO RONG scope lan 2 (owner, 18/07): owner can them goc nhin US-first vs global, VA chien luoc paid ads (se bo tien chay quang cao kiem install). Chay research vong 4: CPI/CPM theo thi truong, monetization app faith, case study paid UA (Hallow/Bible Chat), ngach US Hispanic + diaspora.

KET QUA RESEARCH VONG 4 — PAID UA STRATEGY (18/07/2026, 6 agents; moi so co URL trong bao cao goc, file scratchpad wcgmkhlqc.output):

SO SANH 3 CHIEN LUOC:
- US broad: CPI $2.4-8 (Meta non-gaming), nhung LTV/install median H&F chi ~$1.21, conversion tra phi 2.6% -> LO 3-6x o median. Canh tranh cao nhat (Hallow $40M net 2025, Bible Chat $15M ARR). TRANH giai doan nay.
- Global geo re (PH/BR/VN — trung ngon ngu da chot): CPI $0.22-0.90, nhung RPI D60 SEA ~$0.11 (kem NA 5x), eCPM ads $1-2.3 (=1/6-1/10 US), bot traffic 20-30% tier-3 -> van lo ~5x NHUNG lo tuyet doi nho: $1.000 mua ~1.200 installs lam DATA (retention/funnel).
- US Hispanic (es): 68M Hispanic, ~26-29M Christian noi TBN, 25% dung Bible app (Pew — cao hon White 17%); CPC tieng TBN re hon English (khong co so cung, PHAI TU TEST); monetize gia US (payer Y1 $27) -> NGACH DUY NHAT co duong LTV > CPI voi von nho. Doi thu: YouVersion es, Hallow Espanol (Catholic) — khoang trong phia Protestant/Evangelical Hispanic.
- Diaspora Viet-US: tep ~720K — QUA NHO cho paid UA, bo.

BAI HOC CASE STUDY:
- Playbook re nhat = Bible Chat: 6 account TikTok niche organic (253M views), video viral moi do tien Spark-ads; ASA 2.000 keywords; ne CPI My bang thi truong non-English.
- Format thang: POV/slideshow verse, 'relatable scenario (lo au) -> app la loi giai', comfort > guilt; UGC giam CPI ~20%.
- Seasonality = don bay lon nhat: Hallow Lent = product launch dinh ky ($10M net rieng 3/2024); don budget Lent (Feb-Mar) + Advent kem challenge deadline.
- Canh bao Glorify: $40M von nhung ~$20K revenue/thang — tien khong tu sinh monetization.

LO TRINH KHUYEN NGHI: (0-2 thang, ~$0) TikTok organic multi-account en+es -> (1-3 thang, $500-1500/th) ads PH/BR/VN mua data + 1 ad set nho US Hispanic es do CPI that -> tin hieu tot (LTV>CPI es-US hoac D30>median) thi don budget vao mua Lent/Advent; 2 mua test ma RPI<20% CPI moi geo -> dung paid, ve organic.

CAVEATS: khong co benchmark CPI rieng faith apps / es-US (diem mau chot phai tu test); revenue Hallow/BibleChat la uoc tinh ben thu 3; LTV $1.21 la median H&F — app PD content kha nang thap hon; loc bot bang retention, khong dem install tho.

CHI TIET PLAYBOOK TIKTOK ORGANIC (giai thich cho owner 18/07, luu lam tai lieu thuc thi):
1. Lap NHIEU account niche (Bible Chat dung 6), khong phai 1 account thuong hieu — moi account 1 nhan cach noi dung (verse an ui lo au / cau hoi suy ngam / POV ke chuyen / account es RIENG, khong tron ngon ngu). Ly do: moi account = 1 ve xo so thuat toan doc lap, test nhieu angle song song.
2. San xuat video hang loat chi phi ~0: slideshow verse + nhac trend, hoac POV chu tren man hinh ('POV: ban dang lo lang va mo app thay cau nay'). Khong can quay mat. COMFORT > GUILT. Nhip 1-3 video/ngay/account, batch san xuat theo tuan.
3. De organic chay 1-2 tuan, doc tin hieu: tim video but len bat thuong (engagement benchmark Bible Chat ~5.67%).
4. Chi luc do moi dung tien: SPARK ADS tren chinh video da viral (giu view/comment) — loai rui ro creative toi bang chi phi 0.
5. en + es song song de do cau hoi con thieu so lieu: faith content es co CPI/engagement tot hon en khong — tra loi bang data cua minh sau 4-8 tuan.
Luu y: 'gan $0' la tien, khong phai thoi gian (viec deu tay hang ngay); link bio ve landing/waitlist -> chay duoc TRUOC khi app xong; verse PD (KJV/WEB/RV1909) dung thoai mai trong video; moi account can template/giong rieng that su, khong clone y nguyen (TikTok de y cum account trung noi dung).

GHI CHU KIEN TRUC (owner 18/07): sau khi xong kien truc + API, them ban dich = seed database. DUNG nhung kem 2 viec: (a) converter theo dinh dang nguon (USFM ebible.org / SWORD / CSV — Ang Biblia 1905 khong co USFM chuan, phai convert tu SWORD/text cong dong); (b) kiem dung luong Supabase free 500MB khi len ~13 ban (~400k+ cau).

DE XUAT DANG TREO — CHUA CHOT (18/07/2026): bo ban dich launch de xuat = 6 ngon ngu / ~13 ban ('chinh + kem' vong 3: vi=Cadman+KTHD; en=WEB+BSB+KJV; tl=ASND+AngBiblia1905; pt=AlmeidaRecebida+BLIVRE; es=RV1909+VBL; fr=LSG+neoCramponLibre), thu tu uu tien soan noi dung curate theo chien luoc ads: es+en truoc -> vi/tl/pt -> fr cuoi. Owner quyet dinh CHUA chot — can nghien cuu them ve content app truoc (xem ke hoach research content). Spec M1 phan ngon ngu/ban dich van o trang thai treo.

SPEC POINTER (19/07): ket qua nghien cuu o task nay da duoc gom vao doc-1 'Bible API Product Spec' o muc PENDING-1 (bo ngon ngu/ban dich — van treo cho owner chot). Chi tiet kiem ke/so lieu van nam o notes task nay, spec chi giu ket luan.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Research 2 vong (vong 1 deep-research 101 agents — over-index VN do de bai; vong 2 workflow gon 6 agents dung scope). Ket qua: khuyen nghi + owner chot 6 ngon ngu (vi/en/tl/pt/es/fr) toan ban dich public domain, curate du 6 ngon ngu. Verify: key claims kiem chung co nguon (ebible.org, Pew, YouVersion...); quyet dinh ghi vao spec M1 trong TASK-20.
<!-- SECTION:FINAL_SUMMARY:END -->
