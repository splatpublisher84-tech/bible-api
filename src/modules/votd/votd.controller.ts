import { Controller, Get, Query } from '@nestjs/common';
import { VotdQueryDto } from './votd.dto';
import { VotdService } from './votd.service';

@Controller('votd')
export class VotdController {
  constructor(private readonly service: VotdService) {}

  @Get()
  getVotd(@Query() query: VotdQueryDto) {
    return this.service.getVotd(query.date, query.translation);
  }
}
