import { logger } from '../utils/observability.js';
/**
 * Postgres-backed rate limiting.
 * ------------------------------------------------------------------
 * Every limiter this app had before lived in an in-process Map: reset on
 * every cold start, and invisible to every OTHER warm instance running the
 * same route at the same time. On Vercel, where a burst of traffic is
 * routinely spread across several concurrent instances, that is close to no
 * protection at all — an attacker's requests fan out across instances, each
 * with its own innocent, empty counter. A shared table is the fix: every
 * instance sees the same count.
 *
 * Fixed-window counting via one atomic UPSERT per request. Not a sliding
 * window (which would need to store individual hit timestamps, not just a
 * count) — a fixed window is simpler, cheaper, and "somewhat bursty right at
 * the window boundary" is an acceptable trade for a login/contact-form
 * guard, which is not defending anything latency- or precision-sensitive.
 */
let _rateLimitSchemaReady = null;
/**
 * Exported because errorNotificationService's alert throttle stores its own
 * counters in this same table. That throttle FAILS OPEN when the table is
 * missing, so leaving its creation to whichever rate-limited route happened to
 * be hit first meant the very first error after a fresh deploy could bypass
 * throttling entirely. The throttle now ensures it explicitly at boot.
 */
export function ensureRateLimitTable(db) {
    if (_rateLimitSchemaReady) return _rateLimitSchemaReady;
    _rateLimitSchemaReady = (async () => {
        await db.query(`
            CREATE TABLE IF NOT EXISTS rate_limit_hits (
                bucket VARCHAR(64) NOT NULL,
                identifier VARCHAR(120) NOT NULL,
                window_start TIMESTAMP NOT NULL,
                count INTEGER NOT NULL DEFAULT 1,
                PRIMARY KEY (bucket, identifier, window_start)
            )
        `);
    })().catch((err) => {
        _rateLimitSchemaReady = null; // allow a retry on a later invocation
        throw err;
    });
    return _rateLimitSchemaReady;
}

/** Same x-forwarded-for parsing /login already uses, so both agree on "the caller's IP" behind Vercel's proxy. */
function clientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || req.headers['x-real-ip']
        || req.connection?.remoteAddress
        || req.socket?.remoteAddress
        || 'unknown';
}

/**
 * @param {import('pg').Pool} db - the shared pool. Passed explicitly rather
 *   than read from req.db because most of the routes this guards (/login,
 *   /api/contact, /api/suggestions, /api/auth/*) are defined directly in
 *   app.js against its module-level `db`, not behind the small number of
 *   sub-routers that get req.db injected.
 * @param {string} bucket - short, stable name for this route's limit (e.g. 'login').
 * @param {object} opts
 * @param {number} opts.windowMs - fixed window size, default 60s.
 * @param {number} opts.max - requests allowed per identifier per window.
 * @param {(req) => string} [opts.keyFn] - defaults to client IP.
 */
export function rateLimit(db, bucket, { windowMs = 60_000, max = 10, keyFn = clientIp } = {}) {
    return async (req, res, next) => {
        try {
            await ensureRateLimitTable(db);

            const identifier = String(keyFn(req) || 'unknown').slice(0, 120);
            const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);

            const result = await db.query(
                `INSERT INTO rate_limit_hits (bucket, identifier, window_start, count)
                 VALUES ($1, $2, $3, 1)
                 ON CONFLICT (bucket, identifier, window_start)
                 DO UPDATE SET count = rate_limit_hits.count + 1
                 RETURNING count`,
                [bucket, identifier, windowStart]
            );
            const count = result.rows[0]?.count ?? 1;

            // Opportunistic cleanup — no dedicated cron slot to spend on this
            // (Vercel's Hobby plan caps the project at two, both already
            // spoken for), so instead of a scheduled sweep, roughly 1 request
            // in 200 across ALL rate-limited routes does the housekeeping.
            // Fire-and-forget: a missed sweep just means slightly more rows
            // until the next one hits, never a correctness problem.
            if (Math.random() < 0.005) {
                db.query(`DELETE FROM rate_limit_hits WHERE window_start < NOW() - INTERVAL '1 hour'`)
                    .catch(() => { /* next sweep will catch it */ });
            }

            if (count > max) {
                res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
                return res.status(429).json({ message: 'Too many requests. Please try again shortly.' });
            }
            next();
        } catch (err) {
            // Fail OPEN: a database hiccup in the rate limiter must never be
            // the reason a real user can't log in or send a message. Some of
            // the routes this guards have their own secondary defense
            // underneath too (send-otp's own per-email throttle, for one).
            logger.error(`[rateLimit:${bucket}] check failed, allowing request:`, err.message);
            next();
        }
    };
}
