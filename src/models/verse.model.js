const pool = require('../config/database');

async function findByChapter(translationId, bookId, chapter) {
  const { rows } = await pool.query(
    `SELECT verse, text
     FROM verses
     WHERE translation_id = $1 AND book_id = $2 AND chapter = $3
     ORDER BY verse`,
    [translationId, bookId, chapter]
  );
  return rows;
}

async function findOne(translationId, bookId, chapter, verse) {
  const { rows } = await pool.query(
    `SELECT verse, text
     FROM verses
     WHERE translation_id = $1 AND book_id = $2 AND chapter = $3 AND verse = $4`,
    [translationId, bookId, chapter, verse]
  );
  return rows[0] || null;
}

async function search(translationId, query, limit, offset) {
  const tsQuery = `plainto_tsquery('simple', $2)`;

  const [countResult, dataResult] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) AS total
       FROM verses
       WHERE translation_id = $1 AND to_tsvector('simple', text) @@ ${tsQuery}`,
      [translationId, query]
    ),
    pool.query(
      `SELECT v.book_id, bn.name AS book_name, v.chapter, v.verse, v.text
       FROM verses v
       JOIN book_names bn ON bn.book_id = v.book_id AND bn.translation_id = v.translation_id
       WHERE v.translation_id = $1 AND to_tsvector('simple', v.text) @@ ${tsQuery}
       ORDER BY v.book_id, v.chapter, v.verse
       LIMIT $3 OFFSET $4`,
      [translationId, query, limit, offset]
    ),
  ]);

  return {
    total: parseInt(countResult.rows[0].total, 10),
    rows: dataResult.rows,
  };
}

module.exports = { findByChapter, findOne, search };
