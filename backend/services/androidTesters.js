/**
 * Android tester offer (OFF BY DEFAULT): the first 15 students who join the Play
 * closed-test list get 1 month free when they sign in from the Android app. The number of
 * seats is never shown to students (owner, 2026-11-22: say "first few users").
 *
 * Nothing here runs unless ANDROID_TESTERS_OFFER_ENABLED is exactly "true". The
 * table comes from migrations/002_android_testers.sql (written, not run).
 *
 * Rules:
 *   - join: one spot per account and per Google address (canonical form), first
 *     come first served, cap ANDROID_TESTERS_CAP. The count and the insert happen
 *     in one transaction behind a transaction-scoped advisory lock, so two
 *     simultaneous joins cannot both take the last spot (the UNIQUE constraints
 *     are the second line of defence).
 *   - redeem: only an account in android_testers, only from the Android app
 *     (platform marker), once per account, only an account that has never paid and
 *     holds no live subscription or grant. Same audit table as admin grants
 *     (payment_events, status 'granted'), so no money query counts it as revenue.
 *     The platform marker is only a request, not proof of an install (same
 *     limit as services/appFreeMonth.js): the real limit is one per account and
 *     15 in total.
 *   - owner addresses (env OWNER_TESTER_EMAILS, comma list) are never stored and
 *     never count toward the cap: they are only added, first, to the export.
 */
import { computeNewExpiry, getCurrency } from './paymentService.js';
import { APP_PLATFORM_MARKER } from './appFreeMonth.js';

export const ANDROID_TESTERS_CAP = 15;
export const ANDROID_TESTER_MONTHS = 1;
export const ANDROID_TESTER_EVENT = 'android_tester_offer';
// Arbitrary constant for pg_advisory_xact_lock: serialises joins only.
const JOIN_LOCK_KEY = 7340015;

export function isAndroidTestersOfferEnabled() {
    return process.env.ANDROID_TESTERS_OFFER_ENABLED === 'true';
}

const EMAIL_RE = /^[a-z0-9][a-z0-9._%+'-]*@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/** Trimmed, lowercased address, or null when it is not a plausible e-mail. */
export function cleanPlayEmail(raw) {
    if (typeof raw !== 'string') return null; // objects, numbers, arrays: a clean refusal, never a throw
    const v = raw.trim().toLowerCase();
    if (v.length < 6 || v.length > 254 || !EMAIL_RE.test(v)) return null;
    const [local, domain] = v.split('@');
    if (local.includes('..') || local.endsWith('.')) return null;
    if (!/\.[a-z]{2,}$/.test(domain)) return null; // a real TLD of 2+ letters
    return v;
}

/** One key per real mailbox: gmail ignores dots and +tags, googlemail is gmail. */
export function emailKey(clean) {
    const [local, domain] = clean.split('@');
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
        return `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
    }
    return clean;
}

/** Owner addresses from OWNER_TESTER_EMAILS (comma list); invalid and duplicate entries dropped. */
export function ownerTesterEmails(env = process.env) {
    const seen = new Set();
    const out = [];
    for (const part of String(env.OWNER_TESTER_EMAILS || '').split(/[,;\s]+/)) {
        const clean = cleanPlayEmail(part);
        if (!clean) continue;
        const key = emailKey(clean);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(clean);
    }
    return out;
}

/**
 * Pure rule check shared by join and redeem. `history` is the account's
 * payment_events rows reduced to { event_type, status }.
 */
export function evaluateTesterOffer(account, history = [], nowMs = Date.now()) {
    if (!account) return { eligible: false, reason: 'account_not_found' };
    if (!account.email_verified) return { eligible: false, reason: 'email_not_verified' };
    if (history.some((h) => h.event_type === ANDROID_TESTER_EVENT)) return { eligible: false, reason: 'already_redeemed' };
    if (history.some((h) => h.status === 'paid')) return { eligible: false, reason: 'has_paid' };
    if (account.grandfathered_at) return { eligible: false, reason: 'grandfathered' };
    if (account.is_admin_created) return { eligible: false, reason: 'already_granted' };
    const live = account.subscription_status === 'active'
        && account.subscription_expiry_date
        && new Date(account.subscription_expiry_date).getTime() > nowMs;
    if (live) return { eligible: false, reason: 'active_subscription' };
    return { eligible: true, reason: 'eligible' };
}

const ACCOUNT_SQL = `SELECT id, email_verified, subscription_status, subscription_expiry_date,
                            is_admin_created, grandfathered_at
                       FROM accounts WHERE id = $1`;
const HISTORY_SQL = `SELECT event_type, status FROM payment_events
                      WHERE account_id = $1 AND (event_type = $2 OR status = 'paid')`;

async function rollbackQuietly(client) {
    try { await client.query('ROLLBACK'); } catch { /* connection already gone */ }
}

/** What the card shows: spots left, whether this account joined, whether it may. */
export async function getOfferStatus(db, accountId) {
    const { rows: [count] } = await db.query('SELECT COUNT(*)::int AS taken FROM android_testers');
    const { rows: [mine] } = await db.query(
        'SELECT play_email, redeemed_at FROM android_testers WHERE account_id = $1', [accountId]);
    const taken = count?.taken ?? 0;
    const status = {
        cap: ANDROID_TESTERS_CAP,
        months: ANDROID_TESTER_MONTHS,
        taken,
        left: Math.max(0, ANDROID_TESTERS_CAP - taken),
        joined: !!mine,
        playEmail: mine ? mine.play_email : null,
        redeemed: !!(mine && mine.redeemed_at),
        canJoin: false,
        reason: mine ? 'already_joined' : 'eligible',
    };
    if (!mine) {
        const { rows: [account] } = await db.query(ACCOUNT_SQL, [accountId]);
        const { rows: history } = await db.query(HISTORY_SQL, [accountId, ANDROID_TESTER_EVENT]);
        const verdict = evaluateTesterOffer(account, history);
        status.canJoin = verdict.eligible && status.left > 0;
        status.reason = !verdict.eligible ? verdict.reason : (status.left > 0 ? 'eligible' : 'full');
    }
    return status;
}

/**
 * Take a spot. Never throws for a refusal: returns { joined: false, reason }.
 * reasons: invalid_email, account_not_found + the evaluateTesterOffer reasons,
 * already_joined, email_taken, full.
 */
export async function joinAndroidTesters(db, accountId, rawEmail) {
    const playEmail = cleanPlayEmail(rawEmail);
    if (!playEmail) return { joined: false, reason: 'invalid_email' };
    const key = emailKey(playEmail);

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query('SELECT pg_advisory_xact_lock($1)', [JOIN_LOCK_KEY]);

        const { rows: [account] } = await client.query(`${ACCOUNT_SQL} FOR UPDATE`, [accountId]);
        const { rows: [mine] } = await client.query(
            'SELECT play_email FROM android_testers WHERE account_id = $1', [accountId]);
        if (mine) {
            await client.query('ROLLBACK');
            return { joined: false, reason: 'already_joined', playEmail: mine.play_email };
        }
        const { rows: history } = await client.query(HISTORY_SQL, [accountId, ANDROID_TESTER_EVENT]);
        const verdict = evaluateTesterOffer(account, history);
        if (!verdict.eligible) {
            await client.query('ROLLBACK');
            return { joined: false, reason: verdict.reason };
        }
        const { rows: [dup] } = await client.query('SELECT 1 AS x FROM android_testers WHERE email_key = $1', [key]);
        if (dup) {
            await client.query('ROLLBACK');
            return { joined: false, reason: 'email_taken' };
        }
        const { rows: [count] } = await client.query('SELECT COUNT(*)::int AS taken FROM android_testers');
        const taken = count?.taken ?? 0;
        if (taken >= ANDROID_TESTERS_CAP) {
            await client.query('ROLLBACK');
            return { joined: false, reason: 'full' };
        }
        await client.query(
            'INSERT INTO android_testers (account_id, play_email, email_key) VALUES ($1, $2, $3)',
            [accountId, playEmail, key]
        );
        await client.query('COMMIT');
        return { joined: true, reason: 'joined', playEmail, left: ANDROID_TESTERS_CAP - (taken + 1) };
    } catch (err) {
        await rollbackQuietly(client);
        if (err && err.code === '23505') return { joined: false, reason: 'email_taken' };
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Give the 3 months after a sign-in from the Android app. Never throws for an
 * ineligible account: returns { granted: false, reason } so the app stays silent.
 */
export async function redeemTesterOffer(db, accountId, { platform } = {}) {
    if (platform !== APP_PLATFORM_MARKER) return { granted: false, reason: 'not_from_app' };

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const { rows: [account] } = await client.query(`${ACCOUNT_SQL} FOR UPDATE`, [accountId]);
        const { rows: [tester] } = await client.query(
            'SELECT redeemed_at FROM android_testers WHERE account_id = $1 FOR UPDATE', [accountId]);
        if (!tester) {
            await client.query('ROLLBACK');
            return { granted: false, reason: 'not_a_tester' };
        }
        if (tester.redeemed_at) {
            await client.query('ROLLBACK');
            return { granted: false, reason: 'already_redeemed' };
        }
        const { rows: history } = await client.query(HISTORY_SQL, [accountId, ANDROID_TESTER_EVENT]);
        const verdict = evaluateTesterOffer(account, history);
        if (!verdict.eligible) {
            await client.query('ROLLBACK');
            return { granted: false, reason: verdict.reason };
        }

        const newExpiry = computeNewExpiry(null, { months: ANDROID_TESTER_MONTHS });
        await client.query(
            `UPDATE accounts
                SET subscription_status = 'active',
                    subscription_expiry_date = $1,
                    is_admin_created = TRUE,
                    renewal_reminder_stage = NULL
              WHERE id = $2`,
            [newExpiry, accountId]
        );
        await client.query(
            `INSERT INTO payment_events
                (account_id, event_type, gateway, gateway_ref, amount_halalas, currency, status, raw_payload)
             VALUES ($1, $2, 'app', $3, 0, $4, 'granted', $5)`,
            [
                accountId,
                ANDROID_TESTER_EVENT,
                `${ANDROID_TESTER_EVENT}_${accountId}`,
                getCurrency(),
                JSON.stringify({ months: ANDROID_TESTER_MONTHS, platform, new_expiry: newExpiry }),
            ]
        );
        await client.query('UPDATE android_testers SET redeemed_at = NOW() WHERE account_id = $1', [accountId]);
        await client.query('COMMIT');
        return { granted: true, reason: 'granted', months: ANDROID_TESTER_MONTHS, expiresAt: newExpiry };
    } catch (err) {
        await rollbackQuietly(client);
        throw err;
    } finally {
        client.release();
    }
}

/**
 * The list for the Play Console: the owner's own addresses first (outside the cap,
 * never stored), then the joined students in join order. An owner address that a
 * student also typed appears once, as the owner row.
 */
export async function buildTesterExport(db, env = process.env) {
    const owners = ownerTesterEmails(env);
    const ownerKeys = new Set(owners.map(emailKey));
    const { rows } = await db.query(
        'SELECT play_email, joined_at, redeemed_at FROM android_testers ORDER BY joined_at ASC, id ASC');
    const list = owners.map((email) => ({ email, source: 'owner', joinedAt: null, redeemed: false }));
    for (const r of rows) {
        if (ownerKeys.has(emailKey(r.play_email))) continue;
        list.push({
            email: r.play_email,
            source: 'student',
            joinedAt: r.joined_at ? new Date(r.joined_at).toISOString() : null,
            redeemed: !!r.redeemed_at,
        });
    }
    return list;
}

export function exportToCsv(list) {
    const lines = ['email,source,joined_at,redeemed'];
    for (const r of list) lines.push([r.email, r.source, r.joinedAt || '', r.redeemed ? 'yes' : 'no'].join(','));
    return lines.join('\n') + '\n';
}
