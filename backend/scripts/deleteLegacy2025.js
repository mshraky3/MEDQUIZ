/**
 * Delete the genuinely-2025 monthly collections (October / November / December
 * 2025) from the `questions` table, keeping everything else — the unified
 * "Midgard & GameBoy2026" bank plus the 2026 collections.
 *
 * IMPORTANT — the source-key suffixes are misleading: `January25` and
 * `FebMarApr25` are 2026 content (see my-react-app/src/utils/sourceLabels.js)
 * and are KEPT. Only the three genuinely-2025 sources below are removed.
 *
 * Safety:
 *   - In --apply mode: backs up each deleted source to backups/legacy-2025-<date>/
 *     first and ASSERTS the backup row count matches what will be deleted (aborts
 *     on any mismatch) before touching the DB.
 *   - Runs the DELETE inside a single transaction (rolls back on any error).
 *   - Leaves user_quiz_sessions.check_valid_quiz_source UNTOUCHED so historical
 *     sessions that reference these sources stay valid.
 *   - Idempotent: a second run deletes 0.
 *
 * FK cascade: deleting a question cascades (ON DELETE CASCADE, app.js:73) to
 * user_question_attempts and user_question_progress. final_review_sessions and
 * user_topic_analysis have NO questions FK, so historical exams and aggregate
 * accuracy stats are preserved.
 *
 * Rollback: re-insert from the backup JSON using the INSERT shape in
 * scripts/swapQuestionBank2026.js.
 *
 * Usage (from backend/, reads DB creds from .env like app.js):
 *   node scripts/deleteLegacy2025.js            # dry run: shows the plan only
 *   node scripts/deleteLegacy2025.js --apply     # backup + delete
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

// The genuinely-2025 monthly collections. (January25 / FebMarApr25 are 2026 — kept.)
const DELETE_SOURCES = ['October25', 'November25', 'December25'];

function dateStamp() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
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

        const delCountRes = await client.query(
            `SELECT COUNT(*)::int n FROM questions WHERE source = ANY($1)`, [DELETE_SOURCES]);
        const toDelete = delCountRes.rows[0].n;
        console.log(`\nSources to delete: ${DELETE_SOURCES.join(', ')}`);
        console.log(`Questions matching: ${toDelete}`);

        if (toDelete === 0) {
            console.log('\nNothing to delete (already clean). Done.');
            return;
        }

        // Cascade impact (informational)
        const attempts = await client.query(
            `SELECT COUNT(*)::int n FROM user_question_attempts a
             JOIN questions q ON q.id = a.question_id WHERE q.source = ANY($1)`, [DELETE_SOURCES]);
        const progress = await client.query(
            `SELECT COUNT(*)::int n FROM user_question_progress p
             JOIN questions q ON q.id = p.question_id WHERE q.source = ANY($1)`, [DELETE_SOURCES]);
        console.log(`Cascade will remove: ${attempts.rows[0].n} user_question_attempts, ${progress.rows[0].n} user_question_progress rows`);

        if (!APPLY) {
            console.log(`\nWould BACK UP then DELETE ${toDelete} questions.`);
            console.log('Dry run complete. Re-run with --apply to execute.');
            return;
        }

        // 1) Backup + assert
        const outDir = path.join(__dirname, '..', '..', 'backups', `legacy-2025-${dateStamp()}`);
        fs.mkdirSync(outDir, { recursive: true });
        console.log(`\n[1/2] Backing up to ${outDir} ...`);
        let backedUp = 0;
        for (const source of DELETE_SOURCES) {
            const res = await client.query(
                `SELECT * FROM questions WHERE source = $1 ORDER BY id`, [source]);
            const file = path.join(outDir, `questions_${source}.json`);
            fs.writeFileSync(file, JSON.stringify(res.rows, null, 2), 'utf8');
            console.log(`   ${source}: ${res.rows.length} rows -> ${file}`);
            backedUp += res.rows.length;
        }
        if (backedUp !== toDelete) {
            throw new Error(`Backup count (${backedUp}) != delete count (${toDelete}); ABORTING before any delete.`);
        }
        console.log(`   ✓ backup verified: ${backedUp} rows`);

        // 2) Delete inside a transaction
        console.log('\n[2/2] Deleting (transaction)...');
        await client.query('BEGIN');
        try {
            const del = await client.query(
                `DELETE FROM questions WHERE source = ANY($1)`, [DELETE_SOURCES]);
            await client.query('COMMIT');
            console.log(`   ✓ deleted ${del.rowCount} questions (FK cascades applied)`);
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        }

        const after = await client.query(
            `SELECT source, COUNT(*) n FROM questions GROUP BY source ORDER BY n DESC`);
        console.log('\nFinal questions by source:');
        after.rows.forEach(r => console.log(`   ${r.source}: ${r.n}`));
        console.log('\nNote: user_quiz_sessions.check_valid_quiz_source left untouched so historical sessions stay valid.');
        console.log('\n✅ Cleanup complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
