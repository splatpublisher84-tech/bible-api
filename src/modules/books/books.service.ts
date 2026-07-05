import { Injectable, NotFoundException } from '@nestjs/common';
import { TranslationsService } from '../translations/translations.service';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksService {
  constructor(
    private readonly repo: BooksRepository,
    private readonly translations: TranslationsService
  ) {}

  async list(translationAbbr: string) {
    const t = await this.translations.resolveOrThrow(translationAbbr);
    return { data: await this.repo.findAllByTranslation(t.id) };
  }

  async chapters(bookId: number, translationAbbr: string) {
    const t = await this.translations.resolveOrThrow(translationAbbr);
    const book = await this.repo.findById(bookId);
    if (!book) throw new NotFoundException('Book not found');
    return { data: await this.repo.findChapters(t.id, book.id) };
  }
}
