/**
 * Server-side check that an answer belongs to its question.
 *
 * Why this exists: on 3-4 Nov 2026 a web quiz saved answers against questions the
 * student never saw, and the server stored them because it trusted the browser
 * for question_id, selected_option AND is_correct. Here the server looks the
 * question up and decides for itself:
 *   - is the chosen text one of the question's four options?  (else the pair is wrong)
 *   - is it correct according to the CURRENT key?             (is_correct is recomputed)
 *
 * Mode (env ATTEMPT_VALIDATION):
 *   off      - nothing changes (old behaviour)
 *   log      - DEFAULT. Recompute is_correct and store the canonical option text when the
 *              answer matches; a pair that does not match is still stored as sent, but a
 *              warning with code ATTEMPT_NOT_AN_OPTION is logged. Safe for old Android builds.
 *   enforce  - a pair that does not match is refused: 400 {code:'OPTION_NOT_IN_QUESTION'} on
 *              POST /question-attempts, dropped from the batch on /quiz-sessions and
 *              /final-quiz/submit (the session itself is still saved).
 *
 * Matching is exact first, then ignoring case/space (NFKC), so an admin typo fix or a
 * stray space does not lose a student's answer; the stored text is always the question's
 * own option text.
 */

export const VALIDATION_MODES = ['off', 'log', 'enforce'];

export function validationMode(env = process.env) {
    const m = String(env.ATTEMPT_VALIDATION || 'log').trim().toLowerCase();
    return VALIDATION_MODES.includes(m) ? m : 'log';
}

export const normalizeOption = (s) =>
    String(s ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();

const optionsOf = (q) => [q.option1, q.option2, q.option3, q.option4];

/**
 * Judge one answer against one question row ({option1..4, correct_option}) or null.
 * status: 'ok' | 'unanswered' | 'not_an_option' | 'unknown_question'
 */
export function judgeAnswer(question, selected) {
    if (!question) return { status: 'unknown_question', canonical: selected ?? null, isCorrect: false };
    if (selected === undefined || selected === null || String(selected) === '') {
        return { status: 'unanswered', canonical: selected ?? null, isCorrect: false };
    }
    const options = optionsOf(question);
    let at = options.findIndex((o) => o === selected);
    let matchedBy = 'exact';
    if (at === -1) {
        const wanted = normalizeOption(selected);
        at = options.findIndex((o) => normalizeOption(o) === wanted);
        matchedBy = 'normalized';
    }
    if (at === -1) return { status: 'not_an_option', canonical: selected, isCorrect: false };
    const canonical = options[at];
    const keyAt = options.findIndex((o) => o === question.correct_option);
    // Compare by position when the key is one of the options; fall back to text.
    const isCorrect = keyAt !== -1 ? keyAt === at : canonical === question.correct_option;
    return { status: 'ok', canonical, isCorrect, matchedBy };
}

/** Load option columns for a set of question ids: Map(id -> row). */
export async function loadQuestionsById(db, ids) {
    const clean = [...new Set((ids || []).filter((x) => x !== null && x !== '' && x !== undefined).map(Number).filter(Number.isInteger))];
    const map = new Map();
    if (clean.length === 0) return map;
    const { rows } = await db.query(
        `SELECT id, option1, option2, option3, option4, correct_option FROM questions WHERE id = ANY($1::int[])`,
        [clean]
    );
    for (const r of rows) map.set(Number(r.id), r);
    return map;
}

/**
 * Judge a list of attempts. `read(a)` returns {questionId, selected}.
 * Returns an array parallel to `attempts`: { verdict, reject } where reject is true only
 * in enforce mode for an unusable pair.
 */
export async function judgeAttempts(db, attempts, read, mode = validationMode()) {
    if (mode === 'off' || !Array.isArray(attempts) || attempts.length === 0) {
        return (attempts || []).map(() => ({ verdict: null, reject: false }));
    }
    const questions = await loadQuestionsById(db, attempts.map((a) => read(a).questionId));
    return attempts.map((a) => {
        const { questionId, selected } = read(a);
        const verdict = judgeAnswer(questions.get(Number(questionId)), selected);
        const bad = verdict.status === 'not_an_option' || verdict.status === 'unknown_question';
        return { verdict, reject: bad && mode === 'enforce' };
    });
}

/** Counts for logging and for the "this whole quiz looks swapped" alert. */
export function summarizeJudgements(judged) {
    const total = judged.length;
    const bad = judged.filter((j) => j.verdict && (j.verdict.status === 'not_an_option' || j.verdict.status === 'unknown_question')).length;
    return { total, bad, suspectSwap: bad >= 3 && bad >= Math.ceil(total * 0.2) };
}
