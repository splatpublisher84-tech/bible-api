const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Bible API',
    version: '1.0.0',
    description: 'REST API serving Bible verse data from PostgreSQL. Supports multiple translations, multilingual book names, full-text search, and flexible reference parsing.',
  },
  servers: [
    { url: '/api', description: 'API base path' },
  ],
  paths: {
    '/translations': {
      get: {
        tags: ['Translations'],
        summary: 'List all translations',
        responses: {
          200: {
            description: 'Array of translations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Translation' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/translations/{abbr}': {
      get: {
        tags: ['Translations'],
        summary: 'Get a single translation by abbreviation',
        parameters: [
          {
            name: 'abbr',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Translation abbreviation (e.g. "cadman", "kjv_strongs")',
          },
        ],
        responses: {
          200: {
            description: 'Translation object',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Translation' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/books': {
      get: {
        tags: ['Books'],
        summary: 'List all books for a translation',
        parameters: [
          {
            name: 'translation',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Translation abbreviation',
          },
        ],
        responses: {
          200: {
            description: 'Array of books',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Book' },
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/books/{bookId}/chapters': {
      get: {
        tags: ['Books'],
        summary: 'Get chapters with verse counts for a book',
        parameters: [
          {
            name: 'bookId',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 66 },
            description: 'Book ID (1–66)',
          },
          {
            name: 'translation',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Translation abbreviation',
          },
        ],
        responses: {
          200: {
            description: 'Array of chapters with verse counts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Chapter' },
                    },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/verses/{translation}/{book}/{chapter}': {
      get: {
        tags: ['Verses'],
        summary: 'Get all verses in a chapter',
        parameters: [
          {
            name: 'translation',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Translation abbreviation',
          },
          {
            name: 'book',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 66 },
            description: 'Book ID (1–66)',
          },
          {
            name: 'chapter',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'Chapter number',
          },
        ],
        responses: {
          200: {
            description: 'Array of verses',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Verse' },
                    },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/verses/{translation}/{book}/{chapter}/{verse}': {
      get: {
        tags: ['Verses'],
        summary: 'Get a single verse',
        parameters: [
          {
            name: 'translation',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Translation abbreviation',
          },
          {
            name: 'book',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 66 },
            description: 'Book ID (1–66)',
          },
          {
            name: 'chapter',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'Chapter number',
          },
          {
            name: 'verse',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'Verse number',
          },
        ],
        responses: {
          200: {
            description: 'Single verse',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Verse' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/votd': {
      get: {
        tags: ['Verse of the Day'],
        summary: 'Get the Verse of the Day',
        description: 'Returns a curated verse for the given date. Uses calendar overrides when available, otherwise selects deterministically from the curated pool (same verse for all users on the same day).',
        parameters: [
          {
            name: 'date',
            in: 'query',
            schema: { type: 'string', format: 'date', example: '2026-02-16' },
            description: 'Date in YYYY-MM-DD format (defaults to today)',
          },
          {
            name: 'translation',
            in: 'query',
            schema: { type: 'string', example: 'kjv_strongs' },
            description: 'Translation abbreviation (defaults to kjv_strongs)',
          },
        ],
        responses: {
          200: {
            description: 'Verse of the Day',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/VotdResponse' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Full-text search across verses',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 1 },
            description: 'Search query',
          },
          {
            name: 'translation',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 1 },
            description: 'Translation abbreviation',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description: 'Results per page (default 20, max 100)',
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
            description: 'Number of results to skip',
          },
        ],
        responses: {
          200: {
            description: 'Search results with pagination',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/SearchResult' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
  components: {
    schemas: {
      Translation: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          abbr: { type: 'string', example: 'cadman' },
          name: { type: 'string', example: 'Cadman' },
          language: { type: 'string', example: 'vi' },
          description: { type: 'string' },
          year: { type: 'integer' },
          is_public_domain: { type: 'boolean' },
          has_strongs: { type: 'boolean' },
        },
      },
      Book: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          testament_id: { type: 'integer' },
          testament_abbr: { type: 'string', example: 'OT' },
          total_chapters: { type: 'integer' },
          category: { type: 'string' },
          name: { type: 'string', example: 'Genesis' },
          book_abbr: { type: 'string', example: 'Gen' },
        },
      },
      Chapter: {
        type: 'object',
        properties: {
          chapter: { type: 'integer' },
          total_verses: { type: 'integer' },
        },
      },
      Verse: {
        type: 'object',
        properties: {
          verse: { type: 'integer' },
          text: { type: 'string' },
        },
      },
      SearchResult: {
        type: 'object',
        properties: {
          book_id: { type: 'integer' },
          book_name: { type: 'string' },
          chapter: { type: 'integer' },
          verse: { type: 'integer' },
          text: { type: 'string' },
        },
      },
      VotdResponse: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', example: '2026-02-16' },
          translation: { type: 'string', example: 'kjv_strongs' },
          reference: {
            type: 'object',
            properties: {
              book_id: { type: 'integer', example: 50 },
              book_name: { type: 'string', example: 'Philippians' },
              book_abbr: { type: 'string', example: 'Phil' },
              chapter: { type: 'integer', example: 4 },
              verse_start: { type: 'integer', example: 6 },
              verse_end: { type: 'integer', nullable: true, example: 7 },
            },
          },
          verses: {
            type: 'array',
            items: { $ref: '#/components/schemas/Verse' },
          },
          theme: { type: 'string', example: 'prayer' },
          display_reference: { type: 'string', example: 'Philippians 4:6-7' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          limit: { type: 'integer' },
          offset: { type: 'integer' },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Translation not found' },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Validation error' },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      path: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
