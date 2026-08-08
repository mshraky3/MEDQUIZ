import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Credentials come from backend/.env — NEVER hardcode them here. This file used
// to carry the live host/user/password as string literals, which would have put
// the production database password into git history on the first push.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

for (const v of ['DBHOST', 'DBNAME', 'DBUSER', 'DBPASSWORD']) {
    if (!process.env[v]) {
        console.error(`Missing ${v}. Set it in backend/.env before running this script.`);
        process.exit(1);
    }
}

const pool = new Pool({
    host: process.env.DBHOST,
    port: process.env.DBPORT || 5432,
    database: process.env.DBNAME,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    ssl: { rejectUnauthorized: false },
});

// Inactive = no email/unverified + 0 quizzes + last login > 30 days ago or never
// Money always wins over a cleanup rule: never touch an account with a paid
// payment_events row, however it looks otherwise. See deleteNoEmailAccounts.js
// for the same guard and MONETIZATION_ANALYSIS_2026-08.md §6.1 for why it matters.
const FIND_INACTIVE = `
  SELECT a.id, a.username
  FROM accounts a
  LEFT JOIN (
    SELECT user_id, COUNT(*) as total_quizzes
    FROM user_quiz_sessions
    GROUP BY user_id
  ) q ON a.id = q.user_id
  WHERE (a.email IS NULL OR a.email_verified = FALSE)
    AND COALESCE(q.total_quizzes, 0) = 0
    AND (
      a.logged_date IS NULL
      OR a.logged_date < NOW() - INTERVAL '30 days'
    )
    AND NOT EXISTS (
      SELECT 1 FROM payment_events pe
       WHERE pe.account_id = a.id AND pe.status = 'paid'
    )
  ORDER BY a.id
`;

async function run() {
    const client = await pool.connect();
    try {
        const { rows } = await client.query(FIND_INACTIVE);

        if (rows.length === 0) {
            console.log('No inactive users found.');
            return;
        }

        console.log(`Found ${rows.length} inactive users to delete:\n`);
        rows.forEach(r => console.log(`  ID ${r.id} — ${r.username}`));

        const ids = rows.map(r => r.id);

        console.log('\nDeleting...');

        await client.query('DELETE FROM login_history WHERE user_id = ANY($1)', [ids]);
        await client.query('DELETE FROM user_question_attempts WHERE user_id = ANY($1)', [ids]);
        await client.query('DELETE FROM user_quiz_sessions WHERE user_id = ANY($1)', [ids]);
        await client.query('DELETE FROM user_topic_analysis WHERE user_id = ANY($1)', [ids]);
        await client.query('DELETE FROM user_streaks WHERE user_id = ANY($1)', [ids]);
        await client.query('DELETE FROM user_analysis WHERE user_id = ANY($1)', [ids]);
        await client.query('DELETE FROM user_question_progress WHERE user_id = ANY($1)', [ids]);

        const del = await client.query('DELETE FROM accounts WHERE id = ANY($1) RETURNING id, username', [ids]);

        console.log(`\n✅ Done. Deleted ${del.rowCount} accounts.`);
    } finally {
        client.release();
        await pool.end();
    }
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
