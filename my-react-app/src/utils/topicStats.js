/**
 * Per-specialty accuracy, derived from the rows /topic-analysis returns.
 *
 * Lived inside Analysis.jsx until the allowance-spent screen needed the same
 * "which specialty is costing you marks" answer. Two implementations of a
 * number a student is shown in two places is two chances to disagree, so there
 * is one.
 */

/** Best and worst specialty by accuracy, ignoring anything unanswered. */
export function calculateBestWorstTopics(topicAnalysis) {
    if (!Array.isArray(topicAnalysis) || topicAnalysis.length === 0) return { best: null, worst: null };
    const valid = topicAnalysis.filter((t) => t.total_answered > 0 && t.total_correct !== undefined);
    if (valid.length === 0) return { best: null, worst: null };
    const withAccuracy = valid
        .map((t) => ({ ...t, accuracy: (t.total_correct / t.total_answered) * 100 }))
        .sort((a, b) => b.accuracy - a.accuracy);
    return { best: withAccuracy[0], worst: withAccuracy[withAccuracy.length - 1] };
}

/**
 * Totals across every specialty.
 *
 * Summed from the same rows rather than fetched separately: the student is
 * being shown "you answered N at X%" next to a per-specialty breakdown, and
 * the two have to add up on screen.
 */
export function totalsFromTopics(topicAnalysis) {
    if (!Array.isArray(topicAnalysis)) return { answered: 0, correct: 0, accuracy: 0 };
    const answered = topicAnalysis.reduce((n, t) => n + (Number(t.total_answered) || 0), 0);
    const correct = topicAnalysis.reduce((n, t) => n + (Number(t.total_correct) || 0), 0);
    return { answered, correct, accuracy: answered > 0 ? (correct / answered) * 100 : 0 };
}
