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
} from '../services/userEmailService.js';
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
const TEST_USERNAME = 'محمود';

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

// GET /api/email-test/welcome
router.get('/api/email-test/welcome', adminAuth, async (req, res) => {
    try {
        await sendWelcomeEmail(TEST_EMAIL, TEST_USERNAME, testTrack(req));
        res.json({ success: true, message: `Welcome email sent to ${TEST_EMAIL}` });
    } catch (err) {
        console.error('email-test/welcome error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/email-test/inactivity
router.get('/api/email-test/inactivity', adminAuth, async (req, res) => {
    try {
        await sendInactivityEmail(TEST_EMAIL, TEST_USERNAME, testTrack(req));
        res.json({ success: true, message: `Inactivity email sent to ${TEST_EMAIL}` });
    } catch (err) {
        console.error('email-test/inactivity error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/email-test/streak
router.get('/api/email-test/streak', adminAuth, async (req, res) => {
    const mockStreak = parseInt(req.query.streak) || 7;
    try {
        await sendStreakReminderEmail(TEST_EMAIL, TEST_USERNAME, mockStreak, testTrack(req));
        res.json({ success: true, message: `Streak reminder sent to ${TEST_EMAIL} (streak=${mockStreak})` });
    } catch (err) {
        console.error('email-test/streak error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/email-test/feedback
router.get('/api/email-test/feedback', adminAuth, async (req, res) => {
    try {
        await sendFeedbackEmail(TEST_EMAIL, TEST_USERNAME, testTrack(req));
        res.json({ success: true, message: `Feedback email sent to ${TEST_EMAIL}` });
    } catch (err) {
        console.error('email-test/feedback error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
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
            SELECT id, username, email, track
            FROM accounts
            WHERE welcome_email_sent = FALSE
              AND created_at < NOW() - INTERVAL '1 hour'
              AND email IS NOT NULL
              AND email_verified = TRUE
              AND isactive = TRUE
            LIMIT 50
        `);

        let sent = 0;
        const errors = [];
        for (const user of rows) {
            try {
                await sendWelcomeEmail(user.email, user.username, user.track);
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
            SELECT id, username, email, track
            FROM accounts
            WHERE logged_date BETWEEN NOW() - INTERVAL '3 days' AND NOW() - INTERVAL '2 days'
              AND email IS NOT NULL
              AND email_verified = TRUE
              AND isactive = TRUE
              AND (inactivity_email_sent_at IS NULL
                   OR inactivity_email_sent_at < NOW() - INTERVAL '7 days')
            LIMIT 100
        `);

        for (const user of inactive) {
            try {
                await sendInactivityEmail(user.email, user.username, user.track);
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
            SELECT a.id, a.username, a.email, a.track, us.current_streak
            FROM accounts a
            JOIN user_streaks us ON us.user_id = a.id
            WHERE us.last_active_date::date = CURRENT_DATE - 1
              AND us.current_streak > 2
              AND a.email IS NOT NULL
              AND a.email_verified = TRUE
              AND a.isactive = TRUE
            LIMIT 100
        `);

        for (const user of streakUsers) {
            try {
                await sendStreakReminderEmail(user.email, user.username, user.current_streak, user.track);
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
            SELECT id, username, email, track
            FROM accounts
            WHERE created_at < NOW() - INTERVAL '7 days'
              AND feedback_email_sent_at IS NULL
              AND email IS NOT NULL
              AND email_verified = TRUE
              AND isactive = TRUE
            LIMIT 50
        `);

        for (const user of feedbackUsers) {
            try {
                await sendFeedbackEmail(user.email, user.username, user.track);
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
