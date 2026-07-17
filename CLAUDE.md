# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc với repo này.

## Thông tin dự án

Facts chung (commands, kiến trúc, data model, deploy, env, endpoints, ranh giới)
nằm ở **`AGENTS.md`** — nguồn sự thật chung cho mọi AI agent, đồng bộ với code thật.
Claude Code đọc `AGENTS.md` tự động; đọc file đó trước.

Tóm tắt: Bible API — REST backend (**NestJS 11 + Fastify + TypeScript + Drizzle ORM +
PostgreSQL 16**) phục vụ dữ liệu Kinh Thánh. Kỹ thuật hoàn chỉnh (refactor 2026 từ
Express+JS+pg) nhưng về sản phẩm là **bản nháp chưa chốt yêu cầu** — chưa có người dùng
thật; đang chốt spec (M1) rồi đánh giá lại từng phần (backlog TASK-18/19).

## Setup Claude Code cho repo này

### Rules (`.claude/rules/`) — tự nạp khi sửa file liên quan
- `api-patterns.md` — quy ước Module→Controller→Service→Repository (NestJS)
- `database.md` — Drizzle schema/migrations, repository pattern
- `deployment.md` — Fly.io + Supabase + drizzle baseline
- `monitoring.md` — dashboard + metrics

### Skills (`.claude/skills/`)
- `/deploy` — quy trình deploy đầy đủ (chỉ user gọi được, AI không tự chạy)

<!-- BACKLOG.MD GUIDELINES START -->
<CRITICAL_INSTRUCTION>

## Backlog.md Workflow

This project uses Backlog.md for task and project management.

**For every user request in this project, run `backlog instructions overview` before answering or taking action.**

Use the overview to decide whether to search, read, create, or update Backlog tasks.

Use the detailed guides when needed:
- `backlog instructions task-creation` for creating or splitting tasks
- `backlog instructions task-execution` for planning and implementation workflow
- `backlog instructions task-finalization` for completion and handoff

Use `backlog <command> --help` before running unfamiliar commands. Help shows options, fields, and examples.

Do not edit Backlog task, draft, document, decision, or milestone markdown files directly. Use the `backlog` CLI so metadata, relationships, and history stay consistent.

</CRITICAL_INSTRUCTION>
<!-- BACKLOG.MD GUIDELINES END -->
