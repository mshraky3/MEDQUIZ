/**
 * Delete synthetic QA/probe accounts that were created against PRODUCTION.
 *
 * WHY THIS EXISTS
 * An automated endpoint test run on 2026-08-22/23 pointed at the live backend
 * instead of staging. It left real rows in the production `accounts` table —
 * probe.add.*@example.invalid (ids 322-326), zz-grant-e2e-*@example.invalid
 * (id 328) and cssqacheck@test.local (id 331) — several of them carrying real
 * paid-access grants of 6, 12 and even 120 months, and each one mailed an
 * "Admin Account Created" / "Access granted" notice to the owner inbox.
 *
 * They are not just inbox noise: they inflate the account count and the
 * granted-access totals that the admin dashboard reports, so they distort
 * every conversion number derived from them.
 *
 * WHAT COUNTS AS SYNTHETIC
 * Only addresses in domains the IETF permanently reserved for exactly this
 * purpose and which therefore CANNOT belong to a real person:
 *   .invalid, .test, .example, .localhost   (RFC 2606 / RFC 6761)
 *   example.com / .net / .org               (RFC 2606 reserved second-level)
 *   *.local                                 (mDNS; never a public mailbox)
 * That rule is deliberately structural rather than a list of prefixes like
 * "probe." or "zz-", because a prefix convention only catches the probes we
 * have already seen, while a reserved domain can never be a customer no matter
 * what the next test suite decides to name its fixtures.
 *
 * SAFETY (same contract as deleteNoEmailAccounts.js)
 *  - Refuses to touch any account with a confirmed payment. Money always wins
 *    over a cleanup rule, even if the address looks synthetic.
 *  - Writes a full JSON backup of every row it will remove BEFORE deleting.
 *  - Dry-run by default. Pass --write to actually delete.
 *
 * Usage:
 *   node scripts/deleteSyntheticTestAccounts.js            # report only
 *   node scripts/deleteSyntheticTestAccounts.js --write    # back up, then delete
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

// Checked against BOTH email and username: these accounts were created through
// the admin panel, where the username is the address and the email column is
// sometimes the only one populated.
const SYNTHETIC_DOMAINS = [
    '%@%.invalid',
    '%@%.test',
    '%@%.example',
    '%@%.localhost',
    '%@%.local',
    '%@example.com',
    '%@example.net',
    '%@example.org',
];

const IS_SYNTHETIC = `(
    ${SYNTHETIC_DOMAINS.map((_, i) => `LOWER(a.email) LIKE $${i + 1}`).join('\n OR ')}
 OR ${SYNTHETIC_DOMAINS.map((_, i) => `LOWER(a.username) LIKE $${i + 1}`).join('\n OR ')}
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
               a.subscription_status, a.subscription_expiry_date, a.is_admin_created
          FROM accounts a
         WHERE ${IS_SYNTHETIC}
           -- never delete anyone who has actually paid us
           AND NOT EXISTS (
               SELECT 1 FROM payment_events pe
                WHERE pe.account_id = a.id AND pe.status = 'paid'
           )
         ORDER BY a.id
    `, SYNTHETIC_DOMAINS);

    if (!targets.length) {
        console.log('Nothing to do — no synthetic test accounts in this database.');
        await db.end();
        return;
    }

    const ids = targets.map((r) => r.id);
    console.log(`${targets.length} synthetic test account(s):\n`);
    for (const t of targets) {
        const { rows: [c] } = await db.query(
            'SELECT COUNT(*)::int n FROM user_quiz_sessions WHERE user_id = $1', [t.id]
        );
        const expires = t.subscription_expiry_date
            ? String(new Date(t.subscription_expiry_date).toISOString().slice(0, 10))
            : '—';
        console.log(
            `  #${String(t.id).padEnd(4)} ${String(t.username || t.email).slice(0, 44).padEnd(46)}`
            + ` status=${String(t.subscription_status || 'free').padEnd(9)}`
            + ` expires=${expires.padEnd(11)} quizzes=${c.n}`
        );
    }

    if (!WRITE) {
        console.log('\nDry run — nothing deleted. Re-run with --write to back up and delete.');
        await db.end();
        return;
    }

    // ── Backup first ──
    // Which of these tables actually exist here AND have a user_id column. This
    // has to happen before the transaction opens: inside one, a single failed
    // statement aborts everything after it, so a missing table would roll the
    // whole delete back.
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
    const file = path.join(dir, `deleted-synthetic-test-accounts-${Date.now()}.json`);
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
        console.log(`\nDeleted ${r.rowCount} synthetic account(s).`);
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
