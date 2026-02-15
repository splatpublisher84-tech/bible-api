-- ============================================================================
-- Bible API - Verse of the Day (VOTD) Schema + Seed Data
-- Tao bang VOTD va 365+ cau Kinh Thanh duoc tuyen chon
-- Chay sau 001_schema.sql va 002_seed.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. BANG VOTD_VERSES (Danh sach cau Kinh Thanh cho VOTD)
-- ============================================================================
-- Moi dong la mot "cau" (hoac doan cau) duoc tuyen chon lam VOTD
-- Khong phu thuoc ban dich -- chi luu toa do (book, chapter, verse)
-- Khi hien thi se JOIN voi bang verses theo translation_id cua nguoi dung
CREATE TABLE votd_verses (
    id              SERIAL PRIMARY KEY,
    book_id         SMALLINT NOT NULL REFERENCES books(id),
    chapter         SMALLINT NOT NULL,
    verse_start     SMALLINT NOT NULL,
    verse_end       SMALLINT,                   -- NULL = single verse
    theme           VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (book_id, chapter, verse_start)
);

CREATE INDEX idx_votd_verses_theme ON votd_verses (theme) WHERE is_active = true;

-- ============================================================================
-- 2. BANG VOTD_CALENDAR (Lich VOTD theo ngay trong nam)
-- ============================================================================
-- Map ngay (1-366) voi votd_verse, cho phep lap lich truoc
-- Neu khong co lich, API se chon ngau nhien tu votd_verses
CREATE TABLE votd_calendar (
    id              SERIAL PRIMARY KEY,
    day_of_year     SMALLINT NOT NULL,          -- 1-366
    votd_verse_id   INTEGER NOT NULL REFERENCES votd_verses(id),
    year            SMALLINT,                   -- NULL = dung moi nam, co gia tri = chi dung nam do
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (day_of_year, year)
);

CREATE INDEX idx_votd_calendar_day ON votd_calendar (day_of_year) WHERE is_active = true;

-- ============================================================================
-- 3. SEED DATA - 365+ cau Kinh Thanh duoc tuyen chon
-- ============================================================================
-- Phan bo: ~40% Cuu Uoc, ~60% Tan Uoc
-- Bao phu 28 chu de: hope, faith, love, comfort, wisdom, salvation, prayer,
--   praise, courage, patience, peace, joy, grace, forgiveness, trust, guidance,
--   strength, thanksgiving, mission, holiness, obedience, humility, generosity,
--   compassion, justice, truth, renewal, christmas, easter
-- Moi cau da duoc kiem tra toa do (book, chapter, verse) chinh xac
-- ============================================================================

-- --------------------------------------------------------------------------
-- BATCH 1: HOPE (Hy vong) -- 15 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (24, 29, 11, NULL, 'hope'),          -- Jeremiah 29:11
    (45, 15, 13, NULL, 'hope'),          -- Romans 15:13
    (45, 8, 24, 25, 'hope'),             -- Romans 8:24-25
    (58, 11, 1, NULL, 'hope'),           -- Hebrews 11:1
    (19, 42, 11, NULL, 'hope'),          -- Psalm 42:11
    (19, 130, 5, NULL, 'hope'),          -- Psalm 130:5
    (25, 3, 22, 23, 'hope'),             -- Lamentations 3:22-23
    (23, 40, 31, NULL, 'hope'),          -- Isaiah 40:31
    (60, 1, 3, NULL, 'hope'),            -- 1 Peter 1:3
    (45, 5, 5, NULL, 'hope'),            -- Romans 5:5
    (19, 71, 14, NULL, 'hope'),          -- Psalm 71:14
    (19, 33, 18, NULL, 'hope'),          -- Psalm 33:18
    (24, 17, 7, NULL, 'hope'),           -- Jeremiah 17:7
    (56, 2, 13, NULL, 'hope'),           -- Titus 2:13
    (19, 62, 5, NULL, 'hope');           -- Psalm 62:5

-- --------------------------------------------------------------------------
-- BATCH 2: FAITH (Duc tin) -- 15 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (58, 11, 6, NULL, 'faith'),          -- Hebrews 11:6
    (47, 5, 7, NULL, 'faith'),           -- 2 Corinthians 5:7
    (41, 11, 22, 24, 'faith'),           -- Mark 11:22-24
    (48, 2, 20, NULL, 'faith'),          -- Galatians 2:20
    (45, 10, 17, NULL, 'faith'),         -- Romans 10:17
    (59, 1, 6, NULL, 'faith'),           -- James 1:6
    (40, 17, 20, NULL, 'faith'),         -- Matthew 17:20
    (43, 11, 25, 26, 'faith'),           -- John 11:25-26
    (45, 1, 17, NULL, 'faith'),          -- Romans 1:17
    (58, 10, 38, NULL, 'faith'),         -- Hebrews 10:38
    (62, 5, 4, NULL, 'faith'),           -- 1 John 5:4
    (19, 27, 13, NULL, 'faith'),         -- Psalm 27:13
    (35, 2, 4, NULL, 'faith'),           -- Habakkuk 2:4
    (42, 17, 6, NULL, 'faith'),          -- Luke 17:6
    (58, 12, 2, NULL, 'faith');          -- Hebrews 12:2

-- --------------------------------------------------------------------------
-- BATCH 3: LOVE (Tinh yeu) -- 18 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (43, 3, 16, NULL, 'love'),           -- John 3:16
    (46, 13, 4, 7, 'love'),             -- 1 Corinthians 13:4-7
    (46, 13, 13, NULL, 'love'),          -- 1 Corinthians 13:13
    (62, 4, 8, NULL, 'love'),            -- 1 John 4:8
    (62, 4, 19, NULL, 'love'),           -- 1 John 4:19
    (45, 8, 38, 39, 'love'),             -- Romans 8:38-39
    (43, 15, 13, NULL, 'love'),          -- John 15:13
    (43, 13, 34, 35, 'love'),            -- John 13:34-35
    (5, 6, 5, NULL, 'love'),             -- Deuteronomy 6:5
    (22, 8, 6, 7, 'love'),              -- Song of Solomon 8:6-7
    (45, 13, 10, NULL, 'love'),          -- Romans 13:10
    (60, 4, 8, NULL, 'love'),            -- 1 Peter 4:8
    (49, 3, 17, 19, 'love'),             -- Ephesians 3:17-19
    (62, 4, 16, NULL, 'love'),           -- 1 John 4:16
    (19, 136, 1, NULL, 'love'),          -- Psalm 136:1
    (40, 22, 37, 39, 'love'),            -- Matthew 22:37-39
    (51, 3, 14, NULL, 'love'),           -- Colossians 3:14
    (45, 5, 8, NULL, 'love');            -- Romans 5:8

-- --------------------------------------------------------------------------
-- BATCH 4: COMFORT (An ui) -- 14 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (19, 23, 4, NULL, 'comfort'),        -- Psalm 23:4
    (40, 5, 4, NULL, 'comfort'),         -- Matthew 5:4
    (47, 1, 3, 4, 'comfort'),           -- 2 Corinthians 1:3-4
    (23, 41, 10, NULL, 'comfort'),       -- Isaiah 41:10
    (23, 66, 13, NULL, 'comfort'),       -- Isaiah 66:13
    (43, 14, 27, NULL, 'comfort'),       -- John 14:27
    (19, 34, 18, NULL, 'comfort'),       -- Psalm 34:18
    (45, 8, 28, NULL, 'comfort'),        -- Romans 8:28
    (19, 147, 3, NULL, 'comfort'),       -- Psalm 147:3
    (40, 11, 28, 30, 'comfort'),         -- Matthew 11:28-30
    (23, 43, 2, NULL, 'comfort'),        -- Isaiah 43:2
    (19, 46, 1, NULL, 'comfort'),        -- Psalm 46:1
    (66, 21, 4, NULL, 'comfort'),        -- Revelation 21:4
    (19, 55, 22, NULL, 'comfort');       -- Psalm 55:22

-- --------------------------------------------------------------------------
-- BATCH 5: WISDOM (Khon ngoan) -- 16 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (20, 3, 5, 6, 'wisdom'),            -- Proverbs 3:5-6
    (59, 1, 5, NULL, 'wisdom'),          -- James 1:5
    (20, 1, 7, NULL, 'wisdom'),          -- Proverbs 1:7
    (20, 9, 10, NULL, 'wisdom'),         -- Proverbs 9:10
    (20, 4, 7, NULL, 'wisdom'),          -- Proverbs 4:7
    (21, 7, 12, NULL, 'wisdom'),         -- Ecclesiastes 7:12
    (18, 28, 28, NULL, 'wisdom'),        -- Job 28:28
    (20, 16, 16, NULL, 'wisdom'),        -- Proverbs 16:16
    (20, 2, 6, NULL, 'wisdom'),          -- Proverbs 2:6
    (19, 111, 10, NULL, 'wisdom'),       -- Psalm 111:10
    (20, 19, 20, NULL, 'wisdom'),        -- Proverbs 19:20
    (51, 2, 3, NULL, 'wisdom'),          -- Colossians 2:3
    (20, 3, 13, NULL, 'wisdom'),         -- Proverbs 3:13
    (59, 3, 17, NULL, 'wisdom'),         -- James 3:17
    (20, 11, 2, NULL, 'wisdom'),         -- Proverbs 11:2
    (20, 15, 33, NULL, 'wisdom');        -- Proverbs 15:33

-- --------------------------------------------------------------------------
-- BATCH 6: SALVATION (Cuu roi) -- 14 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (49, 2, 8, 9, 'salvation'),          -- Ephesians 2:8-9
    (45, 6, 23, NULL, 'salvation'),       -- Romans 6:23
    (45, 10, 9, 10, 'salvation'),        -- Romans 10:9-10
    (44, 4, 12, NULL, 'salvation'),       -- Acts 4:12
    (43, 14, 6, NULL, 'salvation'),       -- John 14:6
    (43, 5, 24, NULL, 'salvation'),       -- John 5:24
    (44, 16, 31, NULL, 'salvation'),      -- Acts 16:31
    (23, 53, 5, NULL, 'salvation'),       -- Isaiah 53:5
    (45, 3, 23, 24, 'salvation'),        -- Romans 3:23-24
    (55, 1, 9, NULL, 'salvation'),        -- 2 Timothy 1:9
    (43, 1, 12, NULL, 'salvation'),       -- John 1:12
    (56, 3, 5, NULL, 'salvation'),        -- Titus 3:5
    (62, 5, 11, 12, 'salvation'),        -- 1 John 5:11-12
    (23, 12, 2, NULL, 'salvation');       -- Isaiah 12:2

-- --------------------------------------------------------------------------
-- BATCH 7: PRAYER (Cau nguyen) -- 13 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (50, 4, 6, 7, 'prayer'),            -- Philippians 4:6-7
    (52, 5, 16, 18, 'prayer'),           -- 1 Thessalonians 5:16-18
    (40, 7, 7, NULL, 'prayer'),          -- Matthew 7:7
    (24, 33, 3, NULL, 'prayer'),         -- Jeremiah 33:3
    (43, 15, 7, NULL, 'prayer'),         -- John 15:7
    (40, 6, 6, NULL, 'prayer'),          -- Matthew 6:6
    (59, 5, 16, NULL, 'prayer'),         -- James 5:16
    (62, 5, 14, 15, 'prayer'),           -- 1 John 5:14-15
    (19, 145, 18, NULL, 'prayer'),       -- Psalm 145:18
    (45, 8, 26, NULL, 'prayer'),         -- Romans 8:26
    (19, 4, 3, NULL, 'prayer'),          -- Psalm 4:3
    (14, 7, 14, NULL, 'prayer'),         -- 2 Chronicles 7:14
    (40, 21, 22, NULL, 'prayer');        -- Matthew 21:22

-- --------------------------------------------------------------------------
-- BATCH 8: PRAISE (Ngoi khen) -- 14 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (19, 150, 6, NULL, 'praise'),        -- Psalm 150:6
    (19, 100, 4, 5, 'praise'),          -- Psalm 100:4-5
    (19, 34, 1, NULL, 'praise'),         -- Psalm 34:1
    (19, 95, 1, 2, 'praise'),           -- Psalm 95:1-2
    (19, 103, 1, 2, 'praise'),          -- Psalm 103:1-2
    (58, 13, 15, NULL, 'praise'),        -- Hebrews 13:15
    (19, 145, 3, NULL, 'praise'),        -- Psalm 145:3
    (19, 148, 1, 3, 'praise'),          -- Psalm 148:1-3
    (19, 113, 3, NULL, 'praise'),        -- Psalm 113:3
    (19, 9, 1, 2, 'praise'),            -- Psalm 9:1-2
    (19, 63, 3, 4, 'praise'),           -- Psalm 63:3-4
    (19, 96, 1, 3, 'praise'),           -- Psalm 96:1-3
    (19, 117, 1, 2, 'praise'),          -- Psalm 117:1-2
    (19, 146, 1, 2, 'praise');          -- Psalm 146:1-2

-- --------------------------------------------------------------------------
-- BATCH 9: COURAGE (Can dam) -- 13 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (6, 1, 9, NULL, 'courage'),          -- Joshua 1:9
    (5, 31, 6, NULL, 'courage'),         -- Deuteronomy 31:6
    (23, 41, 13, NULL, 'courage'),       -- Isaiah 41:13
    (19, 27, 1, NULL, 'courage'),        -- Psalm 27:1
    (19, 56, 3, 4, 'courage'),          -- Psalm 56:3-4
    (55, 1, 7, NULL, 'courage'),         -- 2 Timothy 1:7
    (45, 8, 31, NULL, 'courage'),        -- Romans 8:31
    (19, 31, 24, NULL, 'courage'),       -- Psalm 31:24
    (5, 31, 8, NULL, 'courage'),         -- Deuteronomy 31:8
    (23, 43, 1, NULL, 'courage'),        -- Isaiah 43:1
    (43, 16, 33, NULL, 'courage'),       -- John 16:33
    (19, 118, 6, NULL, 'courage'),       -- Psalm 118:6
    (50, 1, 28, NULL, 'courage');        -- Philippians 1:28

-- --------------------------------------------------------------------------
-- BATCH 10: PATIENCE (Kien nhan) -- 12 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (59, 1, 3, 4, 'patience'),          -- James 1:3-4
    (45, 12, 12, NULL, 'patience'),      -- Romans 12:12
    (19, 37, 7, NULL, 'patience'),       -- Psalm 37:7
    (48, 6, 9, NULL, 'patience'),        -- Galatians 6:9
    (25, 3, 25, 26, 'patience'),         -- Lamentations 3:25-26
    (58, 10, 36, NULL, 'patience'),      -- Hebrews 10:36
    (21, 7, 8, NULL, 'patience'),        -- Ecclesiastes 7:8
    (59, 5, 7, 8, 'patience'),          -- James 5:7-8
    (45, 5, 3, 4, 'patience'),            -- Romans 5:3-4 (suffering produces perseverance)
    (51, 1, 11, NULL, 'patience'),       -- Colossians 1:11
    (19, 40, 1, NULL, 'patience'),       -- Psalm 40:1
    (45, 8, 25, NULL, 'patience');       -- Romans 8:25

-- --------------------------------------------------------------------------
-- BATCH 11: PEACE (Binh an) -- 14 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (43, 14, 1, NULL, 'peace'),          -- John 14:1
    (23, 26, 3, NULL, 'peace'),          -- Isaiah 26:3
    (50, 4, 9, NULL, 'peace'),           -- Philippians 4:9
    (43, 16, 22, NULL, 'peace'),         -- John 16:22
    (4, 6, 24, 26, 'peace'),            -- Numbers 6:24-26
    (19, 29, 11, NULL, 'peace'),         -- Psalm 29:11
    (45, 14, 17, NULL, 'peace'),         -- Romans 14:17
    (51, 3, 15, NULL, 'peace'),          -- Colossians 3:15
    (19, 4, 8, NULL, 'peace'),           -- Psalm 4:8
    (23, 54, 10, NULL, 'peace'),         -- Isaiah 54:10
    (53, 3, 16, NULL, 'peace'),          -- 2 Thessalonians 3:16
    (40, 5, 9, NULL, 'peace'),           -- Matthew 5:9
    (19, 37, 11, NULL, 'peace'),         -- Psalm 37:11
    (45, 15, 33, NULL, 'peace');         -- Romans 15:33 (God of peace)

-- --------------------------------------------------------------------------
-- BATCH 12: JOY (Vui mung) -- 13 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (50, 4, 4, NULL, 'joy'),             -- Philippians 4:4
    (16, 8, 10, NULL, 'joy'),            -- Nehemiah 8:10
    (19, 16, 11, NULL, 'joy'),           -- Psalm 16:11
    (19, 47, 1, NULL, 'joy'),             -- Psalm 47:1 (clap your hands, shout to God)
    (43, 15, 11, NULL, 'joy'),           -- John 15:11
    (59, 1, 2, NULL, 'joy'),             -- James 1:2
    (19, 126, 5, NULL, 'joy'),           -- Psalm 126:5
    (35, 3, 18, NULL, 'joy'),            -- Habakkuk 3:18
    (19, 30, 5, NULL, 'joy'),            -- Psalm 30:5
    (23, 55, 12, NULL, 'joy'),           -- Isaiah 55:12
    (48, 5, 22, NULL, 'joy'),            -- Galatians 5:22 (fruit of the Spirit)
    (42, 10, 20, NULL, 'joy'),           -- Luke 10:20
    (60, 1, 8, NULL, 'joy');             -- 1 Peter 1:8

-- --------------------------------------------------------------------------
-- BATCH 13: GRACE (An dien) -- 13 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (47, 12, 9, NULL, 'grace'),          -- 2 Corinthians 12:9
    (43, 1, 16, NULL, 'grace'),          -- John 1:16
    (45, 3, 24, NULL, 'grace'),          -- Romans 3:24
    (47, 9, 8, NULL, 'grace'),           -- 2 Corinthians 9:8
    (49, 1, 7, 8, 'grace'),             -- Ephesians 1:7-8
    (58, 4, 16, NULL, 'grace'),          -- Hebrews 4:16
    (45, 5, 20, NULL, 'grace'),          -- Romans 5:20 (where sin increased, grace overflowed)
    (45, 11, 6, NULL, 'grace'),          -- Romans 11:6
    (60, 5, 10, NULL, 'grace'),          -- 1 Peter 5:10
    (47, 8, 9, NULL, 'grace'),           -- 2 Corinthians 8:9
    (55, 2, 1, NULL, 'grace'),           -- 2 Timothy 2:1
    (61, 3, 18, NULL, 'grace'),          -- 2 Peter 3:18
    (56, 2, 11, NULL, 'grace');          -- Titus 2:11

-- --------------------------------------------------------------------------
-- BATCH 14: FORGIVENESS (Tha thu) -- 13 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (62, 1, 9, NULL, 'forgiveness'),     -- 1 John 1:9
    (49, 4, 32, NULL, 'forgiveness'),    -- Ephesians 4:32
    (19, 103, 12, NULL, 'forgiveness'),  -- Psalm 103:12
    (51, 3, 13, NULL, 'forgiveness'),    -- Colossians 3:13
    (40, 6, 14, 15, 'forgiveness'),      -- Matthew 6:14-15
    (23, 1, 18, NULL, 'forgiveness'),    -- Isaiah 1:18
    (23, 43, 25, NULL, 'forgiveness'),   -- Isaiah 43:25
    (44, 3, 19, NULL, 'forgiveness'),    -- Acts 3:19
    (19, 32, 5, NULL, 'forgiveness'),    -- Psalm 32:5
    (33, 7, 18, NULL, 'forgiveness'),    -- Micah 7:18 (Who is a God like you, pardoning)
    (40, 18, 21, 22, 'forgiveness'),     -- Matthew 18:21-22
    (42, 6, 37, NULL, 'forgiveness'),    -- Luke 6:37
    (58, 8, 12, NULL, 'forgiveness');    -- Hebrews 8:12

-- --------------------------------------------------------------------------
-- BATCH 15: TRUST (Tin cay) -- 13 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (19, 37, 5, NULL, 'trust'),          -- Psalm 37:5
    (19, 115, 11, NULL, 'trust'),         -- Psalm 115:11 (you who fear the LORD, trust)
    (19, 56, 11, NULL, 'trust'),         -- Psalm 56:11
    (20, 29, 25, NULL, 'trust'),         -- Proverbs 29:25
    (19, 9, 10, NULL, 'trust'),          -- Psalm 9:10
    (19, 125, 1, NULL, 'trust'),         -- Psalm 125:1
    (34, 1, 7, NULL, 'trust'),           -- Nahum 1:7
    (19, 62, 8, NULL, 'trust'),          -- Psalm 62:8
    (19, 91, 2, NULL, 'trust'),          -- Psalm 91:2
    (19, 28, 7, NULL, 'trust'),          -- Psalm 28:7
    (23, 26, 4, NULL, 'trust'),          -- Isaiah 26:4
    (19, 20, 7, NULL, 'trust'),          -- Psalm 20:7
    (19, 112, 7, NULL, 'trust');         -- Psalm 112:7

-- --------------------------------------------------------------------------
-- BATCH 16: GUIDANCE (Dan dat) -- 13 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (19, 119, 105, NULL, 'guidance'),    -- Psalm 119:105
    (20, 16, 9, NULL, 'guidance'),       -- Proverbs 16:9
    (19, 32, 8, NULL, 'guidance'),       -- Psalm 32:8
    (23, 30, 21, NULL, 'guidance'),      -- Isaiah 30:21
    (19, 48, 14, NULL, 'guidance'),      -- Psalm 48:14
    (43, 10, 27, NULL, 'guidance'),      -- John 10:27
    (19, 25, 4, 5, 'guidance'),          -- Psalm 25:4-5
    (23, 58, 11, NULL, 'guidance'),      -- Isaiah 58:11
    (20, 3, 6, NULL, 'guidance'),        -- Proverbs 3:6 (in all your ways acknowledge)
    (19, 73, 24, NULL, 'guidance'),      -- Psalm 73:24
    (43, 16, 13, NULL, 'guidance'),      -- John 16:13
    (19, 143, 10, NULL, 'guidance'),     -- Psalm 143:10
    (20, 4, 11, NULL, 'guidance');       -- Proverbs 4:11

-- --------------------------------------------------------------------------
-- BATCH 17: STRENGTH (Suc manh) -- 14 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (50, 4, 13, NULL, 'strength'),       -- Philippians 4:13
    (19, 18, 2, NULL, 'strength'),       -- Psalm 18:2
    (23, 40, 29, NULL, 'strength'),      -- Isaiah 40:29
    (19, 73, 26, NULL, 'strength'),      -- Psalm 73:26
    (49, 6, 10, NULL, 'strength'),       -- Ephesians 6:10
    (19, 46, 10, NULL, 'strength'),      -- Psalm 46:10 (be still and know)
    (19, 27, 14, NULL, 'strength'),      -- Psalm 27:14
    (2, 15, 2, NULL, 'strength'),        -- Exodus 15:2
    (5, 33, 25, NULL, 'strength'),       -- Deuteronomy 33:25
    (19, 28, 8, NULL, 'strength'),       -- Psalm 28:8 (not same as 28:7 in trust)
    (19, 84, 5, NULL, 'strength'),       -- Psalm 84:5
    (19, 138, 3, NULL, 'strength'),      -- Psalm 138:3
    (23, 35, 4, NULL, 'strength'),        -- Isaiah 35:4 (be strong, do not fear)
    (19, 105, 4, NULL, 'strength');      -- Psalm 105:4

-- --------------------------------------------------------------------------
-- BATCH 18: THANKSGIVING (Ta on) -- 12 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (19, 107, 1, NULL, 'thanksgiving'),  -- Psalm 107:1
    (51, 3, 17, NULL, 'thanksgiving'),   -- Colossians 3:17
    (19, 100, 1, 2, 'thanksgiving'),     -- Psalm 100:1-2
    (19, 106, 1, NULL, 'thanksgiving'),  -- Psalm 106:1
    (19, 118, 24, NULL, 'thanksgiving'), -- Psalm 118:24
    (52, 5, 18, NULL, 'thanksgiving'),   -- 1 Thessalonians 5:18
    (49, 5, 20, NULL, 'thanksgiving'),   -- Ephesians 5:20
    (19, 69, 30, NULL, 'thanksgiving'),  -- Psalm 69:30
    (19, 92, 1, 2, 'thanksgiving'),      -- Psalm 92:1-2
    (19, 7, 17, NULL, 'thanksgiving'),   -- Psalm 7:17
    (13, 16, 34, NULL, 'thanksgiving'),  -- 1 Chronicles 16:34
    (19, 136, 26, NULL, 'thanksgiving'); -- Psalm 136:26

-- --------------------------------------------------------------------------
-- BATCH 19: MISSION (Su menh / Truyen giao) -- 12 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (40, 28, 19, 20, 'mission'),         -- Matthew 28:19-20
    (44, 1, 8, NULL, 'mission'),         -- Acts 1:8
    (41, 16, 15, NULL, 'mission'),       -- Mark 16:15
    (45, 10, 14, 15, 'mission'),         -- Romans 10:14-15
    (23, 6, 8, NULL, 'mission'),         -- Isaiah 6:8
    (40, 5, 14, 16, 'mission'),          -- Matthew 5:14-16
    (43, 20, 21, NULL, 'mission'),       -- John 20:21
    (47, 5, 20, NULL, 'mission'),        -- 2 Corinthians 5:20
    (40, 9, 37, 38, 'mission'),          -- Matthew 9:37-38
    (42, 4, 18, 19, 'mission'),          -- Luke 4:18-19
    (44, 13, 47, NULL, 'mission'),       -- Acts 13:47
    (45, 1, 16, NULL, 'mission');        -- Romans 1:16

-- --------------------------------------------------------------------------
-- BATCH 20: HOLINESS (Thanh khiet) -- 12 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (60, 1, 15, 16, 'holiness'),         -- 1 Peter 1:15-16
    (45, 12, 1, NULL, 'holiness'),       -- Romans 12:1
    (52, 4, 7, NULL, 'holiness'),        -- 1 Thessalonians 4:7
    (58, 12, 14, NULL, 'holiness'),      -- Hebrews 12:14
    (19, 24, 3, 4, 'holiness'),          -- Psalm 24:3-4
    (3, 19, 2, NULL, 'holiness'),        -- Leviticus 19:2
    (47, 7, 1, NULL, 'holiness'),        -- 2 Corinthians 7:1
    (55, 2, 21, NULL, 'holiness'),       -- 2 Timothy 2:21
    (23, 6, 3, NULL, 'holiness'),        -- Isaiah 6:3
    (19, 99, 9, NULL, 'holiness'),       -- Psalm 99:9
    (45, 6, 22, NULL, 'holiness'),       -- Romans 6:22
    (43, 17, 17, NULL, 'holiness');      -- John 17:17

-- --------------------------------------------------------------------------
-- BATCH 21: OBEDIENCE (Vang phuc) -- 12 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (43, 14, 15, NULL, 'obedience'),     -- John 14:15
    (9, 15, 22, NULL, 'obedience'),      -- 1 Samuel 15:22
    (5, 11, 1, NULL, 'obedience'),       -- Deuteronomy 11:1
    (59, 1, 22, NULL, 'obedience'),      -- James 1:22
    (43, 14, 21, NULL, 'obedience'),     -- John 14:21
    (5, 28, 1, NULL, 'obedience'),       -- Deuteronomy 28:1
    (42, 11, 28, NULL, 'obedience'),     -- Luke 11:28
    (44, 5, 29, NULL, 'obedience'),      -- Acts 5:29
    (62, 2, 3, NULL, 'obedience'),       -- 1 John 2:3 (we keep his commands)
    (45, 13, 1, NULL, 'obedience'),      -- Romans 13:1
    (19, 119, 1, 2, 'obedience'),        -- Psalm 119:1-2
    (6, 22, 5, NULL, 'obedience');       -- Joshua 22:5

-- --------------------------------------------------------------------------
-- BATCH 22: HUMILITY (Khiem nhuong) -- 12 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (50, 2, 3, 4, 'humility'),          -- Philippians 2:3-4
    (59, 4, 10, NULL, 'humility'),       -- James 4:10
    (20, 22, 4, NULL, 'humility'),       -- Proverbs 22:4
    (33, 6, 8, NULL, 'humility'),        -- Micah 6:8
    (40, 23, 12, NULL, 'humility'),      -- Matthew 23:12
    (60, 5, 6, NULL, 'humility'),        -- 1 Peter 5:6
    (20, 18, 12, NULL, 'humility'),       -- Proverbs 18:12 (before honor is humility)
    (49, 4, 2, NULL, 'humility'),        -- Ephesians 4:2
    (51, 3, 12, NULL, 'humility'),       -- Colossians 3:12
    (40, 18, 4, NULL, 'humility'),       -- Matthew 18:4
    (19, 25, 9, NULL, 'humility'),       -- Psalm 25:9
    (19, 149, 4, NULL, 'humility');      -- Psalm 149:4

-- --------------------------------------------------------------------------
-- BATCH 23: GENEROSITY (Rong luong) -- 11 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (47, 9, 7, NULL, 'generosity'),      -- 2 Corinthians 9:7
    (20, 11, 25, NULL, 'generosity'),    -- Proverbs 11:25
    (42, 6, 38, NULL, 'generosity'),     -- Luke 6:38
    (44, 20, 35, NULL, 'generosity'),    -- Acts 20:35
    (20, 19, 17, NULL, 'generosity'),    -- Proverbs 19:17
    (40, 6, 3, 4, 'generosity'),         -- Matthew 6:3-4
    (20, 22, 9, NULL, 'generosity'),     -- Proverbs 22:9
    (54, 6, 17, 18, 'generosity'),       -- 1 Timothy 6:17-18
    (5, 15, 10, NULL, 'generosity'),     -- Deuteronomy 15:10
    (39, 3, 10, NULL, 'generosity'),     -- Malachi 3:10
    (20, 3, 9, NULL, 'generosity');      -- Proverbs 3:9

-- --------------------------------------------------------------------------
-- BATCH 24: COMPASSION (Thuong xot) -- 11 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (40, 25, 35, 36, 'compassion'),      -- Matthew 25:35-36 (I was hungry and you gave me food)
    (40, 9, 36, NULL, 'compassion'),     -- Matthew 9:36
    (19, 86, 15, NULL, 'compassion'),    -- Psalm 86:15
    (19, 145, 9, NULL, 'compassion'),    -- Psalm 145:9
    (23, 49, 13, NULL, 'compassion'),    -- Isaiah 49:13
    (42, 6, 36, NULL, 'compassion'),     -- Luke 6:36
    (38, 7, 9, NULL, 'compassion'),      -- Zechariah 7:9
    (23, 63, 9, NULL, 'compassion'),      -- Isaiah 63:9 (in all their affliction He was afflicted)
    (19, 103, 13, NULL, 'compassion'),   -- Psalm 103:13
    (33, 7, 19, NULL, 'compassion'),     -- Micah 7:19
    (42, 10, 33, 37, 'compassion');      -- Luke 10:33-37 (Good Samaritan)

-- --------------------------------------------------------------------------
-- BATCH 25: JUSTICE (Cong ly) -- 11 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (23, 1, 17, NULL, 'justice'),        -- Isaiah 1:17
    (30, 5, 24, NULL, 'justice'),        -- Amos 5:24
    (19, 89, 14, NULL, 'justice'),       -- Psalm 89:14
    (20, 21, 3, NULL, 'justice'),        -- Proverbs 21:3
    (23, 61, 8, NULL, 'justice'),        -- Isaiah 61:8
    (19, 37, 28, NULL, 'justice'),       -- Psalm 37:28
    (19, 106, 3, NULL, 'justice'),       -- Psalm 106:3
    (5, 16, 20, NULL, 'justice'),        -- Deuteronomy 16:20
    (24, 22, 3, NULL, 'justice'),        -- Jeremiah 22:3
    (19, 82, 3, NULL, 'justice'),        -- Psalm 82:3
    (20, 31, 8, 9, 'justice');           -- Proverbs 31:8-9

-- --------------------------------------------------------------------------
-- BATCH 26: TRUTH (Le that) -- 11 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (43, 8, 32, NULL, 'truth'),          -- John 8:32
    (43, 18, 37, NULL, 'truth'),          -- John 18:37 (I came to testify to the truth)
    (49, 4, 15, NULL, 'truth'),          -- Ephesians 4:15
    (62, 3, 18, NULL, 'truth'),          -- 1 John 3:18
    (19, 25, 5, NULL, 'truth'),          -- Psalm 25:5
    (19, 119, 160, NULL, 'truth'),       -- Psalm 119:160
    (43, 4, 24, NULL, 'truth'),          -- John 4:24 (worship in spirit and truth)
    (20, 12, 22, NULL, 'truth'),         -- Proverbs 12:22
    (64, 1, 4, NULL, 'truth'),           -- 3 John 1:4
    (19, 86, 11, NULL, 'truth'),         -- Psalm 86:11
    (38, 8, 16, NULL, 'truth');          -- Zechariah 8:16

-- --------------------------------------------------------------------------
-- BATCH 27: RENEWAL (Doi moi) -- 11 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (47, 5, 17, NULL, 'renewal'),        -- 2 Corinthians 5:17
    (45, 12, 2, NULL, 'renewal'),        -- Romans 12:2
    (23, 43, 18, 19, 'renewal'),         -- Isaiah 43:18-19
    (26, 36, 26, NULL, 'renewal'),       -- Ezekiel 36:26
    (19, 51, 10, NULL, 'renewal'),       -- Psalm 51:10
    (66, 21, 5, NULL, 'renewal'),        -- Revelation 21:5
    (47, 4, 16, NULL, 'renewal'),        -- 2 Corinthians 4:16
    (23, 40, 28, NULL, 'renewal'),        -- Isaiah 40:28 (the LORD is the everlasting God)
    (49, 4, 23, 24, 'renewal'),          -- Ephesians 4:23-24
    (19, 104, 30, NULL, 'renewal'),      -- Psalm 104:30
    (25, 5, 21, NULL, 'renewal');        -- Lamentations 5:21

-- --------------------------------------------------------------------------
-- BATCH 28: CHRISTMAS (Giang sinh) -- 10 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (23, 9, 6, NULL, 'christmas'),       -- Isaiah 9:6
    (42, 2, 10, 11, 'christmas'),        -- Luke 2:10-11
    (42, 2, 14, NULL, 'christmas'),      -- Luke 2:14
    (40, 1, 23, NULL, 'christmas'),      -- Matthew 1:23
    (23, 7, 14, NULL, 'christmas'),      -- Isaiah 7:14
    (43, 1, 14, NULL, 'christmas'),      -- John 1:14
    (33, 5, 2, NULL, 'christmas'),       -- Micah 5:2
    (42, 1, 46, 47, 'christmas'),        -- Luke 1:46-47 (Magnificat)
    (40, 2, 10, 11, 'christmas'),        -- Matthew 2:10-11
    (48, 4, 4, 5, 'christmas');          -- Galatians 4:4-5

-- --------------------------------------------------------------------------
-- BATCH 29: EASTER (Phuc sinh) -- 10 verses
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (45, 6, 9, NULL, 'easter'),          -- Romans 6:9
    (46, 15, 55, 57, 'easter'),          -- 1 Corinthians 15:55-57
    (43, 20, 29, NULL, 'easter'),         -- John 20:29 (blessed are those who have not seen)
    (40, 28, 6, NULL, 'easter'),         -- Matthew 28:6 (He is not here; He is risen)
    (45, 8, 34, NULL, 'easter'),         -- Romans 8:34
    (44, 2, 24, NULL, 'easter'),          -- Acts 2:24 (God raised him from the dead)
    (46, 15, 3, 4, 'easter'),            -- 1 Corinthians 15:3-4
    (50, 3, 10, 11, 'easter'),           -- Philippians 3:10-11
    (46, 15, 20, NULL, 'easter'),        -- 1 Corinthians 15:20
    (42, 24, 6, 7, 'easter');            -- Luke 24:6-7

-- --------------------------------------------------------------------------
-- BATCH 30: ADDITIONAL WELL-KNOWN VERSES (Bo sung cac cau noi tieng)
-- Mix of themes to reach 365+
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    -- Genesis
    (1, 1, 1, NULL, 'faith'),            -- Genesis 1:1 (In the beginning)
    (1, 12, 2, NULL, 'hope'),            -- Genesis 12:2 (I will bless you)
    (1, 28, 15, NULL, 'trust'),          -- Genesis 28:15 (I am with you)
    (1, 50, 20, NULL, 'trust'),          -- Genesis 50:20 (meant for good)
    -- Exodus
    (2, 14, 14, NULL, 'courage'),        -- Exodus 14:14 (The LORD will fight for you)
    (2, 33, 14, NULL, 'peace'),          -- Exodus 33:14 (My presence will go with you)
    -- Numbers
    (4, 23, 19, NULL, 'trust'),          -- Numbers 23:19 (God is not a man that he should lie)
    -- Deuteronomy
    (5, 7, 9, NULL, 'love'),             -- Deuteronomy 7:9 (faithful God)
    -- Ruth
    (8, 1, 16, NULL, 'love'),            -- Ruth 1:16 (where you go I will go)
    -- 1 Samuel
    (9, 16, 7, NULL, 'wisdom'),          -- 1 Samuel 16:7 (the LORD looks at the heart)
    -- 2 Samuel
    (10, 22, 31, NULL, 'trust'),         -- 2 Samuel 22:31 (His way is perfect)
    -- 1 Kings
    (11, 8, 56, NULL, 'thanksgiving'),   -- 1 Kings 8:56 (not one word has failed)
    -- 2 Chronicles
    (14, 20, 15, NULL, 'courage'),       -- 2 Chronicles 20:15 (battle is not yours but God's)
    -- Nehemiah
    (16, 9, 17, NULL, 'grace'),          -- Nehemiah 9:17 (God ready to pardon)
    -- Esther
    (17, 4, 14, NULL, 'courage'),        -- Esther 4:14 (for such a time as this)
    -- Job
    (18, 19, 25, NULL, 'hope'),          -- Job 19:25 (I know my Redeemer lives)
    (18, 42, 2, NULL, 'faith'),          -- Job 42:2 (no plan can be thwarted)
    -- Psalms (additional)
    (19, 1, 1, 2, 'wisdom'),             -- Psalm 1:1-2
    (19, 8, 1, NULL, 'praise'),          -- Psalm 8:1 (How majestic is your name)
    (19, 19, 14, NULL, 'prayer'),        -- Psalm 19:14 (words of my mouth)
    (19, 23, 1, 3, 'comfort'),           -- Psalm 23:1-3
    (19, 37, 4, NULL, 'joy'),            -- Psalm 37:4 (Delight in the LORD)
    (19, 46, 5, NULL, 'strength'),       -- Psalm 46:5
    (19, 51, 12, NULL, 'renewal'),       -- Psalm 51:12 (restore to me the joy)
    (19, 90, 12, NULL, 'wisdom'),        -- Psalm 90:12 (teach us to number our days)
    (19, 91, 1, 2, 'trust'),            -- Psalm 91:1-2
    (19, 119, 11, NULL, 'obedience'),    -- Psalm 119:11 (hidden your word in my heart)
    (19, 121, 1, 2, 'trust'),           -- Psalm 121:1-2
    (19, 139, 14, NULL, 'praise'),       -- Psalm 139:14 (fearfully and wonderfully made)
    (19, 139, 23, 24, 'guidance'),       -- Psalm 139:23-24 (search me O God)
    -- Proverbs (additional)
    (20, 4, 23, NULL, 'wisdom'),         -- Proverbs 4:23 (guard your heart)
    (20, 14, 26, NULL, 'trust'),         -- Proverbs 14:26
    (20, 16, 3, NULL, 'trust'),          -- Proverbs 16:3 (commit your works)
    (20, 18, 10, NULL, 'trust'),         -- Proverbs 18:10 (name of the LORD is a strong tower)
    (20, 27, 1, NULL, 'humility'),       -- Proverbs 27:1 (do not boast about tomorrow)
    (20, 31, 30, NULL, 'wisdom'),        -- Proverbs 31:30 (woman who fears the LORD)
    -- Ecclesiastes
    (21, 3, 1, NULL, 'wisdom'),          -- Ecclesiastes 3:1 (a time for everything)
    (21, 4, 9, 10, 'wisdom'),            -- Ecclesiastes 4:9-10 (two are better than one)
    (21, 12, 13, NULL, 'obedience'),     -- Ecclesiastes 12:13 (fear God and keep)
    -- Isaiah (additional)
    (23, 40, 8, NULL, 'truth'),          -- Isaiah 40:8 (grass withers, word stands forever)
    (23, 41, 14, NULL, 'courage'),        -- Isaiah 41:14 (do not be afraid, I will help you)
    (23, 46, 10, NULL, 'trust'),         -- Isaiah 46:10 (I make known the end)
    (23, 53, 4, 5, 'easter'),            -- Isaiah 53:4-5 (He bore our griefs)
    (23, 55, 8, 9, 'wisdom'),            -- Isaiah 55:8-9 (My ways higher)
    (23, 55, 11, NULL, 'faith'),         -- Isaiah 55:11 (My word will not return empty)
    (23, 61, 1, NULL, 'mission'),        -- Isaiah 61:1
    -- Jeremiah (additional)
    (24, 1, 5, NULL, 'guidance'),        -- Jeremiah 1:5 (before I formed you)
    (24, 31, 3, NULL, 'love'),           -- Jeremiah 31:3 (everlasting love)
    (24, 32, 17, NULL, 'faith'),         -- Jeremiah 32:17 (nothing too hard for you)
    (24, 32, 27, NULL, 'faith'),         -- Jeremiah 32:27 (Is anything too hard for me?)
    -- Ezekiel
    (26, 37, 27, NULL, 'hope'),          -- Ezekiel 37:27 (I will be their God)
    -- Daniel
    (27, 2, 21, NULL, 'wisdom'),         -- Daniel 2:21 (He changes times and seasons)
    (27, 3, 17, 18, 'courage'),          -- Daniel 3:17-18 (our God is able to deliver)
    -- Hosea
    (28, 6, 3, NULL, 'renewal'),         -- Hosea 6:3 (let us know the LORD)
    (28, 14, 4, NULL, 'renewal'),        -- Hosea 14:4 (I will heal their apostasy)
    -- Joel
    (29, 2, 28, NULL, 'renewal'),        -- Joel 2:28 (pour out my Spirit)
    -- Amos
    (30, 5, 14, NULL, 'justice'),        -- Amos 5:14 (seek good and not evil)
    -- Jonah
    (32, 2, 9, NULL, 'thanksgiving'),    -- Jonah 2:9 (salvation is from the LORD)
    -- Habakkuk
    (35, 3, 17, 18, 'joy'),             -- Habakkuk 3:17-18 (though the fig tree)
    -- Zephaniah
    (36, 3, 17, NULL, 'joy'),            -- Zephaniah 3:17 (He will rejoice over you)
    -- Zechariah
    (38, 4, 6, NULL, 'strength'),        -- Zechariah 4:6 (not by might nor power)
    -- Malachi
    (39, 3, 6, NULL, 'trust');           -- Malachi 3:6 (I the LORD do not change)

-- --------------------------------------------------------------------------
-- BATCH 31: ADDITIONAL NT VERSES (Bo sung Tan Uoc)
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    -- Matthew (additional)
    (40, 5, 6, NULL, 'holiness'),        -- Matthew 5:6 (hunger and thirst for righteousness)
    (40, 5, 44, NULL, 'love'),           -- Matthew 5:44 (love your enemies)
    (40, 6, 33, NULL, 'trust'),          -- Matthew 6:33 (seek first the kingdom)
    (40, 7, 12, NULL, 'compassion'),     -- Matthew 7:12 (golden rule)
    (40, 11, 29, NULL, 'comfort'),        -- Matthew 11:29 (take my yoke upon you and learn)
    (40, 19, 26, NULL, 'faith'),         -- Matthew 19:26 (with God all things possible)
    (40, 5, 43, 44, 'love'),             -- Matthew 5:43-44 (love your enemies, pray for persecutors)
    -- Mark (additional)
    (41, 9, 23, NULL, 'faith'),          -- Mark 9:23 (all things possible for one who believes)
    (41, 10, 45, NULL, 'mission'),       -- Mark 10:45 (Son of Man came to serve)
    (41, 11, 24, NULL, 'prayer'),        -- Mark 11:24 (whatever you ask in prayer)
    -- Luke (additional)
    (42, 1, 37, NULL, 'faith'),          -- Luke 1:37 (nothing impossible with God)
    (42, 6, 31, NULL, 'compassion'),     -- Luke 6:31 (do unto others)
    (42, 9, 23, NULL, 'obedience'),      -- Luke 9:23 (take up cross daily)
    (42, 12, 32, NULL, 'trust'),         -- Luke 12:32 (fear not little flock)
    (42, 15, 7, NULL, 'joy'),            -- Luke 15:7 (joy in heaven over one sinner)
    -- John (additional)
    (43, 1, 1, NULL, 'truth'),           -- John 1:1 (In the beginning was the Word)
    (43, 3, 17, NULL, 'salvation'),      -- John 3:17 (God sent Son to save)
    (43, 6, 35, NULL, 'salvation'),      -- John 6:35 (I am the bread of life)
    (43, 8, 12, NULL, 'guidance'),       -- John 8:12 (I am the light of the world)
    (43, 10, 10, NULL, 'joy'),           -- John 10:10 (I came that they may have life)
    (43, 10, 28, NULL, 'salvation'),     -- John 10:28 (I give them eternal life)
    (43, 15, 5, NULL, 'faith'),          -- John 15:5 (I am the vine)
    -- Acts (additional)
    (44, 2, 38, NULL, 'salvation'),      -- Acts 2:38 (repent and be baptized)
    (44, 17, 28, NULL, 'faith'),         -- Acts 17:28 (in Him we live and move)
    -- Romans (additional)
    (45, 8, 1, NULL, 'grace'),           -- Romans 8:1 (no condemnation)
    (45, 8, 18, NULL, 'hope'),           -- Romans 8:18 (present sufferings not worth comparing)
    (45, 8, 37, NULL, 'comfort'),         -- Romans 8:37 (more than conquerors)
    (45, 12, 9, 10, 'love'),             -- Romans 12:9-10 (love must be sincere)
    (45, 12, 21, NULL, 'justice'),       -- Romans 12:21 (overcome evil with good)
    -- 1 Corinthians (additional)
    (46, 2, 9, NULL, 'hope'),            -- 1 Corinthians 2:9 (eye has not seen)
    (46, 10, 13, NULL, 'trust'),         -- 1 Corinthians 10:13 (God is faithful, temptation)
    (46, 15, 58, NULL, 'strength'),      -- 1 Corinthians 15:58 (stand firm)
    (46, 16, 13, NULL, 'courage'),       -- 1 Corinthians 16:13 (be on guard, stand firm)
    -- 2 Corinthians (additional)
    (47, 1, 20, NULL, 'trust'),          -- 2 Corinthians 1:20 (promises are Yes in Christ)
    (47, 4, 17, 18, 'hope'),            -- 2 Corinthians 4:17-18 (light momentary affliction)
    -- Galatians (additional)
    (48, 5, 1, NULL, 'salvation'),       -- Galatians 5:1 (for freedom Christ set us free)
    (48, 5, 16, NULL, 'holiness'),        -- Galatians 5:16 (walk by the Spirit)
    (48, 6, 2, NULL, 'compassion'),      -- Galatians 6:2 (bear one another's burdens)
    -- Ephesians (additional)
    (49, 2, 10, NULL, 'mission'),        -- Ephesians 2:10 (created for good works)
    (49, 3, 20, NULL, 'faith'),          -- Ephesians 3:20 (able to do immeasurably more)
    (49, 6, 11, NULL, 'strength'),       -- Ephesians 6:11 (put on armor of God)
    -- Philippians (additional)
    (50, 1, 6, NULL, 'hope'),            -- Philippians 1:6 (He who began a good work)
    (50, 2, 13, NULL, 'strength'),       -- Philippians 2:13 (God works in you)
    (50, 3, 13, 14, 'faith'),           -- Philippians 3:13-14 (press on toward the goal)
    (50, 4, 8, NULL, 'wisdom'),          -- Philippians 4:8 (think on these things)
    (50, 4, 19, NULL, 'trust'),          -- Philippians 4:19 (God shall supply every need)
    -- Colossians (additional)
    (51, 3, 2, NULL, 'renewal'),         -- Colossians 3:2 (set minds on things above)
    (51, 3, 23, NULL, 'obedience'),      -- Colossians 3:23 (whatever you do, work heartily)
    -- 1 Thessalonians (additional)
    (52, 5, 11, NULL, 'love'),           -- 1 Thessalonians 5:11 (encourage one another)
    -- 1 Timothy
    (54, 4, 12, NULL, 'courage'),        -- 1 Timothy 4:12 (let no one despise your youth)
    (54, 6, 6, NULL, 'wisdom'),          -- 1 Timothy 6:6 (godliness with contentment)
    (54, 6, 12, NULL, 'faith'),          -- 1 Timothy 6:12 (fight the good fight of faith)
    -- 2 Timothy (additional)
    (55, 3, 16, 17, 'truth'),           -- 2 Timothy 3:16-17 (all Scripture inspired)
    -- Hebrews (additional)
    (58, 4, 12, NULL, 'truth'),          -- Hebrews 4:12 (word of God is living)
    (58, 11, 3, NULL, 'faith'),          -- Hebrews 11:3 (by faith we understand)
    (58, 12, 1, NULL, 'patience'),       -- Hebrews 12:1 (run with perseverance)
    (58, 13, 5, NULL, 'trust'),          -- Hebrews 13:5 (never leave nor forsake)
    (58, 13, 8, NULL, 'trust'),          -- Hebrews 13:8 (Jesus Christ same yesterday)
    -- James (additional)
    (59, 4, 7, 8, 'obedience'),         -- James 4:7-8 (submit to God, resist devil)
    -- 1 Peter (additional)
    (60, 2, 9, NULL, 'mission'),         -- 1 Peter 2:9 (royal priesthood)
    (60, 3, 15, NULL, 'mission'),        -- 1 Peter 3:15 (always be prepared to give answer)
    (60, 5, 7, NULL, 'trust'),           -- 1 Peter 5:7 (cast all your anxieties)
    -- 2 Peter (additional)
    (61, 1, 3, NULL, 'grace'),           -- 2 Peter 1:3 (divine power has given everything)
    -- 1 John (additional)
    (62, 1, 7, NULL, 'forgiveness'),     -- 1 John 1:7 (blood of Jesus cleanses)
    (62, 4, 4, NULL, 'courage'),         -- 1 John 4:4 (greater is He that is in you)
    -- Jude
    (65, 1, 24, 25, 'praise'),          -- Jude 1:24-25 (to Him who is able to keep)
    -- Revelation (additional)
    (66, 1, 8, NULL, 'faith'),           -- Revelation 1:8 (I am the Alpha and Omega)
    (66, 3, 20, NULL, 'salvation'),      -- Revelation 3:20 (behold I stand at the door)
    (66, 22, 13, NULL, 'faith');         -- Revelation 22:13 (Alpha and Omega)

-- --------------------------------------------------------------------------
-- BATCH 32: MISSING BOOKS (Dam bao bao phu tat ca 66 sach)
-- --------------------------------------------------------------------------
INSERT INTO votd_verses (book_id, chapter, verse_start, verse_end, theme) VALUES
    (7, 6, 12, NULL, 'courage'),          -- Judges 6:12 (The LORD is with you, mighty warrior)
    (12, 6, 16, NULL, 'trust'),           -- 2 Kings 6:16 (those who are with us are more)
    (15, 8, 22, NULL, 'guidance'),        -- Ezra 8:22 (the hand of our God is on all who look to Him)
    (31, 1, 15, NULL, 'justice'),         -- Obadiah 1:15 (the day of the LORD is near)
    (37, 2, 9, NULL, 'hope'),            -- Haggai 2:9 (the glory of this house shall be greater)
    (57, 1, 6, NULL, 'joy'),             -- Philemon 1:6 (sharing of your faith)
    (63, 1, 6, NULL, 'love');            -- 2 John 1:6 (this is love, that we walk according)

COMMIT;
