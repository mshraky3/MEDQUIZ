/**
 * The student's own exam date.
 *
 * The landing page carries a countdown to the next published sitting window
 * (config/examDates.js on the client), but that is a marketing fact about the
 * exam calendar. This is different: it is the date THIS student is sitting, set
 * by them, and it is the anchor for both the hub countdown and the staged
 * reminder emails in lifecycleJobs.js.
 *
 * Stored as a DATE, never a timestamp. A sitting is a day, not a moment, and a
 * countdown that shifts because the student opened the app from a different
 * timezone would be worse than no countdown at all.
 *
 * Every route resolves the account from the validated session (req.accountId),
 * never from anything the client sends.
 */
import express from 'express';
import { logger } from '../utils/observability.js';

const router = express.Router();

// How far ahead a date may be set. Two years is generous for a licensing exam
// and still rules out the typo that produces a 400-day countdown ("2062").
const MAX_DAYS_AHEAD = 730;
const MS_PER_DAY = 86400000;

/** YYYY-MM-DD → UTC-midnight Date, or null if it isn't a real calendar date. */
function parseISODate(value) {
    const str = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    const d = new Date(`${str}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return null;
    // Rejects 2026-02-30, which Date would otherwise roll forward to March 2nd.
    if (d.toISOString().slice(0, 10) !== str) return null;
    return d;
}

/** Today at UTC midnight — the fixed point every countdown is measured from. */
function todayUTC() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Shape one exam date for the client. `daysRemaining` is computed here rather
 * than in the browser so the number in the hub, the number in the reminder
 * email and the number the reminder job acts on all come from one definition.
 * 0 means "today"; a past date returns a negative number and `passed: true`,
 * which the UI uses to offer setting the next one instead of showing -12.
 */
function serialize(examDate) {
    if (!examDate) return null;
    const iso = examDate.toISOString().slice(0, 10);
    const days = Math.round((new Date(`${iso}T00:00:00Z`).getTime() - todayUTC().getTime()) / MS_PER_DAY);
    return { date: iso, daysRemaining: days, passed: days < 0 };
}

/** GET /api/exam-date — the student's date, or null. */
router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(
            `SELECT exam_date FROM accounts WHERE id = $1`,
            [req.accountId]
        );
        res.json({ success: true, exam: serialize(rows[0]?.exam_date) });
    } catch (err) {
        logger.error('[exam-date] fetch failed:', err);
        res.status(500).json({ success: false, message: 'Failed to load exam date' });
    }
});

/**
 * PUT /api/exam-date — set or change it.
 *
 * Resets exam_reminder_stage to NULL on every write. Someone who postpones
 * their sitting by two months must get the whole ladder again for the new date;
 * leaving the old stage in place would silently swallow every reminder before
 * the one they had already passed.
 */
router.put('/', async (req, res) => {
    const parsed = parseISODate(req.body?.date);
    if (!parsed) {
        return res.status(400).json({ success: false, message: 'Invalid date' });
    }
    const days = Math.round((parsed.getTime() - todayUTC().getTime()) / MS_PER_DAY);
    if (days < 0) {
        return res.status(400).json({ success: false, message: 'Exam date cannot be in the past' });
    }
    if (days > MAX_DAYS_AHEAD) {
        return res.status(400).json({ success: false, message: 'Exam date is too far ahead' });
    }

    try {
        const { rows } = await req.db.query(
            `UPDATE accounts SET exam_date = $2, exam_reminder_stage = NULL
              WHERE id = $1 RETURNING exam_date`,
            [req.accountId, parsed.toISOString().slice(0, 10)]
        );
        res.json({ success: true, exam: serialize(rows[0]?.exam_date) });
    } catch (err) {
        logger.error('[exam-date] save failed:', err);
        res.status(500).json({ success: false, message: 'Failed to save exam date' });
    }
});

/** DELETE /api/exam-date — clear it (and stop the reminder ladder). */
router.delete('/', async (req, res) => {
    try {
        await req.db.query(
            `UPDATE accounts SET exam_date = NULL, exam_reminder_stage = NULL WHERE id = $1`,
            [req.accountId]
        );
        res.json({ success: true, exam: null });
    } catch (err) {
        logger.error('[exam-date] clear failed:', err);
        res.status(500).json({ success: false, message: 'Failed to clear exam date' });
    }
});

export default router;
