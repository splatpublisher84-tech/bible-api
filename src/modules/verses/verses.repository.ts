import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, sql } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../../database/drizzle.provider';
import { bookNames, verses } from '../../database/schema';

@Injectable()
export class VersesRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findByChapter(translationId: number, bookId: number, chapter: number) {
    return this.db
      .select({ verse: verses.verse, text: verses.text })
      .from(verses)
      .where(
        and(
          eq(verses.translationId, translationId),
          eq(verses.bookId, bookId),
          eq(verses.chapter, chapter)
        )
      )
      .orderBy(asc(verses.verse));
  }

  async findOne(translationId: number, bookId: number, chapter: number, verse: number) {
    const rows = await this.db
      .select({ verse: verses.verse, text: verses.text })
      .from(verses)
      .where(
        and(
          eq(verses.translationId, translationId),
          eq(verses.bookId, bookId),
          eq(verses.chapter, chapter),
          eq(verses.verse, verse)
        )
      );
    return rows[0] ?? null;
  }

  // FTS 'simple' (không stemming) — khớp chính xác bản cũ; markup Strong giữ nguyên.
  async search(translationId: number, query: string, limit: number, offset: number) {
    const fts = sql`to_tsvector('simple', ${verses.text}) @@ plainto_tsquery('simple', ${query})`;

    const [countRow] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(verses)
      .where(and(eq(verses.translationId, translationId), fts));

    const rows = await this.db
      .select({
        book_id: verses.bookId,
        book_name: bookNames.name,
        chapter: verses.chapter,
        verse: verses.verse,
        text: verses.text,
      })
      .from(verses)
      .innerJoin(
        bookNames,
        and(eq(bookNames.bookId, verses.bookId), eq(bookNames.translationId, verses.translationId))
      )
      .where(and(eq(verses.translationId, translationId), fts))
      .orderBy(asc(verses.bookId), asc(verses.chapter), asc(verses.verse))
      .limit(limit)
      .offset(offset);

    return { total: countRow.total, rows };
  }
}
