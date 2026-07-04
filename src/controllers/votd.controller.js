const votdModel = require('../models/votd.model');
const translationModel = require('../models/translation.model');
const { AppError } = require('../middlewares/errorHandler');

function hashDate(dateString) {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatReference(bookName, chapter, verseStart, verseEnd) {
  const ref = `${bookName} ${chapter}:${verseStart}`;
  return verseEnd && verseEnd !== verseStart ? `${ref}-${verseEnd}` : ref;
}

async function getVotd(req, res) {
  const dateStr = req.query.date || new Date().toISOString().slice(0, 10);
  const translationAbbr = req.query.translation || 'kjv_strongs';

  const translation = await translationModel.findByAbbr(translationAbbr);
  if (!translation) throw new AppError(404, 'Translation not found');

  const date = new Date(dateStr);
  const dayOfYear = getDayOfYear(date);
  const year = date.getFullYear();

  // 1. Try calendar first
  let votdVerse = await votdModel.findByCalendarDay(dayOfYear, year);

  // 2. Fallback: deterministic random from pool
  if (!votdVerse) {
    const poolSize = await votdModel.countActive();
    if (poolSize === 0) throw new AppError(500, 'No VOTD verses available');
    const index = hashDate(dateStr) % poolSize;
    votdVerse = await votdModel.findByOffset(index);
  }

  // 3. Fetch verse texts for the requested translation
  const verses = await votdModel.findVerseTexts(
    translation.id,
    votdVerse.book_id,
    votdVerse.chapter,
    votdVerse.verse_start,
    votdVerse.verse_end
  );

  if (verses.length === 0) {
    throw new AppError(404, 'Verse text not found for this translation');
  }

  // 4. Fetch book name
  const bookName = await votdModel.findBookName(translation.id, votdVerse.book_id);

  res.json({
    data: {
      date: dateStr,
      translation: translationAbbr,
      reference: {
        book_id: votdVerse.book_id,
        book_name: bookName?.name || null,
        book_abbr: bookName?.abbr || null,
        chapter: votdVerse.chapter,
        verse_start: votdVerse.verse_start,
        verse_end: votdVerse.verse_end,
      },
      verses,
      theme: votdVerse.theme,
      display_reference: formatReference(
        bookName?.name || `Book ${votdVerse.book_id}`,
        votdVerse.chapter,
        votdVerse.verse_start,
        votdVerse.verse_end
      ),
    },
  });
}

module.exports = { getVotd };
