/**
 * Delete legacy accounts that have no usable email address.
 *
 * These are from the era when signing up needed only a username. Such an
 * account cannot reset its password, cannot be told about anything, and cannot
 * receive an invoice — so it can never become a paying customer and only
 * distorts the user counts.
 *
 * SAFETY
 *  - Refuses to touch any account that has a confirmed payment, whatever its
 *    email looks like. Money always wins over a cleanup rule.
 *  - Writes a full JSON backup of every row it is about to remove (the account
 *    plus all of its activity) BEFORE deleting anything, so a mistake is
 *    recoverable.
 *  - Dry-run by default. Pass --write to actually delete.
 *
 * Usage:
 *   node scripts/deleteNoEmailAccounts.js            # report only
 *   node scripts/deleteNoEmailAccounts.js --write    # back up, then delete
 */
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

dotenv.config();
const WRITE = process.argv.includes('--write');

const db = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: { rejectUnauthorized: false },
});

/**
 * "No usable email": missing, blank, no @, or no dot in the domain.
 * Deliberately strict — the whole point is being able to reach the person.
 */
const INVALID_EMAIL = `(
    a.email IS NULL
 OR btrim(a.email) = ''
 OR POSITION('@' IN a.email) < 2
 OR POSITION('.' IN split_part(a.email, '@', 2)) < 2
)`;

// Everything that references accounts(id). Ordered children-first.
const CHILD_TABLES = [
    'user_question_attempts',
    'user_quiz_sessions',
    'user_topic_analysis',
    'user_streaks',
    'user_analysis',
    'user_question_progress',
    'user_achievements',
    'summary_progress',
    'login_history',
    'temp_link_accounts',
    'broadcast_recipients',
];

async function main() {
    const { rows: targets } = await db.query(`
        SELECT a.id, a.username, a.email, a.created_at, a.logged_date,
               a.subscription_status, a.is_admin_created
          FROM accounts a
         WHERE ${INVALID_EMAIL}
           -- never delete anyone who has actually paid us
           AND NOT EXISTS (
               SELECT 1 FROM payment_events pe
                WHERE pe.account_id = a.id AND pe.status = 'paid'
           )
         ORDER BY a.id
    `);

    if (!targets.length) {
        console.log('Nothing to do — no accounts without a usable email.');
        await db.end();
        return;
    }

    const ids = targets.map((r) => r.id);
    console.log(`${targets.length} account(s) without a usable email:\n`);
    for (const t of targets) {
        const { rows: [c] } = await db.query(
            'SELECT COUNT(*)::int n FROM user_quiz_sessions WHERE user_id = $1', [t.id]
        );
        console.log(
            `  #${String(t.id).padEnd(4)} ${String(t.username).slice(0, 30).padEnd(32)}`
            + ` quizzes=${String(c.n).padEnd(4)} last=${t.logged_date ? String(t.logged_date).slice(4, 15) : 'never'}`
        );
    }

    if (!WRITE) {
        console.log('\nDry run — nothing deleted. Re-run with --write to back up and delete.');
        await db.end();
        return;
    }

    // ── Backup first ──
    // Work out which of these tables actually exist here AND have a user_id
    // column. This has to happen before the transaction opens: inside one, a
    // single failed statement aborts everything that follows, so a missing
    // table would roll the whole delete back.
    const { rows: present } = await db.query(`
        SELECT table_name FROM information_schema.columns
         WHERE table_schema = 'public'
           AND column_name = 'user_id'
           AND table_name = ANY($1::text[])
    `, [CHILD_TABLES]);
    const tables = CHILD_TABLES.filter((t) => present.some((p) => p.table_name === t));

    const backup = { takenAt: new Date().toISOString(), accounts: targets, related: {} };
    for (const table of tables) {
        const { rows } = await db.query(
            `SELECT * FROM ${table} WHERE user_id = ANY($1::int[])`, [ids]
        );
        if (rows.length) backup.related[table] = rows;
    }
    const dir = path.join(process.cwd(), 'backups');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `deleted-no-email-accounts-${Date.now()}.json`);
    fs.writeFileSync(file, JSON.stringify(backup, null, 2), 'utf8');
    console.log(`\nBackup written: ${file}`);

    // ── Delete ──
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        for (const table of tables) {
            const r = await client.query(
                `DELETE FROM ${table} WHERE user_id = ANY($1::int[])`, [ids]
            );
            if (r.rowCount) console.log(`  ${table}: ${r.rowCount} row(s)`);
        }
        const r = await client.query('DELETE FROM accounts WHERE id = ANY($1::int[])', [ids]);
        await client.query('COMMIT');
        console.log(`\nDeleted ${r.rowCount} account(s).`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Rolled back — nothing was deleted:', err.message);
        process.exitCode = 1;
    } finally {
        client.release();
    }
    await db.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
