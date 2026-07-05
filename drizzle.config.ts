import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// ⚠️ AN TOÀN: config này CHỈ dùng cho DB LOCAL (introspect/kiểm tra schema).
// TUYỆT ĐỐI KHÔNG chạy `drizzle-kit push`/`migrate` lên prod — schema Bible API map vào
// DB có sẵn, ta KHÔNG đổi schema. Xem [[enterprise-refactor-plan]].
export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false,
  },
});
