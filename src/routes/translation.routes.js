const { Router } = require('express');
const { z } = require('zod');
const validate = require('../middlewares/validate');
const controller = require('../controllers/translation.controller');

const router = Router();

router.get('/', controller.list);

router.get('/:abbr',
  validate({ params: z.object({ abbr: z.string().min(1) }) }),
  controller.getByAbbr
);

module.exports = router;
