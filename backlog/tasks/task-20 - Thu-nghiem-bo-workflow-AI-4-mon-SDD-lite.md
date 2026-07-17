---
id: TASK-20
title: >-
  Dung bo workflow AI 3 mon cho Claude Code (boundaries 3 tang + Stop hook +
  /ship)
status: In Progress
assignee:
  - '@claude'
created_date: '2026-07-17 14:35'
updated_date: '2026-07-17 17:18'
labels: []
dependencies: []
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
- [ ] #1 Sau 2-3 tuan: danh gia giu/xoa tung mon
- [x] #2 3 mon duoc dung tren bible-api (AGENTS.md boundaries 3 tang, Stop hook, /ship)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. AGENTS.md: cau truc lai muc boundaries thanh 3 tang (luon lam / hoi truoc / cam), giu facts hien co, khong tang tong do dai dang ke
2. Stop hook: .claude/hooks/stop-verify.sh + .claude/settings.json — khi co thay doi src/test chua commit: typecheck + biome check; do thi chan stop (exit 2); check stop_hook_active chong loop; fail-open neu lenh loi vi ly do ngoai code. Test can DB nen KHONG chay trong hook, don vao /ship
3. .claude/commands/ship.md — verify (check, typecheck, build, test) -> commit -> push
4. Thu hook chay tay; AC danh gia giu/xoa lam sau 2-3 tuan
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

TRIEN KHAI XONG (18/07, commit 17146c6): AGENTS.md boundaries 3 tang (147->160 dong, duoi budget 200; sua luon ref stale votd.controller.js); .claude/hooks/stop-verify.sh + settings.json (test tay 3 nhanh: stop_hook_active->pass, no-changes->pass, file TS loi->BLOCK exit 2, log ghi dung); .claude/commands/ship.md (harness da nhan dien skill /ship). AC con lai = review 07/08 (TASK-21).
<!-- SECTION:NOTES:END -->
