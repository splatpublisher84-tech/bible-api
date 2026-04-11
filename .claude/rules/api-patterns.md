# API Development Patterns

## Architecture: Controller → Route → Model
```
Request → Route (validation) → Controller (logic) → Model (SQL) → Response
```

## Adding a New Endpoint
1. **Model** (`src/models/`): Write SQL query function
2. **Controller** (`src/controllers/`): Business logic, call model, format response
3. **Route** (`src/routes/`): Define path, attach validation + cache + controller
4. **Register** in `src/routes/index.js` if new resource group

## Validation (Zod)
```javascript
const validate = require('../middlewares/validate');
const { z } = require('zod');

router.get('/example',
  validate({
    query: z.object({
      limit: z.coerce.number().int().min(1).max(100).default(20),
    }),
  }),
  controller.method
);
```

## Caching
```javascript
const cache = require('../middlewares/cache');
router.use('/resource', cache(86400), routes); // 86400s = 24h for static data
router.get('/search', cache(300), handler);     // 5min for dynamic data
```

## Error Handling
- Errors caught by `src/middlewares/errorHandler.js`
- Always return consistent format: `{ error: 'message' }` with proper HTTP status
- Use `next(err)` to propagate errors from controllers

## Security (Already Configured)
- Helmet for security headers
- CORS: GET-only, configurable origins
- Rate limiting via express-rate-limit
- CSP: nonce-based for demo, CDN whitelist for dashboard
- Input sanitization via Zod validation
