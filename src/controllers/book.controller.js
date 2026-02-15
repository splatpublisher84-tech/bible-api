const bookModel = require('../models/book.model');
const translationModel = require('../models/translation.model');
const { AppError } = require('../middlewares/errorHandler');

async function resolveTranslation(abbr) {
  const translation = await translationModel.findByAbbr(abbr);
  if (!translation) throw new AppError(404, 'Translation not found');
  return translation;
}

async function list(req, res) {
  const translation = await resolveTranslation(req.query.translation);
  const data = await bookModel.findAllByTranslation(translation.id);
  res.json({ data });
}

async function chapters(req, res) {
  const translation = await resolveTranslation(req.query.translation);
  const book = await bookModel.findById(req.params.bookId);
  if (!book) throw new AppError(404, 'Book not found');

  const data = await bookModel.findChapters(translation.id, book.id);
  res.json({ data });
}

module.exports = { list, chapters };
