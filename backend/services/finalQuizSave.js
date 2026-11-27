/**
 * Retry-safe save for POST /final-quiz/submit: the history row and its answers are
 * written in ONE transaction, and a retried submission lands on the row it already
 * made. However many times a client sends the same exam, the student ends with one
 * history row and one set of answers.
 *
 * No schema change: with no unique key to lean on, a per-user advisory lock makes
 * two tries of one submission take turns. Without it, a retry that arrives while
 * the first try is still saving cannot see the uncommitted row and writes a second.
 */
import { insertFinalQuizAttempts } from './finalQuizAttempts.js';

/** First key of pg_advisory_xact_lock(int, int); the second is the user id. */
const LOCK_NAMESPACE = 760001;

/**
 * Clients try 3 times and one try can last the whole 60 s function limit, so the
 * last one can arrive more than 2 minutes after the first one saved.
 */
export const RETRY_WINDOW_MINUTES = 10;

/**
 * The row an earlier try of this submission made. A retry repeats the body, so it is
 * matched on what the server stores as sent: question list, duration and
 * session_metadata (which carries the client's own timestamp). NOT on the totals
 * or the score: sessionSummary.js rewrites those from the answers.
 */
const FIND_SAVED_SQL = `
    SELECT id, session_id FROM final_review_sessions
     WHERE user_id = $1 AND question_type = $2 AND source = $3
       AND time_taken IS NOT DISTINCT FROM $4
       AND question_ids IS NOT DISTINCT FROM $5::int[]
       AND session_metadata IS NOT DISTINCT FROM $6::jsonb
       AND start_time > NOW() - INTERVAL '${RETRY_WINDOW_MINUTES} minutes'
     ORDER BY id DESC LIMIT 1`;

const INSERT_SESSION_SQL = `
    INSERT INTO final_review_sessions (
        user_id,
        question_type,
        source,
        total_questions,
        correct_answers,
        score,
        time_taken,
        time_limit,
        end_time,
        session_metadata,
        question_ids
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9, $10)
    RETURNING id, session_id`;

/**
 * @param {{connect: Function}} pool  pg Pool
 * @param {object} exam      {userId, questionType, source, totalQuestions, correctAnswers,
 *                            score, timeTaken, timeLimit, sessionMetadata, questionIds}
 * @param {Array}  attempts  the answers to store (already validated by the caller)
 * @param {boolean} isRetry  only a declared retry is matched to an earlier save
 * @returns {Promise<{id: number, sessionUuid: string, reused: boolean}>}
 */
export async function saveFinalQuiz(pool, exam, attempts = [], { isRetry = false } = {}) {
    const metadata = JSON.stringify(exam.sessionMetadata || {});
    const client = await pool.connect();
    let broken;
    try {
        await client.query('BEGIN');
        await client.query('SELECT pg_advisory_xact_lock($1::int, $2::int)', [LOCK_NAMESPACE, exam.userId]);

        let row = null;
        if (isRetry) {
            const found = await client.query(FIND_SAVED_SQL, [
                exam.userId, exam.questionType, exam.source, exam.timeTaken, exam.questionIds, metadata,
            ]);
            row = found.rows[0] || null;
        }
        const reused = row !== null;

        let answersNeeded = attempts?.length > 0;
        if (reused && answersNeeded) {
            const { rows } = await client.query(
                'SELECT COUNT(*)::int AS n FROM final_quiz_attempts WHERE session_id = $1',
                [row.id]
            );
            answersNeeded = rows[0].n < attempts.length;
            // A save from before this transaction existed can have stopped after
            // the row (no answers) or after its first 1,000: write the whole set.
            if (answersNeeded && rows[0].n > 0) {
                await client.query('DELETE FROM final_quiz_attempts WHERE session_id = $1', [row.id]);
            }
        }

        if (!row) {
            const inserted = await client.query(INSERT_SESSION_SQL, [
                exam.userId, exam.questionType, exam.source, exam.totalQuestions, exam.correctAnswers,
                exam.score, exam.timeTaken, exam.timeLimit, metadata, exam.questionIds,
            ]);
            row = inserted.rows[0];
        }

        if (answersNeeded) await insertFinalQuizAttempts(client, row.id, attempts);

        await client.query('COMMIT');
        return { id: row.id, sessionUuid: row.session_id, reused };
    } catch (err) {
        // A connection that cannot even roll back is dropped, not returned to the pool.
        await client.query('ROLLBACK').catch((rollbackError) => { broken = rollbackError; });
        throw err;
    } finally {
        client.release(broken);
    }
}
