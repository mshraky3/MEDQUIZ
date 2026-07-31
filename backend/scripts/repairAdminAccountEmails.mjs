/**
 * One-off repair for accounts created by /add_account before it was fixed.
 *
 * Two independent defects, two independently scoped updates:
 *
 * 1. MISSING EMAIL — /login looks an account up by username OR email, then
 *    requires the two to match. A row with a NULL email can never sign in, no
 *    matter how correct the password is. Scoped to: email missing AND username
 *    is already an email address. Legacy username-only accounts that carry a
 *    different email are left alone — they log in fine with that email.
 *
 * 2. MISSING PAYWALL EXEMPTION — admin-created accounts are free forever, which
 *    checkSubscriptionAccess() reads off is_admin_created. Rows created by the
 *    admin form carry account_type='admin_created' but were never flagged, so
 *    they would hit the paywall. Scoped to: account_type='admin_created' AND
 *    the flag not already set.
 *
 * Run from backend/:
 *   node scripts/repairAdminAccountEmails.mjs           (dry run)
 *   node scripts/repairAdminAccountEmails.mjs --apply   (write)
 */

import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const db = new pg.Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: { rejectUnauthorized: false },
});

const apply = process.argv.includes('--apply');
const COLUMNS = 'id, username, email, email_verified, is_admin_created, account_type, track';

const repairs = [
    {
        name: 'missing email (cannot log in)',
        where: `
            (email IS NULL OR email = '')
            AND username LIKE '%@%.%'
            AND username NOT LIKE '% %'
        `,
        set: 'email = username, email_verified = TRUE',
    },
    {
        name: 'admin-created but not paywall-exempt',
        where: `
            account_type = 'admin_created'
            AND is_admin_created IS NOT TRUE
        `,
        set: 'is_admin_created = TRUE',
    },
];

for (const { name, where, set } of repairs) {
    console.log(`\n── ${name} ──`);
    const before = await db.query(`SELECT ${COLUMNS} FROM accounts WHERE ${where} ORDER BY id`);
    console.log('rows to repair:', before.rows.length);
    if (before.rows.length) console.table(before.rows);

    if (apply && before.rows.length) {
        const res = await db.query(
            `UPDATE accounts SET ${set} WHERE ${where} RETURNING ${COLUMNS}`
        );
        console.log('repaired:', res.rowCount);
        console.table(res.rows);
    }
}

if (!apply) console.log('\n(dry run — pass --apply to write)');

await db.end();
