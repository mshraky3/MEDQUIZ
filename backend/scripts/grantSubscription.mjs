/**
 * Give an existing account paid access for N months, without a payment.
 *
 * The manual/CLI door to the same code the admin panel uses
 * (POST /admin/users/:userId/grant-subscription → grantSubscriptionMonths).
 * Use it when the panel is not reachable, or for a scripted batch.
 *
 * The term STACKS on a live subscription (max(now, current expiry) + months),
 * so comping a month for someone mid-term adds a month rather than cutting
 * their remaining time down to one.
 *
 * The audit row it writes is status='granted', NOT 'paid' — see
 * grantSubscriptionMonths for why that distinction is load-bearing for the
 * accounting reports.
 *
 * Usage:
 *   node scripts/grantSubscription.mjs --email x@y.com --months 4            # dry run
 *   node scripts/grantSubscription.mjs --email x@y.com --months 4 --apply    # write
 *   node scripts/grantSubscription.mjs --id 42 --months 12 --apply --reason "support case"
 */
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { grantSubscriptionMonths, normalizeGrantMonths } from '../services/paymentService.js';
dotenv.config();

const args = process.argv.slice(2);
const arg = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : null;
};
const APPLY = args.includes('--apply');
const EMAIL = (arg('email') || '').toLowerCase().trim();
const ID = arg('id');
const MONTHS = normalizeGrantMonths(arg('months') ?? 4);
const REASON = arg('reason') || 'manual grant (CLI)';

if (!EMAIL && !ID) {
    console.error('Required: --email <address>  (or --id <accounts.id>)');
    process.exit(1);
}

const db = new Pool({
    user: process.env.DBUSER, host: process.env.DBHOST, database: process.env.DBNAME,
    password: process.env.DBPASSWORD, port: process.env.DBPORT, ssl: { rejectUnauthorized: false },
});

const fmt = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '—');

try {
    const { rows } = ID
        ? await db.query(
            `SELECT id, username, email, track, isactive, account_type, is_admin_created,
                    grandfathered_at, subscription_status, subscription_expiry_date, created_at
               FROM accounts WHERE id = $1`, [ID])
        : await db.query(
            `SELECT id, username, email, track, isactive, account_type, is_admin_created,
                    grandfathered_at, subscription_status, subscription_expiry_date, created_at
               FROM accounts WHERE LOWER(email) = $1 OR LOWER(username) = $1`, [EMAIL]);

    if (!rows.length) throw new Error(`No account matches ${ID ? `id=${ID}` : EMAIL}`);
    if (rows.length > 1) throw new Error(`${rows.length} accounts match — rerun with --id`);

    const a = rows[0];
    console.log('\nAccount');
    console.log(`  id            ${a.id}`);
    console.log(`  email         ${a.email}`);
    console.log(`  username      ${a.username}`);
    console.log(`  track         ${a.track}`);
    console.log(`  active        ${a.isactive}`);
    console.log(`  type          ${a.account_type || '—'}${a.is_admin_created ? ' (admin-created)' : ''}`);
    console.log(`  grandfathered ${a.grandfathered_at ? fmt(a.grandfathered_at) : 'no'}`);
    console.log(`  status        ${a.subscription_status}`);
    console.log(`  expires       ${fmt(a.subscription_expiry_date)}`);
    console.log(`  signed up     ${fmt(a.created_at)}`);

    if (!APPLY) {
        const base = a.subscription_expiry_date && new Date(a.subscription_expiry_date) > new Date()
            ? new Date(a.subscription_expiry_date) : new Date();
        const preview = new Date(base);
        preview.setMonth(preview.getMonth() + MONTHS);
        console.log(`\nDRY RUN — would grant ${MONTHS} month(s): status→active, expires ${fmt(a.subscription_expiry_date)} → ${fmt(preview)}`);
        console.log('Rerun with --apply to write.\n');
    } else {
        const result = await grantSubscriptionMonths(db, a.id, MONTHS, { reason: REASON, grantedBy: 'cli' });
        console.log(`\nAPPLIED — ${result.months} month(s) granted to ${result.email}`);
        console.log(`  status   ${result.previousStatus} → active`);
        console.log(`  expires  ${fmt(result.previousExpiry)} → ${fmt(result.newExpiry)}`);
        console.log(`  ${result.wasActive ? 'Extended a live paid term.' : 'Started a new term from today.'}\n`);
    }
} catch (err) {
    console.error(`\nFAILED: ${err.message}\n`);
    process.exitCode = 1;
} finally {
    await db.end();
}
