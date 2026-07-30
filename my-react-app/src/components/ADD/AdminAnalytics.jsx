import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { TRACKS, TRACK_KEYS } from '../../utils/tracks.js';
import './AdminAnalytics.css';

const API = Globals.URL;

// Accessible, distinct series colours that read on the light admin surface.
const PALETTE = ['#2563eb', '#16a34a', '#7c3aed', '#d97706', '#dc2626', '#0891b2', '#db2777', '#65a30d'];
const AXIS = '#64748b';
const GRID = 'rgba(15, 23, 42, 0.08)';
const TOOLTIP = { background: '#fff', border: '1px solid #d4deee', borderRadius: 10, fontSize: 12, color: '#0f1e3d' };

// Derived from the track config so a specialty added to either track is
// labelled here automatically, instead of falling back to its raw db value.
const SPECIALTY_LABELS = TRACK_KEYS.reduce((acc, key) => {
    TRACKS[key].specialties.forEach((sp) => { acc[sp.key] = sp.labelAr; });
    return acc;
}, {});

const daysAgoISO = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);

const fmtDuration = (s) => {
    if (!s) return '0 د';
    const m = Math.round(s / 60);
    if (m < 60) return `${m} د`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm ? `${h} س ${rm} د` : `${h} س`;
};

const Kpi = ({ icon, label, value }) => (
    <div className="aa-kpi">
        <span className="aa-kpi-ic"><Icon name={icon} size={18} /></span>
        <div className="aa-kpi-body">
            <span className="aa-kpi-value"><bdi>{value}</bdi></span>
            <span className="aa-kpi-label">{label}</span>
        </div>
    </div>
);

/**
 * Expanded admin analytics: account mix, active-login trends, signups, growth
 * (new vs returning), and engagement — with a date-range filter. Self-contained
 * (its own /admin/analytics fetch) so it doesn't ride the dashboard's 2-min
 * auto-refresh.
 */
const AdminAnalytics = () => {
    const [from, setFrom] = useState(daysAgoISO(90));
    const [to, setTo] = useState(todayISO());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (f, t) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API}/admin/analytics`, { params: { from: f, to: t } });
            setData(res.data);
        } catch (e) {
            console.error('Failed to load admin analytics', e);
            setError('تعذّر تحميل التحليلات');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(from, to); }, [fetchData]); // initial load only

    const applyRange = () => {
        let f = from, t = to;
        if (f > t) [f, t] = [t, f];
        setFrom(f); setTo(t);
        fetchData(f, t);
    };

    const preset = (n) => {
        const f = daysAgoISO(n);
        const t = todayISO();
        setFrom(f); setTo(t);
        fetchData(f, t);
    };

    const specialtyData = data
        ? data.engagement.bySpecialty.map((d) => ({ ...d, label: SPECIALTY_LABELS[d.type] || d.type }))
        : [];

    return (
        <section className="admin-analytics" dir="rtl" aria-label="تحليلات موسّعة">
            <div className="aa-head">
                <h2><Icon name="bar-chart" size={18} /> تحليلات موسّعة</h2>
                <div className="aa-controls">
                    <div className="aa-presets">
                        <button type="button" onClick={() => preset(7)}>٧ أيام</button>
                        <button type="button" onClick={() => preset(30)}>٣٠ يوم</button>
                        <button type="button" onClick={() => preset(90)}>٩٠ يوم</button>
                    </div>
                    <label className="aa-date">من
                        <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />
                    </label>
                    <label className="aa-date">إلى
                        <input type="date" value={to} min={from} max={todayISO()} onChange={(e) => setTo(e.target.value)} />
                    </label>
                    <button type="button" className="aa-apply" onClick={applyRange}>تطبيق</button>
                </div>
            </div>

            {loading && <div className="aa-state">جارٍ تحميل التحليلات…</div>}
            {error && !loading && (
                <div className="aa-state aa-error">
                    {error} <button type="button" onClick={() => fetchData(from, to)}>إعادة المحاولة</button>
                </div>
            )}

            {data && !loading && !error && (
                <>
                    <div className="aa-kpis">
                        <Kpi icon="users" label="إجمالي الحسابات" value={data.totals.totalAccounts} />
                        <Kpi icon="flame" label="نشطون اليوم" value={data.activeUsers.dau} />
                        <Kpi icon="calendar" label="نشطون أسبوعياً" value={data.activeUsers.wau} />
                        <Kpi icon="trending-up" label="نشطون شهرياً" value={data.activeUsers.mau} />
                        <Kpi icon="target" label="تحويل تجريبي ← مدفوع" value={`${data.totals.trialToPaidRate}%`} />
                        <Kpi icon="clock" label="متوسط زمن الجلسة" value={fmtDuration(data.engagement.avgSessionSeconds)} />
                    </div>

                    <div className="aa-grid">
                        <div className="aa-card">
                            <h3>توزيع الحسابات</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={data.accountMix} dataKey="value" nameKey="label" innerRadius={55} outerRadius={92} paddingAngle={2}>
                                        {data.accountMix.map((e, i) => <Cell key={e.key} fill={PALETTE[i % PALETTE.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={TOOLTIP} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="aa-card aa-card--wide">
                            <h3>نشاط الدخول اليومي</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={data.logins} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                                    <CartesianGrid stroke={GRID} vertical={false} />
                                    <XAxis dataKey="date" tick={{ fill: AXIS, fontSize: 11 }} minTickGap={24} />
                                    <YAxis tick={{ fill: AXIS, fontSize: 11 }} allowDecimals={false} width={34} />
                                    <Tooltip contentStyle={TOOLTIP} />
                                    <Legend />
                                    <Line type="monotone" dataKey="active_users" name="مستخدمون" stroke={PALETTE[0]} strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="logins" name="مرات الدخول" stroke={PALETTE[2]} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="aa-card aa-card--wide">
                            <h3>التسجيلات الجديدة</h3>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={data.signups} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                                    <CartesianGrid stroke={GRID} vertical={false} />
                                    <XAxis dataKey="date" tick={{ fill: AXIS, fontSize: 11 }} minTickGap={24} />
                                    <YAxis tick={{ fill: AXIS, fontSize: 11 }} allowDecimals={false} width={34} />
                                    <Tooltip contentStyle={TOOLTIP} />
                                    <Bar dataKey="signups" name="تسجيلات" fill={PALETTE[1]} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="aa-card aa-card--wide">
                            <h3>مستخدمون جدد مقابل عائدين</h3>
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={data.growth} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                                    <CartesianGrid stroke={GRID} vertical={false} />
                                    <XAxis dataKey="date" tick={{ fill: AXIS, fontSize: 11 }} minTickGap={24} />
                                    <YAxis tick={{ fill: AXIS, fontSize: 11 }} allowDecimals={false} width={34} />
                                    <Tooltip contentStyle={TOOLTIP} />
                                    <Legend />
                                    <Line type="monotone" dataKey="new_users" name="جدد" stroke={PALETTE[1]} strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="returning_users" name="عائدون" stroke={PALETTE[3]} strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="aa-card">
                            <h3>الاستخدام حسب التخصص</h3>
                            {specialtyData.length === 0 ? (
                                <div className="aa-empty">لا توجد بيانات بعد</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={specialtyData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                                        <CartesianGrid stroke={GRID} horizontal={false} />
                                        <XAxis type="number" tick={{ fill: AXIS, fontSize: 11 }} allowDecimals={false} />
                                        <YAxis type="category" dataKey="label" tick={{ fill: AXIS, fontSize: 12 }} width={84} />
                                        <Tooltip contentStyle={TOOLTIP} />
                                        <Bar dataKey="answered" name="أسئلة مُجابة" fill={PALETTE[5]} radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default AdminAnalytics;
