import { Controller, Get, Param } from '@nestjs/common';
import { CacheControl } from '../../common/cache-control.decorator';
import { ChapterParamsDto, VerseParamsDto } from './verses.dto';
import { VersesService } from './verses.service';

@CacheControl(86400)
@Controller('verses')
export class VersesController {
  constructor(private readonly service: VersesService) {}

  @Get(':translation/:book/:chapter')
  getChapter(@Param() params: ChapterParamsDto) {
    return this.service.getChapter(params.translation, params.book, params.chapter);
  }

  @Get(':translation/:book/:chapter/:verse')
  getVerse(@Param() params: VerseParamsDto) {
    return this.service.getVerse(params.translation, params.book, params.chapter, params.verse);
  }
}
