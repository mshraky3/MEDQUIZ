/**
 * Real Prometric sitting-window dates, per track. Deliberately empty until
 * someone fills in verified dates — the landing countdown (see
 * components/landing/ExamCountdown.jsx) renders nothing rather than fall back
 * to a fake or rolling deadline, because an invented countdown on a paid exam
 * product is the kind of urgency device this project explicitly rejected.
 *
 * Format: ISO date (YYYY-MM-DD), the first day of the sitting window, in
 * Riyadh local time. Add entries as real windows are announced; past dates
 * are ignored automatically.
 *
 * Example once real dates are known:
 *   MEDICAL: ['2026-09-15', '2026-12-01'],
 *   NURSING: ['2026-09-20'],
 */
import { MEDICAL, NURSING } from '../utils/tracks.js';

export const EXAM_DATES = {
    [MEDICAL]: [],
    [NURSING]: [],
};

/** The next future date for a track, or null if none is known. */
export function nextExamDate(track) {
    const dates = EXAM_DATES[track] || [];
    const now = Date.now();
    const future = dates
        .map((d) => new Date(`${d}T00:00:00+03:00`))
        .filter((d) => d.getTime() > now)
        .sort((a, b) => a - b);
    return future[0] || null;
}

/** The next future date across every track — what the (track-agnostic) landing hero shows. */
export function nextExamDateAny() {
    const all = Object.keys(EXAM_DATES).map((track) => nextExamDate(track)).filter(Boolean);
    all.sort((a, b) => a - b);
    return all[0] || null;
}
