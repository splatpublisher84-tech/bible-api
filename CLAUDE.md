# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bible API backend — a Node.js/Express REST API serving Bible verse data from PostgreSQL. Supports multiple translations, multilingual book names (English/Vietnamese), full-text search, and flexible reference parsing. Early-stage project with schema and infrastructure in place; controllers/routes/models are scaffolded but not yet implemented.

## Commands

```bash
# Development (auto-reload via nodemon)
npm run dev

# Production
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Start/stop PostgreSQL (Docker)
docker-compose up -d
docker-compose down

# Test database connection
node src/testdb.js

# Import Bible translation data (converts Bible SuperSearch module format to PostgreSQL)
node scripts/convert-module-to-pg.js <module_dir> <translation_id> <output.sql>
```

## Architecture

**Stack:** Express 5 + PostgreSQL 16 (via `pg` pool) + Docker

**Key dependencies:** helmet (security headers), express-rate-limit, pino/pino-http (structured logging), zod (validation), vitest + supertest (testing)

**Code layout follows Controller-Route-Model pattern:**
- `src/app.js` — Express app setup, middleware (helmet, CORS, rate-limit, pino-http, JSON), top-level routes (`/`, `/health`). Does NOT call `listen()`.
- `src/server.js` — Imports app and starts the HTTP server. Entry point for `npm start` / `npm run dev`.
- `src/config/database.js` — Singleton `pg.Pool` configured from environment variables
- `src/config/logger.js` — Pino logger instance (pretty-print in dev, JSON in production)
- `src/controllers/`, `src/routes/`, `src/models/`, `src/middlewares/` — Scaffolded, not yet implemented

**Database schema** (`sql/001_schema.sql`):
- `testaments` — OT/NT metadata
- `books` — 66 books with multilingual names, categories, testament FK
- `translations` — Bible versions with language, public domain flag, Strong's concordance flag
- `verses` — Main content table; all translations stored in one table differentiated by `translation_id`. Has GIN full-text search index on `text_search_vector`
- `book_aliases` — Alternative names for flexible reference parsing (e.g., "Gen", "Gn", "Genesis")
- `chapter_info` — Derived metadata: total verses per chapter, per translation

Key design: single `verses` table for all translations (not separate tables per version).

**Data import pipeline** (`scripts/convert-module-to-pg.js`):
Converts Bible SuperSearch module format (info.json + pipe-delimited verses.txt) to PostgreSQL INSERT statements with batch inserts (500 rows) and auto-generated `chapter_info`.

## Deployment

**Production:** Fly.io (`bible-api-ibsnxg.fly.dev`) + Supabase PostgreSQL

```bash
# Deploy (or use /deploy skill)
flyctl deploy

# Set secrets
flyctl secrets set KEY=VALUE
```

Quick deploy with skill: type `/deploy` — runs tests, commits, deploys, verifies.

## Environment Variables

Loaded via `dotenv` from `.env`:
- `PORT` (default 3000)
- `NODE_ENV`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `METRICS_KEY` — protects `/api/metrics` endpoint

## Monitoring

Dashboard at `/dashboard` — 5 pages: Overview, Traffic (6 charts), Logs, Costs, API Reference.

Tracking components:
- `src/middlewares/requestTracker.js` — HTTP requests (client vs internal)
- `src/middlewares/systemTracker.js` — DB queries + memory usage
- `src/public/js/dashboard.js` — Chart.js visualizations

## Claude Code Setup

### Rules (`.claude/rules/`)
Context-specific guidance that loads automatically when editing related files:
- `deployment.md` — Fly.io + Supabase deploy patterns
- `database.md` — Schema, query patterns, pool usage
- `api-patterns.md` — Controller-Route-Model conventions
- `monitoring.md` — Dashboard + metrics architecture

### Skills (`.claude/skills/`)
- `/deploy` — Full deployment workflow with pre-flight checks

### Agents (`.claude/agents/`)
- **bible-backend-advisor** — Biblical domain expertise (data modeling, reference parsing, cross-references)
- **backend-mentor** — Teaching-focused backend guidance in Vietnamese with English technical terms
