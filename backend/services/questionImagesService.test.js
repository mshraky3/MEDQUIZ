/**
 * Question images service against PGlite (set PGLITE_PATH, else skipped).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import {
    ensureQuestionImagesTables, attachQuestionImages, importQuestionImages, validateImageEntry,
} from './questionImagesService.js';

const here = path.dirname(fileURLToPath(import.meta.url));
let PGlite = null;
try {
    const mod = process.env.PGLITE_PATH
        ? await import(pathToFileURL(path.join(process.env.PGLITE_PATH, 'dist', 'index.js')).href)
        : await import('@electric-sql/pglite');
    PGlite = mod.PGlite;
} catch { /* skipped */ }
const skip = PGlite ? false : 'PGlite not available (set PGLITE_PATH)';

async function setup() {
    const db = new PGlite();
    await db.exec(`CREATE TABLE questions (id SERIAL PRIMARY KEY, question_text text);
        INSERT INTO questions (question_text) SELECT 'q' || g FROM generate_series(1, 6) g;`);
    await ensureQuestionImagesTables(db);
    await ensureQuestionImagesTables(db); // idempotent
    return db;
}
const img = (o) => ({ slug: 's1', kind: 'illustration', image_key: 'qimg/a.webp', alt_en: 'alt', question_ids: [1], ...o });
const rowsOf = (...ids) => ids.map((id) => ({ id, question_text: 'q' + id }));

test('approved image is attached with a url; draft is hidden', { skip }, async () => {
    const db = await setup();
    await importQuestionImages(db, [
        img({ slug: 'ok', status: 'approved', reviewed_by: 'Dr A', question_ids: [1] }),
        img({ slug: 'dr', image_key: 'qimg/b.webp', question_ids: [2] }),
    ], { apply: true });
    const rows = await attachQuestionImages(db, rowsOf(1, 2));
    assert.equal(rows[0].images.length, 1);
    assert.equal(rows[0].images[0].url, '/api/question-images/file/a.webp');
    assert.equal(rows[0].images[0].kind, 'illustration');
    assert.equal('images' in rows[1], false);
});

test('status approved without reviewed_by is stored as draft', { skip }, async () => {
    const db = await setup();
    await importQuestionImages(db, [img({ status: 'approved' })], { apply: true });
    const { rows } = await db.query('SELECT status FROM question_images');
    assert.equal(rows[0].status, 'draft');
});

test('one shared image links to several questions', { skip }, async () => {
    const db = await setup();
    await importQuestionImages(db, [img({ status: 'approved', reviewed_by: 'Dr A', question_ids: [1, 2, 3, 3] })], { apply: true });
    const rows = await attachQuestionImages(db, rowsOf(1, 2, 3, 4));
    assert.deepEqual(rows.map((r) => !!r.images), [true, true, true, false]);
    assert.equal((await db.query('SELECT COUNT(*)::int c FROM question_images')).rows[0].c, 1);
});

test('table kind carries rows as JSON and no url', { skip }, async () => {
    const db = await setup();
    const table = { header: ['Test', 'Result'], rows: [['Na', '140']] };
    await importQuestionImages(db, [{ slug: 't1', kind: 'table', table, question_ids: [5], status: 'approved', reviewed_by: 'Dr A' }], { apply: true });
    const [r] = await attachQuestionImages(db, rowsOf(5));
    assert.equal(r.images[0].kind, 'table');
    assert.deepEqual(r.images[0].table, table);
    assert.equal('url' in r.images[0], false);
});

test('questions without links keep exactly their shape', { skip }, async () => {
    const db = await setup();
    await importQuestionImages(db, [img({ status: 'approved', reviewed_by: 'x', question_ids: [1] })], { apply: true });
    const rows = rowsOf(4, 6);
    const before = JSON.stringify(rows);
    await attachQuestionImages(db, rows);
    assert.equal(JSON.stringify(rows), before);
});

test('re-import updates in place, no duplicates; approval can be revoked', { skip }, async () => {
    const db = await setup();
    await importQuestionImages(db, [img({ status: 'approved', reviewed_by: 'x' })], { apply: true });
    await importQuestionImages(db, [img({ alt_en: 'new alt' })], { apply: true });
    const { rows } = await db.query('SELECT alt_en, status FROM question_images');
    assert.equal(rows.length, 1);
    assert.deepEqual(rows[0], { alt_en: 'new alt', status: 'draft' });
});

test('dry run writes nothing; bad entries are reported', { skip }, async () => {
    const db = await setup();
    const rep = await importQuestionImages(db, [img(), { slug: 'bad', kind: 'nope' }], { apply: false });
    assert.equal(rep.images, 1); assert.equal(rep.errors.length, 1);
    assert.equal((await db.query('SELECT COUNT(*)::int c FROM question_images')).rows[0].c, 0);
});

test('attach never throws when the tables are missing', { skip }, async () => {
    const db = new PGlite();
    const rows = rowsOf(1);
    await attachQuestionImages(db, rows);
    assert.equal('images' in rows[0], false);
});

test('validateImageEntry rejects unsafe keys and incomplete tables', () => {
    assert.ok(validateImageEntry(img({ image_key: '../x.png' })).error);
    assert.ok(validateImageEntry({ slug: 't', kind: 'table', table: { header: [] } }).error);
    assert.ok(validateImageEntry(img()).value);
});

test('app.js wires the tables, version bump, attach call and route', () => {
    const src = fs.readFileSync(path.join(here, '..', 'app.js'), 'utf8');
    assert.match(src, /SCHEMA_BOOTSTRAP_VERSION = 15/);
    assert.match(src, /await ensureQuestionImagesSchema\(\)/);
    assert.match(src, /await attachQuestionImages\(db, served\)/);
    assert.match(src, /app\.use\('\/api\/question-images'/);
});
