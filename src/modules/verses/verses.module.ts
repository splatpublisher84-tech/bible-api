import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { TranslationsModule } from '../translations/translations.module';
import { SearchController } from './search.controller';
import { VersesController } from './verses.controller';
import { VersesRepository } from './verses.repository';
import { VersesService } from './verses.service';

@Module({
  imports: [TranslationsModule, BooksModule],
  controllers: [VersesController, SearchController],
  providers: [VersesRepository, VersesService],
})
export class VersesModule {}
