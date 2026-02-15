-- ============================================================================
-- Bible API - PostgreSQL Schema
-- Chi chua cau truc bang (CREATE TABLE + INDEX), KHONG chua du lieu
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. BANG TESTAMENTS (Cuu Uoc / Tan Uoc)
-- ============================================================================
CREATE TABLE testaments (
    id          SMALLINT PRIMARY KEY,       -- 1 = Old Testament, 2 = New Testament
    abbr        VARCHAR(2) NOT NULL         -- "OT", "NT"
);

-- ============================================================================
-- 2. BANG BOOKS (66 sach Kinh Thanh)
-- ============================================================================
-- Chi chua du lieu cau truc (khong phu thuoc ngon ngu hay ban dich)
CREATE TABLE books (
    id              SMALLINT PRIMARY KEY,           -- 1-66 (chuan Protestant canon)
    testament_id    SMALLINT NOT NULL REFERENCES testaments(id),
    total_chapters  SMALLINT NOT NULL,              -- So chuong trong sach
    category        VARCHAR(20) NOT NULL            -- "law", "history", "poetry", "major_prophet",
                                                    -- "minor_prophet", "gospel", "acts", "epistle", "apocalypse"
);

-- ============================================================================
-- 3. BANG TRANSLATIONS (Cac ban dich)
-- ============================================================================
-- Du lieu duoc tao boi script convert-module-to-pg.js
CREATE TABLE translations (
    id              SERIAL PRIMARY KEY,
    abbr            VARCHAR(20) NOT NULL UNIQUE,    -- "cadman", "kjv_strongs", "rvv11"...
    name            VARCHAR(100) NOT NULL,          -- Ten day du
    language        VARCHAR(10) NOT NULL,           -- "vi", "en", "he", "el"...
    description     TEXT,                           -- Mo ta chi tiet
    year            SMALLINT,                       -- Nam xuat ban (1934, 1611...)
    is_public_domain BOOLEAN NOT NULL DEFAULT true, -- Quyen ban quyen
    has_strongs     BOOLEAN NOT NULL DEFAULT false, -- Co so Strong's khong
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. BANG BOOK_NAMES (Ten sach theo tung ban dich)
-- ============================================================================
-- Moi ban dich co the co ten sach khac nhau, ke ca cung ngon ngu
-- VD: Cadman "Sang The Ky" vs RVV11 "Sáng Thế Ký"
CREATE TABLE book_names (
    id              SERIAL PRIMARY KEY,
    translation_id  INTEGER NOT NULL REFERENCES translations(id),
    book_id         SMALLINT NOT NULL REFERENCES books(id),
    name            VARCHAR(50) NOT NULL,           -- "Genesis", "Sang The Ky"
    abbr            VARCHAR(10) NOT NULL,           -- "Gen", "Sa"
    UNIQUE (translation_id, book_id)
);

-- ============================================================================
-- 5. BANG VERSES (Cau Kinh Thanh -- bang chinh)
-- ============================================================================
CREATE TABLE verses (
    id              SERIAL PRIMARY KEY,
    translation_id  INTEGER NOT NULL REFERENCES translations(id),
    book_id         SMALLINT NOT NULL REFERENCES books(id),
    chapter         SMALLINT NOT NULL,
    verse           SMALLINT NOT NULL,
    text            TEXT NOT NULL,

    UNIQUE (translation_id, book_id, chapter, verse)
);

-- Index phuc vu cac truy van pho bien
CREATE INDEX idx_verses_translation     ON verses (translation_id);
CREATE INDEX idx_verses_book_chapter    ON verses (book_id, chapter);

-- Full-text search index
CREATE INDEX idx_verses_text_search     ON verses USING GIN (to_tsvector('simple', text));

-- ============================================================================
-- 6. BANG BOOK_ALIASES (Cac ten goi tat de parse reference)
-- ============================================================================
-- "Ge", "Gn", "Gen" deu -> book_id = 1
CREATE TABLE book_aliases (
    id          SERIAL PRIMARY KEY,
    book_id     SMALLINT NOT NULL REFERENCES books(id),
    alias       VARCHAR(30) NOT NULL,
    language    VARCHAR(10) NOT NULL,
    UNIQUE (alias, language)
);

-- ============================================================================
-- 7. BANG CHAPTER_INFO (Thong tin so cau moi chuong)
-- ============================================================================
CREATE TABLE chapter_info (
    id              SERIAL PRIMARY KEY,
    translation_id  INTEGER NOT NULL REFERENCES translations(id),
    book_id         SMALLINT NOT NULL REFERENCES books(id),
    chapter         SMALLINT NOT NULL,
    total_verses    SMALLINT NOT NULL,
    UNIQUE (translation_id, book_id, chapter)
);

COMMIT;
