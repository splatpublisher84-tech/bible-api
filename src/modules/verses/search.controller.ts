import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CacheControl } from '../../common/cache-control.decorator';
import { SearchQueryDto } from './verses.dto';
import { VersesService } from './verses.service';

@CacheControl(300)
// /search là full-text search (nặng Supabase) → siết chặt hơn global 500/15ph. Key theo Fly-Client-IP.
@Throttle({ default: { ttl: 15 * 60 * 1000, limit: 100 } })
@Controller('search')
export class SearchController {
  constructor(private readonly service: VersesService) {}

  @Get()
  search(@Query() query: SearchQueryDto) {
    return this.service.search(query.q, query.translation, query.limit, query.offset);
  }
}
