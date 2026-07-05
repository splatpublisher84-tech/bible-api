import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TranslationsService } from '../translations/translations.service';
import { VotdRepository } from './votd.repository';

@Injectable()
export class VotdService {
  constructor(
    private readonly repo: VotdRepository,
    private readonly translations: TranslationsService
  ) {}

  // Hash tất định 32-bit trên chuỗi ngày (giữ y hệt bản cũ để cùng ngày ra cùng câu)
  private hashDate(dateString: string): number {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      hash = (hash << 5) - hash + dateString.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private formatReference(
    bookName: string,
    chapter: number,
    verseStart: number,
    verseEnd: number | null
  ): string {
    const ref = `${bookName} ${chapter}:${verseStart}`;
    return verseEnd && verseEnd !== verseStart ? `${ref}-${verseEnd}` : ref;
  }

  async getVotd(dateInput?: string, translationInput?: string) {
    const dateStr = dateInput || new Date().toISOString().slice(0, 10);
    const translationAbbr = translationInput || 'kjv_strongs';

    const translation = await this.translations.resolveOrThrow(translationAbbr);

    const date = new Date(dateStr);
    const dayOfYear = this.getDayOfYear(date);
    const year = date.getFullYear();

    // 1. Calendar trước
    let votdVerse = await this.repo.findByCalendarDay(dayOfYear, year);

    // 2. Fallback tất định từ pool
    if (!votdVerse) {
      const poolSize = await this.repo.countActive();
      if (poolSize === 0) throw new InternalServerErrorException('No VOTD verses available');
      const index = this.hashDate(dateStr) % poolSize;
      votdVerse = await this.repo.findByOffset(index);
    }
    if (!votdVerse) throw new InternalServerErrorException('No VOTD verses available');

    // 3. Lấy text câu theo bản dịch yêu cầu
    const versesData = await this.repo.findVerseTexts(
      translation.id,
      votdVerse.book_id,
      votdVerse.chapter,
      votdVerse.verse_start,
      votdVerse.verse_end
    );
    if (versesData.length === 0) {
      throw new NotFoundException('Verse text not found for this translation');
    }

    // 4. Tên sách
    const bookName = await this.repo.findBookName(translation.id, votdVerse.book_id);

    return {
      data: {
        date: dateStr,
        translation: translationAbbr,
        reference: {
          book_id: votdVerse.book_id,
          book_name: bookName?.name || null,
          book_abbr: bookName?.abbr || null,
          chapter: votdVerse.chapter,
          verse_start: votdVerse.verse_start,
          verse_end: votdVerse.verse_end,
        },
        verses: versesData,
        theme: votdVerse.theme,
        display_reference: this.formatReference(
          bookName?.name || `Book ${votdVerse.book_id}`,
          votdVerse.chapter,
          votdVerse.verse_start,
          votdVerse.verse_end
        ),
      },
    };
  }
}
