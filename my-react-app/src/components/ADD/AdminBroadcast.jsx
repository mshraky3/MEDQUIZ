import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import './AdminBroadcast.css';

const API = `${Globals.URL}/admin/broadcast`;

const AUDIENCE_LABELS = {
    all: 'كل المستخدمين',
    paid: 'المشتركون المدفوعون',
    trial: 'التجريبيون',
    legacy: 'الحسابات القديمة',
    free: 'المجانيون'
};

const STATUS_LABELS = {
    draft: 'مسودة', sending: 'يُرسل الآن', paused: 'متوقف مؤقتاً', done: 'اكتمل', cancelled: 'ملغى'
};

/**
 * Bulk email to all users, sent as a throttled drip rather than one blast.
 *
 * The page never sends anything on its own. Sending happens only while the
 * admin holds this tab open and the loop below repeatedly calls the backend's
 * /batch endpoint, which sends a handful of emails per call and records
 * progress in the database. That design is what keeps each request inside the
 * Vercel function timeout and inside Resend's rate limit — see the long
 * comment at the top of backend/routes/admin-broadcast.js.
 *
 * Closing the tab is safe: it stops the loop, and pressing start again resumes
 * from the first still-pending recipient.
 */
const AdminBroadcast = () => {
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);           // audience counts + quota
    const [campaigns, setCampaigns] = useState([]);
    const [active, setActive] = useState(null);       // { campaign, progress, failures, quota }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    // Composer
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [audience, setAudience] = useState('all');
    const [testTo, setTestTo] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [busy, setBusy] = useState('');             // which action is in flight

    // Drip loop
    const [running, setRunning] = useState(false);
    const stopRef = useRef(false);

    const loadMeta = useCallback(async () => {
        const [a, c] = await Promise.allSettled([axios.get(`${API}/audiences`), axios.get(`${API}/campaigns`)]);
        if (a.status === 'fulfilled') setMeta(a.value.data);
        if (c.status === 'fulfilled') setCampaigns(c.value.data.campaigns || []);
        if (a.status === 'rejected') setError(a.reason?.response?.data?.message || 'تعذّر تحميل البيانات.');
        setLoading(false);
    }, []);

    useEffect(() => { loadMeta(); }, [loadMeta]);
    useEffect(() => () => { stopRef.current = true; }, []); // stop the loop on unmount

    const openCampaign = async (id) => {
        try {
            const { data } = await axios.get(`${API}/campaigns/${id}`);
            setActive(data);
        } catch (e) { setError(e?.response?.data?.message || 'تعذّر فتح الحملة.'); }
    };

    const createCampaign = async () => {
        setError(''); setNotice(''); setBusy('create');
        try {
            const { data } = await axios.post(`${API}/campaigns`, { subject, bodyHtml: body, audience });
            setNotice(`تم إنشاء الحملة — ${data.recipients} مستلم.`);
            setConfirmed(false);
            await loadMeta();
            await openCampaign(data.campaign.id);
        } catch (e) { setError(e?.response?.data?.message || 'تعذّر إنشاء الحملة.'); }
        finally { setBusy(''); }
    };

    const sendTest = async () => {
        if (!active) return;
        setError(''); setNotice(''); setBusy('test');
        try {
            const { data } = await axios.post(`${API}/campaigns/${active.campaign.id}/test`, { to: testTo.trim() });
            setNotice(data.message);
        } catch (e) { setError(e?.response?.data?.message || 'تعذّر إرسال رسالة الاختبار.'); }
        finally { setBusy(''); }
    };

    /** Drain the queue one small batch at a time until done, paused or capped. */
    const runDrip = async (campaignId) => {
        stopRef.current = false;
        setRunning(true); setError(''); setNotice('');
        try {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (stopRef.current) { setNotice('تم إيقاف الإرسال. التقدّم محفوظ ويمكنك المتابعة لاحقاً.'); break; }
                const { data } = await axios.post(`${API}/campaigns/${campaignId}/batch`);
                setActive((prev) => (prev ? { ...prev, progress: data.progress, quota: data.quota || prev.quota } : prev));
                if (data.quotaExhausted) { setNotice(data.reason); break; }
                if (data.stopped) { setNotice(data.reason); break; }
                if (data.done) { setNotice('اكتمل الإرسال.'); break; }
                await new Promise((r) => setTimeout(r, 400)); // breathe between batches
            }
        } catch (e) {
            setError(e?.response?.data?.message || 'توقّف الإرسال بسبب خطأ. التقدّم محفوظ — يمكنك المتابعة.');
        } finally {
            setRunning(false);
            await loadMeta();
            await openCampaign(campaignId);
        }
    };

    const startSending = async () => {
        if (!active) return;
        setBusy('start');
        try {
            await axios.post(`${API}/campaigns/${active.campaign.id}/start`);
            await runDrip(active.campaign.id);
        } catch (e) { setError(e?.response?.data?.message || 'تعذّر بدء الإرسال.'); }
        finally { setBusy(''); }
    };

    const pauseSending = async () => {
        stopRef.current = true;
        if (active) { try { await axios.post(`${API}/campaigns/${active.campaign.id}/pause`); } catch { /* loop already stopping */ } }
    };

    const pct = (p) => (p && p.total ? Math.round(((p.sent + p.failed) / p.total) * 100) : 0);
    const quota = active?.quota || meta?.quota;

    if (loading) return <div className="bc-wrap" dir="rtl"><p className="bc-muted">جارٍ التحميل…</p></div>;

    return (
        <div className="bc-wrap" dir="rtl">
            <header className="bc-head">
                <div>
                    <button type="button" className="bc-back" onClick={() => navigate('/admin')}>
                        <Icon name="chevron-right" size={16} /> لوحة التحكم
                    </button>
                    <h1>رسائل جماعية</h1>
                    <p className="bc-muted">اكتب رسالة واحدة وأرسلها لكل المستخدمين على دفعات صغيرة — بدون تجاوز حدود Resend أو مهلة Vercel.</p>
                </div>
                {quota && (
                    <div className={`bc-quota${quota.remaining <= 0 ? ' is-out' : ''}`}>
                        <span className="bc-quota-n"><bdi>{quota.remaining}</bdi></span>
                        <span className="bc-quota-l">متبقٍ اليوم</span>
                        <small>من <bdi>{quota.cap}</bdi> · أُرسل <bdi>{quota.used}</bdi></small>
                    </div>
                )}
            </header>

            {error && <div className="bc-alert bc-alert--err"><Icon name="alert-triangle" size={16} /> {error}</div>}
            {notice && <div className="bc-alert bc-alert--ok"><Icon name="check-circle" size={16} /> {notice}</div>}

            <div className="bc-grid">
                {/* ── Composer ── */}
                <section className="bc-card">
                    <h2>رسالة جديدة</h2>

                    <label className="bc-label" htmlFor="bc-aud">الفئة المستهدفة</label>
                    <select id="bc-aud" className="bc-input" value={audience} onChange={(e) => setAudience(e.target.value)}>
                        {Object.entries(AUDIENCE_LABELS).map(([k, label]) => {
                            const n = meta?.audiences?.[k];
                            return <option key={k} value={k} disabled={n === null}>{label}{n != null ? ` — ${n}` : ' — غير متاح'}</option>;
                        })}
                    </select>

                    <label className="bc-label" htmlFor="bc-subj">عنوان الرسالة</label>
                    <input id="bc-subj" className="bc-input" value={subject} maxLength={200}
                        onChange={(e) => setSubject(e.target.value)} placeholder="مثال: تحديث جديد في الملخصات" />

                    <label className="bc-label" htmlFor="bc-body">نص الرسالة (HTML مسموح)</label>
                    <textarea id="bc-body" className="bc-input bc-textarea" value={body} rows={9}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder={'<p>أضفنا صوراً طبية حقيقية داخل الملخصات…</p>\n<p><a href="https://…">افتح الملخصات</a></p>'} />
                    <p className="bc-hint">يُضاف تلقائياً: ترويسة SQB، تحية باسم المستخدم، ورابط إلغاء الاشتراك (إلزامي نظاماً).</p>

                    <button type="button" className="bc-btn bc-btn--primary" disabled={!subject.trim() || !body.trim() || busy === 'create'}
                        onClick={createCampaign}>
                        {busy === 'create' ? 'جارٍ الإنشاء…' : 'إنشاء الحملة (بدون إرسال)'}
                    </button>
                </section>

                {/* ── Live preview ── */}
                <section className="bc-card">
                    <h2>معاينة</h2>
                    <div className="bc-preview">
                        <div className="bc-preview-bar">SQB</div>
                        <div className="bc-preview-body">
                            <p className="bc-preview-greet">مرحباً محمود،</p>
                            {body.trim()
                                ? <div dangerouslySetInnerHTML={{ __html: body }} />
                                : <p className="bc-muted">اكتب نص الرسالة لتظهر المعاينة هنا…</p>}
                        </div>
                        <div className="bc-preview-foot">SQB — بنك أسئلة SMLE<br /><u>إلغاء الاشتراك من رسائل SQB</u></div>
                    </div>
                </section>
            </div>

            {/* ── Active campaign ── */}
            {active && (
                <section className="bc-card bc-active">
                    <div className="bc-active-head">
                        <div>
                            <h2>{active.campaign.subject}</h2>
                            <p className="bc-muted">
                                {AUDIENCE_LABELS[active.campaign.audience]} ·
                                <span className={`bc-pill bc-pill--${active.campaign.status}`}>{STATUS_LABELS[active.campaign.status] || active.campaign.status}</span>
                            </p>
                        </div>
                        <div className="bc-counts">
                            <span><bdi>{active.progress.sent}</bdi> أُرسلت</span>
                            <span><bdi>{active.progress.pending}</bdi> متبقية</span>
                            {active.progress.failed > 0 && <span className="bc-fail"><bdi>{active.progress.failed}</bdi> فشلت</span>}
                        </div>
                    </div>

                    <div className="bc-bar" role="progressbar" aria-valuenow={pct(active.progress)} aria-valuemin={0} aria-valuemax={100}>
                        <span className="bc-bar-fill" style={{ width: `${pct(active.progress)}%` }} />
                    </div>
                    <p className="bc-hint">{pct(active.progress)}% — من <bdi>{active.progress.total}</bdi> مستلم</p>

                    <div className="bc-testrow">
                        <input className="bc-input" type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)}
                            placeholder="جرّبها على بريدك أولاً" aria-label="بريد الاختبار" />
                        <button type="button" className="bc-btn" disabled={!testTo.includes('@') || busy === 'test'} onClick={sendTest}>
                            {busy === 'test' ? 'جارٍ…' : 'إرسال اختبار'}
                        </button>
                    </div>

                    {active.progress.pending > 0 && active.campaign.status !== 'cancelled' && (
                        <>
                            <label className="bc-confirm">
                                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={running} />
                                <span>أؤكد إرسال هذه الرسالة إلى <b>{active.progress.pending}</b> شخص حقيقي.</span>
                            </label>
                            <div className="bc-actions">
                                {!running ? (
                                    <button type="button" className="bc-btn bc-btn--send" disabled={!confirmed || busy === 'start' || quota?.remaining <= 0} onClick={startSending}>
                                        <Icon name="send" size={16} /> {active.progress.sent > 0 ? 'متابعة الإرسال' : 'ابدأ الإرسال'}
                                    </button>
                                ) : (
                                    <button type="button" className="bc-btn bc-btn--stop" onClick={pauseSending}>
                                        <Icon name="ban" size={16} /> إيقاف
                                    </button>
                                )}
                                {running && <span className="bc-live"><span className="bc-dot" /> يُرسل الآن… لا تغلق الصفحة</span>}
                            </div>
                            {quota?.remaining <= 0 && <p className="bc-hint bc-fail">بلغت الحد اليومي. تابع بعد ساعات — التقدّم محفوظ.</p>}
                        </>
                    )}

                    {active.failures?.length > 0 && (
                        <details className="bc-failures">
                            <summary>آخر حالات الفشل ({active.failures.length})</summary>
                            <ul>{active.failures.map((f, i) => <li key={i}><bdi>{f.email}</bdi> — {f.error}</li>)}</ul>
                        </details>
                    )}
                </section>
            )}

            {/* ── History ── */}
            <section className="bc-card">
                <h2>الحملات السابقة</h2>
                {campaigns.length === 0 ? (
                    <p className="bc-muted">لا توجد حملات بعد.</p>
                ) : (
                    <ul className="bc-list">
                        {campaigns.map((c) => (
                            <li key={c.id}>
                                <button type="button" className="bc-list-item" onClick={() => openCampaign(c.id)}>
                                    <span className="bc-list-subj">{c.subject}</span>
                                    <span className={`bc-pill bc-pill--${c.status}`}>{STATUS_LABELS[c.status] || c.status}</span>
                                    <span className="bc-list-n"><bdi>{c.sent}</bdi>/<bdi>{c.total}</bdi></span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default AdminBroadcast;
