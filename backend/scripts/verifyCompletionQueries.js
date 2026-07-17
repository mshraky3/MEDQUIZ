/**
 * Read-only verification for the "no repeat until category finished" feature.
 * Runs the exact SQL shapes used by /api/questions, /quiz-sessions and
 * /api/reset-progress (SELECT only — the reset is run inside a rolled-back
 * transaction) to prove they are valid Postgres and behave as intended.
 *
 * Usage: node scripts/verifyCompletionQueries.js
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

// Mirrors the /api/questions builder exactly.
function buildQueries(typesParam, sourceParam, userId) {
    const categoryConditions = [];
    const categoryValues = [];

    if (!typesParam || typesParam === 'mix') {
        // no type filter
    } else {
        categoryConditions.push(`question_type = ANY($${categoryValues.length + 1}::text[])`);
        categoryValues.push(typesParam.split(','));
    }
    if (sourceParam && sourceParam !== 'mix') {
        categoryConditions.push(`source = $${categoryValues.length + 1}`);
        categoryValues.push(sourceParam);
    }

    const conditions = [...categoryConditions];
    const values = [...categoryValues];
    if (userId) {
        conditions.push(`id NOT IN (SELECT DISTINCT question_id FROM user_question_progress WHERE user_id = $${values.length + 1})`);
        values.push(userId);
    }

    let idQuery = 'SELECT id FROM questions';
    if (conditions.length > 0) idQuery += ' WHERE ' + conditions.join(' AND ');

    let countQuery = 'SELECT COUNT(*)::int AS total FROM questions';
    if (categoryConditions.length > 0) countQuery += ' WHERE ' + categoryConditions.join(' AND ');

    return { idQuery, values, countQuery, categoryValues };
}

async function main() {
    const client = await pool.connect();
    try {
        // Pick a real user id to exercise the progress filter.
        const u = await client.query('SELECT id FROM accounts ORDER BY id LIMIT 1');
        const userId = u.rows[0]?.id;
        console.log('Using userId:', userId);

        const cases = [
            ['medicine', 'MidgardGameBoy'],
            ['medicine,surgery', 'June26'],
            ['mix', 'May26'],
            ['medicine', 'mix'],
            ['mix', 'mix'],
        ];

        for (const [types, source] of cases) {
            const { idQuery, values, countQuery, categoryValues } = buildQueries(types, source, userId);
            const ids = await client.query(idQuery, values);
            const cnt = await client.query(countQuery, categoryValues);
            const remaining = ids.rowCount;
            const total = cnt.rows[0].total;
            const completed = remaining === 0 && total > 0;
            console.log(
                `  types=${types.padEnd(18)} source=${String(source).padEnd(15)} -> unseen=${String(remaining).padEnd(5)} total=${String(total).padEnd(5)} completed=${completed}`
            );
        }

        // /quiz-sessions completion check shape
        console.log('\nCompletion-check SQL (per cardinality):');
        const t = await client.query(
            `SELECT COUNT(*)::int AS c FROM questions WHERE question_type = $1 AND source = $2`,
            ['obstetrics and gynecology', 'MidgardGameBoy']
        );
        const d = await client.query(
            `SELECT COUNT(*)::int AS c FROM user_question_progress WHERE user_id = $1 AND question_type = $2 AND source = $3`,
            [userId, 'obstetrics and gynecology', 'MidgardGameBoy']
        );
        console.log(`  obgyn/MidgardGameBoy: total=${t.rows[0].c} answered=${d.rows[0].c} complete=${t.rows[0].c > 0 && d.rows[0].c >= t.rows[0].c}`);

        // /api/reset-progress shapes — executed then ROLLED BACK (no data change)
        console.log('\nReset SQL shapes (rolled back, nothing deleted):');
        await client.query('BEGIN');
        const r1 = await client.query(
            `DELETE FROM user_question_progress WHERE user_id = $1 AND source = $2 AND question_type = ANY($3::text[])`,
            [userId, 'MidgardGameBoy', ['medicine', 'surgery']]
        );
        console.log(`  source+types  -> would clear ${r1.rowCount}`);
        const r2 = await client.query(
            `DELETE FROM user_question_progress WHERE user_id = $1 AND source = $2`,
            [userId, 'MidgardGameBoy']
        );
        console.log(`  source only   -> would clear ${r2.rowCount}`);
        const r3 = await client.query(
            `DELETE FROM user_question_progress WHERE user_id = $1 AND question_type = ANY($2::text[])`,
            [userId, ['medicine']]
        );
        console.log(`  all sources   -> would clear ${r3.rowCount}`);
        await client.query('ROLLBACK');
        console.log('  ROLLED BACK — no rows actually deleted.');

        console.log('\nAll query shapes are valid Postgres.');
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
