/**
 * Group subscription routes
 * ------------------------------------------------------------------
 * A group is one payment that buys several accounts. The buyer's own account is
 * seat 1 and is activated by the payment itself; seats 2..N are single-use
 * invite links the buyer shares however they like.
 *
 * Mounted in app.js as:  app.use('/api/groups', attachDb, groupRoutes)
 *
 * PRIVACY RULE, load-bearing: the owner sees WHICH seats are used and WHEN, and
 * never WHO used them. Somebody claiming a seat is telling their friend they are
 * studying for the exam; they are not handing that friend their email address.
 * No response in this file may include a claimer's email, username or id.
 *
 * The seat-claim signup lives in app.js next to the other signup routes
 * (POST /api/signup/group-seat) because it needs the shared account-creation
 * code; only the read/validate endpoints are here.
 */
import express from 'express';
import { PLANS, getCurrency } from '../services/paymentService.js';
import { logger } from '../utils/observability.js';

const router = express.Router();

/** Session guard — mirrors routes/payment.js resolveSession. */
async function resolveSession(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const username = req.query.username || req.body?.username;
    const sessionToken = bearerToken || req.query.sessionToken || req.body?.sessionToken;
    if (!username || !sessionToken) {
        return res.status(401).json({ success: false, message: 'Missing session credentials' });
    }
    try {
        const r = await req.db.query(
            'SELECT id, session_token FROM accounts WHERE username = $1',
            [username]
        );
        if (!r.rows.length || r.rows[0].session_token !== sessionToken) {
            return res.status(401).json({ success: false, message: 'Session invalid or expired' });
        }
        req.accountId = r.rows[0].id;
        next();
    } catch (err) {
        logger.error('[groups] session check failed:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/** Absolute claim URL for a seat token. */
function seatLink(req, token) {
    const base = process.env.PUBLIC_SITE_URL || 'https://www.smle-question-bank.com';
    return `${base}/join/${token}`;
}

/**
 * GET /api/groups/mine
 * Everything the group page needs, in one call, whether or not anything has
 * been bought yet — the page shows the plans and their seat placeholders
 * BEFORE payment, so a buyer can see what they will get.
 */
router.get('/mine', resolveSession, async (req, res) => {
    try {
        const { rows: groups } = await req.db.query(
            `SELECT id, plan_id, seats, months, expires_at, created_at
               FROM subscription_groups
              WHERE owner_account_id = $1
              ORDER BY created_at DESC`,
            [req.accountId]
        );

        // One query for every seat across every one of this owner's groups,
        // not one query per group — an owner with several groups no longer
        // makes the page wait on N sequential round trips.
        let seatsByGroup = new Map();
        if (groups.length > 0) {
            const { rows: allSeats } = await req.db.query(
                // NOTE: claimed_by_account_id is deliberately NOT selected —
                // see the privacy rule at the top of this file.
                `SELECT group_id, seat_index, token, claimed_at,
                        (claimed_by_account_id IS NOT NULL) AS claimed
                   FROM group_seats
                  WHERE group_id = ANY($1::int[])
                  ORDER BY group_id, seat_index`,
                [groups.map((g) => g.id)]
            );
            seatsByGroup = allSeats.reduce((map, s) => {
                if (!map.has(s.group_id)) map.set(s.group_id, []);
                map.get(s.group_id).push(s);
                return map;
            }, new Map());
        }

        const withSeats = groups.map((g) => ({
            id: g.id,
            planId: g.plan_id,
            seats: g.seats,
            months: g.months,
            expiresAt: g.expires_at,
            createdAt: g.created_at,
            expired: new Date(g.expires_at).getTime() <= Date.now(),
            seatList: (seatsByGroup.get(g.id) || []).map((s) => ({
                seatIndex: s.seat_index,
                // Seat 1 is the owner's own account: no link exists for it.
                isYou: s.seat_index === 1,
                claimed: s.claimed,
                claimedAt: s.claimed_at,
                // A used link is dead — don't keep showing it around.
                link: s.token && !s.claimed ? seatLink(req, s.token) : null,
            })),
        }));

        res.json({
            success: true,
            currency: getCurrency(),
            // Nothing renews automatically — stated here so the page cannot
            // forget to say it.
            autoRenew: false,
            plans: Object.values(PLANS).filter((p) => p.kind === 'group'),
            groups: withSeats,
        });
    } catch (err) {
        logger.error('[groups] /mine failed:', err);
        res.status(500).json({ success: false, message: 'Failed to load your groups.' });
    }
});

/**
 * GET /api/groups/seat/:token
 * Public link check, used by the join page before it shows a signup form.
 * Returns no group, owner or claimer detail — only whether this link works.
 */
router.get('/seat/:token', async (req, res) => {
    const token = String(req.params.token || '');
    if (!/^[a-f0-9]{32}$/.test(token)) {
        return res.json({ valid: false, reason: 'malformed' });
    }
    try {
        const { rows } = await req.db.query(
            `SELECT s.claimed_by_account_id, g.expires_at
               FROM group_seats s
               JOIN subscription_groups g ON g.id = s.group_id
              WHERE s.token = $1`,
            [token]
        );
        if (rows.length === 0) {
            return res.json({ valid: false, reason: 'not_found' });
        }
        const seat = rows[0];
        if (seat.claimed_by_account_id != null) {
            return res.json({ valid: false, reason: 'already_claimed' });
        }
        if (new Date(seat.expires_at).getTime() <= Date.now()) {
            return res.json({ valid: false, reason: 'expired' });
        }
        return res.json({ valid: true, expiresAt: seat.expires_at });
    } catch (err) {
        logger.error('[groups] seat check failed:', err);
        res.status(500).json({ valid: false, reason: 'error' });
    }
});

export default router;
