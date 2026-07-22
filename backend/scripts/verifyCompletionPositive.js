/**
 * Proves the "finished this topic" behaviour end-to-end at the SQL level.
 * Inside a transaction that is ALWAYS rolled back, it:
 *   1. picks the smallest (type, source) category
 *   2. marks every question in it as seen (as a real quiz would)
 *   3. asserts /api/questions would now report completed=true
 *   4. asserts the /quiz-sessions completion check reports complete=true
 *   5. asserts /api/reset-progress clears it and questions come back
 * Nothing is persisted.
 */
import dotenv from 'dotenv';
import pg from 'pg';
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

let failures = 0;
function check(label, actual, expected) {
    const ok = actual === expected;
    if (!ok) failures++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label} (got ${actual}, expected ${expected})`);
}

async function unseenCount(client, userId, type, source) {
    const r = await client.query(
        `SELECT COUNT(*)::int AS c FROM questions
         WHERE question_type = ANY($1::text[]) AND source = $2
           AND id NOT IN (SELECT DISTINCT question_id FROM user_question_progress WHERE user_id = $3)`,
        [[type], source, userId]
    );
    return r.rows[0].c;
}

async function main() {
    const client = await pool.connect();
    try {
        const u = await client.query('SELECT id FROM accounts ORDER BY id LIMIT 1');
        const userId = u.rows[0].id;

        // Smallest category so the simulation is cheap.
        const small = await client.query(`
            SELECT question_type, source, COUNT(*)::int AS c
            FROM questions GROUP BY question_type, source
            HAVING COUNT(*) > 0 ORDER BY c ASC LIMIT 1
        `);
        const { question_type: type, source, c: total } = small.rows[0];
        console.log(`Simulating user ${userId} finishing: "${type}" / "${source}" (${total} questions)\n`);

        await client.query('BEGIN');

        // 1. before
        check('unseen before answering == total', await unseenCount(client, userId, type, source), total);

        // 2. answer every question in the category (what a quiz submission does)
        await client.query(`
            INSERT INTO user_question_progress (user_id, question_id, question_type, source)
            SELECT $1, id, question_type, COALESCE(source,'general') FROM questions
            WHERE question_type = $2 AND source = $3
            ON CONFLICT (user_id, question_id) DO NOTHING
        `, [userId, type, source]);

        // 3. /api/questions would now return 0 unseen but total > 0  => completed
        const unseenAfter = await unseenCount(client, userId, type, source);
        check('unseen after answering == 0', unseenAfter, 0);
        const totalRes = await client.query(
            `SELECT COUNT(*)::int AS c FROM questions WHERE question_type = $1 AND source = $2`, [type, source]);
        check('completed flag would be true', unseenAfter === 0 && totalRes.rows[0].c > 0, true);

        // 4. /quiz-sessions completedCategories check
        const doneRes = await client.query(
            `SELECT COUNT(*)::int AS c FROM user_question_progress
             WHERE user_id = $1 AND question_type = $2 AND source = $3`, [userId, type, source]);
        check('completedCategories would include it',
            totalRes.rows[0].c > 0 && doneRes.rows[0].c >= totalRes.rows[0].c, true);

        // 5. reset brings the questions back
        const del = await client.query(
            `DELETE FROM user_question_progress WHERE user_id = $1 AND source = $2 AND question_type = ANY($3::text[])`,
            [userId, source, [type]]);
        check('reset cleared the progress rows', del.rowCount, total);
        check('unseen after reset == total', await unseenCount(client, userId, type, source), total);

        await client.query('ROLLBACK');
        console.log('\nROLLED BACK — no changes persisted.');
        console.log(failures === 0 ? '\nAll checks PASSED.' : `\n${failures} check(s) FAILED.`);
        process.exitCode = failures === 0 ? 0 : 1;
    } catch (e) {
        try { await client.query('ROLLBACK'); } catch { /* ignore */ }
        throw e;
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
