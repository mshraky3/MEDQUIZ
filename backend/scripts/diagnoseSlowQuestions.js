/**
 * Read-only diagnostic: measure how slow the current /api/questions query
 * (ORDER BY RANDOM() over the whole table) is vs. an id-first alternative,
 * against the live DB. No writes.
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

async function time(label, fn) {
    const t0 = Date.now();
    const res = await fn();
    console.log(`${label}: ${Date.now() - t0}ms`);
    return res;
}

async function main() {
    const client = await pool.connect();
    try {
        const count = await time('row count', () => client.query('SELECT COUNT(*) FROM questions'));
        console.log('   total questions:', count.rows[0].count);

        // Current production query pattern: full table ORDER BY RANDOM() LIMIT 10, no filters (mix/mix)
        await time('CURRENT: SELECT * ... ORDER BY RANDOM() LIMIT 10 (no filter)', () =>
            client.query('SELECT * FROM questions ORDER BY RANDOM() LIMIT 10'));

        // Current pattern with a type+source filter
        await time('CURRENT: filtered by type+source ORDER BY RANDOM() LIMIT 10', () =>
            client.query(
                `SELECT * FROM questions WHERE question_type = ANY($1::text[]) AND source = $2 ORDER BY RANDOM() LIMIT 10`,
                [['medicine'], 'October25']
            ));

        // Candidate fix: id-only scan then random pick then fetch by id
        await time('CANDIDATE: SELECT id ... (no filter)', async () => {
            const ids = await client.query('SELECT id FROM questions');
            return ids;
        });

        await time('CANDIDATE: SELECT id WHERE type+source', async () => {
            const ids = await client.query(
                `SELECT id FROM questions WHERE question_type = ANY($1::text[]) AND source = $2`,
                [['medicine'], 'October25']
            );
            return ids;
        });

        // full all-questions (admin bank) query
        await time('all-questions: SELECT 9 cols, no filter (full table)', () =>
            client.query('SELECT id, question_text, option1, option2, option3, option4, question_type, correct_option, source FROM questions'));

        // EXPLAIN for the slow one
        const plan = await client.query('EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM questions ORDER BY RANDOM() LIMIT 10');
        console.log('\nEXPLAIN ANALYZE for ORDER BY RANDOM() LIMIT 10:');
        plan.rows.forEach(r => console.log('  ' + r['QUERY PLAN']));
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
