/**
 * How the quiz behaves while it is being taken.
 *
 *   study — each answer locks as it is picked, the correct option is marked and
 *           the explanation opens straight away
 *   exam  — silent: no reveal, answers stay changeable, feedback only on the
 *           result screen (the behaviour the app had before explanations)
 *
 * The choice is a working preference rather than a per-quiz decision, so it is
 * remembered in localStorage. Every entry point into /quiz reads it from here —
 * the launcher, which also lets the student change it, and the hub's quick
 * start — so the two can never disagree. The final quiz always passes 'exam'
 * explicitly: a mock exam is never revealed mid-run.
 */

export const QUIZ_MODE_KEY = 'sqb_quiz_mode';

export const STUDY = 'study';
export const EXAM = 'exam';

/** Study is the default: the explanations are the point of the feature. */
export function readQuizMode() {
    try {
        return localStorage.getItem(QUIZ_MODE_KEY) === EXAM ? EXAM : STUDY;
    } catch {
        return STUDY;
    }
}

export function writeQuizMode(mode) {
    try {
        localStorage.setItem(QUIZ_MODE_KEY, mode === EXAM ? EXAM : STUDY);
    } catch { /* private browsing — the choice just won't persist */ }
}
