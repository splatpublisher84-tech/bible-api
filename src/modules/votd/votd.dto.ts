import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class VotdQueryDto extends createZodDto(
  z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    translation: z.string().min(1).optional(),
  })
) {}
