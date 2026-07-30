/**
 * Admin broadcast — send one composed email to every user, safely.
 * ===================================================================
 * WHY THIS EXISTS AND WHY IT LOOKS LIKE THIS
 *
 * The obvious implementation ("SELECT every user, loop, send") breaks three
 * things at once on this stack:
 *
 *   1. VERCEL — serverless functions are killed at the request timeout. A loop
 *      over hundreds of recipients cannot finish inside one invocation, and
 *      whatever it had sent is lost with no record of where it stopped.
 *   2. RESEND — the free plan allows ~100 emails/day and rate-limits at about
 *      2 requests/second. A tight loop trips the rate limiter and the rest of
 *      the batch simply fails.
 *   3. REPUTATION — blasting a domain with a burst of identical mail is the
 *      fastest way to get filed as spam, which is expensive to undo.
 *
 * So sending is modelled as a QUEUE that is drained in small, resumable
 * batches:
 *
 *   - Creating a campaign materialises one row per recipient (status=pending).
 *   - POST /campaigns/:id/batch sends only BATCH_SIZE of them, spaced by
 *     PER_EMAIL_DELAY_MS, then returns. Every call is short enough to finish
 *     well inside a serverless timeout.
 *   - The caller (the admin page, or a cron job) keeps calling /batch until
 *     `done` comes back true. Close the tab and nothing is lost — progress
 *     lives in the database, and pressing start again resumes exactly where it
 *     stopped, because sent rows are never re-selected.
 *   - A rolling 24-hour cap is enforced server-side, so no sequence of clicks
 *     can blow through the Resend daily allowance.
 *
 * Rows are claimed with FOR UPDATE SKIP LOCKED, so two overlapping /batch
 * calls (double-click, two tabs, cron racing the UI) can never send the same
 * person twice.
 *
 * ── Pacing (spread_hours) ─────────────────────────────────────────────────
 * A campaign can be told to spread itself over a window of up to 48 hours.
 * The batch endpoint then refuses to run ahead of schedule: it works out how
 * many recipients *should* have been mailed by now (elapsed / window × total)
 * and returns `waiting: true` with `nextEligibleAt` when that quota is already
 * met. This is what keeps a large send inside a small daily allowance and
 * spreads it across days instead of emptying the queue in one burst.
 *
 * spread_hours = 0 means "as fast as the daily cap and throttle allow".
 */

import express from 'express';
import crypto from 'crypto';
import { adminAuth } from '../middleware/adminAuth.js';
import { sendMail } from '../services/mailer.js';
import { TRACK_KEYS, DEFAULT_TRACK, normalizeTrack } from '../config/tracks.js';

const router = express.Router();

// ─── Throttle settings ─────────────────────────────────────────────────────
// Deliberately conservative. PER_EMAIL_DELAY_MS keeps us under Resend's ~2/s
// limit; BATCH_SIZE * (delay + send latency) must stay well under the Vercel
// function timeout. 5 * ~1.1s ≈ 6s, which is safe on a 10s limit.
const BATCH_SIZE = Number(process.env.BROADCAST_BATCH_SIZE || 5);
const PER_EMAIL_DELAY_MS = Number(process.env.BROADCAST_DELAY_MS || 600);
const DAILY_CAP = Number(process.env.BROADCAST_DAILY_CAP || 90); // Resend free = 100/day

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Schema (created once, lazily) ─────────────────────────────────────────
let _ready = null;
function ensureBroadcastSchema(db) {
    if (_ready) return _ready;
    _ready = (async () => {
        await db.query(`
            CREATE TABLE IF NOT EXISTS broadcast_campaigns (
                id SERIAL PRIMARY KEY,
                subject TEXT NOT NULL,
                body_html TEXT NOT NULL,
                audience VARCHAR(30) NOT NULL DEFAULT 'all',
                status VARCHAR(20) NOT NULL DEFAULT 'draft',
                created_at TIMESTAMP DEFAULT NOW(),
                started_at TIMESTAMP,
                finished_at TIMESTAMP
            )
        `);
        // Spread window, in hours. 0 = send as fast as the cap allows.
        await db.query(`ALTER TABLE broadcast_campaigns ADD COLUMN IF NOT EXISTS spread_hours INTEGER NOT NULL DEFAULT 0`);
        await db.query(`
            CREATE TABLE IF NOT EXISTS broadcast_recipients (
                id SERIAL PRIMARY KEY,
                campaign_id INTEGER NOT NULL REFERENCES broadcast_campaigns(id) ON DELETE CASCADE,
                account_id INTEGER,
                email VARCHAR(255) NOT NULL,
                username VARCHAR(255),
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                error TEXT,
                sent_at TIMESTAMP,
                claimed_at TIMESTAMP,
                UNIQUE(campaign_id, email)
            )
        `);
        // Older deployments of this table predate claimed_at.
        await db.query(`ALTER TABLE broadcast_recipients ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_bcast_recip_pending ON broadcast_recipients(campaign_id, status)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_bcast_recip_sent_at ON broadcast_recipients(sent_at) WHERE status = 'sent'`);
        // Opt-out flag. Bulk mail without a working unsubscribe is how a domain
        // gets classified as spam — and this account already had deliverability
        // trouble once.
        await db.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS email_opt_out BOOLEAN DEFAULT FALSE`);
    })().catch((err) => { _ready = null; throw err; });
    return _ready;
}

// ─── Audience definitions ──────────────────────────────────────────────────
// Base rules apply to every audience: a real address, an active account, and
// not opted out. Anything else is a bug waiting to email the wrong people.
const BASE_WHERE = `
    email IS NOT NULL
    AND email <> ''
    AND POSITION('@' IN email) > 1
    AND COALESCE(isactive, TRUE) = TRUE
    AND COALESCE(email_opt_out, FALSE) = FALSE
`;

/** Which optional subscription columns actually exist on this database. */
async function subscriptionColumns(db) {
    const { rows } = await db.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'accounts' AND column_name IN ('subscription_status', 'grandfathered_at')
    `);
    const have = new Set(rows.map((r) => r.column_name));
    return { status: have.has('subscription_status'), grandfathered: have.has('grandfathered_at') };
}

async function audienceWhere(db, audience) {
    const cols = await subscriptionColumns(db);
    if (audience === 'all') return BASE_WHERE;
    // Study-track audiences — the platform serves two student populations and
    // most announcements are only relevant to one of them.
    if (audience.startsWith('track:')) {
        const track = normalizeTrack(audience.slice('track:'.length));
        return `${BASE_WHERE} AND COALESCE(track, '${DEFAULT_TRACK}') = '${track}'`;
    }
    if (!cols.status) throw new Error('This database has no subscription_status column — only the "all" audience is available.');
    const legacy = cols.grandfathered
        ? `(grandfathered_at IS NOT NULL OR subscription_status = 'grandfathered')`
        : `(subscription_status = 'grandfathered')`;
    const notLegacy = cols.grandfathered ? `grandfathered_at IS NULL` : `TRUE`;
    switch (audience) {
        case 'paid':   return `${BASE_WHERE} AND ${notLegacy} AND subscription_status = 'active'`;
        case 'trial':  return `${BASE_WHERE} AND ${notLegacy} AND subscription_status = 'trial'`;
        case 'legacy': return `${BASE_WHERE} AND ${legacy}`;
        case 'free':   return `${BASE_WHERE} AND NOT ${legacy} AND COALESCE(subscription_status, '') NOT IN ('active', 'trial')`;
        default: throw new Error(`Unknown audience "${audience}".`);
    }
}

const AUDIENCES = [
    'all', 'paid', 'trial', 'legacy', 'free',
    ...TRACK_KEYS.map((t) => `track:${t}`),
];

// ─── Unsubscribe token ─────────────────────────────────────────────────────
function unsubSecret() {
    return process.env.UNSUBSCRIBE_SECRET || process.env.ADMIN_KEY || 'sqb-dev-unsub-secret';
}
export function unsubToken(accountId) {
    return crypto.createHmac('sha256', unsubSecret()).update(`unsub:${accountId}`).digest('hex').slice(0, 32);
}
function unsubUrl(accountId) {
    const base = (process.env.PUBLIC_APP_URL || process.env.APP_URL || '').replace(/\/$/, '');
    return `${base}/api/unsubscribe?u=${accountId}&t=${unsubToken(accountId)}`;
}

/** Wrap the admin's HTML in an RTL shell with the required unsubscribe footer. */
function renderEmail({ bodyHtml, accountId, username }) {
    const greeting = username ? `<p style="margin:0 0 14px">مرحباً ${escapeHtml(String(username).split('@')[0])}،</p>` : '';
    const unsub = accountId ? unsubUrl(accountId) : '';
    return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef2fb">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2fb;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif">
<tr><td style="background:#1d4ed8;padding:18px 22px"><span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:.5px">SQB</span></td></tr>
<tr><td style="padding:24px 22px;color:#0f1e3d;font-size:15px;line-height:1.8;text-align:right">
${greeting}${bodyHtml}
</td></tr>
<tr><td style="padding:16px 22px;background:#f8fafc;color:#94a3b8;font-size:11.5px;line-height:1.7;text-align:right">
SQB — بنك أسئلة SMLE${unsub ? `<br><a href="${unsub}" style="color:#64748b">إلغاء الاشتراك من رسائل SQB</a>` : ''}
</td></tr>
</table></td></tr></table></body></html>`;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Strip tags for the plain-text alternative — improves deliverability. */
function htmlToText(html) {
    return String(html)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
        .replace(/<li>/gi, '• ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/** Emails actually sent in the last rolling 24 hours, across all campaigns. */
async function sentLast24h(db) {
    const { rows } = await db.query(
        `SELECT COUNT(*)::int AS n FROM broadcast_recipients WHERE status = 'sent' AND sent_at > NOW() - INTERVAL '24 hours'`
    );
    return rows[0]?.n || 0;
}

/**
 * `pending` deliberately counts rows stuck in 'sending' too. A serverless
 * function killed mid-batch leaves rows claimed but unsent; if those were not
 * counted as outstanding, the campaign would report itself finished while real
 * people never received the email.
 */
async function progressFor(db, campaignId) {
    const { rows } = await db.query(`
        SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'sent')::int AS sent,
            COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
            COUNT(*) FILTER (WHERE status IN ('pending', 'sending'))::int AS pending
        FROM broadcast_recipients WHERE campaign_id = $1
    `, [campaignId]);
    return rows[0] || { total: 0, sent: 0, failed: 0, pending: 0 };
}

// ═══════════════════════════════════════════════════════════════════════════
// Routes
// ═══════════════════════════════════════════════════════════════════════════

/** Recipient counts per audience, plus today's remaining quota. */
router.get('/audiences', adminAuth, async (req, res) => {
    const db = req.db;
    try {
        await ensureBroadcastSchema(db);
        const out = {};
        for (const a of AUDIENCES) {
            try {
                const where = await audienceWhere(db, a);
                const { rows } = await db.query(`SELECT COUNT(DISTINCT LOWER(email))::int AS n FROM accounts WHERE ${where}`);
                out[a] = rows[0].n;
            } catch { out[a] = null; } // audience unavailable on this schema
        }
        const used = await sentLast24h(db);
        res.json({ success: true, audiences: out, quota: { used, cap: DAILY_CAP, remaining: Math.max(0, DAILY_CAP - used) }, batchSize: BATCH_SIZE, delayMs: PER_EMAIL_DELAY_MS });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/** Create a campaign and freeze its recipient list. Does NOT send anything. */
router.post('/campaigns', adminAuth, async (req, res) => {
    const db = req.db;
    const { subject, bodyHtml, audience = 'all' } = req.body || {};
    // Up to 2 days, as requested — long enough to trickle a big list past a
    // small daily allowance without ever bursting.
    const spreadHours = Math.max(0, Math.min(48, Number(req.body?.spreadHours) || 0));
    if (!subject || !String(subject).trim()) return res.status(400).json({ success: false, message: 'Subject is required.' });
    if (!bodyHtml || !String(bodyHtml).trim()) return res.status(400).json({ success: false, message: 'Body is required.' });
    if (!AUDIENCES.includes(audience)) return res.status(400).json({ success: false, message: 'Unknown audience.' });
    try {
        await ensureBroadcastSchema(db);
        const where = await audienceWhere(db, audience);
        const { rows: [campaign] } = await db.query(
            `INSERT INTO broadcast_campaigns (subject, body_html, audience, spread_hours)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [String(subject).trim(), String(bodyHtml), audience, spreadHours]
        );
        // DISTINCT ON collapses duplicate addresses so nobody is mailed twice.
        const { rowCount } = await db.query(`
            INSERT INTO broadcast_recipients (campaign_id, account_id, email, username)
            SELECT $1, id, LOWER(email), username FROM (
                SELECT DISTINCT ON (LOWER(email)) id, email, username
                FROM accounts WHERE ${where} ORDER BY LOWER(email), id
            ) t
            ON CONFLICT (campaign_id, email) DO NOTHING
        `, [campaign.id]);
        res.json({ success: true, campaign, recipients: rowCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/** List campaigns with progress. */
router.get('/campaigns', adminAuth, async (req, res) => {
    const db = req.db;
    try {
        await ensureBroadcastSchema(db);
        const { rows } = await db.query(`
            SELECT c.*,
                   COUNT(r.id)::int AS total,
                   COUNT(r.id) FILTER (WHERE r.status = 'sent')::int AS sent,
                   COUNT(r.id) FILTER (WHERE r.status = 'failed')::int AS failed,
                   COUNT(r.id) FILTER (WHERE r.status = 'pending')::int AS pending
            FROM broadcast_campaigns c
            LEFT JOIN broadcast_recipients r ON r.campaign_id = c.id
            GROUP BY c.id ORDER BY c.id DESC LIMIT 50
        `);
        res.json({ success: true, campaigns: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/** One campaign, with progress and the most recent failures. */
router.get('/campaigns/:id', adminAuth, async (req, res) => {
    const db = req.db;
    try {
        await ensureBroadcastSchema(db);
        const { rows: [campaign] } = await db.query(`SELECT * FROM broadcast_campaigns WHERE id = $1`, [req.params.id]);
        if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found.' });
        const progress = await progressFor(db, campaign.id);
        const { rows: failures } = await db.query(
            `SELECT email, error FROM broadcast_recipients WHERE campaign_id = $1 AND status = 'failed' ORDER BY id DESC LIMIT 20`,
            [campaign.id]
        );
        const used = await sentLast24h(db);
        res.json({ success: true, campaign, progress, failures, quota: { used, cap: DAILY_CAP, remaining: Math.max(0, DAILY_CAP - used) } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/** Send a single preview to an explicitly supplied address. */
router.post('/campaigns/:id/test', adminAuth, async (req, res) => {
    const db = req.db;
    const to = String(req.body?.to || '').trim();
    if (!to || !to.includes('@')) return res.status(400).json({ success: false, message: 'A valid test address is required.' });
    try {
        await ensureBroadcastSchema(db);
        const { rows: [c] } = await db.query(`SELECT * FROM broadcast_campaigns WHERE id = $1`, [req.params.id]);
        if (!c) return res.status(404).json({ success: false, message: 'Campaign not found.' });
        const html = renderEmail({ bodyHtml: c.body_html, accountId: null, username: null });
        await sendMail({ name: 'SQB', to, subject: `[TEST] ${c.subject}`, html, text: htmlToText(c.body_html) });
        res.json({ success: true, message: `Test sent to ${to}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * Status transitions. Sending only ever happens via /batch.
 * NOTE: declared as three explicit routes on purpose — Express 5 dropped the
 * `:action(start|pause|cancel)` inline-pattern syntax that would have worked
 * on Express 4, and a bare `:action` wildcard here would shadow /test and
 * /batch depending on declaration order.
 */
async function setStatus(req, res, next) {
    const db = req.db;
    try {
        await ensureBroadcastSchema(db);
        const { rows: [c] } = await db.query(
            `UPDATE broadcast_campaigns
                SET status = $2,
                    started_at = COALESCE(started_at, CASE WHEN $2 = 'sending' THEN NOW() END),
                    finished_at = CASE WHEN $2 = 'cancelled' THEN NOW() ELSE finished_at END
              WHERE id = $1 RETURNING *`,
            [req.params.id, next]
        );
        if (!c) return res.status(404).json({ success: false, message: 'Campaign not found.' });
        res.json({ success: true, campaign: c });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

router.post('/campaigns/:id/start', adminAuth, (req, res) => setStatus(req, res, 'sending'));
router.post('/campaigns/:id/pause', adminAuth, (req, res) => setStatus(req, res, 'paused'));
router.post('/campaigns/:id/cancel', adminAuth, (req, res) => setStatus(req, res, 'cancelled'));

/**
 * How many recipients this campaign is allowed to have sent by now.
 *
 * A campaign with `spread_hours = N` should be linearly through its list after
 * N hours. If it is already at or ahead of that line, the caller waits; the
 * returned `nextEligibleAt` says when the next recipient comes due, so the
 * admin page (or a scheduler) knows exactly when to call again.
 */
async function pacingFor(db, campaign) {
    const spread = Number(campaign.spread_hours) || 0;
    if (spread <= 0) return { waiting: false, dueNow: BATCH_SIZE };

    const { rows: [t] } = await db.query(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'sent')::int AS sent
           FROM broadcast_recipients WHERE campaign_id = $1`,
        [campaign.id]
    );
    const total = t.total || 0;
    const sent = t.sent || 0;
    if (total === 0) return { waiting: false, dueNow: BATCH_SIZE };

    const startedAt = campaign.started_at ? new Date(campaign.started_at) : new Date();
    const windowMs = spread * 3600 * 1000;
    const elapsedMs = Date.now() - startedAt.getTime();

    // Past the window: everything left is due.
    if (elapsedMs >= windowMs) return { waiting: false, dueNow: BATCH_SIZE };

    const shouldHaveSent = Math.floor((elapsedMs / windowMs) * total);
    const dueNow = shouldHaveSent - sent;
    if (dueNow > 0) return { waiting: false, dueNow };

    // Nothing due yet — work out when recipient number (sent + 1) comes up.
    const msPerRecipient = windowMs / total;
    const nextAtMs = startedAt.getTime() + Math.ceil((sent + 1) * msPerRecipient);
    return {
        waiting: true,
        dueNow: 0,
        nextEligibleAt: new Date(nextAtMs).toISOString(),
        reason: `Paced over ${spread}h — ${sent}/${total} sent. Next batch is due at `
            + `${new Date(nextAtMs).toISOString().replace('T', ' ').slice(0, 16)} UTC.`,
    };
}

/**
 * Claim and send up to `take` recipients for one campaign.
 *
 * Extracted so the manual /batch route and the unattended cron drain share
 * exactly one implementation — two copies of "who have we already mailed"
 * logic is how people get emailed twice.
 *
 * Rows are claimed with FOR UPDATE SKIP LOCKED before any mail is sent, so
 * overlapping callers can never pick the same person. Returns
 * `{ drained: true }` when the queue is empty and the campaign was closed.
 */
async function sendOneBatch(db, c, take) {
    const client = await db.connect();
    let claimed = [];
    try {
        await client.query('BEGIN');
        // Also reclaim anything left in 'sending' for over 5 minutes — that is
        // a batch whose function was killed before it could finish.
        const { rows } = await client.query(`
            SELECT id, account_id, email, username FROM broadcast_recipients
             WHERE campaign_id = $1
               AND (status = 'pending'
                    OR (status = 'sending' AND claimed_at < NOW() - INTERVAL '5 minutes'))
             ORDER BY id LIMIT $2
             FOR UPDATE SKIP LOCKED
        `, [c.id, take]);
        claimed = rows;
        if (claimed.length) {
            await client.query(
                `UPDATE broadcast_recipients SET status = 'sending', claimed_at = NOW() WHERE id = ANY($1::int[])`,
                [claimed.map((r) => r.id)]
            );
        }
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }

    if (!claimed.length) {
        await db.query(`UPDATE broadcast_campaigns SET status = 'done', finished_at = NOW() WHERE id = $1`, [c.id]);
        return { sent: 0, failed: 0, drained: true };
    }

    let sent = 0, failed = 0;
    for (let i = 0; i < claimed.length; i++) {
        const r = claimed[i];
        try {
            await sendMail({
                name: 'SQB',
                to: r.email,
                subject: c.subject,
                html: renderEmail({ bodyHtml: c.body_html, accountId: r.account_id, username: r.username }),
                text: htmlToText(c.body_html),
            });
            await db.query(`UPDATE broadcast_recipients SET status = 'sent', sent_at = NOW(), error = NULL WHERE id = $1`, [r.id]);
            sent++;
        } catch (err) {
            await db.query(`UPDATE broadcast_recipients SET status = 'failed', error = $2 WHERE id = $1`, [r.id, String(err.message).slice(0, 500)]);
            failed++;
        }
        // Space the sends out; no delay after the last one.
        if (i < claimed.length - 1) await sleep(PER_EMAIL_DELAY_MS);
    }
    return { sent, failed, drained: false };
}

/**
 * Send ONE throttled batch. Call repeatedly until `done` is true.
 * This is the only route that actually sends to real users.
 */
router.post('/campaigns/:id/batch', adminAuth, async (req, res) => {
    const db = req.db;
    try {
        await ensureBroadcastSchema(db);
        const { rows: [c] } = await db.query(`SELECT * FROM broadcast_campaigns WHERE id = $1`, [req.params.id]);
        if (!c) return res.status(404).json({ success: false, message: 'Campaign not found.' });
        if (c.status !== 'sending') {
            return res.json({ success: true, done: true, stopped: true, reason: `Campaign is ${c.status}.`, progress: await progressFor(db, c.id) });
        }

        // ── Pacing gate ──
        // With a spread window set, only send what the schedule says is due by
        // now. Without this the whole queue drains as fast as the caller polls,
        // which is exactly the burst the daily cap and the domain reputation
        // are trying to avoid.
        const pace = await pacingFor(db, c);
        if (pace.waiting) {
            return res.json({
                success: true, done: false, waiting: true,
                reason: pace.reason,
                nextEligibleAt: pace.nextEligibleAt,
                progress: await progressFor(db, c.id),
            });
        }

        // Rolling 24h cap — hard stop before we touch the mailer.
        const used = await sentLast24h(db);
        const remainingQuota = DAILY_CAP - used;
        if (remainingQuota <= 0) {
            return res.json({
                success: true, done: false, quotaExhausted: true,
                reason: `Daily cap reached (${used}/${DAILY_CAP}). Resume in a few hours.`,
                progress: await progressFor(db, c.id), quota: { used, cap: DAILY_CAP, remaining: 0 },
            });
        }

        // Never exceed the batch size, the remaining daily quota, or what the
        // spread schedule says is due right now.
        const take = Math.max(1, Math.min(BATCH_SIZE, remainingQuota, pace.dueNow || BATCH_SIZE));

        const { sent, failed, drained } = await sendOneBatch(db, c, take);
        if (drained) {
            return res.json({ success: true, done: true, progress: await progressFor(db, c.id) });
        }

        const progress = await progressFor(db, c.id);
        const done = progress.pending === 0;
        if (done) await db.query(`UPDATE broadcast_campaigns SET status = 'done', finished_at = NOW() WHERE id = $1`, [c.id]);
        const used2 = await sentLast24h(db);
        res.json({
            success: true, done, batchSent: sent, batchFailed: failed, progress,
            quota: { used: used2, cap: DAILY_CAP, remaining: Math.max(0, DAILY_CAP - used2) },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * Drain every campaign that is mid-send by one batch.
 *
 * This is what lets a paced campaign finish on its own: the admin page only
 * drives batches while its tab is open, and a two-day spread obviously
 * outlives that. Exported (rather than mounted here) so it can be wired into
 * whatever scheduler is available — Vercel Hobby allows only two cron entries
 * and both are already in use, so it is currently called from the existing
 * daily cron, and can additionally be triggered by any external scheduler.
 *
 * Respects the same pacing gate and daily cap as the manual route: campaigns
 * that are not due yet are skipped, not rushed.
 */
export async function drainSendingCampaigns(db, { maxCampaigns = 5 } = {}) {
    await ensureBroadcastSchema(db);
    const { rows: campaigns } = await db.query(
        `SELECT * FROM broadcast_campaigns WHERE status = 'sending' ORDER BY id LIMIT $1`,
        [maxCampaigns]
    );

    const out = [];
    for (const c of campaigns) {
        const used = await sentLast24h(db);
        if (DAILY_CAP - used <= 0) {
            out.push({ campaign: c.id, skipped: 'daily_cap' });
            continue;
        }
        const pace = await pacingFor(db, c);
        if (pace.waiting) {
            out.push({ campaign: c.id, skipped: 'not_due', nextEligibleAt: pace.nextEligibleAt });
            continue;
        }
        const result = await sendOneBatch(db, c, Math.min(BATCH_SIZE, DAILY_CAP - used, pace.dueNow || BATCH_SIZE));
        out.push({ campaign: c.id, ...result });
    }
    return out;
}

export default router;
