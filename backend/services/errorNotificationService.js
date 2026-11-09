/**
 * Error Notification Service
 * Sends beautifully formatted HTML emails for critical errors
 */

import { sendMail } from './mailer.js';
import { developerEmails } from '../config/recipients.js';
import { renderOwnerMail, ADMIN_LINKS } from './ownerMail.js';
import { ensureRateLimitTable } from '../middleware/rateLimit.js';


// Rate limiting configuration
const RATE_LIMIT = {
  maxEmailsPerHour: 20,
  cooldownMinutes: 5
};

// Track sent emails for rate limiting.
//
// IN-PROCESS ONLY, and that is the whole problem this module used to have: on
// Vercel every cold start is a fresh process with an empty tracker, and a burst
// of traffic is spread across several concurrent instances that never see each
// other's counters. A limit of "20 per hour" was therefore really "20 per hour
// per instance per cold start", which in practice meant no limit at all — one
// database wobble produced 20+ near-identical CRITICALs against the ONE 100/day
// Resend allowance shared by every project.
//
// Kept as the fast in-memory first pass, but the authoritative check is now
// hasRecentlyAlerted() below, which is backed by a shared Postgres table and so
// survives cold starts and spans instances.
const emailTracker = {
  hourlyCount: 0,
  hourlyResetTime: Date.now() + 3600000,
  errorCooldowns: new Map(), // errorKey -> lastSentTime
  errorFrequency: new Map()  // errorKey -> count in last hour
};

// ── shared, cold-start-proof alert throttle ─────────────────────────────────
// The pool is injected by app.js at boot (configureAlertThrottle) rather than
// imported, because this module is also pulled in by scripts and jobs that have
// no pool of their own — and an alert must never fail just because the throttle
// store is absent. When _db is null every check below fails open, i.e. exactly
// the old in-memory-only behaviour.
let _db = null;

/**
 * Give the notifier a database to record alert sends in. Optional.
 *
 * Also ensures the table it counts in exists. That creation used to belong
 * solely to middleware/rateLimit.js and happened lazily, on the first request
 * to a rate-limited route — so on a fresh database the throttle's very first
 * query could fail, and a failed throttle query means an unthrottled alert.
 * The throttle owns its own dependency now.
 */
export function configureAlertThrottle(db) {
  _db = db;
  ensureRateLimitTable(db).catch((err) => {
    console.error('[ErrorNotification] Could not ensure the throttle table; alerts run in degraded mode:', err.message);
  });
}

export const ALERT_BUCKET = 'alert_email';
// One email per distinct error per hour. Repeats inside the window are counted
// (so the "×11" badge stays truthful) but do not send.
const ALERT_WINDOW_MS = 60 * 60 * 1000;
// Circuit breaker across ALL error keys. A broken deploy produces many distinct
// errors at once; without a global ceiling, "one per key per hour" still lets a
// hundred keys fill a hundred inboxes' worth of quota in a minute.
const ALERT_GLOBAL_MAX_PER_HOUR = 12;

// ── Degraded mode ───────────────────────────────────────────────────────────
// The shared throttle above lives in Postgres, so when Postgres is the thing
// that is broken the throttle query fails too — and it fails OPEN. That was a
// defensible default when only 3 places in the backend could alert. It is not
// any more: alertOn5xx now reports every 5xx in the app, and a database outage
// makes EVERY request a 5xx at the same moment as it makes the throttle
// unavailable. Failing fully open there is precisely the flood scenario.
//
// So while the shared store is unreachable, fall back to a deliberately tight
// per-process budget. An outage still gets through — the first few alerts are
// the ones that matter and they say the same thing — but it cannot empty the
// day's mail allowance before anyone reads the first one.
const DEGRADED_MAX_PER_HOUR = 3;
const degraded = { count: 0, resetAt: 0 };

function allowWhileDegraded() {
    const now = Date.now();
    if (now > degraded.resetAt) {
        degraded.count = 0;
        degraded.resetAt = now + ALERT_WINDOW_MS;
    }
    degraded.count += 1;
    if (degraded.count > DEGRADED_MAX_PER_HOUR) {
        console.error(
            `[ErrorNotification] Throttle store unreachable AND the degraded budget is spent ` +
            `(${degraded.count}/${DEGRADED_MAX_PER_HOUR} this hour). Suppressing. Check the logs — ` +
            `the database is very likely down, which is both why errors are firing and why this cannot be throttled properly.`
        );
        return false;
    }
    return true;
}

/**
 * Atomically record an alert attempt and report whether it should be sent.
 *
 * Reuses the rate_limit_hits table that middleware/rateLimit.js already creates
 * and sweeps — same fixed-window UPSERT, so there is no second schema to keep
 * alive and the existing hourly cleanup covers these rows too.
 *
 * Returns { send, repeatCount }. When the store is missing or the query fails
 * it does not fail fully open any more — it falls back to allowWhileDegraded()
 * above, which still lets the first few through (losing an alert entirely is
 * worse than a duplicate) but caps them, because this path is exercised
 * precisely when the database is the thing that is broken and therefore when
 * every other request is failing too.
 */
async function claimAlertSlot(errorKey) {
  if (!_db) return { send: allowWhileDegraded(), repeatCount: 1 };
  try {
    const windowStart = new Date(Math.floor(Date.now() / ALERT_WINDOW_MS) * ALERT_WINDOW_MS);
    const identifier = String(errorKey).slice(0, 120);

    const perError = await _db.query(
      `INSERT INTO rate_limit_hits (bucket, identifier, window_start, count)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (bucket, identifier, window_start)
       DO UPDATE SET count = rate_limit_hits.count + 1
       RETURNING count`,
      [ALERT_BUCKET, identifier, windowStart]
    );
    const repeatCount = perError.rows[0]?.count ?? 1;
    if (repeatCount > 1) {
      console.log(`[ErrorNotification] Suppressed repeat #${repeatCount} this hour for: ${identifier}`);
      return { send: false, repeatCount };
    }

    // First time this hour for this key — does the global budget allow it?
    const global = await _db.query(
      `INSERT INTO rate_limit_hits (bucket, identifier, window_start, count)
       VALUES ($1, '__global__', $2, 1)
       ON CONFLICT (bucket, identifier, window_start)
       DO UPDATE SET count = rate_limit_hits.count + 1
       RETURNING count`,
      [ALERT_BUCKET, windowStart]
    );
    const globalCount = global.rows[0]?.count ?? 1;
    if (globalCount > ALERT_GLOBAL_MAX_PER_HOUR) {
      console.error(
        `[ErrorNotification] GLOBAL alert ceiling hit (${globalCount}/${ALERT_GLOBAL_MAX_PER_HOUR} this hour). ` +
        `Suppressing "${identifier}" and everything after it until the window rolls. ` +
        `Check Vercel logs — something is failing broadly.`
      );
      return { send: false, repeatCount };
    }

    return { send: true, repeatCount };
  } catch (err) {
    // Was an unconditional `send: true`. See DEGRADED_MAX_PER_HOUR above: the
    // store being unreachable is correlated with everything else failing, so
    // "fail open" here means "mail every 5xx of an outage".
    const send = allowWhileDegraded();
    console.error(
      `[ErrorNotification] Alert throttle unavailable (${err.message}); ` +
      `degraded budget ${degraded.count}/${DEGRADED_MAX_PER_HOUR} this hour, ${send ? 'sending' : 'SUPPRESSING'}.`
    );
    return { send, repeatCount: 1 };
  }
}

// Severity levels
const SEVERITY = {
  CRITICAL: { level: 'CRITICAL', color: '#dc2626', emoji: '🚨', bgGradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' },
  HIGH: { level: 'HIGH', color: '#ea580c', emoji: '⚠️', bgGradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' },
  MEDIUM: { level: 'MEDIUM', color: '#ca8a04', emoji: '⚡', bgGradient: 'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)' },
  LOW: { level: 'LOW', color: '#2563eb', emoji: 'ℹ️', bgGradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
};

/**
 * Classify error severity based on status code and error type
 */
function classifyErrorSeverity(errorData) {
  const { statusCode, errorType, message } = errorData;

  // Database errors are always critical
  if (errorType?.includes('DATABASE') || message?.toLowerCase().includes('database')) {
    return SEVERITY.CRITICAL;
  }

  // Connection failures are critical
  if (errorType?.includes('CONNECTION') || message?.toLowerCase().includes('connection')) {
    return SEVERITY.CRITICAL;
  }

  // 500+ errors are critical
  if (statusCode >= 500) {
    return SEVERITY.CRITICAL;
  }

  // Authentication errors are high
  if (statusCode === 401 || statusCode === 403) {
    return SEVERITY.HIGH;
  }

  // Unknown errors are high
  if (errorType?.includes('UNKNOWN') || !errorType) {
    return SEVERITY.HIGH;
  }

  // 4xx errors are medium
  if (statusCode >= 400 && statusCode < 500) {
    return SEVERITY.MEDIUM;
  }

  return SEVERITY.LOW;
}

/**
 * Generate unique error key for rate limiting
 */
function getErrorKey(errorData) {
  return `${errorData.errorType || 'UNKNOWN'}_${errorData.endpoint || 'unknown'}_${errorData.statusCode || 0}`;
}

/**
 * Check if we can send an email (rate limiting)
 */
function canSendEmail(errorKey) {
  const now = Date.now();

  // Reset hourly counter if needed
  if (now > emailTracker.hourlyResetTime) {
    emailTracker.hourlyCount = 0;
    emailTracker.hourlyResetTime = now + 3600000;
    emailTracker.errorFrequency.clear();
  }

  // Check hourly limit
  if (emailTracker.hourlyCount >= RATE_LIMIT.maxEmailsPerHour) {
    console.log('[ErrorNotification] Hourly email limit reached');
    return false;
  }

  // Check cooldown for same error type
  const lastSent = emailTracker.errorCooldowns.get(errorKey);
  if (lastSent && (now - lastSent) < (RATE_LIMIT.cooldownMinutes * 60 * 1000)) {
    console.log(`[ErrorNotification] Cooldown active for error: ${errorKey}`);
    return false;
  }

  return true;
}

/**
 * Update rate limiting trackers
 */
function updateTrackers(errorKey) {
  const now = Date.now();
  emailTracker.hourlyCount++;
  emailTracker.errorCooldowns.set(errorKey, now);

  // Update frequency
  const currentFreq = emailTracker.errorFrequency.get(errorKey) || 0;
  emailTracker.errorFrequency.set(errorKey, currentFreq + 1);
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Generate unique error ID
 */
function generateErrorId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${timestamp}-${random}`;
}

/**
 * Get status code badge color
 */
function getStatusColor(statusCode) {
  if (statusCode >= 500) return '#dc2626';
  if (statusCode >= 400) return '#ca8a04';
  if (statusCode >= 300) return '#2563eb';
  return '#16a34a';
}

/**
 * Escape HTML to prevent XSS in emails
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format JSON for display
 */
function formatJson(data) {
  if (!data) return 'N/A';
  try {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    return escapeHtml(JSON.stringify(data, null, 2));
  } catch {
    return escapeHtml(String(data));
  }
}

// The public site, used for the "Open Page" / "Admin Panel" links when APP_URL
// is not configured. This used to fall back to http://localhost:5173, so every
// alert sent from a deployment without APP_URL linked to the reader's own
// machine. Same constant userEmailService.js and telegramClient.js use.
const PRODUCTION_SITE_URL = 'https://www.smle-question-bank.com';

const LOCAL_HOST_RE = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?(\/|$)/i;

/**
 * Base URL for the links in an alert email.
 *
 * APP_URL wins when it is set, so a developer running the API locally still
 * gets links to their local site. In production a local URL is never used,
 * even if APP_URL itself was set to one: an alert is read from a phone or
 * another machine, where localhost is a dead link.
 */
export function resolveAppUrl(env = process.env) {
  const configured = String(env.APP_URL || '').trim().replace(/\/+$/, '');
  if (!configured) return PRODUCTION_SITE_URL;
  if (env.NODE_ENV === 'production' && LOCAL_HOST_RE.test(configured)) {
    return PRODUCTION_SITE_URL;
  }
  return configured;
}

/**
 * Builds the critical-error mail with the shared owner layout (ownerMail.js).
 * Returns { html, text }. Every value is escaped by the layout.
 */
export function generateEmailHtml(errorData, severity, errorId, frequency) {
  const appUrl = resolveAppUrl();
  const pageUrl = errorData.page ? `${appUrl}${errorData.page}` : appUrl;
  const short = (v, n = 1500) => {
    if (v == null || v === '') return null;
    const t = typeof v === 'string' ? v : JSON.stringify(v, null, 2);
    return t.length > n ? t.slice(0, n) + ' …' : t;
  };
  const rows = [
    ['Error', errorData.errorType || 'UNKNOWN_ERROR', { bold: true }],
    ['Severity', severity.level],
    ['Where', [errorData.method, errorData.endpoint].filter(Boolean).join(' ') || '—'],
    ['HTTP status', errorData.statusCode ?? '—'],
    ['Page', pageUrl],
    ['User', [errorData.username, errorData.userId ? '#' + errorData.userId : null].filter(Boolean).join(' ') || '—'],
    ['Time', formatTimestamp(errorData.timestamp)],
    ['Repeats this hour', frequency > 1 ? '×' + frequency : 'first time'],
    ['Environment', process.env.NODE_ENV === 'production' ? 'production' : 'development'],
    ['Error ID', errorId, { mono: true }],
  ].map(([k, v, o]) => [k, String(v), o]);
  const sections = [
    { title: 'Message', quote: String(errorData.message ?? '') },
    { rows },
  ];
  const stack = short(errorData.stackTrace, 2500);
  if (stack) sections.push({ title: 'Stack trace', quote: stack });
  const extra = short(errorData.additionalInfo, 800);
  if (extra) sections.push({ title: 'Extra details', quote: extra });
  const critical = severity.level === 'CRITICAL';
  return renderOwnerMail({
    status: critical ? 'urgent' : 'attention',
    title: 'Server error',
    headline: critical
      ? `A serious error happened: ${errorData.errorType || 'UNKNOWN_ERROR'}.`
      : `An error needs a look: ${errorData.errorType || 'UNKNOWN_ERROR'}.`,
    intro: 'This mail is sent at once, at most once per hour for the same error; repeats are counted in the daily mail.',
    sections,
    todo: critical
      ? 'Check whether the site still works (open the home page and answer one question). If it does, this can wait for the developer session; send it the Error ID above.'
      : 'Nothing is broken for everyone. Pass the Error ID to the developer session if it comes back.',
    action: { label: 'Open the admin panel', url: ADMIN_LINKS.overview },
  });
}

/**
 * Generate email subject
 */
function generateSubject(errorData, severity, frequency) {
  const repeatText = frequency > 1 ? ` (×${frequency})` : '';
  return `${severity.emoji} [${severity.level}] System Error: ${errorData.errorType || 'UNKNOWN_ERROR'}${repeatText}`;
}


// ── junk client reports ─────────────────────────────────────────────────────
// Browser extensions, bots and broken devices produce "errors" with no message ("Na") or no code of ours in the stack
// (example 2026-11-09: UNHANDLED_PROMISE_REJECTION, message "Na", iPad Chrome, /login). They are not mailed; they are
// counted per hour in rate_limit_hits (bucket 'error_ignored') and shown in the daily mail as "ignored".
export const ERROR_IGNORED_BUCKET = 'error_ignored';
const CLIENT_SCRIPT_ERROR_TYPES = new Set(['UNHANDLED_PROMISE_REJECTION', 'GLOBAL_JS_ERROR', 'REACT_RENDER_ERROR']);
// A stack line that points into our own bundle or site.
const OWN_FRAME_RE = /(smle-question-bank\.com|medquiz[\w-]*\.vercel\.app|\/assets\/[^\s)]+\.js|\/src\/[^\s)]+\.jsx?)/i;
const MIN_MESSAGE_LENGTH = 4;

/** @returns {null|'short_message'|'no_own_frame'} why a client report is junk, or null if it is worth a mail */
export function junkClientReportReason(errorData) {
  if (!errorData || !CLIENT_SCRIPT_ERROR_TYPES.has(errorData.errorType)) return null;
  if (String(errorData.message ?? '').trim().length < MIN_MESSAGE_LENGTH) return 'short_message';
  if (!OWN_FRAME_RE.test(String(errorData.stackTrace ?? ''))) return 'no_own_frame';
  return null;
}

async function countIgnoredReport(reason) {
  if (!_db) return;
  try {
    const windowStart = new Date(Math.floor(Date.now() / 3600000) * 3600000);
    await _db.query(
      `INSERT INTO rate_limit_hits (bucket, identifier, window_start, count)
       VALUES ($1, $2, $3, 1)
       ON CONFLICT (bucket, identifier, window_start) DO UPDATE SET count = rate_limit_hits.count + 1`,
      [ERROR_IGNORED_BUCKET, reason, windowStart]
    );
  } catch (err) {
    console.warn('[ErrorNotification] could not count an ignored report:', err.message);
  }
}

/**
 * Send error notification email
 * @param {Object} errorData - Error details
 * @returns {Promise<{success: boolean, errorId?: string, message?: string}>}
 */
export async function sendErrorNotification(errorData) {
  try {
    const junkReason = junkClientReportReason(errorData);
    if (junkReason) {
      await countIgnoredReport(junkReason);
      return { success: false, message: `Ignored: junk client report (${junkReason})` };
    }

    // Classify severity
    const severity = classifyErrorSeverity(errorData);

    // Only send emails for CRITICAL and HIGH severity
    if (severity.level !== 'CRITICAL' && severity.level !== 'HIGH') {
      console.log(`[ErrorNotification] Skipping email for ${severity.level} severity error`);
      return { success: false, message: `Skipped: ${severity.level} severity` };
    }

    // Check rate limiting — in-memory first (free, catches same-instance
    // bursts without a round trip), then the shared store, which is the one
    // that actually holds across cold starts and concurrent instances.
    const errorKey = getErrorKey(errorData);
    if (!canSendEmail(errorKey)) {
      return { success: false, message: 'Rate limited' };
    }

    const { send, repeatCount } = await claimAlertSlot(errorKey);
    if (!send) {
      // Still counted in the shared store, so the next window's alert can say
      // how many times this happened while it was suppressed.
      updateTrackers(errorKey);
      return { success: false, message: `Rate limited (repeat ${repeatCount} this hour)` };
    }

    // Get error frequency
    const frequency = (emailTracker.errorFrequency.get(errorKey) || 0) + 1;

    // Generate error ID
    const errorId = generateErrorId();

    // Generate email content
    const mailBody = generateEmailHtml(errorData, severity, errorId, frequency);
    const subject = generateSubject(errorData, severity, frequency);

    // Send email
    await sendMail({
      name: 'SQB',
      // Resolved per send (not at import time) so dotenv has already run.
      to: developerEmails().join(', '),
      subject: subject,
      html: mailBody.html,
      text: mailBody.text,

      // ── routed through the central gateway ──────────────────────────────
      // audience is 'owner' on this event, so it goes over Gmail and costs
      // ZERO Resend quota, and repeats collapse into an hourly digest
      // ("DATABASE_ERROR x47") instead of one email each. CRITICAL still
      // escalates and arrives immediately.
      event: 'medqize.owner.backend_error',
      severity: severity.level,

      // THE LOCALHOST FIX. errorData.page is the browser origin
      // (req.headers.referer || req.headers.origin). When the frontend is
      // running on localhost against the PRODUCTION backend, the gateway sees
      // a non-production origin and DROPS the mail — recorded on the dashboard,
      // never sent, no quota spent. That is what stops a dev session filling
      // the inbox with stack traces.
      sourceOrigin: errorData.page,

      // Same error, same hour, same alert -> one message, not N.
      idempotencyKey: `err:${errorKey}:${new Date().toISOString().slice(0, 13)}`,
    });

    // Update trackers
    updateTrackers(errorKey);

    console.log(`[ErrorNotification] Email sent successfully. Error ID: ${errorId}`);

    return { success: true, errorId };

  } catch (error) {
    console.error('[ErrorNotification] Failed to send email:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Send error notification for backend errors
 * @param {Error} error - The error object
 * @param {Object} req - Express request object (optional)
 * @param {Object} additionalInfo - Additional context (optional)
 */
export async function notifyBackendError(error, req = null, additionalInfo = {}) {
  const errorData = {
    errorType: error.name || 'BACKEND_ERROR',
    message: error.message,
    endpoint: req?.originalUrl || req?.url,
    method: req?.method,
    statusCode: error.statusCode || error.status || 500,
    page: req?.headers?.referer || req?.headers?.origin,
    userAgent: req?.headers?.['user-agent'],
    userId: req?.user?.id,
    username: req?.user?.username,
    branchId: req?.user?.branchId,
    timestamp: new Date().toISOString(),
    stackTrace: error.stack,
    requestData: {
      body: req?.body,
      params: req?.params,
      query: req?.query
    },
    additionalInfo
  };

  return sendErrorNotification(errorData);
}

/**
 * Get current rate limiting status
 */
export function getRateLimitStatus() {
  return {
    hourlyCount: emailTracker.hourlyCount,
    maxPerHour: RATE_LIMIT.maxEmailsPerHour,
    cooldownMinutes: RATE_LIMIT.cooldownMinutes,
    activeErrors: emailTracker.errorCooldowns.size
  };
}

export default {
  sendErrorNotification,
  notifyBackendError,
  configureAlertThrottle,
  getRateLimitStatus,
  SEVERITY
};
