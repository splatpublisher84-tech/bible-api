import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class ChapterParamsDto extends createZodDto(
  z.object({
    translation: z.string().min(1),
    book: z.coerce.number().int().min(1).max(66),
    chapter: z.coerce.number().int().min(1),
  })
) {}

export class VerseParamsDto extends createZodDto(
  z.object({
    translation: z.string().min(1),
    book: z.coerce.number().int().min(1).max(66),
    chapter: z.coerce.number().int().min(1),
    verse: z.coerce.number().int().min(1),
  })
) {}

export class SearchQueryDto extends createZodDto(
  z.object({
    q: z.string().min(1),
    translation: z.string().min(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  })
) {}
