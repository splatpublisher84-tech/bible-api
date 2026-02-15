-- ============================================================================
-- Book names tu Bible SuperSearch API (api.biblesupersearch.com/api/books)
-- Nguon: https://api.biblesupersearch.com/api/books?language=en|vi
-- Luu y: Day la ten sach theo NGON NGU, khong phai theo tung ban dich
-- Abbreviation tieng Viet tu API la null -> dung abbr tu truoc (chua verify)
-- Chay sau khi da import translations (003, 004...)
-- ============================================================================

BEGIN;

-- ============================================================================
-- BOOK NAMES - Cadman (translation_id = 1, Vietnamese)
-- ============================================================================
INSERT INTO book_names (translation_id, book_id, name, abbr) VALUES
    (1, 1,  'Sáng-thế Ký',                'Sa'),
    (1, 2,  'Xuất Ê-díp-tô Ký',           'Xu'),
    (1, 3,  'Lê-vi Ký',                    'Le'),
    (1, 4,  'Dân-số Ký',                   'Da'),
    (1, 5,  'Phục-truyền Luật-lệ Ký',      'Ph'),
    (1, 6,  'Gi-ô-su-ê',                   'Gio'),
    (1, 7,  'Các Quan Xét',                'Qu'),
    (1, 8,  'Ru-tơ',                       'Ru'),
    (1, 9,  '1 Sa-mu-ên',                  '1Sa'),
    (1, 10, '2 Sa-mu-ên',                  '2Sa'),
    (1, 11, '1 Các Vua',                   '1Vu'),
    (1, 12, '2 Các Vua',                   '2Vu'),
    (1, 13, '1 Sử-ký',                     '1Su'),
    (1, 14, '2 Sử-ký',                     '2Su'),
    (1, 15, 'Ê-xơ-ra',                     'Ex'),
    (1, 16, 'Nê-hê-mi',                    'Ne'),
    (1, 17, 'Ê-xơ-tê',                     'Et'),
    (1, 18, 'Giốp',                        'Gi'),
    (1, 19, 'Thi-thiên',                   'Th'),
    (1, 20, 'Châm-ngôn',                   'Ch'),
    (1, 21, 'Truyền-đạo',                  'Tr'),
    (1, 22, 'Nhã-ca',                      'Nh'),
    (1, 23, 'Ê-sai',                       'Es'),
    (1, 24, 'Giê-rê-mi',                   'Gi'),
    (1, 25, 'Ca-thương',                   'Ca'),
    (1, 26, 'Ê-xê-chi-ên',                'Ec'),
    (1, 27, 'Đa-ni-ên',                    'Da'),
    (1, 28, 'Ô-sê',                        'Os'),
    (1, 29, 'Giô-ên',                      'Ge'),
    (1, 30, 'A-mốt',                       'Am'),
    (1, 31, 'Áp-đia',                      'Ab'),
    (1, 32, 'Giô-na',                      'Gn'),
    (1, 33, 'Mi-chê',                      'Mi'),
    (1, 34, 'Na-hum',                      'Na'),
    (1, 35, 'Ha-ba-cúc',                   'Ha'),
    (1, 36, 'Sô-phô-ni',                   'So'),
    (1, 37, 'A-ghê',                       'Ag'),
    (1, 38, 'Xa-cha-ri',                   'Xa'),
    (1, 39, 'Ma-la-chi',                   'Ma'),
    (1, 40, 'Ma-thi-ơ',                    'Mt'),
    (1, 41, 'Mác',                         'Mc'),
    (1, 42, 'Lu-ca',                       'Lu'),
    (1, 43, 'Giăng',                       'Gi'),
    (1, 44, 'Công-vụ các Sứ-đồ',           'Cv'),
    (1, 45, 'Rô-ma',                       'Ro'),
    (1, 46, '1 Cô-rinh-tô',               '1Co'),
    (1, 47, '2 Cô-rinh-tô',               '2Co'),
    (1, 48, 'Ga-la-ti',                    'Ga'),
    (1, 49, 'Ê-phê-sô',                   'Ep'),
    (1, 50, 'Phi-líp',                     'Pl'),
    (1, 51, 'Cô-lô-se',                   'Cl'),
    (1, 52, '1 Tê-sa-lô-ni-ca',           '1Te'),
    (1, 53, '2 Tê-sa-lô-ni-ca',           '2Te'),
    (1, 54, '1 Ti-mô-thê',                '1Ti'),
    (1, 55, '2 Ti-mô-thê',                '2Ti'),
    (1, 56, 'Tit',                         'Tit'),
    (1, 57, 'Phi-lê-môn',                  'Pm'),
    (1, 58, 'Hê-bơ-rơ',                   'He'),
    (1, 59, 'Gia-cơ',                      'Gc'),
    (1, 60, '1 Phi-e-rơ',                 '1Phi'),
    (1, 61, '2 Phi-e-rơ',                 '2Phi'),
    (1, 62, '1 Giăng',                    '1Gi'),
    (1, 63, '2 Giăng',                    '2Gi'),
    (1, 64, '3 Giăng',                    '3Gi'),
    (1, 65, 'Giu-đe',                      'Gd'),
    (1, 66, 'Khải-huyền',                  'Kh');

-- ============================================================================
-- BOOK NAMES - KJV Strong's (translation_id = 2, English)
-- ============================================================================
INSERT INTO book_names (translation_id, book_id, name, abbr) VALUES
    (2, 1,  'Genesis',              'Gen'),
    (2, 2,  'Exodus',               'Ex'),
    (2, 3,  'Leviticus',            'Lev'),
    (2, 4,  'Numbers',              'Num'),
    (2, 5,  'Deuteronomy',          'Deut'),
    (2, 6,  'Joshua',               'Josh'),
    (2, 7,  'Judges',               'Judg'),
    (2, 8,  'Ruth',                 'Ru'),
    (2, 9,  '1 Samuel',             '1 Sam'),
    (2, 10, '2 Samuel',             '2 Sam'),
    (2, 11, '1 Kings',              '1 Ki'),
    (2, 12, '2 Kings',              '2 Ki'),
    (2, 13, '1 Chronicles',         '1 Chron'),
    (2, 14, '2 Chronicles',         '2 Chron'),
    (2, 15, 'Ezra',                 'Ezra'),
    (2, 16, 'Nehemiah',             'Neh'),
    (2, 17, 'Esther',               'Esth'),
    (2, 18, 'Job',                  'Job'),
    (2, 19, 'Psalms',               'Ps'),
    (2, 20, 'Proverbs',             'Prov'),
    (2, 21, 'Ecclesiastes',         'Ecc'),
    (2, 22, 'Song of Solomon',      'SOS'),
    (2, 23, 'Isaiah',               'Isa'),
    (2, 24, 'Jeremiah',             'Jer'),
    (2, 25, 'Lamentations',         'Lam'),
    (2, 26, 'Ezekiel',              'Eze'),
    (2, 27, 'Daniel',               'Dan'),
    (2, 28, 'Hosea',                'Hos'),
    (2, 29, 'Joel',                 'Joel'),
    (2, 30, 'Amos',                 'Amos'),
    (2, 31, 'Obadiah',              'Obad'),
    (2, 32, 'Jonah',                'Jon'),
    (2, 33, 'Micah',                'Micah'),
    (2, 34, 'Nahum',                'Nah'),
    (2, 35, 'Habakkuk',             'Hab'),
    (2, 36, 'Zephaniah',            'Zeph'),
    (2, 37, 'Haggai',               'Hag'),
    (2, 38, 'Zechariah',            'Zech'),
    (2, 39, 'Malachi',              'Mal'),
    (2, 40, 'Matthew',              'Matt'),
    (2, 41, 'Mark',                 'Mark'),
    (2, 42, 'Luke',                 'Luke'),
    (2, 43, 'John',                 'John'),
    (2, 44, 'Acts',                 'Acts'),
    (2, 45, 'Romans',               'Rom'),
    (2, 46, '1 Corinthians',        '1 Cor'),
    (2, 47, '2 Corinthians',        '2 Cor'),
    (2, 48, 'Galatians',            'Gal'),
    (2, 49, 'Ephesians',            'Eph'),
    (2, 50, 'Philippians',          'Phil'),
    (2, 51, 'Colossians',           'Col'),
    (2, 52, '1 Thessalonians',      '1 Thess'),
    (2, 53, '2 Thessalonians',      '2 Thess'),
    (2, 54, '1 Timothy',            '1 Tim'),
    (2, 55, '2 Timothy',            '2 Tim'),
    (2, 56, 'Titus',                'Titus'),
    (2, 57, 'Philemon',             'Phm'),
    (2, 58, 'Hebrews',              'Heb'),
    (2, 59, 'James',                'Jas'),
    (2, 60, '1 Peter',              '1 Pet'),
    (2, 61, '2 Peter',              '2 Pet'),
    (2, 62, '1 John',               '1 John'),
    (2, 63, '2 John',               '2 John'),
    (2, 64, '3 John',               '3 John'),
    (2, 65, 'Jude',                 'Jude'),
    (2, 66, 'Revelation',           'Rev');

-- ============================================================================
-- BOOK ALIASES (chua day du, chi co 6 sach mau)
-- ============================================================================
INSERT INTO book_aliases (book_id, alias, language) VALUES
    -- Genesis
    (1, 'Ge', 'en'), (1, 'Gn', 'en'), (1, 'Gen', 'en'), (1, 'Genesis', 'en'),
    (1, 'Sa', 'vi'), (1, 'Sang', 'vi'), (1, 'Sang The', 'vi'), (1, 'Sang The Ky', 'vi'),
    -- Exodus
    (2, 'Ex', 'en'), (2, 'Exo', 'en'), (2, 'Exod', 'en'), (2, 'Exodus', 'en'),
    (2, 'Xu', 'vi'), (2, 'Xuat', 'vi'),
    -- Psalms
    (19, 'Ps', 'en'), (19, 'Psa', 'en'), (19, 'Psalm', 'en'), (19, 'Psalms', 'en'),
    (19, 'Th', 'vi'), (19, 'Thi', 'vi'), (19, 'Thi Thien', 'vi'),
    -- John (Phuc Am)
    (43, 'Jn', 'en'), (43, 'Jhn', 'en'), (43, 'John', 'en'),
    (43, 'Gi', 'vi'), (43, 'Giang', 'vi'),
    -- Romans
    (45, 'Ro', 'en'), (45, 'Rom', 'en'), (45, 'Romans', 'en'),
    (45, 'Ro', 'vi'), (45, 'Ro-ma', 'vi'),
    -- Revelation
    (66, 'Re', 'en'), (66, 'Rev', 'en'), (66, 'Revelation', 'en'),
    (66, 'Kh', 'vi'), (66, 'Khai', 'vi'), (66, 'Khai Huyen', 'vi');

COMMIT;
