#!/usr/bin/env node
// So sánh 2 file golden (old vs new): status + body (deep-equal, bỏ qua thứ tự key).
// Dùng: node scripts/parity-compare.mjs golden-old.json golden-new.json
import fs from 'node:fs';

const [, , oldF, newF] = process.argv;
const o = JSON.parse(fs.readFileSync(oldF, 'utf8'));
const n = JSON.parse(fs.readFileSync(newF, 'utf8'));

function stable(v) {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === 'object') {
    const r = {};
    for (const k of Object.keys(v).sort()) r[k] = stable(v[k]);
    return r;
  }
  return v;
}
const eq = (a, b) => JSON.stringify(stable(a)) === JSON.stringify(stable(b));

let pass = 0;
let fail = 0;
const fails = [];
const cacheDiffs = [];

for (const key of Object.keys(o)) {
  const a = o[key];
  const b = n[key];
  if (!b) {
    fails.push(`${key}: THIẾU ở bản mới`);
    fail++;
    continue;
  }
  const statusOk = a.status === b.status;
  const bodyOk = eq(a.body, b.body);
  if (statusOk && bodyOk) pass++;
  else {
    fail++;
    fails.push(`${key}: status ${a.status}->${b.status}, bodyOk=${bodyOk}`);
  }
  if (a.cacheControl !== b.cacheControl) {
    cacheDiffs.push(`${key}: '${a.cacheControl}' -> '${b.cacheControl}'`);
  }
}

console.log(`PARITY: ${pass} pass, ${fail} fail (trên ${Object.keys(o).length} case)`);
if (fails.length) {
  console.log('--- FAIL (status/body) ---');
  for (const f of fails) console.log(`  ${f}`);
}
if (cacheDiffs.length) {
  console.log(`--- Khác cache-control (${cacheDiffs.length}) — xử ở Phase 4 ---`);
  for (const d of cacheDiffs) console.log(`  ${d}`);
}
process.exit(fail ? 1 : 0);
