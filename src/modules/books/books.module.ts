import { Module } from '@nestjs/common';
import { TranslationsModule } from '../translations/translations.module';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksService } from './books.service';

@Module({
  imports: [TranslationsModule],
  controllers: [BooksController],
  providers: [BooksRepository, BooksService],
  exports: [BooksRepository],
})
export class BooksModule {}
