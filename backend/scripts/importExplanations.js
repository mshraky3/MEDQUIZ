/**
 * Load the merged explanation set into questions.explanation.
 *
 * Input is exports/explanations-merged.json, produced by
 * scripts/buildExplanationSet.js — see that file for how the raw AI output is
 * cleaned, deduped and verified. This script does the database half and adds
 * one guard that only it can apply:
 *
 *   An explanation is written ONLY if the live question_text still matches the
 *   text the explanation was written against (whitespace-insensitively).
 *   questions.id is a serial PK and is stable, but a full-bank replace
 *   (replaceQuestionBank2026H2.js --apply) reissues every id — so a mismatch
 *   means row N is no longer the question this explanation belongs to. Those
 *   rows are reported and skipped, never guessed at.
 *
 * It also applies exports/answer-corrections.json: a small list of questions
 * whose correct_option was wrong in the bank, each guarded on the value the
 * database currently holds so a re-run or an already-fixed row is a no-op.
 *
 * Safety, following the conventions in this folder:
 *   - dry run by default; --apply is required to write
 *   - in --apply mode, backs up id + correct_option + explanation for every
 *     affected row to backups/explanations-<date>/ before the first write
 *   - batched (200), each row try/catch-guarded, and idempotent: a second run
 *     rewrites the same values and reports 0 remaining
 *
 * Rollback: restore from backups/explanations-<date>/questions_before.json,
 * which holds each row's previous correct_option and explanation.
 *
 * Usage (from backend/, reads DB creds from .env like app.js):
 *   node scripts/importExplanations.js            # dry run: report only
 *   node scripts/importExplanations.js --apply    # backup + write
 */

import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;
const pool = new Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
        : {
            user: process.env.DBUSER,
            host: process.env.DBHOST,
            database: process.env.DBNAME,
            password: process.env.DBPASSWORD,
            port: process.env.DBPORT || 5432,
            ssl: { rejectUnauthorized: false },
        }
);

const APPLY = process.argv.includes('--apply');
const BATCH = 200;

const EXPORTS_DIR = path.join(__dirname, '..', '..', 'exports');
const MERGED_FILE = path.join(EXPORTS_DIR, 'explanations-merged.json');
const CORRECTIONS_FILE = path.join(EXPORTS_DIR, 'answer-corrections.json');
const ORIGINAL_DIR = path.join(EXPORTS_DIR, 'questions-explanations');
const BACKUP_DIR = path.join(__dirname, '..', '..', 'backups', `explanations-${new Date().toISOString().slice(0, 10)}`);

/** Same comparison the builder uses: ignores the injected-whitespace damage. */
function compareKey(text) {
    return String(text ?? '')
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase();
}

function loadOriginalTexts() {
    const byId = new Map();
    for (const file of fs.readdirSync(ORIGINAL_DIR).filter(name => name.endsWith('.json'))) {
        for (const row of JSON.parse(fs.readFileSync(path.join(ORIGINAL_DIR, file), 'utf8'))) {
            byId.set(row.id, row.question_text);
        }
    }
    return byId;
}

async function main() {
    for (const file of [MERGED_FILE, CORRECTIONS_FILE]) {
        if (!fs.existsSync(file)) {
            console.error(`FATAL: missing ${file} — run scripts/buildExplanationSet.js first.`);
            process.exit(1);
        }
    }

    const merged = JSON.parse(fs.readFileSync(MERGED_FILE, 'utf8'));
    const corrections = JSON.parse(fs.readFileSync(CORRECTIONS_FILE, 'utf8'));
    const originalTexts = loadOriginalTexts();

    console.log(`Mode: ${APPLY ? 'APPLY (writes to the database)' : 'DRY RUN (no writes)'}`);
    console.log(`Explanations to import: ${merged.length}`);
    console.log(`Answer corrections:     ${corrections.length}`);
    console.log('');

    const client = await pool.connect();
    try {
        // The same idempotent DDL ensureSchema() runs at boot. It is repeated
        // here because this script is normally run before the new app.js is
        // deployed, and even the dry run has to be able to read the column.
        // Adding a nullable column changes no existing data.
        await client.query('ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT');

        const live = await client.query('SELECT id, question_text, correct_option, explanation FROM questions');
        const liveById = new Map(live.rows.map(row => [row.id, row]));
        console.log(`Live bank: ${live.rows.length} questions`);

        // ── verify before writing anything ───────────────────────────────────
        const writable = [];
        const missingRows = [];
        const textMismatch = [];

        for (const item of merged) {
            const row = liveById.get(item.id);
            if (!row) { missingRows.push(item.id); continue; }
            const exportedText = originalTexts.get(item.id);
            if (exportedText !== undefined && compareKey(exportedText) !== compareKey(row.question_text)) {
                textMismatch.push(item.id);
                continue;
            }
            writable.push(item);
        }

        const applicableCorrections = [];
        for (const correction of corrections) {
            const row = liveById.get(Number(correction.id));
            if (!row) {
                console.warn(`  correction ${correction.id}: no such question — skipped`);
                continue;
            }
            if (compareKey(row.correct_option) === compareKey(correction.to)) {
                console.log(`  correction ${correction.id}: already "${correction.to}" — no change`);
                continue;
            }
            if (compareKey(row.correct_option) !== compareKey(correction.from)) {
                console.warn(`  correction ${correction.id}: expected "${correction.from}" but the bank holds "${row.correct_option}" — skipped`);
                continue;
            }
            applicableCorrections.push(correction);
        }

        console.log('');
        console.log(`Writable explanations:  ${writable.length}`);
        console.log(`  ids not in the bank:  ${missingRows.length}${missingRows.length ? ` (${missingRows.slice(0, 10).join(', ')}${missingRows.length > 10 ? ', …' : ''})` : ''}`);
        console.log(`  question_text drift:  ${textMismatch.length}${textMismatch.length ? ` (${textMismatch.slice(0, 10).join(', ')}${textMismatch.length > 10 ? ', …' : ''})` : ''}`);
        console.log(`Applicable corrections: ${applicableCorrections.length}`);

        if (!APPLY) {
            const wouldRemain = live.rows.length - writable.length;
            console.log('');
            console.log(`Dry run complete. ${wouldRemain} question(s) would still have no explanation.`);
            console.log('Re-run with --apply to write.');
            return;
        }

        // ── backup ───────────────────────────────────────────────────────────
        const touchedIds = new Set([...writable.map(i => i.id), ...applicableCorrections.map(c => Number(c.id))]);
        const before = live.rows.filter(row => touchedIds.has(row.id))
            .map(row => ({ id: row.id, correct_option: row.correct_option, explanation: row.explanation }));
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        const backupFile = path.join(BACKUP_DIR, 'questions_before.json');
        fs.writeFileSync(backupFile, JSON.stringify(before, null, 2), 'utf8');
        if (before.length !== touchedIds.size) {
            console.error(`FATAL: backed up ${before.length} rows but ${touchedIds.size} are about to be written. Aborting.`);
            process.exit(1);
        }
        console.log('');
        console.log(`Backed up ${before.length} rows to ${backupFile}`);

        // ── write ────────────────────────────────────────────────────────────
        let updated = 0;
        let failed = 0;
        for (let start = 0; start < writable.length; start += BATCH) {
            const batch = writable.slice(start, start + BATCH);
            for (const item of batch) {
                try {
                    const result = await client.query(
                        'UPDATE questions SET explanation = $1 WHERE id = $2',
                        [item.explanation, item.id]
                    );
                    updated += result.rowCount;
                } catch (err) {
                    failed++;
                    console.error(`  id ${item.id}: ${err.message}`);
                }
            }
            console.log(`  ${Math.min(start + BATCH, writable.length)} / ${writable.length}`);
        }

        let corrected = 0;
        for (const correction of applicableCorrections) {
            try {
                const result = await client.query(
                    'UPDATE questions SET correct_option = $1 WHERE id = $2 AND correct_option = $3',
                    [correction.to, Number(correction.id), correction.from]
                );
                corrected += result.rowCount;
                console.log(`  corrected ${correction.id}: "${correction.from}" → "${correction.to}"`);
            } catch (err) {
                failed++;
                console.error(`  correction ${correction.id}: ${err.message}`);
            }
        }

        // ── verify after ─────────────────────────────────────────────────────
        const remaining = await client.query(
            `SELECT COUNT(*)::int AS n FROM questions WHERE explanation IS NULL OR TRIM(explanation) = ''`
        );
        console.log('');
        console.log(`Explanations written: ${updated}`);
        console.log(`Answers corrected:    ${corrected}`);
        console.log(`Failures:             ${failed}`);
        console.log(`Questions still without an explanation: ${remaining.rows[0].n}`);
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
