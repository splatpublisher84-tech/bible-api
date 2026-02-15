const verseModel = require('../models/verse.model');
const translationModel = require('../models/translation.model');
const bookModel = require('../models/book.model');
const { AppError } = require('../middlewares/errorHandler');

async function resolveTranslationAndBook(translationAbbr, bookId) {
  const translation = await translationModel.findByAbbr(translationAbbr);
  if (!translation) throw new AppError(404, 'Translation not found');

  const book = await bookModel.findById(bookId);
  if (!book) throw new AppError(404, 'Book not found');

  return { translation, book };
}

async function getChapter(req, res) {
  const { translation, book } = await resolveTranslationAndBook(
    req.params.translation, req.params.book
  );

  const data = await verseModel.findByChapter(
    translation.id, book.id, req.params.chapter
  );
  if (data.length === 0) throw new AppError(404, 'Chapter not found');

  res.json({ data });
}

async function getVerse(req, res) {
  const { translation, book } = await resolveTranslationAndBook(
    req.params.translation, req.params.book
  );

  const data = await verseModel.findOne(
    translation.id, book.id, req.params.chapter, req.params.verse
  );
  if (!data) throw new AppError(404, 'Verse not found');

  res.json({ data });
}

async function search(req, res) {
  const { q, translation: abbr, limit, offset } = req.query;

  const translationRow = await translationModel.findByAbbr(abbr);
  if (!translationRow) throw new AppError(404, 'Translation not found');

  const { total, rows } = await verseModel.search(
    translationRow.id, q, limit, offset
  );

  res.json({
    data: rows,
    pagination: { total, limit, offset },
  });
}

module.exports = { getChapter, getVerse, search };
