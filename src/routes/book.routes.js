const { Router } = require('express');
const { z } = require('zod');
const validate = require('../middlewares/validate');
const controller = require('../controllers/book.controller');

const router = Router();

router.get('/',
  validate({ query: z.object({ translation: z.string().min(1) }) }),
  controller.list
);

router.get('/:bookId/chapters',
  validate({
    params: z.object({ bookId: z.coerce.number().int().min(1).max(66) }),
    query: z.object({ translation: z.string().min(1) }),
  }),
  controller.chapters
);

module.exports = router;
