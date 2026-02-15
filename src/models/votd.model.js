const pool = require('../config/database');

async function findByCalendarDay(dayOfYear, year) {
  const { rows } = await pool.query(
    `SELECT v.id, v.book_id, v.chapter, v.verse_start, v.verse_end, v.theme
     FROM votd_calendar c
     JOIN votd_verses v ON v.id = c.votd_verse_id
     WHERE c.day_of_year = $1
       AND (c.year = $2 OR c.year IS NULL)
       AND c.is_active = true
       AND v.is_active = true
     ORDER BY c.year NULLS LAST
     LIMIT 1`,
    [dayOfYear, year]
  );
  return rows[0] || null;
}

async function countActive() {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM votd_verses WHERE is_active = true'
  );
  return rows[0].total;
}

async function findByOffset(offset) {
  const { rows } = await pool.query(
    `SELECT id, book_id, chapter, verse_start, verse_end, theme
     FROM votd_verses
     WHERE is_active = true
     ORDER BY id
     LIMIT 1 OFFSET $1`,
    [offset]
  );
  return rows[0] || null;
}

async function findVerseTexts(translationId, bookId, chapter, verseStart, verseEnd) {
  const { rows } = await pool.query(
    `SELECT verse, text
     FROM verses
     WHERE translation_id = $1 AND book_id = $2 AND chapter = $3
       AND verse >= $4 AND verse <= $5
     ORDER BY verse`,
    [translationId, bookId, chapter, verseStart, verseEnd || verseStart]
  );
  return rows;
}

async function findBookName(translationId, bookId) {
  const { rows } = await pool.query(
    `SELECT bn.name, bn.abbr
     FROM book_names bn
     WHERE bn.book_id = $1 AND bn.translation_id = $2`,
    [bookId, translationId]
  );
  return rows[0] || null;
}

module.exports = { findByCalendarDay, countActive, findByOffset, findVerseTexts, findBookName };
