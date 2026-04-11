const { Pool } = require('pg');
const { trackQuery } = require('../middlewares/systemTracker');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  statement_timeout: 10000,
  ...(process.env.NODE_ENV === 'production' && {
    ssl: { rejectUnauthorized: false },
  }),
});

// Wrap pool.query to track performance
const originalQuery = pool.query.bind(pool);
pool.query = async function (...args) {
  const start = Date.now();
  try {
    const result = await originalQuery(...args);
    trackQuery(Date.now() - start, false);
    return result;
  } catch (err) {
    trackQuery(Date.now() - start, true);
    throw err;
  }
};

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
