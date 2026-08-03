import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import quizCopy from '../../i18n/copy/quiz.js';
import { getTypeLabel } from '../../utils/typeLabels';
import { getSourceLabel } from '../../utils/sourceLabels';
import './GoalCard.css';

/**
 * The student's own commitment, and how far along it is.
 *
 * Two things make this work rather than being another dashboard tile:
 *  - The number is theirs. The card asks for a target instead of assigning
 *    one, because a goal you picked is a goal you defend.
 *  - Progress is computed server-side from the same function that feeds the
 *    weekly digest email, so the ring here and the bar in the inbox can never
 *    disagree.
 *
 * Alongside it sits the week-on-week comparison: "8% more accurate than last
 * week" is a reason to come back in a way that a lifetime total never is.
 *
 * A goal can also be SCOPED — to one specialty, to one collection, or both —
 * so "200 questions" can become "200 paediatrics questions". Scope is offered
 * only where the data can answer it honestly: a single quiz can mix
 * specialties, so a quizzes goal has no scope controls at all (and the server
 * drops any that are sent). The collection picker only appears for tracks that
 * genuinely have more than one collection, which today means nursing.
 */

const TYPE_PRESETS = {
    questions: [50, 100, 200, 300],
    quizzes: [5, 10, 20, 30],
    accuracy: [60, 70, 80, 90],
};

// 2πr for r=34, the goal ring's radius — the dash length that makes
// strokeDashoffset behave as a 0-100% fill.
const RING_CIRCUMFERENCE = 2 * Math.PI * 34;

const GoalCard = ({ username, sessionToken, specialties = [], sources = [] }) => {
    const t = useCopy(quizCopy).hub;
    const { lang } = useLang();
    const g = t.goal;
    const p = t.progress;

    const [goal, setGoal] = useState(null);
    const [progress, setProgress] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        goalType: 'questions',
        period: 'weekly',
        target: 100,
        // null = the whole bank. Sent as null, stored as NULL, rendered as no
        // chip at all — "all specialties" is the absence of a filter.
        questionType: null,
        source: null,
    });

    const auth = useCallback(() => ({
        params: { username },
        headers: { Authorization: `Bearer ${sessionToken}` },
    }), [username, sessionToken]);

    const load = useCallback(async () => {
        if (!username || !sessionToken) return;
        const [goalRes, progRes] = await Promise.allSettled([
            axios.get(`${Globals.URL}/api/goals`, auth()),
            axios.get(`${Globals.URL}/api/progress/weekly`, auth()),
        ]);
        if (goalRes.status === 'fulfilled' && goalRes.value.data?.success) {
            setGoal(goalRes.value.data.goal);
        }
        if (progRes.status === 'fulfilled' && progRes.value.data?.success) {
            setProgress(progRes.value.data);
        }
    }, [username, sessionToken, auth]);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        setSaving(true);
        setError('');
        try {
            const { data } = await axios.put(`${Globals.URL}/api/goals`, {
                username,
                goalType: form.goalType,
                period: form.period,
                target: Number(form.target),
                // A quizzes goal cannot be scoped — see the header comment.
                questionType: form.goalType === 'quizzes' ? null : form.questionType,
                source: form.goalType === 'quizzes' ? null : form.source,
            }, { headers: { Authorization: `Bearer ${sessionToken}` } });
            if (!data?.success) throw new Error(data?.message || 'failed');
            setGoal(data.goal);
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || g.saveError);
        } finally {
            setSaving(false);
        }
    };

    const clear = async () => {
        try {
            await axios.delete(`${Globals.URL}/api/goals`, {
                data: { username },
                headers: { Authorization: `Bearer ${sessionToken}` },
            });
            setGoal(null);
        } catch (_) { /* leave the card as-is; nothing was lost */ }
    };

    const startEditing = () => {
        if (goal) {
            setForm({
                goalType: goal.goalType,
                period: goal.period,
                target: goal.target,
                questionType: goal.questionType || null,
                source: goal.source || null,
            });
        }
        setError('');
        setEditing(true);
    };

    const fmt = (n) => formatNumber(n, lang);
    const isAccuracy = form.goalType === 'accuracy';
    // Scope is meaningless for a quizzes goal, and a source picker is only a
    // real choice when the track actually ships more than one collection.
    const canScope = form.goalType !== 'quizzes';
    const showSources = canScope && sources.length > 1;

    // ── Editor ────────────────────────────────────────────────────────────
    if (editing) {
        return (
            <section className="goalx goalx--editing" aria-label={g.title}>
                <div className="goalx-head">
                    <h2><Icon name="target" size={17} /> {g.title}</h2>
                </div>

                <div className="goalx-field">
                    <span className="goalx-label">{g.typeLabel}</span>
                    <div className="goalx-choices" role="group">
                        {[['questions', g.typeQuestions], ['quizzes', g.typeQuizzes], ['accuracy', g.typeAccuracy]].map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                className={`goalx-choice${form.goalType === key ? ' is-on' : ''}`}
                                aria-pressed={form.goalType === key}
                                onClick={() => setForm((f) => ({
                                    ...f,
                                    goalType: key,
                                    target: TYPE_PRESETS[key][1],
                                    // Accuracy is a rate over a window; "overall
                                    // accuracy since I set this" has no meaning,
                                    // so the server forces weekly and so do we.
                                    period: key === 'accuracy' ? 'weekly' : f.period,
                                }))}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {!isAccuracy && (
                    <div className="goalx-field">
                        <span className="goalx-label">{g.periodLabel}</span>
                        <div className="goalx-choices" role="group">
                            {[['weekly', g.periodWeekly], ['total', g.periodTotal]].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`goalx-choice${form.period === key ? ' is-on' : ''}`}
                                    aria-pressed={form.period === key}
                                    onClick={() => setForm((f) => ({ ...f, period: key }))}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="goalx-field">
                    <label className="goalx-label" htmlFor="goalx-target">{g.targetLabel}</label>
                    <div className="goalx-choices" role="group">
                        {TYPE_PRESETS[form.goalType].map((n) => (
                            <button
                                key={n}
                                type="button"
                                className={`goalx-choice${Number(form.target) === n ? ' is-on' : ''}`}
                                aria-pressed={Number(form.target) === n}
                                onClick={() => setForm((f) => ({ ...f, target: n }))}
                            >
                                {fmt(n)}{isAccuracy ? g.accuracyUnit : ''}
                            </button>
                        ))}
                    </div>
                    <input
                        id="goalx-target"
                        className="goalx-input"
                        type="number"
                        inputMode="numeric"
                        value={form.target}
                        min={isAccuracy ? 40 : 1}
                        max={isAccuracy ? 100 : 5000}
                        onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                    />
                </div>

                {/* Scope. "All specialties" is a real button rather than an
                    empty state, because clearing a narrowed goal has to be as
                    easy as setting one. */}
                {canScope ? (
                    <div className="goalx-field">
                        <span className="goalx-label">{g.scopeLabel}</span>
                        <div className="goalx-choices" role="group">
                            <button
                                type="button"
                                className={`goalx-choice${!form.questionType ? ' is-on' : ''}`}
                                aria-pressed={!form.questionType}
                                onClick={() => setForm((f) => ({ ...f, questionType: null }))}
                            >
                                {g.scopeAll}
                            </button>
                            {specialties.map(({ key }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`goalx-choice${form.questionType === key ? ' is-on' : ''}`}
                                    aria-pressed={form.questionType === key}
                                    onClick={() => setForm((f) => ({ ...f, questionType: key }))}
                                >
                                    {getTypeLabel(key, lang)}
                                </button>
                            ))}
                        </div>
                        <p className="goalx-scope-hint">{g.scopeHint}</p>
                    </div>
                ) : (
                    <p className="goalx-scope-hint">{g.scopeNotForQuizzes}</p>
                )}

                {showSources && (
                    <div className="goalx-field">
                        <span className="goalx-label">{g.scopeSourceLabel}</span>
                        <div className="goalx-choices" role="group">
                            <button
                                type="button"
                                className={`goalx-choice${!form.source ? ' is-on' : ''}`}
                                aria-pressed={!form.source}
                                onClick={() => setForm((f) => ({ ...f, source: null }))}
                            >
                                {g.scopeSourceAll}
                            </button>
                            {sources.map(({ key }) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`goalx-choice${form.source === key ? ' is-on' : ''}`}
                                    aria-pressed={form.source === key}
                                    onClick={() => setForm((f) => ({ ...f, source: key }))}
                                >
                                    {getSourceLabel(key, lang)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {error && <p className="goalx-error">{error}</p>}

                <div className="goalx-actions">
                    <button type="button" className="goalx-btn goalx-btn--primary" onClick={save} disabled={saving}>
                        {g.saveCta}
                    </button>
                    <button type="button" className="goalx-btn" onClick={() => setEditing(false)} disabled={saving}>
                        {g.cancelCta}
                    </button>
                </div>
            </section>
        );
    }

    // ── Empty state ───────────────────────────────────────────────────────
    if (!goal) {
        return (
            <section className="goalx goalx--empty" aria-label={g.title}>
                <span className="goalx-empty-icon" aria-hidden="true"><Icon name="target" size={26} /></span>
                <div className="goalx-empty-body">
                    <h2>{g.noneTitle}</h2>
                    <p>{g.noneBody}</p>
                </div>
                <button type="button" className="goalx-btn goalx-btn--primary" onClick={startEditing}>
                    {g.setCta}
                </button>
            </section>
        );
    }

    // ── Active goal ───────────────────────────────────────────────────────
    const C = RING_CIRCUMFERENCE;
    const pctClamped = Math.max(0, Math.min(100, goal.percent));
    const remaining = Math.max(0, goal.target - goal.current);
    const unit = goal.goalType === 'accuracy' ? g.accuracyUnit : '';

    const delta = (progress && progress.accuracyThisWeek != null && progress.accuracyLastWeek != null)
        ? progress.accuracyThisWeek - progress.accuracyLastWeek
        : null;

    return (
        <section className={`goalx${goal.achieved ? ' is-achieved' : ''}`} aria-label={g.title}>
            <div className="goalx-head">
                <h2><Icon name="target" size={17} /> {g.title}</h2>
                <div className="goalx-head-actions">
                    <button type="button" className="goalx-link" onClick={startEditing}>{g.changeCta}</button>
                    <button type="button" className="goalx-link goalx-link--muted" onClick={clear}>{g.clearCta}</button>
                </div>
            </div>

            <div className="goalx-body">
                <span className="goalx-ring" role="img" aria-label={g.progressOf(fmt(goal.current), fmt(goal.target))}>
                    <svg viewBox="0 0 80 80" aria-hidden="true">
                        <circle className="goalx-ring-bg" cx="40" cy="40" r="34" />
                        <circle
                            className="goalx-ring-fg"
                            cx="40" cy="40" r="34"
                            style={{ strokeDasharray: C, strokeDashoffset: C * (1 - pctClamped / 100) }}
                        />
                    </svg>
                    <span className="goalx-ring-pct"><bdi>{pctClamped}%</bdi></span>
                </span>

                <div className="goalx-detail">
                    <p className="goalx-count">
                        <bdi>{fmt(goal.current)}{unit}</bdi>
                        <span className="goalx-of"> / </span>
                        <bdi>{fmt(goal.target)}{unit}</bdi>
                    </p>
                    <p className="goalx-type">
                        {goal.goalType === 'questions' ? g.typeQuestions
                            : goal.goalType === 'quizzes' ? g.typeQuizzes : g.typeAccuracy}
                        {goal.period === 'weekly' && <span className="goalx-period"> · {g.periodWeekly}</span>}
                    </p>
                    {/* Scope, only when there is one — an unscoped goal says
                        nothing rather than "all specialties". */}
                    {(goal.questionType || goal.source) && (
                        <p className="goalx-scope">
                            {goal.questionType && (
                                <span className="goalx-scope-tag">
                                    {g.inSpecialty(getTypeLabel(goal.questionType, lang))}
                                </span>
                            )}
                            {goal.source && (
                                <span className="goalx-scope-tag">
                                    {g.inSource(getSourceLabel(goal.source, lang))}
                                </span>
                            )}
                        </p>
                    )}
                    {goal.achieved ? (
                        <p className="goalx-achieved">{g.achieved} <span>{g.achievedBody}</span></p>
                    ) : (
                        <p className="goalx-remaining">{g.remaining(`${fmt(remaining)}${unit}`)}</p>
                    )}
                </div>
            </div>

            {/* Week-on-week comparison — the "am I improving?" answer. */}
            <div className="goalx-progress">
                <span className="goalx-progress-title">{p.title}</span>
                {progress && progress.questionsThisWeek > 0 ? (
                    <div className="goalx-progress-row">
                        <span className="goalx-chip">
                            <bdi>{fmt(progress.questionsThisWeek)}</bdi> {p.questionsLabel}
                        </span>
                        {progress.accuracyThisWeek != null && (
                            <span className="goalx-chip">
                                <bdi>{progress.accuracyThisWeek}%</bdi> {p.accuracyLabel}
                            </span>
                        )}
                        {delta == null ? (
                            <span className="goalx-trend goalx-trend--flat">{p.noComparison}</span>
                        ) : delta > 0 ? (
                            <span className="goalx-trend goalx-trend--up">
                                <Icon name="trending-up" size={14} /> {p.improved(delta)}
                            </span>
                        ) : delta < 0 ? (
                            <span className="goalx-trend goalx-trend--down">
                                <Icon name="trending-down" size={14} /> {p.declined(Math.abs(delta))}
                            </span>
                        ) : (
                            <span className="goalx-trend goalx-trend--flat">{p.steady}</span>
                        )}
                    </div>
                ) : (
                    <p className="goalx-progress-empty">{p.empty}</p>
                )}
            </div>
        </section>
    );
};

export default GoalCard;
