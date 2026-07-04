/**
 * Middleware validate request bằng Zod schema.
 * @param {{ params?: import('zod').ZodTypeAny, query?: import('zod').ZodTypeAny, body?: import('zod').ZodTypeAny }} [schemas]
 */
function validate({ params, query, body } = {}) {
  return (req, res, next) => {
    if (params) req.params = params.parse(req.params);
    if (query) {
      const parsed = query.parse(req.query);
      Object.defineProperty(req, 'query', { value: parsed, writable: true, configurable: true });
    }
    if (body) req.body = body.parse(req.body);
    next();
  };
}

module.exports = validate;
