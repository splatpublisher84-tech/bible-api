import pool from '../src/config/database.js';

export async function teardown() {
  await pool.end();
}
