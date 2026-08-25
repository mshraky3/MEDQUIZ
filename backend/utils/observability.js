/**
 * Shared logging, transient-fault classification, and the "no silent 500"
 * guarantee.
 *
 * WHY THIS MODULE EXISTS
 *
 * A survey of the backend found 141 places that answer a request with a 500 and
 * exactly 3 that told anyone about it. The other 138 were invisible: the handler
 * caught its own error and responded directly, so it never reached the global
 * error middleware where notifyBackendError lives. The only reason any of them
 * ever surfaced was the browser reporting the failure back through
 * /api/error-report — which can only ever see the opaque client-facing message
 * ("Failed to record quiz session"), never the cause.
 *
 * Rewriting 138 response bodies to fix that would risk changing what clients
 * receive. Instead `alertOn5xx` below hooks the RESPONSE: whatever a handler
 * does, if the status is 5xx the alert fires. That covers every existing site,
 * every route file, and every handler written in future, without touching a
 * single response shape.
 *
 * WHY THIS DOES NOT REINTRODUCE THE ALERT FLOOD
 *
 * The flood that prompted the last cleanup was ~105 alerts in ten days of which
 * two were real, and the bulk were Postgres idle-connection kills — a fact of
 * running on a serverless pool against Neon, not a bug anyone can fix. Widening
 * alerting therefore has to come with the classification, not without it:
 *
 *   1. Transient connection faults are logged and NEVER mailed (the same
 *      isTransientConnectionError treatment the pool listener and
 *      reportBootstrapFailure already use).
 *   2. errorNotificationService's throttle is DB-backed, so it survives cold
 *      starts and spans instances: one mail per distinct error key per hour,
 *      with a global ceiling of 12/hour across all keys.
 *   3. One alert per request, even if several layers try.
 *
 * The result is that a broken deploy produces a handful of mails naming the
 * distinct faults, not one per request.
 */

import { AsyncLocalStorage } from 'node:async_hooks';

// ── Per-request context ─────────────────────────────────────────────────────
// Lets logger.error attach the real Error (with its Postgres fields) to the
// request that is currently running, so the 5xx interceptor can include it
// without every handler having to pass it along by hand.
const requestStore = new AsyncLocalStorage();

/** Express middleware. Mount this before anything that can fail. */
export function requestContext(req, res, next) {
    requestStore.run({ error: null, alerted: false }, () => next());
}

/** The context for the in-flight request, or null outside one (jobs, scripts). */
export function currentRequestContext() {
    return requestStore.getStore() || null;
}

// ── Transient faults ────────────────────────────────────────────────────────
// Connection-level failures that the pool recovers from on its own. Logged,
// never mailed: they are noise, they are not actionable, and they were the
// majority of the last alert flood.
export const TRANSIENT_CONNECTION_CODES = new Set([
    'ECONNRESET',   // socket killed under us (instance freeze, pooler recycle)
    'ETIMEDOUT',    // handshake never completed
    'EPIPE',        // wrote to a socket the other end had already closed
    'EAI_AGAIN',    // transient DNS failure
    '08001', '08003', '08006', // Postgres connection-exception class
    '57P01', '57P03',          // admin shutdown / cannot connect now (Neon resuming)
]);

export function isTransientConnectionError(err) {
    if (!err) return false;
    if (err.code && TRANSIENT_CONNECTION_CODES.has(err.code)) return true;
    // pg-pool's own timeout paths build plain Errors with no .code at all.
    return /Connection terminated|timeout exceeded when trying to connect|Client has encountered a connection error|terminating connection|Connection ended unexpectedly/i
        .test(String(err.message || ''));
}

// ── Logger ──────────────────────────────────────────────────────────────────
const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';
/** Exported because app.js gates CORS, test-address rejection and stack-trace
 *  leakage on it, and there should be one answer to "are we in production". */
export const isProduction = process.env.NODE_ENV === 'production';

/** Postgres error fields that identify a fault and are absent from .stack. */
const PG_FIELDS = ['code', 'detail', 'constraint', 'column', 'table', 'schema', 'routine', 'severity', 'hint', 'where'];

export function pgErrorFields(error) {
    const out = {};
    if (!error) return out;
    for (const key of PG_FIELDS) {
        if (error[key] != null) out[key] = error[key];
    }
    return out;
}

export const logger = {
    debug: (message, data = null) => {
        if (LOG_LEVEL === 'DEBUG' && !isProduction) {
            console.log(`🔍 [DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    },
    info: (message, data = null) => {
        if (['DEBUG', 'INFO'].includes(LOG_LEVEL)) {
            console.log(`ℹ️  [INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    },
    warn: (message, data = null) => {
        if (['DEBUG', 'INFO', 'WARN'].includes(LOG_LEVEL)) {
            console.warn(`⚠️  [WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
        }
    },
    error: (message, error = null) => {
        if (!error) {
            console.error(`❌ [ERROR] ${message}`);
            return;
        }
        // Remember it for the 5xx interceptor, so the alert can carry the real
        // cause instead of just the handler's client-facing message.
        const ctx = requestStore.getStore();
        if (ctx && !ctx.error && error instanceof Error) ctx.error = error;

        // A node-postgres error carries the only fields that actually identify
        // the fault — code, constraint, detail, column, table, routine — as own
        // properties, and NONE of them appear in .stack. Logging .stack alone
        // turned a check-constraint violation into a bare "new row for relation
        // ... violates ..." with no constraint name, and "value too long for
        // type character varying(50)" into no column name at all.
        const pg = pgErrorFields(error);
        console.error(
            `❌ [ERROR] ${message}`,
            error.stack || error,
            Object.keys(pg).length ? `\n   ↳ postgres: ${JSON.stringify(pg)}` : ''
        );
    },
};

// ── The "no silent 500" interceptor ─────────────────────────────────────────

/** Response bodies can carry secrets; keep only what identifies the failure. */
function safeBodyPreview(body) {
    try {
        if (body == null) return null;
        const text = typeof body === 'string' ? body : JSON.stringify(body);
        return text.length > 400 ? `${text.slice(0, 400)}…` : text;
    } catch {
        return null;
    }
}

/**
 * Mount early, before any route. Wraps the response so that ANY 5xx — from a
 * handler's own res.status(500), from a route file, from Express itself —
 * produces exactly one alert, with the request context and, when a handler
 * logged it, the underlying Error.
 *
 * `notify` is injected rather than imported so this module stays usable from
 * scripts and tests that have no mailer.
 */
export function alertOn5xx(notify) {
    return function alertOn5xxMiddleware(req, res, next) {
        const fire = () => {
            const ctx = requestStore.getStore();
            if (ctx?.alerted) return;              // one alert per request
            if (res.statusCode < 500) return;
            if (ctx) ctx.alerted = true;

            const err = ctx?.error
                || Object.assign(new Error(`${req.method} ${req.originalUrl} responded ${res.statusCode}`), {
                    statusCode: res.statusCode,
                });

            // Transient connection faults recover on their own and were the
            // bulk of the last alert flood. Logged, not mailed.
            if (isTransientConnectionError(err)) {
                logger.warn('5xx from a transient connection fault (not mailed)', {
                    route: req.originalUrl, method: req.method, status: res.statusCode,
                    error: err.message, code: err.code,
                });
                return;
            }

            const pg = pgErrorFields(err);
            logger.error(`Responded ${res.statusCode} for ${req.method} ${req.originalUrl}`, err);

            Promise.resolve(notify(err, req, {
                middleware: 'alertOn5xx',
                route: req.originalUrl,
                method: req.method,
                status: res.statusCode,
                responseBody: res.locals?.__alertBody ?? null,
                ...(Object.keys(pg).length ? { postgres: pg } : {}),
            })).catch((notifyErr) => {
                console.error('[alertOn5xx] notification failed:', notifyErr?.message);
            });
        };

        // Capture the body a handler sends so the alert can quote it, then fire
        // once the response is actually on the wire. 'finish' is used rather
        // than wrapping every send path, so nothing can slip past.
        const captureBody = (method) => {
            const original = res[method].bind(res);
            res[method] = (body, ...rest) => {
                if (res.statusCode >= 500) res.locals.__alertBody = safeBodyPreview(body);
                return original(body, ...rest);
            };
        };
        captureBody('json');
        captureBody('send');

        res.on('finish', fire);
        next();
    };
}

/** Marks the request as already alerted, so a later layer does not repeat it. */
export function markAlerted() {
    const ctx = requestStore.getStore();
    if (ctx) ctx.alerted = true;
}
