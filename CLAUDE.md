# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc với repo này.

## Thông tin dự án

Facts chung (commands, kiến trúc, data model, deploy, env, endpoints, ranh giới)
nằm ở **`AGENTS.md`** — nguồn sự thật chung cho mọi AI agent, đồng bộ với code thật.
Claude Code đọc `AGENTS.md` tự động; đọc file đó trước.

Tóm tắt: Bible API — REST backend (**NestJS 11 + Fastify + TypeScript + Drizzle ORM +
PostgreSQL 16**) phục vụ dữ liệu Kinh Thánh. **Feature-complete** (KHÔNG phải scaffold).
Refactor 2026 từ Express+JS+pg, giữ 100% API contract.

## Setup Claude Code cho repo này

### Rules (`.claude/rules/`) — tự nạp khi sửa file liên quan
- `api-patterns.md` — quy ước Module→Controller→Service→Repository (NestJS)
- `database.md` — Drizzle schema/migrations, repository pattern
- `deployment.md` — Fly.io + Supabase + drizzle baseline
- `monitoring.md` — dashboard + metrics

### Skills (`.claude/skills/`)
- `/deploy` — quy trình deploy đầy đủ (chỉ user gọi được, AI không tự chạy)
