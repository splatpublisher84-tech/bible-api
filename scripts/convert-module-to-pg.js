/**
 * Script chuyen doi Bible SuperSearch module format sang PostgreSQL
 *
 * Module format gom 2 file:
 *   - info.json   : metadata ban dich (ten, ngon ngu, nam, copyright...)
 *   - verses.txt  : du lieu cau, phan tach bang "|"
 *
 * Cach dung:
 *   node scripts/convert-module-to-pg.js <module_dir> <translation_id> <output.sql>
 *
 * Vi du:
 *   node scripts/convert-module-to-pg.js \
 *     ~/Downloads/kjv_strongs 2 \
 *     sql/002_data_kjv_strongs.sql
 */

const fs = require('node:fs');
const path = require('node:path');

// ============================================================================
// Parse command line arguments
// ============================================================================
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error(
    'Su dung: node scripts/convert-module-to-pg.js <module_dir> <translation_id> <output.sql>'
  );
  console.error('');
  console.error('Vi du:');
  console.error(
    '  node scripts/convert-module-to-pg.js ~/Downloads/kjv_strongs 2 sql/002_data_kjv_strongs.sql'
  );
  process.exit(1);
}

const [moduleDir, translationIdStr, outputFile] = args;
const translationId = parseInt(translationIdStr, 10);

if (Number.isNaN(translationId)) {
  console.error('Loi: translation_id phai la so nguyen');
  process.exit(1);
}

// ============================================================================
// Doc info.json
// ============================================================================
const infoPath = path.join(moduleDir, 'info.json');
if (!fs.existsSync(infoPath)) {
  console.error(`Loi: Khong tim thay ${infoPath}`);
  process.exit(1);
}

const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
console.log(`Ban dich: ${info.name} (${info.module})`);
console.log(`Ngon ngu: ${info.lang} (${info.lang_short})`);
console.log(`Nam: ${info.year}`);
console.log(`Strong's: ${info.strongs ? 'Co' : 'Khong'}`);

// ============================================================================
// Doc verses.txt
// ============================================================================
const versesPath = path.join(moduleDir, 'verses.txt');
if (!fs.existsSync(versesPath)) {
  console.error(`Loi: Khong tim thay ${versesPath}`);
  process.exit(1);
}

const content = fs.readFileSync(versesPath, 'utf8');
const lines = content.split('\n');

// ============================================================================
// Parse cac dong du lieu
// ============================================================================
const delimiter = info.delimiter || '|';
const pgInserts = [];
let count = 0;
let skipped = 0;

for (const line of lines) {
  // Bo qua dong trong va dong comment/header
  if (!line.trim() || line.startsWith('#')) continue;

  const parts = line.split(delimiter);
  // Can it nhat 4 cot: book, chapter, verse, text
  if (parts.length < 4) {
    skipped++;
    continue;
  }

  const book = parseInt(parts[0], 10);
  const chapter = parseInt(parts[1], 10);
  const verse = parseInt(parts[2], 10);
  const text = parts[3];

  // Validate du lieu co ban
  if (Number.isNaN(book) || Number.isNaN(chapter) || Number.isNaN(verse) || !text) {
    skipped++;
    continue;
  }

  // Escape single quotes cho PostgreSQL: ' -> ''
  const escapedText = text.replace(/'/g, "''");

  pgInserts.push(`(${translationId}, ${book}, ${chapter}, ${verse}, '${escapedText}')`);
  count++;
}

console.log(`Da parse ${count} cau (bo qua ${skipped} dong)`);

if (count === 0) {
  console.error('Loi: Khong parse duoc cau nao. Kiem tra lai format file.');
  process.exit(1);
}

// ============================================================================
// Tao file PostgreSQL output
// ============================================================================
const batchSize = 500;
const outputLines = [];

outputLines.push(`-- ============================================================================`);
outputLines.push(`-- Du lieu ban dich: ${info.name} (translation_id = ${translationId})`);
outputLines.push(`-- Module: ${info.module}`);
outputLines.push(`-- Ngon ngu: ${info.lang} (${info.lang_short})`);
outputLines.push(`-- Chuyen doi tu Bible SuperSearch module format`);
outputLines.push(`-- Tong so cau: ${count}`);
outputLines.push(`-- ============================================================================`);
outputLines.push('');
outputLines.push('BEGIN;');
outputLines.push('');

// Insert translation metadata tu info.json
const escapedName = info.name.replace(/'/g, "''");
const escapedDesc = (info.description || '')
  .replace(/<[^>]*>/g, '')
  .replace(/'/g, "''")
  .substring(0, 200);
const year = parseInt(info.year, 10) || null;
const isPublicDomain = info.copyright === 0;
const hasStrongs = info.strongs === 1;

outputLines.push('-- Insert translation metadata');
outputLines.push(
  `INSERT INTO translations (id, abbr, name, language, description, year, is_public_domain, has_strongs) VALUES`
);
outputLines.push(
  `    (${translationId}, '${info.module}', '${escapedName}', '${info.lang_short}', '${escapedDesc}', ${year}, ${isPublicDomain}, ${hasStrongs})`
);
outputLines.push(`ON CONFLICT (id) DO NOTHING;`);
outputLines.push('');

// Insert verses theo batch
for (let i = 0; i < pgInserts.length; i += batchSize) {
  const batch = pgInserts.slice(i, i + batchSize);
  outputLines.push('INSERT INTO verses (translation_id, book_id, chapter, verse, text) VALUES');
  outputLines.push(`${batch.join(',\n')};`);
  outputLines.push('');
}

// Tu dong tao du lieu chapter_info
outputLines.push('-- Tu dong tao thong tin so cau moi chuong');
outputLines.push(`INSERT INTO chapter_info (translation_id, book_id, chapter, total_verses)`);
outputLines.push(`SELECT translation_id, book_id, chapter, MAX(verse) AS total_verses`);
outputLines.push(`FROM verses`);
outputLines.push(`WHERE translation_id = ${translationId}`);
outputLines.push(`GROUP BY translation_id, book_id, chapter`);
outputLines.push(`ON CONFLICT (translation_id, book_id, chapter)`);
outputLines.push(
  `DO UPDATE SET total_verses = GREATEST(chapter_info.total_verses, EXCLUDED.total_verses);`
);
outputLines.push('');
outputLines.push('COMMIT;');

// ============================================================================
// Ghi file output
// ============================================================================
const outputDir = path.dirname(outputFile);
if (outputDir && !fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf8');
console.log(`Da tao file: ${outputFile}`);
console.log(`Tong cong ${count} cau, ${Math.ceil(count / batchSize)} batch`);
