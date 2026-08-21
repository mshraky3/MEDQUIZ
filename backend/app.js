import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { rateLimit } from './middleware/rateLimit.js';
import { sendMail } from './services/mailer.js';
import errorReportRoutes from './routes/error-report.js';
import questionReportsRouter from './routes/question-reports.js';
import emailCampaignsRouter from './routes/email-campaigns.js';
import adminBroadcastRouter, { unsubToken } from './routes/admin-broadcast.js';
import paymentRoutes from './routes/payment.js';
import { checkSubscriptionAccess, checkQuizAccess, isPaymentEnforcementEnabled, FREE_QUESTION_ALLOWANCE, getPlan } from './services/paymentService.js';
import { adminAuth, isAdminRequest } from './middleware/adminAuth.js';
import { subscriptionGuard, quizAccessGuard } from './middleware/subscriptionGuard.js';
import summariesRouter from './routes/summaries.js';
import accountingRouter from './routes/accounting.js';
import engagementRouter from './routes/engagement.js';
import funnelRouter from './routes/funnel.js';
import goalsRouter from './routes/goals.js';
import notificationsRouter from './routes/notifications.js';
import examDateRouter from './routes/examDate.js';
import groupRoutes from './routes/groups.js';
import trialRouter from './routes/trial.js';
import telegramRouter from './routes/telegram.js';
import { checkMilestones } from './services/notificationService.js';
import {
    revenueSnapshot, subscriptionSnapshot, conversionSnapshot,
    paidButInactiveCount, userSnapshot, activeUserSnapshot, dailySignups,
    dailyActiveUsers, openReportsCount, SQL_FREE_EXHAUSTED,
} from './services/adminMetricsService.js';
import summaryContent from './content/summaryHtml/index.js';
import { notifyBackendError } from './services/errorNotificationService.js';
import { sendWelcomeEmail, sendGroupSeatClaimedEmail } from './services/userEmailService.js';
import { OWNER_EMAIL } from './config/recipients.js';
import {
    DEFAULT_TRACK, TRACK_KEYS, TRACKS, isValidTrack, normalizeTrack,
    specialtyKeys, trackLabelAr, trackLabelEn, trackForSpecialty,
} from './config/tracks.js';
import { PICKABLE_SOURCES, SOURCE_PRIORITY, resolveSources } from './config/sources.js';

dotenv.config();
// Logging configuration
const LOG_LEVEL = process.env.LOG_LEVEL || 'INFO'; 
const isProduction = process.env.NODE_ENV === 'production';
const logger = {
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
        console.error(`❌ [ERROR] ${message}`, error ? error.stack || error : '');
    }
};
const db = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    // Verifies the server certificate against Node's trusted CA store — was
    // `rejectUnauthorized: false`, which accepts ANY certificate (including
    // one from an attacker performing a MITM on the DB connection) and
    // defeats the point of using TLS at all. The managed Postgres host this
    // points to (Koyeb, backed by Neon) uses a publicly-trusted certificate,
    // so this should need no CA bundle — but verify connectivity right after
    // this deploys, since it can't be tested without a live connection.
    ssl: {
        rejectUnauthorized: true
    },
    // Connection pooling optimizations (serverless-safe settings)
    // Was 5. The /login connection leak (client acquired outside its own
    // try/finally, so a thrown error skipped release()) meant this pool could
    // exhaust itself on its own under load; that leak is fixed now, but 5 is
    // still thin for a warm instance serving several concurrent requests, and
    // the DB behind DBHOST is Neon-backed (via Koyeb), whose pooler is built
    // for more logical connections per app instance than raw Postgres would
    // tolerate. Modest increase, not a large blind guess — revisit with real
    // Vercel concurrency numbers if this still isn't enough.
    max: 10,
    idleTimeoutMillis: 10000, // Close idle clients after 10 seconds
    // Was 10000, raised to survive a Koyeb/Neon compute resuming from suspend
    // on a cold start's first connection. Worth keeping for that reason, but
    // note it was NOT what fixed the repeated "Connection terminated due to
    // connection timeout" alerts — those came from bootstrap work left in
    // flight when the Lambda froze, where no timeout value can help because
    // the freeze is unbounded. See bootstrapOnce() for the actual fix.
    connectionTimeoutMillis: 20000,
    allowExitOnIdle: true, // Allow process to exit when pool is idle (important for serverless)
    maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
    // Without this, one runaway query (a missing index, an accidental
    // cross-join) holds its connection — and on a 10-connection pool, enough
    // of them stall every other request behind it, the same class of outage
    // the /login leak caused. statement_timeout is enforced by Postgres
    // itself; query_timeout is node-postgres's own client-side backstop in
    // case the server doesn't honor it. 15s sits comfortably under this
    // pool's connectionTimeoutMillis-driven queueing and gives the slowest
    // legitimate route (the admin stats dashboard) room to finish.
    statement_timeout: 15000,
    query_timeout: 15000,
});

// Every ensure*() bootstrap below swallows its own errors (so one failed
// CREATE TABLE can't stop the process from serving the requests that don't
// need it) — but a swallowed error was
// ALSO a silent one: a failed bootstrap (a bad migration statement, a
// permissions issue) left the server serving requests against a schema that
// was never actually ensured, with the only trace a log line that may never
// get read. This still logs, but also reaches notifyBackendError, the same
// path the global error handler uses — so a bootstrap failure is noticed
// instead of surfacing later as a confusing "column does not exist" on
// whatever request happens to hit it first.
//
// "The connection went away" arrives in half a dozen shapes, and during
// bootstrap every one of them is expected background noise rather than a bug:
// bootstrap is idempotent and re-runs on the next request/cold start, so a
// socket that died mid-handshake costs nothing except the alert it used to
// send. Mailing them was actively harmful — a burst of cold starts turned into
// 70+ CRITICAL emails against the ONE 100/day Resend allowance shared by every
// project, which is quota that real errors then can't use. Logged, never
// mailed. A genuine bootstrap bug (bad SQL, missing privileges) still mails.
const TRANSIENT_CONNECTION_CODES = new Set([
    'ECONNRESET',   // socket killed under us (instance freeze, pooler recycle)
    'ETIMEDOUT',    // handshake never completed
    'EPIPE',        // wrote to a socket the other end had already closed
    'EAI_AGAIN',    // transient DNS failure
    '08001', '08003', '08006', // Postgres connection-exception class
    '57P01', '57P03',          // admin shutdown / cannot connect now (Neon resuming)
]);
function isTransientConnectionError(err) {
    if (!err) return false;
    if (err.code && TRANSIENT_CONNECTION_CODES.has(err.code)) return true;
    // pg-pool's own timeout paths build plain Errors with no .code at all.
    return /Connection terminated|timeout exceeded when trying to connect|Client has encountered a connection error|terminating connection|Connection ended unexpectedly/i
        .test(String(err.message || ''));
}

// One alert per distinct bootstrap failure per process. The 11 steps below
// (version check + 9 ensureXxx + version write) all hit the same database in
// the same second, so a single outage used to mail 11 near-identical CRITICALs
// per cold start — and errorNotificationService's rate limiter can't catch it,
// because its counters live in module memory and every cold start is a fresh
// process with an empty tracker. Keyed on the message, not the step, so two
// genuinely different bugs still get an alert each.
const _alertedBootstrapFailures = new Set();

function reportBootstrapFailure(name, err) {
    if (isTransientConnectionError(err)) {
        logger.warn(`${name} skipped: database connection did not survive, retrying on the next request`, {
            error: err.message,
        });
        return;
    }
    logger.error(`${name} failed`, err);
    const key = String(err?.message || err);
    if (_alertedBootstrapFailures.has(key)) return;
    _alertedBootstrapFailures.add(key);
    notifyBackendError(err, null, { middleware: name }).catch(() => { /* already logged above */ });
}

// One-time, idempotent schema bootstrap. Runs once per process (cold start) and
// is safe to re-run thanks to IF NOT EXISTS. Replaces the old manual
// POST /init-progress-tables endpoint and guarantees the performance indexes
// that keep /user-streaks and /api/user-achievements fast exist.
let _schemaReady = null;
function ensureSchema() {
    if (_schemaReady) return _schemaReady;
    _schemaReady = (async () => {
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS user_question_progress (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                    question_type VARCHAR(50),
                    source VARCHAR(50),
                    completed_at TIMESTAMP DEFAULT NOW(),
                    UNIQUE(user_id, question_id)
                )
            `);
            await db.query(`
                CREATE TABLE IF NOT EXISTS user_achievements (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    achievement_type VARCHAR(50) NOT NULL,
                    achievement_key VARCHAR(100) NOT NULL,
                    achievement_name VARCHAR(200) NOT NULL,
                    achievement_description TEXT,
                    earned_at TIMESTAMP DEFAULT NOW(),
                    UNIQUE(user_id, achievement_type, achievement_key)
                )
            `);
            // Pre-signup/pre-login funnel events (landing → signup → trial →
            // paywall → subscribe → payment). account_id is nullable and set
            // only once an event can be tied to a session; anon_id is a stable
            // per-browser id so the whole funnel is joinable even before an
            // account exists — the gap page_engagement (logged-in only) and
            // Vercel Analytics (un-joinable to accounts) both leave open.
            await db.query(`
                CREATE TABLE IF NOT EXISTS funnel_events (
                    id         BIGSERIAL PRIMARY KEY,
                    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
                    anon_id    VARCHAR(64),
                    event      VARCHAR(60) NOT NULL,
                    props      JSONB NOT NULL DEFAULT '{}',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `);
            // Lifecycle-email dedupe stamps. Each column is "when we last sent
            // this campaign to this account", so the cron can find who is due
            // without a separate send-log table.
            await db.query(`
                ALTER TABLE accounts
                    ADD COLUMN IF NOT EXISTS trial_ended_email_sent_at  TIMESTAMPTZ DEFAULT NULL,
                    ADD COLUMN IF NOT EXISTS progress_digest_sent_at    TIMESTAMPTZ DEFAULT NULL,
                    ADD COLUMN IF NOT EXISTS expiry_reminder_sent_at    TIMESTAMPTZ DEFAULT NULL
            `);
            // DEAD COLUMNS — the engaged-time trial they backed was retired on
            // 2026-08-08 in favour of the 40-question allowance (see
            // free_questions_used in ensurePaymentSchema). Kept, not dropped,
            // because they are the only record of how much the old trial cohort
            // actually used, which the conversion analysis still reads. Nothing
            // writes to them any more.
            await db.query(`
                ALTER TABLE accounts
                    ADD COLUMN IF NOT EXISTS trial_active_seconds    INTEGER     NOT NULL DEFAULT 0,
                    ADD COLUMN IF NOT EXISTS trial_last_heartbeat_at TIMESTAMPTZ DEFAULT NULL
            `);
            // Day-1/Day-3 win-back for anyone stuck at exactly one quiz session —
            // see lifecycleJobs.runComebackJob. Stores the highest COMEBACK_STAGE
            // already mailed (1 or 3), same "ladder only moves down/up once"
            // idempotency pattern as exam_reminder_stage above.
            await db.query(`
                ALTER TABLE accounts
                    ADD COLUMN IF NOT EXISTS comeback_email_stage INTEGER DEFAULT NULL
            `);
            // The student's own exam date, and how far the reminder ladder has
            // been walked for it. A DATE (not a timestamp) because a sitting is
            // a day, not a moment, and the countdown must read the same whether
            // the student opens the app at 08:00 in Riyadh or 23:00 in Cairo.
            //
            // exam_reminder_stage stores the LAST milestone mailed (30, 14, 7,
            // 3, 1 days out). Storing the stage rather than a timestamp is what
            // makes the ladder idempotent: a job that runs hourly can only ever
            // move the stage down, so each milestone mails exactly once — and
            // setting a new date resets it to NULL, which restarts the ladder.
            await db.query(`
                ALTER TABLE accounts
                    ADD COLUMN IF NOT EXISTS exam_date           DATE    DEFAULT NULL,
                    ADD COLUMN IF NOT EXISTS exam_reminder_stage INTEGER DEFAULT NULL
            `);
            // Which language to write to this student in. The whole site has
            // been bilingual since 2026-08-01, but lifecycle mail was still
            // Arabic-only — an English-speaking user got an Arabic welcome to a
            // product they were reading in English. Defaults to 'ar' because
            // that is what every existing account was already being sent, so
            // nobody's mail changes language underneath them; the client PUTs
            // the real preference on first authenticated page view.
            await db.query(`
                ALTER TABLE accounts
                    ADD COLUMN IF NOT EXISTS preferred_lang VARCHAR(5) NOT NULL DEFAULT 'ar'
            `);
            // Partial index: the reminder job scans only rows that HAVE a date,
            // which is a small minority of accounts.
            await db.query(`
                CREATE INDEX IF NOT EXISTS idx_accounts_exam_date
                    ON accounts(exam_date) WHERE exam_date IS NOT NULL
            `);
            // Study goals. One ACTIVE goal per user at a time (enforced by the
            // partial unique index) so the hub always has exactly one thing to
            // show; completed/abandoned goals stay as history.
            await db.query(`
                CREATE TABLE IF NOT EXISTS user_goals (
                    id          SERIAL PRIMARY KEY,
                    user_id     INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    goal_type   VARCHAR(20) NOT NULL,
                    target_value INTEGER NOT NULL,
                    period      VARCHAR(10) NOT NULL DEFAULT 'weekly',
                    baseline    INTEGER NOT NULL DEFAULT 0,
                    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    achieved_at TIMESTAMPTZ DEFAULT NULL
                )
            `);
            await db.query(`
                CREATE UNIQUE INDEX IF NOT EXISTS uq_user_goals_one_active
                    ON user_goals(user_id) WHERE is_active = TRUE
            `);
            // Scope: a goal can be narrowed to one specialty and/or one
            // collection ("200 paediatrics questions", "finish the Confirmed
            // source"). NULL in either column means "the whole bank", which is
            // exactly what every pre-existing row already meant — so no
            // backfill, and old goals keep computing identically.
            await db.query(`
                ALTER TABLE user_goals
                    ADD COLUMN IF NOT EXISTS question_type VARCHAR(50) DEFAULT NULL,
                    ADD COLUMN IF NOT EXISTS source        VARCHAR(50) DEFAULT NULL
            `);
            // In-app notifications, written by real events (goal reached,
            // streak milestone, trial ending) — never a marketing queue.
            await db.query(`
                CREATE TABLE IF NOT EXISTS user_notifications (
                    id         BIGSERIAL PRIMARY KEY,
                    user_id    INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                    type       VARCHAR(40) NOT NULL,
                    title      VARCHAR(200) NOT NULL,
                    body       TEXT,
                    cta_url    VARCHAR(200),
                    dedupe_key VARCHAR(120),
                    read_at    TIMESTAMPTZ DEFAULT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
            `);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON user_notifications(user_id, created_at DESC)`);
            // A milestone fires once. The dedupe key carries what happened
            // ("goal:12:done", "streak:7"), so re-running the check is safe.
            await db.query(`
                CREATE UNIQUE INDEX IF NOT EXISTS uq_user_notifications_dedupe
                    ON user_notifications(user_id, dedupe_key) WHERE dedupe_key IS NOT NULL
            `);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_funnel_events_event ON funnel_events(event)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_funnel_events_created ON funnel_events(created_at)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_funnel_events_anon ON funnel_events(anon_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_funnel_events_account ON funnel_events(account_id)`);
            // Columns that used to be ensured with ALTER TABLE on EVERY request in
            // the hot paths (/quiz-sessions, /user-analysis, /api/all-questions,
            // /get_all_users). Ensuring them once here removes 10-15 DDL round-trips
            // per request.
            await db.query(`
                ALTER TABLE user_quiz_sessions
                    ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'general',
                    ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0,
                    ADD COLUMN IF NOT EXISTS avg_time_per_question DECIMAL(10, 2) DEFAULT 0,
                    ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid(),
                    ADD COLUMN IF NOT EXISTS end_time TIMESTAMP DEFAULT NOW(),
                    ADD COLUMN IF NOT EXISTS quiz_type VARCHAR(50) DEFAULT 'practice',
                    ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'mixed',
                    ADD COLUMN IF NOT EXISTS device_type VARCHAR(20) DEFAULT 'desktop',
                    ADD COLUMN IF NOT EXISTS fastest_question_time INTEGER DEFAULT 0,
                    ADD COLUMN IF NOT EXISTS slowest_question_time INTEGER DEFAULT 0,
                    ADD COLUMN IF NOT EXISTS session_metadata JSONB DEFAULT '{}'
            `);
            await db.query(`ALTER TABLE questions ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'general'`);
            await db.query(`UPDATE questions SET source = 'general' WHERE source IS NULL`);
            // Why the correct answer is correct, shown after a student answers.
            // Authored offline and loaded by scripts/importExplanations.js; NULL
            // is a legitimate value (the panel simply doesn't render), so there
            // is no default and no backfill here.
            await db.query(`ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT`);
            await db.query(`
                ALTER TABLE accounts
                    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
                    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            // Performance indexes — these directly address the slow-request warnings.
            await db.query(`CREATE INDEX IF NOT EXISTS idx_user_question_progress_user_id ON user_question_progress(user_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_user_question_progress_cardinality ON user_question_progress(user_id, question_type, source)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_user_quiz_sessions_user_id ON user_quiz_sessions(user_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_uqs_user_start ON user_quiz_sessions(user_id, start_time DESC)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_uqa_user ON user_question_attempts(user_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_uqa_session ON user_question_attempts(quiz_session_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_uqa_user_wrong ON user_question_attempts(user_id) WHERE is_correct = false`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_questions_type_source ON questions(question_type, source)`);

            // ── Study tracks (medical | nursing) ───────────────────────────
            // The content partition. Everything that already exists is medical,
            // which is exactly what DEFAULT 'medical' + NOT NULL gives us — no
            // backfill pass is needed and no row can ever be track-less.
            // questions/summaries rows carry the track of the bank they belong
            // to; accounts carry the track of the student.
            // (summaries.track is added in ensureSummariesTables — that table is
            // created later in boot, so it cannot be altered from here.)
            await db.query(`ALTER TABLE accounts  ADD COLUMN IF NOT EXISTS track VARCHAR(20) NOT NULL DEFAULT '${DEFAULT_TRACK}'`);
            await db.query(`ALTER TABLE questions ADD COLUMN IF NOT EXISTS track VARCHAR(20) NOT NULL DEFAULT '${DEFAULT_TRACK}'`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_accounts_track ON accounts(track)`);
            // Every question lookup filters by track first, then type/source —
            // this index is the one that keeps /api/questions off a seq scan
            // once the nursing bank is loaded alongside the medical one.
            await db.query(`CREATE INDEX IF NOT EXISTS idx_questions_track_type_source ON questions(track, question_type, source)`);

            // Auth resolves accounts by email (/login, /session-validate), but
            // the only unique index was on `username` — so email lookups were
            // heading for a seq scan on every sign-in and every session check.
            // Deliberately NOT unique: uniqueness is already guaranteed by
            // UNIQUE(username) plus the parity below, and a UNIQUE index that
            // failed to build would take the whole schema bootstrap down.
            await db.query(`CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email)`);

            // ── username === email ─────────────────────────────────────────
            // Sign-in has been email-only for a long time (see /login), but a
            // handful of pre-email accounts still carried a separate handle
            // like 'albaraa1'. That split identity is what forced every auth
            // query into a `(email = $1 OR username = $1)` dual-lookup, and it
            // leaked into the client, which stores `user.username` and sends it
            // back on every session check.
            //
            // Collapsing the two here — at boot, before any request is served —
            // is what makes dropping that dual-lookup safe regardless of deploy
            // order. Idempotent: after the first run it matches zero rows.
            //
            // Guarded against the UNIQUE(username) constraint: an account is
            // only rewritten when no OTHER account already holds that email as
            // its username, so a would-be collision is skipped rather than
            // crashing boot.
            const parity = await db.query(`
                UPDATE accounts a
                   SET username = a.email, updated_at = NOW()
                 WHERE a.email IS NOT NULL
                   AND btrim(a.email) <> ''
                   AND a.username IS DISTINCT FROM a.email
                   AND NOT EXISTS (
                       SELECT 1 FROM accounts b
                        WHERE b.id <> a.id AND b.username = a.email
                   )
                RETURNING a.id
            `);
            if (parity.rowCount > 0) {
                logger.info(`username→email parity applied to ${parity.rowCount} account(s)`,
                    { ids: parity.rows.map((r) => r.id) });
            }

            logger.info('Schema bootstrap complete (tables + performance indexes ensured)');
        } catch (err) {
            _schemaReady = null; // allow a retry on a later invocation
            reportBootstrapFailure('ensureSchema', err);
        }
    })();
    return _schemaReady;
}
// Kicked off from the single bootstrapAll() sequence below, not individually
// here — see that comment for why.

// Lazily detect whether the payment/subscription columns from migration 001
// exist yet. This lets the new payment-prep code deploy SAFELY before the
// migration is applied — queries fall back to legacy behavior until then.
// Result is memoized for the lifetime of the process (re-checked on failure).
let _paymentColumnsExist = null;
async function hasPaymentColumns() {
    if (_paymentColumnsExist === true) return true;
    try {
        const r = await db.query(
            `SELECT column_name FROM information_schema.columns
             WHERE table_name = 'accounts'
               AND column_name IN ('subscription_status', 'is_admin_created', 'account_type')`
        );
        _paymentColumnsExist = r.rows.length === 3;
    } catch (e) {
        _paymentColumnsExist = false;
    }
    return _paymentColumnsExist;
} 
// One-time, idempotent payment/subscription schema bootstrap. Migration 001 is
// folded into boot so it self-applies (no manual psql step). Adds the
// subscription columns + payment_events table, and grandfathers every
// PRE-EXISTING account EXACTLY ONCE — tracked in schema_migrations so accounts
// created AFTER rollout are correctly gated (never auto-grandfathered later).
let _paymentSchemaReady = null;
function ensurePaymentSchema() {
    if (_paymentSchemaReady) return _paymentSchemaReady;
    _paymentSchemaReady = (async () => {
        try {
            await db.query(`
                ALTER TABLE accounts
                  ADD COLUMN IF NOT EXISTS subscription_status         VARCHAR(50)  NOT NULL DEFAULT 'free',
                  ADD COLUMN IF NOT EXISTS subscription_expiry_date    TIMESTAMPTZ  DEFAULT NULL,
                  ADD COLUMN IF NOT EXISTS account_type                VARCHAR(50)  NOT NULL DEFAULT 'standard',
                  ADD COLUMN IF NOT EXISTS is_admin_created            BOOLEAN      NOT NULL DEFAULT FALSE,
                  ADD COLUMN IF NOT EXISTS payment_gateway_customer_id VARCHAR(255) DEFAULT NULL,
                  ADD COLUMN IF NOT EXISTS grandfathered_at            TIMESTAMPTZ  DEFAULT NULL
            `);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_accounts_subscription_status ON accounts(subscription_status)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_accounts_is_admin_created     ON accounts(is_admin_created)`);
            await db.query(`
                CREATE TABLE IF NOT EXISTS payment_events (
                  id              BIGSERIAL PRIMARY KEY,
                  account_id      INT REFERENCES accounts(id) ON DELETE SET NULL,
                  event_type      VARCHAR(100) NOT NULL,
                  gateway         VARCHAR(50)  NOT NULL DEFAULT 'moyasar',
                  gateway_ref     VARCHAR(255),
                  amount_halalas  INT,
                  currency        VARCHAR(10)  DEFAULT 'SAR',
                  status          VARCHAR(50),
                  raw_payload     JSONB,
                  received_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
                )
            `);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_payment_events_account  ON payment_events(account_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_payment_events_received ON payment_events(received_at)`);
            // One paid row per Moyasar reference, enforced by the database.
            // This is what makes activation genuinely idempotent: /verify and
            // the webhook can race, and the loser's INSERT simply conflicts
            // instead of recording the money (and extending the subscription)
            // a second time. Partial so non-paid audit rows are unaffected.
            await db.query(`
                CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_events_paid_ref
                    ON payment_events(gateway_ref) WHERE status = 'paid'
            `);
            // Live vs Moyasar-test. NULL = not yet reconciled with the gateway.
            await db.query(`ALTER TABLE payment_events ADD COLUMN IF NOT EXISTS livemode BOOLEAN`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_payment_events_livemode ON payment_events(livemode)`);

            // One free trial per email, ever — survives account deletion
            // (account_id goes NULL) so a re-signup can't re-trial.
            await db.query(`
                CREATE TABLE IF NOT EXISTS trial_grants (
                  id         SERIAL PRIMARY KEY,
                  email      VARCHAR(255) UNIQUE NOT NULL,
                  account_id INT REFERENCES accounts(id) ON DELETE SET NULL,
                  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                  expires_at TIMESTAMPTZ NOT NULL
                )
            `);

            // ── Group subscriptions ────────────────────────────────────────
            // One payment buys `seats` accounts. The payer is seat 1 (their own
            // account is activated directly); seats 2..N are single-use invite
            // links. Every seat in a group shares ONE end date, `expires_at`,
            // fixed at purchase — so an unclaimed link cannot quietly extend
            // the group's life by being claimed late.
            //
            // gateway_ref UNIQUE is the idempotency lock, the same trick as
            // uq_payment_events_paid_ref above: /verify and the webhook both
            // run activation and must not mint two sets of links.
            await db.query(`
                CREATE TABLE IF NOT EXISTS subscription_groups (
                  id               BIGSERIAL PRIMARY KEY,
                  owner_account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                  plan_id          VARCHAR(50)  NOT NULL,
                  seats            INTEGER      NOT NULL,
                  months           INTEGER      NOT NULL,
                  gateway_ref      VARCHAR(255) UNIQUE NOT NULL,
                  expires_at       TIMESTAMPTZ  NOT NULL,
                  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
                )
            `);
            // token is NULL for seat 1 (the buyer's own account — there is no
            // link to claim), and a 32-char crypto token for every other seat.
            await db.query(`
                CREATE TABLE IF NOT EXISTS group_seats (
                  id                    BIGSERIAL PRIMARY KEY,
                  group_id              BIGINT  NOT NULL REFERENCES subscription_groups(id) ON DELETE CASCADE,
                  seat_index            INTEGER NOT NULL,
                  token                 VARCHAR(64) UNIQUE,
                  claimed_by_account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
                  claimed_at            TIMESTAMPTZ DEFAULT NULL,
                  UNIQUE (group_id, seat_index)
                )
            `);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_group_seats_group ON group_seats(group_id)`);
            await db.query(`CREATE INDEX IF NOT EXISTS idx_subscription_groups_owner ON subscription_groups(owner_account_id)`);

            // ── Free tier: 40 questions, for life ──────────────────────────
            // Replaces the 1-hour engaged-time trial. A lifetime counter, not a
            // window: a free account keeps its login, its analytics and the
            // free lessons forever, and only quiz STARTS are gated on it.
            //
            // Deliberately NOT derived from user_question_progress, which
            // POST /api/reset-progress wipes on demand — that would hand every
            // free user an unlimited refill button.
            await db.query(`
                ALTER TABLE accounts
                    ADD COLUMN IF NOT EXISTS free_questions_used INTEGER NOT NULL DEFAULT 0
            `);

            // Grandfather pre-rollout accounts EXACTLY ONCE.
            await db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
            const applied = await db.query(`SELECT 1 FROM schema_migrations WHERE name = '001_grandfather_existing'`);
            if (applied.rows.length === 0) {
                const r = await db.query(`
                    UPDATE accounts
                       SET grandfathered_at = NOW(), subscription_status = 'grandfathered'
                     WHERE grandfathered_at IS NULL
                `);
                await db.query(`INSERT INTO schema_migrations (name) VALUES ('001_grandfather_existing') ON CONFLICT DO NOTHING`);
                logger.info(`Grandfathered ${r.rowCount} pre-rollout account(s) (one-time)`);
            }

            // Catch-up grandfathering: every account that exists as of THIS rollout
            // stays free for good — only brand-new signups created afterwards pay
            // ("login = no payment, signup = payment"). Migration 001 only covered
            // accounts present when it first ran; this one-time pass sweeps any
            // accounts created since (e.g. recent signups, the owner's account).
            const applied2 = await db.query(`SELECT 1 FROM schema_migrations WHERE name = '002_grandfather_all_current'`);
            if (applied2.rows.length === 0) {
                const r2 = await db.query(`
                    UPDATE accounts
                       SET grandfathered_at = NOW(), subscription_status = 'grandfathered'
                     WHERE grandfathered_at IS NULL
                `);
                await db.query(`INSERT INTO schema_migrations (name) VALUES ('002_grandfather_all_current') ON CONFLICT DO NOTHING`);
                logger.info(`Grandfathered ${r2.rowCount} existing account(s) so only new signups pay (one-time)`);
            }

            // The 1-hour trial is retired; everyone holding one moves to the
            // 40-question free tier. Runs EXACTLY ONCE.
            const applied3 = await db.query(`SELECT 1 FROM schema_migrations WHERE name = '003_free_tier_40q'`);
            if (applied3.rows.length === 0) {
                // Seed the counter from what each account has actually answered,
                // so a heavy trial user does not receive 40 MORE on top. Capped
                // at the allowance: the number is a budget, not a score.
                const seeded = await db.query(`
                    UPDATE accounts a
                       SET free_questions_used = LEAST($1::int, p.answered)
                      FROM (
                          SELECT user_id, COUNT(*)::int AS answered
                            FROM user_question_progress
                           GROUP BY user_id
                      ) p
                     WHERE p.user_id = a.id
                       AND a.free_questions_used = 0
                `, [FREE_QUESTION_ALLOWANCE]);
                // Grandfathered accounts are untouched on purpose — they stay
                // free-for-good, which is a promise already made to them.
                const freed = await db.query(`
                    UPDATE accounts
                       SET subscription_status = 'free'
                     WHERE subscription_status IN ('trial', 'trial_pending')
                `);
                await db.query(`INSERT INTO schema_migrations (name) VALUES ('003_free_tier_40q') ON CONFLICT DO NOTHING`);
                logger.info(`Free tier: seeded ${seeded.rowCount} counter(s), moved ${freed.rowCount} trial account(s) to 'free' (one-time)`);
            }
            _paymentColumnsExist = true; // prime the lazy cache used elsewhere
            logger.info('Payment/subscription schema ensured');
        } catch (err) {
            _paymentSchemaReady = null; // allow a retry on a later invocation
            reportBootstrapFailure('ensurePaymentSchema', err);
        }
    })();
    return _paymentSchemaReady;
}
// Kicked off from bootstrapAll() below.

// Email notification functions (shared transport — see services/mailer.js)
//
// `opts` is optional and additive, so every existing call site keeps working
// unchanged. Pass { event } where you can: the central gateway uses it to pick
// the priority, decide whether the mail is digested, and route owner-facing
// mail over Gmail (which costs no Resend quota). Omitting it is safe — the
// gateway falls back to cautious defaults — but the rationing works better
// when it knows what the message actually is.
const sendEmail = async (to, subject, text, html = null, opts = {}) => {
    try {
        const result = await sendMail({
            name: 'SQB',
            to: to,
            subject: subject,
            text: text,
            html: html,
            ...opts,
        });
        logger.info('Email sent successfully', { messageId: result.messageId });
        return result;
    } catch (error) {
        logger.error('Email sending failed', error);
        throw error;
    }
};
// Simple in-memory cache for questions, keyed by track — one bank per entry, so
// a medical response can never be served to a nursing student (or vice versa).
const questionsCache = new Map(); // track -> { data, timestamp }
const QUESTIONS_CACHE_TTL = 5 * 60 * 1000;

function readQuestionsCache(track) {
    const hit = questionsCache.get(track);
    if (hit && (Date.now() - hit.timestamp) < QUESTIONS_CACHE_TTL) return hit.data;
    return null;
}
function writeQuestionsCache(track, data) {
    questionsCache.set(track, { data, timestamp: Date.now() });
}


const app = express();

// Sensible default security headers (HSTS, X-Content-Type-Options,
// X-Frame-Options, a same-origin CSP, etc.) that nothing here was setting
// before. Its CSP only governs pages this server renders itself (the
// handful of inline-HTML routes like /api/unsubscribe) — a JSON API
// response's CSP header is inert to the browser tab that fetched it, so
// this cannot affect how the actual frontend app renders or executes.
//
// crossOriginResourcePolicy is the one default that must be overridden, not
// left alone: Helmet defaults it to 'same-origin', which the browser
// enforces as an ADDITIONAL check on top of (not replaced by) the CORS
// allowlist above. The frontend (smle-question-bank.com) and this API
// (medquiz.vercel.app) are deliberately different origins — 'same-origin'
// would have blocked every fetch from the site the moment this deployed.
// Access control is already handled correctly by the CORS origin allowlist;
// this only stops Helmet's own default from fighting it.
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Already a dependency, never wired in — every response (the 5,033-row
// question payloads especially) went over the wire uncompressed.
app.use(compression());

// Performance monitoring middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        // Only log slow requests or errors
        if (duration > 1000 || res.statusCode >= 400) {
            logger.warn(`Slow request: ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        }
    });
    next();
});

// Reflected any origin with credentials:true until now — any website could
// make authenticated cross-origin calls carrying a visitor's own session
// token in the Authorization header (the browser will happily attach it; CORS
// is what's supposed to stop the *response* from being readable cross-site).
// The site's pages are served from smle-question-bank.com; the API itself
// lives on a different Vercel project (medquiz.vercel.app — see global.js),
// which is why that host is allowed too. CORS_ALLOWED_ORIGINS adds any others
// (a Vercel preview URL, a staging domain) without a code change.
const ALLOWED_ORIGINS = new Set([
    'https://www.smle-question-bank.com',
    'https://smle-question-bank.com',
    'https://medquiz.vercel.app',
    ...(process.env.CORS_ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean),
]);
app.use(cors({
    origin: (origin, callback) => {
        // No Origin header = same-origin, curl, server-to-server or a native
        // app — none of these are what CORS defends against. Only a browser
        // sends Origin, and only cross-origin browser reads are the risk.
        if (!origin || ALLOWED_ORIGINS.has(origin)) return callback(null, true);
        // Local development: any localhost/127.0.0.1 port, any scheme.
        if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        logger.warn('Blocked cross-origin request', { origin });
        return callback(null, false);
    },
    credentials: true
}));

app.use(express.json());

// Runs the one-time schema bootstrap from inside a request instead of at
// module load — see bootstrapOnce() for why detached module-load work is what
// generated the repeated cold-start connection-timeout alerts.
//
// Gates EVERY route on purpose, the / health check included: a route that
// answers without waiting is precisely the one that leaves a half-open
// connection behind to be frozen, which is the bug. The wait is bounded so a
// slow or unreachable database can't hold requests open past Vercel's function
// limit — bootstrap re-arms and the next request retries, exactly as it did
// when this was fire-and-forget.
const BOOTSTRAP_WAIT_MS = 8000;
app.use((req, res, next) => {
    let handedOff = false;
    const proceed = () => {
        if (handedOff) return;
        handedOff = true;
        next();
    };
    const giveUp = setTimeout(() => {
        logger.warn(`Schema bootstrap still running after ${BOOTSTRAP_WAIT_MS}ms, serving request anyway`);
        proceed();
    }, BOOTSTRAP_WAIT_MS);
    bootstrapOnce()
        .catch(() => { /* already logged/reported by reportBootstrapFailure */ })
        .finally(() => {
            clearTimeout(giveUp);
            proceed();
        });
});

// ── Access-control helpers ─────────────────────────────────────────────
// Two levels, both transparent pass-throughs while PAYMENT_ENFORCEMENT_ENABLED
// is off. Both must run after requireSession — they trust the session
// username, not client-sent ids.
//
// quizOnly       — free accounts pass while they still have allowance left,
//                  and req.quizAccess.remaining tells the handler how many
//                  questions it may serve.
// subscriberOnly — paid accounts only, for features with no free slice.
const quizOnly = quizAccessGuard(db);
const subscriberOnly = subscriptionGuard(db);

// requireSession + a guard in one hop, for routes that had no middleware
// before (e.g. GET /api/questions).
function requireQuizAccess(req, res, next) {
    requireSession(req, res, () => quizOnly(req, res, next));
}
function requireSubscriber(req, res, next) {
    requireSession(req, res, () => subscriberOnly(req, res, next));
}

// Admin key OR a valid session with quiz access. Used on endpoints shared by
// the admin panel (Bank) and the student app (Analysis), like /api/all-questions.
function adminOrSubscriber(req, res, next) {
    if (isAdminRequest(req)) return next();
    return requireQuizAccess(req, res, next);
}

// Health check (previously read a scratch "test" table — no DB needed).
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'SQB API' });
});

app.post('/add_account', adminAuth, async (req, res) => {
    const { username, password } = req.body;
    const track = normalizeTrack(req.body.track);

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    // Convert to lowercase
    const lowercaseUsername = username.toLowerCase();
    const lowercasePassword = password.toLowerCase();

    // Sign-in is by email, so an account whose username is not an email could
    // never be signed into. Refuse up front rather than create a dead account.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lowercaseUsername)) {
        return res.status(400).json({
            message: 'Username must be a valid email address — sign-in is by email.',
        });
    }

    try {
        // Both columns are still checked even though they now always hold the
        // same value: UNIQUE(username) is the constraint an insert would
        // actually violate, and checking email too keeps this correct for any
        // row the boot-time parity pass had to skip.
        const check = await db.query(
            "SELECT id FROM accounts WHERE username = $1 OR email = $1",
            [lowercaseUsername]
        );
        if (check.rows.length > 0) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Insert new account with proper defaults
        // isactive: true (admin creates active accounts)
        // logged: false (not logged in yet)
        // terms_accepted: false (must accept terms on first login)
        //
        // email MUST be set and equal to username: /login looks the account up
        // by either column but then requires the two to match. Leaving it NULL
        // (as this route used to) produces an account that always fails login.
        // email_verified marks the address as settled so the same person cannot
        // later self-signup and create a duplicate account.
        //
        // is_admin_created = true is a PERMANENT paywall exemption: it is the
        // first thing checkSubscriptionAccess() tests, so these accounts never
        // see the paywall and never expire — free forever, by design. Same
        // treatment as temp-link invites. account_type records the origin for
        // the admin users table.
        const columnsReady = await hasPaymentColumns();
        const result = columnsReady
            ? await db.query(
                "INSERT INTO accounts (username, email, password, isactive, logged, terms_accepted, email_verified, track, account_type, is_admin_created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id",
                [lowercaseUsername, lowercaseUsername, lowercasePassword, true, false, false, true, track, 'admin_created', true]
            )
            : await db.query(
                "INSERT INTO accounts (username, email, password, isactive, logged, terms_accepted, email_verified, track) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
                [lowercaseUsername, lowercaseUsername, lowercasePassword, true, false, false, true, track]
            );

        const newUserId = result.rows[0].id;

        // Send email notification for admin-created account
        try {
            const emailSubject = `🔧 Admin Account Created - ${username} (${trackLabelAr(track)})`;
            const emailText = `
New account created by admin:

Username: ${username}
User ID: ${newUserId}
Track: ${trackLabelAr(track)} (${track})
Created: ${new Date().toLocaleString()}
Created by: Admin Panel

This account has been activated and is ready for use.
            `;

            const emailHtml = `
                <h2>🔧 Admin Account Created</h2>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>User ID:</strong> ${newUserId}</p>
                <p><strong>Track:</strong> ${trackLabelAr(track)} (${track})</p>
                <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Created by:</strong> Admin Panel</p>
                <p><strong>Status:</strong> Active and ready for use</p>
            `;

            await sendEmail(OWNER_EMAIL, emailSubject, emailText, emailHtml, { event: 'medqize.owner.admin_account_created' });
            console.log('📧 Admin account creation email sent for user:', username);
        } catch (emailError) {
            console.error('❌ Failed to send admin account creation email:', emailError);
            // Don't fail the account creation if email fails
        }

        console.log(`✅ Admin created account: ${lowercaseUsername} (ID: ${newUserId})`);
        return res.status(201).json({
            message: 'Account created successfully',
            userId: newUserId
        });

    } catch (err) {
        console.error('❌ Error creating admin account:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.get('/get_all_users', adminAuth, async (req, res) => {
    try {
        // Columns (email, created_at, updated_at, track) are ensured once at
        // startup by ensureSchema() — no per-request DDL or introspection needed.
        // ?track= narrows to one cohort; omitted returns every account.
        const { track } = req.query;
        const result = isValidTrack(track)
            ? await db.query(
                `SELECT id, username, password, logged_date, isactive, terms_accepted, email, created_at, track
                 FROM accounts WHERE track = $1`, [track])
            : await db.query(
                `SELECT id, username, password, logged_date, isactive, terms_accepted, email, created_at, track
                 FROM accounts`);
        res.json({ users: result.rows });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: "Server error while fetching users" });
    }
});

/**
 * Move an account between study tracks. Admin-only by design: a student picks
 * their track once at signup and cannot change it themselves, otherwise one
 * subscription would unlock both question banks.
 *
 * Switching a track does NOT touch the user's history. Attempts, sessions and
 * progress stay attached to the questions they were answered against, and the
 * analytics endpoints scope their denominators to the current track — so the
 * dashboard simply shows the new bank, with the old track's rows dormant and
 * intact should the account be moved back.
 */
app.post('/admin/users/:userId/track', adminAuth, async (req, res) => {
    const { userId } = req.params;
    const { track } = req.body;

    if (!isValidTrack(track)) {
        return res.status(400).json({ message: `track must be one of: ${TRACK_KEYS.join(', ')}` });
    }
    try {
        const result = await db.query(
            'UPDATE accounts SET track = $1 WHERE id = $2 RETURNING id, username, email, track',
            [track, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Their cached session carries the old track — drop it so the very next
        // request is served content from the new bank.
        invalidateSessionCache(result.rows[0].username);
        invalidateSessionCache(result.rows[0].email);
        logger.info(`Admin moved account ${userId} to the ${track} track`);
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        logger.error('Error changing user track', err);
        res.status(500).json({ message: 'Failed to change track' });
    }
});

// Helper: 30 minutes in ms
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

// Google Sign-In: verifies the ID token the frontend gets from Google
// Identity Services. No client secret involved — verifyIdToken only needs
// the client ID as the expected audience.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleOAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ============================================
// LOGIN HISTORY & ACCOUNT SHARING DETECTION
// ============================================

// Helper function to create login_history table if not exists
const ensureLoginHistoryTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS login_history (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
                username VARCHAR(255),
                ip_address VARCHAR(100),
                user_agent TEXT,
                device_type VARCHAR(50),
                browser VARCHAR(100),
                os VARCHAR(100),
                country VARCHAR(100),
                city VARCHAR(100),
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                session_token VARCHAR(255),
                is_suspicious BOOLEAN DEFAULT FALSE,
                suspicious_reason TEXT
            )
        `);

        // Add index for faster queries
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id)
        `);
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time)
        `);

        logger.info('Login history table ensured');
    } catch (err) {
        reportBootstrapFailure('ensureLoginHistoryTable', err);
    }
};

// Kicked off from bootstrapAll() below.

// ============================================
// OTP TABLE INITIALIZATION
// ============================================
const ensureOtpTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS signup_otps (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                otp_code VARCHAR(6) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE
            )
        `);
        await db.query(`
            ALTER TABLE accounts ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE
        `);
        // 6-digit code (was 4 — 10,000 combinations with no attempt limit was
        // guessable in seconds). `attempts` backs the per-code lockout in
        // verifyOtp below: 5 wrong guesses burns the code, forcing a fresh
        // send-otp round-trip instead of letting a script grind the same row.
        await db.query(`ALTER TABLE signup_otps ALTER COLUMN otp_code TYPE VARCHAR(6)`);
        await db.query(`ALTER TABLE signup_otps ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0`);
        logger.info('OTP table and email_verified column ensured');
    } catch (err) {
        reportBootstrapFailure('ensureOtpTable', err);
    }
};
// Kicked off from bootstrapAll() below.

// ============================================
// EMAIL CAMPAIGN COLUMNS INITIALIZATION
// ============================================
const ensureEmailCampaignColumns = async () => {
    try {
        await db.query(`
            ALTER TABLE accounts
                ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMP,
                ADD COLUMN IF NOT EXISTS inactivity_email_sent_at TIMESTAMP,
                ADD COLUMN IF NOT EXISTS feedback_email_sent_at TIMESTAMP
        `);
        // Mark all pre-existing accounts (older than 24 hours) as already welcomed
        // so they don't receive a welcome email on the first cron run.
        await db.query(`
            UPDATE accounts
            SET welcome_email_sent = TRUE
            WHERE welcome_email_sent = FALSE
              AND created_at < NOW() - INTERVAL '24 hours'
        `);
        logger.info('Email campaign columns ensured');
    } catch (err) {
        reportBootstrapFailure('ensureEmailCampaignColumns', err);
    }
};
// Kicked off from bootstrapAll() below.

// Temporary signup links (admin-generated free-account invites). Created at
// startup like every other table so the feature never depends on the manual
// POST /api/admin/init-temp-links-tables call having been made.
const ensureTempLinksTables = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS temporary_signup_links (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) UNIQUE NOT NULL,
                max_uses INTEGER NOT NULL DEFAULT 1,
                current_uses INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT true,
                created_by VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP,
                last_used_at TIMESTAMP
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS temp_link_accounts (
                id SERIAL PRIMARY KEY,
                link_id INTEGER NOT NULL REFERENCES temporary_signup_links(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                username VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(link_id, user_id)
            )
        `);
        // An invite link is issued for one study track, so an admin can hand a
        // nursing cohort a link that puts every account on the nursing bank
        // without the invitee having to choose (or being able to choose wrong).
        await db.query(`ALTER TABLE temporary_signup_links ADD COLUMN IF NOT EXISTS track VARCHAR(20) NOT NULL DEFAULT '${DEFAULT_TRACK}'`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_links_token ON temporary_signup_links(token)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_links_active ON temporary_signup_links(is_active)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_link_accounts_link_id ON temp_link_accounts(link_id)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_link_accounts_user_id ON temp_link_accounts(user_id)`);
        logger.info('Temporary signup links tables ensured');
    } catch (err) {
        reportBootstrapFailure('ensureTempLinksTables', err);
    }
};
// Kicked off from bootstrapAll() below.

const ensureQuestionReportsTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS question_reports (
                id SERIAL PRIMARY KEY,
                question_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                user_email TEXT NOT NULL,
                reason TEXT,
                status VARCHAR(30) DEFAULT 'pending',
                admin_note TEXT,
                old_correct_option TEXT,
                new_correct_option TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                resolved_at TIMESTAMP
            )
        `);
        logger.info('question_reports table ensured');
    } catch (err) {
        reportBootstrapFailure('ensureQuestionReportsTable', err);
    }
};
// Kicked off from bootstrapAll() below.

// ============================================
// TOPIC SUMMARIES INITIALIZATION
// ============================================
// Slide-deck summaries per exam topic + per-user reading progress. Created at
// startup (same pattern as the tables above) so the feature needs NO manual
// production migration. The two decks we already have are seeded idempotently;
// the upload script (scripts/uploadSummaries.js) fills in page_count.
const ensureSummariesTables = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS summaries (
                id SERIAL PRIMARY KEY,
                slug VARCHAR(80) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                title_en VARCHAR(255),
                question_type VARCHAR(80) NOT NULL,
                description TEXT,
                page_count INTEGER DEFAULT 0,
                r2_prefix VARCHAR(255) NOT NULL,
                is_published BOOLEAN DEFAULT TRUE,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS summary_progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                summary_id INTEGER NOT NULL REFERENCES summaries(id) ON DELETE CASCADE,
                last_page INTEGER DEFAULT 1,
                max_page_reached INTEGER DEFAULT 1,
                completed BOOLEAN DEFAULT FALSE,
                first_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (user_id, summary_id)
            )
        `);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_summary_progress_user ON summary_progress(user_id)`);
        // HTML content (the slides rendered in-app — no PDF/download). Authored in
        // content/summaryHtml and synced below so summaries are visible without R2.
        await db.query(`ALTER TABLE summaries ADD COLUMN IF NOT EXISTS content_html TEXT`);
        // Category (specialty group) + overview flag for hub grouping of main vs sub-topic decks.
        await db.query(`ALTER TABLE summaries ADD COLUMN IF NOT EXISTS category VARCHAR(80)`);
        await db.query(`ALTER TABLE summaries ADD COLUMN IF NOT EXISTS is_overview BOOLEAN DEFAULT FALSE`);
        // Study track. Every deck seeded below is medical, which the DEFAULT
        // already gives them; nursing decks are inserted with track='nursing'
        // once that content exists.
        await db.query(`ALTER TABLE summaries ADD COLUMN IF NOT EXISTS track VARCHAR(20) NOT NULL DEFAULT '${DEFAULT_TRACK}'`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_summaries_track ON summaries(track)`);

        // Seed main + sub-topic decks. question_type must match the canonical
        // questions.question_type set so "practice" links to the right bank.
        // ON CONFLICT keeps existing rows in sync with the repo (source of truth).
        await db.query(`
            INSERT INTO summaries (slug, title, title_en, question_type, description, r2_prefix, category, is_overview, sort_order)
            VALUES
                ('surgery', 'ملخص الجراحة', 'Surgery Summary', 'surgery',
                 'ملخص شامل لأهم مواضيع الجراحة عالية العائد في اختبار SMLE.', 'summaries/surgery/', 'الجراحة', TRUE, 1),
                ('trauma', 'الرضوح والطوارئ الجراحية', 'Trauma & Surgical Emergencies', 'surgery',
                 'موضوع فرعي: المسح الأولي، إصابات الصدر والبطن، الصدمة، الحروق.', 'summaries/trauma/', 'الجراحة', FALSE, 2),
                ('medicine', 'ملخص الباطنة', 'Medicine Summary', 'medicine',
                 'ملخص شامل لأهم مواضيع الباطنة عالية العائد في اختبار SMLE.', 'summaries/medicine/', 'الباطنة', TRUE, 1),
                ('cardiology', 'أمراض القلب', 'Cardiology', 'medicine',
                 'موضوع فرعي: القلب الإقفاري، فشل القلب، الصمامات، اضطرابات النظم.', 'summaries/cardiology/', 'الباطنة', FALSE, 2),
                ('pediatrics', 'ملخص طب الأطفال', 'Pediatrics Summary', 'pediatric',
                 'ملخص شامل لأهم مواضيع طب الأطفال عالية العائد في اختبار SMLE.', 'summaries/pediatrics/', 'طب الأطفال', TRUE, 1),
                ('neonatology', 'حديثو الولادة', 'Neonatology', 'pediatric',
                 'موضوع فرعي: الإنعاش، الضائقة التنفسية، اليرقان، الإنتان.', 'summaries/neonatology/', 'طب الأطفال', FALSE, 2),
                ('obgyn', 'ملخص النساء والولادة', 'OB/GYN Summary', 'obstetrics and gynecology',
                 'ملخص شامل لأهم مواضيع النساء والولادة عالية العائد في اختبار SMLE.', 'summaries/obgyn/', 'النساء والولادة', TRUE, 1),
                ('high-risk-obstetrics', 'الحمل عالي الخطورة', 'High-Risk Obstetrics', 'obstetrics and gynecology',
                 'موضوع فرعي: اضطرابات الضغط، تحسس Rh، تقييد النمو، النزف.', 'summaries/high-risk-obstetrics/', 'النساء والولادة', FALSE, 2)
            ON CONFLICT (slug) DO UPDATE SET
                title = EXCLUDED.title,
                title_en = EXCLUDED.title_en,
                question_type = EXCLUDED.question_type,
                description = EXCLUDED.description,
                category = EXCLUDED.category,
                is_overview = EXCLUDED.is_overview,
                sort_order = EXCLUDED.sort_order,
                updated_at = NOW()
        `);

        // Sync authored HTML content (repo files are the source of truth).
        for (const [slug, html] of Object.entries(summaryContent)) {
            await db.query(
                `UPDATE summaries SET content_html = $1, updated_at = NOW() WHERE slug = $2`,
                [html, slug]
            );
        }
        logger.info('summaries tables ensured');
    } catch (err) {
        reportBootstrapFailure('ensureSummariesTables', err);
    }
};

// Telegram bot/channel (see routes/telegram.js). telegram_users tracks bot
// DM subscribers independently of website accounts — no login is required to
// use the bot, so there is no account_id to hang this off. telegram_sent_questions
// is the dedupe log that stops the daily channel post and /quiz repeating a
// question too soon. telegram_quiz_attempts records answers to *private*
// quiz-polls (channel polls are always anonymous, so those can't be tracked
// per-user) — it's what /weakspots and the weekly DM job compute from.
const ensureTelegramSchema = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS telegram_users (
                id SERIAL PRIMARY KEY,
                chat_id BIGINT UNIQUE NOT NULL,
                username VARCHAR(64),
                first_name VARCHAR(128),
                track VARCHAR(20) NOT NULL DEFAULT '${DEFAULT_TRACK}',
                started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                weak_topics_sent_at TIMESTAMPTZ DEFAULT NULL,
                is_blocked BOOLEAN NOT NULL DEFAULT FALSE
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS telegram_sent_questions (
                id SERIAL PRIMARY KEY,
                question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                context VARCHAR(20) NOT NULL,
                chat_id BIGINT,
                sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS telegram_quiz_attempts (
                id SERIAL PRIMARY KEY,
                chat_id BIGINT NOT NULL,
                question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                poll_id VARCHAR(64) UNIQUE NOT NULL,
                is_correct BOOLEAN,
                sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                answered_at TIMESTAMPTZ DEFAULT NULL
            )
        `);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_telegram_sent_questions_context ON telegram_sent_questions(context, sent_at DESC)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_telegram_sent_questions_question ON telegram_sent_questions(question_id, context)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_telegram_quiz_attempts_chat ON telegram_quiz_attempts(chat_id)`);
        // Generic outbound-message log used ONLY for scheduled auto-delete.
        // Telegram lets a bot delete its own channel posts at any age (it's an
        // admin there), but only its own PRIVATE-chat messages sent within the
        // last 48 hours — a hard platform limit with no workaround. So this is
        // populated for channel posts only; DM messages are never logged here.
        await db.query(`
            CREATE TABLE IF NOT EXISTS telegram_sent_messages (
                id SERIAL PRIMARY KEY,
                chat_id VARCHAR(64) NOT NULL,
                message_id BIGINT NOT NULL,
                delete_after TIMESTAMPTZ NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_telegram_sent_messages_delete_after ON telegram_sent_messages(delete_after)`);
        // Rotation log for the weekly channel topic-summary post — picks the
        // least-recently-posted summary each week, same pattern as
        // telegram_sent_questions for the daily question.
        await db.query(`
            CREATE TABLE IF NOT EXISTS telegram_sent_summaries (
                id SERIAL PRIMARY KEY,
                summary_id INTEGER NOT NULL REFERENCES summaries(id) ON DELETE CASCADE,
                sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);
        logger.info('telegram tables ensured');
    } catch (err) {
        reportBootstrapFailure('ensureTelegramSchema', err);
    }
};

// Column backing Google sign-in. It's a login method with no password:
// `password` can no longer be required once a Google-only account can exist.
// A partial unique index (not a plain UNIQUE column) so the common case of
// "no Google account linked" doesn't collide every NULL against every other.
const ensureOAuthColumns = async () => {
    try {
        await db.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)`);
        await db.query(`ALTER TABLE accounts ALTER COLUMN password DROP NOT NULL`);
        await db.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_google_id ON accounts(google_id) WHERE google_id IS NOT NULL`);
        logger.info('OAuth column (google_id) ensured');
    } catch (err) {
        reportBootstrapFailure('ensureOAuthColumns', err);
    }
};

// All 9 schema-bootstrap checks, run ONE AT A TIME rather than each firing
// its own connection at module load. They used to run concurrently (8
// simultaneous ensureXxx() calls, unawaited) — harmless when the database is
// already warm, but on a cold start where the database itself is waking
// from being idle, 8 simultaneous new-connection attempts hitting it at once
// is exactly the shape of a burst of "Connection terminated due to
// connection timeout" errors across unrelated bootstrap functions, which is
// what started showing up after the pool's max was raised (previously max:5
// silently throttled this to 5-at-a-time; max:10 let all 8 through
// simultaneously). Sequencing them removes that burst regardless of pool
// size, and also actually delivers the ordering ensurePaymentSchema's own
// comment always claimed ("after ensureSchema so accounts table exists") —
// true only by source-order before, never enforced.
//
// No longer fire-and-forget: the first request of each process awaits this
// (see bootstrapOnce below), bounded, so nothing is ever left in flight when
// the instance freezes. A slightly slower total bootstrap is a fair trade for
// not stalling the database on every cold start.
//
// That said, sequencing within ONE process wasn't the whole story: the 9
// functions above combine for 100+ idempotent ALTER/CREATE statements, and
// that full sequence used to re-run on EVERY cold start. Fine with one
// process — but Vercel spins up several Lambda instances concurrently under
// real traffic, and each independently-running sequence piled up on the
// same table locks (ALTER TABLE accounts, CREATE INDEX on questions, ...).
// A statement stuck behind another instance's lock for longer than
// query_timeout (15s) surfaces as "Query read timeout" — which is exactly
// what showed up in prod repeatedly once traffic produced multiple
// simultaneous cold starts, on `ensureSchema` in particular (the largest of
// the 8, at ~40 statements).
//
// schema_bootstrap_version fixes that at the source: only the first cold
// start after a deploy (or the very first boot) pays for the full sequence.
// Every other concurrent or later cold start sees the version row already
// there and returns after one cheap SELECT — no DDL, no lock contention.
// Bump SCHEMA_BOOTSTRAP_VERSION whenever a statement is added to any of the
// 9 ensureXxx() functions above, so the new statement actually runs on the
// next deploy instead of being silently skipped forever.
const SCHEMA_BOOTSTRAP_VERSION = 4;
async function bootstrapAll() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS schema_bootstrap_version (
                version    INTEGER PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);
        const { rows: [current] } = await db.query(
            `SELECT version FROM schema_bootstrap_version ORDER BY version DESC LIMIT 1`
        );
        if (current && current.version >= SCHEMA_BOOTSTRAP_VERSION) {
            logger.info(`Schema already at bootstrap version ${current.version}, skipping DDL sequence`);
            return;
        }
    } catch (err) {
        reportBootstrapFailure('bootstrapAll:versionCheck', err);
        // A connection that never came up says nothing about the schema, and
        // answering it by firing 100+ DDL statements at a database we just
        // failed to reach is how the "Query read timeout" lock pile-up started
        // in the first place. Rethrow so bootstrapOnce() re-arms and the next
        // request retries the cheap check instead.
        if (isTransientConnectionError(err)) throw err;
        // Anything else (bad SQL, missing privileges) leaves the version
        // genuinely unknown — fall through to the full sequence rather than
        // silently skipping bootstrap forever.
    }
    await ensureSchema();
    await ensurePaymentSchema();
    await ensureLoginHistoryTable();
    await ensureOtpTable();
    await ensureEmailCampaignColumns();
    await ensureTempLinksTables();
    await ensureQuestionReportsTable();
    await ensureSummariesTables();
    await ensureTelegramSchema();
    await ensureOAuthColumns();
    try {
        await db.query(
            `INSERT INTO schema_bootstrap_version (version) VALUES ($1) ON CONFLICT DO NOTHING`,
            [SCHEMA_BOOTSTRAP_VERSION]
        );
    } catch (err) {
        reportBootstrapFailure('bootstrapAll:versionWrite', err);
        // Without the version row the sequence above didn't really land (the
        // ensureXxx() functions each swallow their own errors, so a connection
        // that died partway through leaves them "done" but incomplete).
        // Rethrowing re-arms bootstrapOnce() so this process retries rather
        // than serving the rest of its life against a half-applied schema.
        if (isTransientConnectionError(err)) throw err;
    }
}
// bootstrapAll() used to be fired here, unawaited, at module load — and THAT
// is what produced the endless "Connection terminated due to connection
// timeout" alerts pointing at bootstrapAll's very first query.
//
// Vercel freezes the whole instance the instant a response is sent. Module
// load happens while the first request is being served, so on any fast route
// (the / health check answers with no DB at all) the response goes out long
// before the pool has finished opening its first connection. The freeze kills
// that half-open socket, but pg-pool's connectionTimeoutMillis timer keeps
// counting across it — so the moment the instance is thawed for the next
// request, the timer fires, destroys the stream, and pg-pool rewrites the
// failure as "Connection terminated due to connection timeout". One alert per
// cold start, from a connection nothing was waiting on.
//
// That also explains why the two previous attempts couldn't work: raising
// connectionTimeoutMillis 10s -> 20s only matters if the gap is the database
// waking up, but the gap here is however long the instance stays frozen, which
// is unbounded; and version-gating the DDL didn't help because the version
// check IS the first query, i.e. the one that gets frozen.
//
// The fix is to never let bootstrap run outside a request. Inside one, the
// instance is guaranteed alive for the whole attempt. Steady-state cost is a
// single indexed SELECT on the first request of each cold start; only the
// first request after a SCHEMA_BOOTSTRAP_VERSION bump pays for the DDL.
let _bootstrapPromise = null;
function bootstrapOnce() {
    if (!_bootstrapPromise) {
        _bootstrapPromise = bootstrapAll().catch((err) => {
            _bootstrapPromise = null; // re-arm, so the next request retries
            throw err;
        });
    }
    return _bootstrapPromise;
}

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
    if (!userAgent) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };

    let device = 'Desktop';
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect device type
    if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        device = /iPad/i.test(userAgent) ? 'Tablet' : 'Mobile';
    }

    // Detect browser
    if (/Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Edge|Edg/i.test(userAgent)) browser = 'Edge';
    else if (/Opera|OPR/i.test(userAgent)) browser = 'Opera';

    // Detect OS
    if (/Windows/i.test(userAgent)) os = 'Windows';
    else if (/Mac OS|Macintosh/i.test(userAgent)) os = 'macOS';
    else if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) os = 'Linux';
    else if (/Android/i.test(userAgent)) os = 'Android';
    else if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';

    return { device, browser, os };
};

// Helper function to detect suspicious login
const detectSuspiciousLogin = async (userId, ipAddress, userAgent) => {
    try {
        // Get recent logins for this user (last 7 days)
        const recentLogins = await db.query(`
            SELECT DISTINCT ip_address, user_agent, device_type, browser, os, login_time
            FROM login_history 
            WHERE user_id = $1 AND login_time > NOW() - INTERVAL '7 days'
            ORDER BY login_time DESC
        `, [userId]);

        const { device, browser, os } = parseUserAgent(userAgent);
        const suspiciousReasons = [];

        if (recentLogins.rows.length > 0) {
            // Count unique IPs in last 24 hours
            const last24hLogins = await db.query(`
                SELECT COUNT(DISTINCT ip_address) as ip_count
                FROM login_history 
                WHERE user_id = $1 AND login_time > NOW() - INTERVAL '24 hours'
            `, [userId]);

            const uniqueIPs24h = parseInt(last24hLogins.rows[0].ip_count) || 0;

            // Flag if more than 3 different IPs in 24 hours
            if (uniqueIPs24h >= 3) {
                suspiciousReasons.push(`Multiple IPs (${uniqueIPs24h}) in 24h`);
            }

            // Count unique devices in last 7 days
            const uniqueDevices = new Set(recentLogins.rows.map(r => `${r.device_type}-${r.browser}-${r.os}`));
            if (uniqueDevices.size >= 4) {
                suspiciousReasons.push(`Multiple devices (${uniqueDevices.size}) in 7 days`);
            }

            // Check for rapid IP changes (different IP within 30 minutes)
            const lastLogin = recentLogins.rows[0];
            if (lastLogin && lastLogin.ip_address !== ipAddress) {
                const timeSinceLastLogin = Date.now() - new Date(lastLogin.login_time).getTime();
                if (timeSinceLastLogin < 30 * 60 * 1000) { // 30 minutes
                    suspiciousReasons.push('IP changed within 30 minutes');
                }
            }

            // Check for simultaneous sessions from different locations
            const concurrentSessions = await db.query(`
                SELECT COUNT(*) as count FROM login_history 
                WHERE user_id = $1 
                AND login_time > NOW() - INTERVAL '30 minutes'
                AND ip_address != $2
            `, [userId, ipAddress]);

            if (parseInt(concurrentSessions.rows[0].count) > 0) {
                suspiciousReasons.push('Concurrent sessions from different IPs');
            }
        }

        return {
            isSuspicious: suspiciousReasons.length > 0,
            reasons: suspiciousReasons.join('; ')
        };
    } catch (err) {
        logger.error('Error detecting suspicious login', err);
        return { isSuspicious: false, reasons: '' };
    }
};

app.post('/login', rateLimit(db, 'login', { windowMs: 5 * 60_000, max: 15 }), async (req, res) => {
    logger.info("Login request received", { username: req.body.username });
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Get IP and user agent for tracking
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { device, browser, os } = parseUserAgent(userAgent);

    // Convert to lowercase
    const lowercaseUsername = username.toLowerCase();
    const lowercasePassword = password.toLowerCase();

    // client is declared outside the try so the catch/finally below can reach
    // it, but the CONNECT itself now happens INSIDE the try — on a 5-connection
    // pool, db.connect() rejecting when the pool is exhausted used to throw
    // before this function's own try/catch even started, so no response was
    // ever sent (the request just hung) and nothing was released because
    // there was nothing to release yet. Every exit path below now goes through
    // one catch (which rolls back only if a client exists) and one finally
    // (which releases only if a client exists) — a client acquired here is
    // guaranteed to be released exactly once, however this function returns.
    let client;
    try {
        client = await db.connect();
        await client.query('BEGIN');
        // Sign-in is by email, full stop. This used to be a
        // `(email = $1 OR username = $1)` dual-lookup followed by a guard that
        // rejected the row whenever the match came from `username` — i.e. the
        // username branch could never succeed. Every account now has
        // username === email (enforced at boot), so matching on email alone is
        // the same set of rows minus the dead branch.
        const userResult = await client.query(
            "SELECT * FROM accounts WHERE email = $1 FOR UPDATE",
            [lowercaseUsername]
        );
        const userRow = userResult.rows[0];
        logger.debug("User row after SELECT FOR UPDATE", userRow);

        if (!userRow) {
            await client.query('ROLLBACK');
            logger.warn(`No user found for email: ${lowercaseUsername}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (lowercasePassword !== userRow.password) {
            await client.query('ROLLBACK');
            logger.warn(`Invalid password for username: ${lowercaseUsername}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if account is active (before writing anything to DB)
        if (!userRow.isactive) {
            await client.query('ROLLBACK');
            logger.warn(`Account inactive for username: ${lowercaseUsername}`);
            return res.status(403).json({
                message: 'Account is inactive. Please contact support.',
                expired: false,
                user: userRow
            });
        }

        // Legacy trial statuses land on the free tier. The 1-hour trial is
        // retired (migration 003_free_tier_40q converts everyone at boot); this
        // catches the stragglers — an account restored from a backup, or one an
        // old admin script marked 'trial_pending' before it was rewritten.
        // Nothing is taken away: the free tier keeps their account open, which
        // the trial did not.
        if (userRow.subscription_status === 'trial' || userRow.subscription_status === 'trial_pending') {
            await client.query(
                `UPDATE accounts SET subscription_status = 'free' WHERE id = $1`,
                [userRow.id]
            );
            userRow.subscription_status = 'free';
            logger.info(`Moved legacy trial account ${lowercaseUsername} to the free tier`);
        }

        // Session timeout logic
        let now = new Date();
        if (userRow.logged) {
            const lastLogin = new Date(userRow.logged_date);
            logger.debug(`User is already logged in. Last login: ${lastLogin}, Now: ${now}`);
            if (now - lastLogin < SESSION_TIMEOUT_MS) {
                logger.debug(`Session still active. Overwriting session.`);
            } else {
                // Session expired, unlock
                await client.query("UPDATE accounts SET logged = $1 WHERE id = $2", [false, userRow.id]);
                logger.debug(`Session expired. Resetting logged flag.`);
            }
        }

        // Generate a session token
        const sessionToken = crypto.randomBytes(24).toString('hex');

        // Update login state and store session token.
        await client.query(
            "UPDATE accounts SET logged = $1, logged_date = $2, session_token = $3 WHERE id = $4",
            [true, now, sessionToken, userRow.id]
        );
        // Token rotated — drop any cached session under this username (and its
        // email alias) so a previously cached old token can't pass requireSession.
        invalidateSessionCache(userRow.username);
        invalidateSessionCache(userRow.email);
        logger.debug(`Set logged=true and session_token for username: ${lowercaseUsername}`);

        // Detect suspicious activity
        const suspiciousCheck = await detectSuspiciousLogin(userRow.id, ipAddress, userAgent);

        // Record login history. country/city come from Vercel's edge geo headers
        // (present on requests that hit Vercel's network; absent in local dev,
        // where they're simply NULL) — see MONETIZATION_ANALYSIS_2026-08.md §3.5:
        // these columns existed but were NULL on all 192 logins because nothing
        // ever wrote to them.
        const geoCountry = req.headers['x-vercel-ip-country'] || null;
        let geoCity = null;
        try {
            geoCity = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : null;
        } catch (_) { /* malformed header — leave city NULL rather than fail the login */ }
        try {
            await client.query(`
                INSERT INTO login_history (user_id, username, ip_address, user_agent, device_type, browser, os, session_token, is_suspicious, suspicious_reason, country, city)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `, [userRow.id, lowercaseUsername, ipAddress, userAgent, device, browser, os, sessionToken, suspiciousCheck.isSuspicious, suspiciousCheck.reasons, geoCountry, geoCity]);
            logger.info(`Login history recorded for ${lowercaseUsername}`, { ip: ipAddress, device, suspicious: suspiciousCheck.isSuspicious, country: geoCountry });
        } catch (historyErr) {
            logger.error('Failed to record login history', historyErr);
            // Don't fail login if history recording fails
        }

        await client.query('COMMIT');
        logger.debug(`Transaction committed for username: ${lowercaseUsername}`);

        // --- Subscription state (payment readiness) ---
        // Only enforce when the migration columns exist AND the flag is on, so
        // flipping PAYMENT_ENFORCEMENT_ENABLED before migration 001 runs can
        // never lock anyone out. `active` already covers admin/grandfathered.
        let subscription = {
            enforced: false,
            status: 'free',
            active: true,
            expiryDate: null,
            daysRemaining: null,
            freeQuestionsRemaining: null,
            allowance: FREE_QUESTION_ALLOWANCE,
            reason: 'enforcement_disabled',
        };
        let freeQuestionsRemaining = null;
        try {
            const columnsReady = await hasPaymentColumns();
            if (columnsReady && isPaymentEnforcementEnabled()) {
                const { allowed, reason } = checkSubscriptionAccess(userRow);
                let daysRemaining = null;
                if (allowed && userRow.subscription_expiry_date) {
                    const ms = new Date(userRow.subscription_expiry_date).getTime() - Date.now();
                    daysRemaining = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
                }
                if (!allowed) {
                    // Free tier. `active:false` no longer means "locked out" —
                    // the account stays fully usable, this is only how much
                    // quiz allowance is left.
                    freeQuestionsRemaining = checkQuizAccess(userRow).remaining;
                }
                subscription = {
                    enforced: true,
                    status: userRow.subscription_status,
                    active: allowed,
                    expiryDate: userRow.subscription_expiry_date || null,
                    daysRemaining,
                    freeQuestionsRemaining,
                    allowance: FREE_QUESTION_ALLOWANCE,
                    reason,
                };
            }
        } catch (subErr) {
            logger.error('Failed computing subscription state at login', subErr);
        }

        const updatedUser = {
            ...userRow,
            logged: true,
            logged_date: now,
            sessionToken,
            terms_accepted: userRow.terms_accepted,
            // "Is this a PAYING account?" — no longer a lockout flag. Nothing
            // in the app may redirect on it; only quiz starts are gated, and
            // that gate is the server's 402, not this field.
            accessAllowed: subscription.active,
            // While enforcement is off, hide the raw stored status/expiry from
            // the client so paid-only UI never appears when nothing is gated.
            subscription_status: subscription.enforced ? userRow.subscription_status : 'free',
            subscription_expiry_date: subscription.enforced ? userRow.subscription_expiry_date : null,
            // Drives the free-allowance pill. null = unlimited (paid/exempt).
            free_questions_remaining: subscription.enforced ? freeQuestionsRemaining : null,
            free_question_allowance: FREE_QUESTION_ALLOWANCE,
        };

        return res.status(200).json({
            message: 'Login successful',
            // Nobody is "expired" any more — an account without a subscription
            // is a free-tier account, not a locked one. Kept as a field because
            // older clients still read it; it is now always false.
            expired: false,
            subscription,
            user: updatedUser,
            sessionToken,
            showTerms: !userRow.terms_accepted
        });

    } catch (error) {
        // client may be undefined (db.connect() itself failed) or already
        // broken (the error came from inside the transaction) — either way,
        // a ROLLBACK that itself throws must not stop the 500 from being sent.
        if (client) {
            try {
                await client.query('ROLLBACK');
            } catch (rollbackErr) {
                logger.error('Rollback failed during login', rollbackErr);
            }
        }
        logger.error('Error during login transaction', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (client) client.release();
    }
});

// Mints a session for an account whose identity a provider (Google) has
// already vouched for — no password check needed. Mirrors the tail of /login
// (session token, login_history, suspicious-login check, subscription
// shaping) so a Google account gets exactly the same session shape a
// password login gets and every downstream consumer (requireSession,
// UserContext) needs no changes.
async function issueSessionForAccount(userRow, req) {
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { device, browser, os } = parseUserAgent(userAgent);

    const now = new Date();
    const sessionToken = crypto.randomBytes(24).toString('hex');

    await db.query(
        "UPDATE accounts SET logged = $1, logged_date = $2, session_token = $3 WHERE id = $4",
        [true, now, sessionToken, userRow.id]
    );
    invalidateSessionCache(userRow.username);
    invalidateSessionCache(userRow.email);

    const suspiciousCheck = await detectSuspiciousLogin(userRow.id, ipAddress, userAgent);
    const geoCountry = req.headers['x-vercel-ip-country'] || null;
    let geoCity = null;
    try {
        geoCity = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : null;
    } catch (_) { /* malformed header — leave city NULL rather than fail the login */ }
    try {
        await db.query(`
            INSERT INTO login_history (user_id, username, ip_address, user_agent, device_type, browser, os, session_token, is_suspicious, suspicious_reason, country, city)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [userRow.id, userRow.email, ipAddress, userAgent, device, browser, os, sessionToken, suspiciousCheck.isSuspicious, suspiciousCheck.reasons, geoCountry, geoCity]);
    } catch (historyErr) {
        logger.error('Failed to record login history', historyErr);
    }

    let subscription = {
        enforced: false,
        status: 'free',
        active: true,
        expiryDate: null,
        daysRemaining: null,
        freeQuestionsRemaining: null,
        allowance: FREE_QUESTION_ALLOWANCE,
        reason: 'enforcement_disabled',
    };
    let freeQuestionsRemaining = null;
    try {
        const columnsReady = await hasPaymentColumns();
        if (columnsReady && isPaymentEnforcementEnabled()) {
            const { allowed, reason } = checkSubscriptionAccess(userRow);
            let daysRemaining = null;
            if (allowed && userRow.subscription_expiry_date) {
                const ms = new Date(userRow.subscription_expiry_date).getTime() - Date.now();
                daysRemaining = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
            }
            if (!allowed) {
                freeQuestionsRemaining = checkQuizAccess(userRow).remaining;
            }
            subscription = {
                enforced: true,
                status: userRow.subscription_status,
                active: allowed,
                expiryDate: userRow.subscription_expiry_date || null,
                daysRemaining,
                freeQuestionsRemaining,
                allowance: FREE_QUESTION_ALLOWANCE,
                reason,
            };
        }
    } catch (subErr) {
        logger.error('Failed computing subscription state at OAuth login', subErr);
    }

    const updatedUser = {
        ...userRow,
        logged: true,
        logged_date: now,
        sessionToken,
        terms_accepted: userRow.terms_accepted,
        accessAllowed: subscription.active,
        subscription_status: subscription.enforced ? userRow.subscription_status : 'free',
        subscription_expiry_date: subscription.enforced ? userRow.subscription_expiry_date : null,
        free_questions_remaining: subscription.enforced ? freeQuestionsRemaining : null,
        free_question_allowance: FREE_QUESTION_ALLOWANCE,
    };

    return {
        message: 'Login successful',
        expired: false,
        subscription,
        user: updatedUser,
        sessionToken,
        showTerms: !userRow.terms_accepted,
    };
}

// Google Sign-In. The frontend posts the ID token it gets from Google
// Identity Services; this verifies it server-side (signature + audience),
// then logs in an existing account or creates a new one — same "first
// sign-in is the sign-up" model the /login route's own account lookup
// assumes elsewhere.
app.post('/api/auth/google', rateLimit(db, 'oauth_google', { windowMs: 5 * 60_000, max: 30 }), async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ message: 'Missing Google credential' });
    }
    // Only used the first time this Google identity signs in — the signup
    // page's track modal has already resolved it by then, and /login sends
    // one along only after its own track modal resolves it too (see the
    // needsTrackSelection branch below). isValidTrack, not normalizeTrack:
    // normalizeTrack can't tell "no track sent" apart from "a real one was
    // chosen" — it silently defaults both to 'medical', which is exactly the
    // silent-default bug this branch exists to avoid. An existing account
    // below keeps whatever track it already has, regardless of what's sent.
    const requestedTrack = req.body.track;
    if (!GOOGLE_CLIENT_ID) {
        logger.error('GOOGLE_CLIENT_ID is not set — /api/auth/google cannot verify tokens');
        return res.status(500).json({ message: 'Google sign-in is not configured' });
    }

    let payload;
    try {
        const ticket = await googleOAuthClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
        payload = ticket.getPayload();
    } catch (err) {
        logger.warn('Google ID token verification failed', err);
        return res.status(401).json({ message: 'Invalid Google credential' });
    }

    if (!payload?.email || !payload.email_verified) {
        return res.status(401).json({ message: 'Google account has no verified email' });
    }
    const email = payload.email.toLowerCase().trim();
    const googleId = payload.sub;

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        let { rows: [userRow] } = await client.query('SELECT * FROM accounts WHERE email = $1 FOR UPDATE', [email]);

        if (!userRow && !isValidTrack(requestedTrack)) {
            // Brand-new identity, no track chosen yet — do NOT auto-provision
            // on a default. Every other signup path blocks on a track-choice
            // modal before creating the account; this identity gets the same
            // treatment instead of silently landing on 'medical'. The caller
            // (Login.jsx, when this happens on /login) shows that modal and
            // re-POSTs this same still-valid credential together with the
            // chosen track to finish account creation.
            await client.query('ROLLBACK');
            return res.status(200).json({ needsTrackSelection: true });
        }

        if (!userRow) {
            const inserted = await client.query(
                `INSERT INTO accounts (username, email, isactive, logged, terms_accepted, email_verified, track, google_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [email, email, true, false, false, true, requestedTrack, googleId]
            );
            userRow = inserted.rows[0];
            try {
                await sendWelcomeEmail(email, email, requestedTrack);
                await client.query('UPDATE accounts SET welcome_email_sent = TRUE, welcome_email_sent_at = NOW() WHERE id = $1', [userRow.id]);
            } catch (welcomeErr) {
                logger.error('Failed to send welcome email at Google signup', welcomeErr);
            }
            logger.info(`New account created via Google sign-in: ${email}`);
        } else if (!userRow.google_id) {
            const updated = await client.query(
                'UPDATE accounts SET google_id = $1, email_verified = TRUE WHERE id = $2 RETURNING *',
                [googleId, userRow.id]
            );
            userRow = updated.rows[0];
        }

        if (!userRow.isactive) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'Account is inactive. Please contact support.' });
        }

        await client.query('COMMIT');
        const result = await issueSessionForAccount(userRow, req);
        return res.status(200).json(result);
    } catch (err) {
        try { await client.query('ROLLBACK'); } catch (rollbackErr) { logger.error('Rollback failed during Google sign-in', rollbackErr); }
        logger.error('Error during Google sign-in', err);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Validate session endpoint
app.post('/session-validate', async (req, res) => {
    const { username } = req.body;
    // The token must be validated too — otherwise a stale token (e.g. after a
    // login on another device rotated it) would still pass the logged/timeout
    // check, send the user into the app, and then 401 on the first protected
    // request — the "logged in then instantly kicked out" symptom. Accept the
    // token from the Authorization header (preferred) or the body.
    const { sessionToken } = getSessionCredentials(req);
    try {
        // username === email for every account, so the old
        // `(username = $1 OR email = $1)` pair matched the same row twice.
        // The client still labels this field `username` in its stored session
        // object; the value it holds is the email.
        const user = await db.query(
            "SELECT id, logged, logged_date, session_token FROM accounts WHERE email = $1",
            [username]
        );
        const userRow = user.rows[0];
        if (!userRow) {
            return res.status(401).json({ valid: false, message: 'User not found' });
        }
        const now = new Date();
        const lastLogin = new Date(userRow.logged_date);
        const fresh = userRow.logged && (now - lastLogin < SESSION_TIMEOUT_MS);
        const tokenMatches = !!sessionToken && userRow.session_token === sessionToken;
        if (fresh && tokenMatches) {
            return res.status(200).json({ valid: true });
        }
        // Don't clear `logged` here: a token mismatch means THIS token is stale
        // (another device may hold the live session) — flipping logged=false would
        // disrupt the valid session. Simply report this session as invalid.
        return res.status(200).json({ valid: false, message: 'Session expired' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ valid: false, message: 'Internal server error' });
    }
});

// Add logout endpoint
app.post('/logout', async (req, res) => {
    const { username } = req.body;
    const { sessionToken } = getSessionCredentials(req);
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    try {
        // Only clear `logged` when the caller presents the account's current
        // session token — otherwise anyone who knows a username could force-log
        // that account out without ever being signed in as them. Always report
        // success either way so the client can clear its local session freely.
        if (sessionToken) {
            await db.query(
                "UPDATE accounts SET logged = false WHERE username = $1 AND session_token = $2",
                [username, sessionToken]
            );
            invalidateSessionCache(username); // drop cached session so it can't be reused
        }
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ============================================
// ADMIN DASHBOARD ENDPOINTS
// ============================================

// Get comprehensive admin statistics
app.get('/admin/stats', adminAuth, async (req, res) => {
    try {
        // Run all queries in parallel for performance. Money, subscriptions,
        // users and active-user counts are NOT queried here directly — they
        // come from services/adminMetricsService.js, the single definition
        // shared with /admin/analytics and /api/accounting/summary, so this
        // endpoint can no longer drift from the accounting page.
        const [
            totalQuizzesRes,
            quizzesTodayRes,
            quizzesWeekRes,
            avgAccuracyRes,
            loginsByDayRes,
            topUsersRes,
            suspiciousUsersRes,
            quizzesByTopicRes,
            recentLoginsRes,
            totalQuestionsAnsweredRes,
            userGrowthRes,
            quizGrowthRes,
            accuracyByTopicRes,
            hourlyActivityRes,
            wowActiveRatioRes,
            avgQuestionsPerQuizRes,
            deviceStatsRes,
            browserStatsRes,
            loginsByHourRes,
            quizCompletionRateRes,
            streakLeadersRes,
            accuracyDistributionRes,
            trackBreakdownRes,
            trackContentRes,
            users,
            activeUsers,
            revenue,
            subs,
            paidButInactive,
            signups30d,
            activeUsers30d,
            openReports,
        ] = await Promise.all([
            // Total quizzes taken
            db.query('SELECT COUNT(*) as count FROM user_quiz_sessions'),
            // Quizzes today
            db.query(`SELECT COUNT(*) as count FROM user_quiz_sessions WHERE start_time > NOW() - INTERVAL '24 hours'`),
            // Quizzes this week
            db.query(`SELECT COUNT(*) as count FROM user_quiz_sessions WHERE start_time > NOW() - INTERVAL '7 days'`),
            // Average accuracy
            db.query('SELECT ROUND(AVG(quiz_accuracy)::numeric, 1) as avg FROM user_quiz_sessions WHERE quiz_accuracy IS NOT NULL'),
            // Logins by day (last 14 days)
            db.query(`
                SELECT DATE(login_time) as date, COUNT(*) as count
                FROM login_history
                WHERE login_time > NOW() - INTERVAL '14 days'
                GROUP BY DATE(login_time)
                ORDER BY date
            `),
            // Top 10 most active users
            db.query(`
                SELECT a.id, a.username, COUNT(q.id) as quiz_count,
                       ROUND(AVG(q.quiz_accuracy)::numeric, 1) as avg_accuracy,
                       SUM(q.total_questions) as total_questions_answered,
                       MAX(q.start_time) as last_activity
                FROM accounts a
                LEFT JOIN user_quiz_sessions q ON a.id = q.user_id
                GROUP BY a.id, a.username
                HAVING COUNT(q.id) > 0
                ORDER BY quiz_count DESC
                LIMIT 10
            `),
            // Users flagged for suspicious activity
            db.query(`
                SELECT DISTINCT lh.user_id, a.username,
                       COUNT(DISTINCT lh.ip_address) as unique_ips,
                       COUNT(DISTINCT CONCAT(lh.device_type, '-', lh.browser)) as unique_devices,
                       MAX(lh.login_time) as last_login,
                       STRING_AGG(DISTINCT lh.suspicious_reason, '; ') as reasons
                FROM login_history lh
                JOIN accounts a ON lh.user_id = a.id
                WHERE lh.is_suspicious = true AND lh.login_time > NOW() - INTERVAL '30 days'
                GROUP BY lh.user_id, a.username
                ORDER BY unique_ips DESC
                LIMIT 10
            `),
            // Quizzes by topic
            db.query(`
                SELECT question_type as topic, SUM(total_answered) as count,
                       ROUND(AVG(accuracy)::numeric, 1) as avg_accuracy
                FROM user_topic_analysis
                GROUP BY question_type
                ORDER BY count DESC
            `),
            // Recent logins (last 20)
            db.query(`
                SELECT lh.*, a.username
                FROM login_history lh
                JOIN accounts a ON lh.user_id = a.id
                ORDER BY lh.login_time DESC
                LIMIT 20
            `),
            // Total questions answered across all users
            db.query('SELECT SUM(total_questions) as count FROM user_quiz_sessions'),
            // User growth by week (last 8 weeks)
            db.query(`
                SELECT DATE_TRUNC('week', created_at) as week, COUNT(*) as count
                FROM accounts
                WHERE created_at > NOW() - INTERVAL '8 weeks'
                GROUP BY DATE_TRUNC('week', created_at)
                ORDER BY week
            `),
            // Quiz growth by week (last 8 weeks)
            db.query(`
                SELECT DATE_TRUNC('week', start_time) as week, COUNT(*) as count
                FROM user_quiz_sessions
                WHERE start_time > NOW() - INTERVAL '8 weeks'
                GROUP BY DATE_TRUNC('week', start_time)
                ORDER BY week
            `),
            // Accuracy by topic (for radar chart)
            db.query(`
                SELECT question_type as topic,
                       ROUND(AVG(accuracy)::numeric, 1) as avg_accuracy,
                       SUM(total_answered) as total_questions
                FROM user_topic_analysis
                GROUP BY question_type
                ORDER BY total_questions DESC
                LIMIT 8
            `),
            // Hourly activity pattern (quizzes started by hour)
            db.query(`
                SELECT EXTRACT(HOUR FROM start_time) as hour, COUNT(*) as count
                FROM user_quiz_sessions
                WHERE start_time > NOW() - INTERVAL '30 days'
                GROUP BY EXTRACT(HOUR FROM start_time)
                ORDER BY hour
            `),
            // Week-over-week active ratio: NOT retention (it can exceed 100% —
            // it's a raw week-to-week comparison, not a cohort that was
            // tracked over time). Previously mislabelled "Retention Rate".
            db.query(`
                SELECT
                    COUNT(DISTINCT CASE WHEN logged_date > NOW() - INTERVAL '7 days' THEN id END) as active_this_week,
                    COUNT(DISTINCT CASE WHEN logged_date BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days' THEN id END) as active_last_week
                FROM accounts
            `),
            // Average questions per quiz
            db.query('SELECT ROUND(AVG(total_questions)::numeric, 1) as avg FROM user_quiz_sessions WHERE total_questions > 0'),
            // Device type distribution
            db.query(`
                SELECT device_type, COUNT(*) as count
                FROM login_history
                WHERE login_time > NOW() - INTERVAL '30 days' AND device_type IS NOT NULL
                GROUP BY device_type
                ORDER BY count DESC
            `),
            // Browser distribution
            db.query(`
                SELECT browser, COUNT(*) as count
                FROM login_history
                WHERE login_time > NOW() - INTERVAL '30 days' AND browser IS NOT NULL
                GROUP BY browser
                ORDER BY count DESC
                LIMIT 5
            `),
            // Logins by hour of day
            db.query(`
                SELECT EXTRACT(HOUR FROM login_time) as hour, COUNT(*) as count
                FROM login_history
                WHERE login_time > NOW() - INTERVAL '30 days'
                GROUP BY EXTRACT(HOUR FROM login_time)
                ORDER BY hour
            `),
            // Quiz completion rate (quizzes with results vs started)
            db.query(`
                SELECT
                    COUNT(*) as total_started,
                    COUNT(CASE WHEN quiz_accuracy IS NOT NULL THEN 1 END) as completed
                FROM user_quiz_sessions
            `),
            // Streak leaders (users with highest current streaks from user_streaks)
            db.query(`
                SELECT a.username, COALESCE(us.current_streak, 0) as streak
                FROM accounts a
                LEFT JOIN user_streaks us ON a.id = us.user_id
                ORDER BY COALESCE(us.current_streak, 0) DESC
                LIMIT 5
            `).catch(() => ({ rows: [] })),
            // Accuracy distribution (group users by accuracy ranges)
            db.query(`
                SELECT
                    CASE
                        WHEN avg_acc < 40 THEN '0-40%'
                        WHEN avg_acc < 60 THEN '40-60%'
                        WHEN avg_acc < 80 THEN '60-80%'
                        ELSE '80-100%'
                    END as range,
                    COUNT(*) as user_count
                FROM (
                    SELECT user_id, ROUND(AVG(quiz_accuracy)::numeric, 1) as avg_acc
                    FROM user_quiz_sessions
                    WHERE quiz_accuracy IS NOT NULL
                    GROUP BY user_id
                ) sub
                GROUP BY range
                ORDER BY range
            `),
            // ── Per-track rollup ──
            // The platform serves two student populations from one deployment,
            // so every headline number above is a blend. This splits users,
            // activity and subscriptions by track. Quiz metrics come from a
            // LEFT JOIN so a track with users but no quizzes still returns a row.
            db.query(`
                SELECT a.track,
                       COUNT(DISTINCT a.id)                                                    AS users,
                       COUNT(DISTINCT a.id) FILTER (WHERE a.logged_date > NOW() - INTERVAL '7 days')  AS active_users,
                       COUNT(DISTINCT a.id) FILTER (WHERE a.created_at  > NOW() - INTERVAL '7 days')  AS new_users_week,
                       COUNT(DISTINCT a.id) FILTER (WHERE a.subscription_status = 'active'
                                                      AND a.subscription_expiry_date > NOW())  AS active_subscribers,
                       COUNT(q.id)                                                             AS quizzes,
                       ROUND(AVG(q.quiz_accuracy)::numeric, 1)                                 AS avg_accuracy
                FROM accounts a
                LEFT JOIN user_quiz_sessions q ON q.user_id = a.id
                GROUP BY a.track
            `).catch(() => ({ rows: [] })),
            // Content inventory per track — how much of each bank actually
            // exists, which is what tells the admin a track is still empty.
            db.query(`
                SELECT t.track,
                       COALESCE(q.n, 0) AS questions,
                       COALESCE(s.n, 0) AS summaries
                FROM (SELECT DISTINCT track FROM questions
                      UNION SELECT DISTINCT track FROM summaries) t
                LEFT JOIN (SELECT track, COUNT(*)::int AS n FROM questions GROUP BY track) q
                       ON q.track = t.track
                LEFT JOIN (SELECT track, COUNT(*)::int AS n FROM summaries WHERE is_published = TRUE GROUP BY track) s
                       ON s.track = t.track
            `).catch(() => ({ rows: [] })),
            userSnapshot(db),
            activeUserSnapshot(db),
            revenueSnapshot(db),
            subscriptionSnapshot(db),
            paidButInactiveCount(db),
            dailySignups(db, {
                from: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
                to: new Date().toISOString().slice(0, 10),
            }),
            dailyActiveUsers(db, {
                from: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
                to: new Date().toISOString().slice(0, 10),
            }),
            openReportsCount(db),
        ]);

        // conversionSnapshot needs revenue's resolved payer set, so it can't
        // join the Promise.all above.
        const conversion = await conversionSnapshot(db, revenue.payerAccountIds);

        // Calculate derived metrics
        const wowData = wowActiveRatioRes.rows[0];
        const wowActiveRatio = wowData.active_last_week > 0
            ? Math.round((wowData.active_this_week / wowData.active_last_week) * 100)
            : 0;

        const completionData = quizCompletionRateRes.rows[0];
        const completionRate = completionData.total_started > 0
            ? Math.round((completionData.completed / completionData.total_started) * 100)
            : 0;

        // Per-track rollup: one row per track the platform knows about, even
        // when it has no users or content yet — the dashboard should show a
        // nursing row reading zero rather than omitting the track entirely.
        const trackRows = {};
        trackBreakdownRes.rows.forEach((r) => { trackRows[normalizeTrack(r.track)] = r; });
        const contentRows = {};
        trackContentRes.rows.forEach((r) => { contentRows[normalizeTrack(r.track)] = r; });
        const byTrack = TRACK_KEYS.map((key) => {
            const u = trackRows[key] || {};
            const c = contentRows[key] || {};
            return {
                track: key,
                // English — this feeds the admin panel, which stays English/LTR.
                label: trackLabelEn(key),
                users: parseInt(u.users) || 0,
                activeUsers: parseInt(u.active_users) || 0,
                newUsersWeek: parseInt(u.new_users_week) || 0,
                activeSubscribers: parseInt(u.active_subscribers) || 0,
                quizzes: parseInt(u.quizzes) || 0,
                avgAccuracy: parseFloat(u.avg_accuracy) || 0,
                questions: parseInt(c.questions) || 0,
                summaries: parseInt(c.summaries) || 0,
                specialties: specialtyKeys(key),
                // Drives the "content not ready" flag in the admin panel.
                contentReady: (parseInt(c.questions) || 0) > 0,
            };
        });

        res.json({
            byTrack,
            overview: {
                totalUsers: users.totalUsers,
                activeUsers: users.activeUsers,
                onlineNow: users.onlineNow,
                newUsersToday: users.newUsersToday,
                newUsersWeek: users.newUsersWeek,
                newUsersMonth: users.newUsersMonth,
                totalQuizzes: parseInt(totalQuizzesRes.rows[0]?.count) || 0,
                quizzesToday: parseInt(quizzesTodayRes.rows[0]?.count) || 0,
                quizzesThisWeek: parseInt(quizzesWeekRes.rows[0]?.count) || 0,
                avgAccuracy: parseFloat(avgAccuracyRes.rows[0]?.avg) || 0,
                totalQuestionsAnswered: parseInt(totalQuestionsAnsweredRes.rows[0]?.count) || 0,
                avgQuestionsPerQuiz: parseFloat(avgQuestionsPerQuizRes.rows[0]?.avg) || 0,
                wowActiveRatio,
                completionRate: completionRate,
                suspiciousCount: suspiciousUsersRes.rows.length
            },
            activeUsers,
            subscriptions: {
                // Net received is the headline everywhere: gross minus Moyasar
                // fees minus refunds, i.e. what actually reached the bank.
                // Identical to /api/accounting/summary's totals because both
                // read the same ledger via adminMetricsService.revenueSnapshot.
                netSar: revenue.netHalalas / 100,
                grossSar: revenue.grossHalalas / 100,
                feeSar: revenue.feeHalalas / 100,
                refundedSar: revenue.refundedHalalas / 100,
                thisMonthNetSar: revenue.thisMonthNetHalalas / 100,
                lastMonthNetSar: revenue.lastMonthNetHalalas / 100,
                paymentCount: revenue.count,
                payerCount: revenue.distinctPayers,
                activeSubscribers: parseInt(subs.active_subscribers) || 0,
                freeTrying: parseInt(subs.free_trying) || 0,
                freeExhaustedUnconverted: parseInt(subs.free_exhausted_unconverted) || 0,
                freeNeverStarted: parseInt(subs.free_never_started) || 0,
                grandfathered: parseInt(subs.grandfathered) || 0,
                adminCreated: parseInt(subs.admin_created) || 0,
                expiringIn7d: parseInt(subs.expiring_7d) || 0,
                expiringIn30d: parseInt(subs.expiring_30d) || 0,
                totalTried: conversion.totalTried,
                triedToPaid: conversion.triedToPaid,
                conversionRate: conversion.conversionRate,
                paidButInactive,
                recentPayments: revenue.recentPayments,
            },
            charts: {
                loginsByDay: loginsByDayRes.rows,
                userGrowth: userGrowthRes.rows,
                quizGrowth: quizGrowthRes.rows,
                hourlyActivity: hourlyActivityRes.rows,
                loginsByHour: loginsByHourRes.rows,
                deviceStats: deviceStatsRes.rows,
                browserStats: browserStatsRes.rows,
                accuracyByTopic: accuracyByTopicRes.rows,
                accuracyDistribution: accuracyDistributionRes.rows,
                dailySignups: signups30d,
                dailyActiveUsers: activeUsers30d,
                revenueByMonth: revenue.byMonth.map((m) => ({
                    month: m.month,
                    count: m.count,
                    netSar: m.netHalalas / 100,
                    grossSar: m.grossHalalas / 100,
                })),
            },
            topUsers: topUsersRes.rows,
            suspiciousUsers: suspiciousUsersRes.rows,
            quizzesByTopic: quizzesByTopicRes.rows,
            recentLogins: recentLoginsRes.rows,
            streakLeaders: streakLeadersRes.rows,
            openReports,
        });
    } catch (err) {
        logger.error('Error fetching admin stats', err);
        res.status(500).json({ message: 'Server error fetching admin statistics' });
    }
});

// ==================== EXPANDED ADMIN ANALYTICS ====================
// On-demand (not on the 2-min /admin/stats auto-refresh) so its heavier
// time-series queries don't load the DB continuously. Accepts ?from=&to=
// (ISO dates) applied to the trend charts; snapshot metrics (account mix,
// active users, engagement) are always "now".
//
// Day buckets use `login_time + INTERVAL '3 hours'` because login_time/created_at
// are stored as TZ-less UTC and Riyadh is a fixed UTC+3 (no DST) — so this gives
// the correct Saudi calendar day without depending on the server session TZ.
app.get('/admin/analytics', adminAuth, async (req, res) => {
    const MS_DAY = 86400000;
    const toISO = (d) => d.toISOString().slice(0, 10);
    const parseDate = (v, fallback) => {
        if (!v) return fallback;
        const d = new Date(v);
        return isNaN(d.getTime()) ? fallback : toISO(d);
    };

    const now = new Date();
    let to = parseDate(req.query.to, toISO(now));
    let from = parseDate(req.query.from, toISO(new Date(now.getTime() - 90 * MS_DAY)));
    if (from > to) [from, to] = [to, from];
    // Clamp the window to one year so a bad request can't scan everything.
    if ((new Date(to) - new Date(from)) / MS_DAY > 365) {
        from = toISO(new Date(new Date(to).getTime() - 365 * MS_DAY));
    }

    // Each query is independent; allSettled means one failure (e.g. a table not
    // present in some environment) degrades that section instead of 500-ing all.
    const q = (text, params) => db.query(text, params);
    const rowsOf = (settled, def = []) => settled.status === 'fulfilled' ? settled.value.rows : def;
    const firstOf = (settled, def = {}) => settled.status === 'fulfilled' ? (settled.value.rows[0] || def) : def;

    try {
        const [
            mixRes, activeRes, loginsRes, signupsRes, growthRes,
            specialtyRes, sessionRes, summaryRes
        ] = await Promise.allSettled([
            q(`SELECT
                    COUNT(*) FILTER (WHERE grandfathered_at IS NOT NULL OR subscription_status = 'grandfathered')::int AS legacy,
                    COUNT(*) FILTER (WHERE grandfathered_at IS NULL AND subscription_status = 'active')::int AS paid,
                    COUNT(*) FILTER (WHERE ${SQL_FREE_EXHAUSTED})::int AS exhausted,
                    COUNT(*)::int AS total
                FROM accounts`),
            q(`SELECT
                    COUNT(DISTINCT user_id) FILTER (WHERE login_time > NOW() - INTERVAL '1 day')::int AS dau,
                    COUNT(DISTINCT user_id) FILTER (WHERE login_time > NOW() - INTERVAL '7 days')::int AS wau,
                    COUNT(DISTINCT user_id) FILTER (WHERE login_time > NOW() - INTERVAL '30 days')::int AS mau
                FROM login_history`),
            q(`WITH days AS (SELECT generate_series($1::date, $2::date, '1 day')::date AS d),
                    l AS (
                        SELECT (login_time + INTERVAL '3 hours')::date AS d,
                               COUNT(*)::int AS logins,
                               COUNT(DISTINCT user_id)::int AS users
                        FROM login_history
                        WHERE (login_time + INTERVAL '3 hours')::date BETWEEN $1::date AND $2::date
                        GROUP BY 1
                    )
                SELECT to_char(days.d, 'YYYY-MM-DD') AS date,
                       COALESCE(l.logins, 0) AS logins,
                       COALESCE(l.users, 0) AS active_users
                FROM days LEFT JOIN l ON l.d = days.d
                ORDER BY days.d`, [from, to]),
            q(`WITH days AS (SELECT generate_series($1::date, $2::date, '1 day')::date AS d),
                    s AS (
                        SELECT (created_at + INTERVAL '3 hours')::date AS d, COUNT(*)::int AS n
                        FROM accounts
                        WHERE created_at IS NOT NULL
                          AND (created_at + INTERVAL '3 hours')::date BETWEEN $1::date AND $2::date
                        GROUP BY 1
                    )
                SELECT to_char(days.d, 'YYYY-MM-DD') AS date, COALESCE(s.n, 0) AS signups
                FROM days LEFT JOIN s ON s.d = days.d ORDER BY days.d`, [from, to]),
            q(`WITH days AS (SELECT generate_series($1::date, $2::date, '1 day')::date AS d),
                    daily AS (
                        SELECT DISTINCT user_id, (login_time + INTERVAL '3 hours')::date AS d
                        FROM login_history
                        WHERE user_id IS NOT NULL
                          AND (login_time + INTERVAL '3 hours')::date BETWEEN $1::date AND $2::date
                    ),
                    first_login AS (
                        SELECT user_id, MIN((login_time + INTERVAL '3 hours')::date) AS first_day
                        FROM login_history WHERE user_id IS NOT NULL GROUP BY user_id
                    ),
                    g AS (
                        SELECT daily.d,
                               COUNT(*) FILTER (WHERE fl.first_day = daily.d)::int AS new_users,
                               COUNT(*) FILTER (WHERE fl.first_day < daily.d)::int AS returning_users
                        FROM daily JOIN first_login fl ON fl.user_id = daily.user_id
                        GROUP BY daily.d
                    )
                SELECT to_char(days.d, 'YYYY-MM-DD') AS date,
                       COALESCE(g.new_users, 0) AS new_users,
                       COALESCE(g.returning_users, 0) AS returning_users
                FROM days LEFT JOIN g ON g.d = days.d ORDER BY days.d`, [from, to]),
            // Specialty usage comes from user_topic_analysis.question_type — the
            // medical specialty. (user_quiz_sessions.quiz_type is the quiz MODE,
            // e.g. 'practice'/'final', not the subject.)
            q(`SELECT question_type AS type, SUM(total_answered)::int AS answered
                FROM user_topic_analysis
                WHERE question_type IS NOT NULL AND question_type <> ''
                GROUP BY question_type ORDER BY answered DESC LIMIT 8`),
            q(`SELECT COUNT(*)::int AS total_sessions,
                       COALESCE(ROUND(AVG(duration) FILTER (WHERE duration > 0)), 0)::int AS avg_session_seconds
                FROM user_quiz_sessions`),
            q(`SELECT COUNT(*)::int AS total_views, COUNT(DISTINCT user_id)::int AS distinct_users
                FROM summary_progress`),
        ]);

        const mix = firstOf(mixRes, { legacy: 0, paid: 0, exhausted: 0, total: 0 });
        // "Free" here means free tier WITH allowance left; accounts that used it
        // all up are broken out separately because they are the ones worth a
        // subscribe nudge — the free tier's equivalent of "trial expired".
        const free = Math.max(0, (mix.total || 0) - (mix.legacy || 0) - (mix.paid || 0) - (mix.exhausted || 0));
        // English labels — admin stays English/LTR regardless of site language (AdminShell).
        const accountMix = [
            { key: 'paid', label: 'Paid', value: mix.paid || 0 },
            { key: 'free', label: 'Free (questions left)', value: free },
            { key: 'exhausted', label: 'Free (used up)', value: mix.exhausted || 0 },
            { key: 'legacy', label: 'Legacy', value: mix.legacy || 0 }
        ];

        // Shared with /admin/stats: same ledger, same trial→paid definition —
        // this used to be its own "distinct payers / trials ever" ratio,
        // which read differently from the dashboard's number for the same
        // metric on the same screen.
        const revenue = await revenueSnapshot(db);
        const conversion = await conversionSnapshot(db, revenue.payerAccountIds);

        const sess = firstOf(sessionRes, { total_sessions: 0, avg_session_seconds: 0 });
        const summary = firstOf(summaryRes, { total_views: 0, distinct_users: 0 });

        res.json({
            range: { from, to },
            accountMix,
            totals: {
                totalAccounts: mix.total || 0,
                paid: mix.paid || 0,
                exhausted: mix.exhausted || 0,
                legacy: mix.legacy || 0,
                free,
                triedEver: conversion.totalTried,
                payers: revenue.distinctPayers,
                triedToPaid: conversion.triedToPaid,
                triedToPaidRate: conversion.conversionRate
            },
            activeUsers: firstOf(activeRes, { dau: 0, wau: 0, mau: 0 }),
            logins: rowsOf(loginsRes),
            signups: rowsOf(signupsRes),
            growth: rowsOf(growthRes),
            engagement: {
                bySpecialty: rowsOf(specialtyRes),
                totalSessions: sess.total_sessions || 0,
                avgSessionSeconds: sess.avg_session_seconds || 0,
                summariesViews: summary.total_views || 0,
                summariesUsers: summary.distinct_users || 0
            }
        });
    } catch (err) {
        logger.error('Error fetching admin analytics', err);
        res.status(500).json({ message: 'Server error fetching admin analytics' });
    }
});

// Get detailed user info with activity
app.get('/admin/users', adminAuth, async (req, res) => {
    try {
        // Optional cohort filter — ?track=nursing lists only nursing students.
        const trackFilter = isValidTrack(req.query.track) ? 'WHERE a.track = $1' : '';
        const trackParams = trackFilter ? [req.query.track] : [];
        const usersResult = await db.query(`
            SELECT
                a.id, a.username, a.password, a.isactive, a.logged, a.logged_date,
                a.terms_accepted, a.email, a.created_at, a.track,
                a.subscription_status, a.subscription_expiry_date, a.free_questions_used,
                a.account_type, a.is_admin_created, a.grandfathered_at,
                latest_plan.plan_id,
                COUNT(DISTINCT q.id) as total_quizzes,
                ROUND(AVG(q.quiz_accuracy)::numeric, 1) as avg_accuracy,
                SUM(q.total_questions) as total_questions,
                MAX(q.start_time) as last_quiz_date
            FROM accounts a
            LEFT JOIN user_quiz_sessions q ON a.id = q.user_id
            -- Most recently purchased plan, if any — payment_events keeps this
            -- even after a subscription lapses, so it's "what did they buy",
            -- not "what's active right now" (subscription_status covers that).
            LEFT JOIN LATERAL (
                SELECT pe.raw_payload->'metadata'->>'plan' AS plan_id
                FROM payment_events pe
                WHERE pe.account_id = a.id AND pe.status = 'paid'
                ORDER BY pe.received_at DESC
                LIMIT 1
            ) latest_plan ON true
            ${trackFilter}
            GROUP BY a.id, a.username, a.password, a.isactive, a.logged, a.logged_date,
                     a.terms_accepted, a.email, a.created_at, a.track,
                     a.subscription_status, a.subscription_expiry_date, a.free_questions_used,
                     a.account_type, a.is_admin_created, a.grandfathered_at,
                     latest_plan.plan_id
            ORDER BY a.id DESC
        `, trackParams);

        // Get suspicious flags for each user
        const suspiciousResult = await db.query(`
            SELECT user_id, 
                   COUNT(DISTINCT ip_address) as unique_ips_30d,
                   COUNT(DISTINCT CONCAT(device_type, '-', browser)) as unique_devices_30d,
                   BOOL_OR(is_suspicious) as has_suspicious_activity,
                   STRING_AGG(DISTINCT suspicious_reason, '; ') FILTER (WHERE suspicious_reason IS NOT NULL AND suspicious_reason != '') as suspicious_reasons
            FROM login_history
            WHERE login_time > NOW() - INTERVAL '30 days'
            GROUP BY user_id
        `);

        const suspiciousMap = {};
        suspiciousResult.rows.forEach(row => {
            suspiciousMap[row.user_id] = {
                uniqueIPs: parseInt(row.unique_ips_30d) || 0,
                uniqueDevices: parseInt(row.unique_devices_30d) || 0,
                hasSuspiciousActivity: row.has_suspicious_activity,
                suspiciousReasons: row.suspicious_reasons || ''
            };
        });

        const users = usersResult.rows.map(user => ({
            ...user,
            total_quizzes: parseInt(user.total_quizzes) || 0,
            avg_accuracy: parseFloat(user.avg_accuracy) || 0,
            total_questions: parseInt(user.total_questions) || 0,
            suspicious: suspiciousMap[user.id] || { uniqueIPs: 0, uniqueDevices: 0, hasSuspiciousActivity: false, suspiciousReasons: '' }
        }));

        res.json({ users });
    } catch (err) {
        logger.error('Error fetching admin users', err);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// Get login history for a specific user
app.get('/admin/users/:userId/login-history', adminAuth, async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(`
            SELECT * FROM login_history 
            WHERE user_id = $1 
            ORDER BY login_time DESC 
            LIMIT 50
        `, [userId]);

        res.json({ loginHistory: result.rows });
    } catch (err) {
        logger.error('Error fetching user login history', err);
        res.status(500).json({ message: 'Server error fetching login history' });
    }
});

// Clear suspicious flag for a user
app.post('/admin/users/:userId/clear-suspicious', adminAuth, async (req, res) => {
    const { userId } = req.params;
    try {
        await db.query(`
            UPDATE login_history 
            SET is_suspicious = false, suspicious_reason = NULL 
            WHERE user_id = $1
        `, [userId]);

        res.json({ message: 'Suspicious flags cleared successfully' });
    } catch (err) {
        logger.error('Error clearing suspicious flags', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/user-analysis/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    try {
        // Columns are ensured once at startup by ensureSchema() — no per-request DDL.

        // Get overall stats, latest quiz, and last active
        const [statsRes, latestQuizRes, analysisRes, topicRes, durationRes, sourceRes] = await Promise.all([
            db.query(`
                SELECT 
                    COUNT(*) AS total_quizzes,
                    SUM(total_questions) AS total_questions_answered,
                    SUM(correct_answers) AS total_correct_answers
                FROM user_quiz_sessions
                WHERE user_id = $1;
            `, [userId]),
            db.query(`
                SELECT id, total_questions, correct_answers, quiz_accuracy, start_time, COALESCE(source, 'general') as source, topics_covered, duration, avg_time_per_question
                FROM user_quiz_sessions
                WHERE user_id = $1
                ORDER BY start_time DESC
                LIMIT 1;
            `, [userId]),
            db.query(`SELECT last_active FROM user_analysis WHERE user_id = $1`, [userId]),
            db.query(`SELECT question_type, total_answered, total_correct, accuracy
                      FROM user_topic_analysis WHERE user_id = $1`, [userId]),
            db.query(`SELECT SUM(duration) AS total_duration, AVG(duration) AS avg_duration
                      FROM user_quiz_sessions WHERE user_id = $1`, [userId]),
            db.query(`
                SELECT 
                    COALESCE(source, 'general') as source,
                    COUNT(*) AS quiz_count,
                    SUM(total_questions) AS total_questions,
                    SUM(correct_answers) AS total_correct,
                    ROUND(AVG(quiz_accuracy), 2) AS avg_accuracy
                FROM user_quiz_sessions
                WHERE user_id = $1
                GROUP BY COALESCE(source, 'general')
                ORDER BY quiz_count DESC;
            `, [userId])
        ]);

        const stats = statsRes.rows[0];
        const latestQuiz = latestQuizRes.rows[0] || {};
        const lastActive = analysisRes.rows[0]?.last_active;
        const topics = topicRes.rows;
        const durationStats = durationRes.rows[0];
        const sourceBreakdown = sourceRes.rows;

        const totalQuizzes = parseInt(stats.total_quizzes) || 0;
        const totalQuestionsAnswered = parseInt(stats.total_questions_answered) || 0;
        const totalCorrectAnswers = parseInt(stats.total_correct_answers) || 0;

        let accuracy = 0;
        if (totalQuestionsAnswered > 0) {
            accuracy = parseFloat(((totalCorrectAnswers / totalQuestionsAnswered) * 100).toFixed(2));
        }

        // Best/Worst topic calculation
        let best_topic = null;
        let worst_topic = null;
        if (topics.length > 0) {
            // First try to find topics with 5+ questions for reliability
            const reliableTopics = topics.filter(t => t.total_answered >= 5);

            if (reliableTopics.length >= 2) {
                // We have enough reliable topics
                best_topic = reliableTopics.reduce((a, b) => {
                    const aAccuracy = parseFloat(a.accuracy) || 0;
                    const bAccuracy = parseFloat(b.accuracy) || 0;
                    return aAccuracy > bAccuracy ? a : b;
                });
                worst_topic = reliableTopics.reduce((a, b) => {
                    const aAccuracy = parseFloat(a.accuracy) || 0;
                    const bAccuracy = parseFloat(b.accuracy) || 0;
                    return aAccuracy < bAccuracy ? a : b;
                });
            } else if (reliableTopics.length === 1) {
                // Only one reliable topic, include all topics for comparison
                const allTopics = topics.filter(t => t.total_answered > 0);
                if (allTopics.length >= 2) {
                    best_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy > bAccuracy ? a : b;
                    });
                    worst_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy < bAccuracy ? a : b;
                    });
                } else {
                    // Only one topic total
                    best_topic = allTopics[0];
                    worst_topic = allTopics[0];
                }
            } else {
                // No reliable topics, use all topics with at least 1 question
                const allTopics = topics.filter(t => t.total_answered > 0);
                if (allTopics.length >= 2) {
                    best_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy > bAccuracy ? a : b;
                    });
                    worst_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy < bAccuracy ? a : b;
                    });
                } else if (allTopics.length === 1) {
                    best_topic = allTopics[0];
                    worst_topic = allTopics[0];
                }
            }
        }

        const total_duration = parseInt(durationStats.total_duration) || 0;
        const avg_duration = parseFloat(durationStats.avg_duration) || 0;

        const result = {
            total_quizzes: totalQuizzes,
            total_questions_answered: totalQuestionsAnswered,
            total_correct_answers: totalCorrectAnswers,
            avg_accuracy: accuracy,
            last_active: lastActive,
            latest_quiz: {
                id: latestQuiz.id,
                total_questions: latestQuiz.total_questions || 0,
                correct_answers: latestQuiz.correct_answers || 0,
                quiz_accuracy: latestQuiz.quiz_accuracy || 0,
                start_time: latestQuiz.start_time,
                source: latestQuiz.source || 'general',
                duration: latestQuiz.duration || 0,
                avg_time_per_question: latestQuiz.avg_time_per_question || 0,
                topics_covered: (() => {
                    if (!latestQuiz.topics_covered) return [];

                    try {
                        if (typeof latestQuiz.topics_covered === 'string') {
                            const parsed = JSON.parse(latestQuiz.topics_covered);
                            return Array.isArray(parsed) ? parsed : [];
                        } else if (Array.isArray(latestQuiz.topics_covered)) {
                            return latestQuiz.topics_covered;
                        } else {
                            return [];
                        }
                    } catch (e) {
                        logger.warn("Failed to parse topics_covered", {
                            topics_covered: latestQuiz.topics_covered,
                            error: e.message
                        });
                        return [];
                    }
                })()
            },
            best_topic,
            worst_topic,
            total_duration,
            avg_duration,
            source_breakdown: sourceBreakdown
        };

        // Debug logging
        logger.debug("User analysis", {
            userId,
            sourceBreakdown,
            latestQuizSource: latestQuiz.source,
            topicsCoveredType: typeof latestQuiz.topics_covered,
            topicsCoveredValue: latestQuiz.topics_covered,
            duration: latestQuiz.duration,
            avgTimePerQuestion: latestQuiz.avg_time_per_question
        });


        res.json(result);
    } catch (err) {
        logger.error("Error fetching user analysis", err);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * Wipe one user's performance history so they can start over.
 *
 * DESTRUCTIVE AND IRREVERSIBLE — there is no undo and no backup taken.
 * Ownership is enforced by requireOwnUser — without it, any signed-in user
 * could wipe anyone else's data just by putting their id in the URL.
 *
 * Achievements are deliberately KEPT — they are earned badges, not analytics,
 * and silently deleting them would feel like data loss rather than a reset.
 * The UI states this explicitly.
 *
 * SUBSCRIBERS ONLY. Starting over is a paid convenience: a free account has one
 * lifetime run at 40 questions, so there is nothing there worth clearing and
 * offering the button only invites confusion. Note this route does NOT reset
 * accounts.free_questions_used, and must not — that counter is deliberately
 * kept outside every table wiped here so no reset can ever refill the free
 * allowance. Same rule as POST /api/reset-progress.
 */
app.post('/user-analysis/:userId/reset', requireSession, requireOwnUser('userId'), subscriberOnly, async (req, res) => {
    const { userId } = req.params;

    const TABLES = [
        'user_question_attempts',
        'user_quiz_sessions',
        'user_topic_analysis',
        'user_question_progress',
        'user_streaks',
        'user_analysis',
    ];

    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const deleted = {};
        for (const t of TABLES) {
            try {
                const r = await client.query(`DELETE FROM ${t} WHERE user_id = $1`, [userId]);
                deleted[t] = r.rowCount;
            } catch (e) {
                // A table that does not exist on this deployment must not abort
                // the whole reset — record it and carry on.
                if (e.code === '42P01') { deleted[t] = null; continue; }
                throw e;
            }
        }
        await client.query('COMMIT');
        logger.info('Analytics reset', { userId, deleted });
        res.json({ success: true, deleted });
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        logger.error('Analytics reset failed', err);
        res.status(500).json({ success: false, message: 'Reset failed. Nothing was deleted.' });
    } finally {
        client.release();
    }
});

app.get('/topic-analysis/user/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query("SELECT * FROM user_topic_analysis WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/question-attempts/user/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(
            "SELECT * FROM user_question_attempts WHERE user_id = $1 ORDER BY attempted_at DESC LIMIT 100",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Joins the question in — this is what lets the Analysis page's "last quiz"
// review render without downloading the entire question bank just to label a
// handful of attempt rows (previously /api/all-questions, ~5,000 rows, for
// every single visit). A session's attempt count is small (one quiz's worth),
// so including explanation here — unlike the bulk /api/all-questions route,
// which deliberately omits it — costs nothing.
app.get('/question-attempts/session/:sessionId', requireSession, requireOwnSession('sessionId'), async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await db.query(
            `SELECT a.*,
                    q.question_text, q.option1, q.option2, q.option3, q.option4,
                    q.question_type, q.source, q.correct_option, q.explanation
               FROM user_question_attempts a
               JOIN questions q ON q.id = a.question_id
              WHERE a.quiz_session_id = $1
              ORDER BY a.attempted_at ASC`,
            [sessionId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * The student's wrong answers, newest first.
 *
 * Searching happens HERE rather than in the browser because the page is
 * paginated: filtering the 20 rows already loaded would search a window, not a
 * history, and a student with 400 wrong answers looking for "myasthenia" would
 * be told there are none. `q` matches the question text and both answers, and
 * `type` narrows to one specialty; the count query carries the same filters so
 * "142 results" always describes what pagination will actually walk through.
 */
app.get('/wrong-questions/user/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const search = String(req.query.q || '').trim().slice(0, 120);
    const type = String(req.query.type || '').trim().slice(0, 50);

    try {
        // Built once and shared by both queries so they can never disagree.
        // $1 is always the user; search/type append in a fixed order.
        const where = [`uqa.user_id = $1`, `uqa.is_correct = false`];
        const params = [userId];
        if (search) {
            params.push(`%${search}%`);
            const p = `$${params.length}`;
            // ILIKE (not to_tsvector) on purpose: students type fragments and
            // drug-name prefixes, which a stemmed full-text match would miss.
            where.push(`(q.question_text ILIKE ${p} OR q.correct_option ILIKE ${p} OR uqa.selected_option ILIKE ${p})`);
        }
        if (type) {
            params.push(type);
            where.push(`q.question_type = $${params.length}`);
        }
        const whereSql = where.join(' AND ');

        const result = await db.query(`
            SELECT
                uqa.*,
                q.question_text,
                q.correct_option,
                q.question_type,
                q.source,
                q.explanation
            FROM user_question_attempts uqa
            JOIN questions q ON uqa.question_id = q.id
            WHERE ${whereSql}
            ORDER BY uqa.attempted_at DESC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `, [...params, parseInt(limit), parseInt(offset)]);

        // Total for pagination, plus the per-specialty breakdown that fills the
        // filter chips — computed over the search results, so a chip never
        // offers a specialty the current search has nothing in.
        const countResult = await db.query(`
            SELECT COUNT(*)::int AS total
            FROM user_question_attempts uqa
            JOIN questions q ON uqa.question_id = q.id
            WHERE ${whereSql}
        `, params);

        // Specialty facets ignore the type filter itself — otherwise selecting
        // one specialty would hide every other chip and trap the student there.
        const facetWhere = where.filter((clause) => !clause.startsWith('q.question_type ='));
        const facetParams = type ? params.slice(0, -1) : params;
        const facets = await db.query(`
            SELECT q.question_type, COUNT(*)::int AS total
            FROM user_question_attempts uqa
            JOIN questions q ON uqa.question_id = q.id
            WHERE ${facetWhere.join(' AND ')}
            GROUP BY q.question_type
            ORDER BY total DESC
        `, facetParams);

        res.json({
            wrongQuestions: result.rows,
            total: countResult.rows[0].total,
            byType: facets.rows,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('Error fetching wrong questions:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * One question's explanation, on demand.
 *
 * The review screens that build their question map from /api/all-questions
 * (which omits the column, see below) use this to fetch an explanation only
 * when the student actually opens the panel. Scoped to the caller's own track
 * so it cannot be used to read the other bank.
 */
app.get('/api/questions/:id/explanation', requireSession, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: 'Invalid question ID' });
    }
    try {
        const track = resolveContentTrack(req);
        const result = await db.query(
            'SELECT id, explanation FROM questions WHERE id = $1 AND track = $2',
            [id, track]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ id: result.rows[0].id, explanation: result.rows[0].explanation || null });
    } catch (err) {
        console.error('Error fetching question explanation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/all-questions', adminOrSubscriber, async (req, res) => {
    try {
        // Scoped to the caller's own bank. Students get their track; the admin
        // panel (Bank) may ask for either with ?track=.
        const track = resolveContentTrack(req);

        // Serve from cache when fresh — the cache is invalidated on every
        // question add/update/delete, so it can never serve stale data.
        const cached = readQuestionsCache(track);
        if (cached) return res.json({ questions: cached, track });

        // questions.source/track are ensured once at startup by ensureSchema().

        // Fetch all necessary fields for question library.
        // `explanation` is deliberately NOT selected here: it averages ~1 KB a
        // row, which would add several megabytes to a payload that is held in
        // process memory AND shipped whole to the browser. Screens that need it
        // fetch one at a time from /api/questions/:id/explanation.
        const result = await db.query(
            `SELECT id, question_text, option1, option2, option3, option4, question_type, correct_option, source, track
             FROM questions WHERE track = $1`,
            [track]
        );

        writeQuestionsCache(track, result.rows);

        res.json({ questions: result.rows, track });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * What content exists in the caller's track, so the UI can render an honest
 * empty state instead of an interface that leads to a blank quiz.
 *
 * A track is "ready" once it has questions; summaries are reported separately
 * because the two are loaded independently. Returns per-specialty counts too,
 * so the hub can grey out specialties that have nothing in them yet.
 */
app.get('/api/track-content-status', requireSession, async (req, res) => {
    try {
        const track = resolveContentTrack(req);
        // Types are namespaced per track (specialtyKeys(track) never overlaps
        // across tracks), so filtering the user's progress by that list is
        // enough to scope it to this track without a track column on
        // user_question_progress — same pattern the /quiz route uses.
        const trackTypes = specialtyKeys(track);
        const [byType, bySource, summaryCount, completedByType] = await Promise.all([
            db.query(
                `SELECT question_type, COUNT(*)::int AS total
                 FROM questions WHERE track = $1 GROUP BY question_type`,
                [track]
            ),
            db.query(
                `SELECT source, COUNT(*)::int AS total
                 FROM questions WHERE track = $1 GROUP BY source`,
                [track]
            ),
            db.query(
                `SELECT COUNT(*)::int AS total FROM summaries
                 WHERE track = $1 AND is_published = TRUE`,
                [track]
            ),
            db.query(
                `SELECT question_type, COUNT(*)::int AS completed
                 FROM user_question_progress
                 WHERE user_id = $1 AND question_type = ANY($2::text[])
                 GROUP BY question_type`,
                [req.accountId, trackTypes]
            ),
        ]);

        const questionsByType = {};
        let totalQuestions = 0;
        byType.rows.forEach((r) => {
            questionsByType[r.question_type] = r.total;
            totalQuestions += r.total;
        });

        const completedCountByType = {};
        completedByType.rows.forEach((r) => { completedCountByType[r.question_type] = r.completed; });
        const progressByType = {};
        trackTypes.forEach((type) => {
            const total = questionsByType[type] || 0;
            const completed = Math.min(completedCountByType[type] || 0, total);
            progressByType[type] = total > 0 ? Math.round((completed / total) * 100) : 0;
        });

        // The collections the launcher should offer for this track, each with
        // its live count and its recommended-study-order rank. Intersected with
        // the rows actually present, so the launcher never offers a collection
        // that would come back empty (and starts offering one the moment its
        // questions are uploaded).
        const countBySource = {};
        bySource.rows.forEach((r) => { countBySource[r.source] = r.total; });
        const priorityOrder = SOURCE_PRIORITY[track] || [];
        const selectableSources = (PICKABLE_SOURCES[track] || [])
            .filter((s) => (countBySource[s] || 0) > 0)
            .map((s) => ({ key: s, total: countBySource[s], priority: priorityOrder.indexOf(s) + 1 || undefined }));

        res.json({
            track,
            specialties: specialtyKeys(track),
            questionsByType,
            progressByType,
            // Only meaningful when there is more than one — a single collection
            // is "the bank" and the client skips the choice.
            selectableSources,
            totalQuestions,
            totalSummaries: summaryCount.rows[0].total,
            hasQuestions: totalQuestions > 0,
            hasSummaries: summaryCount.rows[0].total > 0,
        });
    } catch (err) {
        logger.error('Error fetching track content status', err);
        res.status(500).json({ message: 'Failed to fetch content status' });
    }
});

app.get('/user-streaks/:user_id', requireSession, requireOwnUser('user_id'), async (req, res) => {
    try {
        const { user_id } = req.params;

        const quizDates = await db.query(
            `SELECT DISTINCT DATE(COALESCE(end_time, start_time)) AS quiz_date
        FROM user_quiz_sessions 
        WHERE user_id = $1
        ORDER BY quiz_date ASC`,
            [user_id]
        );
        let currentStreak = 0;
        let longestStreak = 0;
        let lastActiveDate = null;

        if (quizDates.rows.length > 0) {
            const dates = quizDates.rows.map(row => new Date(row.quiz_date))
                .map(d => {
                    d.setHours(0, 0, 0, 0);
                    return d;
                })
                .sort((a, b) => a.getTime() - b.getTime());

            let runningStreak = 0;
            let prevDate = null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // Calculate streaks from most recent to oldest
            for (let i = dates.length - 1; i >= 0; i--) {
                const date = dates[i];

                if (!prevDate) {
                    runningStreak = 1;
                } else {
                    const diffDays = (prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) {
                        runningStreak++;
                    } else if (diffDays > 1) {
                        runningStreak = 1;
                    }
                }

                longestStreak = Math.max(longestStreak, runningStreak);
                prevDate = date;

                // Current streak is the streak ending on the most recent quiz date
                // or yesterday if they haven't taken a quiz today
                if (date.getTime() === today.getTime() || date.getTime() === yesterday.getTime()) {
                    currentStreak = runningStreak;
                }
            }

            lastActiveDate = dates[dates.length - 1];
        }

        // The calendar behind the number. A bare "5" says nothing about whether
        // today is already safe or about to break the run, which is the only
        // thing a streak counter is actually for — so the client gets the raw
        // active days for the last CALENDAR_DAYS and renders the week itself.
        //
        // Formatted from the local Y/M/D parts rather than toISOString(), which
        // would shift a date backwards for any timezone east of UTC and make
        // "today" look unstudied to a student in Riyadh until 03:00.
        const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const CALENDAR_DAYS = 35;
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const windowStart = todayMidnight.getTime() - (CALENDAR_DAYS - 1) * 86400000;
        const activeDays = quizDates.rows
            .map((row) => new Date(row.quiz_date))
            .map((d) => { d.setHours(0, 0, 0, 0); return d; })
            .filter((d) => d.getTime() >= windowStart)
            .map(ymd);

        res.json({
            current_streak: currentStreak,
            longest_streak: longestStreak,
            last_active_date: lastActiveDate,
            // Ascending, de-duplicated, last 35 days only — enough for a week
            // strip and a month heat row without shipping a full history.
            active_days: activeDays,
            today: ymd(todayMidnight),
            studied_today: activeDays.includes(ymd(todayMidnight)),
        });

    } catch (err) {
        console.error("Error in GET /user-streaks/:user_id", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== QUESTION BANK ====================
// Source (collection) resolution lives in config/sources.js — see that file for
// why medical uses a kept-source allowlist and nursing does not.

// De-duplicate rows by normalized question text. The same recall can exist under
// both the main bank and a monthly collection; unioning sources would otherwise
// surface it twice in one quiz.
function dedupeByText(rows) {
    const seen = new Set();
    const out = [];
    for (const r of rows) {
        const key = (r.question_text || '').trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(r);
    }
    return out;
}

app.get('/api/questions', requireQuizAccess, async (req, res) => {

    // Free accounts are served at most what is left of their lifetime
    // allowance. This clamp is the enforcement — the launcher also shows the
    // remaining count, but a hand-rolled ?limit=500 must not outrun it.
    const requested = parseInt(req.query.limit) || 10;
    const remaining = req.quizAccess?.remaining ?? Infinity;
    const limit = Math.max(1, Math.min(requested, remaining));
    const typesParam = req.query.types; // e.g., 'mix' or 'medicine,surgery'
    const sourceParam = req.query.source; // e.g., 'general', 'Midgard', 'GameBoy'
    // Progress is always the caller's own — taken from the validated session
    // (requireQuizAccess ran requireSession), never a client-supplied id, or a
    // crafted userId could pull another account's seen/unseen split.
    const userId = req.accountId;

    // Two-step random selection instead of ORDER BY RANDOM(): sorting the full
    // matching row set (with all its text columns) by a random key is an
    // O(n log n) full materialization that gets slower as the bank grows and
    // starves the small DB instance under concurrent load. Selecting just the
    // matching ids is a cheap index-friendly scan; the random pick then only
    // needs to fetch the handful of rows actually returned.

    // Category conditions (type + source) are kept separate from the "exclude
    // already-seen" filter so we can tell an exhausted category (all questions
    // already answered) apart from a genuinely empty one, and report it.
    const categoryConditions = [];
    const categoryValues = [];

    // Track first: a student only ever sees their own bank. Derived from the
    // session (requireQuizAccess ran requireSession), never from the request.
    const track = resolveContentTrack(req);
    categoryConditions.push(`track = $${categoryValues.length + 1}`);
    categoryValues.push(track);

    if (!typesParam || typesParam === 'mix') {
        // No type filter – return all types within the track
    } else {
        // Intersect with the track's own specialties so a crafted `types` list
        // can't reach across banks even if a row were mislabelled.
        const allowed = specialtyKeys(track);
        const selectedTypes = typesParam.split(',').filter((t) => allowed.includes(t));
        if (selectedTypes.length === 0) {
            return res.json({ questions: [], completed: false, totalInCategory: 0 });
        }
        categoryConditions.push(`question_type = ANY($${categoryValues.length + 1}::text[])`);
        categoryValues.push(selectedTypes);
    }

    // Always constrain to the kept unified bank so removed 2025 sources never
    // leak. A specific still-valid collection narrows further; anything else
    // (sentinel / 'mix' / absent / deleted) spans the whole allowlist.
    // Non-medical tracks have no removed sources — `track` alone is the filter.
    {
        const sources = resolveSources(sourceParam, track);
        if (sources) {
            categoryConditions.push(`source = ANY($${categoryValues.length + 1}::text[])`);
            categoryValues.push(sources);
        }
    }

    const conditions = [...categoryConditions];
    const values = [...categoryValues];

    // Exclude questions the user has already been shown: a question appears once
    // and won't reappear until the whole category has been completed and reset.
    if (userId) {
        // NOT EXISTS, not NOT IN: NOT IN's subquery plan can't use the
        // (user_id, question_id) unique index as an anti-join the way NOT
        // EXISTS can, and re-evaluates worse as a user's answered-question
        // history grows. Same result — question_id is NOT NULL, so there's
        // no NOT IN/NULL correctness gap to trade away here, only performance.
        conditions.push(`NOT EXISTS (
            SELECT 1 FROM user_question_progress uqp
            WHERE uqp.user_id = $${values.length + 1} AND uqp.question_id = questions.id
        )`);
        values.push(userId);
    }

    let idQuery = 'SELECT id FROM questions';
    if (conditions.length > 0) {
        idQuery += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        logger.debug('Executing questions id query', {
            query: idQuery.substring(0, 100) + '...',
            paramCount: values.length,
            limit
        });

        const startTime = Date.now();
        const idResult = await db.query(idQuery, values);
        const allIds = idResult.rows.map(r => r.id);

        if (allIds.length === 0) {
            // Nothing left to show. If the user has answered before, work out
            // whether the category is fully completed (so the client can show a
            // "you finished this topic" notice) vs. simply empty.
            let completed = false;
            let totalInCategory = 0;
            if (userId) {
                let countQuery = 'SELECT COUNT(*)::int AS total FROM questions';
                if (categoryConditions.length > 0) {
                    countQuery += ' WHERE ' + categoryConditions.join(' AND ');
                }
                const countRes = await db.query(countQuery, categoryValues);
                totalInCategory = countRes.rows[0].total;
                completed = totalInCategory > 0;
            }
            return res.json({ questions: [], completed, totalInCategory });
        }

        // Fisher-Yates partial shuffle: pick up to `limit` random ids
        const pickCount = Math.min(limit, allIds.length);
        for (let i = allIds.length - 1; i >= allIds.length - pickCount && i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allIds[i], allIds[j]] = [allIds[j], allIds[i]];
        }
        const pickedIds = allIds.slice(allIds.length - pickCount);

        const result = await db.query('SELECT * FROM questions WHERE id = ANY($1::int[])', [pickedIds]);

        // WHERE id = ANY(...) doesn't preserve array order, so shuffle again
        const rows = result.rows;
        for (let i = rows.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rows[i], rows[j]] = [rows[j], rows[i]];
        }

        const endTime = Date.now();
        logger.debug(`Questions query executed in ${endTime - startTime}ms, returned ${rows.length} questions`);

        const served = dedupeByText(rows);

        // Spend the free allowance HERE, for what is actually handed out — not
        // on submit. A quiz that is fetched and then abandoned (closed tab, no
        // POST /quiz-sessions ever sent) used to cost nothing, so a free
        // account could take unlimited quizzes by simply never finishing one.
        // Only accounts being metered (a finite `remaining`) are debited —
        // paid/admin/grandfathered accounts and enforcement-disabled installs
        // all report Infinity and are skipped. The WHERE clause is a second,
        // server-side confirmation of the same free-tier condition so a stale
        // `req.quizAccess` can never spend a paid account's non-existent budget.
        let freeRemaining = Number.isFinite(req.quizAccess?.remaining) ? req.quizAccess.remaining : null;
        if (Number.isFinite(req.quizAccess?.remaining) && served.length > 0) {
            try {
                const spend = await db.query(
                    `UPDATE accounts
                        SET free_questions_used = LEAST($1::int, free_questions_used + $2::int)
                      WHERE id = $3
                        AND is_admin_created = FALSE
                        AND grandfathered_at IS NULL
                        AND NOT (subscription_status = 'active'
                                 AND subscription_expiry_date > NOW())
                      RETURNING free_questions_used`,
                    [FREE_QUESTION_ALLOWANCE, served.length, req.accountId]
                );
                if (spend.rows.length > 0) {
                    freeRemaining = Math.max(0, FREE_QUESTION_ALLOWANCE - spend.rows[0].free_questions_used);
                }
            } catch (err) {
                // Never fail a served batch over the counter — worst case a
                // free user gets a few extra questions this one time.
                logger.error('Failed to spend free allowance on serve', err);
            }
        }
        res.json({ questions: served, freeRemaining });
    } catch (err) {
        logger.error('Error fetching questions', err);
        res.status(500).json({ message: 'Server error' });
    }
});



// Was unauthenticated: any caller could write (and inflate) any account's
// streak by putting its id in the body. Now requires a session and is always
// scoped to that session's own account.
app.post('/user-streaks', requireSession, async (req, res) => {
    const user_id = req.accountId;
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const hasQuizToday = await db.query(
            `SELECT 1 FROM user_quiz_sessions 
             WHERE user_id = $1 
             AND end_time BETWEEN $2 AND $3 
             LIMIT 1`,
            [user_id, todayStart, todayEnd]
        );
        if (!hasQuizToday.rows.length) {
            return res.status(400).json({ message: "No quiz completed today" });
        }

        const currentStreakData = await db.query(
            `SELECT * FROM user_streaks WHERE user_id = $1`,
            [user_id]
        );

        let currentStreak = 1;
        let longestStreak = 1;
        let lastActiveDate = new Date();
        if (currentStreakData.rows.length > 0) {
            const existing = currentStreakData.rows[0];
            const lastDate = new Date(existing.last_active_date);
            lastDate.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            if (lastDate.getTime() === yesterday.getTime()) {
                currentStreak = existing.current_streak + 1;
            } else if (lastDate.getTime() < yesterday.getTime()) {
                currentStreak = 1;
            } else {
                currentStreak = existing.current_streak;
            }
            longestStreak = Math.max(existing.longest_streak, currentStreak);
        }

        const result = await db.query(
            `INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_active_date)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id)
             DO UPDATE SET
                 current_streak = EXCLUDED.current_streak,
                 longest_streak = EXCLUDED.longest_streak,
                 last_active_date = EXCLUDED.last_active_date,
                 updated_at = NOW()
             RETURNING *`,
            [user_id, currentStreak, longestStreak, lastActiveDate]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update streak' });
    }
});

app.post('/topic-analysis', requireSession, async (req, res) => {

    const { user_id: bodyUserId, question_type, total_answered, total_correct, accuracy, avg_time } = req.body;
    // Always the authenticated session's own account — see the identical
    // guard on POST /quiz-sessions for why a body id is never trusted.
    const user_id = req.accountId;
    if (bodyUserId != null && Number(bodyUserId) !== user_id) {
        return res.status(400).json({ message: 'user_id does not match the authenticated session' });
    }
    if (!question_type || typeof accuracy !== 'number') {
        return res.status(400).json({ message: "Invalid or missing topic analysis data" });
    }
    // Reject 'general' BEFORE writing — previously this was checked after the
    // insert, so invalid rows were stored and then a 400 was returned anyway.
    if (question_type === 'general') {
        return res.status(400).json({ message: "Invalid topic: 'general' not allowed" });
    }
    try {
        const result = await db.query(
            `INSERT INTO user_topic_analysis 
            (user_id, question_type, total_answered, total_correct, accuracy, avg_time) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            ON CONFLICT (user_id, question_type) 
            DO UPDATE SET 
                total_answered = user_topic_analysis.total_answered + EXCLUDED.total_answered,
                total_correct = user_topic_analysis.total_correct + EXCLUDED.total_correct,
                accuracy = ROUND((EXCLUDED.total_correct::numeric / EXCLUDED.total_answered::numeric) * 100, 2),
                avg_time = (user_topic_analysis.avg_time * user_topic_analysis.total_answered + EXCLUDED.avg_time * EXCLUDED.total_answered) 
                            / (user_topic_analysis.total_answered + EXCLUDED.total_answered),
                last_practiced = NOW()
            RETURNING *`,
            [user_id, question_type, total_answered, total_correct, accuracy, avg_time]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update topic analysis' });
    }
});

app.post('/question-attempts', requireSession, async (req, res) => {
    const { user_id: bodyUserId, question_id, selected_option, is_correct, time_taken, quiz_session_id } = req.body;
    const user_id = req.accountId;
    if (bodyUserId != null && Number(bodyUserId) !== user_id) {
        return res.status(400).json({ message: 'user_id does not match the authenticated session' });
    }
    if (!question_id || selected_option === undefined || is_correct === undefined || time_taken === undefined || quiz_session_id === undefined) {
        return res.status(400).json({ message: "Missing required attempt data" });
    }
    try {
        const result = await db.query(
            `INSERT INTO user_question_attempts 
            (user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        logger.error("Error inserting question attempt", err);
        res.status(500).json({ message: 'Failed to record question attempt' });
    }

});

app.post('/user-analysis', requireSession, async (req, res) => {
    const { user_id: bodyUserId } = req.body;
    const user_id = req.accountId;
    if (bodyUserId != null && Number(bodyUserId) !== user_id) {
        return res.status(400).json({ message: 'user_id does not match the authenticated session' });
    }

    try {
        const statsRes = await db.query(`
      SELECT
        COUNT(*) AS total_quizzes,
        SUM(total_questions) AS total_questions_answered,
        SUM(correct_answers) AS total_correct_answers
      FROM user_quiz_sessions
      WHERE user_id = $1;
    `, [user_id]);

        const stats = statsRes.rows[0];

        const totalQuizzes = parseInt(stats.total_quizzes) || 0;
        const totalQuestionsAnswered = parseInt(stats.total_questions_answered) || 0;
        const totalCorrectAnswers = parseInt(stats.total_correct_answers) || 0;

        let accuracy = 0;
        if (totalQuestionsAnswered > 0) {
            accuracy = parseFloat(((totalCorrectAnswers / totalQuestionsAnswered) * 100).toFixed(2));
        }


        const timeRes = await db.query(`
      SELECT 
        MIN(time_taken) AS fastest, 
        MAX(time_taken) AS slowest 
      FROM user_question_attempts 
      WHERE user_id = $1;
    `, [user_id]);

        const times = timeRes.rows[0];

        const fastestResponse = parseFloat(times.fastest) || 0;
        const slowestResponse = parseFloat(times.slowest) || 0;

        const result = await db.query(`
      INSERT INTO user_analysis 
      (user_id, total_quizzes, total_questions_answered, total_correct_options, accuracy, fastest_response, slowest_response, last_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_quizzes = EXCLUDED.total_quizzes,
        total_questions_answered = EXCLUDED.total_questions_answered,
        total_correct_options = EXCLUDED.total_correct_options,
        accuracy = EXCLUDED.accuracy,
        fastest_response = EXCLUDED.fastest_response,
        slowest_response = EXCLUDED.slowest_response,
        last_active = NOW()
      RETURNING *
    `, [
            user_id,
            totalQuizzes,
            totalQuestionsAnswered,
            totalCorrectAnswers,
            accuracy,
            fastestResponse,
            slowestResponse
        ]);

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Error in /user-analysis:', err);
        res.status(500).json({ message: 'Failed to update user analysis' });
    }
});


// Deliberately NOT behind quizAccessGuard. This is where a finished quiz is
// SUBMITTED, and a free user who legitimately started their last five questions
// must be able to save them — the gate belongs at /api/questions, where a quiz
// is started. Submitting is also what spends the allowance (see below).
app.post('/quiz-sessions', requireSession, async (req, res) => {
    const {
        user_id: bodyUserId,
        total_questions,
        correct_answers,
        quiz_accuracy,
        duration,
        avg_time_per_question,
        topics_covered,
        source,
        question_ids,
        question_attempts = [], // Array of question attempts with details
        quiz_type = 'practice',
        difficulty_level = 'mixed',
        device_type = 'desktop',
        fastest_question_time = 0,
        slowest_question_time = 0,
        session_metadata = {}
    } = req.body;

    // The account this session is written to is always the authenticated
    // session's own id (requireSession sets req.accountId) — never the body's
    // user_id. Otherwise any signed-in user could write a quiz session, its
    // attempts and its progress rows onto another account just by putting its
    // id in the request. A disagreeing body id is rejected, not silently
    // overridden, since that would hide a client bug instead of surfacing it.
    const user_id = req.accountId;
    if (bodyUserId != null && Number(bodyUserId) !== user_id) {
        return res.status(400).json({ message: 'user_id does not match the authenticated session' });
    }

    if (!total_questions || typeof quiz_accuracy !== 'number') {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Schema columns are ensured once at startup by ensureSchema() — no
        // per-request DDL here anymore.

        // Determine the actual source based on the questions that were answered
        let actualSource = source || 'general';

        // If we have question IDs, determine the source from the actual questions
        if (question_ids && question_ids.length > 0) {
            try {
                const sourceQuery = await db.query(`
                    SELECT source, COUNT(*) as count 
                    FROM questions 
                    WHERE id = ANY($1) 
                    GROUP BY source 
                    ORDER BY count DESC 
                    LIMIT 1
                `, [question_ids]);

                if (sourceQuery.rows.length > 0) {
                    actualSource = sourceQuery.rows[0].source;
                }
            } catch (err) {
                console.log('Error determining source from questions:', err.message);
                // Fall back to the provided source
            }
        }

        logger.debug("Creating quiz session", {
            user_id,
            source: actualSource,
            question_count: question_ids?.length ?? 0,
            topics_covered: typeof topics_covered,
            duration: typeof duration,
            avg_time_per_question: typeof avg_time_per_question
        });

        // Calculate end time based on start time and duration
        const endTime = new Date(Date.now() + ((Number(duration) || 0) * 1000));

        const result = await db.query(
            `INSERT INTO user_quiz_sessions 
            (user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered, source, quiz_type, difficulty_level, device_type, fastest_question_time, slowest_question_time, session_metadata, end_time) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id, session_id`,
            [
                user_id,
                total_questions,
                correct_answers,
                quiz_accuracy,
                duration,
                avg_time_per_question,
                JSON.stringify(topics_covered),
                actualSource,
                quiz_type,
                difficulty_level,
                device_type,
                fastest_question_time,
                slowest_question_time,
                JSON.stringify(session_metadata),
                endTime
            ]
        );

        logger.info("Quiz session created", {
            id: result.rows[0].id,
            session_id: result.rows[0].session_id
        });

        // The free allowance is spent when questions are SERVED (see
        // GET /api/questions), not here — submitting no longer touches
        // free_questions_used at all, so there is nothing to spend or report.

        // Record question progress for each answered question (parallelized)
        let touchedCardinalities = [];
        if (question_ids && question_ids.length > 0) {
            const questionDetails = await db.query(`
                SELECT id, question_type, source
                FROM questions
                WHERE id = ANY($1)
            `, [question_ids]);

            // Parallelize question progress inserts for better performance
            const progressPromises = questionDetails.rows.map(question =>
                db.query(`
                    INSERT INTO user_question_progress (user_id, question_id, question_type, source)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (user_id, question_id) DO NOTHING
                `, [user_id, question.id, question.question_type, question.source || 'general'])
            );

            await Promise.all(progressPromises);

            // Distinct (type, source) cardinalities this quiz touched — used
            // below to tell the client which topics are now fully answered.
            const seen = new Map();
            for (const q of questionDetails.rows) {
                const type = q.question_type;
                const src = q.source || 'general';
                // Map key avoids any string delimiter: type/source contain spaces.
                seen.set(JSON.stringify([type, src]), { type, source: src });
            }
            touchedCardinalities = [...seen.values()];
        }

        // Record detailed question attempts if provided (parallelized)
        if (question_attempts && question_attempts.length > 0) {
            logger.debug("Recording question attempts", {
                attemptCount: question_attempts.length,
                sessionId: result.rows[0].id
            });

            // Parallelize question attempt inserts for better performance
            const attemptPromises = question_attempts.map(attempt =>
                db.query(`
                    INSERT INTO user_question_attempts 
                    (user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [
                    user_id,
                    attempt.question_id,
                    attempt.selected_option,
                    attempt.is_correct,
                    attempt.time_taken,
                    result.rows[0].id
                ]).catch(attemptError => {
                    logger.warn("Failed to record question attempt", {
                        error: attemptError.message,
                        attempt: attempt
                    });
                    // Return null for failed attempts so Promise.allSettled continues
                    return null;
                })
            );

            // Use allSettled to continue even if some attempts fail
            const results = await Promise.allSettled(attemptPromises);
            // Log any failures for debugging
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    logger.warn("Question attempt insert failed", {
                        attemptIndex: index,
                        error: result.reason?.message
                    });
                }
            });
        }

        // Which (type, source) topics did this quiz just finish off? A question
        // never repeats until its whole category is done, so hitting the total
        // means the user has now covered that topic end to end.
        let completedCategories = [];
        if (touchedCardinalities.length > 0) {
            const checks = await Promise.all(touchedCardinalities.map(async ({ type, source }) => {
                try {
                    const [totalRes, doneRes] = await Promise.all([
                        db.query(
                            // Track-scoped like every other bank-size denominator.
                            // Specialty names happen to be disjoint across tracks
                            // today, but "topic complete" must not depend on that.
                            `SELECT COUNT(*)::int AS c FROM questions
                              WHERE track = $1 AND question_type = $2 AND source = $3`,
                            [resolveContentTrack(req), type, source]
                        ),
                        db.query(
                            `SELECT COUNT(*)::int AS c FROM user_question_progress
                             WHERE user_id = $1 AND question_type = $2 AND source = $3`,
                            [user_id, type, source]
                        )
                    ]);
                    const total = totalRes.rows[0].c;
                    return { type, source, complete: total > 0 && doneRes.rows[0].c >= total };
                } catch (e) {
                    logger.warn('Completion check failed', { type, source, error: e.message });
                    return { type, source, complete: false };
                }
            }));
            completedCategories = checks
                .filter(c => c.complete)
                .map(({ type, source }) => ({ type, source }));
        }

        // Goal completion and streak milestones. Awaited (not fire-and-forget)
        // so the response can tell the client something was earned and the hub
        // can celebrate it immediately — but wrapped, because a notification
        // must never turn a successfully recorded quiz into a 500.
        let milestones = [];
        try {
            milestones = await checkMilestones(db, user_id);
        } catch (e) {
            logger.warn('Milestone check failed', { error: e.message });
        }

        res.status(201).json({
            id: result.rows[0].id,
            session_id: result.rows[0].session_id,
            completedCategories,
            milestones,
            message: 'Quiz session created successfully'
        });
    } catch (err) {
        logger.error("Failed to record quiz session", err);
        res.status(500).json({ message: 'Failed to record quiz session' });
    }
});

// Get quiz session history for a user
app.get('/quiz-sessions/history/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, source, quiz_type, start_date, end_date } = req.query;

    try {
        const offset = (page - 1) * limit;
        let whereConditions = ['user_id = $1'];
        let queryParams = [userId];
        let paramCount = 1;

        // Add filters
        if (source && source !== 'all') {
            paramCount++;
            whereConditions.push(`source = $${paramCount}`);
            queryParams.push(source);
        }

        if (quiz_type && quiz_type !== 'all') {
            paramCount++;
            whereConditions.push(`quiz_type = $${paramCount}`);
            queryParams.push(quiz_type);
        }

        if (start_date) {
            paramCount++;
            whereConditions.push(`start_time >= $${paramCount}`);
            queryParams.push(start_date);
        }

        if (end_date) {
            paramCount++;
            whereConditions.push(`start_time <= $${paramCount}`);
            queryParams.push(end_date);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM user_quiz_sessions 
            ${whereClause}
        `;
        const countResult = await db.query(countQuery, queryParams);
        const totalSessions = parseInt(countResult.rows[0].total);

        // Get paginated results
        const sessionsQuery = `
            SELECT 
                id,
                session_id,
                total_questions,
                correct_answers,
                quiz_accuracy,
                duration,
                avg_time_per_question,
                topics_covered,
                source,
                quiz_type,
                difficulty_level,
                device_type,
                fastest_question_time,
                slowest_question_time,
                session_metadata,
                start_time,
                end_time
            FROM user_quiz_sessions 
            ${whereClause}
            ORDER BY start_time DESC 
            LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
        `;

        const sessionsResult = await db.query(sessionsQuery, [...queryParams, limit, offset]);

        // Convert numeric fields from strings to numbers
        const sessions = sessionsResult.rows.map(session => ({
            ...session,
            total_questions: parseInt(session.total_questions) || 0,
            correct_answers: parseInt(session.correct_answers) || 0,
            quiz_accuracy: parseFloat(session.quiz_accuracy) || 0,
            duration: parseFloat(session.duration) || 0,
            avg_time_per_question: parseFloat(session.avg_time_per_question) || 0,
            fastest_question_time: parseInt(session.fastest_question_time) || 0,
            slowest_question_time: parseInt(session.slowest_question_time) || 0
        }));

        res.json({
            sessions: sessions,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalSessions / limit),
                total_sessions: totalSessions,
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        console.error('Error fetching quiz session history:', err);
        res.status(500).json({ message: 'Failed to fetch quiz session history' });
    }
});

// Get detailed quiz session by ID
app.get('/quiz-sessions/:sessionId', requireSession, requireOwnSession('sessionId'), async (req, res) => {
    const { sessionId } = req.params;

    logger.debug('Fetching quiz session details', { sessionId });

    try {
        // Check if sessionId is a number or UUID
        const isNumeric = !isNaN(sessionId) && !isNaN(parseFloat(sessionId));
        let whereClause, queryParams;

        if (isNumeric) {
            // Search by integer ID
            whereClause = 'WHERE id = $1';
            queryParams = [parseInt(sessionId)];
        } else {
            // Search by UUID session_id
            whereClause = 'WHERE session_id = $1';
            queryParams = [sessionId];
        }

        const sessionResult = await db.query(`
            SELECT 
                id,
                session_id,
                user_id,
                total_questions,
                correct_answers,
                quiz_accuracy,
                duration,
                avg_time_per_question,
                topics_covered,
                source,
                quiz_type,
                difficulty_level,
                device_type,
                fastest_question_time,
                slowest_question_time,
                session_metadata,
                start_time,
                end_time
            FROM user_quiz_sessions 
            ${whereClause}
        `, queryParams);

        logger.debug('Session query result', {
            rowCount: sessionResult.rows.length,
            sessionId,
            foundSession: sessionResult.rows[0]
        });

        if (sessionResult.rows.length === 0) {
            logger.warn('Quiz session not found', { sessionId });
            return res.status(404).json({ message: 'Quiz session not found' });
        }

        // Get question attempts for this session
        const sessionIdForAttempts = sessionResult.rows[0].id;
        logger.debug('Fetching question attempts', { sessionIdForAttempts });

        let attemptsResult;
        try {
            attemptsResult = await db.query(`
                SELECT 
                    qa.id,
                    qa.question_id,
                    qa.selected_option,
                    qa.is_correct,
                    qa.time_taken,
                    qa.created_at,
                    q.question_text,
                    q.question_type,
                    q.source,
                    q.correct_option,
                    q.option1,
                    q.option2,
                    q.option3,
                    q.option4
                FROM user_question_attempts qa
                JOIN questions q ON qa.question_id = q.id
                WHERE qa.quiz_session_id = $1
                ORDER BY qa.created_at ASC
            `, [sessionIdForAttempts]);

            logger.debug('Question attempts query result', {
                attemptCount: attemptsResult.rows.length,
                sessionIdForAttempts
            });
        } catch (attemptsError) {
            logger.warn('Error fetching question attempts, continuing without them', {
                error: attemptsError.message,
                sessionIdForAttempts
            });
            // Continue without question attempts
            attemptsResult = { rows: [] };
        }

        // Convert numeric fields from strings to numbers
        const session = sessionResult.rows[0];
        const convertedSession = {
            ...session,
            total_questions: parseInt(session.total_questions) || 0,
            correct_answers: parseInt(session.correct_answers) || 0,
            quiz_accuracy: parseFloat(session.quiz_accuracy) || 0,
            duration: parseFloat(session.duration) || 0,
            avg_time_per_question: parseFloat(session.avg_time_per_question) || 0,
            fastest_question_time: parseInt(session.fastest_question_time) || 0,
            slowest_question_time: parseInt(session.slowest_question_time) || 0
        };

        // Convert question attempts numeric fields
        const convertedAttempts = attemptsResult.rows.map(attempt => ({
            ...attempt,
            time_taken: parseFloat(attempt.time_taken) || 0
        }));

        // Check if this is an old session (no question attempts)
        const isOldSession = convertedAttempts.length === 0;

        res.json({
            session: convertedSession,
            question_attempts: convertedAttempts,
            is_old_session: isOldSession,
            message: isOldSession ? 'This is an older session. Detailed question attempts are not available for sessions created before the enhanced tracking system.' : null
        });
    } catch (err) {
        logger.error('Error fetching quiz session details', err);
        logger.error('Error details', {
            message: err.message,
            stack: err.stack,
            code: err.code,
            sessionId
        });
        res.status(500).json({
            message: 'Failed to fetch quiz session details',
            error: err.message
        });
    }
});

// Get quiz session statistics for a user
app.get('/quiz-sessions/stats/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    const { period = 'all' } = req.query; // all, week, month, year

    try {
        let dateFilter = '';
        if (period === 'week') {
            dateFilter = "AND start_time >= NOW() - INTERVAL '7 days'";
        } else if (period === 'month') {
            dateFilter = "AND start_time >= NOW() - INTERVAL '30 days'";
        } else if (period === 'year') {
            dateFilter = "AND start_time >= NOW() - INTERVAL '365 days'";
        }

        const statsResult = await db.query(`
            SELECT 
                COUNT(*) as total_sessions,
                SUM(total_questions) as total_questions_answered,
                SUM(correct_answers) as total_correct_answers,
                AVG(quiz_accuracy) as average_accuracy,
                AVG(duration) as average_duration,
                AVG(avg_time_per_question) as average_time_per_question,
                MIN(quiz_accuracy) as lowest_accuracy,
                MAX(quiz_accuracy) as highest_accuracy,
                MIN(duration) as shortest_session,
                MAX(duration) as longest_session,
                COUNT(DISTINCT source) as unique_sources,
                COUNT(DISTINCT quiz_type) as unique_quiz_types
            FROM user_quiz_sessions 
            WHERE user_id = $1 ${dateFilter}
        `, [userId]);

        // Get accuracy trends over time
        const trendsResult = await db.query(`
            SELECT 
                DATE(start_time) as date,
                COUNT(*) as sessions_count,
                AVG(quiz_accuracy) as avg_accuracy,
                AVG(duration) as avg_duration
            FROM user_quiz_sessions 
            WHERE user_id = $1 ${dateFilter}
            GROUP BY DATE(start_time)
            ORDER BY date DESC
            LIMIT 30
        `, [userId]);

        // Get source breakdown
        const sourceBreakdownResult = await db.query(`
            SELECT 
                source,
                COUNT(*) as session_count,
                AVG(quiz_accuracy) as avg_accuracy,
                SUM(total_questions) as total_questions
            FROM user_quiz_sessions 
            WHERE user_id = $1 ${dateFilter}
            GROUP BY source
            ORDER BY session_count DESC
        `, [userId]);

        res.json({
            overall_stats: statsResult.rows[0],
            accuracy_trends: trendsResult.rows,
            source_breakdown: sourceBreakdownResult.rows
        });
    } catch (err) {
        console.error('Error fetching quiz session statistics:', err);
        res.status(500).json({ message: 'Failed to fetch quiz session statistics' });
    }
});



app.post('/api/questions', adminAuth, async (req, res) => {
    const {
        question_text,
        option1,
        option2,
        option3,
        option4,
        question_type,
        correct_option,
        source = 'general',
        track,
        explanation = null
    } = req.body;
    try {
        // The specialty determines the bank — every known question_type belongs
        // to exactly one track, so a nursing question can never be filed into
        // the medical bank by a mis-set form field. Legacy/one-off types that
        // predate the tracks (e.g. 'ethics') aren't in either list; those fall
        // back to the explicitly supplied track.
        const impliedTrack = trackForSpecialty(question_type);
        if (impliedTrack && track && normalizeTrack(track) !== impliedTrack) {
            return res.status(400).json({
                message: `question_type "${question_type}" belongs to the ${impliedTrack} track, not ${track}.`
            });
        }
        const resolvedTrack = impliedTrack || normalizeTrack(track);
        const result = await db.query(
            `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option, source, track, explanation)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [question_text, option1, option2, option3, option4, question_type, correct_option, source, resolvedTrack, explanation]
        );

        // Invalidate every track's cache — a question can move between banks
        // on edit, so clearing only one of them could strand a stale row.
        questionsCache.clear();

        res.status(201).json({
            message: "Question added successfully",
            question: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});



app.get('/questions', adminAuth, async (req, res) => {
    try {
        // Admin-only: ?track= narrows to one bank, omitting it returns both so
        // existing tooling that expects the full table keeps working.
        const { track } = req.query;
        const result = isValidTrack(track)
            ? await db.query("SELECT * FROM questions WHERE track = $1 ORDER BY id", [track])
            : await db.query("SELECT * FROM questions ORDER BY id");
        res.json({ questions: result.rows });
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Check if user has completed all questions in a cardinality (type + source combination)
app.get('/api/check-completion/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    const { type, source } = req.query;

    try {
        // Get total questions for this cardinality, within the caller's bank
        const track = resolveContentTrack(req);
        const totalQuery = await db.query(`
            SELECT COUNT(*) as total
            FROM questions
            WHERE track = $1 AND question_type = $2 AND source = $3
        `, [track, type, source]);

        // Get completed questions for this cardinality
        const completedQuery = await db.query(`
            SELECT COUNT(*) as completed
            FROM user_question_progress 
            WHERE user_id = $1 AND question_type = $2 AND source = $3
        `, [userId, type, source]);

        const total = parseInt(totalQuery.rows[0].total);
        const completed = parseInt(completedQuery.rows[0].completed);
        const isCompleted = total > 0 && completed >= total;

        res.json({
            total,
            completed,
            isCompleted,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        });
    } catch (err) {
        console.error('Error checking completion:', err);
        res.status(500).json({ message: 'Failed to check completion' });
    }
});

// Award achievement when user completes a cardinality
app.post('/api/award-achievement', requireSession, async (req, res) => {
    const { userId: bodyUserId, achievementType, achievementKey, achievementName, achievementDescription } = req.body;
    // Always the authenticated session's own account — see the identical
    // guard on POST /quiz-sessions.
    const userId = req.accountId;
    if (bodyUserId != null && Number(bodyUserId) !== userId) {
        return res.status(400).json({ message: 'userId does not match the authenticated session' });
    }

    try {
        const result = await db.query(`
            INSERT INTO user_achievements (user_id, achievement_type, achievement_key, achievement_name, achievement_description)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, achievement_type, achievement_key) DO NOTHING
            RETURNING *
        `, [userId, achievementType, achievementKey, achievementName, achievementDescription]);

        res.json({ success: true, achievement: result.rows[0] });
    } catch (err) {
        console.error('Error awarding achievement:', err);
        res.status(500).json({ message: 'Failed to award achievement' });
    }
});

// Get user achievements
app.get('/api/user-achievements/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await db.query(`
            SELECT * FROM user_achievements 
            WHERE user_id = $1 
            ORDER BY earned_at DESC
        `, [userId]);

        res.json({ achievements: result.rows });
    } catch (err) {
        console.error('Error fetching achievements:', err);
        res.status(500).json({ message: 'Failed to fetch achievements' });
    }
});

// Reset user progress so a finished category can be practised again.
// Accepts either a single `type` (legacy) or a `types` array (the whole
// selection the user was quizzing on). An empty/omitted types list resets
// every type for that source.
//
// SUBSCRIBERS ONLY. Wiping user_question_progress puts already-answered
// questions back in the pool, which is a subscriber convenience — a free
// account has one lifetime run at 40 questions and nothing to re-practise.
// The 40 are counted in accounts.free_questions_used, which this route does
// NOT touch, so resetting was never an unlimited-questions exploit; the gate
// is here because "practise this category again" is a paid feature, not
// because the counter needs defending. Keep both properties true.
app.post('/api/reset-progress', requireSession, subscriberOnly, async (req, res) => {
    const { type, types, source } = req.body;

    // The account comes from the validated session, never from the body — a
    // client-supplied userId here would let any signed-in user wipe anyone
    // else's progress.
    const userId = req.accountId;
    if (!userId) {
        return res.status(401).json({ message: 'Session could not be resolved' });
    }

    // Normalise to a list; `type` kept for older clients.
    let typeList = [];
    if (Array.isArray(types)) typeList = types.filter(Boolean);
    else if (type) typeList = [type];

    // 'mix' (or no source) means the quiz spanned every source, so reset them all.
    const allSources = !source || source === 'mix';

    const conditions = ['user_id = $1'];
    const values = [userId];
    if (!allSources) {
        conditions.push(`source = $${values.length + 1}`);
        values.push(source);
    }
    if (typeList.length > 0) {
        conditions.push(`question_type = ANY($${values.length + 1}::text[])`);
        values.push(typeList);
    }

    try {
        const del = await db.query(
            `DELETE FROM user_question_progress WHERE ${conditions.join(' AND ')}`,
            values
        );

        res.json({ success: true, cleared: del.rowCount, message: 'Progress reset successfully' });
    } catch (err) {
        console.error('Error resetting progress:', err);
        res.status(500).json({ message: 'Failed to reset progress' });
    }
});

// Note: progress tables + performance indexes are now created at startup by
// ensureSchema() (see top of file) — the manual /init-progress-tables endpoint
// was removed.

// Debug endpoint to check database schema
app.get('/debug/schema', adminAuth, async (req, res) => {
    try {
        const tables = ['user_quiz_sessions', 'questions'];
        const schema = {};

        for (const table of tables) {
            const result = await db.query(`
                SELECT column_name, data_type, column_default, is_nullable
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [table]);
            schema[table] = result.rows;
        }

        res.json(schema);
    } catch (err) {
        console.error("Error fetching schema:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Debug endpoint to check quiz sessions data
app.get('/debug/quiz-sessions/:userId', adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        // First, check what columns exist
        const columnsCheck = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'user_quiz_sessions'
            ORDER BY ordinal_position;
        `);

        console.log('Available columns in user_quiz_sessions:', columnsCheck.rows);

        const result = await db.query(`
            SELECT id, user_id, total_questions, correct_answers, COALESCE(source, 'general') as source, start_time, duration, avg_time_per_question
            FROM user_quiz_sessions 
            WHERE user_id = $1 
            ORDER BY start_time DESC 
            LIMIT 10
        `, [userId]);

        res.json({
            columns: columnsCheck.rows,
            quiz_sessions: result.rows
        });
    } catch (err) {
        console.error("Error fetching quiz sessions:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.get('/questions/:id', adminAuth, async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }

    try {
        const result = await db.query("SELECT * FROM questions WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ question: result.rows[0] });
    } catch (err) {
        console.error("Error fetching question:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.delete('/questions/:id', adminAuth, async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }

    try {
        const result = await db.query(
            "DELETE FROM questions WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Invalidate every track's cache — a question can move between banks
        // on edit, so clearing only one of them could strand a stale row.
        questionsCache.clear();

        res.json({
            message: "Question deleted successfully",
            question: result.rows[0]
        });
    } catch (err) {
        console.error("Error deleting question:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.put('/questions/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const {
        question_text,
        option1,
        option2,
        option3,
        option4,
        question_type,
        correct_option,
        source,
        explanation
    } = req.body;

    // Input validation
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }

    if (!question_text || !option1 || !option2 || !option3 || !option4 || !correct_option) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Keep track in lockstep with question_type: re-filing a question under a
    // different specialty moves it to that specialty's bank in the same write,
    // so the two columns can never disagree. A legacy type that belongs to no
    // track (e.g. 'ethics') leaves the existing track alone — COALESCE keeps
    // such rows editable instead of 400ing on every save.
    const impliedTrack = trackForSpecialty(question_type);

    // The explanation is only touched when the caller actually sent the field.
    // Older tooling (and the mobile admin path) posts the eight original fields
    // and nothing else — treating a missing key as null would silently wipe an
    // explanation on every unrelated edit. Sending an empty string still clears
    // it, so the admin form can remove one deliberately.
    const setsExplanation = Object.prototype.hasOwnProperty.call(req.body, 'explanation');

    try {
        const result = await db.query(
            `UPDATE questions
             SET question_text = $1,
                 option1 = $2,
                 option2 = $3,
                 option3 = $4,
                 option4 = $5,
                 question_type = $6,
                 correct_option = $7,
                 source = $8,
                 track = COALESCE($9, track),
                 explanation = CASE WHEN $10::boolean THEN $11 ELSE explanation END
             WHERE id = $12
             RETURNING *`,
            [question_text, option1, option2, option3, option4,
                question_type, correct_option, source, impliedTrack,
                setsExplanation, explanation || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Invalidate every track's cache — a question can move between banks
        // on edit, so clearing only one of them could strand a stale row.
        questionsCache.clear();

        res.json({
            message: "Question updated successfully",
            question: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating question:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Free trial endpoints removed - accounts are now free

// Get user progress data
app.get('/quiz-sessions/progress/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;

    try {
        logger.debug('Fetching progress data', { userId });

        // Denominators are per-bank: "how much of the question bank have I
        // covered" must not count the other track's questions.
        const track = resolveContentTrack(req);

        // Get total questions count
        const totalQuestionsResult = await db.query(`
            SELECT COUNT(*) as total_questions
            FROM questions WHERE track = $1
        `, [track]);

        // Get answered questions count
        const answeredQuestionsResult = await db.query(`
            SELECT COUNT(DISTINCT question_id) as answered_questions
            FROM user_question_attempts
            WHERE user_id = $1
        `, [userId]);

        const totalQuestions = parseInt(totalQuestionsResult.rows[0].total_questions);
        const answeredQuestions = parseInt(answeredQuestionsResult.rows[0].answered_questions);
        const percentageCompleted = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
        const remainingQuestions = totalQuestions - answeredQuestions;

        // Get source breakdown
        const sourceBreakdownResult = await db.query(`
            SELECT 
                COALESCE(q.source, 'general') as source,
                COUNT(DISTINCT q.id) as total_questions,
                COUNT(DISTINCT uqa.question_id) as answered_questions
            FROM questions q
            LEFT JOIN user_question_attempts uqa ON q.id = uqa.question_id AND uqa.user_id = $1
            WHERE q.track = $2
            GROUP BY COALESCE(q.source, 'general')
        `, [userId, track]);

        const sourceBreakdown = {};
        sourceBreakdownResult.rows.forEach(row => {
            sourceBreakdown[row.source] = {
                total: parseInt(row.total_questions),
                answered: parseInt(row.answered_questions)
            };
        });

        // Get question type breakdown
        const typeBreakdownResult = await db.query(`
            SELECT 
                q.question_type,
                COUNT(DISTINCT q.id) as total_questions,
                COUNT(DISTINCT uqa.question_id) as answered_questions
            FROM questions q
            LEFT JOIN user_question_attempts uqa ON q.id = uqa.question_id AND uqa.user_id = $1
            WHERE q.track = $2
            GROUP BY q.question_type
        `, [userId, track]);

        const typeBreakdown = {};
        typeBreakdownResult.rows.forEach(row => {
            typeBreakdown[row.question_type] = {
                total: parseInt(row.total_questions),
                answered: parseInt(row.answered_questions)
            };
        });

        const progressData = {
            totalQuestions,
            answeredQuestions,
            percentageCompleted,
            remainingQuestions,
            sourceBreakdown,
            typeBreakdown
        };

        logger.info('Progress data fetched successfully', {
            userId,
            totalQuestions,
            answeredQuestions,
            percentageCompleted
        });

        res.json(progressData);

    } catch (err) {
        logger.error('Error fetching progress data', {
            error: err.message,
            userId
        });
        res.status(500).json({ message: 'Failed to fetch progress data' });
    }
});

// Get user account/subscription status — surfaces real subscription state
// (status, expiry, days remaining) while enforcement is enabled.
//
// Was completely unauthenticated: username, email, subscription status/expiry
// and the last purchase amount for ANY account id, no session required — a
// full customer list to anyone willing to iterate ids. Both real callers
// (AccountPage, FreeAllowanceBanner) already send session credentials for
// their own id, so requireSession plus this ownership check changes nothing
// for legitimate use.
app.get('/api/user-subscription/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;

    try {
        // Select subscription columns only if migration 001 has been applied;
        // otherwise fall back to the legacy column set.
        const columnsReady = await hasPaymentColumns();
        const selectCols = columnsReady
            ? `id, username, email, isactive,
               subscription_status, subscription_expiry_date, free_questions_used,
               grandfathered_at, account_type, is_admin_created`
            : `id, username, email, isactive`;

        const result = await db.query(
            `SELECT ${selectCols} FROM accounts WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        // Enforcement only possible once both the flag is on AND columns exist.
        const enforcementEnabled = columnsReady && process.env.PAYMENT_ENFORCEMENT_ENABLED === 'true';

        // Enforcement disabled => everyone is free with unlimited access.
        let daysRemaining = null;
        let freeQuestionsRemaining = null;
        let purchase = null;
        if (enforcementEnabled) {
            if (user.subscription_expiry_date) {
                const ms = new Date(user.subscription_expiry_date).getTime() - Date.now();
                daysRemaining = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
            }
            const quiz = checkQuizAccess(user);
            freeQuestionsRemaining = Number.isFinite(quiz.remaining) ? quiz.remaining : null;

            // WHICH plan they bought, and when. The accounts table only stores
            // an expiry date, so "you are subscribed until March" was all the
            // account page could ever say — not whether that was a 50 SAR month
            // or a 300 SAR year. The plan id lives in the payment's metadata,
            // so the most recent paid event is the record of what was sold.
            //
            // livemode IS DISTINCT FROM FALSE keeps Moyasar test payments out,
            // the same filter the accounting ledger uses.
            try {
                const paid = await db.query(
                    `SELECT gateway_ref, amount_halalas, currency, received_at,
                            raw_payload->'metadata'->>'plan' AS plan_id
                       FROM payment_events
                      WHERE account_id = $1 AND status = 'paid'
                        AND livemode IS DISTINCT FROM FALSE
                      ORDER BY received_at DESC
                      LIMIT 1`,
                    [userId]
                );
                if (paid.rows.length > 0) {
                    const row = paid.rows[0];
                    const plan = getPlan(row.plan_id);
                    purchase = {
                        planId: row.plan_id || null,
                        months: plan?.months ?? null,
                        seats: plan?.seats ?? 1,
                        isGroup: plan?.kind === 'group',
                        amountSar: Number(row.amount_halalas || 0) / 100,
                        currency: row.currency || 'SAR',
                        startedAt: row.received_at,
                    };
                }
            } catch (err) {
                // A missing payment history must never break the account page —
                // the subscription state above is the part that matters.
                logger.warn('Could not resolve last purchase', { userId, error: err.message });
            }
        }

        res.json({
            enforcement: enforcementEnabled,
            allowance: FREE_QUESTION_ALLOWANCE,
            // Every plan is a single charge. Stated by the API too, so any
            // client showing subscription details says the same thing.
            autoRenew: false,
            // null when this account has never paid (free tier, grandfathered,
            // or admin-created).
            purchase,
            user: {
                ...user,
                isactive: user.isactive,
                // While enforcement is off, report free access regardless of stored status.
                subscription_status: enforcementEnabled ? user.subscription_status : 'free',
                daysRemaining,
                // null = unlimited (paid, admin-created or grandfathered).
                freeQuestionsRemaining
            }
        });
    } catch (error) {
        console.error('Error fetching user status:', error);
        res.status(500).json({ message: 'Failed to fetch user status' });
    }
});

app.delete('/users/:userId', adminAuth, async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        // Money always wins over an admin cleanup click — a paying customer's
        // history must never be deletable by accident. See MONETIZATION_ANALYSIS_2026-08.md §6.1:
        // account 231 was deleted four days after paying, and the payment_events
        // row survived (ON DELETE SET NULL) but the account and its access didn't.
        const paidCheck = await db.query(
            `SELECT 1 FROM payment_events WHERE account_id = $1 AND status = 'paid' LIMIT 1`,
            [userId]
        );
        if (paidCheck.rows.length > 0) {
            return res.status(409).json({
                message: 'This account has a paid payment on record and cannot be deleted. Refund or archive it instead.',
            });
        }

        // Start a transaction to ensure all deletions succeed or fail together
        const client = await db.connect();

        try {
            await client.query('BEGIN');

            // Delete user data from all related tables in the correct order
            // (respecting foreign key constraints)

            // 1. Delete question attempts
            await client.query(
                'DELETE FROM user_question_attempts WHERE user_id = $1',
                [userId]
            );

            // 2. Delete quiz sessions
            await client.query(
                'DELETE FROM user_quiz_sessions WHERE user_id = $1',
                [userId]
            );

            // 3. Delete topic analysis
            await client.query(
                'DELETE FROM user_topic_analysis WHERE user_id = $1',
                [userId]
            );

            // 4. Delete user streaks
            await client.query(
                'DELETE FROM user_streaks WHERE user_id = $1',
                [userId]
            );

            // 5. Delete user analysis
            await client.query(
                'DELETE FROM user_analysis WHERE user_id = $1',
                [userId]
            );

            // 6. Finally, delete the user account from accounts table
            const result = await client.query(
                'DELETE FROM accounts WHERE id = $1 RETURNING username',
                [userId]
            );

            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'User not found' });
            }

            await client.query('COMMIT');

            res.json({
                message: `User '${result.rows[0].username}' and all associated data deleted successfully`
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Failed to delete user and associated data' });
    }
});

// Helper to extract session credentials from the request.
// The session token is read from the `Authorization: Bearer <token>` header so
// it never has to travel in the URL (where it would leak into access logs,
// browser history and the Referer header). Query/body are kept as a backward-
// compatible fallback so older clients (and POSTs that still carry the token in
// the body) keep working during/after rollout. Username is not secret, so it
// may continue to come from the query string or body where routes use it as data.
function getSessionCredentials(req) {
    const authHeader = req.headers['authorization'] || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    return {
        username: req.query.username || req.body?.username,
        sessionToken: bearerToken || req.query.sessionToken || req.body?.sessionToken
    };
}

// Short-lived in-memory cache of validated sessions. Previously every request to
// a protected route did a DB round-trip just to check the session token, which
// dominated the "Slow request" warnings. With a 30s TTL we skip the DB on the
// hot path while keeping the "another login kicks the old session" guarantee:
// /login and /logout evict the entry so a rotated token is never served stale.
const sessionCache = new Map(); // username -> { token, expiresAt, track, userId }
const SESSION_CACHE_TTL = 30_000; // 30 seconds
// An entry only ever leaves via invalidateSessionCache (login/logout) or a
// token mismatch — a username that authenticates once and never returns
// keeps its (long-expired) entry forever, so a warm instance's memory grows
// with every distinct visitor it has ever served. Sweep before it matters.
const SESSION_CACHE_MAX = 2000;

function invalidateSessionCache(username) {
    if (username) sessionCache.delete(username);
}

function pruneSessionCacheIfNeeded() {
    if (sessionCache.size <= SESSION_CACHE_MAX) return;
    const now = Date.now();
    for (const [key, val] of sessionCache) {
        if (val.expiresAt <= now) sessionCache.delete(key);
    }
    // Still over the cap after clearing expired entries (a burst of distinct,
    // still-live sessions) — drop the oldest ones. Map iterates in insertion
    // order, which .set() on an existing key does NOT refresh, so this is an
    // insertion-order sweep rather than a true LRU. Good enough here: the
    // worst case of evicting an active session's entry is one extra DB round
    // trip on its next request, which re-caches it immediately.
    if (sessionCache.size > SESSION_CACHE_MAX) {
        const excess = sessionCache.size - SESSION_CACHE_MAX;
        let i = 0;
        for (const key of sessionCache.keys()) {
            if (i++ >= excess) break;
            sessionCache.delete(key);
        }
    }
}

function requireSession(req, res, next) {
    const { username, sessionToken } = getSessionCredentials(req);

    if (!username || !sessionToken) {
        logger.warn('Missing session credentials', { username, sessionToken: sessionToken ? 'present' : 'missing' });
        return res.status(401).json({ message: 'Missing session credentials' });
    }

    // Fast path: a recently validated (username, token) pair skips the DB.
    const cached = sessionCache.get(username);
    if (cached && cached.token === sessionToken && cached.expiresAt > Date.now()) {
        req.userTrack = cached.track;
        req.accountId = cached.userId;
        return next();
    }

    db.query('SELECT id, session_token, track FROM accounts WHERE username = $1', [username])
        .then(result => {
            if (!result.rows.length || result.rows[0].session_token !== sessionToken) {
                sessionCache.delete(username); // evict any stale entry
                logger.warn('Session invalid or expired', {
                    username,
                    hasSessionInDB: result.rows.length > 0,
                    sessionMatches: result.rows.length > 0 ? result.rows[0].session_token === sessionToken : false
                });
                return res.status(401).json({ message: 'Session invalid or expired' });
            }
            const track = normalizeTrack(result.rows[0].track);
            const userId = result.rows[0].id;
            pruneSessionCacheIfNeeded();
            sessionCache.set(username, {
                token: sessionToken, expiresAt: Date.now() + SESSION_CACHE_TTL, track, userId,
            });
            req.userTrack = track;
            req.accountId = userId;
            next();
        })
        .catch(err => {
            logger.error('[SESSION] Error checking session:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
}

/**
 * Ownership guards for routes keyed by a path param.
 *
 * requireSession only proves the caller holds a valid session for SOME
 * account (and attaches it as req.accountId) — it does not check that the
 * account id in the URL is that same account. Every route reading or writing
 * another table by a client-supplied :userId or :sessionId must run one of
 * these AFTER requireSession, or any signed-in user can read (or, on a write
 * route, corrupt) any other account's data just by changing the id in the URL.
 *
 * Two shapes, because the two kinds of param can't share one check:
 *
 *   requireOwnUser(param)    — the param IS an accounts.id. Compared directly
 *                               against req.accountId.
 *   requireOwnSession(param) — the param is a quiz *session* id. Ownership is
 *                               indirect: it must be looked up in
 *                               user_quiz_sessions to find whose session it
 *                               is, then compared against req.accountId. A
 *                               direct id comparison is structurally wrong
 *                               here — the two id spaces are unrelated.
 */
function requireOwnUser(paramName) {
    return (req, res, next) => {
        const requested = req.params[paramName];
        if (Number(requested) !== req.accountId) {
            logger.warn('Blocked cross-account access', {
                accountId: req.accountId, requested, param: paramName, path: req.originalUrl,
            });
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

// table: which sessions table owns this id space — practice quizzes live in
// user_quiz_sessions, mock/final exams in final_review_sessions. The two are
// unrelated id spaces, so the caller must say which one a given route means.
function requireOwnSession(paramName, table = 'user_quiz_sessions') {
    return async (req, res, next) => {
        const sessionId = req.params[paramName];
        // A session id in this app is either the numeric <table>.id or its
        // UUID session_id — several routes accept either form, so the
        // ownership lookup has to try the same column the handler itself will
        // use, or a legitimate UUID lookup would be rejected as not-owned.
        const isNumeric = !isNaN(sessionId) && !isNaN(parseFloat(sessionId));
        try {
            const result = await db.query(
                isNumeric
                    ? `SELECT user_id FROM ${table} WHERE id = $1`
                    : `SELECT user_id FROM ${table} WHERE session_id = $1`,
                [isNumeric ? parseInt(sessionId, 10) : sessionId]
            );
            if (!result.rows.length || result.rows[0].user_id !== req.accountId) {
                logger.warn('Blocked cross-account session access', {
                    accountId: req.accountId, requested: sessionId, table, path: req.originalUrl,
                });
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        } catch (err) {
            logger.error('[requireOwnSession] lookup failed', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

/**
 * The track whose content this request may see.
 *
 * Always derived from the authenticated session (requireSession sets
 * req.userTrack) — never from a client-supplied parameter, or a medical
 * subscriber could read the nursing bank by changing a query string.
 *
 * Admin requests are the one exception: the admin panel legitimately needs to
 * work across both banks, so an admin-keyed request may name a track with
 * ?track=, and gets the default when it doesn't.
 */
function resolveContentTrack(req) {
    if (req.userTrack) return req.userTrack;
    if (isAdminRequest(req)) return normalizeTrack(req.query.track);
    return DEFAULT_TRACK;
}

// Endpoint to accept terms
// Was unauthenticated: any caller could flip terms_accepted for any username.
// requireSession already proves the body username belongs to the caller (it
// checks that account's own session_token), so no extra ownership check is
// needed beyond the middleware itself.
app.post('/accept-terms', requireSession, async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username required' });
    try {
        await db.query('UPDATE accounts SET terms_accepted = true WHERE username = $1', [username]);
        res.status(200).json({ message: 'Terms accepted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update terms acceptance' });
    }
});

// Note: Migration endpoint removed - using accounts table only

// ===== PAYMENT WORKFLOW =====
// Payments are LIVE via Moyasar: routes/payment.js (config/verify/webhook/status),
// services/paymentService.js (verification + activation + owner notification),
// middleware/subscriptionGuard.js (server-side paywall). All gated behind
// PAYMENT_ENFORCEMENT_ENABLED.

// Test email endpoint
app.get('/api/test-email', adminAuth, async (req, res) => {
    try {
        const emailSubject = '🧪 Test Email - SQB System';
        const emailText = `
This is a test email from the SQB system.

System Status: ✅ Email system is working properly
Timestamp: ${new Date().toLocaleString()}
Server: Backend API
Purpose: Testing email notifications

If you receive this email, the notification system is working correctly.
        `;

        const emailHtml = `
            <h2>🧪 Test Email - SQB System</h2>
            <p><strong>System Status:</strong> ✅ Email system is working properly</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Server:</strong> Backend API</p>
            <p><strong>Purpose:</strong> Testing email notifications</p>
            <hr>
            <p>If you receive this email, the notification system is working correctly.</p>
        `;

        await sendEmail(OWNER_EMAIL, emailSubject, emailText, emailHtml, { event: 'medqize.owner.test_email' });

        res.status(200).json({
            success: true,
            message: 'Test email sent successfully'
        });
    } catch (error) {
        console.error('❌ Test email failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test email',
            error: error.message
        });
    }
});

// ===== CONTACT FORM FEATURE =====

// Contact form endpoint
app.post('/api/contact', rateLimit(db, 'contact', { windowMs: 60 * 60_000, max: 5 }), async (req, res) => {
    try {
        const { name, mobile, subject, message } = req.body;
        // Attribution is best-effort: the contact form is reachable signed out,
        // so the client sends the track only when someone is logged in.
        const senderTrack = isValidTrack(req.body.track)
            ? `${trackLabelAr(req.body.track)} (${req.body.track})`
            : 'غير معروف (زائر غير مسجّل)';
        const senderUsername = req.body.username || '—';

        if (!name || !mobile || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, mobile, and message are required'
            });
        }

        // Send email notification for contact form
        try {
            const emailSubject = `📞 Contact Form - ${subject || 'General Inquiry'} [${req.body.track || 'unknown'}]`;
            const emailText = `
New contact form submission from SQB:

Name: ${name}
Mobile: ${mobile}
Account: ${senderUsername}
Track: ${senderTrack}
Subject: ${subject || 'General Inquiry'}
Submitted: ${new Date().toLocaleString()}

Message:
${message}

Please respond to the user as soon as possible.
            `;

            const emailHtml = `
                <h2>📞 Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Account:</strong> ${senderUsername}</p>
                <p><strong>Track:</strong> ${senderTrack}</p>
                <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Please respond to the user as soon as possible.</p>
            `;

            await sendEmail(OWNER_EMAIL, emailSubject, emailText, emailHtml, {
                event: 'medqize.owner.contact_form',
                sourceOrigin: req.headers.referer || req.headers.origin,
            });
            console.log('📧 Contact form email sent for:', name);
        } catch (emailError) {
            console.error('❌ Failed to send contact form email:', emailError);
            // Don't fail the contact form if email fails
        }

        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

// ===== SUGGESTIONS FEATURE =====

// Initialize suggestions table
app.post('/api/admin/init-suggestions-table', adminAuth, async (req, res) => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS suggestions (
                id SERIAL PRIMARY KEY,
                category VARCHAR(50) NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                priority VARCHAR(20) DEFAULT 'medium',
                status VARCHAR(30) DEFAULT 'pending',
                admin_notes TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        res.json({ success: true, message: 'Suggestions table created' });
    } catch (error) {
        console.error('Error creating suggestions table:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Submit a suggestion
app.post('/api/suggestions', rateLimit(db, 'suggestions', { windowMs: 60 * 60_000, max: 5 }), async (req, res) => {
    try {
        const { category, title, description, priority } = req.body;
        const senderTrack = isValidTrack(req.body.track)
            ? `${trackLabelAr(req.body.track)} (${req.body.track})`
            : 'غير معروف (زائر غير مسجّل)';

        if (!category || !title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Category, title, and description are required'
            });
        }

        // Save to database
        const result = await db.query(`
            INSERT INTO suggestions (category, title, description, priority)
            VALUES ($1, $2, $3, $4)
            RETURNING id, created_at
        `, [category, title, description, priority || 'medium']);

        const suggestion = result.rows[0];

        // Send email notification
        const categoryLabels = {
            feature: '✨ New Feature',
            improvement: '🚀 Improvement',
            ui: '🎨 UI/Design',
            content: '📚 Content/Questions',
            bug: '🐛 Bug Report',
            other: '💡 Other'
        };

        const priorityLabels = {
            low: '🟢 Nice to have',
            medium: '🟡 Would be helpful',
            high: '🔴 Really need this'
        };

        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.3);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%); padding: 40px; text-align: center;">
              <div style="font-size: 50px; margin-bottom: 16px;">💡</div>
              <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 800;">New Suggestion Received</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">SQB Feedback System</p>
            </td>
          </tr>
          
          <!-- Category & Priority Badges -->
          <tr>
            <td style="padding: 24px 32px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600;">
                      ${categoryLabels[category] || category}
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background: #f1f5f9; padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; color: #475569;">
                      ${priorityLabels[priority] || priority}
                    </span>
                    <span style="display: inline-block; background: #eef2ff; padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; color: #4338ca; margin-right: 6px;">
                      ${senderTrack}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <h2 style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 700;">
                📝 ${title}
              </h2>
            </td>
          </tr>
          
          <!-- Description -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 20px; border-left: 4px solid #8b5cf6;">
                <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${description}</p>
              </div>
            </td>
          </tr>
          
          <!-- Meta Info -->
          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table width="100%" style="background: #f8fafc; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px;">📅 Submitted</span><br>
                    <span style="color: #1e293b; font-size: 14px; font-weight: 600;">${new Date().toLocaleString()}</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-size: 12px;">🔢 Suggestion ID</span><br>
                    <span style="color: #1e293b; font-size: 14px; font-weight: 600;">#${suggestion.id}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Action Button -->
          <tr>
            <td style="padding: 0 32px 32px 32px; text-align: center;">
              <a href="https://medquiz.vercel.app/admin" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
                📋 View in Admin Panel
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #1e293b; padding: 24px 32px; text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 12px;">
                Auto-generated by SQB Feedback System
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        try {
            await sendEmail(
                OWNER_EMAIL,
                `💡 New Suggestion: ${title} [${req.body.track || 'unknown'}]`,
                `New suggestion received:\n\nCategory: ${category}\nPriority: ${priority}\nTitle: ${title}\n\nDescription:\n${description}`,
                emailHtml,
                {
                    event: 'medqize.owner.suggestion',
                    sourceOrigin: req.headers.referer || req.headers.origin,
                }
            );
            console.log('📧 Suggestion email sent for:', title);
        } catch (emailError) {
            console.error('Failed to send suggestion email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Suggestion submitted successfully',
            suggestionId: suggestion.id
        });

    } catch (error) {
        console.error('Error submitting suggestion:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit suggestion'
        });
    }
});

// Get all suggestions (admin)
app.get('/api/admin/suggestions', adminAuth, async (req, res) => {
    try {
        const { status, category, priority } = req.query;

        let query = 'SELECT * FROM suggestions WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND status = $${paramIndex++}`;
            params.push(status);
        }
        if (category) {
            query += ` AND category = $${paramIndex++}`;
            params.push(category);
        }
        if (priority) {
            query += ` AND priority = $${paramIndex++}`;
            params.push(priority);
        }

        query += ' ORDER BY created_at DESC';

        const result = await db.query(query, params);
        res.json({ success: true, suggestions: result.rows });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update suggestion status (admin)
app.put('/api/admin/suggestions/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_notes } = req.body;

        const result = await db.query(`
            UPDATE suggestions 
            SET status = COALESCE($1, status),
                admin_notes = COALESCE($2, admin_notes),
                updated_at = NOW()
            WHERE id = $3
            RETURNING *
        `, [status, admin_notes, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Suggestion not found' });
        }

        res.json({ success: true, suggestion: result.rows[0] });
    } catch (error) {
        console.error('Error updating suggestion:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete suggestion (admin)
app.delete('/api/admin/suggestions/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM suggestions WHERE id = $1', [id]);
        res.json({ success: true, message: 'Suggestion deleted' });
    } catch (error) {
        console.error('Error deleting suggestion:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get suggestions stats (admin)
app.get('/api/admin/suggestions/stats', adminAuth, async (req, res) => {
    try {
        const stats = await db.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'reviewing') as reviewing,
                COUNT(*) FILTER (WHERE status = 'planned') as planned,
                COUNT(*) FILTER (WHERE status = 'implemented') as implemented,
                COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
                COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
                COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as this_week
            FROM suggestions
        `);
        res.json({ success: true, stats: stats.rows[0] });
    } catch (error) {
        console.error('Error fetching suggestion stats:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ===== TEMPORARY SIGNUP LINKS FEATURE =====

// Create temporary signup links table
app.post('/api/admin/init-temp-links-tables', adminAuth, async (req, res) => {
    try {
        // Create temporary_signup_links table
        await db.query(`
            CREATE TABLE IF NOT EXISTS temporary_signup_links (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) UNIQUE NOT NULL,
                max_uses INTEGER NOT NULL DEFAULT 1,
                current_uses INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT true,
                created_by VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP,
                last_used_at TIMESTAMP
            )
        `);

        // Create temp_link_accounts table to track accounts created from links
        await db.query(`
            CREATE TABLE IF NOT EXISTS temp_link_accounts (
                id SERIAL PRIMARY KEY,
                link_id INTEGER NOT NULL REFERENCES temporary_signup_links(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                username VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(link_id, user_id)
            )
        `);

        // Create indexes for better performance
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_links_token ON temporary_signup_links(token)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_links_active ON temporary_signup_links(is_active)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_link_accounts_link_id ON temp_link_accounts(link_id)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_link_accounts_user_id ON temp_link_accounts(user_id)`);

        res.json({ message: 'Temporary signup links tables initialized successfully' });
    } catch (err) {
        console.error('Error initializing temp links tables:', err);
        res.status(500).json({ message: 'Failed to initialize temp links tables' });
    }
});

// Generate temporary signup link
app.post('/api/admin/generate-temp-link', adminAuth, async (req, res) => {
    try {
        const { maxUses, createdBy } = req.body;

        if (!maxUses || maxUses < 1) {
            return res.status(400).json({ message: 'Max uses must be at least 1' });
        }

        // crypto, not Math.random(): this token mints a permanently
        // paywall-exempt account for anyone who has it, so it needs to be
        // unguessable, not just unique. Math.random() is neither
        // cryptographically secure nor, at 6 base-36 chars, long enough to
        // resist brute-forcing.
        const token = crypto.randomBytes(16).toString('base64url');
        const linkTrack = normalizeTrack(req.body.track);

        // Insert the new link
        const result = await db.query(
            `INSERT INTO temporary_signup_links (token, max_uses, created_by, track)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [token, maxUses, createdBy || 'admin', linkTrack]
        );

        const link = result.rows[0];
        // Use frontend URL instead of backend URL for the signup link
        const frontendUrl = 'https://www.smle-question-bank.com';
        const fullUrl = `${frontendUrl}/signup/${link.token}`;

        res.status(201).json({
            success: true,
            link: {
                id: link.id,
                token: link.token,
                url: fullUrl,
                maxUses: link.max_uses,
                currentUses: link.current_uses,
                isActive: link.is_active,
                track: link.track,
                createdAt: link.created_at
            }
        });
    } catch (err) {
        console.error('Error generating temp link:', err);
        res.status(500).json({ message: 'Failed to generate temporary link' });
    }
});

// Get all temporary links with statistics
app.get('/api/admin/temp-links', adminAuth, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                tsl.*,
                COUNT(tla.id) as accounts_created,
                ARRAY_AGG(
                    CASE 
                        WHEN tla.id IS NOT NULL 
                        THEN json_build_object(
                            'username', tla.username,
                            'created_at', tla.created_at
                        )
                        ELSE NULL 
                    END
                ) FILTER (WHERE tla.id IS NOT NULL) as created_accounts
            FROM temporary_signup_links tsl
            LEFT JOIN temp_link_accounts tla ON tsl.id = tla.link_id
            GROUP BY tsl.id
            ORDER BY tsl.created_at DESC
        `);

        // Use frontend URL instead of backend URL for the signup links
        const frontendUrl = 'https://www.smle-question-bank.com';

        const links = result.rows.map(link => ({
            id: link.id,
            token: link.token,
            url: `${frontendUrl}/signup/${link.token}`,
            maxUses: link.max_uses,
            currentUses: link.current_uses,
            isActive: link.is_active,
            track: link.track,
            createdBy: link.created_by,
            createdAt: link.created_at,
            lastUsedAt: link.last_used_at,
            accountsCreated: parseInt(link.accounts_created),
            createdAccounts: link.created_accounts || []
        }));

        res.json({ links });
    } catch (err) {
        console.error('Error fetching temp links:', err);
        res.status(500).json({ message: 'Failed to fetch temporary links' });
    }
});

// Validate temporary signup link
app.get('/api/validate-temp-link/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const result = await db.query(
            `SELECT * FROM temporary_signup_links WHERE token = $1 AND is_active = true`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                valid: false,
                message: 'Invalid or expired link'
            });
        }

        const link = result.rows[0];

        if (link.current_uses >= link.max_uses) {
            // Auto-deactivate link when limit is reached
            await db.query(
                `UPDATE temporary_signup_links SET is_active = false WHERE id = $1`,
                [link.id]
            );

            return res.status(400).json({
                valid: false,
                message: 'This link has reached its usage limit'
            });
        }

        res.json({
            valid: true,
            link: {
                id: link.id,
                token: link.token,
                maxUses: link.max_uses,
                currentUses: link.current_uses,
                remainingUses: link.max_uses - link.current_uses,
                track: normalizeTrack(link.track)
            }
        });
    } catch (err) {
        console.error('Error validating temp link:', err);
        res.status(500).json({ message: 'Failed to validate link' });
    }
});

// Verify an OTP by email, enforcing a per-code lockout.
//
// Looks up the most recent ACTIVE (unused, unexpired) OTP for the email
// regardless of the code supplied, rather than `WHERE otp_code = $2` — a
// lookup keyed on the guessed code touches nothing on a miss, so nothing
// stops an attacker retrying the other 999,999 six-digit combinations against
// the same window. Keying on email instead means every wrong guess increments
// THAT row's attempts, and the 6th guess (right or wrong) is refused outright.
const OTP_MAX_ATTEMPTS = 5;
async function verifyOtp(email, code) {
    const active = await db.query(
        `SELECT id, otp_code, attempts FROM signup_otps
         WHERE email = $1 AND used = FALSE AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [email]
    );
    if (active.rows.length === 0) return { ok: false, reason: 'no_active_code' };
    const row = active.rows[0];
    if (row.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: 'locked' };
    if (row.otp_code !== code) {
        await db.query('UPDATE signup_otps SET attempts = attempts + 1 WHERE id = $1', [row.id]);
        return { ok: false, reason: 'mismatch' };
    }
    return { ok: true, id: row.id };
}

// ============================================
// AUTH — SEND OTP
// ============================================
app.post('/api/auth/send-otp', rateLimit(db, 'send-otp', { windowMs: 15 * 60_000, max: 10 }), async (req, res) => {
    try {
        const { email, purpose } = req.body;

        if (!email || !purpose) {
            return res.status(400).json({ success: false, message: 'Email and purpose are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        const lowerEmail = email.toLowerCase().trim();

        // For signup: email must not already be verified/in-use
        if (purpose === 'signup') {
            const existing = await db.query(
                'SELECT id FROM accounts WHERE email = $1 AND email_verified = TRUE',
                [lowerEmail]
            );
            if (existing.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'This email is already registered' });
            }
        }

        // For reset: email must belong to an existing account
        if (purpose === 'reset') {
            const existing = await db.query(
                'SELECT id FROM accounts WHERE email = $1',
                [lowerEmail]
            );
            if (existing.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'No account found with this email address' });
            }
        }

        // Per-identifier throttle: without this, requesting a fresh code is a
        // free reset of the 5-attempt lockout above, so an attacker just asks
        // for a new code every 5 guesses and keeps grinding forever.
        const recentSends = await db.query(
            `SELECT COUNT(*)::int AS c FROM signup_otps
             WHERE email = $1 AND created_at > NOW() - INTERVAL '15 minutes'`,
            [lowerEmail]
        );
        if (recentSends.rows[0].c >= 5) {
            return res.status(429).json({
                success: false,
                message: 'Too many codes requested. Please wait a few minutes and try again.',
            });
        }

        // Invalidate previous unused OTPs for this email
        await db.query(
            'UPDATE signup_otps SET used = TRUE WHERE email = $1 AND used = FALSE',
            [lowerEmail]
        );

        // 6-digit OTP (1,000,000 combinations, vs 10,000 for 4 digits — see
        // verifyOtp for the attempt lockout this is paired with).
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await db.query(
            'INSERT INTO signup_otps (email, otp_code, expires_at) VALUES ($1, $2, $3)',
            [lowerEmail, otp, expiresAt]
        );

        // Send OTP email. Copy is context-aware: a signup code opens the
        // 1-hour free trial, a reset code just verifies identity.
        const isSignup = purpose === 'signup';
        const subject = isSignup
            ? 'رمز تفعيل حسابك — SQB'
            : 'رمز إعادة تعيين كلمة المرور — SQB';
        const heading = isSignup ? 'فعِّل حسابك وابدأ تجربتك المجانية' : 'رمز التحقق الخاص بك';
        const intro = isSignup
            ? 'أدخل الرمز أدناه لتأكيد بريدك — وبمجرد التأكيد تبدأ فوراً <strong style="color:#0f1e3d;">ساعة تجربة مجانية كاملة</strong> لكل الأسئلة والتحليلات.'
            : 'أدخل الرمز أدناه لإعادة تعيين كلمة المرور الخاصة بك.';
        const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 16px;">
    <tr><td align="center">
      <table width="440" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5eaf3;max-width:440px;width:100%;box-shadow:0 8px 30px rgba(37,99,235,0.08);">
        <!-- Header -->
        <tr>
          <td align="center" style="padding:28px 40px;background:linear-gradient(135deg,#2563eb,#4f46e5);">
            <img src="https://www.smle-question-bank.com/tab_logo.png" width="34" height="34" alt="SQB" style="vertical-align:middle;border-radius:8px;margin-right:10px;">
            <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:2px;vertical-align:middle;">SQB</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td align="center" style="padding:36px 40px 8px;">
            <h1 style="margin:0 0 10px;font-size:19px;font-weight:800;color:#0f1e3d;">${heading}</h1>
            <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.7;">${intro}</p>
            <!-- OTP Box -->
            <div style="background:#f4f7fb;border:1px solid #dbe4f3;border-radius:12px;padding:20px 40px;display:inline-block;margin-bottom:12px;">
              <span style="font-size:42px;font-weight:800;color:#2563eb;letter-spacing:14px;">${otp}</span>
            </div>
            <p style="margin:0 0 24px;font-size:12.5px;color:#94a3b8;">صالح لمدة <strong style="color:#0f1e3d;">5 دقائق</strong></p>
            <p style="margin:0;font-size:12.5px;color:#94a3b8;line-height:1.7;">إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td align="center" style="padding:22px 40px 26px;border-top:1px solid #eef2f8;">
            <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">© 2026 SQB · بنك أسئلة SMLE والبرومترك</p>
            <p style="margin:0;font-size:11px;color:#cbd5e1;">هذا البريد تلقائي، يُرجى عدم الرد عليه مباشرةً.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
        const text = isSignup
            ? `رمز تفعيل حسابك في SQB هو: ${otp} — صالح لمدة 5 دقائق. بعد التأكيد تبدأ ساعة تجربتك المجانية.`
            : `رمز إعادة تعيين كلمة المرور في SQB هو: ${otp} — صالح لمدة 5 دقائق.`;

        // P0 on the gateway: sent inline, never queued behind bulk mail, and
        // guaranteed a reserved slice of the daily budget.
        await sendEmail(lowerEmail, subject, text, html, {
            event: isSignup ? 'medqize.otp.signup' : 'medqize.otp.reset',
            idempotencyKey: `otp:${lowerEmail}:${otp}`,
            sourceOrigin: req.headers.referer || req.headers.origin,
        });

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (err) {
        logger.error('Error sending OTP', err);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

// ============================================
// AUTH — VERIFY MIGRATION OTP

// NOTE: the email-migration OTP endpoint was removed with the rest of the
// username-only login support — every account has a verified email now.
// ============================================
// AUTH — RESET PASSWORD
// ============================================
app.post('/api/auth/reset-password', rateLimit(db, 'reset-password', { windowMs: 15 * 60_000, max: 10 }), async (req, res) => {
    try {
        const { email, otp_code, new_password } = req.body;

        if (!email || !otp_code || !new_password) {
            return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
        }

        if (new_password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const lowerEmail = email.toLowerCase().trim();
        const lowerPassword = new_password.toLowerCase();

        // Verify OTP
        const otpCheck = await verifyOtp(lowerEmail, otp_code);
        if (!otpCheck.ok) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        // Mark OTP used
        await db.query('UPDATE signup_otps SET used = TRUE WHERE id = $1', [otpCheck.id]);

        // Update password
        await db.query(
            'UPDATE accounts SET password = $1 WHERE email = $2',
            [lowerPassword, lowerEmail]
        );

        logger.info('Password reset successful', { email: lowerEmail });
        return res.status(200).json({ success: true, message: 'Password reset successfully' });

    } catch (err) {
        logger.error('Error resetting password', err);
        return res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
});

// Create free account
// Optional exam date offered at signup (see MONETIZATION_ANALYSIS_2026-08.md
// P1 #4 — the reminder ladder in lifecycleJobs.js was fully built but never
// fed, because nothing ever asked for the date). Deliberately lenient: an
// invalid or unparsable date is just dropped rather than failing the signup
// over an optional field. Mirrors the validation in routes/examDate.js,
// which remains the place to CHANGE the date later.
function parseSignupExamDate(value) {
    const str = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    const d = new Date(`${str}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== str) return null;
    const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    const days = Math.round((d.getTime() - today.getTime()) / 86400000);
    if (days < 0 || days > 730) return null;
    return str;
}

app.post('/api/signup/free', async (req, res) => {
    try {
        const { email, password, otp_code } = req.body;
        // Study track is chosen once, at signup. Anything unrecognised falls
        // back to medical rather than failing the signup.
        const track = normalizeTrack(req.body.track);
        const examDate = parseSignupExamDate(req.body.examDate);

        if (!email || !password || !otp_code) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and OTP are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const lowerEmail = email.toLowerCase().trim();
        const lowerPassword = password.toLowerCase();

        // Verify OTP
        const otpCheck = await verifyOtp(lowerEmail, otp_code);
        if (!otpCheck.ok) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const client = await db.connect();
        try {
            // Check if email already verified/in-use
            const existingUser = await client.query(
                'SELECT id FROM accounts WHERE email = $1 AND email_verified = TRUE',
                [lowerEmail]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already registered'
                });
            }

            // Mark OTP used
            await db.query('UPDATE signup_otps SET used = TRUE WHERE id = $1', [otpCheck.id]);

            // Create the account (username = email for backward compat)
            const accountResult = await client.query(
                `INSERT INTO accounts (username, email, password, isactive, logged, terms_accepted, email_verified, track, exam_date)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
                [lowerEmail, lowerEmail, lowerPassword, true, false, false, true, track, examDate]
            );

            const newUserId = accountResult.rows[0].id;

            // Send the welcome email immediately (don't wait up to a day for the
            // daily cron). Best-effort: never fail signup if the email errors, and
            // mark it sent so the cron doesn't send a duplicate later.
            try {
                await sendWelcomeEmail(lowerEmail, lowerEmail, track);
                await client.query(
                    'UPDATE accounts SET welcome_email_sent = TRUE, welcome_email_sent_at = NOW() WHERE id = $1',
                    [newUserId]
                );
            } catch (welcomeErr) {
                console.error('Failed to send welcome email at signup:', welcomeErr);
            }

            // NOTE: the per-signup admin email was removed on purpose — the
            // signal the owner cares about is PAYMENTS, not signups. A rich
            // "payment received" email is sent from paymentService when a
            // subscription is actually paid (webhook or /verify).

            // Every new account starts on the free tier: FREE_QUESTION_ALLOWANCE
            // questions for life, plus the first lesson of every specialty, and
            // an account that never locks. Nothing to grant and nothing to
            // stamp — 'free' with free_questions_used = 0 is the column default,
            // which also means there is no trial to re-claim by re-signing up.
            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                userId: newUserId,
                track,
                freeQuestions: FREE_QUESTION_ALLOWANCE,
                examDateSet: !!examDate
            });

        } finally {
            client.release();
        }

    } catch (err) {
        console.error('Error creating free account:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create account'
        });
    }
});

// Create account from temporary link
app.post('/api/signup/temp-link', async (req, res) => {
    try {
        const { token, email, password, otp_code } = req.body;

        if (!token || !email || !password) {
            return res.status(400).json({ message: 'Token, email, and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const lowerEmail = email.toLowerCase().trim();
        const lowerPassword = password.toLowerCase();

        // Email OTP is NOT required for temp/invite-link signups: the admin-
        // generated, use-limited link is itself the trust anchor, so the invite
        // feature keeps working even while transactional email is unavailable.
        // If a caller still supplies an OTP we honor it; otherwise we proceed
        // without it. (email_verified is still set true below so these admin-
        // invited accounts are never swept by the grace-login cleanup.)
        let otpRow = null;
        if (otp_code) {
            const otpCheck = await verifyOtp(lowerEmail, otp_code);
            if (!otpCheck.ok) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }
            otpRow = { id: otpCheck.id };
        }

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Validate the link
            const linkResult = await client.query(
                `SELECT * FROM temporary_signup_links WHERE token = $1 AND is_active = true FOR UPDATE`,
                [token]
            );

            if (linkResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Invalid or expired link' });
            }

            const link = linkResult.rows[0];

            if (link.current_uses >= link.max_uses) {
                // Auto-deactivate link
                await client.query(
                    `UPDATE temporary_signup_links SET is_active = false WHERE id = $1`,
                    [link.id]
                );
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'This link has reached its usage limit' });
            }

            // Check if email already in-use
            const existingUser = await client.query(
                'SELECT id FROM accounts WHERE email = $1 AND email_verified = TRUE',
                [lowerEmail]
            );

            if (existingUser.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'This email is already registered' });
            }

            // Mark OTP used (only when one was actually supplied/verified)
            if (otpRow) {
                await db.query('UPDATE signup_otps SET used = TRUE WHERE id = $1', [otpRow.id]);
            }

            // Create the account (username = email for backward compat).
            // Accounts created via admin temp links are flagged for future
            // payment exemption (is_admin_created / account_type='admin_created').
            // Falls back to the legacy insert if migration 001 isn't applied yet.
            // The link decides the track — an invite is issued for one cohort,
            // so nothing the invitee sends can move them to the other bank.
            const linkTrack = normalizeTrack(link.track);
            const columnsReady = await hasPaymentColumns();
            const accountResult = columnsReady
                ? await client.query(
                    `INSERT INTO accounts (username, email, password, isactive, logged, terms_accepted, email_verified, is_admin_created, account_type, track)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
                    [lowerEmail, lowerEmail, lowerPassword, true, false, false, true, true, 'admin_created', linkTrack]
                )
                : await client.query(
                    `INSERT INTO accounts (username, email, password, isactive, logged, terms_accepted, email_verified, track)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                    [lowerEmail, lowerEmail, lowerPassword, true, false, false, true, linkTrack]
                );

            const newUserId = accountResult.rows[0].id;

            // Record the account creation in temp_link_accounts
            await client.query(
                `INSERT INTO temp_link_accounts (link_id, user_id, username) 
                 VALUES ($1, $2, $3)`,
                [link.id, newUserId, lowerEmail]
            );

            // Update link usage
            await client.query(
                `UPDATE temporary_signup_links 
                 SET current_uses = current_uses + 1, 
                     last_used_at = NOW(),
                     is_active = CASE 
                         WHEN current_uses + 1 >= max_uses THEN false 
                         ELSE true 
                     END
                 WHERE id = $1`,
                [link.id]
            );

            await client.query('COMMIT');

            // Send email notification to admin
            try {
                const emailSubject = `🔗 Account Created via Temp Link - ${lowerEmail}`;
                const emailText = `New account created via temp link:\nEmail: ${lowerEmail}\nUser ID: ${newUserId}\nTrack: ${trackLabelAr(linkTrack)}\nLink Token: ${token}\nCreated: ${new Date().toLocaleString()}\nLink Usage: ${link.current_uses + 1}/${link.max_uses}`;
                await sendEmail(OWNER_EMAIL, emailSubject, emailText, { event: 'medqize.owner.temp_link_account' });
            } catch (emailError) {
                console.error('Failed to send temp link account creation email:', emailError);
            }

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                userId: newUserId,
                track: linkTrack
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (err) {
        console.error('Error creating account from temp link:', err);
        res.status(500).json({ message: 'Failed to create account' });
    }
});

// Claim a paid group seat.
//
// Modelled on /api/signup/temp-link above — same FOR UPDATE claim inside a
// transaction, same "the link is the trust anchor so OTP is optional" rule —
// with three deliberate differences:
//
//   1. is_admin_created stays FALSE. That flag is checked FIRST in
//      checkSubscriptionAccess and bypasses expiry forever; a paid 4-month seat
//      set that way would never lapse.
//   2. The expiry is the GROUP's expires_at, not now + 4 months. Every seat in
//      a group ends on the same day, so claiming a link late does not extend it.
//   3. The claimer picks their own track. A group can be mixed — one friend
//      sitting SMLE, another SNLE — so the seat does not inherit the buyer's.
app.post('/api/signup/group-seat', async (req, res) => {
    try {
        const { token, email, password, otp_code, track: requestedTrack } = req.body;

        if (!token || !email || !password) {
            return res.status(400).json({ success: false, message: 'Token, email, and password are required' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const lowerEmail = email.toLowerCase().trim();
        const lowerPassword = password.toLowerCase();
        const seatTrack = normalizeTrack(requestedTrack);

        // Optional OTP, same reasoning as the admin invite links: the token is
        // unguessable and was paid for, so a broken mail provider must not stop
        // a paying group from using the seats they already own.
        let otpRow = null;
        if (otp_code) {
            const otpCheck = await verifyOtp(lowerEmail, otp_code);
            if (!otpCheck.ok) {
                return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
            }
            otpRow = { id: otpCheck.id };
        }

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // FOR UPDATE on the seat row: two people opening the same link at
            // the same instant must not both get an account from one seat.
            const seatResult = await client.query(
                `SELECT s.id, s.seat_index, s.claimed_by_account_id,
                        g.id AS group_id, g.seats, g.expires_at, g.owner_account_id
                   FROM group_seats s
                   JOIN subscription_groups g ON g.id = s.group_id
                  WHERE s.token = $1
                    FOR UPDATE OF s`,
                [token]
            );
            if (seatResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ success: false, message: 'This invite link is not valid.' });
            }
            const seat = seatResult.rows[0];
            if (seat.claimed_by_account_id != null) {
                await client.query('ROLLBACK');
                return res.status(409).json({ success: false, message: 'This invite link has already been used.' });
            }
            if (new Date(seat.expires_at).getTime() <= Date.now()) {
                await client.query('ROLLBACK');
                return res.status(410).json({ success: false, message: 'This group subscription has ended.' });
            }

            const existingUser = await client.query(
                'SELECT id FROM accounts WHERE email = $1 AND email_verified = TRUE',
                [lowerEmail]
            );
            if (existingUser.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: 'This email is already registered' });
            }

            if (otpRow) {
                await client.query('UPDATE signup_otps SET used = TRUE WHERE id = $1', [otpRow.id]);
            }

            const accountResult = await client.query(
                `INSERT INTO accounts
                    (username, email, password, isactive, logged, terms_accepted, email_verified,
                     is_admin_created, account_type, track,
                     subscription_status, subscription_expiry_date)
                 VALUES ($1, $2, $3, TRUE, FALSE, FALSE, TRUE,
                         FALSE, 'group_seat', $4,
                         'active', $5)
                 RETURNING id`,
                [lowerEmail, lowerEmail, lowerPassword, seatTrack, seat.expires_at]
            );
            const newUserId = accountResult.rows[0].id;

            await client.query(
                `UPDATE group_seats
                    SET claimed_by_account_id = $1, claimed_at = NOW()
                  WHERE id = $2`,
                [newUserId, seat.id]
            );

            await client.query('COMMIT');

            // Tell the buyer their seat was used — seat number and count only,
            // never the claimer's email. See routes/groups.js privacy rule.
            try {
                const owner = await db.query(
                    'SELECT email, username, preferred_lang FROM accounts WHERE id = $1',
                    [seat.owner_account_id]
                );
                const o = owner.rows[0];
                if (o?.email) {
                    await sendGroupSeatClaimedEmail(
                        o.email,
                        String(o.username).split('@')[0],
                        { seatIndex: seat.seat_index, seats: seat.seats, expiresAt: seat.expires_at },
                        { lang: o.preferred_lang, accountId: seat.owner_account_id }
                    );
                }
            } catch (emailErr) {
                console.error('Failed to notify group owner of seat claim:', emailErr);
            }

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                userId: newUserId,
                track: seatTrack,
                expiresAt: seat.expires_at
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error claiming group seat:', err);
        res.status(500).json({ success: false, message: 'Failed to create account' });
    }
});

// Deactivate temporary link manually
app.post('/api/admin/deactivate-temp-link/:id', adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `UPDATE temporary_signup_links SET is_active = false WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Link not found' });
        }

        res.json({
            success: true,
            message: 'Link deactivated successfully'
        });
    } catch (err) {
        console.error('Error deactivating temp link:', err);
        res.status(500).json({ message: 'Failed to deactivate link' });
    }
});

// ==================== FINAL QUIZ ENDPOINTS ====================

// Get questions count by type and source for final quiz
app.get('/final-quiz/questions-count', requireSession, async (req, res) => {
    const { questionType, source } = req.query;

    try {
        logger.debug('Fetching questions count for final quiz', { questionType, source });

        const track = resolveContentTrack(req);
        const sources = resolveSources(source, track);
        const result = await db.query(`
            SELECT COUNT(DISTINCT LOWER(TRIM(question_text)))::int AS total_questions
            FROM questions
            WHERE track = $1 AND question_type = $2
              ${sources ? 'AND source = ANY($3::text[])' : ''}
        `, sources ? [track, questionType, sources] : [track, questionType]);

        const totalQuestions = parseInt(result.rows[0].total_questions);

        logger.info('Questions count fetched successfully', {
            questionType,
            source,
            totalQuestions
        });

        res.json({ totalQuestions });

    } catch (err) {
        logger.error('Error fetching questions count for final quiz', {
            error: err.message,
            questionType,
            source
        });
        res.status(500).json({ message: 'Failed to fetch questions count' });
    }
});

// Get all questions for final quiz (including previously answered ones)
app.get('/final-quiz/questions', requireSession, subscriberOnly, async (req, res) => {
    const { questionType, source } = req.query;

    try {
        logger.debug('Fetching all questions for final quiz', {
            questionType,
            source,
            username: req.query.username,
            sessionToken: req.query.sessionToken ? 'present' : 'missing'
        });

        // All matching rows are returned anyway (no LIMIT), so sort in JS
        // instead of ORDER BY RANDOM() — that avoids making Postgres compute
        // and sort by a random key for every row just to reorder a set it has
        // to return in full regardless.
        const track = resolveContentTrack(req);
        const sources = resolveSources(source, track);
        const result = await db.query(`
            SELECT
                id,
                question_text,
                option1,
                option2,
                option3,
                option4,
                correct_option,
                question_type,
                source
            FROM questions
            WHERE track = $1 AND question_type = $2
              ${sources ? 'AND source = ANY($3::text[])' : ''}
        `, sources ? [track, questionType, sources] : [track, questionType]);

        // The union of kept sources can contain the same recall twice; collapse
        // to one per normalized question text before shuffling.
        const questions = dedupeByText(result.rows);
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }

        logger.info('Questions fetched successfully for final quiz', {
            questionType,
            source,
            count: questions.length
        });

        res.json({ questions });

    } catch (err) {
        logger.error('Error fetching questions for final quiz', {
            error: err.message,
            questionType,
            source
        });
        res.status(500).json({ message: 'Failed to fetch questions' });
    }
});

// Submit final quiz session
app.post('/final-quiz/submit', requireSession, subscriberOnly, async (req, res) => {
    const {
        userId,
        questionType,
        source,
        totalQuestions,
        correctAnswers,
        timeTaken,
        timeLimit,
        sessionMetadata,
        questionIds = [], // Array of question IDs used in the quiz
        questionAttempts = [] // Array of question attempts with user answers
    } = req.body;

    try {
        logger.info('Final quiz submission request received', {
            userId,
            questionType,
            source,
            totalQuestions,
            correctAnswers,
            timeTaken,
            timeLimit,
            sessionMetadata,
            requestBody: req.body
        });

        const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        logger.info('Inserting final quiz session into database', {
            userId,
            questionType,
            source,
            totalQuestions,
            correctAnswers,
            score,
            timeTaken,
            timeLimit
        });
        const result = await db.query(`
            INSERT INTO final_review_sessions (
                user_id, 
                question_type, 
                source, 
                total_questions, 
                correct_answers, 
                score, 
                time_taken, 
                time_limit, 
                end_time, 
                session_metadata,
                question_ids
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9, $10)
            RETURNING id, session_id
        `, [
            userId,
            questionType,
            source,
            totalQuestions,
            correctAnswers,
            score,
            timeTaken,
            timeLimit,
            JSON.stringify(sessionMetadata || {}),
            questionIds
        ]);

        const sessionId = result.rows[0].id;
        const sessionUuid = result.rows[0].session_id;

        logger.info('Final quiz session inserted successfully', {
            sessionId,
            sessionUuid,
            userId,
            score
        });

        // Insert question attempts if provided
        if (questionAttempts && questionAttempts.length > 0) {
            logger.info('Inserting question attempts', {
                sessionId,
                attemptsCount: questionAttempts.length
            });

            for (const attempt of questionAttempts) {
                await db.query(`
                    INSERT INTO final_quiz_attempts (
                        session_id,
                        question_id,
                        user_answer,
                        correct_answer,
                        is_correct,
                        time_taken
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                `, [
                    sessionId,
                    attempt.questionId,
                    attempt.userAnswer,
                    attempt.correctAnswer,
                    attempt.isCorrect,
                    attempt.timeTaken || 0
                ]);
            }

            logger.info('Question attempts inserted successfully', {
                sessionId,
                attemptsCount: questionAttempts.length
            });
        }

        logger.info('Final quiz session submitted successfully', {
            userId,
            sessionId,
            sessionUuid,
            score: score.toFixed(2)
        });

        res.json({
            success: true,
            sessionId,
            sessionUuid,
            score: parseFloat(score.toFixed(2))
        });

    } catch (err) {
        logger.error('Error submitting final quiz session', {
            error: err.message,
            userId,
            questionType,
            source
        });
        res.status(500).json({ message: 'Failed to submit final quiz session' });
    }
});

// Get final quiz sessions history
app.get('/final-quiz/sessions/:userId', requireSession, requireOwnUser('userId'), async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        logger.info('Fetching final quiz sessions history', { userId, page, limit });

        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get total count
        const countResult = await db.query(`
            SELECT COUNT(*) as total 
            FROM final_review_sessions 
            WHERE user_id = $1
        `, [userId]);

        const totalSessions = parseInt(countResult.rows[0].total);

        // Get paginated results
        const sessionsResult = await db.query(`
            SELECT 
                id,
                session_id,
                question_type,
                source,
                total_questions,
                correct_answers,
                score,
                time_taken,
                time_limit,
                start_time,
                end_time,
                session_metadata
            FROM final_review_sessions 
            WHERE user_id = $1
            ORDER BY start_time DESC 
            LIMIT $2 OFFSET $3
        `, [userId, parseInt(limit), offset]);

        // Convert numeric fields
        const sessions = sessionsResult.rows.map(session => ({
            ...session,
            total_questions: parseInt(session.total_questions) || 0,
            correct_answers: parseInt(session.correct_answers) || 0,
            score: parseFloat(session.score) || 0,
            time_taken: parseInt(session.time_taken) || 0,
            time_limit: parseInt(session.time_limit) || 0
        }));

        logger.info('Final quiz sessions history fetched successfully', {
            userId,
            totalSessions,
            returnedSessions: sessions.length
        });

        res.json({
            sessions: sessions,
            pagination: {
                current_page: parseInt(page),
                total_pages: Math.ceil(totalSessions / parseInt(limit)),
                total_sessions: totalSessions,
                limit: parseInt(limit)
            }
        });

    } catch (err) {
        logger.error('Error fetching final quiz sessions history', {
            error: err.message,
            userId
        });
        res.status(500).json({ message: 'Failed to fetch final quiz sessions history' });
    }
});

// Get detailed final quiz session
app.get('/final-quiz/session/:sessionId', requireSession, requireOwnSession('sessionId', 'final_review_sessions'), async (req, res) => {
    const { sessionId } = req.params;

    try {
        logger.info('Fetching detailed final quiz session', { sessionId });

        // Check if sessionId is numeric (for id) or UUID (for session_id)
        const isNumeric = !isNaN(sessionId) && !isNaN(parseFloat(sessionId));
        let whereClause, queryParams;

        if (isNumeric) {
            whereClause = 'WHERE id = $1';
            queryParams = [parseInt(sessionId)];
        } else {
            whereClause = 'WHERE session_id = $1';
            queryParams = [sessionId];
        }

        const result = await db.query(`
            SELECT 
                id,
                session_id,
                question_type,
                source,
                total_questions,
                correct_answers,
                score,
                time_taken,
                time_limit,
                start_time,
                end_time,
                session_metadata
            FROM final_review_sessions 
            ${whereClause}
        `, queryParams);

        logger.info('Session query result:', {
            sessionId,
            rowCount: result.rows.length,
            rows: result.rows
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Final quiz session not found' });
        }

        const session = result.rows[0];

        // Convert numeric fields
        const sessionData = {
            ...session,
            total_questions: parseInt(session.total_questions) || 0,
            correct_answers: parseInt(session.correct_answers) || 0,
            score: parseFloat(session.score) || 0,
            time_taken: parseInt(session.time_taken) || 0,
            time_limit: parseInt(session.time_limit) || 0
        };

        logger.info('Final quiz session details fetched successfully', {
            sessionId,
            questionType: session.question_type,
            source: session.source
        });

        res.json(sessionData);

    } catch (err) {
        logger.error('Error fetching final quiz session details', {
            error: err.message,
            sessionId
        });
        res.status(500).json({ message: 'Failed to fetch final quiz session details' });
    }
});

// Get questions for a specific final quiz session
app.get('/final-quiz/session/:sessionId/questions', requireSession, requireOwnSession('sessionId', 'final_review_sessions'), async (req, res) => {
    const { sessionId } = req.params;

    try {
        logger.info('Fetching questions for final quiz session', { sessionId });

        // Check if sessionId is numeric (for id) or UUID (for session_id)
        const isNumeric = !isNaN(sessionId) && !isNaN(parseFloat(sessionId));
        let whereClause, queryParams;

        if (isNumeric) {
            whereClause = 'WHERE id = $1';
            queryParams = [parseInt(sessionId)];
        } else {
            whereClause = 'WHERE session_id = $1';
            queryParams = [sessionId];
        }

        // First get the question_ids (and the numeric id) from the session
        const sessionResult = await db.query(`
            SELECT id, question_ids
            FROM final_review_sessions
            ${whereClause}
        `, queryParams);

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Final quiz session not found' });
        }

        const questionIds = sessionResult.rows[0].question_ids;
        // final_quiz_attempts.session_id references the numeric id — using the
        // raw route param here broke lookups by UUID session_id.
        const numericSessionId = sessionResult.rows[0].id;

        if (!questionIds || questionIds.length === 0) {
            return res.json({ questions: [] });
        }

        // Get the questions with user answers using JOIN
        const questionsResult = await db.query(`
            SELECT
                q.id,
                q.question_text,
                q.option1,
                q.option2,
                q.option3,
                q.option4,
                q.correct_option,
                q.question_type,
                q.source,
                q.explanation,
                fqa.user_answer,
                fqa.is_correct,
                fqa.time_taken
            FROM questions q
            LEFT JOIN final_quiz_attempts fqa ON q.id = fqa.question_id AND fqa.session_id = $2
            WHERE q.id = ANY($1)
            ORDER BY array_position($1, q.id)
        `, [questionIds, numericSessionId]);

        logger.info('Questions with user answers fetched successfully for final quiz session', {
            sessionId,
            questionCount: questionsResult.rows.length
        });

        res.json({ questions: questionsResult.rows });

    } catch (err) {
        logger.error('Error fetching questions for final quiz session', {
            error: err.message,
            sessionId
        });
        res.status(500).json({ message: 'Failed to fetch questions for final quiz session' });
    }
});

// Admin key probe — the admin panel's gate screen calls this to check the
// key it holds before rendering any admin UI.
app.get('/api/admin/verify-key', adminAuth, (req, res) => {
    res.json({ success: true });
});

// Error Report Routes
app.use('/api/error-report', rateLimit(db, 'error-report', { windowMs: 60 * 60_000, max: 30 }), errorReportRoutes);

// Question Reports Routes
app.use('/api/question-reports', (req, res, next) => { req.db = db; next(); }, questionReportsRouter);

// Email Campaign Routes (test + cron)
app.use('/', (req, res, next) => { req.db = db; next(); }, emailCampaignsRouter);

// Payment Routes (Moyasar) — LIVE. Gated by PAYMENT_ENFORCEMENT_ENABLED
// (every endpoint returns 503 if the flag is ever turned off).
app.use('/api/payment', (req, res, next) => { req.db = db; next(); }, paymentRoutes);

// Topic Summaries Routes (slide decks + study questions + reading progress)
app.use('/api/summaries', (req, res, next) => { req.db = db; next(); }, summariesRouter);

// Accounting (admin-only). Every money figure in the product resolves through
// services/accountingService.js, which this router exposes.
app.use('/api/accounting', (req, res, next) => { req.db = db; next(); }, accountingRouter);

// Page engagement: POST /api/engagement (students) + GET /api/engagement/admin.
app.use('/api/engagement', (req, res, next) => { req.db = db; next(); }, engagementRouter);

// Pre-signup/pre-login funnel events: POST /api/funnel (unauthenticated,
// rate-limited) + GET /api/funnel/admin.
app.use('/api/funnel', (req, res, next) => { req.db = db; next(); }, funnelRouter);

// Study goals and the in-app notification feed. Both resolve the account from
// the validated session (req.accountId set by requireSession), never from the
// request body.
app.use('/api/goals', requireSession, (req, res, next) => { req.db = db; next(); }, goalsRouter);
app.use('/api/notifications', requireSession, (req, res, next) => { req.db = db; next(); }, notificationsRouter);
// The student's own sitting date — the anchor for the hub countdown and the
// staged reminder emails.
app.use('/api/exam-date', requireSession, (req, res, next) => { req.db = db; next(); }, examDateRouter);
// Group subscriptions. No requireSession at mount: /seat/:token is a public
// link check used before signup — each route inside applies its own guard.
app.use('/api/groups', (req, res, next) => { req.db = db; next(); }, groupRoutes);
// Retired trial heartbeat — answers 410 so tabs left open across the deploy
// stop retrying. See routes/trial.js.
app.use('/api/trial', requireSession, (req, res, next) => { req.db = db; next(); }, trialRouter);
// Telegram bot/channel: webhook, cron endpoints, admin test/setup routes —
// each declares its own full path (see routes/telegram.js), same mount style
// as emailCampaignsRouter below.
app.use('/', (req, res, next) => { req.db = db; next(); }, telegramRouter);

/**
 * GET /api/progress/weekly — this week vs last week, for the hub's progress
 * panel. Deliberately a comparison rather than a running total: "you answered
 * 340 questions" is a fact, "you are 8% more accurate than last week" is a
 * reason to come back. Same 7-day windows the digest email uses.
 */
app.get('/api/progress/weekly', requireSession, async (req, res) => {
    try {
        const { rows } = await db.query(`
            SELECT
                COALESCE(SUM(total_questions) FILTER (WHERE start_time > NOW() - INTERVAL '7 days'), 0)::int  AS q_now,
                COALESCE(SUM(correct_answers) FILTER (WHERE start_time > NOW() - INTERVAL '7 days'), 0)::int  AS c_now,
                COUNT(*) FILTER (WHERE start_time > NOW() - INTERVAL '7 days' AND end_time IS NOT NULL)::int  AS quizzes_now,
                COALESCE(SUM(total_questions) FILTER (WHERE start_time > NOW() - INTERVAL '14 days'
                                                        AND start_time <= NOW() - INTERVAL '7 days'), 0)::int AS q_prev,
                COALESCE(SUM(correct_answers) FILTER (WHERE start_time > NOW() - INTERVAL '14 days'
                                                        AND start_time <= NOW() - INTERVAL '7 days'), 0)::int AS c_prev
              FROM user_quiz_sessions WHERE user_id = $1
        `, [req.accountId]);
        const r = rows[0] || {};
        const qNow = r.q_now || 0;
        const qPrev = r.q_prev || 0;
        res.json({
            success: true,
            questionsThisWeek: qNow,
            quizzesThisWeek: r.quizzes_now || 0,
            accuracyThisWeek: qNow > 0 ? Math.round(((r.c_now || 0) / qNow) * 100) : null,
            // null (not 0) when there is no prior week to compare against, so the
            // UI can say "not enough history" instead of implying a 100% drop.
            accuracyLastWeek: qPrev > 0 ? Math.round(((r.c_prev || 0) / qPrev) * 100) : null,
            questionsLastWeek: qPrev,
        });
    } catch (err) {
        logger.error('Failed to compute weekly progress', err);
        res.status(500).json({ success: false, message: 'Failed to load progress' });
    }
});

/**
 * PUT /api/preferences/language — remember which language to email in.
 *
 * The site language lives in localStorage (see i18n/LanguageContext), which the
 * cron jobs obviously cannot read. This mirrors it onto the account so lifecycle
 * mail is written in the language the student actually reads the site in.
 * Deliberately tiny and idempotent: the client fires it on every authenticated
 * page load, and the UPDATE is a no-op when nothing changed.
 */
app.put('/api/preferences/language', requireSession, async (req, res) => {
    const lang = String(req.body?.lang || '').toLowerCase().startsWith('en') ? 'en' : 'ar';
    try {
        await db.query(
            `UPDATE accounts SET preferred_lang = $2 WHERE id = $1 AND preferred_lang IS DISTINCT FROM $2`,
            [req.accountId, lang]
        );
        res.json({ success: true, lang });
    } catch (err) {
        logger.error('Failed to save language preference', err);
        res.status(500).json({ success: false });
    }
});

/**
 * GET /api/public/stats — live usage numbers for the landing page's social
 * proof (real activity, not question-bank inventory — the site never states
 * bank size). Unauthenticated, read-only, no PII: three counts, nothing else.
 *
 * Cached in memory for CACHE_MS so a viral landing page can't turn this into
 * three COUNT(*) queries per pageview. Failures fall back to whatever was
 * last cached (or null, if the process just started) — the landing page's
 * job is to fall back to static copy rather than show a broken number.
 */
const PUBLIC_STATS_CACHE_MS = 15 * 60 * 1000;
let _publicStatsCache = null; // { data, at }
app.get('/api/public/stats', async (req, res) => {
    const now = Date.now();
    if (_publicStatsCache && now - _publicStatsCache.at < PUBLIC_STATS_CACHE_MS) {
        return res.json({ success: true, ...(_publicStatsCache.data), cached: true });
    }
    try {
        const [activeWeek, questionsMonth, quizzesMonth] = await Promise.all([
            db.query(`SELECT COUNT(DISTINCT user_id)::int AS n FROM login_history WHERE login_time > NOW() - INTERVAL '7 days'`),
            db.query(`SELECT COUNT(*)::int AS n FROM user_question_attempts WHERE quiz_session_id IN (
                          SELECT id FROM user_quiz_sessions WHERE start_time > NOW() - INTERVAL '30 days'
                      )`),
            db.query(`SELECT COUNT(*)::int AS n FROM user_quiz_sessions WHERE start_time > NOW() - INTERVAL '30 days' AND end_time IS NOT NULL`),
        ]);
        const data = {
            activeStudentsThisWeek: activeWeek.rows[0]?.n || 0,
            questionsAnsweredThisMonth: questionsMonth.rows[0]?.n || 0,
            quizzesCompletedThisMonth: quizzesMonth.rows[0]?.n || 0,
        };
        _publicStatsCache = { data, at: now };
        res.json({ success: true, ...data, cached: false });
    } catch (err) {
        logger.error('Failed to compute public stats', err);
        if (_publicStatsCache) return res.json({ success: true, ...(_publicStatsCache.data), cached: true, stale: true });
        res.status(503).json({ success: false });
    }
});

// Admin broadcast — compose one email and drip it to every user in small,
// resumable batches. See routes/admin-broadcast.js for why it is queue-based.
app.use('/admin/broadcast', (req, res, next) => { req.db = db; next(); }, adminBroadcastRouter);

/**
 * Public unsubscribe link used by broadcast emails. Deliberately GET and
 * unauthenticated — it is opened straight from a mail client — but the token
 * is an HMAC of the account id, so it cannot be guessed or enumerated.
 */
app.get('/api/unsubscribe', async (req, res) => {
    const { u, t } = req.query;
    const page = (title, msg, ok) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#eef2fb;font-family:system-ui,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center">
<div style="max-width:420px;background:#fff;border-radius:14px;padding:28px;text-align:center;box-shadow:0 10px 30px rgba(15,23,42,.12)">
<div style="font-size:34px;margin-bottom:8px">${ok ? '✅' : '⚠️'}</div>
<h1 style="margin:0 0 8px;font-size:19px;color:#0f1e3d">${title}</h1>
<p style="margin:0;color:#475569;font-size:14px;line-height:1.8">${msg}</p></div></body></html>`;
    try {
        if (!u || !t || t !== unsubToken(u)) {
            return res.status(400).send(page('رابط غير صالح', 'رابط إلغاء الاشتراك غير صحيح أو منتهي. تواصل معنا إذا استمرت المشكلة.', false));
        }
        await db.query(`ALTER TABLE accounts ADD COLUMN IF NOT EXISTS email_opt_out BOOLEAN DEFAULT FALSE`);
        await db.query(`UPDATE accounts SET email_opt_out = TRUE WHERE id = $1`, [u]);
        res.send(page('تم إلغاء الاشتراك', 'لن تصلك رسائل جماعية من SQB بعد الآن. رسائل حسابك الضرورية (مثل استعادة كلمة المرور) ستستمر.', true));
    } catch (err) {
        logger.error('unsubscribe failed', err);
        res.status(500).send(page('حدث خطأ', 'تعذّر تنفيذ الطلب الآن. حاول مرة أخرى لاحقاً.', false));
    }
});

// Global Error Handling Middleware - catches all unhandled errors
app.use(async (err, req, res, next) => {
    logger.error('Unhandled error:', err);

    // A response already in flight can't be re-sent — calling res.status().json()
    // here would throw "Cannot set headers after they are sent", which Express
    // has no handler for at that point and which crashes the process. Delegating
    // to Express's built-in final handler is what res/next are for in this case.
    if (res.headersSent) {
        return next(err);
    }

    // Send error notification for 500+ errors
    try {
        await notifyBackendError(err, req, {
            middleware: 'globalErrorHandler',
            route: req.originalUrl,
            method: req.method
        });
    } catch (notifyError) {
        logger.error('Failed to send error notification:', notifyError);
    }

    // Only relay err.message when the throw site explicitly set a status —
    // that's the signal it's a deliberate, client-safe error (e.g.
    // PaymentDisabledError, "Payment not found."). An error that reaches here
    // WITHOUT one is an unexpected exception (DB driver error, TypeError...)
    // whose .message can contain internal detail — SQL text, file paths,
    // hostnames — that should never reach a client.
    const hasExplicitStatus = typeof err.statusCode === 'number' || typeof err.status === 'number';
    const statusCode = err.statusCode || err.status || 500;
    const message = hasExplicitStatus && err.message ? err.message : 'Internal server error';
    res.status(statusCode).json({
        message,
        ...(!isProduction && { stack: err.stack })
    });
});

// Without these, an unhandled promise rejection or a thrown exception outside
// any request handler (a fire-and-forget cron tick, a timer callback) crashes
// the process silently with no notification and, for unhandledRejection, no
// log line at all under some Node versions. Logging isn't enough to keep
// going safely after an uncaughtException (the process may be in an
// inconsistent state), so it still exits — but now notified, not silent.
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection:', reason);
    notifyBackendError(reason instanceof Error ? reason : new Error(String(reason)), null, {
        middleware: 'unhandledRejection',
    }).catch(() => { /* already logged above; don't let the notifier itself crash the process */ });
});
process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception:', err);
    notifyBackendError(err, null, { middleware: 'uncaughtException' })
        .catch(() => { /* already logged above */ })
        .finally(() => process.exit(1));
});

// Single listen at the very end so every route/middleware above is registered
// first. Previously the app listened TWICE (once mid-file on process.env.PORT,
// once here on 3000) which crashes locally with EADDRINUSE when PORT=3000 and
// otherwise binds a second random port.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});