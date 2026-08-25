/**
 * Study goals and in-app notifications.
 *
 * A goal is the student's own commitment — "300 questions this week" — rather
 * than a target the product picked for them, which is why the hub asks for one
 * instead of assigning it. Progress is always computed live from
 * user_quiz_sessions via goalProgress() in lifecycleJobs.js, never cached on
 * the row: a stored counter and a session table WILL drift, and the same
 * function feeds the weekly digest email so the number in the inbox and the
 * number on the page can never disagree.
 *
 * Every route resolves the account from the validated session (req.accountId),
 * never from a client-supplied id — otherwise anyone could read or overwrite
 * another student's goals.
 */
import express from 'express';
import { goalProgress, scopedBaseline } from '../services/lifecycleJobs.js';
import { specialtyKeys, normalizeTrack } from '../config/tracks.js';
import { PICKABLE_SOURCES } from '../config/sources.js';
import { logger } from '../utils/observability.js';

const router = express.Router();

const GOAL_TYPES = new Set(['questions', 'quizzes', 'accuracy']);
const PERIODS = new Set(['weekly', 'total']);

/**
 * A goal may be narrowed to one specialty and/or one collection, but only to
 * ones that exist in the caller's own track. Validating against the account's
 * track (not the request) is what stops a medical account setting a goal on a
 * nursing specialty and then staring at a bar that can never move.
 *
 * Sources are checked against PICKABLE_SOURCES rather than SELECTABLE_SOURCES:
 * medical's bank is unified and deliberately never exposes its internal
 * collections, so that track simply has no source to pick.
 */
async function resolveScope(db, accountId, body) {
    const { rows } = await db.query(`SELECT track FROM accounts WHERE id = $1`, [accountId]);
    const track = normalizeTrack(rows[0]?.track);

    const questionType = body?.questionType ? String(body.questionType) : null;
    const source = body?.source ? String(body.source) : null;

    if (questionType && !specialtyKeys(track).includes(questionType)) {
        return { error: 'Unknown specialty for this track' };
    }
    if (source && !(PICKABLE_SOURCES[track] || []).includes(source)) {
        return { error: 'Unknown collection for this track' };
    }
    return { questionType, source };
}

// Guard rails on the target. An accuracy goal is a percentage; the others are
// counts. A goal of 100,000 questions is not motivating, it is noise.
const LIMITS = {
    questions: { min: 5, max: 5000 },
    quizzes: { min: 1, max: 500 },
    accuracy: { min: 40, max: 100 },
};

/** Shape one goal row + its live progress for the client. */
async function serializeGoal(db, userId, row) {
    if (!row) return null;
    const { current, label } = await goalProgress(db, userId, row);
    const pct = row.target_value > 0
        ? Math.min(100, Math.round((current / row.target_value) * 100))
        : 0;
    return {
        id: row.id,
        goalType: row.goal_type,
        period: row.period,
        target: row.target_value,
        // null in either means "the whole bank" — the client renders no scope
        // chip at all rather than the words "all specialties".
        questionType: row.question_type || null,
        source: row.source || null,
        current,
        label,
        percent: pct,
        achieved: !!row.achieved_at || current >= row.target_value,
        achievedAt: row.achieved_at,
        createdAt: row.created_at,
    };
}

/** GET /api/goals — the active goal (or null) with live progress. */
router.get('/', async (req, res) => {
    try {
        const { rows } = await req.db.query(
            `SELECT * FROM user_goals WHERE user_id = $1 AND is_active = TRUE LIMIT 1`,
            [req.accountId]
        );
        res.json({ success: true, goal: await serializeGoal(req.db, req.accountId, rows[0]) });
    } catch (err) {
        logger.error('[goals] fetch failed:', err);
        res.status(500).json({ success: false, message: 'Failed to load goal' });
    }
});

/**
 * PUT /api/goals — set (or replace) the active goal.
 *
 * Replacing deactivates the previous one rather than deleting it, so the
 * history of what someone committed to survives. The partial unique index on
 * (user_id) WHERE is_active guarantees only one can be live at a time, so the
 * deactivate MUST land before the insert — both run in one transaction.
 */
router.put('/', async (req, res) => {
    const goalType = String(req.body?.goalType || '');
    const period = String(req.body?.period || 'weekly');
    const target = parseInt(req.body?.target, 10);

    if (!GOAL_TYPES.has(goalType)) {
        return res.status(400).json({ success: false, message: 'Invalid goal type' });
    }
    if (!PERIODS.has(period)) {
        return res.status(400).json({ success: false, message: 'Invalid period' });
    }
    const lim = LIMITS[goalType];
    if (!Number.isFinite(target) || target < lim.min || target > lim.max) {
        return res.status(400).json({
            success: false,
            message: `Target must be between ${lim.min} and ${lim.max}`,
        });
    }
    // An accuracy goal is a rate over a window, so "total accuracy since I set
    // this" is not a thing a baseline could express.
    const effectivePeriod = goalType === 'accuracy' ? 'weekly' : period;

    const scope = await resolveScope(req.db, req.accountId, req.body);
    if (scope.error) {
        return res.status(400).json({ success: false, message: scope.error });
    }
    // A quiz session can mix specialties, so "10 paediatrics quizzes" is not a
    // question the data can answer honestly — the scope is dropped rather than
    // silently counting something else. goalProgress() makes the same choice.
    const questionType = goalType === 'quizzes' ? null : scope.questionType;
    const source = goalType === 'quizzes' ? null : scope.source;

    const client = await req.db.connect();
    try {
        await client.query('BEGIN');
        await client.query(
            `UPDATE user_goals SET is_active = FALSE WHERE user_id = $1 AND is_active = TRUE`,
            [req.accountId]
        );

        // Baseline: lifetime total at creation, so a 'total' goal measures work
        // done from now on rather than crediting everything already answered.
        // A scoped goal MUST take its baseline from the same table its progress
        // will be counted from, or it starts life deeply negative.
        let baseline = 0;
        if (effectivePeriod === 'total') {
            if (questionType || source) {
                baseline = await scopedBaseline(client, req.accountId, { question_type: questionType, source });
            } else {
                const col = goalType === 'quizzes'
                    ? `COUNT(*) FILTER (WHERE end_time IS NOT NULL)`
                    : `COALESCE(SUM(total_questions), 0)`;
                const { rows } = await client.query(
                    `SELECT ${col}::int AS n FROM user_quiz_sessions WHERE user_id = $1`,
                    [req.accountId]
                );
                baseline = rows[0]?.n || 0;
            }
        }

        const { rows: inserted } = await client.query(`
            INSERT INTO user_goals (user_id, goal_type, target_value, period, baseline, question_type, source)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `, [req.accountId, goalType, target, effectivePeriod, baseline, questionType, source]);
        await client.query('COMMIT');

        res.json({ success: true, goal: await serializeGoal(req.db, req.accountId, inserted[0]) });
    } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        logger.error('[goals] save failed:', err);
        res.status(500).json({ success: false, message: 'Failed to save goal' });
    } finally {
        client.release();
    }
});

/** DELETE /api/goals — clear the active goal (kept as history). */
router.delete('/', async (req, res) => {
    try {
        await req.db.query(
            `UPDATE user_goals SET is_active = FALSE WHERE user_id = $1 AND is_active = TRUE`,
            [req.accountId]
        );
        res.json({ success: true, goal: null });
    } catch (err) {
        logger.error('[goals] clear failed:', err);
        res.status(500).json({ success: false, message: 'Failed to clear goal' });
    }
});

export default router;
