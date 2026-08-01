import React, { useCallback, useEffect, useState } from 'react';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import './EngagementPanel.css';

/**
 * "What do students actually use?" — time spent per part of the product.
 *
 * Quiz counts can't answer this: someone who reads summaries for an hour and
 * never starts a quiz is invisible in every other number on the dashboard.
 * This panel reports share of *time*, which is the thing that tells you what
 * to invest in.
 */
const SECTION_META = {
    quizzes: { label: 'Questions', icon: 'clipboard', color: '#2563eb' },
    summaries: { label: 'Study material', icon: 'book-open', color: '#7c3aed' },
    analytics: { label: 'Analytics', icon: 'bar-chart', color: '#0891b2' },
    other: { label: 'Other pages', icon: 'folder', color: '#94a3b8' },
};

const RANGES = [
    { days: 7, label: '7 days' },
    { days: 30, label: '30 days' },
    { days: 90, label: '90 days' },
];

/** Seconds → "2h 14m" / "14m" / "45s" */
const dur = (s) => {
    const n = Number(s) || 0;
    if (n < 60) return `${n}s`;
    const h = Math.floor(n / 3600);
    const m = Math.round((n % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m}m`;
};

const EngagementPanel = () => {
    const [days, setDays] = useState(30);
    const [data, setData] = useState(null);
    const [state, setState] = useState('loading');

    const load = useCallback(async () => {
        setState('loading');
        try {
            const { data: d } = await axios.get(`${Globals.URL}/api/engagement/admin?days=${days}`);
            setData(d);
            setState('ready');
        } catch (_) {
            setState('error');
        }
    }, [days]);

    useEffect(() => { load(); }, [load]);

    if (state === 'loading' && !data) {
        return (
            <section className="eng-panel">
                <div className="eng-head"><h2>What are students actually using?</h2></div>
                <p className="eng-muted">Loading…</p>
            </section>
        );
    }

    if (state === 'error') {
        return (
            <section className="eng-panel">
                <div className="eng-head"><h2>What are students actually using?</h2></div>
                <p className="eng-muted">Could not load the data.
                    <button type="button" className="eng-retry" onClick={load}>Try again</button>
                </p>
            </section>
        );
    }

    const sections = (data?.bySection || []).filter((s) => s.section !== 'other' || s.seconds > 0);
    const leader = [...sections].sort((a, b) => b.seconds - a.seconds)[0];

    return (
        <section className="eng-panel">
            <div className="eng-head">
                <div>
                    <h2>What are students actually using?</h2>
                    <span>Real time spent in each section — counted only while the page is visible to the user</span>
                </div>
                <div className="eng-ranges">
                    {RANGES.map((r) => (
                        <button
                            key={r.days}
                            type="button"
                            className={`eng-range${days === r.days ? ' is-on' : ''}`}
                            onClick={() => setDays(r.days)}
                        >{r.label}</button>
                    ))}
                </div>
            </div>

            {!data?.hasData ? (
                <div className="eng-empty">
                    <Icon name="hourglass" size={22} />
                    <div>
                        <strong>No data yet</strong>
                        <span>
                            Tracking has only just started — numbers appear here once users browse the site.
                            Nothing is recorded for signed-out visitors.
                        </span>
                    </div>
                </div>
            ) : (
                <>
                    {leader && leader.seconds > 0 && (
                        <p className="eng-verdict">
                            Most used: <b style={{ color: SECTION_META[leader.section]?.color }}>
                                {SECTION_META[leader.section]?.label}
                            </b> — <b>{leader.sharePct}%</b> of total time on the platform
                            ({dur(data.grandTotalSeconds)} over {days} days).
                        </p>
                    )}

                    <div className="eng-bars">
                        {sections.map((s) => {
                            const meta = SECTION_META[s.section] || SECTION_META.other;
                            return (
                                <div className="eng-row" key={s.section}>
                                    <span className="eng-row-name">
                                        <Icon name={meta.icon} size={15} /> {meta.label}
                                    </span>
                                    <div className="eng-bar-track">
                                        <div
                                            className="eng-bar-fill"
                                            style={{ width: `${s.sharePct}%`, background: meta.color }}
                                        />
                                    </div>
                                    <span className="eng-row-pct">{s.sharePct}%</span>
                                    <span className="eng-row-meta">
                                        {dur(s.seconds)} · {s.users} users · {dur(s.avgSecondsPerUser)}/user
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {(data.byTrack || []).some((t) => t.sections.some((s) => s.seconds > 0)) && (
                        <div className="eng-track-split">
                            <h3>By track</h3>
                            {data.byTrack.map((t) => {
                                const total = t.sections.reduce((n, s) => n + s.seconds, 0);
                                if (!total) return null;
                                return (
                                    <div className="eng-track-row" key={t.track}>
                                        <span className="eng-track-name">{t.label}</span>
                                        <div className="eng-track-bar">
                                            {t.sections.filter((s) => s.seconds > 0).map((s) => (
                                                <span
                                                    key={s.section}
                                                    style={{
                                                        width: `${(s.seconds / total) * 100}%`,
                                                        background: (SECTION_META[s.section] || SECTION_META.other).color,
                                                    }}
                                                    title={`${SECTION_META[s.section]?.label}: ${dur(s.seconds)}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="eng-track-total">{dur(total)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {(data.topUsers || []).length > 0 && (
                        <details className="eng-top">
                            <summary>Most active users ({data.topUsers.length})</summary>
                            <ul>
                                {data.topUsers.map((u) => (
                                    <li key={u.who}>
                                        <span dir="ltr">{u.who}</span>
                                        <span className="eng-top-dur">{dur(u.seconds)}</span>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                </>
            )}
        </section>
    );
};

export default EngagementPanel;
