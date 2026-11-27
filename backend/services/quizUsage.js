/**
 * Which questions a submitted quiz uses up (POST /quiz-sessions): the ones that
 * are marked as seen and charged to the free allowance.
 *
 * A timed quiz that runs out is submitted whole, so the score counts every
 * question. The web client also sends `answered_question_ids`, and an unanswered
 * question is then neither marked as seen nor charged (owner, 27 Nov 2026).
 *
 * A client that does not send the list (the Android app, a tab opened before the
 * change) is treated as before: every submitted question, or total_questions
 * when there is no id list. An EMPTY answered list is not "no list": nothing
 * was answered, so nothing is charged.
 *
 * Trusting the list opens nothing new: the client already chooses question_ids,
 * and free serving stays bounded by free_questions_served (checkQuizAccess).
 *
 * @returns {{questionIds: Array, billable: number}}
 */
export function quizUsage({ questionIds, answeredQuestionIds, totalQuestions }) {
    const all = Array.isArray(questionIds) ? questionIds : [];
    if (all.length === 0 || !Array.isArray(answeredQuestionIds)) {
        return { questionIds: all, billable: all.length || Number(totalQuestions) || 0 };
    }
    const answered = new Set(answeredQuestionIds.map(Number));
    const used = [...new Set(all.map(Number))].filter((id) => answered.has(id));
    return { questionIds: used, billable: used.length };
}
