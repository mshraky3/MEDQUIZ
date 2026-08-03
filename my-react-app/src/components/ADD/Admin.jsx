import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import Icon from '../common/Icon.jsx';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import AdminLayout from './AdminLayout.jsx';
import EngagementPanel from './EngagementPanel.jsx';
import Kpi from './ui/Kpi.jsx';
import Panel from './ui/Panel.jsx';
import ChartCard from './ui/ChartCard.jsx';
import useAdminData from './ui/useAdminData.js';
import { sar, num, pct, dayLabel, monthLabel, timeAgo } from './ui/format.js';
import { PALETTE, AXIS_TICK, GRID, TOOLTIP } from './ui/chartTheme.js';
import './Admin.css';

const API = Globals.URL;

/**
 * Admin Overview — the business's health at a glance.
 *
 * Every number here comes from GET /admin/stats, which in turn composes
 * services/adminMetricsService.js — the same money/subscription logic the
 * accounting page and Growth page read. "Net received" here is byte-identical
 * to /admin/accounting's "Net received" because both derive from
 * accountingService.fetchPaidEvents(); this page used to show a raw, inflated
 * gross under a misleading "Total Revenue Received" label — that was the bug
 * this whole rebuild started from.
 */
const Admin = () => {
    const navigate = useNavigate();
    const { data: stats, loading, error, reload } = useAdminData(`${API}/admin/stats`, { pollMs: 120000 });
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                setSuggestionsLoading(true);
                const res = await axios.get(`${API}/api/admin/suggestions`);
                setSuggestions(res.data.suggestions || []);
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
            } finally {
                setSuggestionsLoading(false);
            }
        })();
    }, []);

    const updateSuggestionStatus = async (id, status) => {
        try {
            await axios.put(`${API}/api/admin/suggestions/${id}`, { status });
            setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
        } catch (err) {
            console.error('Failed to update suggestion:', err);
        }
    };

    const deleteSuggestion = async (id) => {
        if (!window.confirm('Delete this suggestion?')) return;
        try {
            await axios.delete(`${API}/api/admin/suggestions/${id}`);
            setSuggestions((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error('Failed to delete suggestion:', err);
        }
    };

    const getStatusBadge = (status) => ({
        pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
        reviewing: { bg: '#dbeafe', color: '#2563eb', label: 'Reviewing' },
        planned: { bg: '#dcfce7', color: '#16a34a', label: 'Planned' },
        implemented: { bg: '#d1fae5', color: '#059669', label: 'Done' },
        rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
    }[status] || { bg: '#fef3c7', color: '#d97706', label: 'Pending' });

    const dailySignups = useMemo(
        () => (stats?.charts?.dailySignups || []).map((d) => ({ ...d, label: dayLabel(d.date) })),
        [stats]
    );
    const dailyActiveUsers = useMemo(
        () => (stats?.charts?.dailyActiveUsers || []).map((d) => ({ ...d, label: dayLabel(d.date) })),
        [stats]
    );
    const revenueByMonth = useMemo(
        () => (stats?.charts?.revenueByMonth || []).map((m) => ({ ...m, label: monthLabel(m.month) })),
        [stats]
    );

    if (loading && !stats) {
        return (
            <AdminLayout>
                <div className="dashboard-loading">
                    <Spinner size="lg" />
                    <p>Loading dashboard...</p>
                </div>
            </AdminLayout>
        );
    }

    if (error && !stats) {
        return (
            <AdminLayout>
                <div className="dashboard-error">
                    <span className="error-icon"><Icon name="alert-triangle" size={16} /></span>
                    <p>{error}</p>
                    <button onClick={reload}>Retry</button>
                </div>
            </AdminLayout>
        );
    }

    const overview = stats?.overview || {};
    const sub = stats?.subscriptions || {};
    const active = stats?.activeUsers || { dau: 0, wau: 0, mau: 0 };
    const byTrack = stats?.byTrack || [];
    const emptyTracks = byTrack.filter((t) => !t.contentReady);
    const stickiness = active.mau > 0 ? Math.round((active.dau / active.mau) * 100) : 0;

    return (
        <AdminLayout containerClassName="dashboard-view">
            {/* ── Money ── the point of this rebuild: one number, everywhere. */}
            <Panel
                icon="award"
                title="Revenue"
                subtitle="Net received — gross minus Moyasar fees minus refunds. Identical to the Accounting page."
                actions={<button className="admin-link-btn" onClick={() => navigate('/admin/accounting')}>Open Accounting →</button>}
            >
                <div className="admin-strip">
                    <Kpi icon="award" tone="positive" label="Net received (all time)" value={`${sar(sub.netSar)} SAR`} sub={`${num(sub.paymentCount)} payments · ${num(sub.payerCount)} payers`} />
                    <Kpi icon="bar-chart" label="Gross collected" value={`${sar(sub.grossSar)} SAR`} sub="before fees & refunds" />
                    <Kpi icon="trending-down" tone="warning" label="Gateway fees" value={`-${sar(sub.feeSar)} SAR`} />
                    <Kpi icon="refresh" tone="negative" label="Refunded" value={`-${sar(sub.refundedSar)} SAR`} />
                    <Kpi icon="trending-up" label="This month" value={`${sar(sub.thisMonthNetSar)} SAR`} sub={`last month: ${sar(sub.lastMonthNetSar)} SAR`} />
                </div>
            </Panel>

            {/* ── Subscribers ── */}
            <Panel icon="check-circle" title="Subscribers">
                <div className="admin-strip">
                    <Kpi icon="check-circle" tone="positive" label="Active subscribers" value={num(sub.activeSubscribers)} />
                    <Kpi
                        icon="clock"
                        tone={sub.expiringIn7d > 0 ? 'warning' : 'neutral'}
                        label="Expiring in 7 days"
                        value={num(sub.expiringIn7d)}
                        sub={`${num(sub.expiringIn30d)} in 30 days`}
                    />
                    <Kpi icon="hourglass" label="Active trials" value={num(sub.trialActive)} />
                    <Kpi
                        icon="target"
                        label="Trial → paid"
                        value={pct(sub.trialConversionRate, 1)}
                        sub={`${num(sub.trialToPaid)}/${num(sub.totalTrialsGranted)} converted`}
                    />
                    <Kpi
                        icon="alert-triangle"
                        tone={sub.paidButInactive > 0 ? 'negative' : 'positive'}
                        label="Paid, no access"
                        value={num(sub.paidButInactive)}
                        sub={sub.paidButInactive > 0 ? 'needs fixing' : 'all clear'}
                        to={sub.paidButInactive > 0 ? '/admin/users' : undefined}
                    />
                </div>
            </Panel>

            {/* ── Users ── */}
            <Panel icon="users" title="Users">
                <div className="admin-strip">
                    <Kpi icon="users" label="Total users" value={num(overview.totalUsers)} sub={`+${num(overview.newUsersWeek)} this week`} />
                    <Kpi icon="trending-up" label="New today" value={num(overview.newUsersToday)} sub={`+${num(overview.newUsersMonth)} this month`} />
                    <Kpi icon="flame" label="Active now" value={num(overview.onlineNow)} />
                    <Kpi icon="bar-chart" label="DAU / WAU / MAU" value={`${num(active.dau)} / ${num(active.wau)} / ${num(active.mau)}`} sub={`${stickiness}% stickiness`} />
                    <Kpi icon="target" label="Avg accuracy" value={pct(overview.avgAccuracy, 1)} />
                </div>
            </Panel>

            {/* ── Needs attention ── */}
            <Panel icon="alert-triangle" title="Needs attention">
                <div className="admin-strip">
                    <Kpi
                        icon="alert-triangle"
                        tone={overview.suspiciousCount > 0 ? 'warning' : 'positive'}
                        label="Suspicious logins (30d)"
                        value={num(overview.suspiciousCount)}
                        to="/admin/users"
                    />
                    <Kpi
                        icon="flag"
                        tone={stats?.openReports > 0 ? 'warning' : 'positive'}
                        label="Open question reports"
                        value={num(stats?.openReports || 0)}
                        to="/admin/reports"
                    />
                    <Kpi
                        icon="book-open"
                        tone={emptyTracks.length > 0 ? 'warning' : 'positive'}
                        label="Tracks with no content"
                        value={emptyTracks.length > 0 ? emptyTracks.map((t) => t.label).join(', ') : 'None'}
                        to={emptyTracks.length > 0 ? '/admin/bank' : undefined}
                    />
                    <Kpi
                        icon="alert-triangle"
                        tone={sub.paidButInactive > 0 ? 'negative' : 'positive'}
                        label="Paid but locked out"
                        value={num(sub.paidButInactive)}
                        to={sub.paidButInactive > 0 ? '/admin/users' : undefined}
                    />
                </div>
            </Panel>

            {/* ── Charts ── */}
            <div className="admin-grid-2">
                <ChartCard
                    icon="trending-up"
                    title="Daily new users"
                    subtitle="Last 30 days"
                    height={240}
                    empty={dailySignups.every((d) => !d.signups)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailySignups} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                            <CartesianGrid stroke={GRID} vertical={false} />
                            <XAxis dataKey="label" tick={AXIS_TICK} minTickGap={24} />
                            <YAxis tick={AXIS_TICK} allowDecimals={false} width={30} />
                            <Tooltip contentStyle={TOOLTIP} />
                            <Bar dataKey="signups" name="New users" fill={PALETTE[1]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    icon="bar-chart"
                    title="Net revenue by month"
                    subtitle="Matches the Accounting page"
                    height={240}
                    empty={revenueByMonth.length === 0}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByMonth} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                            <CartesianGrid stroke={GRID} vertical={false} />
                            <XAxis dataKey="label" tick={AXIS_TICK} minTickGap={24} />
                            <YAxis tick={AXIS_TICK} width={40} />
                            <Tooltip contentStyle={TOOLTIP} formatter={(v) => `${sar(v)} SAR`} />
                            <Bar dataKey="netSar" name="Net SAR" fill={PALETTE[0]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    icon="flame"
                    title="Daily active users"
                    subtitle="Last 30 days"
                    height={240}
                    empty={dailyActiveUsers.every((d) => !d.active_users)}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyActiveUsers} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                            <CartesianGrid stroke={GRID} vertical={false} />
                            <XAxis dataKey="label" tick={AXIS_TICK} minTickGap={24} />
                            <YAxis tick={AXIS_TICK} allowDecimals={false} width={30} />
                            <Tooltip contentStyle={TOOLTIP} />
                            <Line type="monotone" dataKey="active_users" name="Active users" stroke={PALETTE[0]} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="admin-chart-card-wrap">
                    <EngagementPanel compact />
                </div>
            </div>

            {/* ── Recent activity ── */}
            <div className="tables-section">
                <div className="table-card">
                    <div className="table-header">
                        <h3><Icon name="check-circle" size={16} /> Recent Payments</h3>
                        <button className="view-all-btn" onClick={() => navigate('/admin/accounting')}>View all →</button>
                    </div>
                    <div className="mini-table">
                        {(sub.recentPayments || []).map((p, idx) => (
                            <div key={idx} className="mini-table-row">
                                <span className="rank-badge">{idx + 1}</span>
                                <div className="user-info-mini">
                                    <span className="username">{p.username || '(deleted account)'}</span>
                                    <span className="user-stats">{sar(p.amountSar)} {p.currency} · {new Date(p.receivedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {(!sub.recentPayments || sub.recentPayments.length === 0) && (
                            <div className="empty-state">No payments yet</div>
                        )}
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-header">
                        <h3><Icon name="lock" size={16} /> Recent Logins</h3>
                    </div>
                    <div className="mini-table">
                        {(stats?.recentLogins || []).slice(0, 8).map((login, idx) => (
                            <div key={idx} className="mini-table-row">
                                <div className="login-info">
                                    <span className="username">{login.username}</span>
                                    <span className="login-device">
                                        {login.device_type === 'mobile' ? <Icon name="phone" size={14} /> : <Icon name="monitor" size={14} />} {login.browser}
                                    </span>
                                </div>
                                <div className="login-meta">
                                    <span className="login-time">{timeAgo(login.login_time)}</span>
                                    {login.is_suspicious && <span className="suspicious-badge"><Icon name="alert-triangle" size={16} /></span>}
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentLogins || stats.recentLogins.length === 0) && (
                            <div className="empty-state">No login history</div>
                        )}
                    </div>
                </div>

                <div className="table-card suggestions-card">
                    <div className="table-header">
                        <h3><Icon name="lightbulb" size={16} /> User Suggestions</h3>
                        <span className="suggestions-count">
                            {suggestions.filter((s) => s.status === 'pending').length} pending
                        </span>
                    </div>
                    <div className="mini-table suggestions-list">
                        {suggestionsLoading ? (
                            <div className="empty-state">Loading suggestions...</div>
                        ) : suggestions.length > 0 ? (
                            suggestions.slice(0, 6).map((suggestion) => {
                                const badge = getStatusBadge(suggestion.status);
                                return (
                                    <div key={suggestion.id} className="suggestion-item">
                                        <div className="suggestion-header">
                                            <span className="suggestion-title">{suggestion.title}</span>
                                        </div>
                                        <p className="suggestion-desc">
                                            {suggestion.description?.substring(0, 100)}{suggestion.description?.length > 100 ? '...' : ''}
                                        </p>
                                        <div className="suggestion-footer">
                                            <span className="status-badge" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                                            <div className="suggestion-actions">
                                                <select
                                                    value={suggestion.status}
                                                    onChange={(e) => updateSuggestionStatus(suggestion.id, e.target.value)}
                                                    className="status-select"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="reviewing">Reviewing</option>
                                                    <option value="planned">Planned</option>
                                                    <option value="implemented">Implemented</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <button className="delete-suggestion-btn" onClick={() => deleteSuggestion(suggestion.id)} title="Delete">
                                                    <Icon name="trash" size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-state">No suggestions yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Per-track split ── every number above blends both study tracks. */}
            {byTrack.length > 0 && (
                <section className="track-panel">
                    <div className="track-panel-head">
                        <h2>By study track</h2>
                        <span>Users, activity and content, split by the bank they belong to</span>
                    </div>
                    <div className="track-panel-grid">
                        {byTrack.map((t) => (
                            <div key={t.track} className={`track-card${t.contentReady ? '' : ' is-empty'}`}>
                                <div className="track-card-head">
                                    <span className="track-card-name">{t.label}</span>
                                    <span className="track-card-key">{t.track}</span>
                                    {!t.contentReady && <span className="track-card-flag">No content yet</span>}
                                </div>
                                <div className="track-card-metrics">
                                    <div><b>{t.users}</b><span>users</span></div>
                                    <div><b>{t.activeUsers}</b><span>active 7d</span></div>
                                    <div><b>+{t.newUsersWeek}</b><span>new 7d</span></div>
                                    <div><b>{t.activeSubscribers}</b><span>subscribed</span></div>
                                    <div><b>{t.quizzes}</b><span>quizzes</span></div>
                                    <div><b>{t.avgAccuracy}%</b><span>accuracy</span></div>
                                </div>
                                <div className="track-card-content">
                                    <span><Icon name="clipboard" size={13} /> {t.questions} questions</span>
                                    <span><Icon name="book-open" size={13} /> {t.summaries} summaries</span>
                                    <span><Icon name="folder" size={13} /> {t.specialties.length} specialties</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="dashboard-footer">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <span>Auto-refresh every 2 minutes</span>
            </div>
        </AdminLayout>
    );
};

export default Admin;
