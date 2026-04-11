const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Bible API',
    version: '1.0.0',
    description:
      'REST API cung cấp dữ liệu Kinh Thánh từ PostgreSQL. Hỗ trợ nhiều bản dịch, tên sách đa ngôn ngữ (Anh/Việt), tìm kiếm toàn văn, và tra cứu linh hoạt theo tham chiếu. Hiện tại có 2 bản dịch: Vietnamese Cadman 1934 và King James Version (KJV) với Strong\'s Concordance.',
  },
  servers: [{ url: '/api', description: 'API base path' }],
  paths: {
    '/translations': {
      get: {
        tags: ['Translations'],
        summary: 'Lấy danh sách các bản dịch Kinh Thánh',
        description:
          'Trả về danh sách tất cả các bản dịch Kinh Thánh hiện có trong hệ thống. Mỗi bản dịch bao gồm thông tin như tên, ngôn ngữ, năm xuất bản, và trạng thái bản quyền (public domain). Hiện tại API hỗ trợ bản dịch tiếng Việt Cadman 1934 và King James Version (KJV) có tích hợp số Strong\'s Concordance để tra cứu nguyên ngữ Hebrew/Greek. Sử dụng endpoint này để hiển thị danh sách bản dịch cho người dùng chọn trước khi đọc Kinh Thánh.',
        responses: {
          200: {
            description:
              'Mảng các bản dịch. Mảng rỗng nếu chưa có bản dịch nào được import.',
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
        summary: 'Lấy thông tin chi tiết một bản dịch theo mã viết tắt',
        description:
          'Trả về thông tin chi tiết của một bản dịch Kinh Thánh cụ thể dựa trên mã viết tắt (abbreviation). Ví dụ: "cadman" cho bản Cadman 1934, "kjv_strongs" cho KJV có Strong\'s. Trả về 404 nếu không tìm thấy.',
        parameters: [
          {
            name: 'abbr',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description:
              'Mã viết tắt của bản dịch (ví dụ: "cadman", "kjv_strongs")',
          },
        ],
        responses: {
          200: {
            description: 'Thông tin chi tiết bản dịch',
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
        summary: 'Lấy danh sách 66 sách Kinh Thánh theo bản dịch',
        description:
          'Trả về danh sách đầy đủ 66 sách Kinh Thánh (chính kinh Tin Lành / Protestant canon), bao gồm thông tin giao ước (Cựu Ước 39 sách, Tân Ước 27 sách), thể loại văn chương, và tổng số chương. Tên sách được trả về theo ngôn ngữ bản dịch (tiếng Việt cho Cadman, tiếng Anh cho KJV). Các thể loại bao gồm: "law" (Ngũ Kinh), "history" (Lịch sử), "poetry" (Thơ ca), "major_prophecy" / "minor_prophecy" (Tiên tri), "gospel" (Phúc Âm), "history_nt" (Công vụ), "pauline_epistle" (Thư Phao-lô), "general_epistle" (Thư chung), "apocalyptic" (Khải Huyền).',
        parameters: [
          {
            name: 'translation',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description:
              'Mã viết tắt bản dịch. Tên sách sẽ trả về theo ngôn ngữ bản dịch này.',
          },
        ],
        responses: {
          200: {
            description:
              'Mảng 66 sách, sắp xếp từ Sáng Thế Ký (id=1) đến Khải Huyền (id=66)',
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
        summary: 'Lấy danh sách chương và số câu của một sách',
        description:
          'Trả về tất cả các chương của một sách cùng tổng số câu (verse) trong mỗi chương. Book ID từ 1 đến 66 (1 = Sáng Thế Ký, 66 = Khải Huyền). Lưu ý: số câu mỗi chương có thể khác nhau giữa các bản dịch. Ví dụ: Thi Thiên 119 có 176 câu (chương dài nhất). Một số sách chỉ có 1 chương: Áp-đia, Phi-lê-môn, 2 Giăng, 3 Giăng, Giu-đe.',
        parameters: [
          {
            name: 'bookId',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 66 },
            description:
              'ID sách Kinh Thánh, từ 1 (Sáng Thế Ký / Genesis) đến 66 (Khải Huyền / Revelation)',
          },
          {
            name: 'translation',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description:
              'Mã viết tắt bản dịch. Số câu mỗi chương có thể khác nhau tùy bản dịch.',
          },
        ],
        responses: {
          200: {
            description: 'Mảng các chương, mỗi object chứa số chương và tổng số câu',
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
        summary: 'Lấy tất cả các câu trong một chương',
        description:
          'Trả về toàn bộ nội dung các câu Kinh Thánh trong một chương. Đây là endpoint chính để hiển thị nội dung đọc Kinh Thánh theo chương. Các câu được trả về theo thứ tự từ câu 1 đến câu cuối. Trả về 404 nếu bản dịch, sách, hoặc chương không tồn tại.',
        parameters: [
          {
            name: 'translation',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Mã viết tắt bản dịch (ví dụ: "cadman", "kjv_strongs")',
          },
          {
            name: 'book',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 66 },
            description:
              'ID sách (1-66). Ví dụ: 1 = Sáng Thế Ký, 19 = Thi Thiên, 43 = Giăng, 66 = Khải Huyền',
          },
          {
            name: 'chapter',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description:
              'Số chương, bắt đầu từ 1. Phải nằm trong phạm vi hợp lệ của sách đã chọn.',
          },
        ],
        responses: {
          200: {
            description: 'Mảng các câu Kinh Thánh trong chương',
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
        summary: 'Lấy một câu Kinh Thánh cụ thể',
        description:
          'Trả về nội dung của một câu Kinh Thánh duy nhất. Phù hợp để hiển thị khi người dùng nhấn vào cross-reference hoặc chia sẻ một câu. Ví dụ: GET /verses/kjv_strongs/43/3/16 trả về Giăng 3:16 bản KJV. Trả về 404 nếu câu không tồn tại (ví dụ: Sáng Thế Ký 1:32 — chương 1 chỉ có 31 câu).',
        parameters: [
          {
            name: 'translation',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Mã viết tắt bản dịch',
          },
          {
            name: 'book',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1, maximum: 66 },
            description: 'ID sách (1-66)',
          },
          {
            name: 'chapter',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'Số chương, bắt đầu từ 1',
          },
          {
            name: 'verse',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description:
              'Số câu, bắt đầu từ 1. Phải nằm trong phạm vi hợp lệ của chương đã chọn.',
          },
        ],
        responses: {
          200: {
            description: 'Nội dung câu Kinh Thánh',
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
        summary: 'Lấy Câu Gốc Mỗi Ngày (Verse of the Day)',
        description:
          'Trả về một hoặc nhiều câu Kinh Thánh được chọn làm Câu Gốc Mỗi Ngày. Câu gốc được chọn theo lịch (calendar-based) với cơ chế fallback xác định (deterministic) — cùng một ngày sẽ luôn trả về cùng một câu gốc. Mỗi câu gốc đi kèm chủ đề (theme) như "prayer" (cầu nguyện), "faith" (đức tin), "love" (tình yêu thương), "hope" (hy vọng), "wisdom" (khôn ngoan). Response bao gồm "display_reference" đã format sẵn (ví dụ: "Philippians 4:6-7") để hiển thị trực tiếp, client không cần tự xử lý.',
        parameters: [
          {
            name: 'date',
            in: 'query',
            schema: { type: 'string', format: 'date', example: '2026-04-11' },
            description:
              'Ngày cần lấy câu gốc, định dạng YYYY-MM-DD. Mặc định là ngày hôm nay.',
          },
          {
            name: 'translation',
            in: 'query',
            schema: { type: 'string', example: 'kjv_strongs' },
            description:
              'Mã viết tắt bản dịch cho câu gốc. Mặc định: "kjv_strongs".',
          },
        ],
        responses: {
          200: {
            description:
              'Câu gốc mỗi ngày, bao gồm reference, nội dung câu, chủ đề, và chuỗi hiển thị',
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
        summary: 'Tìm kiếm toàn văn trong Kinh Thánh',
        description:
          'Thực hiện tìm kiếm toàn văn (full-text search) trên nội dung các câu Kinh Thánh. Hỗ trợ tìm kiếm bằng từ khóa hoặc cụm từ. Kết quả được phân trang (pagination) với "limit" và "offset". Kết quả trả về bao gồm tên sách, chương, câu, và nội dung khớp với từ khóa. Tổng số kết quả (total) được trả về để hỗ trợ phân trang phía client.',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 1 },
            description:
              'Từ khóa hoặc cụm từ tìm kiếm. Ví dụ: "love", "faith", "tình yêu thương"',
          },
          {
            name: 'translation',
            in: 'query',
            required: true,
            schema: { type: 'string', minLength: 1 },
            description:
              'Mã viết tắt bản dịch để giới hạn phạm vi tìm kiếm (ví dụ: "cadman", "kjv_strongs")',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description:
              'Số kết quả tối đa mỗi trang. Mặc định: 20, tối đa: 100.',
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
            description:
              'Số kết quả bỏ qua từ đầu, dùng cho phân trang. Mặc định: 0. Trang tiếp theo: offset = offset_hiện_tại + limit.',
          },
        ],
        responses: {
          200: {
            description:
              'Kết quả tìm kiếm kèm thông tin phân trang. Mảng rỗng nếu không tìm thấy.',
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
        description: 'Thông tin bản dịch Kinh Thánh',
        properties: {
          id: { type: 'integer', description: 'ID nội bộ của bản dịch' },
          abbr: {
            type: 'string',
            example: 'cadman',
            description:
              'Mã viết tắt duy nhất, dùng trong các endpoint khác',
          },
          name: {
            type: 'string',
            example: 'Vietnamese Cadman',
            description: 'Tên đầy đủ của bản dịch',
          },
          language: {
            type: 'string',
            example: 'vi',
            description: 'Mã ngôn ngữ theo ISO 639-1 ("en", "vi")',
          },
          description: {
            type: 'string',
            description:
              'Mô tả bản dịch: lịch sử, đặc điểm dịch thuật, ghi chú',
          },
          year: {
            type: 'integer',
            description: 'Năm xuất bản hoặc hoàn thành bản dịch',
          },
          is_public_domain: {
            type: 'boolean',
            description:
              'true = thuộc phạm vi công cộng (public domain), được tự do sử dụng và phân phối',
          },
          has_strongs: {
            type: 'boolean',
            description:
              "true = có tích hợp Strong's Concordance (liên kết từng từ với nguyên ngữ Hebrew/Greek)",
          },
        },
      },
      Book: {
        type: 'object',
        description: 'Thông tin sách Kinh Thánh',
        properties: {
          id: {
            type: 'integer',
            description:
              'ID theo thứ tự chính kinh: 1 (Sáng Thế Ký) đến 66 (Khải Huyền). Cố định trên mọi bản dịch.',
          },
          testament_id: {
            type: 'integer',
            description: '1 = Cựu Ước (39 sách), 2 = Tân Ước (27 sách)',
          },
          testament_abbr: {
            type: 'string',
            example: 'OT',
            description: '"OT" = Cựu Ước (Old Testament), "NT" = Tân Ước (New Testament)',
          },
          total_chapters: {
            type: 'integer',
            description:
              'Tổng số chương. Ví dụ: Sáng Thế Ký = 50, Thi Thiên = 150 (nhiều nhất), Áp-đia = 1 (ít nhất CƯ)',
          },
          category: {
            type: 'string',
            description:
              'Thể loại: "law" (Ngũ Kinh), "history" (Lịch sử), "poetry" (Thơ ca), "major_prophecy"/"minor_prophecy" (Tiên tri), "gospel" (Phúc Âm), "history_nt" (Công vụ), "pauline_epistle" (Thư Phao-lô), "general_epistle" (Thư chung), "apocalyptic" (Khải Huyền)',
          },
          name: {
            type: 'string',
            example: 'Genesis',
            description:
              'Tên sách theo ngôn ngữ bản dịch (tiếng Việt cho Cadman, tiếng Anh cho KJV)',
          },
          book_abbr: {
            type: 'string',
            example: 'Gen',
            description: 'Mã viết tắt chuẩn của sách',
          },
        },
      },
      Chapter: {
        type: 'object',
        description: 'Thông tin chương',
        properties: {
          chapter: {
            type: 'integer',
            description: 'Số thứ tự chương (bắt đầu từ 1)',
          },
          total_verses: {
            type: 'integer',
            description:
              'Tổng số câu trong chương. Có thể khác nhau giữa các bản dịch.',
          },
        },
      },
      Verse: {
        type: 'object',
        description: 'Nội dung câu Kinh Thánh',
        properties: {
          verse: {
            type: 'integer',
            description: 'Số thứ tự câu trong chương (bắt đầu từ 1)',
          },
          text: {
            type: 'string',
            description:
              "Nội dung câu Kinh Thánh. Bản KJV có Strong's sẽ bao gồm ký hiệu Strong's number đi kèm (ví dụ: {G2316} = God trong nguyên ngữ Greek).",
          },
        },
      },
      SearchResult: {
        type: 'object',
        description: 'Kết quả tìm kiếm',
        properties: {
          book_id: {
            type: 'integer',
            description:
              'ID sách chứa kết quả (1-66). Dùng để nhóm hoặc lọc kết quả theo sách.',
          },
          book_name: {
            type: 'string',
            description:
              'Tên sách theo ngôn ngữ bản dịch (ví dụ: "Sáng Thế Ký" cho Cadman, "Genesis" cho KJV)',
          },
          chapter: {
            type: 'integer',
            description: 'Số chương chứa câu khớp với từ khóa',
          },
          verse: {
            type: 'integer',
            description: 'Số câu chứa kết quả tìm kiếm',
          },
          text: {
            type: 'string',
            description: 'Nội dung đầy đủ của câu Kinh Thánh khớp với từ khóa',
          },
        },
      },
      VotdResponse: {
        type: 'object',
        description: 'Câu Gốc Mỗi Ngày',
        properties: {
          date: {
            type: 'string',
            format: 'date',
            example: '2026-04-11',
            description:
              'Ngày tương ứng câu gốc (YYYY-MM-DD). Cùng ngày luôn trả về cùng câu gốc.',
          },
          translation: {
            type: 'string',
            example: 'kjv_strongs',
            description: 'Mã viết tắt bản dịch của câu gốc',
          },
          reference: {
            type: 'object',
            description:
              'Tham chiếu Kinh Thánh dạng chuẩn (machine-readable). Dùng cho xử lý logic phía client.',
            properties: {
              book_id: {
                type: 'integer',
                example: 50,
                description: 'ID sách (1-66)',
              },
              book_name: {
                type: 'string',
                example: 'Philippians',
                description: 'Tên sách theo ngôn ngữ bản dịch',
              },
              book_abbr: {
                type: 'string',
                example: 'Phil',
                description: 'Mã viết tắt sách',
              },
              chapter: {
                type: 'integer',
                example: 4,
                description: 'Số chương',
              },
              verse_start: {
                type: 'integer',
                example: 6,
                description: 'Câu bắt đầu',
              },
              verse_end: {
                type: 'integer',
                nullable: true,
                example: 7,
                description:
                  'Câu kết thúc (null nếu chỉ có 1 câu). Ví dụ: verse_start=6, verse_end=7 nghĩa là câu 6-7.',
              },
            },
          },
          verses: {
            type: 'array',
            items: { $ref: '#/components/schemas/Verse' },
            description:
              'Mảng các câu Kinh Thánh. Có thể nhiều câu nếu câu gốc là đoạn liên tục (ví dụ: Phi-líp 4:6-7 gồm 2 câu).',
          },
          theme: {
            type: 'string',
            example: 'prayer',
            description:
              'Chủ đề câu gốc: "prayer" (cầu nguyện), "faith" (đức tin), "love" (tình yêu), "hope" (hy vọng), "wisdom" (khôn ngoan), "comfort" (an ủi), "strength" (sức mạnh). Dùng để hiển thị nhãn hoặc icon.',
          },
          display_reference: {
            type: 'string',
            example: 'Philippians 4:6-7',
            description:
              'Chuỗi tham chiếu đã format sẵn để hiển thị trực tiếp. Client không cần tự format — dùng trực tiếp giá trị này.',
          },
        },
      },
      Pagination: {
        type: 'object',
        description: 'Thông tin phân trang',
        properties: {
          total: {
            type: 'integer',
            description:
              'Tổng số kết quả khớp (trước khi phân trang). Tính tổng trang: Math.ceil(total / limit)',
          },
          limit: {
            type: 'integer',
            description:
              'Số kết quả tối đa trong response hiện tại',
          },
          offset: {
            type: 'integer',
            description:
              'Vị trí bắt đầu trang hiện tại (từ 0). Trang tiếp theo: offset + limit',
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: 'Không tìm thấy tài nguyên',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Translation not found',
                  description: 'Thông báo lỗi mô tả tài nguyên không tìm thấy',
                },
              },
            },
          },
        },
      },
      ValidationError: {
        description: 'Lỗi validation — tham số không hợp lệ',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Validation error',
                  description: 'Thông báo lỗi chung',
                },
                details: {
                  type: 'array',
                  description:
                    'Danh sách chi tiết các lỗi validation. Mỗi item chứa tên tham số và thông báo lỗi cụ thể.',
                  items: {
                    type: 'object',
                    properties: {
                      path: {
                        type: 'string',
                        description: 'Tên tham số bị lỗi',
                      },
                      message: {
                        type: 'string',
                        description: 'Mô tả lỗi cụ thể',
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
  },
};

module.exports = swaggerSpec;
