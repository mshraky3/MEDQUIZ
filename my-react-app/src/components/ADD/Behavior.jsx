import React, { useMemo, useState } from 'react';
import {
    ResponsiveContainer, BarChart, Bar, LineChart, Line, ComposedChart,
    PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Icon from '../common/Icon.jsx';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import AdminLayout from './AdminLayout.jsx';
import Kpi from './ui/Kpi.jsx';
import Panel from './ui/Panel.jsx';
import ChartCard from './ui/ChartCard.jsx';
import useAdminData from './ui/useAdminData.js';
import { num, pct, dur } from './ui/format.js';
import { PALETTE, AXIS_TICK, GRID, TOOLTIP } from './ui/chartTheme.js';
import './Admin.css';
import './Behavior.css';

const API = Globals.URL;

/**
 * Admin → Behaviour. What students actually DO, as opposed to how many there
 * are (Overview) or what they paid (Accounting).
 *
 * Two sources, deliberately:
 *
 *   /admin/stats     — already running 31 queries every two minutes, and was
 *                      shipping roughly seventeen behaviour series that no
 *                      component had ever read: hour-of-day, device and browser
 *                      splits, accuracy by specialty, the accuracy histogram,
 *                      weekly growth, completion rate, streaks, top users. The
 *                      data was being paid for and thrown away. Nothing new is
 *                      queried for any of it here.
 *   /admin/behavior  — on-demand, and the only place that aggregates
 *                      user_question_attempts (one row per answer, with its
 *                      timing) across all users. See adminMetricsService.js.
 *
 * Both are read-only; nothing on this page changes anything.
 */

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SIGNUP_LABELS = {
    google: 'Google',
    email_otp: 'Email + OTP',
    admin: 'Admin-created',
    temp_link: 'Invite link',
    group_seat: 'Group seat',
    unknown: 'Unrecorded',
};

/** "14" → "2pm". Hour-of-day axes are unreadable as bare 24h integers. */
const hourLabel = (h) => {
    const n = Number(h);
    if (n === 0) return '12a';
    if (n === 12) return '12p';
    return n < 12 ? `${n}a` : `${n - 12}p`;
};

/** Sunday-first week label from an ISO date. */
const weekLabel = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/**
 * Day × hour grid of quiz starts. Recharts has no heatmap, and a 7×24 matrix is
 * a CSS grid problem rather than a charting one — the value is in seeing the
 * shape of the week at a glance, which a 168-point line chart cannot give.
 */
const StudyHeatmap = ({ rows }) => {
    const { matrix, max } = useMemo(() => {
        const m = Array.from({ length: 7 }, () => Array(24).fill(0));
        let hi = 0;
        rows.forEach((r) => {
            const d = Number(r.dow), h = Number(r.hour), n = Number(r.n) || 0;
            if (d >= 0 && d < 7 && h >= 0 && h < 24) { m[d][h] = n; if (n > hi) hi = n; }
        });
        return { matrix: m, max: hi };
    }, [rows]);

    if (!max) return <div className="admin-chart-state">No quiz activity in this window</div>;

    return (
        <div className="bhv-heatmap">
            <div className="bhv-heatmap-grid">
                {matrix.map((row, d) => (
                    <React.Fragment key={d}>
                        <span className="bhv-heatmap-day">{DOW[d]}</span>
                        {row.map((n, h) => (
                            <span
                                key={h}
                                className="bhv-heatmap-cell"
                                // Opacity rather than a colour ramp: one hue keeps
                                // the grid readable at 168 cells, and the eye is
                                // looking for the bright block, not a exact value.
                                style={{ opacity: n ? 0.12 + 0.88 * (n / max) : 0.04 }}
                                title={`${DOW[d]} ${hourLabel(h)} — ${num(n)} quizzes`}
                            />
                        ))}
                    </React.Fragment>
                ))}
                <span />
                {Array.from({ length: 24 }, (_, h) => (
                    <span key={h} className="bhv-heatmap-hour">{h % 3 === 0 ? hourLabel(h) : ''}</span>
                ))}
            </div>
            <div className="bhv-heatmap-legend">
                <span>quiet</span>
                <i style={{ opacity: 0.12 }} /><i style={{ opacity: 0.4 }} />
                <i style={{ opacity: 0.7 }} /><i style={{ opacity: 1 }} />
                <span>busiest ({num(max)})</span>
            </div>
        </div>
    );
};

/**
 * Retention as a cohort triangle: one row per signup week, one column per week
 * since. Distinct from the overview's week-over-week active ratio, which
 * compares two adjacent weeks and can exceed 100% — this follows a fixed group
 * of people forward, so the decay left-to-right is the real retention curve.
 */
const RetentionGrid = ({ rows, weeks }) => {
    const cohorts = useMemo(() => {
        const byWeek = new Map();
        rows.forEach((r) => {
            if (!byWeek.has(r.cohort_week)) {
                byWeek.set(r.cohort_week, { week: r.cohort_week, size: Number(r.cohort_size) || 0, cells: {} });
            }
            // week_index is null for a cohort where nobody ever logged in — the
            // LEFT JOIN still returns the row so the cohort's size is visible.
            if (r.week_index !== null && r.week_index !== undefined) {
                byWeek.get(r.cohort_week).cells[Number(r.week_index)] = Number(r.active) || 0;
            }
        });
        return [...byWeek.values()].sort((a, b) => b.week.localeCompare(a.week));
    }, [rows]);

    if (!cohorts.length) return <div className="admin-chart-state">No cohorts in this window</div>;

    return (
        <div className="bhv-table-scroll">
            <table className="bhv-cohort">
                <thead>
                    <tr>
                        <th>Signed up</th>
                        <th>Size</th>
                        {Array.from({ length: weeks + 1 }, (_, i) => <th key={i}>W{i}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {cohorts.map((c) => (
                        <tr key={c.week}>
                            <td className="bhv-cohort-week">{weekLabel(c.week)}</td>
                            <td className="bhv-cohort-size">{num(c.size)}</td>
                            {Array.from({ length: weeks + 1 }, (_, i) => {
                                const active = c.cells[i];
                                if (active === undefined || !c.size) return <td key={i} className="bhv-cohort-empty" />;
                                const p = (active / c.size) * 100;
                                return (
                                    <td
                                        key={i}
                                        className="bhv-cohort-cell"
                                        style={{ '--fill': `${0.1 + 0.9 * (p / 100)}` }}
                                        title={`${num(active)} of ${num(c.size)} active`}
                                    >
                                        {Math.round(p)}%
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Behavior = () => {
    const [minAttempts, setMinAttempts] = useState(15);
    const [openQuestion, setOpenQuestion] = useState(null);
    const [spread, setSpread] = useState(null);
    const [spreadLoading, setSpreadLoading] = useState(false);

    // Free data: /admin/stats is already loaded (and polled) by the overview.
    // Requested without a poll here — this page is a read, not a monitor.
    const stats = useAdminData(`${API}/admin/stats`);
    const behavior = useAdminData(`${API}/admin/behavior`, { params: { minAttempts } });

    const s = stats.data || {};
    const charts = s.charts || {};
    const overview = s.overview || {};
    const b = behavior.data || {};
    const totals = b.totals || {};

    /** Quiz starts and logins share one hour axis, so they belong on one chart. */
    const byHour = useMemo(() => {
        const quizzes = Object.fromEntries((charts.hourlyActivity || []).map((r) => [Number(r.hour), Number(r.count)]));
        const logins = Object.fromEntries((charts.loginsByHour || []).map((r) => [Number(r.hour), Number(r.count)]));
        return Array.from({ length: 24 }, (_, h) => ({
            hour: hourLabel(h), quizzes: quizzes[h] || 0, logins: logins[h] || 0,
        }));
    }, [charts.hourlyActivity, charts.loginsByHour]);

    const deviceData = useMemo(() => (charts.deviceStats || [])
        .map((r) => ({ name: r.device_type || 'unknown', value: Number(r.count) || 0 })), [charts.deviceStats]);

    const browserData = useMemo(() => (charts.browserStats || [])
        .map((r) => ({ name: r.browser || 'unknown', count: Number(r.count) || 0 })), [charts.browserStats]);

    const accuracyRadar = useMemo(() => (charts.accuracyByTopic || [])
        .map((r) => ({ topic: r.topic, accuracy: Number(r.avg_accuracy) || 0 })), [charts.accuracyByTopic]);

    const accuracyDist = useMemo(() => (charts.accuracyDistribution || [])
        .map((r) => ({ range: r.range, users: Number(r.user_count) || 0 })), [charts.accuracyDistribution]);

    /** Weekly signups and weekly quizzes, joined on the week they share. */
    const weekly = useMemo(() => {
        const key = (w) => new Date(w).toISOString().slice(0, 10);
        const users = Object.fromEntries((charts.userGrowth || []).map((r) => [key(r.week), Number(r.count)]));
        const quizzes = Object.fromEntries((charts.quizGrowth || []).map((r) => [key(r.week), Number(r.count)]));
        return [...new Set([...Object.keys(users), ...Object.keys(quizzes)])]
            .sort()
            .map((w) => ({ week: weekLabel(w), newUsers: users[w] || 0, quizzes: quizzes[w] || 0 }));
    }, [charts.userGrowth, charts.quizGrowth]);

    const signupTotals = useMemo(() => (b.signupMethods?.totals || [])
        .map((r) => ({ name: SIGNUP_LABELS[r.method] || r.method, value: Number(r.n) || 0 })), [b.signupMethods]);

    /** Long format → one row per week with a column per method, for a stacked bar. */
    const signupTrend = useMemo(() => {
        const rows = b.signupMethods?.trend || [];
        const methods = [...new Set(rows.map((r) => r.method))];
        const byWeek = new Map();
        rows.forEach((r) => {
            if (!byWeek.has(r.week)) byWeek.set(r.week, { week: weekLabel(r.week), _sort: r.week });
            byWeek.get(r.week)[r.method] = Number(r.n) || 0;
        });
        return { methods, data: [...byWeek.values()].sort((a, x) => a._sort.localeCompare(x._sort)) };
    }, [b.signupMethods]);

    /** Coverage is per (track, specialty); the chart wants one bar per specialty. */
    const coverage = useMemo(() => (b.bankCoverage || [])
        .slice()
        .sort((x, y) => x.pctReached - y.pctReached)
        .slice(0, 14)
        .map((r) => ({
            name: `${r.question_type} (${r.track})`,
            reached: Number(r.reached) || 0,
            untouched: Math.max((Number(r.questions) || 0) - (Number(r.reached) || 0), 0),
            pctReached: r.pctReached,
        })), [b.bankCoverage]);

    const openSpread = async (q) => {
        setOpenQuestion(q);
        setSpread(null);
        setSpreadLoading(true);
        try {
            const res = await axios.get(`${API}/admin/behavior/question/${q.id}/spread`);
            setSpread(res.data);
        } catch (err) {
            setSpread({ error: err.response?.data?.message || 'Could not load the answer breakdown' });
        } finally {
            setSpreadLoading(false);
        }
    };

    const loading = stats.loading && !stats.data;
    const bLoading = behavior.loading && !behavior.data;

    return (
        <AdminLayout containerClassName="behavior-view">
            <Panel
                icon="brain"
                title="Behaviour"
                subtitle="How students use the product — when they study, what they get wrong, and what they never reach."
                actions={(
                    <button className="admin-link-btn" onClick={() => { stats.reload(); behavior.reload(); }}>
                        <Icon name="refresh" size={14} /> Refresh
                    </button>
                )}
            >
                <div className="admin-strip bhv-headline">
                    <Kpi
                        icon="clipboard"
                        label="Answers recorded"
                        value={num(totals.attempts?.attempts)}
                        sub={`${num(totals.attempts?.answering_users)} students have answered something`}
                    />
                    <Kpi
                        icon="target"
                        label="Correct on first sight"
                        value={pct(totals.attempts?.pct_correct, 1)}
                        sub="across every attempt ever recorded"
                    />
                    <Kpi
                        icon="clock"
                        label="Avg time per answer"
                        value={`${Math.round(totals.attempts?.avg_seconds || 0)}s`}
                        sub={`avg quiz: ${dur(totals.sessions?.avg_duration)} · ${num(totals.sessions?.avg_questions)} questions`}
                    />
                    <Kpi
                        icon="monitor"
                        label="Quizzes taken on mobile"
                        value={totals.sessions?.sessions
                            ? pct((totals.sessions.mobile_sessions / totals.sessions.sessions) * 100, 0)
                            : '—'}
                        sub={`${num(totals.sessions?.sessions)} sessions total`}
                    />
                    <Kpi
                        icon="check-circle"
                        label="Quizzes finished"
                        value={pct(overview.completionRate, 0)}
                        sub="started vs. scored"
                    />
                    <Kpi
                        icon="flag"
                        label="Goals set / hit"
                        value={`${num(totals.goals?.goals_set)} / ${num(totals.goals?.achieved)}`}
                        sub={`${num(totals.achievements?.users)} students have earned a badge`}
                    />
                </div>
            </Panel>

            {/* ── When they study ── */}
            <Panel icon="clock" title="When they study" subtitle="Riyadh time. Drives when to send email, post to Telegram, and deploy.">
                <ChartCard
                    icon="clock"
                    title="By hour of day"
                    subtitle="Quiz starts and logins, last 30 days"
                    height={250}
                    loading={loading}
                    error={!loading && stats.error}
                    empty={byHour.every((r) => !r.quizzes && !r.logins)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={byHour} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                            <CartesianGrid stroke={GRID} vertical={false} />
                            <XAxis dataKey="hour" tick={AXIS_TICK} interval={1} />
                            <YAxis tick={AXIS_TICK} allowDecimals={false} width={34} />
                            <Tooltip contentStyle={TOOLTIP} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="quizzes" name="Quizzes started" fill={PALETTE[0]} radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="logins" name="Logins" stroke={PALETTE[3]} strokeWidth={2} dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    icon="calendar"
                    title="By day and hour"
                    subtitle={`Quiz starts, last ${b.range?.days || 60} days`}
                    height="auto"
                    loading={bLoading}
                    error={!bLoading && behavior.error}
                >
                    <StudyHeatmap rows={b.studyHeatmap || []} />
                </ChartCard>
            </Panel>

            {/* ── How they get there ── */}
            <div className="admin-grid-2">
                <ChartCard
                    icon="monitor"
                    title="Device"
                    subtitle="Logins, last 30 days"
                    height={240}
                    loading={loading}
                    empty={!deviceData.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={2}>
                                {deviceData.map((entry, i) => <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    icon="globe"
                    title="Browser"
                    subtitle="Top 5, logins in the last 30 days"
                    height={240}
                    loading={loading}
                    empty={!browserData.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={browserData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                            <CartesianGrid stroke={GRID} horizontal={false} />
                            <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
                            <YAxis type="category" dataKey="name" tick={AXIS_TICK} width={70} />
                            <Tooltip contentStyle={TOOLTIP} />
                            <Bar dataKey="count" name="Logins" fill={PALETTE[5]} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* ── How well they do ── */}
            <Panel icon="target" title="How well they do">
                <div className="admin-grid-2">
                    <ChartCard
                        icon="target"
                        title="Accuracy by specialty"
                        subtitle="Average across every student who has practised it"
                        height={280}
                        loading={loading}
                        empty={accuracyRadar.length < 3}
                        emptyLabel="Needs at least three specialties with activity"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={accuracyRadar} outerRadius="72%">
                                <PolarGrid stroke={GRID} />
                                <PolarAngleAxis dataKey="topic" tick={{ ...AXIS_TICK, fontSize: 10 }} />
                                <PolarRadiusAxis domain={[0, 100]} tick={{ ...AXIS_TICK, fontSize: 9 }} />
                                <Tooltip contentStyle={TOOLTIP} formatter={(v) => `${v}%`} />
                                <Radar name="Accuracy" dataKey="accuracy" stroke={PALETTE[0]} fill={PALETTE[0]} fillOpacity={0.35} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard
                        icon="bar-chart"
                        title="Students by accuracy band"
                        subtitle="Where the population actually sits"
                        height={280}
                        loading={loading}
                        empty={!accuracyDist.length}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={accuracyDist} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                                <CartesianGrid stroke={GRID} vertical={false} />
                                <XAxis dataKey="range" tick={AXIS_TICK} />
                                <YAxis tick={AXIS_TICK} allowDecimals={false} width={34} />
                                <Tooltip contentStyle={TOOLTIP} />
                                <Bar dataKey="users" name="Students" fill={PALETTE[1]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                <ChartCard
                    icon="clock"
                    title="Time spent per answer"
                    subtitle="The 0-5s bar is people clicking through without reading — it inflates every accuracy number above it."
                    height={240}
                    loading={bLoading}
                    error={!bLoading && behavior.error}
                    empty={(b.answerTimes || []).every((r) => !r.n)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={b.answerTimes || []} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                            <CartesianGrid stroke={GRID} vertical={false} />
                            <XAxis dataKey="bucket" tick={AXIS_TICK} />
                            <YAxis tick={AXIS_TICK} allowDecimals={false} width={44} />
                            <Tooltip contentStyle={TOOLTIP} formatter={(v) => num(v)} />
                            <Bar dataKey="n" name="Answers" fill={PALETTE[2]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </Panel>

            {/* ── The content itself ── */}
            <Panel
                icon="alert-triangle"
                title="Hardest questions"
                subtitle="Lowest first-attempt accuracy. A question people answer FAST and get wrong is usually miskeyed or misleading, not hard — click one to see which option they pick instead."
                actions={(
                    <label className="bhv-threshold">
                        Min attempts
                        <input
                            type="number"
                            min="1"
                            max="500"
                            value={minAttempts}
                            onChange={(e) => setMinAttempts(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                        />
                    </label>
                )}
            >
                {bLoading ? (
                    <div className="admin-chart-state">Loading…</div>
                ) : behavior.error ? (
                    <div className="admin-chart-state admin-chart-state--error">{behavior.error}</div>
                ) : !(b.hardestQuestions || []).length ? (
                    <div className="admin-chart-state">
                        No question has been answered {minAttempts}+ times yet — lower the threshold.
                    </div>
                ) : (
                    <div className="bhv-table-scroll">
                        <table className="bhv-table">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Specialty</th>
                                    <th>Correct</th>
                                    <th>Attempts</th>
                                    <th>Avg time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {b.hardestQuestions.map((q) => (
                                    <tr key={q.id} className="bhv-row-click" onClick={() => openSpread(q)}>
                                        <td className="bhv-qtext">
                                            <span className="bhv-qid">#{q.id}</span> {q.question_text}
                                        </td>
                                        <td>{q.question_type} <span className="bhv-dim">/ {q.track}</span></td>
                                        <td>
                                            <span className={`bhv-pct ${q.pct_correct < 35 ? 'is-low' : q.pct_correct < 60 ? 'is-mid' : 'is-ok'}`}>
                                                {pct(q.pct_correct, 1)}
                                            </span>
                                        </td>
                                        <td>{num(q.attempts)} <span className="bhv-dim">/ {num(q.users)} students</span></td>
                                        <td>{Math.round(q.avg_seconds || 0)}s</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            <ChartCard
                icon="book-open"
                title="Question bank coverage"
                subtitle="How much of each specialty anyone has actually reached. A near-full bar means subscribers are about to run out of new questions."
                height={Math.max(240, coverage.length * 26 + 40)}
                loading={bLoading}
                error={!bLoading && behavior.error}
                empty={!coverage.length}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coverage} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                        <CartesianGrid stroke={GRID} horizontal={false} />
                        <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" tick={{ ...AXIS_TICK, fontSize: 10 }} width={150} />
                        <Tooltip contentStyle={TOOLTIP} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="reached" name="Reached by someone" stackId="c" fill={PALETTE[0]} />
                        <Bar dataKey="untouched" name="Never answered" stackId="c" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard
                icon="book"
                title="Summaries: how far people read"
                subtitle="Average depth reached as a share of the deck's pages. A deck everyone opens and nobody finishes is too long or front-loaded."
                height={Math.max(240, (b.summaryDropoff || []).length * 26 + 40)}
                loading={bLoading}
                error={!bLoading && behavior.error}
                empty={!(b.summaryDropoff || []).length}
                emptyLabel="No summary has been opened yet"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={b.summaryDropoff || []} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                        <CartesianGrid stroke={GRID} horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tick={AXIS_TICK} unit="%" />
                        <YAxis type="category" dataKey="title" tick={{ ...AXIS_TICK, fontSize: 10 }} width={170} />
                        <Tooltip
                            contentStyle={TOOLTIP}
                            formatter={(v, name) => [`${v}%`, name]}
                            labelFormatter={(t) => t}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="pctDepth" name="Avg depth reached" fill={PALETTE[2]} radius={[0, 4, 4, 0]} />
                        <Bar dataKey="pctFinished" name="Finished it" fill={PALETTE[1]} radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Do they come back ── */}
            <Panel
                icon="users"
                title="Retention by signup week"
                subtitle="Each row is the group who signed up that week; each column is how many of them logged in that many weeks later. Week 0 is the signup week itself."
            >
                {bLoading ? (
                    <div className="admin-chart-state">Loading…</div>
                ) : (
                    <RetentionGrid rows={b.retention || []} weeks={b.range?.weeks || 8} />
                )}
            </Panel>

            <div className="admin-grid-2">
                <ChartCard
                    icon="user"
                    title="How accounts get opened"
                    subtitle="All time"
                    height={250}
                    loading={bLoading}
                    empty={!signupTotals.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={signupTotals} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={2}>
                                {signupTotals.map((entry, i) => <Cell key={entry.name} fill={PALETTE[i % PALETTE.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP} formatter={(v) => num(v)} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    icon="trending-up"
                    title="Signup method over time"
                    subtitle="By week"
                    height={250}
                    loading={bLoading}
                    empty={!signupTrend.data.length}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={signupTrend.data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                            <CartesianGrid stroke={GRID} vertical={false} />
                            <XAxis dataKey="week" tick={AXIS_TICK} minTickGap={18} />
                            <YAxis tick={AXIS_TICK} allowDecimals={false} width={30} />
                            <Tooltip contentStyle={TOOLTIP} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            {signupTrend.methods.map((m, i) => (
                                <Bar key={m} dataKey={m} name={SIGNUP_LABELS[m] || m} stackId="s" fill={PALETTE[i % PALETTE.length]} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <ChartCard
                icon="trending-up"
                title="New students vs. quizzes taken"
                subtitle="By week, last 8 weeks — whether growth in people is turning into growth in use"
                height={250}
                loading={loading}
                empty={!weekly.length}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={weekly} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                        <CartesianGrid stroke={GRID} vertical={false} />
                        <XAxis dataKey="week" tick={AXIS_TICK} />
                        <YAxis yAxisId="l" tick={AXIS_TICK} allowDecimals={false} width={34} />
                        <YAxis yAxisId="r" orientation="right" tick={AXIS_TICK} allowDecimals={false} width={40} />
                        <Tooltip contentStyle={TOOLTIP} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar yAxisId="l" dataKey="newUsers" name="New students" fill={PALETTE[1]} radius={[4, 4, 0, 0]} />
                        <Line yAxisId="r" type="monotone" dataKey="quizzes" name="Quizzes taken" stroke={PALETTE[0]} strokeWidth={2} dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* ── Who's most engaged ── */}
            <div className="admin-grid-2">
                <Panel icon="flame" title="Longest current streaks">
                    {!(s.streakLeaders || []).length ? (
                        <div className="admin-chart-state">No streaks recorded</div>
                    ) : (
                        <ul className="bhv-list">
                            {s.streakLeaders.map((u) => (
                                <li key={u.username}>
                                    <span className="bhv-list-name">{u.username}</span>
                                    <span className="bhv-list-value">{num(u.streak)} days</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>

                <Panel icon="award" title="Most active students" subtitle="By quizzes taken">
                    {!(s.topUsers || []).length ? (
                        <div className="admin-chart-state">No activity yet</div>
                    ) : (
                        <ul className="bhv-list">
                            {s.topUsers.slice(0, 8).map((u) => (
                                <li key={u.username}>
                                    <span className="bhv-list-name">{u.username}</span>
                                    <span className="bhv-list-value">
                                        {num(u.total_quizzes ?? u.quiz_count)} quizzes
                                        {u.avg_accuracy != null && <span className="bhv-dim"> · {pct(u.avg_accuracy, 0)}</span>}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>

            {/* ── Answer breakdown for one question ── */}
            {openQuestion && (
                <div className="bhv-modal-overlay" onClick={() => setOpenQuestion(null)}>
                    <div className="bhv-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="bhv-modal-head">
                            <h3>Question #{openQuestion.id}</h3>
                            <button className="bhv-modal-close" onClick={() => setOpenQuestion(null)} aria-label="Close">
                                <Icon name="x" size={18} />
                            </button>
                        </div>
                        {spreadLoading ? (
                            <div className="admin-chart-state">Loading…</div>
                        ) : spread?.error ? (
                            <div className="admin-chart-state admin-chart-state--error">{spread.error}</div>
                        ) : spread ? (
                            <>
                                <p className="bhv-modal-q">{spread.question.question_text}</p>
                                <ul className="bhv-spread">
                                    {spread.spread.map((row) => {
                                        const total = spread.spread.reduce((a, r) => a + r.n, 0) || 1;
                                        const p = Math.round((row.n / total) * 100);
                                        return (
                                            <li key={row.selected_option} className={row.is_correct ? 'is-correct' : ''}>
                                                <span className="bhv-spread-bar" style={{ width: `${p}%` }} />
                                                <span className="bhv-spread-label">
                                                    {row.is_correct && <Icon name="check" size={13} />}
                                                    {row.selected_option}
                                                </span>
                                                <span className="bhv-spread-n">{p}% · {num(row.n)}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                {spread.question.explanation && (
                                    <details className="bhv-modal-expl">
                                        <summary>Explanation as students see it</summary>
                                        <p>{spread.question.explanation}</p>
                                    </details>
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Behavior;
