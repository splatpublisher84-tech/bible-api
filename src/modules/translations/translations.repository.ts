import { Inject, Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../../database/drizzle.provider';
import { translations } from '../../database/schema';

// Cột trả về khớp CHÍNH XÁC bản Express cũ (snake_case như DB).
const cols = {
  id: translations.id,
  abbr: translations.abbr,
  name: translations.name,
  language: translations.language,
  description: translations.description,
  year: translations.year,
  is_public_domain: translations.isPublicDomain,
  has_strongs: translations.hasStrongs,
};

@Injectable()
export class TranslationsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAll() {
    return this.db.select(cols).from(translations).orderBy(asc(translations.id));
  }

  async findByAbbr(abbr: string) {
    const rows = await this.db.select(cols).from(translations).where(eq(translations.abbr, abbr));
    return rows[0] ?? null;
  }
}
