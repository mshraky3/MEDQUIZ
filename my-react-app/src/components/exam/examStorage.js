/**
 * An exam in progress survives a reload. Two sessionStorage slots per account
 * (sessionStorage, like the practice quiz: it dies with the tab, which is the
 * right lifetime for an exam sitting):
 *   questions  written once when the exam starts (about 100 KB for 200 questions)
 *   state      the small state object, rewritten on every change
 * Keyed by the account id so a shared device never shows someone else's exam.
 */
import { safeGetSessionItem, safeSetSessionItem, safeRemoveSessionItem } from '../../utils/safeStorage.js';
import { STATE_VERSION } from './examEngine.js';

const stateKey = (accountId) => `sqb_exam_state_${accountId || 'anon'}`;
const questionsKey = (accountId) => `sqb_exam_questions_${accountId || 'anon'}`;

const defaultStore = {
    get: safeGetSessionItem,
    set: safeSetSessionItem,
    remove: safeRemoveSessionItem,
};

export function saveExam(accountId, state, questions, store = defaultStore) {
    if (questions) store.set(questionsKey(accountId), JSON.stringify(questions));
    return store.set(stateKey(accountId), JSON.stringify(state));
}

export function saveExamState(accountId, state, store = defaultStore) {
    return store.set(stateKey(accountId), JSON.stringify(state));
}

/** { state, questions } or null. Anything malformed, from another version, or inconsistent is dropped. */
export function loadExam(accountId, store = defaultStore) {
    try {
        const rawState = store.get(stateKey(accountId));
        const rawQuestions = store.get(questionsKey(accountId));
        if (!rawState || !rawQuestions) return null;
        const state = JSON.parse(rawState);
        const questions = JSON.parse(rawQuestions);
        if (!state || state.v !== STATE_VERSION || !Array.isArray(state.parts) || !Array.isArray(questions)) return null;
        const served = state.parts.length ? state.parts[state.parts.length - 1].to : 0;
        if (questions.length !== served || questions.length === 0) return null;
        if (!questions.every((q) => q && Number.isInteger(q.id))) return null;
        return { state, questions };
    } catch {
        return null;
    }
}

export function clearExam(accountId, store = defaultStore) {
    store.remove(stateKey(accountId));
    store.remove(questionsKey(accountId));
}
