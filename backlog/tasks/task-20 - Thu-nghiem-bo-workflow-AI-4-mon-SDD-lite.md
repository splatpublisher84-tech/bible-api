---
id: TASK-20
title: Thu nghiem bo workflow AI 4 mon (SDD-lite)
status: To Do
assignee: []
created_date: '2026-07-17 14:35'
updated_date: '2026-07-17 14:35'
labels: []
dependencies: []
priority: high
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ket qua nghien cuu cong dong 07/2026 (3 dot, 8 nhom research agents - xem note). Quyet dinh: KHONG cai framework (spec-kit/Kiro/Superpowers deu bi thuc te bac bo - cham ~10x, token bloat, agent phot lo spec). Ap dung 'SDD-lite' = 4 mon tu che, moi mon la nguyen lieu cong dong da kiem chung:
1. AGENTS.md chuan 6-muc (commands/testing/structure/style-1-snippet/git/boundaries) + boundaries 3 tang (luon lam / hoi truoc / cam) - nguon: GitHub study 2500+ repos, Addy Osmani.
2. Stop hook chay npm test + typecheck (agent khong the tuyen bo xong khi do) - nguon: Anthropic hooks guide, Kent Beck (agent se xoa test do neu khong chan).
3. /ship: verify -> commit -> push (lenh duoc chay nhieu nhat thuc te - Boris Cherny, anthropics/claude-code).
4. /spec-interview: AI phong van tung cau -> viet spec 1 trang (Objective/Context/Out-of-scope/AC dang EARS/Boundaries) - pattern duy nhat song sot cua mang planning (Thariq gist, Superpowers brainstorming). Spec la do dung 1 lan, ship xong dan vao task.
DIEU KIEN DAO THAI: sau 2-3 tuan dung that, mon nao khong duoc chay thuong xuyen thi XOA. /spec-interview phai chung minh trong vong spec M1. Muc tieu dai han: tach thanh template tai dung cho du an khac.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 4 mon duoc dung tren bible-api (AGENTS.md bo sung boundaries, hook, 2 commands)
- [ ] #2 Chay lua that /spec-interview cho vong spec M1
- [ ] #3 Sau 2-3 tuan: danh gia giu/xoa tung mon
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
TOM TAT BANG CHUNG (nghien cuu 17/07/2026, 8 research agents):
- SDD framework nang: Scott Logic do cham ~10x van ship cung bug; martinfowler.com: Kiro bien 1 bug fix thanh 4 story/16 AC, agent phot lo spec ('ao giac kiem soat'); Thoughtworks Radar 4/2026 giu SDD o 'Assess'; Kent Beck: SDD dong bang gia dinh dung luc dang le phai hoc. Cac con so '3-10x hieu qua' deu la marketing khong nguon.
- Cai cong dong THUC SU tai dung (arXiv 2602.14690, 2926 repos): ~90% chi dua vao context file; skills check-in chi 158 repos, trung vi 2 skill/repo; hooks <20%. Lenh chay nhieu nhat: ship/verify/preflight/review/deploy. Skill planning: noi nhieu, hiem duoc commit.
- Superpowers 150k sao: benchmark chi ~9-14% loi, am voi task nho; retention luong cuc; chi 'brainstorming' song sot qua moi loi che.
- Nguyen tac vang: promote prompt thanh command chi khi da go lap lai nhieu lan; moi lan agent sai -> them 1 dong CLAUDE.md.
- Do manh bang chung tung mon: AGENTS.md 6-muc (manh nhat) > /ship (manh) > Stop hook (nguyen ly manh, do phu <20%) > /spec-interview (practitioner lore, rui ro hype cao nhat - phai chung minh o M1).
Nguon chinh: github.blog AGENTS.md study, code.claude.com/docs/en/best-practices, blog.scottlogic.com spec-kit trial, martinfowler.com sdd-3-tools, arxiv 2602.14690, HN 45935763 + 48739459, addyosmani.com/blog/good-spec, howborisusesclaudecode.com
<!-- SECTION:NOTES:END -->
