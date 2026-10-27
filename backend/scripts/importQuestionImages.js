/**
 * Import question images / rebuilt tables from a JSON file as DRAFT rows + links.
 *
 *   node scripts/importQuestionImages.js images.json            (dry run: validate and count only)
 *   node scripts/importQuestionImages.js images.json --apply    (writes; needs DB* env)
 *
 * JSON: an array of
 *   { slug, kind: 'original'|'open_licence'|'illustration'|'table', image_key: 'qimg/<file>' (not for tables),
 *     table: { header: [...], rows: [[...]] } (tables only), alt_en, alt_ar, note_en, note_ar,
 *     licence, attribution, source_url, question_ids: [..],
 *     status: 'approved' + reviewed_by (only after a doctor reviewed; otherwise stored as draft) }
 * Idempotent (slug is the key). Uploading the files to R2 is a separate step; this never touches R2.
 * --apply refuses a Supabase (production) host unless --production is also given.
 */
import fs from 'node:fs';
import dotenv from 'dotenv';
import pg from 'pg';
import { importQuestionImages, ensureQuestionImagesTables } from '../services/questionImagesService.js';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const apply = args.includes('--apply');
const production = args.includes('--production');
if (!file) { console.error('Usage: node scripts/importQuestionImages.js <file.json> [--apply]'); process.exit(2); }

const entries = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(entries)) { console.error('JSON must be an array'); process.exit(2); }

if (!apply) {
    const r = await importQuestionImages(null, entries, { apply: false });
    console.log(`DRY RUN: ${r.images} valid image rows, ${r.links} links, ${r.errors.length} errors`);
    r.errors.forEach((e) => console.log('  error:', e));
    process.exit(r.errors.length ? 1 : 0);
}

dotenv.config();
const host = process.env.DBHOST || '';
if (/\.supabase\.(com|co)$/.test(host) && !production) {
    console.error('Refusing: DBHOST is Supabase (production). Add --production if that is intended.');
    process.exit(2);
}
const pool = new pg.Pool({
    user: process.env.DBUSER, host, database: process.env.DBNAME,
    password: process.env.DBPASSWORD, port: process.env.DBPORT || 5432,
    ssl: { rejectUnauthorized: false },
});
try {
    await ensureQuestionImagesTables(pool);
    const r = await importQuestionImages(pool, entries, { apply: true });
    console.log(`APPLIED: ${r.images} image rows, ${r.links} links, ${r.errors.length} errors`);
    r.errors.forEach((e) => console.log('  error:', e));
} finally {
    await pool.end();
}
