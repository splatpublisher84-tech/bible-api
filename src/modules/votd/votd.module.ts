import { Module } from '@nestjs/common';
import { TranslationsModule } from '../translations/translations.module';
import { VotdController } from './votd.controller';
import { VotdRepository } from './votd.repository';
import { VotdService } from './votd.service';

@Module({
  imports: [TranslationsModule],
  controllers: [VotdController],
  providers: [VotdRepository, VotdService],
})
export class VotdModule {}
