import React from 'react';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import './HubCards.css';

/**
 * The streak, as something you can act on.
 *
 * It replaced a bare KPI tile that showed "5" and nothing else — which is the
 * one number a streak counter must never show alone, because it answers
 * "how long have I kept this up" while hiding the only question that changes
 * behaviour: *is today already done, or about to break it?*
 *
 * So this card leads with that answer, then shows the last seven days as a
 * strip. Everything is derived from `active_days` (the raw study calendar the
 * /user-streaks endpoint now returns) rather than re-deriving dates from the
 * count, so a gap is visible instead of implied.
 */

// Where the next badge sits. Deliberately sparse at the top — "23 days to your
// next milestone" is not motivating, so past 30 the rungs widen.
const MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

/** Local YYYY-MM-DD. Must match the server's formatting, which is also local. */
const ymd = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const StreakCard = ({ streak, onStartToday }) => {
    const t = useCopy(quizCopy).hub;
    const { lang } = useLang();
    const s = t.streak;
    const fmt = (n) => formatNumber(n, lang);

    const current = Number(streak?.current_streak) || 0;
    const longest = Number(streak?.longest_streak) || 0;
    const activeDays = React.useMemo(
        () => new Set(Array.isArray(streak?.active_days) ? streak.active_days : []),
        [streak]
    );

    // The last seven calendar days, oldest first, so the strip reads left-to
    // -right as time passing (and right-to-left in Arabic, which is the same
    // statement — the flex container flips with `dir`).
    const week = React.useMemo(() => {
        const out = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today.getTime() - i * 86400000);
            out.push({ key: ymd(d), dow: d.getDay(), done: activeDays.has(ymd(d)), isToday: i === 0 });
        }
        return out;
    }, [activeDays]);

    const studiedToday = streak?.studied_today ?? week[6]?.done ?? false;
    const weekCount = week.filter((d) => d.done).length;
    const nextMilestone = MILESTONES.find((m) => m > current) || null;
    const hitMilestone = MILESTONES.includes(current) && current > 0;
    const isBest = current > 0 && current >= longest;

    // ── No streak yet ─────────────────────────────────────────────────────
    if (current === 0) {
        return (
            <section className="hubcard hubcard--streak is-empty" aria-label={s.title}>
                <span className="hubcard-empty-icon hubcard-empty-icon--flame" aria-hidden="true">
                    <Icon name="flame" size={22} />
                </span>
                <div className="hubcard-empty-body">
                    <h3>{s.none}</h3>
                    <p>{s.noneBody}</p>
                </div>
                <button type="button" className="goalx-btn goalx-btn--primary" onClick={onStartToday}>
                    {s.startToday}
                </button>
            </section>
        );
    }

    return (
        <section
            className={`hubcard hubcard--streak${studiedToday ? ' is-safe' : ' is-at-risk'}`}
            aria-label={s.title}
        >
            <div className="hubcard-head">
                <h3><Icon name="flame" size={16} /> {s.title}</h3>
                {longest > 0 && (
                    <span className="hubcard-best">
                        {s.best} <bdi>{fmt(longest)}</bdi>
                    </span>
                )}
            </div>

            <div className="hubcard-count" role="img" aria-label={s.aria(current)}>
                <span className="hubcard-count-n hubcard-count-n--flame"><bdi>{fmt(current)}</bdi></span>
                <span className="hubcard-count-unit">{s.unit(current)}</span>
            </div>

            {/* The week strip: seven dots, one per day, today last. */}
            <ul className="streak-week" aria-label={s.weekLabel}>
                {week.map((d) => (
                    <li
                        key={d.key}
                        className={`streak-day${d.done ? ' is-done' : ''}${d.isToday ? ' is-today' : ''}`}
                        title={d.key}
                    >
                        <span className="streak-day-dot" aria-hidden="true">
                            {d.done && <Icon name="check" size={11} />}
                        </span>
                        <span className="streak-day-label">{s.dayNames[d.dow]}</span>
                    </li>
                ))}
            </ul>

            <p className="streak-status">
                {studiedToday
                    ? <span className="streak-status--safe">{s.safeToday}</span>
                    : (
                        <>
                            <span className="streak-status--risk">{s.atRisk}</span>
                            <button type="button" className="goalx-link streak-cta" onClick={onStartToday}>
                                {s.startToday}
                            </button>
                        </>
                    )}
            </p>

            <p className="hubcard-note">
                {hitMilestone
                    ? s.milestoneHit(current)
                    : isBest
                        ? s.bestNow
                        : nextMilestone
                            ? s.nextMilestone(nextMilestone - current)
                            : s.thisWeekCount(fmt(weekCount))}
            </p>
        </section>
    );
};

export default StreakCard;
