/**
 * Add whole months to a date, clamping to the last day of the target month.
 *
 * `Date#setMonth` overflows: 31 Oct + 1 month becomes 1 Dec (31 Nov does not
 * exist), so a month-end purchase silently got a day too much, or too little
 * for the month-count tests. This keeps the day-of-month when the target month
 * has it and otherwise lands on the target month's last day (31 Oct + 1 month =
 * 30 Nov, 31 Jan + 1 month = 28/29 Feb). Time of day is kept. Local-time
 * getters, exactly like the setMonth code it replaces.
 *
 * Returns a NEW Date; the argument is not changed.
 */
export function addMonthsClamped(date, months) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return d;
    const day = d.getDate();
    d.setDate(1); // park on day 1 so the month change cannot overflow
    d.setMonth(d.getMonth() + months);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
    return d;
}
