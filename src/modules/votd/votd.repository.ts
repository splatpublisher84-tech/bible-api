import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, gte, isNull, lte, or, sql } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../../database/drizzle.provider';
import { bookNames, verses, votdCalendar, votdVerses } from '../../database/schema';

@Injectable()
export class VotdRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  // Ưu tiên bản ghi theo năm cụ thể hơn bản generic (year IS NULL) qua NULLS LAST.
  async findByCalendarDay(dayOfYear: number, year: number) {
    const rows = await this.db
      .select({
        id: votdVerses.id,
        book_id: votdVerses.bookId,
        chapter: votdVerses.chapter,
        verse_start: votdVerses.verseStart,
        verse_end: votdVerses.verseEnd,
        theme: votdVerses.theme,
      })
      .from(votdCalendar)
      .innerJoin(votdVerses, eq(votdVerses.id, votdCalendar.votdVerseId))
      .where(
        and(
          eq(votdCalendar.dayOfYear, dayOfYear),
          or(eq(votdCalendar.year, year), isNull(votdCalendar.year)),
          eq(votdCalendar.isActive, true),
          eq(votdVerses.isActive, true)
        )
      )
      .orderBy(sql`${votdCalendar.year} nulls last`)
      .limit(1);
    return rows[0] ?? null;
  }

  async countActive() {
    const [row] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(votdVerses)
      .where(eq(votdVerses.isActive, true));
    return row.total;
  }

  async findByOffset(offset: number) {
    const rows = await this.db
      .select({
        id: votdVerses.id,
        book_id: votdVerses.bookId,
        chapter: votdVerses.chapter,
        verse_start: votdVerses.verseStart,
        verse_end: votdVerses.verseEnd,
        theme: votdVerses.theme,
      })
      .from(votdVerses)
      .where(eq(votdVerses.isActive, true))
      .orderBy(asc(votdVerses.id))
      .limit(1)
      .offset(offset);
    return rows[0] ?? null;
  }

  findVerseTexts(
    translationId: number,
    bookId: number,
    chapter: number,
    verseStart: number,
    verseEnd: number | null
  ) {
    const end = verseEnd ?? verseStart;
    return this.db
      .select({ verse: verses.verse, text: verses.text })
      .from(verses)
      .where(
        and(
          eq(verses.translationId, translationId),
          eq(verses.bookId, bookId),
          eq(verses.chapter, chapter),
          gte(verses.verse, verseStart),
          lte(verses.verse, end)
        )
      )
      .orderBy(asc(verses.verse));
  }

  async findBookName(translationId: number, bookId: number) {
    const rows = await this.db
      .select({ name: bookNames.name, abbr: bookNames.abbr })
      .from(bookNames)
      .where(and(eq(bookNames.bookId, bookId), eq(bookNames.translationId, translationId)));
    return rows[0] ?? null;
  }
}
