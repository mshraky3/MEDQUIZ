import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import AdminNavbar from './AdminNavbar.jsx';
import Globals from '../../global.js';

const API = Globals.URL;

const STATUS_LABELS = {
    pending: { label: 'Pending', color: '#f59e0b' },
    reviewed_correct: { label: 'Confirmed Correct', color: '#22c55e' },
    reviewed_corrected: { label: 'Corrected', color: '#22d3ee' },
};

const QuestionReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resolving, setResolving] = useState(null); // id of report being resolved
    const [editState, setEditState] = useState({}); // { [id]: { newAnswer, adminNote } }

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${API}/api/question-reports`);
            setReports(res.data.reports || []);
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Unknown error';
            setError(`Failed to load reports: ${msg}`);
            console.error('[QuestionReports] fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReports(); }, []);

    const handleResolve = async (id, action) => {
        const state = editState[id] || {};
        if (action === 'corrected' && !state.newAnswer?.trim()) {
            alert('Please enter the new correct answer before submitting.');
            return;
        }
        setResolving(id);
        try {
            await axios.put(`${API}/api/question-reports/${id}/resolve`, {
                action,
                new_correct_option: action === 'corrected' ? state.newAnswer.trim() : undefined,
                admin_note: state.adminNote?.trim() || undefined,
            });
            await fetchReports();
        } catch {
            alert('Failed to resolve report. Please try again.');
        } finally {
            setResolving(null);
        }
    };

    const updateEdit = (id, field, value) => {
        setEditState((prev) => ({
            ...prev,
            [id]: { ...(prev[id] || {}), [field]: value },
        }));
    };

    const pending = reports.filter((r) => r.status === 'pending');
    const resolved = reports.filter((r) => r.status !== 'pending');

    return (
        <div style={{ minHeight: '100vh', background: '#0b1021', color: '#e2e8f0' }}>
            <AdminNavbar />
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
                <h1 style={{ fontSize: 24, marginBottom: 8 }}><Icon name="flag" size={16} /> Question Reports</h1>
                <p style={{ color: '#94a3b8', marginBottom: 32 }}>
                    Review questions reported by users. Resolve each report and an email will be sent to the reporter.
                </p>

                {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}
                {error && (
                    <div style={{ background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 8, padding: 16, marginBottom: 24 }}>
                        <p style={{ color: '#f87171', margin: '0 0 8px 0' }}>{error}</p>
                        <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 12px 0' }}>API: {API || 'VITE_API not set'}</p>
                        <button onClick={fetchReports} style={{ background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Pending Reports */}
                        <section style={{ marginBottom: 48 }}>
                            <h2 style={{ fontSize: 18, color: '#f59e0b', marginBottom: 16 }}>
                                Pending ({pending.length})
                            </h2>
                            {pending.length === 0 && (
                                <p style={{ color: '#64748b' }}>No pending reports.</p>
                            )}
                            {pending.map((report) => {
                                const edit = editState[report.id] || {};
                                return (
                                    <div key={report.id} style={cardStyle}>
                                        <div style={cardHeader}>
                                            <span style={{ color: '#94a3b8', fontSize: 13 }}>
                                                Report #{report.id} · {new Date(report.created_at).toLocaleDateString()} · {report.question_type}
                                            </span>
                                            <span style={{ background: '#f59e0b22', color: '#f59e0b', fontSize: 12, padding: '2px 10px', borderRadius: 20 }}>
                                                Pending
                                            </span>
                                        </div>

                                        <p style={{ fontWeight: 600, margin: '12px 0 6px 0' }}>{report.question_text}</p>

                                        <div style={optionsGrid}>
                                            {['option1', 'option2', 'option3', 'option4'].map((opt) => report[opt] && (
                                                <span key={opt} style={{
                                                    ...optionTag,
                                                    background: report[opt] === report.correct_option ? '#166534' : '#1e293b',
                                                    color: report[opt] === report.correct_option ? '#86efac' : '#cbd5e1',
                                                    border: report[opt] === report.correct_option ? '1px solid #22c55e' : '1px solid #2d3f60',
                                                }}>
                                                    {report[opt] === report.correct_option ? <Icon name="check" size={13} /> : null} {report[opt]}
                                                </span>
                                            ))}
                                        </div>

                                        {report.reason && (
                                            <div style={reasonBox}>
                                                <span style={{ color: '#94a3b8', fontSize: 12 }}>User's reason: </span>
                                                <span style={{ fontSize: 14 }}>{report.reason}</span>
                                            </div>
                                        )}

                                        <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 4px 0' }}>
                                            Reported by: <strong style={{ color: '#e2e8f0' }}>{report.user_email}</strong>
                                        </p>

                                        <div style={{ marginTop: 16, borderTop: '1px solid #2d3f60', paddingTop: 16 }}>
                                            <label style={labelStyle}>Admin note (optional)</label>
                                            <input
                                                style={inputStyle}
                                                placeholder="Add a note..."
                                                value={edit.adminNote || ''}
                                                onChange={(e) => updateEdit(report.id, 'adminNote', e.target.value)}
                                            />

                                            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                                                {/* Option 1: Question is correct */}
                                                <button
                                                    style={{ ...actionBtn, background: '#166534', color: '#86efac' }}
                                                    disabled={resolving === report.id}
                                                    onClick={() => handleResolve(report.id, 'correct')}
                                                >
                                                    {resolving === report.id ? 'Saving...' : <><Icon name="check" size={14} /> Question is Correct</>}
                                                </button>

                                                {/* Option 2: Correct the answer */}
                                                <div style={{ flex: 1, minWidth: 240 }}>
                                                    <input
                                                        style={{ ...inputStyle, marginBottom: 8 }}
                                                        placeholder="New correct answer..."
                                                        value={edit.newAnswer || ''}
                                                        onChange={(e) => updateEdit(report.id, 'newAnswer', e.target.value)}
                                                    />
                                                    <button
                                                        style={{ ...actionBtn, background: '#0e7490', color: '#e0f2fe', width: '100%' }}
                                                        disabled={resolving === report.id}
                                                        onClick={() => handleResolve(report.id, 'corrected')}
                                                    >
                                                        {resolving === report.id ? 'Saving...' : <><Icon name="pen" size={14} /> Apply Correction</>}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>

                        {/* Resolved Reports */}
                        <section>
                            <h2 style={{ fontSize: 18, color: '#64748b', marginBottom: 16 }}>
                                Resolved ({resolved.length})
                            </h2>
                            {resolved.length === 0 && (
                                <p style={{ color: '#64748b' }}>No resolved reports yet.</p>
                            )}
                            {resolved.map((report) => {
                                const statusInfo = STATUS_LABELS[report.status] || { label: report.status, color: '#94a3b8' };
                                return (
                                    <div key={report.id} style={{ ...cardStyle, opacity: 0.75 }}>
                                        <div style={cardHeader}>
                                            <span style={{ color: '#94a3b8', fontSize: 13 }}>
                                                Report #{report.id} · {new Date(report.created_at).toLocaleDateString()} · {report.user_email}
                                            </span>
                                            <span style={{ background: statusInfo.color + '22', color: statusInfo.color, fontSize: 12, padding: '2px 10px', borderRadius: 20 }}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <p style={{ fontWeight: 600, margin: '10px 0 6px 0', fontSize: 14 }}>{report.question_text}</p>
                                        {report.status === 'reviewed_corrected' && (
                                            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0' }}>
                                                Changed: <span style={{ color: '#f87171', textDecoration: 'line-through' }}>{report.old_correct_option}</span>
                                                {' → '}
                                                <span style={{ color: '#86efac' }}>{report.new_correct_option}</span>
                                            </p>
                                        )}
                                        {report.admin_note && (
                                            <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0' }}>Note: {report.admin_note}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

// ── Styles ──────────────────────────────────────────────────
const cardStyle = {
    background: '#1a2237',
    border: '1px solid #2d3f60',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
};

const cardHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
};

const optionsGrid = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    margin: '8px 0',
};

const optionTag = {
    fontSize: 13,
    padding: '4px 12px',
    borderRadius: 6,
};

const reasonBox = {
    background: '#0f172a',
    border: '1px solid #2d3f60',
    borderRadius: 6,
    padding: '8px 12px',
    margin: '10px 0 4px 0',
    fontSize: 14,
};

const labelStyle = {
    display: 'block',
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 6,
};

const inputStyle = {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #2d3f60',
    borderRadius: 6,
    color: '#e2e8f0',
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

export default QuestionReports;
