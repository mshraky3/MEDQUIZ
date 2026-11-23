/**
 * Exam mode: an exam-style simulation of the track's licensing exam.
 *
 *   GET  /api/exam/config   the track's exam template, the account's entitlement
 *                           (full / locked) and how many usable questions the pool holds
 *   POST /api/exam/start    the questions for one sitting (paid or exempt accounts only)
 *
 * Mounted behind requireSession (app.js), which sets req.accountId and
 * req.userTrack from the validated session. Nothing here reads a track, a user
 * id or an exam key from the request: the track is the account's, the exam is
 * the track's.
 *
 * A finished exam is saved by the existing POST /final-quiz/submit (its
 * session_metadata carries the part scores and the flags used; it is
 * subscriberOnly, like the exam itself). Explanations are never in these
 * payloads: after saving, the review reads them from
 * GET /final-quiz/session/:id/questions.
 */
import express from 'express';
import { runConfig, buildPartPlan, publicExamConfig } from '../config/exams.js';
import { checkSubscriptionAccess } from '../services/paymentService.js';
import { buildExam, countUsableBySpecialty } from '../services/examService.js';
import { planQuotas } from '../services/examPicker.js';
import { logger } from '../utils/observability.js';

const router = express.Router();

const ACCOUNT_FIELDS = `id, track, subscription_status, subscription_expiry_date,
                        is_admin_created, grandfathered_at`;

async function loadAccount(db, accountId) {
    const { rows } = await db.query(`SELECT ${ACCOUNT_FIELDS} FROM accounts WHERE id = $1`, [accountId]);
    return rows[0] || null;
}

/** 'full' for paid / exempt accounts, otherwise 'locked' (a subscription is needed). */
const entitlementFor = (account) => (checkSubscriptionAccess(account).allowed ? 'full' : 'locked');

const runShape = (config, served) => ({
    exam: publicExamConfig(config),
    parts: buildPartPlan(config, served),
});

router.get('/config', async (req, res) => {
    try {
        const account = await loadAccount(req.db, req.accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        const track = req.userTrack || account.track;
        const counts = await countUsableBySpecialty(req.db, track);
        const full = runConfig(track);
        const plan = planQuotas(full, counts);
        res.json({
            track,
            entitlement: entitlementFor(account),
            full: { ...runShape(full, plan.served), served: plan.served, capped: plan.capped, notes: plan.notes },
        });
    } catch (err) {
        logger.error('exam config failed', { error: err.message });
        res.status(500).json({ message: 'Failed to load the exam' });
    }
});

router.post('/start', async (req, res) => {
    try {
        const account = await loadAccount(req.db, req.accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        if (entitlementFor(account) !== 'full') {
            return res.status(403).json({ code: 'SUBSCRIPTION_REQUIRED', message: 'The exam is available to subscribers' });
        }
        const track = req.userTrack || account.track;
        const config = runConfig(track);
        const built = await buildExam(req.db, { track, config });
        if (built.served === 0) return res.status(404).json({ code: 'NO_QUESTIONS', message: 'No exam questions are available yet' });
        res.json({
            mode: 'full',
            ...runShape(config, built.served),
            requested: built.requested,
            served: built.served,
            capped: built.capped,
            byDomain: built.byDomain,
            notes: built.notes,
            questions: built.questions,
        });
    } catch (err) {
        logger.error('exam start failed', { error: err.message });
        res.status(500).json({ message: 'Failed to start the exam' });
    }
});

export default router;
