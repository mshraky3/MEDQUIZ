/**
 * POST /question-attempts/batch: all answers of one finished quiz in ONE request
 * and ONE multi-row INSERT.
 *
 * Why: the browser (and the Android app) used to fire one POST /question-attempts per
 * answer, all at once. A 150-question quiz was 150 simultaneous requests, each able to
 * get its own serverless instance and its own database connection, which hit the
 * pooler's connection limit (EMAXCONN) on 7 Nov 2026 and lost about 25 answers.
 *
 * Idempotent per (quiz_session_id, question_id) with NO unique index (the table has none
 * and old duplicate rows exist, so a migration needs a clean-up first): a question that
 * already has a row for this session is skipped, and repeated questions inside one
 * payload are collapsed to the first. A retry therefore never duplicates. Two truly
 * simultaneous identical requests could still both insert; the client sends one request
 * and retries only after a failure, so that does not happen in practice.
 */
import { judgeAttempts, summarizeJudgements } from './attemptValidation.js';

export const MAX_ATTEMPTS_PER_BATCH = 500;

const isId = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

/**
 * @returns {Promise<{status:number, body:object}>}
 * @param {object} p {userId, sessionId, attempts, mode, clampSeconds, log}
 */
export async function recordAttemptsBatch(db, { userId, sessionId, attempts, mode, clampSeconds, log = () => {} }) {
    if (!isId(sessionId)) return { status: 400, body: { message: 'quiz_session_id is required' } };
    if (!Array.isArray(attempts) || attempts.length === 0) {
        return { status: 400, body: { message: 'attempts must be a non-empty array' } };
    }
    if (attempts.length > MAX_ATTEMPTS_PER_BATCH) {
        return { status: 413, body: { code: 'BATCH_TOO_LARGE', message: `At most ${MAX_ATTEMPTS_PER_BATCH} attempts per batch` } };
    }
    for (const a of attempts) {
        if (!a || !isId(a.question_id) || a.selected_option === undefined || a.is_correct === undefined || a.time_taken === undefined) {
            return { status: 400, body: { message: 'Missing required attempt data' } };
        }
    }

    // The session must be the caller's own (the old route checks this too, when validation is on).
    const own = await db.query('SELECT user_id FROM user_quiz_sessions WHERE id = $1', [Number(sessionId)]);
    if (own.rows.length === 0 || Number(own.rows[0].user_id) !== userId) {
        log('ATTEMPT_SESSION_NOT_OWNED', { userId, sessionId });
        return { status: 400, body: { code: 'SESSION_NOT_OWNED', message: 'quiz_session_id does not belong to this account' } };
    }

    // Same pairing check as the single route: the server decides is_correct from the key.
    let rejected = 0;
    let rows = attempts;
    let judged = null;
    if (mode !== 'off') {
        judged = await judgeAttempts(db, attempts, (a) => ({ questionId: a.question_id, selected: a.selected_option }), mode);
        const sums = summarizeJudgements(judged);
        if (sums.bad > 0) log('ATTEMPT_NOT_AN_OPTION', { userId, sessionId, bad: sums.bad, total: sums.total, mode });
    }
    const seen = new Set();
    const keep = [];
    attempts.forEach((a, i) => {
        const j = judged ? judged[i] : null;
        if (j && j.reject) { rejected += 1; return; }
        const qid = Number(a.question_id);
        if (seen.has(qid)) return; // repeated inside the payload: first one wins
        seen.add(qid);
        const ok = j && j.verdict && j.verdict.status === 'ok';
        keep.push({
            qid,
            option: ok ? j.verdict.canonical : a.selected_option,
            correct: ok ? j.verdict.isCorrect : a.is_correct,
            time: clampSeconds(a.time_taken),
        });
    });
    rows = keep;

    let inserted = 0;
    if (rows.length > 0) {
        const result = await db.query(
            `INSERT INTO user_question_attempts
                (user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id)
             SELECT $1::int, t.question_id, t.selected_option, t.is_correct, t.time_taken, $2::int
               FROM unnest($3::int[], $4::text[], $5::boolean[], $6::numeric[])
                    AS t(question_id, selected_option, is_correct, time_taken)
              WHERE NOT EXISTS (
                    SELECT 1 FROM user_question_attempts e
                     WHERE e.quiz_session_id = $2::int AND e.question_id = t.question_id)`,
            [userId, Number(sessionId), rows.map((r) => r.qid), rows.map((r) => r.option),
                rows.map((r) => !!r.correct), rows.map((r) => r.time)]
        );
        inserted = result.rowCount ?? 0;
    }
    return {
        status: 201,
        body: { inserted, skipped_existing: rows.length - inserted, rejected, received: attempts.length },
    };
}
