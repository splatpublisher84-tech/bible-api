---
id: TASK-20
title: Dung bo workflow SDD-lite cho Claude Code (context file + hook + 2 commands)
status: To Do
assignee: []
created_date: '2026-07-17 14:35'
updated_date: '2026-07-17 14:42'
labels: []
dependencies: []
priority: high
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Ap dung ket qua nghien cuu cong dong 07/2026 (bang chung day du o Notes): khong cai framework SDD/skill nang; thay vao do dung 4 thanh phan tu che, check-in vao repo de tai dung cho du an khac:
1. AGENTS.md theo chuan 6 muc (commands, testing, structure, code style, git workflow, boundaries) — boundaries chia 3 tang: luon lam / hoi truoc / cam.
2. Hook chan agent tuyen bo hoan thanh khi test/typecheck con do.
3. Lenh /ship: verify -> commit -> push.
4. Lenh /spec-interview: AI phong van owner tung cau roi viet spec 1 trang (Objective / Context / Out of scope / Acceptance criteria / Boundaries); spec la artifact dung 1 lan, ship xong luu vao task lien quan.
Dieu kien dao thai: thanh phan nao khong duoc dung thuong xuyen sau 2-3 tuan thi xoa; /spec-interview phai chung minh gia tri trong vong viet spec san pham (M1).
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
