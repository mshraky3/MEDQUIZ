/**
 * Additively insert the MonthlyRecall collection (source-material/clean/
 * medical-monthlyrecall.json, produced by normalizeMonthlyRecall.js) into the
 * live `questions` table.
 *
 * Unlike replaceQuestionBank2026H2.js this is NOT a full-bank swap — it never
 * deletes or backs up existing questions. It only:
 *   1. Widens user_quiz_sessions.check_valid_quiz_source to add
 *      'MedicalMonthlyRecall', rebuilding the CHECK from scratch (Postgres
 *      CHECK constraints don't support incremental ADD VALUE) while keeping
 *      every legacy value so historical sessions stay valid.
 *   2. Inserts each question, deduped against what's ALREADY LIVE by
 *      (question_text, track) — not scoped to source, since the point is to
 *      never insert a question that already exists anywhere in that track's
 *      bank under a different source label.
 *   3. Writes `explanation` directly (this collection was extracted with
 *      explanations already generated, unlike the 2026H2 rebuild which left
 *      the column for a separate backfill pass).
 *
 * Usage (from backend/, reads DB creds from .env like app.js):
 *   node scripts/insertMonthlyRecall.js               # dry run: plan only, no DB writes
 *   node scripts/insertMonthlyRecall.js --apply        # widen constraint + insert
 */

import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { specialtyKeys } from '../config/tracks.js';

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
const CLEAN_FILE = path.join(__dirname, '..', '..', 'source-material', 'clean', 'medical-monthlyrecall.json');
const NEW_SOURCE = 'MedicalMonthlyRecall';

/**
 * Every value that may legally appear in user_quiz_sessions.source, rebuilt
 * from scratch — the same full legacy list replaceQuestionBank2026H2.js
 * carries, plus the new MonthlyRecall key.
 */
const ALL_SESSION_SOURCES = [
    'general', 'Midgard', 'GameBoy',
    'October25', 'November25', 'December25',
    'January25', 'FebMarApr25',
    'MidgardGameBoy', 'May26', 'June26',
    'NursingEMS', 'NursingMostRepeated', 'NursingConfirmed',
    'MedicalGameBoy', 'MedicalConfirmed', 'MedicalMidgard',
    NEW_SOURCE,
];

function loadCleanCollection() {
    if (!fs.existsSync(CLEAN_FILE)) {
        console.error(`FATAL: clean file missing: ${CLEAN_FILE}\nRun normalizeMonthlyRecall.js --apply first.`);
        process.exit(1);
    }
    const data = JSON.parse(fs.readFileSync(CLEAN_FILE, 'utf8'));
    if (!Array.isArray(data.questions) || data.source !== NEW_SOURCE || !data.track) {
        console.error(`FATAL: ${CLEAN_FILE} is missing source/track/questions or source != "${NEW_SOURCE}"`);
        process.exit(1);
    }
    const allowed = specialtyKeys(data.track);
    for (const q of data.questions) {
        if (!allowed.includes(q.question_type)) {
            console.error(`FATAL: question_type "${q.question_type}" not valid for track "${data.track}": ${q.question_text.slice(0, 80)}`);
            process.exit(1);
        }
        if (![q.option1, q.option2, q.option3, q.option4].includes(q.correct_option)) {
            console.error(`FATAL: correct_option doesn't match any option: ${q.question_text.slice(0, 80)}`);
            process.exit(1);
        }
    }
    return { source: data.source, track: data.track, questions: data.questions };
}

async function main() {
    const client = await pool.connect();
    try {
        console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes). Pass --apply to execute ===');

        const collection = loadCleanCollection();
        console.log(`\nLoaded ${collection.questions.length} questions from ${path.basename(CLEAN_FILE)} (source="${collection.source}", track="${collection.track}")`);

        const withExplanation = collection.questions.filter((q) => q.explanation).length;
        console.log(`   ${withExplanation}/${collection.questions.length} carry an explanation`);

        // How many would collide with something already live, checked read-only
        // in BOTH modes so a dry run gives an honest preview of what would insert.
        let wouldSkip = 0;
        const sampleSkips = [];
        for (const q of collection.questions) {
            const exists = await client.query(
                `SELECT 1 FROM questions WHERE question_text = $1 AND track = $2 LIMIT 1`,
                [q.question_text, collection.track]
            );
            if (exists.rows.length) {
                wouldSkip++;
                if (sampleSkips.length < 10) sampleSkips.push(q.question_text.slice(0, 90));
            }
        }
        console.log(`\nAlready present elsewhere in the "${collection.track}" bank (by question_text+track): ${wouldSkip}`);
        if (sampleSkips.length) {
            console.log('   sample:');
            sampleSkips.forEach((s) => console.log(`     - ${s}`));
        }
        console.log(`Would insert: ${collection.questions.length - wouldSkip}`);

        const existingSourceCount = await client.query(
            `SELECT COUNT(*)::int n FROM questions WHERE source = $1`, [NEW_SOURCE]
        );
        console.log(`\nQuestions currently live with source="${NEW_SOURCE}": ${existingSourceCount.rows[0].n}`);

        if (!APPLY) {
            console.log('\nDry run complete. Re-run with --apply to widen the source constraint and insert.');
            return;
        }

        // 1) Widen the session-source constraint
        console.log('\n[1/2] Updating user_quiz_sessions source constraint...');
        await client.query(`ALTER TABLE user_quiz_sessions DROP CONSTRAINT IF EXISTS check_valid_quiz_source`);
        const list = ALL_SESSION_SOURCES.map((s) => `'${s}'`).join(', ');
        await client.query(`ALTER TABLE user_quiz_sessions ADD CONSTRAINT check_valid_quiz_source CHECK (source IN (${list}))`);
        console.log(`   constraint now accepts ${ALL_SESSION_SOURCES.length} values, including "${NEW_SOURCE}"`);

        // 2) Insert, batched, each row try/catch-guarded so one bad row can't
        // kill the run. Not wrapped in one big transaction on purpose — this
        // mirrors replaceQuestionBank2026H2.js's insert phase, so a run that
        // dies partway through is safely re-runnable (dedupe check skips
        // whatever already made it in).
        console.log('\n[2/2] Inserting...');
        let inserted = 0, skipped = 0, errors = 0;
        for (let i = 0; i < collection.questions.length; i += BATCH) {
            const batch = collection.questions.slice(i, i + BATCH);
            for (const q of batch) {
                try {
                    const exists = await client.query(
                        `SELECT 1 FROM questions WHERE question_text = $1 AND track = $2 LIMIT 1`,
                        [q.question_text, collection.track]
                    );
                    if (exists.rows.length) { skipped++; continue; }
                    await client.query(
                        `INSERT INTO questions
                            (question_text, option1, option2, option3, option4,
                             question_type, correct_option, source, track, explanation)
                         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                        [q.question_text, q.option1, q.option2, q.option3, q.option4,
                         q.question_type, q.correct_option, collection.source, collection.track,
                         q.explanation || null]
                    );
                    inserted++;
                } catch (e) {
                    errors++;
                    if (errors <= 5) console.warn(`   insert error: ${e.message} — ${q.question_text.slice(0, 60)}`);
                }
            }
            console.log(`   progress: ${Math.min(i + BATCH, collection.questions.length)}/${collection.questions.length} (${inserted} inserted, ${skipped} skipped, ${errors} errors)`);
        }
        console.log(`\nInserted: ${inserted}   Already present: ${skipped}   Errors: ${errors}`);

        // Verify
        const afterType = await client.query(
            `SELECT question_type, COUNT(*)::int n FROM questions WHERE source = $1 GROUP BY question_type ORDER BY n DESC`,
            [NEW_SOURCE]
        );
        console.log(`\nFinal "${NEW_SOURCE}" questions by type:`);
        afterType.rows.forEach((r) => console.log(`   ${r.question_type.padEnd(30)} ${r.n}`));

        console.log('\nInsert complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
