import 'dotenv/config';
import { and, eq, sql } from 'drizzle-orm';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { schema, translations, verses, votdVerses } from './schema';

// Verify tầng Drizzle map đúng DB thật + giữ đúng semantics SQL quan trọng
// (FTS 'simple', đếm, đọc câu). Cần Postgres local đang chạy (docker compose up).
describe('Drizzle data layer (vs real DB)', () => {
  let pool: Pool;
  let db: NodePgDatabase<typeof schema>;
  let kjvId: number;

  beforeAll(() => {
    pool = new Pool({
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    db = drizzle(pool, { schema });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('translations: có đúng 2 bản dịch, gồm cadman + kjv_strongs', async () => {
    const rows = await db.select().from(translations);
    expect(rows.length).toBe(2);
    const abbrs = rows.map((r) => r.abbr).sort();
    expect(abbrs).toEqual(['cadman', 'kjv_strongs']);
    const kjv = rows.find((r) => r.abbr === 'kjv_strongs');
    if (!kjv) throw new Error('kjv_strongs translation not found');
    kjvId = kjv.id;
  });

  it('verses: tổng 62204 câu', async () => {
    const [row] = await db.select({ c: sql<number>`count(*)::int` }).from(verses);
    expect(row.c).toBe(62204);
  });

  it('Genesis 1:1 (KJV) trả text còn nguyên Strong markup', async () => {
    const [row] = await db
      .select({ verse: verses.verse, text: verses.text })
      .from(verses)
      .where(
        and(
          eq(verses.translationId, kjvId),
          eq(verses.bookId, 1),
          eq(verses.chapter, 1),
          eq(verses.verse, 1)
        )
      );
    expect(row.text).toContain('In the beginning');
    expect(row.text).toMatch(/\{H\d+\}/); // giữ nguyên markup {H7225}
  });

  it('FTS "simple" search "love" (KJV) trả > 0 kết quả', async () => {
    const [row] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(verses)
      .where(
        and(
          eq(verses.translationId, kjvId),
          sql`to_tsvector('simple', ${verses.text}) @@ plainto_tsquery('simple', ${'love'})`
        )
      );
    expect(row.c).toBeGreaterThan(0);
  });

  it('votd_verses: 510 câu active', async () => {
    const [row] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(votdVerses)
      .where(eq(votdVerses.isActive, true));
    expect(row.c).toBe(510);
  });
});
