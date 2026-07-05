import { Controller, Get, Param, Query } from '@nestjs/common';
import { BooksQueryDto, ChaptersParamDto } from './books.dto';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly service: BooksService) {}

  @Get()
  list(@Query() query: BooksQueryDto) {
    return this.service.list(query.translation);
  }

  @Get(':bookId/chapters')
  chapters(@Param() params: ChaptersParamDto, @Query() query: BooksQueryDto) {
    return this.service.chapters(params.bookId, query.translation);
  }
}
