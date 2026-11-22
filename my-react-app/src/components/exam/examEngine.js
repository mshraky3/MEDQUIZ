/**
 * The exam's state machine, as pure functions over one plain object (so it can
 * be saved to sessionStorage as JSON, restored after a reload, and tested
 * without React). Questions are NOT part of the state; they travel beside it
 * as an array whose index is the question's number minus one.
 *
 * Stages
 *   rules   the rules screen, before the first part
 *   part    a part is running (its absolute deadline is `partDeadline`)
 *   review  the end-of-part review grid (the part clock keeps running)
 *   break   between parts; `breakDeadline` is informational, the student
 *           decides when Part 2 starts (its clock starts then, not before)
 *   done    every part is over; the result is scored from this state
 *
 * A part that runs out of time is ended by `reconcile()` (a hard stop): its
 * unanswered questions stay unanswered and cannot be reopened.
 */
import { deadlineFrom, isExpired, restoreDeadline } from './examClock.js';

export const STATE_VERSION = 1;
export const OPTION_KEYS = ['option1', 'option2', 'option3', 'option4'];
export const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// What the exam is called in final_review_sessions (see backend/services/examService.js).
export const EXAM_SESSION_TYPE = 'exam';

/** Build the first state from POST /api/exam/start. */
export function createExam(payload, now = Date.now()) {
    const exam = payload.exam || {};
    return {
        v: STATE_VERSION,
        mode: payload.mode === 'demo' ? 'demo' : 'full',
        examKey: exam.key,
        confirmed: exam.confirmed !== false,
        practiceLength: !!exam.practiceLength,
        breakMinutes: exam.breakMinutes || 0,
        passMark: exam.passMark || null,
        pilotUnscoredMaxPct: exam.pilotUnscoredMaxPct || 0,
        requested: payload.requested,
        served: payload.served,
        capped: !!payload.capped,
        notes: payload.notes || [],
        byDomain: payload.byDomain || [],
        parts: payload.parts,
        stage: 'rules',
        partIdx: 0,
        partStartedAt: null,
        partDeadline: null,
        breakStartedAt: null,
        breakDeadline: null,
        breakSeconds: 0,
        breakSkipped: false,
        current: 0,
        answers: {},
        flags: {},
        everFlagged: {},
        spent: {},
        results: [],
        startedAt: now,
    };
}

export const activePart = (state) => state.parts[state.partIdx] || null;

/** Start the part in `partIdx` (from the rules screen or the break). */
export function startPart(state, now = Date.now()) {
    const part = activePart(state);
    if (!part || (state.stage !== 'rules' && state.stage !== 'break')) return state;
    const breakSeconds = state.stage === 'break' && state.breakStartedAt
        ? state.breakSeconds + Math.max(0, Math.round((now - state.breakStartedAt) / 1000))
        : state.breakSeconds;
    return {
        ...state,
        stage: 'part',
        partStartedAt: now,
        partDeadline: deadlineFrom(now, part.minutes),
        breakSeconds,
        current: part.from,
    };
}

/** Leave the break early. Same as the student pressing "Start Part 2". */
export function skipBreak(state, now = Date.now()) {
    if (state.stage !== 'break') return state;
    return startPart({ ...state, breakSkipped: !isExpired(state.breakDeadline, now) }, now);
}

const running = (state) => state.stage === 'part' || state.stage === 'review';

export function goTo(state, index) {
    if (!running(state)) return state;
    const part = activePart(state);
    const clamped = Math.min(part.to - 1, Math.max(part.from, index));
    return { ...state, current: clamped, stage: 'part' };
}

export function selectAnswer(state, questions, index, option) {
    if (state.stage !== 'part') return state;
    const part = activePart(state);
    const q = questions[index];
    if (!q || index < part.from || index >= part.to) return state;
    if (!OPTION_KEYS.some((k) => q[k] === option)) return state;
    return { ...state, answers: { ...state.answers, [q.id]: option } };
}

export function toggleFlag(state, questions, index) {
    if (state.stage !== 'part' && state.stage !== 'review') return state;
    const part = activePart(state);
    const q = questions[index];
    if (!q || index < part.from || index >= part.to) return state;
    const flags = { ...state.flags };
    if (flags[q.id]) delete flags[q.id];
    else flags[q.id] = true;
    return { ...state, flags, everFlagged: { ...state.everFlagged, ...(flags[q.id] ? { [q.id]: true } : {}) } };
}

/** Add seconds spent on a question (called when the student leaves it). */
export function addSpent(state, questions, index, seconds) {
    const q = questions[index];
    if (!q || !(seconds > 0)) return state;
    const next = Math.min(3600, (state.spent[q.id] || 0) + Math.round(seconds));
    return { ...state, spent: { ...state.spent, [q.id]: next } };
}

export const openReview = (state) => (state.stage === 'part' ? { ...state, stage: 'review' } : state);
export const closeReview = (state) => (state.stage === 'review' ? { ...state, stage: 'part' } : state);

/**
 * End the running part. `endedBy`: 'user' (Finish Part) or 'timeout' (hard stop).
 * A timed-out part is charged its whole allowance and the break starts at the
 * moment the part ended, even if that moment is in the past (a reload later).
 */
export function finishPart(state, now = Date.now(), endedBy = 'user') {
    if (!running(state)) return state;
    const part = activePart(state);
    const allowed = part.minutes * 60;
    const used = endedBy === 'timeout'
        ? allowed
        : Math.min(allowed, Math.max(0, Math.round((now - state.partStartedAt) / 1000)));
    const results = [...state.results, { index: part.index, endedBy, secondsUsed: used }];
    const base = { ...state, results, partStartedAt: null, partDeadline: null };
    if (state.partIdx >= state.parts.length - 1) return { ...base, stage: 'done' };
    const nextIdx = state.partIdx + 1;
    if (!(state.breakMinutes > 0)) return startPart({ ...base, partIdx: nextIdx, stage: 'break' }, now);
    return {
        ...base,
        partIdx: nextIdx,
        stage: 'break',
        breakStartedAt: now,
        breakDeadline: deadlineFrom(now, state.breakMinutes),
    };
}

/**
 * Bring a state (fresh from storage, or after the tab slept) up to `now`: a
 * running part whose deadline has passed is ended by timeout. Also sanitises
 * deadlines so storage cannot hand out extra time.
 */
export function reconcile(state, now = Date.now()) {
    let s = state;
    if (running(s)) {
        const part = activePart(s);
        const deadline = restoreDeadline(s.partDeadline, now, part.minutes);
        s = deadline === s.partDeadline ? s : { ...s, partDeadline: deadline };
        if (deadline === null || isExpired(deadline, now)) {
            s = finishPart(s, deadline === null ? now : deadline, 'timeout');
        }
    }
    if (s.stage === 'break') {
        const bd = restoreDeadline(s.breakDeadline, now, s.breakMinutes);
        if (bd !== s.breakDeadline) s = { ...s, breakDeadline: bd };
    }
    return s;
}

// ------------------------------------------------------------------- reading

const hasAnswer = (state, q) => Object.prototype.hasOwnProperty.call(state.answers, q.id);

export const isCorrectAnswer = (q, option) =>
    option != null && String(option).trim() === String(q.correct_option).trim();

/** The status of one question for the navigator and the review grid. */
export function questionStatus(state, q) {
    return { answered: hasAnswer(state, q), flagged: !!state.flags[q.id] };
}

/** Counts and the per-question list for one part (0-based part position). */
export function partSummary(state, questions, partPos) {
    const part = state.parts[partPos];
    const items = [];
    let answeredCount = 0;
    let flaggedCount = 0;
    for (let i = part.from; i < part.to; i += 1) {
        const st = questionStatus(state, questions[i]);
        if (st.answered) answeredCount += 1;
        if (st.flagged) flaggedCount += 1;
        items.push({ index: i, number: i - part.from + 1, ...st });
    }
    return {
        items,
        total: part.to - part.from,
        answered: answeredCount,
        flagged: flaggedCount,
        unanswered: part.to - part.from - answeredCount,
    };
}

/** Score everything that was sat. Unanswered counts as wrong; there is no negative marking. */
export function scoreExam(state, questions) {
    const byTopic = new Map();
    const parts = state.parts.map((p) => {
        let correct = 0;
        let answeredCount = 0;
        for (let i = p.from; i < p.to; i += 1) {
            const q = questions[i];
            const ok = isCorrectAnswer(q, state.answers[q.id]);
            if (hasAnswer(state, q)) answeredCount += 1;
            if (ok) correct += 1;
            const t = byTopic.get(q.question_type) || { type: q.question_type, total: 0, correct: 0 };
            t.total += 1;
            if (ok) t.correct += 1;
            byTopic.set(q.question_type, t);
        }
        const total = p.to - p.from;
        const res = state.results.find((r) => r.index === p.index);
        return {
            index: p.index,
            questions: total,
            answered: answeredCount,
            correct,
            percent: total > 0 ? Math.round((correct / total) * 1000) / 10 : 0,
            minutesAllowed: p.minutes,
            secondsUsed: res ? res.secondsUsed : 0,
            endedBy: res ? res.endedBy : null,
        };
    });
    const total = parts.reduce((s, p) => s + p.questions, 0);
    const correct = parts.reduce((s, p) => s + p.correct, 0);
    const answeredTotal = parts.reduce((s, p) => s + p.answered, 0);
    const topics = [...byTopic.values()]
        .map((t) => ({ ...t, percent: Math.round((t.correct / t.total) * 1000) / 10 }))
        .sort((a, b) => a.percent - b.percent || b.total - a.total);
    return {
        total,
        correct,
        answered: answeredTotal,
        unanswered: total - answeredTotal,
        percent: total > 0 ? Math.round((correct / total) * 1000) / 10 : 0,
        parts,
        topics,
        secondsUsed: parts.reduce((s, p) => s + p.secondsUsed, 0),
        secondsAllowed: parts.reduce((s, p) => s + p.minutesAllowed * 60, 0),
    };
}

/** The part-score block stored in session_metadata.exam (both save routes). */
export function examMetadata(state, score) {
    return {
        v: STATE_VERSION,
        key: state.examKey,
        mode: state.mode,
        confirmed: state.confirmed,
        practiceLength: state.practiceLength,
        requested: state.requested,
        served: state.served,
        capped: state.capped,
        parts: score.parts.map((p) => ({
            index: p.index,
            questions: p.questions,
            answered: p.answered,
            correct: p.correct,
            percent: p.percent,
            minutesAllowed: p.minutesAllowed,
            seconds: p.secondsUsed,
            endedBy: p.endedBy,
        })),
        flagsUsed: Object.keys(state.everFlagged).length,
        breakSeconds: state.breakSeconds,
        breakSkipped: state.breakSkipped,
        notes: state.notes.map((n) => n.code + (n.domain ? `:${n.domain}` : '')),
    };
}

/** The body for POST /final-quiz/submit (paid) or /api/exam/demo/submit (free). */
export function buildSubmission(state, questions, score, { userId } = {}) {
    const attempts = questions.map((q) => {
        const given = state.answers[q.id];
        return {
            questionId: q.id,
            userAnswer: given == null ? '' : given,
            correctAnswer: q.correct_option,
            isCorrect: isCorrectAnswer(q, given),
            timeTaken: Math.min(3600, Math.round(state.spent[q.id] || 0)),
        };
    });
    const meta = examMetadata(state, score);
    if (state.mode === 'demo') {
        return {
            questionAttempts: attempts.map(({ questionId, userAnswer, timeTaken }) => ({ questionId, userAnswer, timeTaken })),
            timeTaken: score.secondsUsed,
            timeLimit: score.secondsAllowed,
            flagsUsed: meta.flagsUsed,
            sessionMetadata: { confirmed: state.confirmed },
        };
    }
    return {
        userId,
        questionType: EXAM_SESSION_TYPE,
        source: state.examKey,
        totalQuestions: score.total,
        correctAnswers: score.correct,
        timeTaken: score.secondsUsed,
        timeLimit: score.secondsAllowed,
        questionIds: questions.map((q) => q.id),
        questionAttempts: attempts,
        sessionMetadata: { device: 'web', timestamp: new Date().toISOString(), exam: meta },
    };
}
