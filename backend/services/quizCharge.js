/**
 * Spend the free allowance when a quiz is submitted (POST /quiz-sessions).
 *
 * Billed on the questions in the submission, which after "Finish now and see my
 * result" are the ANSWERED ones only. A paid, admin-created or grandfathered
 * account is never debited: the WHERE clause re-checks that on the server.
 *
 * `alreadyRecorded` is true when the client re-sent a quiz that was already
 * saved. The first request spent the questions, so a second spend would charge
 * the student twice for one quiz.
 *
 * @param db anything with query(text, values) (pg Pool, PGlite)
 * @returns {Promise<number>} how many questions were billed (0 when skipped)
 */
export async function spendFreeAllowance(db, { userId, questionIds, totalQuestions, legacyAllowance, alreadyRecorded = false }) {
    if (alreadyRecorded) return 0;
    const billable = Array.isArray(questionIds) && questionIds.length > 0
        ? questionIds.length
        : Number(totalQuestions) || 0;
    if (billable <= 0) return 0;
    await db.query(
        `UPDATE accounts
            SET free_questions_used = LEAST(COALESCE(free_allowance, $3::int), free_questions_used + $1::int)
          WHERE id = $2
            AND is_admin_created = FALSE
            AND grandfathered_at IS NULL
            AND NOT (subscription_status = 'active'
                     AND subscription_expiry_date > NOW())`,
        [billable, userId, legacyAllowance]
    );
    return billable;
}
