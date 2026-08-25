/**
 * Pre-signup/pre-login funnel events.
 *
 * Everything logged-in is already measurable (login_history, page_engagement,
 * quiz sessions). Landing → signup → trial → paywall → subscribe → payment is
 * not: Vercel Analytics events are unauthenticated and can't be joined to
 * `accounts`, `trial_grants`, or `payment_events`. This table is that missing
 * first-party copy — write-mostly, small, and only ever queried by admin
 * tooling (adminMetricsService.funnelSnapshot) or an audit script.
 *
 * The endpoint is necessarily open (a visitor has no session before signing
 * up), so it whitelists event names and rate-limits by IP rather than trusting
 * the client. `recordFunnelEvent` is exported so server-side events — the
 * paywall 402, which is the one event a client could otherwise suppress by
 * just not sending the beacon — can be written directly without a self HTTP
 * call.
 */
import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { funnelSnapshot } from '../services/adminMetricsService.js';
import { logger } from '../utils/observability.js';

const router = express.Router();

/** Every event a client or the server is allowed to record. Anything else is dropped. */
export const FUNNEL_EVENTS = new Set([
    'landing_view',
    'landing_cta_signup_click',
    'signup_view',
    'signup_track_selected',
    'signup_otp_sent',
    'signup_otp_verified',
    'signup_otp_failed',
    'trial_started',
    'paywall_hit',
    'subscribe_view',
    'subscribe_pay_click',
    'payment_success',
    'payment_failed',
]);

const MAX_PROPS_BYTES = 2000;

/**
 * Best-effort insert — callers (client beacon, subscriptionGuard) must never
 * be blocked or broken by a telemetry failure.
 */
export async function recordFunnelEvent(db, { accountId = null, anonId = null, event, props = {} }) {
    if (!FUNNEL_EVENTS.has(event)) return;
    try {
        const safeProps = JSON.stringify(props ?? {}).slice(0, MAX_PROPS_BYTES);
        await db.query(
            `INSERT INTO funnel_events (account_id, anon_id, event, props) VALUES ($1, $2, $3, $4::jsonb)`,
            [accountId, anonId ? String(anonId).slice(0, 64) : null, event, safeProps]
        );
    } catch (err) {
        logger.error('[funnel] insert failed:', err.message);
    }
}

// ── IP rate limit ────────────────────────────────────────────────────────
// In-memory sliding window. Resets on cold start / redeploy — acceptable for
// a best-effort telemetry gate, not a security control. Prevents one client
// from flooding the table; it does not need to be exact.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;
const hits = new Map(); // ip -> { count, windowStart }

function rateLimited(ip) {
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now - entry.windowStart > WINDOW_MS) {
        hits.set(ip, { count: 1, windowStart: now });
        return false;
    }
    entry.count += 1;
    return entry.count > MAX_PER_WINDOW;
}

// Occasional sweep so the map doesn't grow unbounded on a long-lived process.
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
        if (now - entry.windowStart > WINDOW_MS) hits.delete(ip);
    }
}, 5 * 60_000).unref?.();

/**
 * POST /api/funnel   { anon_id, event, props, username?, sessionToken? }
 *
 * Unauthenticated by necessity. If a matching session is presented (the
 * client may not have one yet — that's the whole point of anon_id), the
 * event is attributed to the account too, the same way engagement.js
 * verifies a beacon's claimed identity.
 */
router.post('/', async (req, res) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (rateLimited(ip)) return res.status(204).end();

    const event = req.body?.event;
    if (!FUNNEL_EVENTS.has(event)) return res.status(204).end();

    const anonId = typeof req.body?.anon_id === 'string' ? req.body.anon_id : null;
    const props = (req.body?.props && typeof req.body.props === 'object') ? req.body.props : {};

    let accountId = null;
    const username = req.body?.username;
    const sessionToken = req.headers['authorization']?.startsWith('Bearer ')
        ? req.headers['authorization'].slice(7).trim()
        : req.body?.sessionToken;
    if (username && sessionToken) {
        try {
            const { rows } = await req.db.query(
                'SELECT id, session_token FROM accounts WHERE username = $1', [username]
            );
            if (rows.length && rows[0].session_token === sessionToken) accountId = rows[0].id;
        } catch (_) { /* attribution is best-effort */ }
    }

    await recordFunnelEvent(req.db, { accountId, anonId, event, props });
    res.status(204).end();
});

/**
 * GET /admin/funnel?days=30 — event counts for the Growth panel.
 */
router.get('/admin', adminAuth, async (req, res) => {
    const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
    try {
        const snapshot = await funnelSnapshot(req.db, { days });
        res.json({ success: true, ...snapshot });
    } catch (err) {
        logger.error('[funnel] admin query failed:', err);
        res.status(500).json({ success: false, message: 'Failed to load funnel data' });
    }
});

export default router;
