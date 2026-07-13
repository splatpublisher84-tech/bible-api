import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

// Schema Drizzle map 1:1 vào DB Postgres CÓ SẴN (xem sql/001_schema.sql + sql/006_votd.sql).
// KHÔNG dùng để tạo/đổi schema — chỉ để truy vấn type-safe.

export const testaments = pgTable('testaments', {
  id: smallint('id').primaryKey(), // 1 = OT, 2 = NT (gán tay, không serial)
  abbr: varchar('abbr', { length: 2 }).notNull(),
});

export const books = pgTable('books', {
  id: smallint('id').primaryKey(), // 1-66 (gán tay)
  testamentId: smallint('testament_id')
    .notNull()
    .references(() => testaments.id),
  totalChapters: smallint('total_chapters').notNull(),
  category: varchar('category', { length: 20 }).notNull(),
});

export const translations = pgTable('translations', {
  id: serial('id').primaryKey(),
  abbr: varchar('abbr', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  language: varchar('language', { length: 10 }).notNull(),
  description: text('description'),
  year: smallint('year'),
  isPublicDomain: boolean('is_public_domain').notNull().default(true),
  hasStrongs: boolean('has_strongs').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const bookNames = pgTable(
  'book_names',
  {
    id: serial('id').primaryKey(),
    translationId: integer('translation_id')
      .notNull()
      .references(() => translations.id),
    bookId: smallint('book_id')
      .notNull()
      .references(() => books.id),
    name: varchar('name', { length: 50 }).notNull(),
    abbr: varchar('abbr', { length: 10 }),
  },
  (t) => [unique().on(t.translationId, t.bookId)]
);

export const verses = pgTable(
  'verses',
  {
    id: serial('id').primaryKey(),
    translationId: integer('translation_id')
      .notNull()
      .references(() => translations.id),
    bookId: smallint('book_id')
      .notNull()
      .references(() => books.id),
    chapter: smallint('chapter').notNull(),
    verse: smallint('verse').notNull(),
    text: text('text').notNull(),
  },
  (t) => [
    unique().on(t.translationId, t.bookId, t.chapter, t.verse),
    index('idx_verses_translation').on(t.translationId),
    index('idx_verses_book_chapter').on(t.bookId, t.chapter),
    // GIN full-text index trên biểu thức to_tsvector('simple', text) — dùng cho /api/search
    index('idx_verses_text_search').using('gin', sql`to_tsvector('simple', ${t.text})`),
  ]
);

export const bookAliases = pgTable(
  'book_aliases',
  {
    id: serial('id').primaryKey(),
    bookId: smallint('book_id')
      .notNull()
      .references(() => books.id),
    alias: varchar('alias', { length: 30 }).notNull(),
    language: varchar('language', { length: 10 }).notNull(),
  },
  (t) => [unique().on(t.alias, t.language)]
);

export const chapterInfo = pgTable(
  'chapter_info',
  {
    id: serial('id').primaryKey(),
    translationId: integer('translation_id')
      .notNull()
      .references(() => translations.id),
    bookId: smallint('book_id')
      .notNull()
      .references(() => books.id),
    chapter: smallint('chapter').notNull(),
    totalVerses: smallint('total_verses').notNull(),
  },
  (t) => [unique().on(t.translationId, t.bookId, t.chapter)]
);

export const votdVerses = pgTable(
  'votd_verses',
  {
    id: serial('id').primaryKey(),
    bookId: smallint('book_id')
      .notNull()
      .references(() => books.id),
    chapter: smallint('chapter').notNull(),
    verseStart: smallint('verse_start').notNull(),
    verseEnd: smallint('verse_end'), // NULL = single verse
    theme: varchar('theme', { length: 50 }),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.bookId, t.chapter, t.verseStart),
    index('idx_votd_verses_theme').on(t.theme).where(sql`${t.isActive} = true`),
  ]
);

export const votdCalendar = pgTable(
  'votd_calendar',
  {
    id: serial('id').primaryKey(),
    dayOfYear: smallint('day_of_year').notNull(), // 1-366
    votdVerseId: integer('votd_verse_id')
      .notNull()
      .references(() => votdVerses.id),
    year: smallint('year'), // NULL = dùng mọi năm
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique().on(t.dayOfYear, t.year),
    index('idx_votd_calendar_day').on(t.dayOfYear).where(sql`${t.isActive} = true`),
  ]
);

export const schema = {
  testaments,
  books,
  translations,
  bookNames,
  verses,
  bookAliases,
  chapterInfo,
  votdVerses,
  votdCalendar,
};
