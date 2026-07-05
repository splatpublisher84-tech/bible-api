import { Injectable, NotFoundException } from '@nestjs/common';
import { TranslationsRepository } from './translations.repository';

@Injectable()
export class TranslationsService {
  constructor(private readonly repo: TranslationsRepository) {}

  async list() {
    return { data: await this.repo.findAll() };
  }

  // Dùng chung bởi books/verses/votd — resolve bản dịch hoặc ném 404 (giữ đúng message cũ).
  async resolveOrThrow(abbr: string) {
    const t = await this.repo.findByAbbr(abbr);
    if (!t) throw new NotFoundException('Translation not found');
    return t;
  }

  async getByAbbr(abbr: string) {
    return { data: await this.resolveOrThrow(abbr) };
  }
}
