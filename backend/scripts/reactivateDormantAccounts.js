/**
 * One-off reactivation for accounts that went quiet months ago.
 *
 * Why a script and not a job: the daily inactivity email fires on a 2–3 day
 * window (routes/email-campaigns.js), so anyone who drifted past that window
 * fell through it and has heard nothing since. This is the backfill for that
 * gap — sent once, measured, and then left alone. The `reactivation_email_sent_at`
 * stamp is what makes "once" true regardless of how many times this is run.
 *
 * WHO IT TARGETS
 *   - last login older than --days (default 30)
 *   - still has unspent free questions (free_questions_used < the allowance)
 *   - verified email, active account, not unsubscribed
 *   - never paid, not grandfathered, not admin-created
 *   - not already stamped by this campaign
 *
 * WHO IT DOES NOT, and why: accounts that used all 40 belong to
 * runTrialEndedJob in services/lifecycleJobs.js, which mails them the
 * "here is what your 40 questions showed" message. Mailing both would land two
 * emails about the same subject on the same person. Pass --include-exhausted to
 * pick up only the ones that job never reached (trial_ended_email_sent_at IS
 * NULL) — they get the same message, since they too left questions unanswered
 * under the old accounting.
 *
 * Usage (from backend/, reads .env like app.js):
 *   node scripts/reactivateDormantAccounts.js              # dry run: counts + CSV, sends nothing
 *   node scripts/reactivateDormantAccounts.js --preview    # send ONE sample to the owner
 *   node scripts/reactivateDormantAccounts.js --apply      # send for real, stamp each row
 *   node scripts/reactivateDormantAccounts.js --report     # who came back after the send
 *
 * Flags: --days N, --limit N, --include-exhausted
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { sendReactivationEmail } from '../services/userEmailService.js';
import { FREE_QUESTION_ALLOWANCE } from '../services/paymentService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const OWNER_EMAIL = 'alshraky3@gmail.com';

const arg = (name, fallback) => {
    const i = process.argv.indexOf(name);
    if (i === -1) return fallback;
    const value = Number(process.argv[i + 1]);
    return Number.isFinite(value) ? value : fallback;
};

const MODE = process.argv.includes('--apply') ? 'apply'
    : process.argv.includes('--preview') ? 'preview'
        : process.argv.includes('--report') ? 'report'
            : 'dry-run';
const DAYS = arg('--days', 30);
const LIMIT = arg('--limit', 500);
const INCLUDE_EXHAUSTED = process.argv.includes('--include-exhausted');

// Politeness gap between sends. The provider is not the constraint at this
// volume; a burst of 50 identical messages in one second is what looks like
// one, to a spam filter.
const SEND_GAP_MS = 1200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const pool = new pg.Pool(
    process.env.DATABASE_URL
        ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
        : {
            user: process.env.DBUSER,
            host: process.env.DBHOST,
            database: process.env.DBNAME,
            password: process.env.DBPASSWORD,
            port: process.env.DBPORT || 5432,
            ssl: { rejectUnauthorized: false },
            max: 3,
        }
);

/**
 * The stamp column, checked rather than assumed.
 *
 * A dry run must not write anything — including schema — so the column is only
 * created on --apply. Every other mode asks information_schema and adapts,
 * which is also the habit this codebase already needs: the column types
 * declared in app.js do not always match what is actually in the database.
 */
const STAMP = 'reactivation_email_sent_at';

async function hasStampColumn(db) {
    const { rows } = await db.query(
        `SELECT 1 FROM information_schema.columns
          WHERE table_name = 'accounts' AND column_name = $1`,
        [STAMP]
    );
    return rows.length > 0;
}

const targetSql = (stamped) => `
    SELECT a.id, a.username, a.email, a.track, a.preferred_lang,
           a.free_questions_used, a.logged_date, a.created_at,
           GREATEST(0, $2::int - COALESCE(a.free_questions_used, 0)) AS remaining,
           GREATEST(0, (EXTRACT(EPOCH FROM NOW() - a.logged_date) / 2592000)::int) AS months_away
      FROM accounts a
     WHERE ${stamped ? `a.${STAMP} IS NULL` : 'TRUE'}
       AND a.logged_date < NOW() - ($1::int * INTERVAL '1 day')
       AND a.email IS NOT NULL
       AND a.email_verified = TRUE
       AND a.isactive = TRUE
       AND COALESCE(a.email_opt_out, FALSE) = FALSE
       AND a.is_admin_created = FALSE
       AND a.grandfathered_at IS NULL
       AND NOT (a.subscription_status = 'active' AND a.subscription_expiry_date > NOW())
       AND NOT EXISTS (
             SELECT 1 FROM payment_events pe
              WHERE pe.account_id = a.id AND pe.status = 'paid'
                AND pe.livemode IS DISTINCT FROM FALSE)
       AND (
             COALESCE(a.free_questions_used, 0) < $2::int
             OR ($3::boolean AND a.trial_ended_email_sent_at IS NULL)
           )
     ORDER BY a.logged_date DESC
     LIMIT $4
`;

function writeCsv(rows) {
    const dir = path.join(__dirname, '..', 'exports');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `reactivation-targets-${new Date().toISOString().slice(0, 10)}.csv`);
    const header = 'id,username,email,track,lang,free_questions_used,remaining,last_login,created_at';
    const body = rows.map((r) => [
        r.id, r.username, r.email, r.track, r.preferred_lang || 'ar',
        r.free_questions_used ?? 0, r.remaining,
        r.logged_date ? new Date(r.logged_date).toISOString().slice(0, 10) : '',
        r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : '',
    ].join(',')).join('\n');
    fs.writeFileSync(file, `${header}\n${body}\n`, 'utf8');
    return file;
}

async function report(db) {
    if (!(await hasStampColumn(db))) {
        console.log('\nNothing sent yet — the campaign has never run, so there is no stamp column.');
        return;
    }
    const { rows } = await db.query(`
        SELECT COUNT(*)::int AS sent,
               COUNT(*) FILTER (WHERE logged_date > reactivation_email_sent_at)::int AS returned,
               COUNT(*) FILTER (WHERE subscription_status = 'active'
                                  AND subscription_expiry_date > NOW())::int AS now_subscribed,
               COUNT(*) FILTER (WHERE email_opt_out)::int AS unsubscribed
          FROM accounts
         WHERE reactivation_email_sent_at IS NOT NULL
    `);
    const r = rows[0];
    if (!r.sent) {
        console.log('\nNothing sent yet — no account carries a reactivation stamp.');
        return;
    }
    const pct = (n) => `${((n / r.sent) * 100).toFixed(1)}%`;
    console.log(`\nReactivation campaign — ${r.sent} email(s) sent`);
    console.log(`  logged in afterwards : ${r.returned}  (${pct(r.returned)})`);
    console.log(`  subscribed since     : ${r.now_subscribed}  (${pct(r.now_subscribed)})`);
    console.log(`  unsubscribed         : ${r.unsubscribed}  (${pct(r.unsubscribed)})`);
    console.log('\nA login is the honest number here. Subscriptions are not attributed —');
    console.log('this only says the account subscribed at some point after the email.');
}

async function main() {
    const db = await pool.connect();
    try {
        if (MODE === 'report') {
            await report(db);
            return;
        }

        if (MODE === 'apply' && !(await hasStampColumn(db))) {
            await db.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS ${STAMP} TIMESTAMPTZ`);
            console.log(`Added accounts.${STAMP}.`);
        }
        const stamped = await hasStampColumn(db);
        if (!stamped) {
            console.log(`Note: accounts.${STAMP} does not exist yet, so nobody can have been mailed.`
                + ' The count below is the full eligible set.');
        }

        const { rows } = await db.query(
            targetSql(stamped),
            [DAYS, FREE_QUESTION_ALLOWANCE, INCLUDE_EXHAUSTED, LIMIT]
        );

        console.log(`\nMode: ${MODE}   dormant for: ${DAYS}+ days   allowance: ${FREE_QUESTION_ALLOWANCE}`);
        console.log(`Targets: ${rows.length}`);
        if (!rows.length) {
            console.log('Nobody matches. Nothing to do.');
            return;
        }

        const byLang = {};
        const byTrack = {};
        let unspent = 0;
        for (const r of rows) {
            byLang[r.preferred_lang || 'ar'] = (byLang[r.preferred_lang || 'ar'] || 0) + 1;
            byTrack[r.track] = (byTrack[r.track] || 0) + 1;
            unspent += Number(r.remaining) || 0;
        }
        console.log(`  by language : ${JSON.stringify(byLang)}`);
        console.log(`  by track    : ${JSON.stringify(byTrack)}`);
        console.log(`  unspent free questions across all of them: ${unspent}`);

        const csv = writeCsv(rows);
        console.log(`  target list written to ${csv}`);

        if (MODE === 'dry-run') {
            console.log('\nFirst 10 targets:');
            for (const r of rows.slice(0, 10)) {
                console.log(`   #${r.id} ${String(r.email).padEnd(34)} ${r.track.padEnd(8)}`
                    + ` used=${r.free_questions_used ?? 0} left=${r.remaining}`
                    + ` last login ${r.logged_date ? new Date(r.logged_date).toISOString().slice(0, 10) : '—'}`);
            }
            console.log('\nDry run — nothing sent, nothing stamped. Re-run with --apply to send.');
            return;
        }

        if (MODE === 'preview') {
            // One sample to the owner, using a real target's shape so the
            // numbers in it are the numbers a student would see. Nobody is
            // stamped, so the real send is unaffected.
            const sample = rows[0];
            await sendReactivationEmail(OWNER_EMAIL, 'Preview', sample.track, {
                remaining: Number(sample.remaining) || 1,
                monthsAway: Number(sample.months_away) || 0,
                lang: sample.preferred_lang,
            });
            console.log(`\nPreview sent to ${OWNER_EMAIL} (shaped like account #${sample.id}). Nothing stamped.`);
            return;
        }

        let sent = 0;
        const errors = [];
        for (const r of rows) {
            try {
                await sendReactivationEmail(
                    r.email,
                    String(r.username).split('@')[0],
                    r.track,
                    {
                        remaining: Number(r.remaining) || 0,
                        monthsAway: Number(r.months_away) || 0,
                        lang: r.preferred_lang,
                        accountId: r.id,
                    }
                );
                // Stamp immediately after the send, not in a batch at the end:
                // a crash halfway through must not re-mail the first half.
                await db.query(
                    `UPDATE accounts SET reactivation_email_sent_at = NOW() WHERE id = $1`,
                    [r.id]
                );
                sent += 1;
                if (sent % 10 === 0) console.log(`   ${sent}/${rows.length}`);
                await sleep(SEND_GAP_MS);
            } catch (err) {
                errors.push({ id: r.id, error: err.message });
                console.warn(`   ! #${r.id} ${err.message}`);
            }
        }

        console.log(`\nSent ${sent}, failed ${errors.length}.`);
        console.log('Wait a week, then: node scripts/reactivateDormantAccounts.js --report');
    } finally {
        db.release();
        await pool.end();
    }
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
