import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { schema } from './schema';

// Token để inject Drizzle db instance qua Nest DI.
export const DRIZZLE = Symbol('DRIZZLE');

// Kiểu db đã gắn schema — dùng cho các repository/service.
export type DrizzleDB = NodePgDatabase<typeof schema>;
