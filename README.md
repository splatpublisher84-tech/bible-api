# Bible API

REST API serving Bible verse data from PostgreSQL. Supports multiple translations, multilingual book names (English/Vietnamese), full-text search, and Verse of the Day.

## Tech Stack

- **Runtime:** Node.js + Express 5
- **Database:** PostgreSQL 16 (Docker)
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Pino (structured JSON)
- **Validation:** Zod
- **Testing:** Vitest + Supertest
- **Docs:** Swagger UI (OpenAPI 3.0)

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

### 2. Run migrations

```bash
# Schema + seed data
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/001_schema.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/002_seed.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/005_book_names_temp.sql

# Bible translation data
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/003_data_cadman.sql
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/004_data_kjv_strongs.sql

# Verse of the Day
docker exec -i bible_postgres psql -U bible_user -d bible_db < sql/006_votd.sql
```

### 3. Configure environment

```bash
cp .env.example .env
```

### 4. Install and run

```bash
npm install
npm run dev
```

Server starts at `http://localhost:3000`. Swagger UI at `http://localhost:3000/api-docs`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/translations` | List all translations |
| `GET` | `/api/translations/:abbr` | Get a single translation |
| `GET` | `/api/books?translation=cadman` | List 66 books for a translation |
| `GET` | `/api/books/:bookId/chapters?translation=cadman` | Chapter list with verse counts |
| `GET` | `/api/verses/:translation/:book/:chapter` | All verses in a chapter |
| `GET` | `/api/verses/:translation/:book/:chapter/:verse` | Single verse |
| `GET` | `/api/search?q=keyword&translation=cadman` | Full-text search |
| `GET` | `/api/votd` | Verse of the Day |
| `GET` | `/health` | Health check |

### Examples

```bash
# List translations
curl localhost:3000/api/translations

# Get Genesis 1:1 (Cadman Vietnamese)
curl localhost:3000/api/verses/cadman/1/1/1

# Search
curl "localhost:3000/api/search?q=love&translation=kjv_strongs&limit=5"

# Verse of the Day
curl "localhost:3000/api/votd?translation=cadman"
curl "localhost:3000/api/votd?date=2026-12-25&translation=kjv_strongs"
```

## Verse of the Day

510 curated verses across 29 themes (hope, faith, love, comfort, wisdom, salvation, prayer, praise, courage, etc.). Covers all 66 books of the Bible.

**How it works:**
1. Check `votd_calendar` for a scheduled verse on this date
2. Fallback: deterministic hash of the date string selects from the curated pool — every user sees the same verse on the same day

## Available Translations

| Abbreviation | Name | Language |
|--------------|------|----------|
| `cadman` | Cadman | Vietnamese |
| `kjv_strongs` | KJV with Strong's | English |

More translations can be imported using `scripts/convert-module-to-pg.js`.

## Scripts

```bash
npm run dev          # Development (auto-reload via nodemon)
npm start            # Production
npm test             # Run tests
npm run test:watch   # Tests in watch mode
```

### Import a new translation

```bash
node scripts/convert-module-to-pg.js <module_dir> <translation_id> <output.sql>
```

Converts Bible SuperSearch module format to PostgreSQL INSERT statements.

## Project Structure

```
src/
  app.js                    # Express app setup + middleware
  server.js                 # HTTP server entry point
  config/
    database.js             # PostgreSQL connection pool
    logger.js               # Pino logger
    swagger.js              # OpenAPI 3.0 spec
  controllers/              # Request handlers
  models/                   # Database queries
  middlewares/
    cache.js                # Cache-Control headers
    errorHandler.js         # Error handling + AppError class
    validate.js             # Zod validation middleware
  routes/                   # Route definitions
sql/                        # Database migrations
scripts/                    # Data import tools
tests/                      # Integration tests (Vitest + Supertest)
```

## Caching

| Route | Cache Duration | Rationale |
|-------|---------------|-----------|
| `/api/translations` | 1 day | Rarely changes |
| `/api/books` | 1 day | Static structure |
| `/api/verses` | 1 day | Immutable content |
| `/api/votd` | 1 day | Same verse all day |
| `/api/search` | 5 minutes | Varies by query |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | - | `development` or `production` |
| `DB_HOST` | - | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USER` | - | Database user |
| `DB_PASSWORD` | - | Database password |
| `DB_NAME` | - | Database name |
