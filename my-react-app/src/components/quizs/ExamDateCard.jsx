import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import './HubCards.css';

/**
 * The student's own exam countdown.
 *
 * The landing page has a countdown too, but that one is about the published
 * sitting calendar — a marketing fact. This is the date THIS student is
 * sitting, typed in by them, and it is the anchor for the staged reminder
 * emails (services/lifecycleJobs.js → runExamReminderJob).
 *
 * Two deliberate choices:
 *  - `daysRemaining` comes from the server, not from subtracting Dates in the
 *    browser. A student in Cairo and the cron job in UTC must agree on what
 *    "7 days out" means, or the email and the card contradict each other.
 *  - A passed date is not silently cleared. Someone who sat and is resitting
 *    should be *asked*, because deleting the date would also silently switch
 *    off their reminders.
 */

// Roughly how many questions a day the remaining time allows, given a rule of
// thumb of ~40 questions per solid study hour. Shown only when a goal-sized
// number would actually be actionable (see PACE_MIN_DAYS).
const PACE_MIN_DAYS = 2;
const PACE_MAX_DAYS = 120;

const ExamDateCard = ({ username, sessionToken, questionsRemaining }) => {
    const t = useCopy(quizCopy).hub;
    const { lang } = useLang();
    const e = t.exam;

    const [exam, setExam] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [draft, setDraft] = useState('');

    const auth = useCallback(() => ({
        params: { username },
        headers: { Authorization: `Bearer ${sessionToken}` },
    }), [username, sessionToken]);

    useEffect(() => {
        if (!username || !sessionToken) return;
        let cancelled = false;
        axios.get(`${Globals.URL}/api/exam-date`, auth())
            .then(({ data }) => { if (!cancelled && data?.success) setExam(data.exam); })
            .catch(() => { /* the card simply stays in its empty state */ });
        return () => { cancelled = true; };
    }, [username, sessionToken, auth]);

    const save = async () => {
        setSaving(true);
        setError('');
        try {
            const { data } = await axios.put(`${Globals.URL}/api/exam-date`, {
                username,
                date: draft,
            }, { headers: { Authorization: `Bearer ${sessionToken}` } });
            if (!data?.success) throw new Error(data?.message || 'failed');
            setExam(data.exam);
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || e.saveError);
        } finally {
            setSaving(false);
        }
    };

    const clear = async () => {
        try {
            await axios.delete(`${Globals.URL}/api/exam-date`, {
                data: { username },
                headers: { Authorization: `Bearer ${sessionToken}` },
            });
            setExam(null);
        } catch (_) { /* leave the card as-is; nothing was lost */ }
    };

    const startEditing = () => {
        setDraft(exam?.date || '');
        setError('');
        setEditing(true);
    };

    // `min` on the date input stops the obvious mistake before the round-trip.
    const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
    const fmt = (n) => formatNumber(n, lang);

    // ── Editor ────────────────────────────────────────────────────────────
    if (editing) {
        return (
            <section className="hubcard hubcard--exam" aria-label={e.title}>
                <div className="hubcard-head">
                    <h3><Icon name="calendar" size={16} /> {e.title}</h3>
                </div>
                <label className="goalx-label" htmlFor="examdate-input">{e.dateLabel}</label>
                <input
                    id="examdate-input"
                    className="hubcard-date"
                    type="date"
                    value={draft}
                    min={todayISO}
                    onChange={(ev) => setDraft(ev.target.value)}
                />
                {error && <p className="goalx-error">{error}</p>}
                <div className="goalx-actions">
                    <button type="button" className="goalx-btn goalx-btn--primary" onClick={save} disabled={saving || !draft}>
                        {e.saveCta}
                    </button>
                    <button type="button" className="goalx-btn" onClick={() => setEditing(false)} disabled={saving}>
                        {e.cancelCta}
                    </button>
                </div>
                <p className="hubcard-note">{e.remindersOn}</p>
            </section>
        );
    }

    // ── Empty state ───────────────────────────────────────────────────────
    if (!exam) {
        return (
            <section className="hubcard hubcard--exam is-empty" aria-label={e.title}>
                <span className="hubcard-empty-icon" aria-hidden="true"><Icon name="calendar" size={22} /></span>
                <div className="hubcard-empty-body">
                    <h3>{e.noneTitle}</h3>
                    <p>{e.noneBody}</p>
                </div>
                <button type="button" className="goalx-btn goalx-btn--primary" onClick={startEditing}>
                    {e.setCta}
                </button>
            </section>
        );
    }

    const days = exam.daysRemaining;

    // ── Passed ────────────────────────────────────────────────────────────
    if (exam.passed) {
        return (
            <section className="hubcard hubcard--exam is-passed" aria-label={e.title}>
                <div className="hubcard-head">
                    <h3><Icon name="calendar" size={16} /> {e.title}</h3>
                    <div className="goalx-head-actions">
                        <button type="button" className="goalx-link" onClick={startEditing}>{e.changeCta}</button>
                        <button type="button" className="goalx-link goalx-link--muted" onClick={clear}>{e.clearCta}</button>
                    </div>
                </div>
                <p className="hubcard-note">{e.passed}</p>
            </section>
        );
    }

    // Urgency is earned by the real number, never invented: the card only
    // changes colour once the date genuinely is close.
    const tone = days <= 3 ? ' is-urgent' : days <= 14 ? ' is-soon' : '';
    const weeks = Math.round(days / 7);
    const pace = (questionsRemaining > 0 && days >= PACE_MIN_DAYS && days <= PACE_MAX_DAYS)
        ? Math.ceil(questionsRemaining / days)
        : null;

    return (
        <section className={`hubcard hubcard--exam${tone}`} aria-label={e.title}>
            <div className="hubcard-head">
                <h3><Icon name="calendar" size={16} /> {e.title}</h3>
                <div className="goalx-head-actions">
                    <button type="button" className="goalx-link" onClick={startEditing}>{e.changeCta}</button>
                    <button type="button" className="goalx-link goalx-link--muted" onClick={clear}>{e.clearCta}</button>
                </div>
            </div>

            {days === 0 ? (
                <p className="hubcard-headline">{e.today}</p>
            ) : days === 1 ? (
                <p className="hubcard-headline">{e.tomorrow}</p>
            ) : (
                <div className="hubcard-count">
                    <span className="hubcard-count-n"><bdi>{fmt(days)}</bdi></span>
                    <span className="hubcard-count-unit">{e.daysLeft}</span>
                </div>
            )}

            <p className="hubcard-sub">
                <bdi>{exam.date}</bdi>
                {days >= 14 && <span className="hubcard-dot"> · {e.weeksLeft(weeks)}</span>}
            </p>

            {pace != null && <p className="hubcard-pace">{e.perDay(fmt(pace))}</p>}
        </section>
    );
};

export default ExamDateCard;
