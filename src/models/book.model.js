const pool = require('../config/database');

async function findAllByTranslation(translationId) {
  const { rows } = await pool.query(
    `SELECT b.id, b.testament_id, t.abbr AS testament_abbr,
            b.total_chapters, b.category,
            bn.name, bn.abbr AS book_abbr
     FROM books b
     JOIN testaments t ON t.id = b.testament_id
     JOIN book_names bn ON bn.book_id = b.id AND bn.translation_id = $1
     ORDER BY b.id`,
    [translationId]
  );
  return rows;
}

async function findById(bookId) {
  const { rows } = await pool.query(
    'SELECT id, testament_id, total_chapters, category FROM books WHERE id = $1',
    [bookId]
  );
  return rows[0] || null;
}

async function findChapters(translationId, bookId) {
  const { rows } = await pool.query(
    `SELECT chapter, total_verses
     FROM chapter_info
     WHERE translation_id = $1 AND book_id = $2
     ORDER BY chapter`,
    [translationId, bookId]
  );
  return rows;
}

module.exports = { findAllByTranslation, findById, findChapters };
