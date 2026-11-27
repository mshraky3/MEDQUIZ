/**
 * Real SCFHS testing-period dates, per track. Only verified dates belong
 * here — the landing countdown (see
 * components/landing/ExamCountdown.jsx) renders nothing rather than fall back
 * to a fake or rolling deadline, because an invented countdown on a paid exam
 * product is the kind of urgency device this project explicitly rejected.
 *
 * Format: ISO date (YYYY-MM-DD), the first day of the sitting window, in
 * Riyadh local time. Add entries as real windows are announced; past dates
 * are ignored automatically.
 *
 * Source: https://scfhs.org.sa/en/Mumares/SPLE/DATES, last updated there on
 * 26 Nov 2026, read 27 Nov 2026. It publishes one table for the professional
 * licensure exams, so the tracks share it. Dates can change: re-check weekly,
 * and update the /exams/dates copy at the same time.
 */
import { MEDICAL, NURSING, DENTAL } from '../utils/tracks.js';

const PERIOD_STARTS = [
    '2026-12-01', '2027-01-03', '2027-02-01', '2027-03-17', '2027-04-18',
    '2027-05-24', '2027-06-27', '2027-08-11', '2027-09-05', '2027-10-03',
];

export const EXAM_DATES = {
    [MEDICAL]: PERIOD_STARTS,
    [NURSING]: PERIOD_STARTS,
    [DENTAL]: PERIOD_STARTS,
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
