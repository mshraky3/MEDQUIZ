/**
 * Check activity of users with no email (or unverified email)
 * Run from backend/: node scripts/checkNoEmailUsers.js
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const db = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: { rejectUnauthorized: false },
});

const { rows } = await db.query(`
    SELECT 
        a.id,
        a.username,
        a.isactive,
        a.created_at::date                          AS joined,
        a.logged_date::date                         AS last_login,
        NOW()::date - a.logged_date::date           AS days_since_login,
        COUNT(q.id)                                 AS total_quizzes,
        MAX(q.start_time)::date                     AS last_quiz_date,
        COALESCE(us.current_streak, 0)              AS streak
    FROM accounts a
    LEFT JOIN user_quiz_sessions q  ON a.id = q.user_id
    LEFT JOIN user_streaks       us ON a.id = us.user_id
    WHERE (a.email IS NULL OR a.email_verified = FALSE)
    GROUP BY a.id, a.username, a.isactive, a.created_at, a.logged_date, us.current_streak
    ORDER BY total_quizzes DESC, last_login DESC NULLS LAST
`);

await db.end();

if (rows.length === 0) {
    console.log('✅ No users without a verified email.');
    process.exit(0);
}

console.log(`\n📋 Users with no verified email: ${rows.length}\n`);
console.log(
    'ID'.padEnd(6),
    'Username'.padEnd(20),
    'Active'.padEnd(8),
    'Joined'.padEnd(12),
    'Last Login'.padEnd(12),
    'Days Ago'.padEnd(10),
    'Quizzes'.padEnd(9),
    'Streak'
);
console.log('─'.repeat(90));

let activeCount = 0;
let inactiveCount = 0;

for (const u of rows) {
    const daysAgo = u.days_since_login !== null ? `${u.days_since_login}d` : 'never';
    const active = u.total_quizzes > 0 || (u.days_since_login !== null && u.days_since_login <= 30);
    if (active) activeCount++; else inactiveCount++;

    console.log(
        String(u.id).padEnd(6),
        (u.username || '').padEnd(20),
        (u.isactive ? 'yes' : 'no').padEnd(8),
        String(u.joined ?? '—').padEnd(12),
        String(u.last_login ?? '—').padEnd(12),
        daysAgo.padEnd(10),
        String(u.total_quizzes).padEnd(9),
        u.streak
    );
}

console.log('─'.repeat(90));
console.log(`\n🟢 Active (quizzes > 0 or login ≤ 30 days): ${activeCount}`);
console.log(`🔴 Inactive (no quizzes AND last login > 30 days or never): ${inactiveCount}`);
console.log(`\nSafe to delete (inactive): run with --delete flag to remove them.\n`);

if (process.argv.includes('--delete')) {
    const { rows: toDelete } = await db.query(`
        SELECT a.id FROM accounts a
        LEFT JOIN user_quiz_sessions q ON a.id = q.user_id
        WHERE (a.email IS NULL OR a.email_verified = FALSE)
          AND (a.logged_date IS NULL OR a.logged_date < NOW() - INTERVAL '30 days')
        GROUP BY a.id
        HAVING COUNT(q.id) = 0
    `);
    console.log(`⚠️  Would delete ${toDelete.length} inactive no-email users.`);
    // Intentionally not auto-deleting — print IDs for manual confirmation
    console.log('IDs:', toDelete.map(r => r.id).join(', '));
}
