import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class AbbrParamDto extends createZodDto(z.object({ abbr: z.string().min(1) })) {}
