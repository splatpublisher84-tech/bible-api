import { Controller, Get, Param } from '@nestjs/common';
import { AbbrParamDto } from './translations.dto';
import { TranslationsService } from './translations.service';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly service: TranslationsService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':abbr')
  getByAbbr(@Param() params: AbbrParamDto) {
    return this.service.getByAbbr(params.abbr);
  }
}
