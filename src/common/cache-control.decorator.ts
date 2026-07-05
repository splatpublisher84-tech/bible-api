import { SetMetadata } from '@nestjs/common';

export const CACHE_CONTROL_KEY = 'cache_control_seconds';

// Đánh dấu controller/handler cần Cache-Control: public, max-age=<seconds>
// (khớp middleware cache() cũ) + memoize server-side qua cache-manager/Keyv.
export const CacheControl = (seconds: number) => SetMetadata(CACHE_CONTROL_KEY, seconds);
