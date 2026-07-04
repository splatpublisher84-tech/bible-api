const { Router } = require('express');
const { z } = require('zod');
const validate = require('../middlewares/validate');
const cache = require('../middlewares/cache');
const translationRoutes = require('./translation.routes');
const bookRoutes = require('./book.routes');
const verseRoutes = require('./verse.routes');
const verseController = require('../controllers/verse.controller');
const votdController = require('../controllers/votd.controller');
const statusController = require('../controllers/status.controller');
const { getMetrics } = require('../middlewares/requestTracker');
const { getSystemMetrics } = require('../middlewares/systemTracker');

const router = Router();

router.use('/translations', cache(86400), translationRoutes);
router.use('/books', cache(86400), bookRoutes);
router.use('/verses', cache(86400), verseRoutes);

router.get(
  '/votd',
  cache(86400),
  validate({
    query: z.object({
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      translation: z.string().min(1).optional(),
    }),
  }),
  votdController.getVotd
);

router.get('/status', statusController.getStatus);
router.get('/metrics', (req, res) => {
  const key = process.env.METRICS_KEY;
  if (key && req.query.key !== key) {
    return res.status(401).json({ error: 'Invalid or missing metrics key' });
  }
  res.json({ ...getMetrics(), system: getSystemMetrics() });
});

router.get(
  '/search',
  cache(300),
  validate({
    query: z.object({
      q: z.string().min(1),
      translation: z.string().min(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      offset: z.coerce.number().int().min(0).default(0),
    }),
  }),
  verseController.search
);

module.exports = router;
