/**
 * Replace the ENTIRE live question bank with the 2026H2 rebuild.
 *
 * The old bank had accumulating quality problems, so it was fully re-authored
 * from source material and normalized (see scripts/normalizeSourceMaterial.js
 * and source-material/clean/REPORT.md) into 5 clean collections:
 *   MedicalGameBoy, MedicalConfirmed, MedicalMidgard,
 *   NursingConfirmed, NursingMostRepeated
 * — 5,033 questions total. This script deletes every existing question (and,
 * since none of them can be actioned once their target question is gone,
 * every question_reports row) and inserts the clean bank in its place.
 *
 * Safety, following the conventions already used in this folder:
 *   - In --apply mode: backs up EVERY question row and EVERY question_reports
 *     row to backups/full-bank-<date>/ first, and ASSERTS the backed-up count
 *     matches the live count for both tables (aborts on any mismatch) before
 *     touching the DB — same pattern as deleteLegacy2025.js.
 *   - Prints the live FK cascade picture (which tables reference questions(id)
 *     and their ON DELETE rule) before deleting anything. Only
 *     user_question_progress's cascade is confirmed in code
 *     (app.js: `ON DELETE CASCADE`); user_question_attempts is asserted only
 *     in comments elsewhere in this repo, never verified from the schema —
 *     this script checks the real thing.
 *   - Widens user_quiz_sessions.check_valid_quiz_source to add the three new
 *     medical source keys, keeping every legacy value (historical sessions
 *     must stay valid) — same rebuild-from-scratch pattern every other insert
 *     script in this folder uses for that constraint.
 *   - DELETE and TRUNCATE run inside a single transaction (rolls back on any
 *     error); insert is batched (200), deduped by (question_text, track), and
 *     each row is try/catch-guarded so one bad row can't kill the run.
 *   - Idempotent insert: a second run with --apply (e.g. after --skip-delete)
 *     inserts 0 new rows for anything already present.
 *
 * Rollback: re-insert from backups/full-bank-<date>/questions_<source>.json
 * using the same INSERT shape below; question_reports likewise from
 * question_reports.json (though those rows would reference question ids that
 * no longer exist post-swap, so a real rollback also means restoring the old
 * questions rows first).
 *
 * Usage (from backend/, reads DB creds from .env like app.js):
 *   node scripts/replaceQuestionBank2026H2.js               # dry run: plan only
 *   node scripts/replaceQuestionBank2026H2.js --apply        # backup + swap
 *   node scripts/replaceQuestionBank2026H2.js --apply --skip-delete  # insert only
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
const SKIP_DELETE = process.argv.includes('--skip-delete');
const BATCH = 200;

const CLEAN_DIR = path.join(__dirname, '..', '..', 'source-material', 'clean');
const CLEAN_FILES = [
    'medical-gameboy.json',
    'medical-confirmed.json',
    'medical-midgard.json',
    'nursing-confirmed.json',
    'nursing-most-repeated.json',
];

/**
 * Every value that may legally appear in user_quiz_sessions.source, rebuilt
 * from scratch (Postgres CHECK constraints don't support incremental ADD
 * VALUE) — every legacy value carried forward from insertNursingContent.js's
 * list plus the three new 2026H2 medical keys.
 */
const ALL_SESSION_SOURCES = [
    'general', 'Midgard', 'GameBoy',
    'October25', 'November25', 'December25',
    'January25', 'FebMarApr25',
    'MidgardGameBoy', 'May26', 'June26',
    'NursingEMS', 'NursingMostRepeated', 'NursingConfirmed',
    'MedicalGameBoy', 'MedicalConfirmed', 'MedicalMidgard',
];

function dateStamp() {
    return new Date().toISOString().slice(0, 10);
}

function loadCleanBank() {
    const collections = [];
    for (const file of CLEAN_FILES) {
        const full = path.join(CLEAN_DIR, file);
        if (!fs.existsSync(full)) {
            console.error(`FATAL: expected clean file missing: ${full}`);
            process.exit(1);
        }
        const data = JSON.parse(fs.readFileSync(full, 'utf8'));
        if (!Array.isArray(data.questions) || !data.source || !data.track) {
            console.error(`FATAL: ${file} is missing source/track/questions`);
            process.exit(1);
        }
        const allowed = specialtyKeys(data.track);
        for (const q of data.questions) {
            if (!allowed.includes(q.question_type)) {
                console.error(`FATAL: ${file} has question_type "${q.question_type}" not valid for track "${data.track}"`);
                process.exit(1);
            }
        }
        collections.push({ file, source: data.source, track: data.track, questions: data.questions });
    }
    return collections;
}

async function printFkCascade(client) {
    const fks = await client.query(`
        SELECT tc.table_name, kcu.column_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.referential_constraints rc
          ON tc.constraint_name = rc.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON rc.unique_constraint_name = ccu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'questions'
    `);
    console.log('\nTables with a foreign key to questions(id):');
    if (fks.rows.length === 0) {
        console.log('   (none found — deleting questions will not cascade anywhere)');
    }
    fks.rows.forEach((r) => console.log(`   ${r.table_name}.${r.column_name}  ON DELETE ${r.delete_rule}`));
    return fks.rows;
}

async function main() {
    const client = await pool.connect();
    try {
        console.log(APPLY ? '=== APPLY MODE ===' : '=== DRY RUN (no changes). Pass --apply to execute ===');

        const collections = loadCleanBank();
        const totalToInsert = collections.reduce((n, c) => n + c.questions.length, 0);
        console.log('\nClean bank to insert:');
        collections.forEach((c) => console.log(`   ${c.source.padEnd(20)} ${String(c.questions.length).padStart(5)}  (${c.track})`));
        console.log(`   TOTAL: ${totalToInsert}`);

        const fkRows = await printFkCascade(client);

        const beforeQ = await client.query(`SELECT source, COUNT(*)::int n FROM questions GROUP BY source ORDER BY n DESC`);
        const beforeTotal = beforeQ.rows.reduce((n, r) => n + r.n, 0);
        console.log(`\nQuestions currently live: ${beforeTotal}`);
        beforeQ.rows.forEach((r) => console.log(`   ${r.source}: ${r.n}`));

        const reportsCount = await client.query(`SELECT COUNT(*)::int n FROM question_reports`);
        console.log(`\nquestion_reports rows currently live: ${reportsCount.rows[0].n} (all will be cleared — none reference a question that survives this swap)`);

        if (!SKIP_DELETE) {
            const attempts = await client.query(`SELECT COUNT(*)::int n FROM user_question_attempts`);
            const progress = await client.query(`SELECT COUNT(*)::int n FROM user_question_progress`);
            console.log(`\nCascade impact if DELETE FROM questions cascades as expected: up to ${attempts.rows[0].n} user_question_attempts, ${progress.rows[0].n} user_question_progress rows removed.`);
            const nonCascading = fkRows.filter((r) => r.delete_rule !== 'CASCADE');
            if (nonCascading.length) {
                console.log(`\n   !! WARNING: ${nonCascading.length} FK(s) to questions(id) do NOT cascade — deleting questions may fail with a foreign key violation on: ${nonCascading.map((r) => r.table_name).join(', ')}`);
            }
        }

        if (!APPLY) {
            console.log(`\nWould BACK UP then ${SKIP_DELETE ? 'SKIP delete,' : 'DELETE all existing questions + TRUNCATE question_reports,'} then INSERT ${totalToInsert} clean questions.`);
            console.log('\nDry run complete. Re-run with --apply to execute.');
            return;
        }

        // 1) Backup + assert
        const outDir = path.join(__dirname, '..', '..', 'backups', `full-bank-${dateStamp()}`);
        fs.mkdirSync(outDir, { recursive: true });
        console.log(`\n[1/4] Backing up to ${outDir} ...`);
        let backedUp = 0;
        for (const r of beforeQ.rows) {
            const res = await client.query(`SELECT * FROM questions WHERE source = $1 ORDER BY id`, [r.source]);
            fs.writeFileSync(path.join(outDir, `questions_${r.source}.json`), JSON.stringify(res.rows, null, 2), 'utf8');
            backedUp += res.rows.length;
        }
        if (backedUp !== beforeTotal) {
            throw new Error(`Backup count (${backedUp}) != live count (${beforeTotal}); ABORTING before any delete.`);
        }
        const reportsRows = await client.query(`SELECT * FROM question_reports ORDER BY id`);
        fs.writeFileSync(path.join(outDir, 'question_reports.json'), JSON.stringify(reportsRows.rows, null, 2), 'utf8');
        if (reportsRows.rows.length !== reportsCount.rows[0].n) {
            throw new Error(`question_reports backup count (${reportsRows.rows.length}) != live count (${reportsCount.rows[0].n}); ABORTING.`);
        }
        console.log(`   ✓ backup verified: ${backedUp} questions, ${reportsRows.rows.length} question_reports`);

        // 2) Widen the session-source constraint
        console.log('\n[2/4] Updating user_quiz_sessions source constraint...');
        await client.query(`ALTER TABLE user_quiz_sessions DROP CONSTRAINT IF EXISTS check_valid_quiz_source`);
        const list = ALL_SESSION_SOURCES.map((s) => `'${s}'`).join(', ');
        await client.query(`ALTER TABLE user_quiz_sessions ADD CONSTRAINT check_valid_quiz_source CHECK (source IN (${list}))`);
        console.log(`   ✓ constraint now accepts ${ALL_SESSION_SOURCES.length} values, including the 3 new medical sources`);

        // 3) Delete, inside a transaction
        if (!SKIP_DELETE) {
            console.log('\n[3/4] Clearing question_reports and deleting all questions (transaction)...');
            await client.query('BEGIN');
            try {
                const truncated = await client.query('TRUNCATE question_reports');
                const del = await client.query('DELETE FROM questions');
                await client.query('COMMIT');
                console.log(`   ✓ question_reports cleared, ${del.rowCount} questions deleted (FK cascades applied)`);
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            }
        } else {
            console.log('\n[3/4] --skip-delete: leaving existing questions untouched.');
        }

        // 4) Insert the clean bank
        console.log('\n[4/4] Inserting clean bank...');
        let inserted = 0, dupes = 0, errors = 0;
        for (const c of collections) {
            for (let i = 0; i < c.questions.length; i += BATCH) {
                for (const q of c.questions.slice(i, i + BATCH)) {
                    try {
                        // Scoped to (text, track, source) — NOT just (text, track).
                        // A question shared between two collections in the same
                        // track (kept in both by design, see
                        // source-material/clean/REPORT.md) must land in both;
                        // deduping on track alone would silently drop its second
                        // copy in favor of whichever collection got inserted first.
                        const exists = await client.query(
                            `SELECT 1 FROM questions WHERE question_text = $1 AND track = $2 AND source = $3 LIMIT 1`,
                            [q.question_text, c.track, c.source]);
                        if (exists.rows.length) { dupes++; continue; }
                        await client.query(
                            `INSERT INTO questions
                                (question_text, option1, option2, option3, option4,
                                 question_type, correct_option, source, track)
                             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                            [q.question_text, q.option1, q.option2, q.option3, q.option4,
                             q.question_type, q.correct_option, c.source, c.track]);
                        inserted++;
                    } catch (e) {
                        errors++;
                        if (errors <= 5) console.warn(`   insert error (${c.source}): ${e.message}`);
                    }
                }
            }
            console.log(`   ${c.source.padEnd(20)} done`);
        }
        console.log(`\n   Inserted: ${inserted}   Already present: ${dupes}   Errors: ${errors}`);

        // Verify
        const afterType = await client.query(
            `SELECT track, question_type, COUNT(*)::int n FROM questions GROUP BY track, question_type ORDER BY track, n DESC`);
        const afterSource = await client.query(
            `SELECT source, COUNT(*)::int n FROM questions GROUP BY source ORDER BY n DESC`);
        console.log('\nFinal questions by track/type:');
        afterType.rows.forEach((r) => console.log(`   ${r.track.padEnd(10)} ${r.question_type.padEnd(30)} ${r.n}`));
        console.log('\nFinal questions by source:');
        afterSource.rows.forEach((r) => console.log(`   ${r.source}: ${r.n}`));

        for (const t of ['medical', 'nursing']) {
            const allowed = specialtyKeys(t);
            const bad = afterType.rows.filter((r) => r.track === t && !allowed.includes(r.question_type));
            bad.forEach((r) => console.warn(`   ! ${t} has ${r.n} row(s) of invalid question_type "${r.question_type}"`));
        }

        console.log('\n✅ Swap complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
