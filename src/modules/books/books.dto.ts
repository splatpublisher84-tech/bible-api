import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class BooksQueryDto extends createZodDto(z.object({ translation: z.string().min(1) })) {}

export class ChaptersParamDto extends createZodDto(
  z.object({ bookId: z.coerce.number().int().min(1).max(66) })
) {}
