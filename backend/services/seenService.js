/**
 * Mark questions as "seen" the moment they are ANSWERED, not only when the
 * whole quiz is submitted (POST /quiz-sessions). Without this, a student who
 * answers some questions and leaves (closed tab, killed app, no network) is
 * served the same questions again, because the only writer of
 * user_question_progress was the final submit.
 *
 * Same insert the submit uses (ON CONFLICT DO NOTHING), so it is idempotent and
 * the later submit stays harmless. It touches NO counter on `accounts`:
 * free_questions_used moves only on submit, free_questions_served only when
 * questions are fetched.
 */

export const MAX_SEEN_IDS = 20;

/** Positive integers only, deduplicated; anything else is dropped. */
export function cleanQuestionIds(raw) {
    if (!Array.isArray(raw)) return [];
    const out = new Set();
    for (const v of raw) {
        const n = typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v;
        if (Number.isSafeInteger(n) && n > 0 && n <= 2147483647) out.add(n);
    }
    return [...out];
}

/**
 * @param db     anything with query(text, values) (pg Pool, PGlite)
 * @param userId account id taken from the validated session, never the body
 * @param track  the account's track; ids from other tracks are ignored
 * @returns number of ids that were valid for the track (rows may already exist)
 */
export async function markQuestionsSeen(db, { userId, track, questionIds }) {
    const ids = cleanQuestionIds(questionIds);
    if (!userId || ids.length === 0) return 0;
    const found = await db.query(
        'SELECT id, question_type, source FROM questions WHERE id = ANY($1::int[]) AND track = $2',
        [ids, track]
    );
    for (const q of found.rows) {
        await db.query(
            `INSERT INTO user_question_progress (user_id, question_id, question_type, source)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, question_id) DO NOTHING`,
            [userId, q.id, q.question_type, q.source || 'general']
        );
    }
    return found.rows.length;
}
