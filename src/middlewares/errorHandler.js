const { ZodError } = require('zod');
const logger = require('../config/logger');

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { AppError, errorHandler };
