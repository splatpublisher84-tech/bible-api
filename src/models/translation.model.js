const pool = require('../config/database');

async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, abbr, name, language, description, year, is_public_domain, has_strongs FROM translations ORDER BY id'
  );
  return rows;
}

async function findByAbbr(abbr) {
  const { rows } = await pool.query(
    'SELECT id, abbr, name, language, description, year, is_public_domain, has_strongs FROM translations WHERE abbr = $1',
    [abbr]
  );
  return rows[0] || null;
}

module.exports = { findAll, findByAbbr };
