---
id: TASK-20
title: >-
  Dung bo workflow AI cho Claude Code (boundaries 3 tang + Stop hook + /ship +
  /spec-interview thu nghiem)
status: In Progress
assignee:
  - '@snowstorm6'
  - '@claude'
created_date: '2026-07-17 14:35'
updated_date: '2026-07-19 06:41'
labels: []
dependencies: []
documentation:
  - backlog/docs/doc-1 - Bible-API-Product-Spec.md
priority: high
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ap dung ket qua nghien cuu cong dong 07/2026 + vong phan bien doc lap 17/07 (bang chung o Notes): khong cai framework SDD/skill nang; dung 3 thanh phan nhe, tu che, check-in vao repo:
1. AGENTS.md: sua muc boundaries thanh 3 tang (luon lam / hoi truoc / cam) — KHONG lam file phinh (giu <~200 dong; ETH study: file dai/sinh-san la net-negative).
2. Stop hook chan tuyen bo hoan thanh khi typecheck/lint do — bat buoc check stop_hook_active (chong infinite loop, issue #10205) + fail-open khi check flaky.
3. Lenh /ship: verify (check+typecheck+build+test) -> commit -> push.
DA CAT /spec-interview: mon yeu nhat — gia tri chua duoc chung minh o dau (chi anecdote), rui ro hype cao nhat; vong spec M1 lam bang hoi thoai thuong, neu sau nay thay lap lai that su thi moi promote thanh command (nguyen tac: promote prompt -> command chi sau khi da go lap lai nhieu lan).
Dieu kien dao thai: mon nao khong duoc dung thuong xuyen sau 2-3 tuan thi xoa. Tieu chi danh gia theo 3 habit: grow-tu-failure / budget+prune <200 dong / rule bi vi pham lap lai -> chuyen thanh gate.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 4 mon duoc dung tren bible-api (AGENTS.md boundaries 3 tang, Stop hook, /ship, /spec-interview)
- [x] #2 Chay lua that /spec-interview cho vong spec M1
- [ ] #3 Sau 2-3 tuan: danh gia giu/xoa tung mon (review 2026-08-07, xem task review)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. AGENTS.md: cau truc lai muc boundaries thanh 3 tang (luon lam / hoi truoc / cam), giu facts hien co, khong tang tong do dai dang ke
2. Stop hook: .claude/hooks/stop-verify.sh + .claude/settings.json — khi co thay doi src/test chua commit: typecheck + biome check; do thi chan stop (exit 2); check stop_hook_active chong loop; fail-open + ghi log de review. Test can DB nen KHONG chay trong hook, don vao /ship
3. .claude/commands/ship.md — verify (check, typecheck, build, test) -> commit -> push
4. /spec-interview: .claude/commands/spec-interview.md — phong van tung cau -> spec, output ra Backlog doc (doc-1) voi FR/AC-ID
5. Chay lua that /spec-interview cho M1 (AC #2); AC #3 danh gia sau 2-3 tuan bang log/transcript
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
TOM TAT BANG CHUNG (nghien cuu 17/07/2026, 8 research agents):
- SDD framework nang: Scott Logic do cham ~10x van ship cung bug; martinfowler.com: Kiro bien 1 bug fix thanh 4 story/16 AC, agent phot lo spec ('ao giac kiem soat'); Thoughtworks Radar 4/2026 giu SDD o 'Assess'; Kent Beck: SDD dong bang gia dinh dung luc dang le phai hoc. Cac con so '3-10x hieu qua' deu la marketing khong nguon.
- Cai cong dong THUC SU tai dung (arXiv 2602.14690, 2926 repos): ~90% chi dua vao context file; skills check-in chi 158 repos, trung vi 2 skill/repo; hooks <20%. Lenh chay nhieu nhat: ship/verify/preflight/review/deploy. Skill planning: noi nhieu, hiem duoc commit.
- Superpowers 150k sao: benchmark chi ~9-14% loi, am voi task nho; retention luong cuc; chi 'brainstorming' song sot qua moi loi che.
- Nguyen tac vang: promote prompt thanh command chi khi da go lap lai nhieu lan; moi lan agent sai -> them 1 dong CLAUDE.md.
- Do manh bang chung tung mon: AGENTS.md 6-muc (manh nhat) > /ship (manh) > Stop hook (nguyen ly manh, do phu <20%) > /spec-interview (practitioner lore, rui ro hype cao nhat - phai chung minh o M1).
Nguon chinh: github.blog AGENTS.md study, code.claude.com/docs/en/best-practices, blog.scottlogic.com spec-kit trial, martinfowler.com sdd-3-tools, arxiv 2602.14690, HN 45935763 + 48739459, addyosmani.com/blog/good-spec, howborisusesclaudecode.com

NGHIEN CUU BO SUNG (17/07, 1 agent): BMAD-method (50.7k sao, v6.10.0) = full agile-ceremony simulation (12+ role agents, 34+ workflows, PRD->architecture->epics->stories) — dung loai SDD nang da bi loai. Bang chung doc lap: issue #1235 cua chinh ho: create-story ton 80-100k token/buoc do re-doc PRD 1400 dong + arch doc 4800 dong (con open); ranthebuilder.cloud trial: 6 ngay + ~$200 cho 1 feature, khuyen 'skip entirely' cho viec nho; HN 45156172: nhiet tinh niche + dau hieu 'illusion of control'; KHONG tim thay bao cao retention dai han nao cho du an solo. VERDICT: skip framework. STEAL 1 y cho /spec-interview: pattern 'Advanced Elicitation' — sau khi draft spec, offer 3-5 lang kinh challenge co ten (pre-mortem / inversion / MVP-minimalist / edge-case stress / persona role-play) de owner chon soi lai draft; ~20 dong them vao command, khong artifact moi. Khong co gi cai thien mon 1-3.

PHAN BIEN DOC LAP (17/07, refute-agent): (1) AGENTS.md — WEAKENED: study ETH Zurich (arXiv, 138 repos): context file trung binh KHONG tang task success, ton +20% inference; file do LLM sinh ra am (-3%), file nguoi viet tay chi +4%; Lulla 2026: file curated giam runtime -28.6%/token -16.6% (loi ve chi phi, khong phai correctness). Adherence decay do luong duoc (arXiv 2507.11538): qua ~150 dong bat dau bo rule. => Chi dang lam neu NGAN (<~200 dong), viet tay, grow tu loi that. (2) Stop hook — SURVIVES co dieu kien: chua ai do luong 'proven'; hiem hoa that = infinite loop (issue #10205) — bat buoc check stop_hook_active + fail-open khi check flaky; framework Elixir claude da phai doi default sang non-blocking. Con so '<20% adoption' KHONG verify duoc — bo. (3) /ship — WEAKENED ve framing: 'most-used' khong co data do luong nao (chi list curated + self-report); nhung profile 'fixed-shape, lap lai nhieu' dung la loai command song sot theo practitioner. (4) /spec-interview — 1-trang throwaway SURVIVES (tinh throwaway trung hoa failure mode #1 cua SDD = stale spec); gia tri van CHUA chung minh — giu dung kill criteria M1. HABITS GIU HIEU QUA (evidence tot nhat): a) grow-tu-failure, khong viet upfront; b) budget <~200 dong + prune dinh ky rule da thanh nep/stale; c) rule may moc bi vi pham lap lai -> chuyen thanh hook/CI gate thay vi them dong markdown.

QUYET DINH 17/07 (sau vong phan bien): CAT /spec-interview khoi scope — mon duy nhat khong co bang chung gia tri (anecdote-only), dung nguyen tac 'promote prompt thanh command chi khi da go lap lai nhieu lan' (chua go lan nao). Vong spec M1 se lam bang hoi thoai thuong; y tuong 'challenge lenses' (pre-mortem/inversion/MVP-cut) van dung duoc trong hoi thoai, khong can command. Task con 3 mon: boundaries 3 tang / Stop hook / /ship.

NGHIEN CUU CO CHE REVIEW (18/07): cong dong hau nhu KHONG lam scheduled pruning — pattern thuc te la 'rot until failure' (pruning khi Claude bat dau lo rule); 1 practitioner dang tin duy tri duoc = monthly checklist 5 phut. Khong co bao cao nao ve 'review sau N tuan' duoc thuc thi dung hen. => Co che chon: TASK-21 (review 2026-08-07, dep TASK-20) voi lenh do NHUNG SAN trong task (grep transcript ~/.claude/projects dem /ship — da verify hoat dong; hook tu ghi log). RANG BUOC DESIGN MOI cho Stop hook: phai append timestamp + ket qua (block/pass) vao log file ngay tu dau — khong ghi log thi den ngay review khong co du lieu, khong tai tao lai duoc.

TRIEN KHAI XONG (18/07, commit 17146c6): AGENTS.md boundaries 3 tang (147->160 dong, duoi budget 200; sua luon ref stale votd.controller.js); .claude/hooks/stop-verify.sh + settings.json (test tay 3 nhanh: stop_hook_active->pass, no-changes->pass, file TS loi->BLOCK exit 2, log ghi dung); .claude/commands/ship.md (harness da nhan dien skill /ship). AC con lai = review 07/08 (task review rieng).

--- GHI CHU HOP NHAT 2 PHIEN (19/07): 2 phien lam viec song song da tao 2 ban trien khai. Ban giu lai: hook + settings + ship.md cua phien 17-18/07 (commit 17146c6 — hook co log phuc vu review). Phien con lai (18-19/07) da: (a) dung THEM /spec-interview va CHAY LUA THAT thanh cong voi owner cho spec M1 (16 cau -> spec, nhieu vong sua) — mau thuan voi quyet dinh 'CAT /spec-interview' o tren; mon nay da ton tai + co 1 lan dung that, se phan xu o review 07/08; (b) research thi truong/ban dich/paid UA + content playbook; (c) spec chuyen thanh doc-1 voi FR/AC-ID. Notes phien 2 giu ben duoi. ---

Da dung 4 mon (18/07/2026):
1. AGENTS.md: muc Ranh gioi tach 3 tang (Luon lam / Hoi truoc / Cam) + muc 'Dieu can biet' rieng.
2. Stop hook: .claude/hooks/stop-verify.sh + .claude/settings.json — khi co file .ts thay doi ma typecheck/biome do thi exit 2 chan agent ket thuc luot (co guard stop_hook_active chong lap vo han). Da test: clean tree pass, code loi bi chan kem output loi.
3. /ship: .claude/commands/ship.md — verify (check+typecheck+build+test) -> review diff -> commit -> push; noi duy nhat chay verify nang; khong deploy.
4. /spec-interview: .claude/commands/spec-interview.md — phong van tung cau, output spec 1 trang 5 muc, luu vao Backlog task, khong tao file spec roi.
Ghi chu moi truong: node_modules chua cai tren may -> da npm install; package-lock.json bi npm prune optional deps nen da git checkout khoi phuc (khong commit thay doi lockfile).
Con lai: AC#2 chay lua that /spec-interview cho M1; AC#3 danh gia giu/xoa sau 2-3 tuan (~08/08/2026).

CHAY LUA /spec-interview cho M1 (18/07/2026) — 16 cau hoi, ket qua:
- API la backend RIENG cho app mobile doc Kinh Thanh cua owner (KHONG phai public API; cau 1 tra loi nham, cau 2 dinh chinh).
- 3 luong: (a) daily verse + pray + question suy ngam (1 cau hoi, 3 lua chon, khong dung/sai; pray+question GAN THEO VERSE, moi user cung 1 verse/ngay); (b) explore theo chu de: API tra TOAN BO verses cua chu de, cache 24h, client tu shuffle; (c) doc theo sach/chuong, nhieu ban dich.
- Data pray/question/chu de: TU SOAN THU CONG, nap qua seed — API van read-only.
- User data (favorite/streak/notes): app luu local — KHONG auth.
- CAT: full-text search (/api/search + GIN) khoi API surface.
- Tieu chi xong M1: app mobile tich hop chay that toan bo flow tren prod.
- CHUA CHOT (spec cho): ngon ngu noi dung + danh sach ban dich release dau — phu thuoc TASK-25 (research thi truong). Luu y: ban nhap dau ghi 'da ngon ngu theo client' la SAI, owner dinh chinh o vong duyet.
Spec nhap v0.2 da duoc owner duyet cau truc; se chot 1 lan sau khi TASK-25 xong. Bai hoc cho /spec-interview: cau hoi dang multiple-choice de owner bam nham — can hoi xac nhan lai cac cau tra loi bat ngo.

SPEC M1 — BAN CHOT v1.0 (owner duyet 18/07/2026):

# Spec: Bible API M1 — backend cho app mobile doc Kinh Thanh

## Objective
Bien Bible API thanh backend rieng cho app mobile doc Kinh Thanh (cua owner): daily verse + pray + question suy ngam, explore verse theo chu de, doc theo sach/chuong da ban dich, da ngon ngu. Khong phai public API.

## Context
- Hien co: NestJS+Drizzle+PG read-only, 2 ban dich (Cadman vi, KJV en), endpoints translations/books/verses/search/votd tren Fly.io.
- NGON NGU/BAN DICH release dau (chot tu TASK-25, toan bo public domain): vi=Cadman 1934, en=WEB (mac dinh)+KJV, tl=Ang Biblia 1905 (dung ban 1905), pt=Almeida 1911, es=Reina-Valera 1909, fr=Louis Segond 1910. Can import 4 ban dich moi (WEB/tl/pt/es/fr — 5 ban text) vao DB. Bo ID/ZH/KO.
- Noi dung curate (ten chu de, pray, question 3 lua chon khong dung/sai): TU SOAN THU CONG, DU CA 6 NGON NGU, tra theo ngon ngu client gui len; nap qua seed — API van read-only.
- Daily: moi user cung 1 verse/ngay; pray+question GAN THEO VERSE.
- Explore: API tra TOAN BO verses cua 1 chu de (cache 24h); client tu shuffle.
- User data (favorite/streak/notes): app luu local — khong auth.

## Out of scope
1. Full-text search — cat /api/search (+ GIN index neu khong con dung).
2. Auth, user accounts, write/admin API.
3. Cam ket contract cho ben ngoai (duoc doi tu do den khi app tich hop).
4. AI sinh noi dung runtime. 5. Parse Strong's (TASK-16 rieng). 6. Ngon ngu ngoai 6 ngon ngu tren (ID/ZH/KO... de sau).

## Acceptance criteria
1. votd tra verse cua ngay + pray + question (3 lua chon) theo ngon ngu client, du 6 ngon ngu.
2. Endpoint danh sach chu de + toan bo verses cua 1 chu de, theo ngon ngu, cache 24h.
3. Doc theo sach/chuong + chon ban dich hoat dong voi ca 6 ban dich (7 ban text ke ca KJV).
4. /api/search da go khoi API surface.
5. Quy trinh import ban dich + nap noi dung curated (seed/script) duoc document trong AGENTS.md.
6. App mobile tich hop chay that toan bo flow tren prod — tieu chi 'xong' cuoi cung cua M1.

## Boundaries
- Agent tu quyet: shape schema/DTO/endpoint moi, to chuc bang da ngon ngu — nhung trinh bay truoc khi implement.
- Hoi owner truoc: xoa bang/code hien co (search, votd_calendar, book_aliases), merge PR #7, doi contract sau khi app da tich hop, phat hanh tai nuoc can kiem luat ban quyen dia phuong (PH...).
- Cam: them auth/write API, commit secret, tu bia noi dung pray/question thay owner.

LUU Y RUI RO da canh bao owner: cong soan curate x6 ngon ngu la rat lon voi solo dev; owner van chot om het. Supabase free 500MB — 7 ban text (~62k cau/ban) can kiem dung luong khi import.

SPEC DA CHUYEN NHA (19/07): spec chinh thuc nam o doc-1 'Bible API Product Spec' (backlog/docs/, xem: backlog doc view doc-1 --plain), phien ban v1.1 co FR/AC-ID. Ban 'SPEC M1 v1.0' trong notes phia tren chi con gia tri lich su — DUNG dung lam nguon su that. Quy uoc moi: task tham chieu spec bang dong 'Implements: FR-n (AC-n.m)' trong description + co --doc; khong duy tri bang nguoc spec->task (owner bo), tra nguoc bang: backlog search 'FR-n'.
<!-- SECTION:NOTES:END -->
