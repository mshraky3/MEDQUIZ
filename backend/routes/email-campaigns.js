/**
 * Email Campaigns Routes
 * - Test routes: send to the owner's inbox for preview
 * - Cron routes: run daily/hourly to send campaigns to real users
 */

import express from 'express';
import {
    sendWelcomeEmail,
    sendInactivityEmail,
    sendStreakReminderEmail,
    sendFeedbackEmail,
    sendTrialEndedEmail,
    sendProgressDigestEmail,
    sendExpiryReminderEmail,
    sendExamReminderEmail,
    sendOneSessionComebackEmail,
} from '../services/userEmailService.js';
import {
    runTrialEndedJob,
    runExpiryReminderJob,
    runProgressDigestJob,
    runExamReminderJob,
    runComebackJob,
    EXAM_REMINDER_STAGES,
} from '../services/lifecycleJobs.js';
import { maybeSendSubscriptionReport, sendSubscriptionReport } from '../services/subscriptionReportService.js';
import { drainSendingCampaigns } from './admin-broadcast.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { normalizeTrack } from '../config/tracks.js';
import { OWNER_EMAIL } from '../config/recipients.js';

const router = express.Router();

const TEST_EMAIL = OWNER_EMAIL;
// Test routes accept ?track=nursing so both variants of every template can be
// previewed in the inbox before a campaign goes out.
const testTrack = (req) => normalizeTrack(req.query.track);
// ...and ?lang=en, since every template now renders in the student's own
// language. Both variants of every template must be previewable.
const testLang = (req) => (String(req.query.lang || '').toLowerCase().startsWith('en') ? 'en' : 'ar');
const testOpts = (req) => ({ lang: testLang(req) });
const TEST_USERNAME_AR = 'محمود';
const TEST_USERNAME_EN = 'Mahmod';
const testName = (req) => (testLang(req) === 'en' ? TEST_USERNAME_EN : TEST_USERNAME_AR);

// ─── Cron auth middleware ──────────────────────────────────────────────────
// Vercel sets Authorization: Bearer <CRON_SECRET> on cron invocations.
// Falls through without auth in development (no CRON_SECRET set).
const cronAuth = (req, res, next) => {
    const secret = process.env.CRON_SECRET;
    if (!secret) return next(); // local dev — no secret configured
    const authHeader = req.headers.authorization || '';
    if (authHeader === `Bearer ${secret}`) return next();
    return res.status(401).json({ success: false, message: 'Unauthorized' });
};

// ════════════════════════════════════════════════════════════
//  TEST ROUTES  — always send to the owner's inbox
// ════════════════════════════════════════════════════════════

/**
 * One preview definition per template, so /api/email-test/:name and the
 * send-everything route below can never drift apart — adding a template here
 * is all it takes for both to know about it.
 *
 * Every entry is a function of the request, because the previews are meant to
 * be steerable: ?track=nursing, ?lang=en, ?days=3, ?streak=12.
 */
const PREVIEWS = {
    welcome: (req) => sendWelcomeEmail(TEST_EMAIL, testName(req), testTrack(req), testOpts(req)),

    inactivity: (req) => sendInactivityEmail(TEST_EMAIL, testName(req), testTrack(req), testOpts(req)),

    streak: (req) => sendStreakReminderEmail(
        TEST_EMAIL, testName(req), parseInt(req.query.streak) || 7, testTrack(req), testOpts(req)),

    feedback: (req) => sendFeedbackEmail(TEST_EMAIL, testName(req), testTrack(req), testOpts(req)),

    'trial-ended': (req) => sendTrialEndedEmail(TEST_EMAIL, testName(req), testTrack(req), {
        questionsAnswered: req.query.answered !== undefined ? parseInt(req.query.answered) : 24,
        accuracy: req.query.accuracy !== undefined ? parseFloat(req.query.accuracy) : 71,
        quizzesCompleted: req.query.quizzes !== undefined ? parseInt(req.query.quizzes) : 3,
    }, testOpts(req)),

    comeback: (req) => sendOneSessionComebackEmail(TEST_EMAIL, testName(req), testTrack(req), {
        questionsAnswered: req.query.answered !== undefined ? parseInt(req.query.answered) : 10,
        correct: req.query.correct !== undefined ? parseInt(req.query.correct) : 6,
        wrongCount: req.query.wrong !== undefined ? parseInt(req.query.wrong) : 4,
    }, testOpts(req)),

    'progress-digest': (req) => sendProgressDigestEmail(TEST_EMAIL, testName(req), testTrack(req), {
        questionsThisWeek: 86,
        accuracyThisWeek: 74,
        accuracyLastWeek: 66,
        streak: 5,
        goal: {
            label: testLang(req) === 'en' ? 'questions' : 'أسئلة',
            current: 86,
            target: 100,
        },
        examDaysRemaining: req.query.examDays !== undefined ? parseInt(req.query.examDays) : 21,
    }, testOpts(req)),

    'expiry-reminder': (req) => sendExpiryReminderEmail(
        TEST_EMAIL, testName(req), testTrack(req), parseInt(req.query.days) || 7, testOpts(req)),

    // The ladder is one template with five faces, so the preview takes ?days
    // and the send-all route below walks every rung.
    'exam-reminder': (req) => sendExamReminderEmail(
        TEST_EMAIL, testName(req), testTrack(req),
        req.query.days !== undefined ? parseInt(req.query.days) : 14,
        {
            questionsAnswered: req.query.answered !== undefined ? parseInt(req.query.answered) : 412,
            accuracy: req.query.accuracy !== undefined ? parseFloat(req.query.accuracy) : 68,
            wrongCount: req.query.wrong !== undefined ? parseInt(req.query.wrong) : 131,
            weakestLabel: testLang(req) === 'en' ? 'Pediatrics' : 'الأطفال',
            weakestAccuracy: 54,
        },
        testOpts(req)),
};

/**
 * GET /api/email-test/:name — send one template to the owner's inbox.
 * e.g. /api/email-test/exam-reminder?days=3&lang=en&track=nursing
 */
router.get('/api/email-test/:name', adminAuth, async (req, res, next) => {
    const preview = PREVIEWS[req.params.name];
    // Not a template name — fall through so the sibling routes registered
    // below this one (subscription-report, all) still match.
    if (!preview) return next();
    try {
        await preview(req);
        res.json({
            success: true,
            message: `${req.params.name} email sent to ${TEST_EMAIL} (lang=${testLang(req)}, track=${testTrack(req)})`,
        });
    } catch (err) {
        console.error(`email-test/${req.params.name} error:`, err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/email-test/all?lang=en&track=medical — every template, in order.
 *
 * Sends sequentially with a small gap rather than in parallel: the shared
 * Resend budget is rationed per-second by the gateway, and a burst of a dozen
 * would have several of them rejected rather than delivered. Errors are
 * collected, not thrown, so one bad template cannot hide the other eleven.
 *
 * The exam ladder contributes one message per rung, because the whole point of
 * the ladder is that the rungs read differently.
 */
router.get('/api/email-test/all', adminAuth, async (req, res) => {
    const sent = [];
    const errors = [];
    const run = async (label, fn) => {
        try {
            await fn();
            sent.push(label);
        } catch (err) {
            errors.push({ template: label, error: err.message });
        }
        await new Promise((r) => setTimeout(r, 900));
    };

    for (const [name, preview] of Object.entries(PREVIEWS)) {
        if (name === 'exam-reminder') continue; // walked rung by rung below
        await run(name, () => preview(req));
    }
    for (const days of EXAM_REMINDER_STAGES) {
        // Every preview reads nothing but `query`, so a bare shim is both
        // sufficient and safer than cloning an Express request.
        const shim = { query: { ...req.query, days: String(days) } };
        await run(`exam-reminder:${days}d`, () => PREVIEWS['exam-reminder'](shim));
    }

    res.json({
        success: errors.length === 0,
        to: TEST_EMAIL,
        lang: testLang(req),
        track: testTrack(req),
        sent,
        errors,
    });
});

// ════════════════════════════════════════════════════════════
//  CRON ROUTES  — called by Vercel Cron or external scheduler
// ════════════════════════════════════════════════════════════

/**
 * POST /api/cron/welcome-emails
 * Finds accounts created 1+ hour ago with welcome_email_sent = FALSE
 * and a verified email. Sends welcome email and marks as sent.
 * Schedule: every hour  (0 * * * *)
 */
router.get('/api/cron/welcome-emails', cronAuth, async (req, res) => {
    const db = req.db;
    try {
        const { rows } = await db.query(`
            SELECT id, username, email, track, preferred_lang
            FROM accounts
            WHERE welcome_email_sent = FALSE
              AND created_at < NOW() - INTERVAL '1 hour'
              AND email IS NOT NULL
              AND email_verified = TRUE
              AND isactive = TRUE
              AND COALESCE(email_opt_out, FALSE) = FALSE
            LIMIT 50
        `);

        let sent = 0;
        const errors = [];
        for (const user of rows) {
            try {
                await sendWelcomeEmail(user.email, String(user.username).split('@')[0], user.track,
                    { lang: user.preferred_lang, accountId: user.id });
                await db.query(
                    `UPDATE accounts SET welcome_email_sent = TRUE, welcome_email_sent_at = NOW() WHERE id = $1`,
                    [user.id]
                );
                sent++;
            } catch (err) {
                errors.push({ userId: user.id, error: err.message });
            }
        }

        res.json({ success: true, sent, errors });
    } catch (err) {
        console.error('cron/welcome-emails error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/cron/daily-emails
 * Handles three jobs in one call:
 *   1. Inactivity reminders  — last login 2-3 days ago
 *   2. Streak reminders      — streak > 2 and last active = yesterday
 *   3. Feedback requests     — account 7+ days old, never sent
 * Schedule: daily at 9 AM  (0 9 * * *)
 */
router.get('/api/cron/daily-emails', cronAuth, async (req, res) => {
    const db = req.db;
    const results = { inactivity: 0, streak: 0, feedback: 0, errors: [] };

    // ── 1. Inactivity ────────────────────────────────────────
    try {
        const { rows: inactive } = await db.query(`
            SELECT id, username, email, track, preferred_lang
            FROM accounts
            WHERE logged_date BETWEEN NOW() - INTERVAL '3 days' AND NOW() - INTERVAL '2 days'
              AND email IS NOT NULL
              AND email_verified = TRUE
              AND isactive = TRUE
              AND COALESCE(email_opt_out, FALSE) = FALSE
              AND (inactivity_email_sent_at IS NULL
                   OR inactivity_email_sent_at < NOW() - INTERVAL '7 days')
            LIMIT 100
        `);

        for (const user of inactive) {
            try {
                await sendInactivityEmail(user.email, String(user.username).split('@')[0], user.track,
                    { lang: user.preferred_lang, accountId: user.id });
                await db.query(
                    `UPDATE accounts SET inactivity_email_sent_at = NOW() WHERE id = $1`,
                    [user.id]
                );
                results.inactivity++;
            } catch (err) {
                results.errors.push({ job: 'inactivity', userId: user.id, error: err.message });
            }
        }
    } catch (err) {
        results.errors.push({ job: 'inactivity_query', error: err.message });
    }

    // ── 2. Streak reminders ───────────────────────────────────
    try {
        const { rows: streakUsers } = await db.query(`
            SELECT a.id, a.username, a.email, a.track, a.preferred_lang, us.current_streak
            FROM accounts a
            JOIN user_streaks us ON us.user_id = a.id
            WHERE us.last_active_date::date = CURRENT_DATE - 1
              AND us.current_streak > 2
              AND a.email IS NOT NULL
              AND a.email_verified = TRUE
              AND a.isactive = TRUE
              AND COALESCE(a.email_opt_out, FALSE) = FALSE
            LIMIT 100
        `);

        for (const user of streakUsers) {
            try {
                await sendStreakReminderEmail(user.email, String(user.username).split('@')[0], user.current_streak, user.track,
                    { lang: user.preferred_lang, accountId: user.id });
                results.streak++;
            } catch (err) {
                results.errors.push({ job: 'streak', userId: user.id, error: err.message });
            }
        }
    } catch (err) {
        results.errors.push({ job: 'streak_query', error: err.message });
    }

    // ── 3. Feedback requests ──────────────────────────────────
    try {
        const { rows: feedbackUsers } = await db.query(`
            SELECT id, username, email, track, preferred_lang
            FROM accounts
            WHERE created_at < NOW() - INTERVAL '7 days'
              AND feedback_email_sent_at IS NULL
              AND email IS NOT NULL
              AND email_verified = TRUE
              AND isactive = TRUE
              AND COALESCE(email_opt_out, FALSE) = FALSE
            LIMIT 50
        `);

        for (const user of feedbackUsers) {
            try {
                await sendFeedbackEmail(user.email, String(user.username).split('@')[0], user.track,
                    { lang: user.preferred_lang, accountId: user.id });
                await db.query(
                    `UPDATE accounts SET feedback_email_sent_at = NOW() WHERE id = $1`,
                    [user.id]
                );
                results.feedback++;
            } catch (err) {
                results.errors.push({ job: 'feedback', userId: user.id, error: err.message });
            }
        }
    } catch (err) {
        results.errors.push({ job: 'feedback_query', error: err.message });
    }

    // ── 3b. Conversion & retention lifecycle ──────────────────
    // Trial-ended is the highest-value email in the product: the journey audit
    // found 86% of trial users never return after their hour and nothing was
    // sent at that moment. Each job is idempotent and stamps its own dedupe
    // column, so running them here AND from /api/cron/lifecycle-emails (for a
    // tighter cadence than once a day) can never double-send.
    for (const [name, job] of [
        ['trialEnded', runTrialEndedJob],
        ['expiryReminder', runExpiryReminderJob],
        ['progressDigest', runProgressDigestJob],
        ['examReminder', runExamReminderJob],
        ['comeback', runComebackJob],
    ]) {
        try {
            const r = await job(db);
            results[name] = r.sent;
            if (r.errors.length) results.errors.push(...r.errors);
        } catch (err) {
            console.error(`cron/daily-emails ${name} error:`, err);
            results.errors.push({ job: name, error: err.message });
        }
    }

    // ── 4. Bi-daily subscription report ───────────────────────
    // Runs on every daily invocation but only sends when the last report is
    // ≥ 47h old — i.e. a PDF of new subscriptions every 2 days. Kept inside
    // this cron so the project stays within Vercel's 2-cron (Hobby) limit.
    try {
        results.subscriptionReport = await maybeSendSubscriptionReport(db);
    } catch (err) {
        console.error('cron/daily-emails subscription report error:', err);
        results.errors.push({ job: 'subscription_report', error: err.message });
    }

    // ── 5. Broadcast campaigns ────────────────────────────────
    // Push any campaign that is mid-send one batch further. A campaign spread
    // over hours or days outlives the admin's browser tab, so it needs a
    // scheduled nudge to finish on its own.
    try {
        results.broadcasts = await drainSendingCampaigns(db);
    } catch (err) {
        console.error('cron/daily-emails broadcast drain error:', err);
        results.errors.push({ job: 'broadcast_drain', error: err.message });
    }

    res.json({ success: true, ...results });
});

/**
 * GET /api/email-test/subscription-report?days=2
 * Force-sends the subscriptions PDF report immediately (admin only).
 * Does NOT count as a scheduled send, so the 2-day cadence is unaffected.
 */
router.get('/api/email-test/subscription-report', adminAuth, async (req, res) => {
    const days = Math.min(30, Math.max(1, parseInt(req.query.days) || 2));
    try {
        const result = await sendSubscriptionReport(req.db, {
            periodStart: new Date(Date.now() - days * 24 * 3600 * 1000),
            periodEnd: new Date(),
            record: false,
        });
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('email-test/subscription-report error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * GET /api/cron/broadcast-drain
 *
 * Advances every in-flight campaign by one batch. Separate from the daily job
 * so it can be called as often as the pacing needs — a campaign spread over
 * two days wants a nudge every few minutes, not once a day.
 *
 * Vercel's Hobby plan allows only two cron entries and both are taken, so
 * point any external scheduler (cron-job.org, GitHub Actions, Uptime Robot)
 * at this URL with `Authorization: Bearer $CRON_SECRET`. It is safe to call
 * frequently: the pacing gate and the daily cap decide whether anything is
 * actually due, and rows are claimed with SKIP LOCKED so overlapping calls
 * can never mail the same person twice.
 */
/**
 * GET /api/cron/lifecycle-emails
 *
 * Trial-ended + expiry-reminder + progress-digest, on demand.
 *
 * The same three jobs also run inside the daily cron, but a trial lasts ONE
 * HOUR — a student who signs up at 10:00 and loses access at 11:00 would not
 * hear from us until the next 09:00 run. Vercel's Hobby plan caps the project
 * at two cron entries and both are taken, so point an external scheduler
 * (cron-job.org, GitHub Actions, Uptime Robot) at this URL every 15-30 minutes
 * with `Authorization: Bearer $CRON_SECRET` to close that gap. Safe to call as
 * often as you like: every job is idempotent and stamps its dedupe column
 * immediately after each successful send.
 */
router.get('/api/cron/lifecycle-emails', cronAuth, async (req, res) => {
    const out = { trialEnded: 0, expiryReminder: 0, progressDigest: 0, errors: [] };
    for (const [name, job] of [
        ['trialEnded', runTrialEndedJob],
        ['expiryReminder', runExpiryReminderJob],
        ['progressDigest', runProgressDigestJob],
        ['examReminder', runExamReminderJob],
        ['comeback', runComebackJob],
    ]) {
        try {
            const r = await job(req.db);
            out[name] = r.sent;
            if (r.errors.length) out.errors.push(...r.errors);
        } catch (err) {
            out.errors.push({ job: name, error: err.message });
        }
    }
    res.json({ success: true, ...out });
});

router.get('/api/cron/broadcast-drain', cronAuth, async (req, res) => {
    try {
        const results = await drainSendingCampaigns(req.db);
        res.json({ success: true, campaigns: results });
    } catch (err) {
        console.error('cron/broadcast-drain error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
