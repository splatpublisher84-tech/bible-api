import { Controller, Get, Query } from '@nestjs/common';
import { CacheControl } from '../../common/cache-control.decorator';
import { VotdQueryDto } from './votd.dto';
import { VotdService } from './votd.service';

@CacheControl(86400)
@Controller('votd')
export class VotdController {
  constructor(private readonly service: VotdService) {}

  @Get()
  getVotd(@Query() query: VotdQueryDto) {
    return this.service.getVotd(query.date, query.translation);
  }
}
