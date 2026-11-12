/**
 * GET /api/check-completion/:userId - "has this student finished this specialty +
 * collection?" - plus the short circuit for the dead "whole bank" sentinel.
 *
 * Why the short circuit exists (optimization program, change C1, 2026-11):
 * the web launcher (QuizLauncher.jsx) and the Android launcher default the
 * `source` to UNIFIED_BANK = 'MidgardGameBoy', the retired single-bank label.
 * Since the 2026H2 rebuild no question carries it in `questions.sources`
 * (live count on 11 Nov 2026: 0 of 14,376), so the two COUNT queries below can
 * only ever answer 0. Roughly 4,100 such calls a week (about 11% of logged-in
 * API traffic) each paid for two database round trips to learn that.
 *
 * The short circuit answers the identical JSON without touching the database,
 * ONLY when `source` is exactly that sentinel. Authentication and the own-user
 * check are route middleware that run BEFORE this handler, so they are
 * unchanged. Every other source goes down the original code path, untouched.
 *
 * If a question is ever filed under 'MidgardGameBoy' again (an import that
 * re-creates the old label), this short circuit would hide its progress: see
 * the tripwire test in completionCheck.test.js and remove DEAD_COMPLETION_SOURCE
 * handling first.
 */
import { UNIFIED_BANK } from '../config/sources.js';

export const DEAD_COMPLETION_SOURCE = UNIFIED_BANK;

/** True only for the exact sentinel string (an array or other casing is NOT dead). */
export function isDeadCompletionSource(source) {
    return source === DEAD_COMPLETION_SOURCE;
}

/** The body the full handler produces when total is 0 (same keys, same order). */
export function deadCompletionBody() {
    return { total: 0, completed: 0, isCompleted: false, percentage: 0 };
}

/**
 * Express handler factory. The body below the short circuit is the original
 * handler from app.js, moved unchanged.
 *   db                  object with query(sql, params)
 *   resolveContentTrack (req) => track, from the authenticated session
 */
export function makeCheckCompletionHandler({ db, resolveContentTrack }) {
    return async (req, res) => {
        const { userId } = req.params;
        const { type, source } = req.query;

        if (isDeadCompletionSource(source)) {
            return res.json(deadCompletionBody());
        }

        try {
            // Get total questions for this cardinality, within the caller's bank
            const track = resolveContentTrack(req);
            const totalQuery = await db.query(`
            SELECT COUNT(*) as total
            FROM questions
            WHERE track = $1 AND question_type = $2 AND $3 = ANY(sources)
        `, [track, type, source]);

            // Get completed questions for this cardinality
            const completedQuery = await db.query(`
            SELECT COUNT(*) as completed
            FROM user_question_progress p
            JOIN questions q ON q.id = p.question_id
            WHERE p.user_id = $1 AND q.question_type = $2 AND $3 = ANY(q.sources)
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
    };
}
