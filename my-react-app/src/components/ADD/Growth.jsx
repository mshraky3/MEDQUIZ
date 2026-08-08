import React, { useMemo, useState } from 'react';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Icon from '../common/Icon.jsx';
import Globals from '../../global.js';
import AdminLayout from './AdminLayout.jsx';
import EngagementPanel from './EngagementPanel.jsx';
import FunnelPanel from './FunnelPanel.jsx';
import Kpi from './ui/Kpi.jsx';
import Panel from './ui/Panel.jsx';
import ChartCard from './ui/ChartCard.jsx';
import useAdminData from './ui/useAdminData.js';
import { pct, dur, num, daysAgoISO, todayISO } from './ui/format.js';
import { PALETTE, AXIS_TICK, GRID, TOOLTIP } from './ui/chartTheme.js';
import { TRACKS, TRACK_KEYS } from '../../utils/tracks.js';
import './Admin.css';
import './Growth.css';

const API = Globals.URL;

// Derived from the track config so a specialty added to either track is
// labelled here automatically, instead of falling back to its raw db value.
const SPECIALTY_LABELS = TRACK_KEYS.reduce((acc, key) => {
    TRACKS[key].specialties.forEach((sp) => { acc[sp.key] = sp.label.en; });
    return acc;
}, {});

/**
 * Growth — full-range user & engagement analytics. Absorbs what used to be
 * AdminAnalytics.jsx (embedded inside the dashboard) plus the full
 * EngagementPanel — the Overview page only shows a condensed slice of both,
 * this page is where you dig in with a real date range.
 */
const Growth = () => {
    const [from, setFrom] = useState(daysAgoISO(90));
    const [to, setTo] = useState(todayISO());
    const [appliedFrom, setAppliedFrom] = useState(from);
    const [appliedTo, setAppliedTo] = useState(to);

    const { data, loading, error, reload } = useAdminData(`${API}/admin/analytics`, {
        params: { from: appliedFrom, to: appliedTo },
    });

    const applyRange = () => {
        let f = from, t = to;
        if (f > t) [f, t] = [t, f];
        setFrom(f); setTo(t);
        setAppliedFrom(f); setAppliedTo(t);
    };

    const preset = (n) => {
        const f = daysAgoISO(n);
        const t = todayISO();
        setFrom(f); setTo(t);
        setAppliedFrom(f); setAppliedTo(t);
    };

    const specialtyData = useMemo(
        () => (data ? data.engagement.bySpecialty.map((d) => ({ ...d, label: SPECIALTY_LABELS[d.type] || d.type })) : []),
        [data]
    );

    // Daily + cumulative signups, most recent 14 days of whatever range was
    // fetched — the explicit "daily new user records" table, independent of
    // the chart's (often wider) date range.
    const signupTable = useMemo(() => {
        const rows = (data?.signups || []).slice(-14);
        let cumulative = 0;
        const priorCumulative = (data?.signups || []).length > 14
            ? data.signups.slice(0, -14).reduce((n, r) => n + (r.signups || 0), 0)
            : 0;
        cumulative = priorCumulative;
        return rows.map((r) => {
            cumulative += r.signups || 0;
            return { ...r, cumulative };
        }).reverse();
    }, [data]);

    return (
        <AdminLayout containerClassName="growth-view">
            <Panel
                icon="trending-up"
                title="Growth analytics"
                subtitle="Users, signups and engagement over a custom date range"
                actions={(
                    <div className="growth-controls">
                        <div className="growth-presets">
                            <button type="button" onClick={() => preset(7)}>7 days</button>
                            <button type="button" onClick={() => preset(30)}>30 days</button>
                            <button type="button" onClick={() => preset(90)}>90 days</button>
                        </div>
                        <label className="growth-date">From
                            <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
                        </label>
                        <label className="growth-date">To
                            <input type="date" value={to} min={from} max={todayISO()} onChange={(e) => setTo(e.target.value)} />
                        </label>
                        <button type="button" className="growth-apply" onClick={applyRange}>Apply</button>
                    </div>
                )}
            >
                {error && !loading && (
                    <div className="growth-state growth-state--error">
                        {error} <button type="button" onClick={reload}>Try again</button>
                    </div>
                )}

                {data && (
                    <div className="admin-strip">
                        <Kpi icon="users" label="Total accounts" value={num(data.totals.totalAccounts)} />
                        <Kpi icon="flame" label="Active today" value={num(data.activeUsers.dau)} />
                        <Kpi icon="calendar" label="Active this week" value={num(data.activeUsers.wau)} />
                        <Kpi icon="trending-up" label="Active this month" value={num(data.activeUsers.mau)} />
                        <Kpi icon="target" label="Tried → paid" value={pct(data.totals.triedToPaidRate, 1)} sub={`${num(data.totals.payers)} total payers`} />
                        <Kpi icon="clock" label="Avg session" value={dur(data.engagement.avgSessionSeconds)} />
                    </div>
                )}
            </Panel>

            <div className="admin-grid-2">
                <ChartCard icon="users" title="Account mix" loading={loading && !data} error={!loading && error} height={260}>
                    {data && (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.accountMix} dataKey="value" nameKey="label" innerRadius={55} outerRadius={92} paddingAngle={2}>
                                    {data.accountMix.map((e, i) => <Cell key={e.key} fill={PALETTE[i % PALETTE.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={TOOLTIP} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard icon="bar-chart" title="Daily login activity" wide loading={loading && !data} error={!loading && error} height={260}>
                    {data && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.logins} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                                <CartesianGrid stroke={GRID} vertical={false} />
                                <XAxis dataKey="date" tick={AXIS_TICK} minTickGap={24} />
                                <YAxis tick={AXIS_TICK} allowDecimals={false} width={34} />
                                <Tooltip contentStyle={TOOLTIP} />
                                <Legend />
                                <Line type="monotone" dataKey="active_users" name="Users" stroke={PALETTE[0]} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="logins" name="Logins" stroke={PALETTE[2]} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard icon="trending-up" title="New signups" wide loading={loading && !data} error={!loading && error} height={240}>
                    {data && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.signups} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                                <CartesianGrid stroke={GRID} vertical={false} />
                                <XAxis dataKey="date" tick={AXIS_TICK} minTickGap={24} />
                                <YAxis tick={AXIS_TICK} allowDecimals={false} width={34} />
                                <Tooltip contentStyle={TOOLTIP} />
                                <Bar dataKey="signups" name="Signups" fill={PALETTE[1]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard icon="users" title="New vs returning users" wide loading={loading && !data} error={!loading && error} height={240}>
                    {data && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.growth} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                                <CartesianGrid stroke={GRID} vertical={false} />
                                <XAxis dataKey="date" tick={AXIS_TICK} minTickGap={24} />
                                <YAxis tick={AXIS_TICK} allowDecimals={false} width={34} />
                                <Tooltip contentStyle={TOOLTIP} />
                                <Legend />
                                <Line type="monotone" dataKey="new_users" name="New" stroke={PALETTE[1]} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="returning_users" name="Returning" stroke={PALETTE[3]} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                <ChartCard
                    icon="book-open"
                    title="Usage by specialty"
                    loading={loading && !data}
                    error={!loading && error}
                    empty={data && specialtyData.length === 0}
                    height={260}
                >
                    {data && specialtyData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={specialtyData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                                <CartesianGrid stroke={GRID} horizontal={false} />
                                <XAxis type="number" tick={AXIS_TICK} allowDecimals={false} />
                                <YAxis type="category" dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} width={84} />
                                <Tooltip contentStyle={TOOLTIP} />
                                <Bar dataKey="answered" name="Questions answered" fill={PALETTE[5]} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>

            {/* ── Daily new-user records ── the explicit ask: a real table, not
                 just a chart, so a specific day's count can be read exactly. */}
            <Panel icon="calendar" title="Daily new users" subtitle="Most recent 14 days, with a running total">
                <div className="growth-table-wrap">
                    <table className="growth-table">
                        <thead>
                            <tr><th>Date</th><th className="num">New users</th><th className="num">Cumulative</th></tr>
                        </thead>
                        <tbody>
                            {signupTable.map((r) => (
                                <tr key={r.date}>
                                    <td>{r.date}</td>
                                    <td className="num">{r.signups}</td>
                                    <td className="num">{r.cumulative}</td>
                                </tr>
                            ))}
                            {signupTable.length === 0 && (
                                <tr><td colSpan={3} className="growth-empty">No data in range</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Panel>

            <FunnelPanel />

            <EngagementPanel />
        </AdminLayout>
    );
};

export default Growth;
