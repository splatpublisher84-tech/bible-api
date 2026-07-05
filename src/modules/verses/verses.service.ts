import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from '../books/books.repository';
import { TranslationsService } from '../translations/translations.service';
import { VersesRepository } from './verses.repository';

@Injectable()
export class VersesService {
  constructor(
    private readonly repo: VersesRepository,
    private readonly translations: TranslationsService,
    private readonly books: BooksRepository
  ) {}

  // resolveTranslationAndBook: 404 'Translation not found' rồi 404 'Book not found' (đúng thứ tự cũ)
  private async resolve(translationAbbr: string, bookId: number) {
    const t = await this.translations.resolveOrThrow(translationAbbr);
    const book = await this.books.findById(bookId);
    if (!book) throw new NotFoundException('Book not found');
    return { t, book };
  }

  async getChapter(translationAbbr: string, bookId: number, chapter: number) {
    const { t, book } = await this.resolve(translationAbbr, bookId);
    const rows = await this.repo.findByChapter(t.id, book.id, chapter);
    if (rows.length === 0) throw new NotFoundException('Chapter not found');
    return { data: rows };
  }

  async getVerse(translationAbbr: string, bookId: number, chapter: number, verse: number) {
    const { t, book } = await this.resolve(translationAbbr, bookId);
    const row = await this.repo.findOne(t.id, book.id, chapter, verse);
    if (!row) throw new NotFoundException('Verse not found');
    return { data: row };
  }

  async search(q: string, translationAbbr: string, limit: number, offset: number) {
    const t = await this.translations.resolveOrThrow(translationAbbr);
    const { total, rows } = await this.repo.search(t.id, q, limit, offset);
    return { data: rows, pagination: { total, limit, offset } };
  }
}
