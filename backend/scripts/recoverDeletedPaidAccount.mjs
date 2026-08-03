/**
 * Restore a deleted account that made a real (livemode) payment.
 *
 * ── Why this exists ───────────────────────────────────────────────────────
 * `payment_events.account_id` is ON DELETE SET NULL, so deleting an account
 * leaves its payment behind as an orphan: the money is still on the books but
 * nobody can log in to the access it bought. Everything else about the account
 * is gone — every child table CASCADEs — so this restores the *account and its
 * entitlement*, not its quiz history, which is unrecoverable.
 *
 * The account id is read back out of the payment's own Moyasar metadata
 * (`raw_payload.metadata.account_id`), which survives the delete and is the
 * only durable link between a payment and the account that made it.
 *
 * Usage:
 *   node scripts/recoverDeletedPaidAccount.mjs --event 8 --email x@y.com          # dry run
 *   node scripts/recoverDeletedPaidAccount.mjs --event 8 --email x@y.com --apply  # write
 */
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Pool } from 'pg';
dotenv.config();

const args = process.argv.slice(2);
const arg = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : null;
};
const APPLY = args.includes('--apply');
const EVENT_ID = arg('event');
const EMAIL = (arg('email') || '').toLowerCase().trim();
const TRACK = arg('track') || 'medical';

if (!EVENT_ID || !EMAIL) {
    console.error('Required: --event <payment_events.id> --email <address>');
    process.exit(1);
}

const db = new Pool({
    user: process.env.DBUSER, host: process.env.DBHOST, database: process.env.DBNAME,
    password: process.env.DBPASSWORD, port: process.env.DBPORT, ssl: { rejectUnauthorized: false },
});

// Passwords in this table are stored as-entered and lowercased (a known,
// separately-tracked problem). A restore cannot recover the original, so it
// sets a random temporary one; the owner relays it and the customer replaces
// it via Forgot password, which resolves by email.
const tempPassword = crypto.randomBytes(6).toString('hex');

try {
    const { rows: ev } = await db.query(
        `SELECT id, account_id, gateway_ref, amount_halalas, currency, received_at,
                status, livemode, raw_payload
           FROM payment_events WHERE id = $1`, [EVENT_ID]
    );
    if (!ev.length) throw new Error(`payment_events id=${EVENT_ID} not found`);
    const p = ev[0];

    if (p.status !== 'paid') throw new Error(`event ${EVENT_ID} is status='${p.status}', not 'paid'`);
    if (p.livemode === false) throw new Error(`event ${EVENT_ID} is a TEST payment (livemode=false) — no money moved, nothing to restore`);
    if (p.account_id !== null) throw new Error(`event ${EVENT_ID} is already linked to account_id=${p.account_id} — nothing orphaned`);

    const originalId = p.raw_payload?.metadata?.account_id ?? null;
    // Annual plan: activation grants exactly one year from the payment.
    const expiry = new Date(new Date(p.received_at).getTime());
    expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);

    const { rows: clash } = await db.query(
        `SELECT id, email FROM accounts WHERE lower(username) = $1 OR lower(email) = $1`, [EMAIL]
    );
    if (clash.length) throw new Error(`${EMAIL} already exists as account id=${clash[0].id} — refusing to duplicate`);

    console.log('=== RESTORE PLAN ===');
    console.table([{
        payment_event: p.id,
        gateway_ref: p.gateway_ref,
        paid: `${(p.amount_halalas / 100).toFixed(2)} ${p.currency}`,
        paid_at: p.received_at.toISOString(),
        cardholder: p.raw_payload?.source?.name ?? '(unknown)',
        original_account_id: originalId,
        restore_email: EMAIL,
        track: TRACK,
        subscription: 'active',
        expires: expiry.toISOString(),
    }]);
    console.log('Also: payment_events.account_id will be re-pointed at the new account,');
    console.log('so the ledger attributes this payment to a real subscriber again.\n');

    if (!APPLY) {
        console.log('DRY RUN — nothing written. Re-run with --apply to commit.');
        await db.end();
        process.exit(0);
    }

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const { rows: created } = await client.query(`
            INSERT INTO accounts (
                username, password, email, email_verified, terms_accepted,
                subscription_status, subscription_expiry_date,
                account_type, is_admin_created, track,
                isactive, logged, created_at, updated_at
            ) VALUES ($1, $2, $1, TRUE, TRUE, 'active', $3, 'standard', FALSE, $4,
                      TRUE, FALSE, $5, NOW())
            RETURNING id, email, subscription_status, subscription_expiry_date, track
        `, [EMAIL, tempPassword, expiry.toISOString(), TRACK, p.received_at]);

        const newId = created[0].id;
        await client.query(
            `UPDATE payment_events SET account_id = $1 WHERE id = $2`, [newId, EVENT_ID]
        );
        await client.query('COMMIT');

        console.log('=== RESTORED ===');
        console.table(created);
        console.log(`payment_events.id=${EVENT_ID} re-linked to account_id=${newId}`);
        console.log(`\nTemporary password (relay to the customer, then have them use "Forgot password"):\n    ${tempPassword}`);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
} catch (err) {
    console.error('FAILED:', err.message);
    process.exitCode = 1;
} finally {
    await db.end();
}
