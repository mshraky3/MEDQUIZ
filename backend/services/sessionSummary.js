/**
 * Session totals computed from the session's own attempts, not from the browser.
 *
 * Until now POST /quiz-sessions stored total_questions / correct_answers / quiz_accuracy exactly as
 * the browser sent them, while the attempts were posted one by one afterwards (and a failed post was
 * only logged). The audit of 4 Nov 2026 found 39 of 1002 sessions whose totals disagree with their
 * rows. These statements make the attempts the single source of truth.
 *
 * Kill switch: env SESSION_SUMMARY_FROM_ATTEMPTS=off restores the old behaviour.
 * The same SQL is used by the daily integrity job (integrity-check-design.md) with a minimum age.
 */

export const SESSION_SUMMARY_SQL = `
    UPDATE user_quiz_sessions s
       SET total_questions = t.n,
           correct_answers = t.c,
           quiz_accuracy   = ROUND(100.0 * t.c / t.n, 2)
      FROM (SELECT COUNT(*)::int AS n, (COUNT(*) FILTER (WHERE is_correct))::int AS c
              FROM user_question_attempts WHERE quiz_session_id = $1) t
     WHERE s.id = $1 AND s.user_id = $2 AND t.n > 0
       AND (s.total_questions IS DISTINCT FROM t.n OR s.correct_answers IS DISTINCT FROM t.c)
 RETURNING s.id, s.total_questions, s.correct_answers`;

export const FINAL_SUMMARY_SQL = `
    UPDATE final_review_sessions r
       SET total_questions = t.n,
           correct_answers = t.c,
           score           = ROUND(100.0 * t.c / t.n, 2)
      FROM (SELECT COUNT(*)::int AS n, (COUNT(*) FILTER (WHERE is_correct))::int AS c
              FROM final_quiz_attempts WHERE session_id = $1) t
     WHERE r.id = $1 AND r.user_id = $2 AND t.n > 0
       AND (r.total_questions IS DISTINCT FROM t.n OR r.correct_answers IS DISTINCT FROM t.c)
 RETURNING r.id, r.total_questions, r.correct_answers`;

const enabled = (env) => String(env.SESSION_SUMMARY_FROM_ATTEMPTS || 'on').toLowerCase() !== 'off';

/** Best effort: never throws (bookkeeping must not fail a saved quiz). Returns the updated row or null. */
export async function recomputeSessionSummary(db, sessionId, userId, { final = false, env = process.env, onError = () => {} } = {}) {
    if (!enabled(env) || sessionId == null) return null;
    try {
        const r = await db.query(final ? FINAL_SUMMARY_SQL : SESSION_SUMMARY_SQL, [sessionId, userId]);
        return r.rows[0] || null;
    } catch (e) {
        onError(e);
        return null;
    }
}
