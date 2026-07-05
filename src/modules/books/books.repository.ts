import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../../database/drizzle.provider';
import { bookNames, books, chapterInfo, testaments } from '../../database/schema';

@Injectable()
export class BooksRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAllByTranslation(translationId: number) {
    return this.db
      .select({
        id: books.id,
        testament_id: books.testamentId,
        testament_abbr: testaments.abbr,
        total_chapters: books.totalChapters,
        category: books.category,
        name: bookNames.name,
        book_abbr: bookNames.abbr,
      })
      .from(books)
      .innerJoin(testaments, eq(testaments.id, books.testamentId))
      .innerJoin(
        bookNames,
        and(eq(bookNames.bookId, books.id), eq(bookNames.translationId, translationId))
      )
      .orderBy(asc(books.id));
  }

  async findById(bookId: number) {
    const rows = await this.db
      .select({
        id: books.id,
        testament_id: books.testamentId,
        total_chapters: books.totalChapters,
        category: books.category,
      })
      .from(books)
      .where(eq(books.id, bookId));
    return rows[0] ?? null;
  }

  findChapters(translationId: number, bookId: number) {
    return this.db
      .select({ chapter: chapterInfo.chapter, total_verses: chapterInfo.totalVerses })
      .from(chapterInfo)
      .where(and(eq(chapterInfo.translationId, translationId), eq(chapterInfo.bookId, bookId)))
      .orderBy(asc(chapterInfo.chapter));
  }
}
