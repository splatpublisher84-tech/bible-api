# Bible API

REST API serving Bible verse data from PostgreSQL. Supports multiple translations, multilingual book names (English/Vietnamese), full-text search, and Verse of the Day.

**Live:** https://bible-api-ibsnxg.fly.dev

## Quick Start

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Run migrations
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/001_schema.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/002_seed.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/005_book_names_temp.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/003_data_cadman.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/004_data_kjv_strongs.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/006_votd.sql

# 3. Configure environment
cp .env.example .env

# 4. Install and run
npm install
npm run dev
```

Open http://localhost:3000 — [API Docs](http://localhost:3000/api-docs) | [Dashboard](http://localhost:3000/dashboard) | [Demo](http://localhost:3000/demo)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/translations` | List all translations |
| `GET` | `/api/translations/:abbr` | Get a single translation |
| `GET` | `/api/books?translation=cadman` | List 66 books |
| `GET` | `/api/books/:bookId/chapters?translation=cadman` | Chapters with verse counts |
| `GET` | `/api/verses/:translation/:book/:chapter` | All verses in a chapter |
| `GET` | `/api/verses/:translation/:book/:chapter/:verse` | Single verse |
| `GET` | `/api/search?q=keyword&translation=cadman` | Full-text search |
| `GET` | `/api/votd` | Verse of the Day |
| `GET` | `/health` | Health check |
| `GET` | `/dashboard` | Monitoring dashboard |

```bash
# Examples
curl localhost:3000/api/verses/cadman/1/1/1          # Genesis 1:1 (Vietnamese)
curl localhost:3000/api/verses/kjv_strongs/43/3/16   # John 3:16 (English)
curl 'localhost:3000/api/search?q=love&translation=kjv_strongs&limit=5'
curl 'localhost:3000/api/votd?translation=cadman'
```

## Available Translations

| Abbreviation | Name | Language |
|--------------|------|----------|
| `cadman` | Cadman | Vietnamese |
| `kjv_strongs` | KJV with Strong's | English |

Import more: `node scripts/convert-module-to-pg.js <module_dir> <translation_id> <output.sql>`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | - | `development` / `production` |
| `DB_HOST` | - | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | - | Database user |
| `DB_PASSWORD` | - | Database password |
| `DB_NAME` | - | Database name |
| `METRICS_KEY` | - | Protects `/api/metrics` endpoint |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins |

## Tech Stack

Node.js + Express 5 | PostgreSQL 16 (Supabase) | Fly.io | Helmet + CSP + rate-limit | Pino logging | Chart.js dashboard | Vitest + Supertest | Swagger/OpenAPI 3.0
