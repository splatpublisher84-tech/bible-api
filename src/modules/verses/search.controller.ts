import { Controller, Get, Query } from '@nestjs/common';
import { CacheControl } from '../../common/cache-control.decorator';
import { SearchQueryDto } from './verses.dto';
import { VersesService } from './verses.service';

@CacheControl(300)
@Controller('search')
export class SearchController {
  constructor(private readonly service: VersesService) {}

  @Get()
  search(@Query() query: SearchQueryDto) {
    return this.service.search(query.q, query.translation, query.limit, query.offset);
  }
}
