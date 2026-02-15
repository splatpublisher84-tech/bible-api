const { Router } = require('express');
const { z } = require('zod');
const validate = require('../middlewares/validate');
const controller = require('../controllers/verse.controller');

const router = Router();

const verseParams = z.object({
  translation: z.string().min(1),
  book: z.coerce.number().int().min(1).max(66),
  chapter: z.coerce.number().int().min(1),
});

router.get('/:translation/:book/:chapter',
  validate({ params: verseParams }),
  controller.getChapter
);

router.get('/:translation/:book/:chapter/:verse',
  validate({
    params: verseParams.extend({
      verse: z.coerce.number().int().min(1),
    }),
  }),
  controller.getVerse
);

module.exports = router;
