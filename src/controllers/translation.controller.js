const translationModel = require('../models/translation.model');
const { AppError } = require('../middlewares/errorHandler');

async function list(req, res) {
  const data = await translationModel.findAll();
  res.json({ data });
}

async function getByAbbr(req, res) {
  const translation = await translationModel.findByAbbr(req.params.abbr);
  if (!translation) throw new AppError(404, 'Translation not found');
  res.json({ data: translation });
}

module.exports = { list, getByAbbr };
