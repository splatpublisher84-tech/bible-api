#!/usr/bin/env node
// Chụp "golden master" response của API để so sánh parity giữa bản Express cũ và NestJS mới.
// Dùng: node scripts/parity-snapshot.mjs <baseUrl> <outFile>
// VD:   node scripts/parity-snapshot.mjs http://localhost:3000 ./golden-old.json

const baseUrl = process.argv[2] || 'http://localhost:3000';
const outFile = process.argv[3] || './golden.json';

// Danh sách endpoint tạo nên "hợp đồng" hành vi. mode:
//  - 'full'  : so sánh nguyên body (endpoint tất định)
//  - 'shape' : chỉ so cấu trúc key (endpoint có field biến động: health, status)
const CASES = [
  { name: 'root', path: '/', mode: 'shape' },
  { name: 'health', path: '/health', mode: 'shape' },
  { name: 'translations_list', path: '/api/translations', mode: 'full' },
  { name: 'translation_cadman', path: '/api/translations/cadman', mode: 'full' },
  { name: 'translation_kjv', path: '/api/translations/kjv_strongs', mode: 'full' },
  { name: 'translation_404', path: '/api/translations/nope', mode: 'full' },
  { name: 'books_kjv', path: '/api/books?translation=kjv_strongs', mode: 'full' },
  { name: 'books_cadman', path: '/api/books?translation=cadman', mode: 'full' },
  { name: 'books_missing_param_400', path: '/api/books', mode: 'full' },
  { name: 'books_translation_404', path: '/api/books?translation=nope', mode: 'full' },
  { name: 'chapters_gen_kjv', path: '/api/books/1/chapters?translation=kjv_strongs', mode: 'full' },
  {
    name: 'chapters_book_400',
    path: '/api/books/99/chapters?translation=kjv_strongs',
    mode: 'full',
  },
  { name: 'verses_gen1_kjv', path: '/api/verses/kjv_strongs/1/1', mode: 'full' },
  { name: 'verse_gen11_kjv', path: '/api/verses/kjv_strongs/1/1/1', mode: 'full' },
  { name: 'verse_john316_cadman', path: '/api/verses/cadman/43/3/16', mode: 'full' },
  { name: 'verses_chapter_404', path: '/api/verses/kjv_strongs/1/999', mode: 'full' },
  { name: 'verse_404', path: '/api/verses/kjv_strongs/1/1/999', mode: 'full' },
  {
    name: 'search_love_kjv',
    path: '/api/search?q=love&translation=kjv_strongs&limit=5&offset=0',
    mode: 'full',
  },
  { name: 'search_missing_q_400', path: '/api/search?translation=kjv_strongs', mode: 'full' },
  {
    name: 'votd_fixeddate_kjv',
    path: '/api/votd?date=2026-07-05&translation=kjv_strongs',
    mode: 'full',
  },
  {
    name: 'votd_fixeddate_cadman',
    path: '/api/votd?date=2026-07-05&translation=cadman',
    mode: 'full',
  },
  {
    name: 'votd_translation_404',
    path: '/api/votd?date=2026-07-05&translation=nope',
    mode: 'full',
  },
  { name: 'not_found_404', path: '/api/does-not-exist', mode: 'full' },
  { name: 'status', path: '/api/status', mode: 'shape' },
];

// Rút gọn 1 giá trị thành "khung" kiểu (để so shape mà bỏ qua giá trị biến động)
function shapeOf(v) {
  if (Array.isArray(v)) return v.length ? [shapeOf(v[0])] : [];
  if (v && typeof v === 'object') {
    const o = {};
    for (const k of Object.keys(v).sort()) o[k] = shapeOf(v[k]);
    return o;
  }
  return typeof v;
}

const results = {};
for (const c of CASES) {
  try {
    const res = await fetch(baseUrl + c.path);
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { __nonjson: text.slice(0, 120) };
    }
    results[c.name] = {
      path: c.path,
      status: res.status,
      contentType: res.headers.get('content-type'),
      cacheControl: res.headers.get('cache-control'),
      body: c.mode === 'shape' ? shapeOf(body) : body,
    };
  } catch (e) {
    results[c.name] = { path: c.path, error: String(e) };
  }
}

const fs = await import('node:fs');
fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
console.log(`Wrote ${Object.keys(results).length} snapshots -> ${outFile}`);
const bad = Object.entries(results).filter(([, r]) => r.error);
if (bad.length) {
  console.log(`⚠️ ${bad.length} lỗi fetch:`, bad.map(([n]) => n).join(', '));
  process.exit(1);
}
