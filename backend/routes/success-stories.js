/**
 * Success stories — students telling other students it worked.
 *
 * Both competitors that outrank SQB carry testimonials in their top navigation
 * (Siraj Bank has "Testimonials", GulfMedExams has "Success Stories" and "Add
 * Testimonial"). SQB has none, and asks for up to 300 SAR.
 *
 * Three rules this file exists to enforce:
 *
 *  1. NOTHING is published without the author's explicit consent. The consent
 *     checkbox is stored with the row, and a story without it is refused at the
 *     door rather than saved and filtered later.
 *  2. NOTHING is published without a human approving it. Submissions land as
 *     `pending` and only an admin can move them; there is no public endpoint
 *     that reads unapproved rows, and no code path that auto-approves.
 *  3. The public site never reads this table live. Approved stories are
 *     exported to a committed JSON file by scripts/exportSuccessStories.js and
 *     prerendered, the same way the public question pages work — so what is on
 *     the site is always something a person put there deliberately.
 *
 * One story per account, updatable: a student who resubmits is editing theirs,
 * not adding a second. An edit drops the row back to `pending`, because the
 * approved text and the new text are not the same words.
 */
import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { logger } from '../utils/observability.js';
import { normalizeTrack } from '../config/tracks.js';

const router = express.Router();

const MAX_QUOTE = 900;
const MAX_NAME = 80;
const MAX_FIELD = 120;
const STATUSES = ['pending', 'approved', 'rejected'];

/** Trim and cap a free-text field; returns '' for anything unusable. */
const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

/**
 * The session check, identical in shape to routes/summaries.js.
 *
 * A story has to be attributable to a real account — that is the whole value of
 * it — so this endpoint is never anonymous.
 */
async function requireSession(req, res, next) {
    const authHeader = req.headers['authorization'] || '';
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const username = req.query.username || req.body?.username;
    const sessionToken = bearerToken || req.query.sessionToken || req.body?.sessionToken;
    if (!username || !sessionToken) {
        return res.status(401).json({ success: false, message: 'Missing session credentials' });
    }
    try {
        const r = await req.db.query(
            'SELECT id, session_token, track FROM accounts WHERE username = $1',
            [username]
        );
        if (!r.rows.length || r.rows[0].session_token !== sessionToken) {
            return res.status(401).json({ success: false, message: 'Session invalid or expired' });
        }
        req.accountId = r.rows[0].id;
        req.accountTrack = normalizeTrack(r.rows[0].track);
        next();
    } catch (err) {
        logger.error('[SuccessStories] session check failed:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

/**
 * GET /api/success-stories/mine — has this account already told us theirs?
 *
 * Lets the in-app prompt stay quiet for anyone who has already written one,
 * whether or not it has been approved yet.
 */
router.get('/mine', requireSession, async (req, res) => {
    try {
        const { rows } = await req.db.query(
            `SELECT id, display_name, specialty, exam_result, quote, status, created_at
               FROM success_stories WHERE user_id = $1`,
            [req.accountId]
        );
        res.json({ success: true, story: rows[0] || null });
    } catch (err) {
        logger.error('[SuccessStories] mine failed:', err);
        res.status(500).json({ success: false });
    }
});

/** POST /api/success-stories — submit or replace this account's story. */
router.post('/', requireSession, async (req, res) => {
    const displayName = clean(req.body?.display_name, MAX_NAME);
    const quote = clean(req.body?.quote, MAX_QUOTE);
    const specialty = clean(req.body?.specialty, MAX_FIELD);
    const examResult = clean(req.body?.exam_result, MAX_FIELD);
    const lang = req.body?.lang === 'en' ? 'en' : 'ar';
    const consent = req.body?.consent_publish === true;

    if (!displayName || quote.length < 40) {
        return res.status(400).json({
            success: false,
            message: 'A name and a quote of at least 40 characters are required.',
        });
    }
    // Refused rather than stored-and-filtered: a row with no consent is a row
    // that should never have been written down in the first place.
    if (!consent) {
        return res.status(400).json({
            success: false,
            message: 'Consent to publish is required before a story can be submitted.',
        });
    }

    try {
        const { rows } = await req.db.query(
            `INSERT INTO success_stories
                (user_id, display_name, track, specialty, exam_result, quote, lang,
                 consent_publish, status, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, 'pending', NOW())
             ON CONFLICT (user_id) DO UPDATE SET
                display_name = EXCLUDED.display_name,
                specialty = EXCLUDED.specialty,
                exam_result = EXCLUDED.exam_result,
                quote = EXCLUDED.quote,
                lang = EXCLUDED.lang,
                consent_publish = TRUE,
                -- Back to pending: an edit is different words, and the approval
                -- was for the old ones.
                status = 'pending',
                reviewed_at = NULL,
                created_at = NOW()
             RETURNING id, status`,
            [req.accountId, displayName, req.accountTrack, specialty || null,
             examResult || null, quote, lang]
        );
        res.status(201).json({ success: true, story: rows[0] });
    } catch (err) {
        logger.error('[SuccessStories] submit failed:', err);
        res.status(500).json({ success: false, message: 'Could not save your story.' });
    }
});

/** GET /api/success-stories — admin review queue. */
router.get('/', adminAuth, async (req, res) => {
    const status = STATUSES.includes(req.query.status) ? req.query.status : null;
    try {
        const { rows } = await req.db.query(
            `SELECT s.*, a.username
               FROM success_stories s
               JOIN accounts a ON a.id = s.user_id
              ${status ? 'WHERE s.status = $1' : ''}
              ORDER BY s.created_at DESC
              LIMIT 200`,
            status ? [status] : []
        );
        res.json({ success: true, stories: rows });
    } catch (err) {
        logger.error('[SuccessStories] list failed:', err);
        res.status(500).json({ success: false });
    }
});

/** PUT /api/success-stories/:id/status — approve or reject. Admin only. */
router.put('/:id/status', adminAuth, async (req, res) => {
    const status = req.body?.status;
    if (!STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Unknown status.' });
    }
    try {
        const { rows } = await req.db.query(
            `UPDATE success_stories
                SET status = $2, admin_note = $3, reviewed_at = NOW()
              WHERE id = $1
              RETURNING id, status`,
            [req.params.id, status, clean(req.body?.admin_note, 300) || null]
        );
        if (!rows.length) return res.status(404).json({ success: false });
        // Approving here does NOT put anything on the site: the public pages
        // are built from the export script's JSON, so publishing stays a
        // deliberate, reviewable act rather than a side effect of a click.
        res.json({ success: true, story: rows[0] });
    } catch (err) {
        logger.error('[SuccessStories] status update failed:', err);
        res.status(500).json({ success: false });
    }
});

export default router;
