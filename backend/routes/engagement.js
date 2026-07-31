/**
 * Page engagement — where students actually spend their time.
 *
 * Answers one question: do people use the question bank, the summaries, or the
 * analytics? Quiz counts alone can't tell you that, because reading a summary
 * for twenty minutes produces no rows anywhere.
 *
 * ── Why aggregate, not an event stream ────────────────────────────────────
 * One row per (user, day, section) that is upserted, rather than a row per
 * page view. A month of traffic stays in the low thousands of rows instead of
 * hundreds of thousands, the admin queries stay index-only, and there is no
 * per-visitor browsing history sitting in the database — only "user 12 spent
 * 34 minutes in summaries on the 5th".
 *
 * ── Why the numbers can be trusted ────────────────────────────────────────
 * The client only counts time while the tab is actually visible, and the
 * server clamps each report to SESSION_CAP_SECONDS. Without the clamp, one
 * laptop left open on the summaries page overnight would swamp every real
 * signal in the dataset.
 */
import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { normalizeTrack, TRACK_KEYS, trackLabelAr } from '../config/tracks.js';

const router = express.Router();

/** The parts of the product worth telling apart. */
export const SECTIONS = ['quizzes', 'summaries', 'analytics', 'other'];

/**
 * Most a single report may contribute. The client flushes on navigation, on
 * tab-hide and every couple of minutes, so a legitimate flush is small; a
 * large one means a stalled timer, not real reading.
 */
const SESSION_CAP_SECONDS = 30 * 60;

let _ready = null;
function ensureSchema(db) {
    if (_ready) return _ready;
    _ready = (async () => {
        await db.query(`
            CREATE TABLE IF NOT EXISTS page_engagement (
                id          BIGSERIAL PRIMARY KEY,
                user_id     INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                section     VARCHAR(20) NOT NULL,
                day         DATE NOT NULL,
                seconds     INTEGER NOT NULL DEFAULT 0,
                views       INTEGER NOT NULL DEFAULT 0,
                updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                UNIQUE (user_id, section, day)
            )
        `);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_engagement_day ON page_engagement(day)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_engagement_section_day ON page_engagement(section, day)`);
    })().catch((err) => { _ready = null; throw err; });
    return _ready;
}

/**
 * POST /api/engagement   { section, seconds }
 *
 * Called by the client on navigation and tab-hide. Deliberately forgiving:
 * telemetry must never surface an error to a student mid-quiz, so anything
 * unparseable is dropped silently with a 204.
 */
router.post('/', async (req, res) => {
    // Sent via sendBeacon on unload, which cannot set an Authorization header —
    // so the session comes from the body here.
    const username = req.body?.username;
    const sessionToken = req.headers['authorization']?.startsWith('Bearer ')
        ? req.headers['authorization'].slice(7).trim()
        : req.body?.sessionToken;

    const section = SECTIONS.includes(req.body?.section) ? req.body.section : null;
    const seconds = Math.min(SESSION_CAP_SECONDS, Math.max(0, Math.round(Number(req.body?.seconds) || 0)));

    if (!username || !sessionToken || !section || seconds < 3) {
        // Under 3s isn't reading, it's passing through.
        return res.status(204).end();
    }

    try {
        await ensureSchema(req.db);
        const { rows } = await req.db.query(
            'SELECT id, session_token FROM accounts WHERE username = $1', [username]
        );
        if (!rows.length || rows[0].session_token !== sessionToken) {
            return res.status(204).end();
        }
        // Riyadh day (fixed UTC+3) so "today" matches what the owner sees.
        await req.db.query(`
            INSERT INTO page_engagement (user_id, section, day, seconds, views)
            VALUES ($1, $2, ((NOW() AT TIME ZONE 'UTC') + INTERVAL '3 hours')::date, $3, 1)
            ON CONFLICT (user_id, section, day) DO UPDATE
               SET seconds = page_engagement.seconds + EXCLUDED.seconds,
                   views   = page_engagement.views + 1,
                   updated_at = NOW()
        `, [rows[0].id, section, seconds]);
        res.status(204).end();
    } catch (err) {
        console.error('[engagement] ingest failed:', err.message);
        res.status(204).end(); // never bother the student with telemetry errors
    }
});

/**
 * GET /admin/engagement?days=30
 * What the admin dashboard renders: totals per section, per-track split, and
 * a daily trend.
 */
router.get('/admin', adminAuth, async (req, res) => {
    const days = Math.min(365, Math.max(1, Number(req.query.days) || 30));
    try {
        await ensureSchema(req.db);
        const since = `${days} days`;

        const [totals, byTrack, trend, topUsers] = await Promise.all([
            req.db.query(`
                SELECT section,
                       SUM(seconds)::bigint          AS seconds,
                       SUM(views)::bigint            AS views,
                       COUNT(DISTINCT user_id)::int  AS users
                  FROM page_engagement
                 WHERE day >= CURRENT_DATE - $1::interval
                 GROUP BY section
            `, [since]),
            req.db.query(`
                SELECT COALESCE(a.track, 'medical') AS track, e.section,
                       SUM(e.seconds)::bigint AS seconds
                  FROM page_engagement e
                  JOIN accounts a ON a.id = e.user_id
                 WHERE e.day >= CURRENT_DATE - $1::interval
                 GROUP BY 1, 2
            `, [since]),
            req.db.query(`
                SELECT day, section, SUM(seconds)::bigint AS seconds
                  FROM page_engagement
                 WHERE day >= CURRENT_DATE - $1::interval
                 GROUP BY day, section
                 ORDER BY day
            `, [since]),
            req.db.query(`
                SELECT a.username, a.email, COALESCE(a.track,'medical') AS track,
                       SUM(e.seconds)::bigint AS seconds
                  FROM page_engagement e
                  JOIN accounts a ON a.id = e.user_id
                 WHERE e.day >= CURRENT_DATE - $1::interval
                 GROUP BY a.id, a.username, a.email, a.track
                 ORDER BY seconds DESC
                 LIMIT 10
            `, [since]),
        ]);

        const bySection = SECTIONS.map((s) => {
            const hit = totals.rows.find((r) => r.section === s);
            return {
                section: s,
                seconds: Number(hit?.seconds) || 0,
                views: Number(hit?.views) || 0,
                users: Number(hit?.users) || 0,
            };
        });
        const grandTotal = bySection.reduce((n, s) => n + s.seconds, 0);

        res.json({
            success: true,
            days,
            grandTotalSeconds: grandTotal,
            // Share of total time — the actual answer to "what do they prefer".
            bySection: bySection.map((s) => ({
                ...s,
                sharePct: grandTotal ? Math.round((s.seconds / grandTotal) * 1000) / 10 : 0,
                avgSecondsPerUser: s.users ? Math.round(s.seconds / s.users) : 0,
            })),
            byTrack: TRACK_KEYS.map((t) => ({
                track: t,
                label: trackLabelAr(t),
                sections: SECTIONS.map((s) => ({
                    section: s,
                    seconds: Number(byTrack.rows.find(
                        (r) => normalizeTrack(r.track) === t && r.section === s
                    )?.seconds) || 0,
                })),
            })),
            trend: trend.rows.map((r) => ({
                day: r.day, section: r.section, seconds: Number(r.seconds) || 0,
            })),
            topUsers: topUsers.rows.map((r) => ({
                who: r.email || r.username, track: r.track, seconds: Number(r.seconds) || 0,
            })),
            hasData: grandTotal > 0,
        });
    } catch (err) {
        console.error('[engagement] admin query failed:', err);
        res.status(500).json({ success: false, message: 'Failed to load engagement data' });
    }
});

export default router;
