import React, { useCallback, useEffect, useState } from 'react';
import Icon from '../common/Icon.jsx';
import axios from '../../utils/adminApi.js';
import AdminLayout from './AdminLayout.jsx';
import Globals from '../../global.js';

const API = Globals.URL;

/**
 * Review queue for student success stories.
 *
 * Mirrors QuestionReports.jsx — same AdminLayout, same admin key, same inline
 * styling — because this is the second moderation queue in the panel and the
 * two should not look like different products.
 *
 * The one thing this screen has to say loudly, and says at the top: approving a
 * story does NOT put it on the site. The public page is prerendered from a
 * committed JSON file, so publishing takes an export and a deploy. That is a
 * deliberate design choice (see backend/routes/success-stories.js), but it is
 * also exactly the kind of thing that leaves someone staring at a page
 * wondering why their approval did nothing. So the screen explains it, and
 * repeats the command.
 */

const STATUS = {
    pending: { label: 'Pending review', color: '#b45309', bg: '#f59e0b22' },
    approved: { label: 'Approved', color: '#166534', bg: '#16653422' },
    rejected: { label: 'Rejected', color: '#b91c1c', bg: '#b91c1c22' },
};

const EXPORT_CMD = 'node scripts/exportSuccessStories.js --apply';

const SuccessStoriesAdmin = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const [notes, setNotes] = useState({}); // { [id]: adminNote }

    const fetchStories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API}/api/success-stories`);
            setStories(res.data.stories || []);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Unknown error';
            setError(`Failed to load stories: ${msg}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStories(); }, [fetchStories]);

    const setStatus = async (id, status) => {
        // Rejecting is not destructive (the row stays, the student can edit and
        // resubmit) but approving puts a real person's name in a queue for
        // publication, so it is worth a beat of thought.
        if (status === 'approved'
            && !window.confirm('Approve this story for publication?\n\nIt still will not appear on the site until you run the export and deploy.')) {
            return;
        }
        setBusyId(id);
        try {
            await axios.put(`${API}/api/success-stories/${id}/status`, {
                status,
                admin_note: notes[id]?.trim() || undefined,
            });
            await fetchStories();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Unknown error';
            alert(`Could not update that story: ${msg}`);
        } finally {
            setBusyId(null);
        }
    };

    const pending = stories.filter((s) => s.status === 'pending');
    const approved = stories.filter((s) => s.status === 'approved');
    const rejected = stories.filter((s) => s.status === 'rejected');

    const card = (story) => {
        const meta = STATUS[story.status] || STATUS.pending;
        const busy = busyId === story.id;
        return (
            <div key={story.id} style={cardStyle}>
                <div style={cardHeader}>
                    <span style={{ color: '#5b6779', fontSize: 13 }}>
                        #{story.id} · {story.created_at ? new Date(story.created_at).toLocaleDateString() : '—'} · {story.track}
                    </span>
                    <span style={{ background: meta.bg, color: meta.color, fontSize: 12, padding: '2px 10px', borderRadius: 20 }}>
                        {meta.label}
                    </span>
                </div>

                {/* The quote is the thing being judged, so it gets the emphasis.
                    Left as written — never edited here: rewriting someone's
                    testimonial and publishing it under their name would make it
                    ours, not theirs. Reject and ask them to redo it instead. */}
                <blockquote style={quoteStyle}>{story.quote}</blockquote>

                <p style={{ margin: '10px 0 2px', fontWeight: 600 }}>
                    {story.display_name}
                    {story.exam_result && <span style={{ color: '#166534' }}> · {story.exam_result}</span>}
                    {story.specialty && <span style={{ color: '#5b6779' }}> · {story.specialty}</span>}
                </p>
                <p style={{ fontSize: 13, color: '#5b6779', margin: '0 0 4px' }}>
                    Account: <strong style={{ color: '#0f172a' }}>{story.username}</strong>
                    {' · '}written in {story.lang === 'en' ? 'English' : 'Arabic'}
                </p>

                <p style={{ fontSize: 13, margin: '6px 0 0', color: story.consent_publish ? '#166534' : '#b91c1c' }}>
                    <Icon name={story.consent_publish ? 'check-circle' : 'alert-triangle'} size={13} />
                    {story.consent_publish
                        ? ' Consent to publish on record'
                        : ' NO CONSENT ON RECORD — do not publish'}
                </p>

                <div style={{ marginTop: 14, borderTop: '1px solid #d4deee', paddingTop: 14 }}>
                    <label style={labelStyle} htmlFor={`note-${story.id}`}>Note to self (optional)</label>
                    <input
                        id={`note-${story.id}`}
                        style={inputStyle}
                        value={notes[story.id] ?? story.admin_note ?? ''}
                        onChange={(e) => setNotes((p) => ({ ...p, [story.id]: e.target.value }))}
                        placeholder="Why approved/rejected"
                    />
                    <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                        {story.status !== 'approved' && (
                            <button
                                type="button"
                                disabled={busy || !story.consent_publish}
                                onClick={() => setStatus(story.id, 'approved')}
                                style={{ ...actionBtn, background: '#166534', color: '#fff', opacity: (busy || !story.consent_publish) ? 0.5 : 1 }}
                                title={story.consent_publish ? '' : 'Cannot approve a story with no consent on record'}
                            >
                                {busy ? 'Saving…' : 'Approve'}
                            </button>
                        )}
                        {story.status !== 'rejected' && (
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => setStatus(story.id, 'rejected')}
                                style={{ ...actionBtn, background: '#fee2e2', color: '#b91c1c', opacity: busy ? 0.5 : 1 }}
                            >
                                Reject
                            </button>
                        )}
                        {story.status !== 'pending' && (
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => setStatus(story.id, 'pending')}
                                style={{ ...actionBtn, background: '#f5f8fd', color: '#0f172a', border: '1px solid #d4deee' }}
                            >
                                Back to pending
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout bare>
            <div style={{ minHeight: 'calc(100vh - 60px)', background: 'transparent', color: '#0f172a' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
                    <h1 style={{ fontSize: 24, marginBottom: 8 }}>
                        <Icon name="star" size={16} /> Success Stories
                    </h1>
                    <p style={{ color: '#5b6779', marginBottom: 20 }}>
                        Stories students submitted after a strong quiz result. Read each one before
                        approving — this is someone&apos;s name going on a public page.
                    </p>

                    {/* The step people will otherwise miss. */}
                    <div style={publishBox}>
                        <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#0e7490' }}>
                            <Icon name="info" size={14} /> Approving does not publish
                        </p>
                        <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.7 }}>
                            The public page is built from a committed file, so an approved story
                            reaches the site only after you export it and deploy. Run this in{' '}
                            <code style={codeStyle}>backend/</code>, commit the JSON it writes, and
                            deploy:
                        </p>
                        <code style={{ ...codeStyle, display: 'block', padding: '8px 12px' }}>{EXPORT_CMD}</code>
                        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#5b6779' }}>
                            The same command removes a story: reject it here, re-run, commit. With no
                            approved stories the page stops existing entirely.
                        </p>
                    </div>

                    {loading && <p style={{ color: '#5b6779' }}>Loading…</p>}
                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                            <p style={{ color: '#b91c1c', margin: '0 0 12px 0' }}>{error}</p>
                            <button onClick={fetchStories} style={{ ...actionBtn, background: '#fecaca', color: '#7f1d1d' }}>
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <section style={{ marginBottom: 40 }}>
                                <h2 style={{ fontSize: 18, color: '#b45309', marginBottom: 16 }}>
                                    Pending ({pending.length})
                                </h2>
                                {pending.length === 0
                                    ? <p style={{ color: '#5b6779' }}>Nothing waiting for review.</p>
                                    : pending.map(card)}
                            </section>

                            <section style={{ marginBottom: 40 }}>
                                <h2 style={{ fontSize: 18, color: '#166534', marginBottom: 16 }}>
                                    Approved ({approved.length})
                                </h2>
                                {approved.length === 0
                                    ? (
                                        <p style={{ color: '#5b6779' }}>
                                            None yet — so /success-stories is not published, and is not
                                            linked from the site.
                                        </p>
                                    )
                                    : approved.map(card)}
                            </section>

                            {rejected.length > 0 && (
                                <section>
                                    <h2 style={{ fontSize: 18, color: '#b91c1c', marginBottom: 16 }}>
                                        Rejected ({rejected.length})
                                    </h2>
                                    {rejected.map(card)}
                                </section>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

const cardStyle = {
    background: '#ffffff',
    border: '1px solid #d4deee',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
};

const cardHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
};

const quoteStyle = {
    margin: '12px 0 0',
    padding: '12px 16px',
    background: '#f5f8fd',
    borderInlineStart: '3px solid #2563eb',
    borderRadius: 6,
    fontSize: 15,
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
};

const publishBox = {
    background: '#ecfeff',
    border: '1px solid #a5f3fc',
    borderRadius: 10,
    padding: '14px 16px',
    marginBottom: 28,
};

const codeStyle = {
    background: '#0f172a',
    color: '#e2e8f0',
    borderRadius: 6,
    padding: '2px 6px',
    fontSize: 13,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const labelStyle = {
    display: 'block',
    fontSize: 13,
    color: '#5b6779',
    marginBottom: 6,
};

const inputStyle = {
    width: '100%',
    background: '#f5f8fd',
    border: '1px solid #d4deee',
    borderRadius: 6,
    color: '#0f172a',
    padding: '8px 12px',
    fontSize: 14,
    boxSizing: 'border-box',
};

const actionBtn = {
    border: 'none',
    borderRadius: 8,
    padding: '9px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
};

export default SuccessStoriesAdmin;
