/**
 * Final-exam submission helpers (POST /final-quiz/submit).
 *
 * Two things used to break a large final exam (about 500+ questions):
 *   1. Express's default JSON body limit is 100 KB. A 1,200-question exam sends
 *      more than 110 KB, so the request was refused with 413 before the route ran,
 *      and the browser does not retry a 4xx. The whole exam was lost silently.
 *   2. The route inserted one row per question in a loop: 1,200 round trips to
 *      the database inside one 60 s function call.
 */

/**
 * JSON body cap for POST /final-quiz/submit ONLY. Every other route keeps
 * Express's default (100 KB).
 *
 * Why 2 MB: one question costs about 95 bytes of JSON (measured: 1,200 = 112 KB,
 * 13,000 = 1.2 MB), so 2 MB holds the whole bank (13,036 questions on 2026-10-09)
 * with margin even if an entry grows to 150 bytes. It also stays under Vercel's own
 * hard limit of 4.5 MB per request, which no setting here can raise.
 */
export const FINAL_QUIZ_JSON_LIMIT = '2mb';

/** Postgres allows 65,535 bind parameters per statement; 6 per row x 1,000 rows = 6,000. */
export const ATTEMPT_CHUNK_SIZE = 1000;

/**
 * Insert all attempts for one session with multi-row INSERTs (one query per
 * 1,000 rows, so 1,200 answers = 2 queries instead of 1,200). Same columns and
 * same defaults as the old per-row insert (`timeTaken || 0`).
 *
 * @param {{query: Function}} db  pg Pool or Client
 * @param {number} sessionId      final_review_sessions.id (numeric)
 * @param {Array} attempts        [{questionId,userAnswer,correctAnswer,isCorrect,timeTaken}]
 * @returns {Promise<number>}     rows inserted
 */
export async function insertFinalQuizAttempts(db, sessionId, attempts, chunkSize = ATTEMPT_CHUNK_SIZE) {
    if (attempts == null) return 0;
    if (!Array.isArray(attempts)) throw new TypeError('questionAttempts must be an array');
    if (attempts.length === 0) return 0;
    let inserted = 0;
    for (let start = 0; start < attempts.length; start += chunkSize) {
        const chunk = attempts.slice(start, start + chunkSize);
        const params = [];
        const tuples = chunk.map((attempt, i) => {
            const base = i * 6;
            params.push(
                sessionId,
                attempt.questionId,
                attempt.userAnswer,
                attempt.correctAnswer,
                attempt.isCorrect,
                attempt.timeTaken || 0
            );
            return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
        });
        await db.query(
            `INSERT INTO final_quiz_attempts (
                session_id, question_id, user_answer, correct_answer, is_correct, time_taken
            ) VALUES ${tuples.join(', ')}`,
            params
        );
        inserted += chunk.length;
    }
    return inserted;
}

/**
 * Express middleware: parse JSON with the default limit everywhere except the
 * paths in `perPathLimits`. Mount it where `app.use(express.json())` was.
 * `express` is passed in so this file stays import-light and testable.
 */
export function jsonBodyParser(express, perPathLimits = {}) {
    const standard = express.json();
    const special = new Map(Object.entries(perPathLimits).map(
        ([path, limit]) => [path, express.json({ limit })]
    ));
    return (req, res, next) => (special.get(req.path) || standard)(req, res, next);
}
