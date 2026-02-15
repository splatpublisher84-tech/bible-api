-- ============================================================================
-- Bible API - Seed Data
-- Du lieu co dinh 100%, khong phu thuoc ngon ngu hay ban dich
-- Chay sau 001_schema.sql
-- ============================================================================

BEGIN;

-- ============================================================================
-- TESTAMENTS
-- ============================================================================
INSERT INTO testaments (id, abbr) VALUES
    (1, 'OT'),
    (2, 'NT');

-- ============================================================================
-- BOOKS (66 sach - chi cau truc, khong co ten)
-- ============================================================================
INSERT INTO books (id, testament_id, total_chapters, category) VALUES
    -- === CUU UOC - LUAT PHAP (Ngu Kinh) ===
    (1,  1, 50, 'law'),
    (2,  1, 40, 'law'),
    (3,  1, 27, 'law'),
    (4,  1, 36, 'law'),
    (5,  1, 34, 'law'),
    -- === CUU UOC - LICH SU ===
    (6,  1, 24, 'history'),
    (7,  1, 21, 'history'),
    (8,  1,  4, 'history'),
    (9,  1, 31, 'history'),
    (10, 1, 24, 'history'),
    (11, 1, 22, 'history'),
    (12, 1, 25, 'history'),
    (13, 1, 29, 'history'),
    (14, 1, 36, 'history'),
    (15, 1, 10, 'history'),
    (16, 1, 13, 'history'),
    (17, 1, 10, 'history'),
    -- === CUU UOC - THI CA ===
    (18, 1, 42, 'poetry'),
    (19, 1, 150, 'poetry'),
    (20, 1, 31, 'poetry'),
    (21, 1, 12, 'poetry'),
    (22, 1,  8, 'poetry'),
    -- === CUU UOC - TIEN TRI LON ===
    (23, 1, 66, 'major_prophet'),
    (24, 1, 52, 'major_prophet'),
    (25, 1,  5, 'major_prophet'),
    (26, 1, 48, 'major_prophet'),
    (27, 1, 12, 'major_prophet'),
    -- === CUU UOC - TIEN TRI NHO ===
    (28, 1, 14, 'minor_prophet'),
    (29, 1,  3, 'minor_prophet'),
    (30, 1,  9, 'minor_prophet'),
    (31, 1,  1, 'minor_prophet'),
    (32, 1,  4, 'minor_prophet'),
    (33, 1,  7, 'minor_prophet'),
    (34, 1,  3, 'minor_prophet'),
    (35, 1,  3, 'minor_prophet'),
    (36, 1,  3, 'minor_prophet'),
    (37, 1,  2, 'minor_prophet'),
    (38, 1, 14, 'minor_prophet'),
    (39, 1,  4, 'minor_prophet'),
    -- === TAN UOC - PHUC AM ===
    (40, 2, 28, 'gospel'),
    (41, 2, 16, 'gospel'),
    (42, 2, 24, 'gospel'),
    (43, 2, 21, 'gospel'),
    -- === TAN UOC - LICH SU ===
    (44, 2, 28, 'acts'),
    -- === TAN UOC - THU PHAO-LO ===
    (45, 2, 16, 'epistle'),
    (46, 2, 16, 'epistle'),
    (47, 2, 13, 'epistle'),
    (48, 2,  6, 'epistle'),
    (49, 2,  6, 'epistle'),
    (50, 2,  4, 'epistle'),
    (51, 2,  4, 'epistle'),
    (52, 2,  5, 'epistle'),
    (53, 2,  3, 'epistle'),
    (54, 2,  6, 'epistle'),
    (55, 2,  4, 'epistle'),
    (56, 2,  3, 'epistle'),
    (57, 2,  1, 'epistle'),
    -- === TAN UOC - THU CHUNG ===
    (58, 2, 13, 'epistle'),
    (59, 2,  5, 'epistle'),
    (60, 2,  5, 'epistle'),
    (61, 2,  3, 'epistle'),
    (62, 2,  5, 'epistle'),
    (63, 2,  1, 'epistle'),
    (64, 2,  1, 'epistle'),
    (65, 2,  1, 'epistle'),
    -- === TAN UOC - TIEN TRI ===
    (66, 2, 22, 'apocalypse');

COMMIT;
