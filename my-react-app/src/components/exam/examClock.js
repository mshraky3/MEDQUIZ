/**
 * The exam clock, as plain functions.
 *
 * One ABSOLUTE deadline (epoch milliseconds) per part and one for the break. A
 * ticking counter would stop when the tab sleeps or the page reloads; a
 * deadline cannot, so the remaining time is always `deadline - now`, however
 * the page got here. The hook (useExamClock.js) only decides when to re-read it.
 */

export const MS_PER_MINUTE = 60 * 1000;

/** The deadline of something that starts at `startMs` and may run `minutes`. */
export function deadlineFrom(startMs, minutes) {
    return startMs + Math.round(minutes * MS_PER_MINUTE);
}

/** Whole seconds left, never negative. Rounded UP so 0:00 means the deadline has really passed. */
export function secondsLeft(deadline, now) {
    if (!Number.isFinite(deadline)) return 0;
    return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export function isExpired(deadline, now) {
    return Number.isFinite(deadline) && now >= deadline;
}

/**
 * Read a deadline back from storage. A deadline that is not a number is dropped;
 * one further away than the longest legal wait (plus a little slack for a clock
 * that moved) is pulled in, so a tampered or corrupted value cannot buy extra time.
 */
export function restoreDeadline(saved, now, maxMinutes) {
    if (!Number.isFinite(saved)) return null;
    const latest = now + Math.round(maxMinutes * MS_PER_MINUTE) + 5000;
    return Math.min(saved, latest);
}

/** H:MM:SS from an hour up, M:SS below it (digits are tabular in the UI). */
export function formatClock(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const two = (n) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${two(m)}:${two(sec)}` : `${m}:${two(sec)}`;
}

/** How worried the clock should look: calm, last quarter-hour-ish, last five minutes. */
export function clockTone(secondsRemaining, totalSeconds) {
    if (secondsRemaining <= 300) return 'danger';
    if (totalSeconds > 0 && secondsRemaining <= Math.min(900, totalSeconds * 0.15)) return 'warn';
    return 'ok';
}
