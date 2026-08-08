import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '../../utils/adminApi.js';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import AdminLayout from './AdminLayout.jsx';
import { TRACKS, TRACK_KEYS } from '../../utils/tracks.js';
import './AdminBroadcast.css';

const API = `${Globals.URL}/admin/broadcast`;

const AUDIENCE_LABELS = {
    all: 'All users',
    paid: 'Paid subscribers',
    legacy: 'Legacy accounts',
    free: 'Free — questions left',
    exhausted: 'Free — used up their 40',
    // Track-targeted: most announcements only concern one student population.
    ...TRACK_KEYS.reduce((acc, t) => {
        acc[`track:${t}`] = `${TRACKS[t].label.en} track`;
        return acc;
    }, {}),
};

/**
 * How long to spread a campaign over. The backend paces sending against this
 * window, so a big list trickles out instead of bursting past the daily mail
 * allowance. 0 = as fast as the cap safely permits.
 */
const SPREAD_OPTIONS = [
    { value: 0, label: 'As fast as the daily cap allows' },
    { value: 2, label: 'Spread over 2 hours' },
    { value: 6, label: 'Spread over 6 hours' },
    { value: 12, label: 'Spread over 12 hours' },
    { value: 24, label: 'Spread over a full day' },
    { value: 48, label: 'Spread over 2 days (maximum)' },
];

const STATUS_LABELS = {
    draft: 'Draft', sending: 'Sending', paused: 'Paused', done: 'Done', cancelled: 'Cancelled'
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
    const [spreadHours, setSpreadHours] = useState(0);
    // Targeting mode: a named audience, or a hand-picked list of people.
    const [mode, setMode] = useState('audience'); // 'audience' | 'selected'
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState([]); // [{id, email, username, track}]
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
        if (a.status === 'rejected') setError(a.reason?.response?.data?.message || 'Could not load the data.');
        setLoading(false);
    }, []);

    useEffect(() => { loadMeta(); }, [loadMeta]);
    useEffect(() => () => { stopRef.current = true; }, []); // stop the loop on unmount

    const openCampaign = async (id) => {
        try {
            const { data } = await axios.get(`${API}/campaigns/${id}`);
            setActive(data);
        } catch (e) { setError(e?.response?.data?.message || 'Could not open that campaign.'); }
    };

    const createCampaign = async () => {
        setError(''); setNotice(''); setBusy('create');
        try {
            const { data } = await axios.post(`${API}/campaigns`, {
                subject,
                bodyHtml: body,
                spreadHours,
                // An explicit list wins over the audience on the server.
                ...(mode === 'selected'
                    ? { accountIds: selected.map((u) => u.id) }
                    : { audience }),
            });
            setNotice(`Campaign created — ${data.recipients} recipients.`);
            setConfirmed(false);
            await loadMeta();
            await openCampaign(data.campaign.id);
        } catch (e) { setError(e?.response?.data?.message || 'Could not create the campaign.'); }
        finally { setBusy(''); }
    };

    const sendTest = async () => {
        if (!active) return;
        setError(''); setNotice(''); setBusy('test');
        try {
            const { data } = await axios.post(`${API}/campaigns/${active.campaign.id}/test`, { to: testTo.trim() });
            setNotice(data.message);
        } catch (e) { setError(e?.response?.data?.message || 'Could not send the test email.'); }
        finally { setBusy(''); }
    };

    /** Look up individual people to mail. Debounced by the caller. */
    const runSearch = async (q) => {
        if (!q || q.trim().length < 2) { setResults([]); return; }
        setSearching(true);
        try {
            const { data } = await axios.get(
                `${API}/recipients/search?q=${encodeURIComponent(q.trim())}`
            );
            setResults(data.users || []);
        } catch (e) {
            setError(e?.response?.data?.message || 'Search failed.');
        } finally {
            setSearching(false);
        }
    };

    // Debounce so typing doesn't fire a query per keystroke.
    useEffect(() => {
        if (mode !== 'selected') return undefined;
        const t = setTimeout(() => runSearch(search), 300);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, mode]);

    const toggleSelected = (u) => {
        setSelected((prev) => (prev.some((x) => x.id === u.id)
            ? prev.filter((x) => x.id !== u.id)
            : [...prev, u]));
    };

    /** Drain the queue one small batch at a time until done, paused or capped. */
    const runDrip = async (campaignId) => {
        stopRef.current = false;
        setRunning(true); setError(''); setNotice('');
        try {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (stopRef.current) { setNotice('Sending paused. Progress is saved — you can resume later.'); break; }
                const { data } = await axios.post(`${API}/campaigns/${campaignId}/batch`);
                setActive((prev) => (prev ? { ...prev, progress: data.progress, quota: data.quota || prev.quota } : prev));
                if (data.quotaExhausted) { setNotice(data.reason); break; }
                if (data.stopped) { setNotice(data.reason); break; }
                if (data.done) { setNotice('Sending complete.'); break; }
                if (data.waiting) {
                    // The campaign is paced: the server says nothing is due yet.
                    // Wait until the next recipient comes up rather than
                    // hammering the endpoint. Progress is in the database, so
                    // closing the tab here loses nothing.
                    const waitMs = Math.max(
                        5000,
                        Math.min(5 * 60 * 1000, new Date(data.nextEligibleAt) - Date.now()),
                    );
                    setNotice(data.reason);
                    await new Promise((r) => setTimeout(r, waitMs));
                    continue;
                }
                await new Promise((r) => setTimeout(r, 400)); // breathe between batches
            }
        } catch (e) {
            setError(e?.response?.data?.message || 'Sending stopped on an error. Progress is saved — you can resume.');
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
        } catch (e) { setError(e?.response?.data?.message || 'Could not start sending.'); }
        finally { setBusy(''); }
    };

    const pauseSending = async () => {
        stopRef.current = true;
        if (active) { try { await axios.post(`${API}/campaigns/${active.campaign.id}/pause`); } catch { /* loop already stopping */ } }
    };

    const pct = (p) => (p && p.total ? Math.round(((p.sent + p.failed) / p.total) * 100) : 0);
    const quota = active?.quota || meta?.quota;

    if (loading) return <AdminLayout><div className="bc-wrap"><p className="bc-muted">Loading…</p></div></AdminLayout>;

    return (
        <AdminLayout>
        <div className="bc-wrap">
            <header className="bc-head">
                <div>
                    <h1>Bulk email</h1>
                    <p className="bc-muted">Write one message and send it to every user in small batches — without exceeding Resend's limits or the Vercel timeout.</p>
                </div>
                {quota && (
                    <div className={`bc-quota${quota.remaining <= 0 ? ' is-out' : ''}`}>
                        <span className="bc-quota-n"><bdi>{quota.remaining}</bdi></span>
                        <span className="bc-quota-l">left today</span>
                        <small>of <bdi>{quota.cap}</bdi> · <bdi>{quota.used}</bdi> sent</small>
                    </div>
                )}
            </header>

            {error && <div className="bc-alert bc-alert--err"><Icon name="alert-triangle" size={16} /> {error}</div>}
            {notice && <div className="bc-alert bc-alert--ok"><Icon name="check-circle" size={16} /> {notice}</div>}

            <div className="bc-grid">
                {/* ── Composer ── */}
                <section className="bc-card">
                    <h2>New message</h2>

                    <div className="bc-mode" role="tablist" aria-label="Targeting mode">
                        <button
                            type="button" role="tab"
                            aria-selected={mode === 'audience'}
                            className={`bc-mode-btn${mode === 'audience' ? ' is-on' : ''}`}
                            onClick={() => setMode('audience')}
                        >Whole audience</button>
                        <button
                            type="button" role="tab"
                            aria-selected={mode === 'selected'}
                            className={`bc-mode-btn${mode === 'selected' ? ' is-on' : ''}`}
                            onClick={() => setMode('selected')}
                        >Specific users</button>
                    </div>

                    {mode === 'selected' ? (
                        <>
                            <label className="bc-label" htmlFor="bc-search">Find a user</label>
                            <input
                                id="bc-search" className="bc-input" value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="By email address or username…"
                                dir="auto"
                            />
                            {searching && <p className="bc-hint">Searching…</p>}

                            {results.length > 0 && (
                                <ul className="bc-results">
                                    {results.map((u) => {
                                        const on = selected.some((x) => x.id === u.id);
                                        return (
                                            <li key={u.id}>
                                                <button
                                                    type="button"
                                                    className={`bc-result${on ? ' is-on' : ''}`}
                                                    onClick={() => toggleSelected(u)}
                                                >
                                                    <Icon name={on ? 'check-circle' : 'circle'} size={15} />
                                                    <span className="bc-result-email" dir="ltr">{u.email}</span>
                                                    <span className="bc-result-meta">
                                                        {TRACKS[u.track === 'nursing' ? 'nursing' : 'medical'].label.en}
                                                        {u.subscription_status ? ` · ${u.subscription_status}` : ''}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {search.trim().length >= 2 && !searching && results.length === 0 && (
                                <p className="bc-hint">No matching users.</p>
                            )}

                            {selected.length > 0 && (
                                <div className="bc-chosen">
                                    <div className="bc-chosen-head">
                                        <strong>{selected.length} users selected</strong>
                                        <button type="button" className="bc-chosen-clear"
                                            onClick={() => setSelected([])}>Clear all</button>
                                    </div>
                                    <ul>
                                        {selected.map((u) => (
                                            <li key={u.id}>
                                                <span dir="ltr">{u.email}</span>
                                                <button type="button" aria-label={`Remove ${u.email}`}
                                                    onClick={() => toggleSelected(u)}>
                                                    <Icon name="x" size={13} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                    <>
                    <label className="bc-label" htmlFor="bc-aud">Audience</label>
                    <select id="bc-aud" className="bc-input" value={audience} onChange={(e) => setAudience(e.target.value)}>
                        {Object.entries(AUDIENCE_LABELS).map(([k, label]) => {
                            const n = meta?.audiences?.[k];
                            return <option key={k} value={k} disabled={n === null}>{label}{n != null ? ` — ${n}` : ' — unavailable'}</option>;
                        })}
                    </select>

                    </>
                    )}

                    <label className="bc-label" htmlFor="bc-spread">Send window</label>
                    <select id="bc-spread" className="bc-input" value={spreadHours}
                        onChange={(e) => setSpreadHours(Number(e.target.value))}>
                        {SPREAD_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    <p className="bc-hint">
                        Spreading the send stops everything going out at once, so you stay inside the free plan's daily cap.
                        Progress is stored in the database — you can close this page and come back later to finish.
                    </p>

                    <label className="bc-label" htmlFor="bc-subj">Subject</label>
                    <input id="bc-subj" className="bc-input" value={subject} maxLength={200}
                        onChange={(e) => setSubject(e.target.value)} placeholder="e.g. New update to the summaries" />

                    <label className="bc-label" htmlFor="bc-body">Body (HTML allowed)</label>
                    <textarea id="bc-body" className="bc-input bc-textarea" value={body} rows={9}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder={'<p>أضفنا صوراً طبية حقيقية داخل الملخصات…</p>\n<p><a href="https://…">افتح الملخصات</a></p>'} />
                    <p className="bc-hint">Added automatically: the SQB header, a greeting by name, and an unsubscribe link (legally required).</p>

                    <button type="button" className="bc-btn bc-btn--primary"
                        disabled={!subject.trim() || !body.trim() || busy === 'create'
                            || (mode === 'selected' && selected.length === 0)}
                        onClick={createCampaign}>
                        {busy === 'create' ? 'Creating…' : 'Create campaign (does not send)'}
                    </button>
                </section>

                {/* ── Live preview ── */}
                <section className="bc-card">
                    <h2>Preview</h2>
                    {/* The preview mirrors the email the server actually sends,
                        and those emails are Arabic — so the sample greeting and
                        footer stay Arabic even though this page is English. */}
                    <div className="bc-preview" dir="rtl">
                        <div className="bc-preview-bar">SQB</div>
                        <div className="bc-preview-body">
                            <p className="bc-preview-greet">مرحباً محمود،</p>
                            {body.trim()
                                ? <div dangerouslySetInnerHTML={{ __html: body }} />
                                : <p className="bc-muted">Write the body to see the preview here…</p>}
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
                            <span><bdi>{active.progress.sent}</bdi> sent</span>
                            <span><bdi>{active.progress.pending}</bdi> pending</span>
                            {active.progress.failed > 0 && <span className="bc-fail"><bdi>{active.progress.failed}</bdi> failed</span>}
                        </div>
                    </div>

                    <div className="bc-bar" role="progressbar" aria-valuenow={pct(active.progress)} aria-valuemin={0} aria-valuemax={100}>
                        <span className="bc-bar-fill" style={{ width: `${pct(active.progress)}%` }} />
                    </div>
                    <p className="bc-hint">{pct(active.progress)}% of <bdi>{active.progress.total}</bdi> recipients</p>

                    <div className="bc-testrow">
                        <input className="bc-input" type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)}
                            placeholder="Try it on your own address first" aria-label="Test email address" />
                        <button type="button" className="bc-btn" disabled={!testTo.includes('@') || busy === 'test'} onClick={sendTest}>
                            {busy === 'test' ? 'Sending…' : 'Send test'}
                        </button>
                    </div>

                    {active.progress.pending > 0 && active.campaign.status !== 'cancelled' && (
                        <>
                            <label className="bc-confirm">
                                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={running} />
                                <span>I confirm sending this to <b>{active.progress.pending}</b> real people.</span>
                            </label>
                            <div className="bc-actions">
                                {!running ? (
                                    <button type="button" className="bc-btn bc-btn--send" disabled={!confirmed || busy === 'start' || quota?.remaining <= 0} onClick={startSending}>
                                        <Icon name="send" size={16} /> {active.progress.sent > 0 ? 'Resume sending' : 'Start sending'}
                                    </button>
                                ) : (
                                    <button type="button" className="bc-btn bc-btn--stop" onClick={pauseSending}>
                                        <Icon name="ban" size={16} /> Stop
                                    </button>
                                )}
                                {running && <span className="bc-live"><span className="bc-dot" /> Sending… keep this page open</span>}
                            </div>
                            {quota?.remaining <= 0 && <p className="bc-hint bc-fail">Daily cap reached. Resume in a few hours — progress is saved.</p>}
                        </>
                    )}

                    {active.failures?.length > 0 && (
                        <details className="bc-failures">
                            <summary>Recent failures ({active.failures.length})</summary>
                            <ul>{active.failures.map((f, i) => <li key={i}><bdi>{f.email}</bdi> — {f.error}</li>)}</ul>
                        </details>
                    )}
                </section>
            )}

            {/* ── History ── */}
            <section className="bc-card">
                <h2>Past campaigns</h2>
                {campaigns.length === 0 ? (
                    <p className="bc-muted">No campaigns yet.</p>
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
        </AdminLayout>
    );
};

export default AdminBroadcast;
