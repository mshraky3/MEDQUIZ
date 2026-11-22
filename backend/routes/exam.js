/**
 * Exam mode: an exam-style simulation of the track's licensing exam.
 *
 *   GET  /api/exam/config       the track's exam template, the account's
 *                               entitlement (full / demo / demo already used)
 *                               and how many usable questions the pool holds
 *   POST /api/exam/start        the questions for one sitting
 *   POST /api/exam/demo/submit  save a finished free demo (graded server-side)
 *
 * Mounted behind requireSession (app.js), which sets req.accountId and
 * req.userTrack from the validated session. Nothing here reads a track, a user
 * id or an exam key from the request: the track is the account's, the exam is
 * the track's.
 *
 * A PAID account's finished exam is saved by the existing POST /final-quiz/submit
 * (its session_metadata carries the part scores and the flags used). A FREE
 * account cannot call that route (subscriberOnly), which is why the demo has its
 * own submit here. Explanations are never in these payloads: after saving, the
 * review reads them from GET /final-quiz/session/:id/questions.
 */
import express from 'express';
import { runConfig, buildPartPlan, publicExamConfig, DEMO_EXAM } from '../config/exams.js';
import { checkSubscriptionAccess } from '../services/paymentService.js';
import {
    buildExam, countUsableBySpecialty, getDemoClaim, claimState, claimDemo, pinDemoQuestions,
    releaseDemoClaim, loadPinnedQuestions, saveDemoSession,
} from '../services/examService.js';
import { planQuotas } from '../services/examPicker.js';
import { logger } from '../utils/observability.js';

const router = express.Router();

const ACCOUNT_FIELDS = `id, track, subscription_status, subscription_expiry_date,
                        is_admin_created, grandfathered_at`;

async function loadAccount(db, accountId) {
    const { rows } = await db.query(`SELECT ${ACCOUNT_FIELDS} FROM accounts WHERE id = $1`, [accountId]);
    return rows[0] || null;
}

/** 'full' for paid / exempt accounts, otherwise the demo state. */
async function entitlementFor(db, account) {
    if (checkSubscriptionAccess(account).allowed) return { kind: 'full', claim: null };
    const claim = await getDemoClaim(db, account.id);
    const state = claimState(claim);
    return { kind: state === 'available' ? 'demo' : state === 'resume' ? 'demo_resume' : 'demo_used', claim };
}

const runShape = (config, served) => ({
    exam: publicExamConfig(config),
    parts: buildPartPlan(config, served),
});

router.get('/config', async (req, res) => {
    try {
        const account = await loadAccount(req.db, req.accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        const track = req.userTrack || account.track;
        const ent = await entitlementFor(req.db, account);
        const counts = await countUsableBySpecialty(req.db, track);

        const full = runConfig(track);
        const demo = runConfig(track, { demo: true });
        const fullPlan = planQuotas(full, counts);
        const demoPlan = planQuotas(demo, counts);
        res.json({
            track,
            entitlement: ent.kind,
            full: { ...runShape(full, fullPlan.served), served: fullPlan.served, capped: fullPlan.capped, notes: fullPlan.notes },
            demo: { ...runShape(demo, demoPlan.served), served: demoPlan.served, capped: demoPlan.capped, minutesPerQuestion: DEMO_EXAM.minutesPerQuestion },
        });
    } catch (err) {
        logger.error('exam config failed', { error: err.message });
        res.status(500).json({ message: 'Failed to load the exam' });
    }
});

router.post('/start', async (req, res) => {
    const db = req.db;
    let claimedHere = false;
    try {
        const account = await loadAccount(db, req.accountId);
        if (!account) return res.status(404).json({ message: 'Account not found' });
        const track = req.userTrack || account.track;
        const ent = await entitlementFor(db, account);

        if (ent.kind === 'full') {
            const config = runConfig(track);
            const built = await buildExam(db, { track, config });
            if (built.served === 0) return res.status(404).json({ code: 'NO_QUESTIONS', message: 'No exam questions are available yet' });
            return res.json({
                mode: 'full',
                ...runShape(config, built.served),
                requested: built.requested,
                served: built.served,
                capped: built.capped,
                byDomain: built.byDomain,
                notes: built.notes,
                questions: built.questions,
            });
        }

        // A free account: the demo, once.
        if (ent.kind === 'demo_used') {
            return res.status(403).json({ code: 'DEMO_USED', message: 'The free demo has already been used' });
        }
        const config = runConfig(track, { demo: true });

        if (ent.kind === 'demo_resume') {
            const questions = await loadPinnedQuestions(db, ent.claim.question_ids);
            if (questions.length === 0) return res.status(403).json({ code: 'DEMO_USED', message: 'The free demo has already been used' });
            return res.json({
                mode: 'demo',
                resumed: true,
                ...runShape(config, questions.length),
                requested: config.questions,
                served: questions.length,
                capped: questions.length < config.questions,
                byDomain: [],
                notes: [],
                questions,
            });
        }

        claimedHere = await claimDemo(db, account.id, config.key);
        if (!claimedHere) {
            // Lost a race with a parallel start of the same account: it owns the demo.
            return res.status(403).json({ code: 'DEMO_USED', message: 'The free demo has already been used' });
        }
        const built = await buildExam(db, { track, config });
        if (built.served === 0) {
            await releaseDemoClaim(db, account.id);
            return res.status(404).json({ code: 'NO_QUESTIONS', message: 'No exam questions are available yet' });
        }
        await pinDemoQuestions(db, account.id, built.questions.map((q) => q.id));
        return res.json({
            mode: 'demo',
            resumed: false,
            ...runShape(config, built.served),
            requested: built.requested,
            served: built.served,
            capped: built.capped,
            byDomain: built.byDomain,
            notes: built.notes,
            questions: built.questions,
        });
    } catch (err) {
        if (claimedHere) await releaseDemoClaim(db, req.accountId).catch(() => {});
        logger.error('exam start failed', { error: err.message });
        res.status(500).json({ message: 'Failed to start the exam' });
    }
});

router.post('/demo/submit', async (req, res) => {
    try {
        const { questionAttempts, timeTaken, timeLimit, flagsUsed, sessionMetadata } = req.body || {};
        const out = await saveDemoSession(req.db, {
            accountId: req.accountId,
            attempts: questionAttempts,
            timeTaken,
            timeLimit,
            flagsUsed,
            metaIn: sessionMetadata,
        });
        if (out.status === 'no_claim') return res.status(403).json({ code: 'NO_DEMO', message: 'No demo to save' });
        if (out.status === 'bad_attempts') return res.status(400).json({ code: 'BAD_ATTEMPTS', message: 'The answers do not belong to this demo' });
        res.json({
            success: true,
            alreadySaved: out.status === 'already',
            sessionId: out.sessionId,
            sessionUuid: out.sessionUuid,
            score: out.score,
        });
    } catch (err) {
        logger.error('exam demo submit failed', { error: err.message });
        res.status(500).json({ message: 'Failed to save the demo' });
    }
});

export default router;
