# Database Rules

## Connection
- Pool configured in `src/config/database.js` using `pg.Pool`
- All queries auto-tracked for performance via wrapped `pool.query` → `systemTracker.trackQuery()`
- Statement timeout: 10,000ms
- SSL enabled in production (`rejectUnauthorized: false` for Supabase)

## Schema Pattern
- Single `verses` table for ALL translations (differentiated by `translation_id`)
- `books` table has multilingual names (`name_en`, `name_vi`)
- `book_aliases` for flexible reference parsing
- `chapter_info` for pre-computed metadata
- Full-text search via GIN index on `text_search_vector`

## Query Guidelines
- Always use parameterized queries (`$1`, `$2`) — NEVER string concatenation
- Use `LIMIT` on all list queries (default 20, max 100)
- Leverage existing indexes: `text_search_vector` for search, `translation_id + book_id + chapter` for verses
- Keep queries under 10s (statement_timeout will kill longer ones)

## Model Pattern
All models in `src/models/` follow:
```javascript
const pool = require('../config/database');
// Use pool.query('SELECT ...', [param]) — auto-tracked
```
