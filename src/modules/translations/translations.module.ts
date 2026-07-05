import { Module } from '@nestjs/common';
import { TranslationsController } from './translations.controller';
import { TranslationsRepository } from './translations.repository';
import { TranslationsService } from './translations.service';

@Module({
  controllers: [TranslationsController],
  providers: [TranslationsRepository, TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
