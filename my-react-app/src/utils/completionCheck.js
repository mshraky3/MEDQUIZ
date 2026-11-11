// Optimization program, change C1 (client half).
//
// The launcher asks the server "has this student finished <specialty> in <source>?"
// (GET /api/check-completion) once per specialty. With no collection picked it sends
// the whole-bank sentinel below, the retired single-bank label. No question carries
// that label any more, so the server can only answer total 0 / isCompleted false and
// the answer never shows the congratulations popup. Skipping those calls removes
// 4 to 13 requests (one per specialty, sequential) on every launcher visit.
//
// Keep this value equal to WHOLE_BANK in components/quizs/QuizLauncher.jsx and to
// UNIFIED_BANK in backend/config/sources.js. If the server ever gives the sentinel a
// real meaning again, drop this guard first.
export const WHOLE_BANK_SOURCE = 'MidgardGameBoy';

/** False for the whole-bank sentinel (the answer is always "not completed"), true for a real collection. */
export function shouldCheckCompletion(source) {
    return source !== WHOLE_BANK_SOURCE;
}
