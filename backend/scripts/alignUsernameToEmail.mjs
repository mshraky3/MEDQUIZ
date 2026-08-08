/**
 * Collapse `accounts.username` onto `accounts.email`.
 *
 * Sign-in has been email-only for a long time, but a few pre-email accounts
 * kept a separate handle (e.g. 'albaraa1'). That split identity is what forced
 * every auth query into a `(email = $1 OR username = $1)` dual-lookup and
 * leaked into the client, which stores `user.username` and sends it back on
 * every session check.
 *
 * The same statement also runs at server boot (see the schema bootstrap in
 * app.js) so deploy order can never matter. This script exists for running it
 * deliberately, and for seeing exactly which rows changed.
 *
 * Idempotent — after the first successful run it matches zero rows.
 *
 *   node scripts/alignUsernameToEmail.mjs           # dry run
 *   node scripts/alignUsernameToEmail.mjs --apply   # write
 */
import dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const APPLY = process.argv.includes('--apply');
const db = new Pool({
    user: process.env.DBUSER, host: process.env.DBHOST, database: process.env.DBNAME,
    password: process.env.DBPASSWORD, port: process.env.DBPORT, ssl: { rejectUnauthorized: false },
});

try {
    const { rows: pending } = await db.query(`
        SELECT a.id, a.username, a.email, a.subscription_status,
               EXISTS (SELECT 1 FROM accounts b WHERE b.id <> a.id AND b.username = a.email) AS blocked_by_collision
          FROM accounts a
         WHERE a.email IS NOT NULL AND btrim(a.email) <> ''
           AND a.username IS DISTINCT FROM a.email
         ORDER BY a.id
    `);

    if (!pending.length) {
        console.log('Nothing to do — every account already has username === email.');
        await db.end();
        process.exit(0);
    }

    console.log(`=== ${pending.length} account(s) with username <> email ===`);
    console.table(pending);

    const blocked = pending.filter((r) => r.blocked_by_collision);
    if (blocked.length) {
        console.warn(`\n!! ${blocked.length} row(s) SKIPPED: another account already uses that email`);
        console.warn('   as its username, and UNIQUE(username) would reject the update.');
        console.table(blocked);
    }

    if (!APPLY) {
        console.log('\nDRY RUN — nothing written. Re-run with --apply to commit.');
        await db.end();
        process.exit(0);
    }

    const { rows: updated } = await db.query(`
        UPDATE accounts a
           SET username = a.email, updated_at = NOW()
         WHERE a.email IS NOT NULL AND btrim(a.email) <> ''
           AND a.username IS DISTINCT FROM a.email
           AND NOT EXISTS (SELECT 1 FROM accounts b WHERE b.id <> a.id AND b.username = a.email)
        RETURNING id, username, email
    `);
    console.log(`\n=== UPDATED ${updated.length} account(s) ===`);
    console.table(updated);
    console.log('\nNote: any affected user must sign in again — their stored session object');
    console.log('still carries the OLD username, which no longer resolves.');
} catch (err) {
    console.error('FAILED:', err.message);
    process.exitCode = 1;
} finally {
    await db.end();
}
