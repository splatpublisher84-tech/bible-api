import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './modules/books/books.module';
import { StatusModule } from './modules/status/status.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { VersesModule } from './modules/verses/verses.module';
import { VotdModule } from './modules/votd/votd.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TranslationsModule,
    BooksModule,
    VersesModule,
    VotdModule,
    StatusModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
