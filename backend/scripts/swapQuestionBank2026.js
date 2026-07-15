/**
 * Replace the old Midgard/GameBoy/general question bank with the new unified
 * "MidgardGameBoy" bank, and add the May/June 2026 monthly collections.
 *
 * Steps:
 *   1. Widen the user_quiz_sessions source CHECK constraint (keep legacy values
 *      so existing quiz history stays valid; add the new sources).
 *   2. DELETE questions WHERE source IN ('Midgard','GameBoy','general').
 *      FK cascades remove their user_question_attempts / _progress / reports.
 *      (Run scripts/exportOldSources.js first — it writes the local backup.)
 *   3. INSERT the new questions from the JSON folders below.
 *
 * Usage (from backend/, reads DB creds from .env like app.js):
 *   node scripts/swapQuestionBank2026.js            # dry run: shows plan only
 *   node scripts/swapQuestionBank2026.js --apply     # perform the swap
 *   node scripts/swapQuestionBank2026.js --apply --skip-delete   # insert only
 */

import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;
const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT || 5432,
    ssl: { rejectUnauthorized: false }
});

const APPLY = process.argv.includes('--apply');
const SKIP_DELETE = process.argv.includes('--skip-delete');
const BATCH = 200;

const OLD_SOURCES = ['Midgard', 'GameBoy', 'general'];

// New sources to insert: folder under JSON/ -> DB source key
const NEW_SOURCES = [
    { folder: 'MidgardGameBoy', sourceKey: 'MidgardGameBoy' },
    { folder: 'May26', sourceKey: 'May26' },
    { folder: 'June26', sourceKey: 'June26' },
];

// Every source that may legally appear in user_quiz_sessions.source.
// Legacy values stay so historical rows still satisfy the constraint.
const ALL_SESSION_SOURCES = [
    'general', 'Midgard', 'GameBoy',
    'October25', 'November25', 'December25',
    'January25', 'FebMarApr25',
    'MidgardGameBoy', 'May26', 'June26',
];

const VALID_TYPES = ['pediatric', 'obstetrics and gynecology', 'medicine', 'surgery'];

function loadFolder(folder) {
    const dir = path.join(__dirname, '..', '..', 'JSON', folder);
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    let out = [];
    for (const f of files) {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
            if (Array.isArray(data)) out = out.concat(data);
        } catch (e) {
            console.warn(`   WARNING: could not parse ${folder}/${f}: ${e.message}`);
        }
    }
    return out;
}

function normalizeQuestion(q, sourceKey) {
    const opt1 = (q.option1 ?? '').toString().trim() || 'Option not recalled';
    const opt2 = (q.option2 ?? '').toString().trim() || 'Option not recalled';
    const opt3 = (q.option3 ?? '').toString().trim() || 'Option not recalled';
    const opt4 = (q.option4 ?? '').toString().trim() || 'Option not recalled';
    const text = (q.question_text ?? '').toString().trim();
    let correct = (q.correct_option ?? '').toString().trim();
    const type = (q.question_type ?? '').toString().trim();
    return { text, opt1, opt2, opt3, opt4, correct, type, source: sourceKey };
}

async function main() {
    const client = await pool.connect();
    try {
        console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes). Pass --apply to execute ===');

        // Current state
        const before = await client.query(
            `SELECT source, COUNT(*) n FROM questions GROUP BY source ORDER BY n DESC`);
        console.log('\nCurrent questions by source:');
        before.rows.forEach(r => console.log(`   ${r.source}: ${r.n}`));

        // Load + validate new questions
        console.log('\nLoading new question JSON...');
        const toInsert = [];
        for (const src of NEW_SOURCES) {
            const raw = loadFolder(src.folder);
            let valid = 0, skipped = 0;
            for (const q of raw) {
                const n = normalizeQuestion(q, src.sourceKey);
                if (!VALID_TYPES.includes(n.type)) { skipped++; continue; }
                const opts = [n.opt1, n.opt2, n.opt3, n.opt4];
                if (!n.correct || !opts.includes(n.correct)) { skipped++; continue; }
                if (n.text.length < 15) { skipped++; continue; }
                toInsert.push(n); valid++;
            }
            console.log(`   ${src.folder}: ${raw.length} loaded -> ${valid} valid, ${skipped} skipped`);
        }
        console.log(`   TOTAL to insert: ${toInsert.length}`);

        if (!APPLY) {
            const delCount = await client.query(
                `SELECT COUNT(*) n FROM questions WHERE source = ANY($1)`, [OLD_SOURCES]);
            console.log(`\nWould DELETE ${delCount.rows[0].n} questions (sources: ${OLD_SOURCES.join(', ')}).`);
            console.log(`Would INSERT ${toInsert.length} questions.`);
            console.log('\nDry run complete. Re-run with --apply to execute.');
            return;
        }

        // 1) constraint
        console.log('\n[1/3] Updating user_quiz_sessions source constraint...');
        await client.query(`ALTER TABLE user_quiz_sessions DROP CONSTRAINT IF EXISTS check_valid_quiz_source`);
        const list = ALL_SESSION_SOURCES.map(s => `'${s}'`).join(', ');
        await client.query(
            `ALTER TABLE user_quiz_sessions ADD CONSTRAINT check_valid_quiz_source CHECK (source IN (${list}))`);
        console.log('   ✓ constraint updated');

        // 2) delete old
        if (SKIP_DELETE) {
            console.log('\n[2/3] Skipping delete (--skip-delete).');
        } else {
            console.log('\n[2/3] Deleting old sources (cascades to attempts/progress/reports)...');
            const del = await client.query(
                `DELETE FROM questions WHERE source = ANY($1)`, [OLD_SOURCES]);
            console.log(`   ✓ deleted ${del.rowCount} questions`);
        }

        // 3) insert new (dedupe against DB by question_text + source)
        console.log('\n[3/3] Inserting new questions...');
        let inserted = 0, dupes = 0, errors = 0;
        const stats = {};
        for (let i = 0; i < toInsert.length; i += BATCH) {
            const slice = toInsert.slice(i, i + BATCH);
            for (const q of slice) {
                try {
                    const exists = await client.query(
                        `SELECT 1 FROM questions WHERE question_text = $1 AND source = $2 LIMIT 1`,
                        [q.text, q.source]);
                    if (exists.rows.length) { dupes++; continue; }
                    await client.query(
                        `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option, source)
                         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                        [q.text, q.opt1, q.opt2, q.opt3, q.opt4, q.type, q.correct, q.source]);
                    inserted++;
                    stats[q.source] = (stats[q.source] || 0) + 1;
                } catch (e) {
                    errors++;
                    if (errors <= 5) console.warn(`   insert error: ${e.message}`);
                }
            }
            console.log(`   progress ${Math.min(i + BATCH, toInsert.length)}/${toInsert.length}`);
        }
        console.log(`\n   Inserted: ${inserted}  (by source: ${JSON.stringify(stats)})`);
        console.log(`   Duplicates skipped: ${dupes}  Errors: ${errors}`);

        const after = await client.query(
            `SELECT source, COUNT(*) n FROM questions GROUP BY source ORDER BY n DESC`);
        console.log('\nFinal questions by source:');
        after.rows.forEach(r => console.log(`   ${r.source}: ${r.n}`));
        console.log('\n✅ Swap complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
