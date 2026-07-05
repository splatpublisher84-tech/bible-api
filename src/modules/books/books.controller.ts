import { Controller, Get, Param, Query } from '@nestjs/common';
import { CacheControl } from '../../common/cache-control.decorator';
import { BooksQueryDto, ChaptersParamDto } from './books.dto';
import { BooksService } from './books.service';

@CacheControl(86400)
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
