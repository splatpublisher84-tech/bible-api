CREATE TABLE "book_aliases" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" smallint NOT NULL,
	"alias" varchar(30) NOT NULL,
	"language" varchar(10) NOT NULL,
	CONSTRAINT "book_aliases_alias_language_unique" UNIQUE("alias","language")
);
--> statement-breakpoint
CREATE TABLE "book_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"translation_id" integer NOT NULL,
	"book_id" smallint NOT NULL,
	"name" varchar(50) NOT NULL,
	"abbr" varchar(10) NOT NULL,
	CONSTRAINT "book_names_translation_id_book_id_unique" UNIQUE("translation_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" smallint PRIMARY KEY NOT NULL,
	"testament_id" smallint NOT NULL,
	"total_chapters" smallint NOT NULL,
	"category" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"translation_id" integer NOT NULL,
	"book_id" smallint NOT NULL,
	"chapter" smallint NOT NULL,
	"total_verses" smallint NOT NULL,
	CONSTRAINT "chapter_info_translation_id_book_id_chapter_unique" UNIQUE("translation_id","book_id","chapter")
);
--> statement-breakpoint
CREATE TABLE "testaments" (
	"id" smallint PRIMARY KEY NOT NULL,
	"abbr" varchar(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"abbr" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"language" varchar(10) NOT NULL,
	"description" text,
	"year" smallint,
	"is_public_domain" boolean DEFAULT true NOT NULL,
	"has_strongs" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "translations_abbr_unique" UNIQUE("abbr")
);
--> statement-breakpoint
CREATE TABLE "verses" (
	"id" serial PRIMARY KEY NOT NULL,
	"translation_id" integer NOT NULL,
	"book_id" smallint NOT NULL,
	"chapter" smallint NOT NULL,
	"verse" smallint NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "verses_translation_id_book_id_chapter_verse_unique" UNIQUE("translation_id","book_id","chapter","verse")
);
--> statement-breakpoint
CREATE TABLE "votd_calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_of_year" smallint NOT NULL,
	"votd_verse_id" integer NOT NULL,
	"year" smallint,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votd_calendar_day_of_year_year_unique" UNIQUE("day_of_year","year")
);
--> statement-breakpoint
CREATE TABLE "votd_verses" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" smallint NOT NULL,
	"chapter" smallint NOT NULL,
	"verse_start" smallint NOT NULL,
	"verse_end" smallint,
	"theme" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votd_verses_book_id_chapter_verse_start_unique" UNIQUE("book_id","chapter","verse_start")
);
--> statement-breakpoint
ALTER TABLE "book_aliases" ADD CONSTRAINT "book_aliases_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_names" ADD CONSTRAINT "book_names_translation_id_translations_id_fk" FOREIGN KEY ("translation_id") REFERENCES "public"."translations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_names" ADD CONSTRAINT "book_names_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_testament_id_testaments_id_fk" FOREIGN KEY ("testament_id") REFERENCES "public"."testaments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_info" ADD CONSTRAINT "chapter_info_translation_id_translations_id_fk" FOREIGN KEY ("translation_id") REFERENCES "public"."translations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_info" ADD CONSTRAINT "chapter_info_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verses" ADD CONSTRAINT "verses_translation_id_translations_id_fk" FOREIGN KEY ("translation_id") REFERENCES "public"."translations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verses" ADD CONSTRAINT "verses_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votd_calendar" ADD CONSTRAINT "votd_calendar_votd_verse_id_votd_verses_id_fk" FOREIGN KEY ("votd_verse_id") REFERENCES "public"."votd_verses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votd_verses" ADD CONSTRAINT "votd_verses_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_verses_translation" ON "verses" USING btree ("translation_id");--> statement-breakpoint
CREATE INDEX "idx_verses_book_chapter" ON "verses" USING btree ("book_id","chapter");--> statement-breakpoint
CREATE INDEX "idx_verses_text_search" ON "verses" USING gin (to_tsvector('simple', "text"));--> statement-breakpoint
CREATE INDEX "idx_votd_calendar_day" ON "votd_calendar" USING btree ("day_of_year") WHERE "votd_calendar"."is_active" = true;--> statement-breakpoint
CREATE INDEX "idx_votd_verses_theme" ON "votd_verses" USING btree ("theme") WHERE "votd_verses"."is_active" = true;