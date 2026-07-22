import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    host: 'ep-calm-silence-a4k4dxgb.us-east-1.pg.koyeb.app',
    port: 5432,
    database: 'koyebdb',
    user: 'koyeb-adm',
    password: 'npg_lvpKWf1E6GQm',
    ssl: { rejectUnauthorized: false },
});

// Inactive = no email/unverified + 0 quizzes + last login > 30 days ago or never
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
