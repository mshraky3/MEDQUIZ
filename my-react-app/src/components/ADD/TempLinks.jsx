import React, { useState, useEffect } from "react";
import Icon from '../common/Icon.jsx';
import axios from "../../utils/adminApi.js";
import "./add.css";
import "./Admin.css";
import AdminLayout from "./AdminLayout.jsx";
import { TRACKS, TRACK_KEYS, MEDICAL, normalizeTrack } from '../../utils/tracks.js';

// Mirrors DEFAULT_INVITE_MONTHS / MAX_INVITE_MONTHS in backend/app.js. The
// server clamps whatever arrives, so these only shape the picker.
const DEFAULT_LINK_MONTHS = 12;
const MAX_LINK_MONTHS = 120;
const MONTH_PRESETS = [1, 3, 6, 12];

/** "1 year" reads better than "12 months" for the commonest case. */
const monthsLabel = (m) => {
    const n = Number(m);
    if (!Number.isFinite(n) || n < 1) return '—';
    if (n === 12) return '1 year';
    if (n % 12 === 0) return `${n / 12} years`;
    return `${n} month${n === 1 ? '' : 's'}`;
};

const TempLinks = (props) => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showGenerateForm, setShowGenerateForm] = useState(false);
    const [generateForm, setGenerateForm] = useState({
        // Every account created through this link lands on this track. The
        // server takes the track from the link, not from the signup form, so
        // an invited cohort can't end up on the wrong bank.
        track: MEDICAL,
        maxUses: 1,
        // How long each account made with this link keeps access, counted from
        // that account's own signup. Invites used to grant permanent access;
        // there is no "forever" option any more.
        durationMonths: DEFAULT_LINK_MONTHS,
        createdBy: "admin"
    });
    const [generatedLink, setGeneratedLink] = useState(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${props.host}/api/admin/temp-links`);
            setLinks(response.data.links);
            setError("");
        } catch (err) {
            setError("Failed to fetch temporary links. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateLink = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(`${props.host}/api/admin/generate-temp-link`, {
                track: generateForm.track,
                maxUses: parseInt(generateForm.maxUses),
                durationMonths: parseInt(generateForm.durationMonths),
                createdBy: generateForm.createdBy
            });

            if (response.data.success) {
                setGeneratedLink(response.data.link);
                setMessage(`Temporary link generated successfully!`);
                setGenerateForm({ track: MEDICAL, maxUses: 1, durationMonths: DEFAULT_LINK_MONTHS, createdBy: "admin" });
                setShowGenerateForm(false);
                fetchLinks(); // Refresh the list
            } else {
                throw new Error(response.data.message || "Failed to generate link");
            }
        } catch (err) {
            setError(`${err.response?.data?.message || err.message || "Failed to generate link"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateLink = async (linkId) => {
        if (!window.confirm("Are you sure you want to deactivate this link? This action cannot be undone.")) {
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${props.host}/api/admin/deactivate-temp-link/${linkId}`);
            
            if (response.data.success) {
                setMessage("Link deactivated successfully!");
                fetchLinks(); // Refresh the list
            } else {
                throw new Error(response.data.message || "Failed to deactivate link");
            }
        } catch (err) {
            setError(`${err.response?.data?.message || err.message || "Failed to deactivate link"}`);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setMessage("Link copied to clipboard!");
            setTimeout(() => setMessage(""), 3000);
        }).catch(() => {
            setError("Failed to copy link to clipboard");
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
    };

    return (
        <AdminLayout>
            <div className="container">
                <div className="admin-header">
                    <h1><Icon name="link" size={16} /> Temporary Signup Links</h1>
                    <p>Create and manage temporary signup links for free accounts</p>
                </div>

                {error && <div className="error">{error}</div>}
                {message && <div className="success">{message}</div>}

                {/* Generate New Link Section */}
                <div className="admin-section">
                    <div className="section-header">
                        <h2><Icon name="plus" size={16} /> Generate New Link</h2>
                        <button
                            type="button"
                            onClick={() => setShowGenerateForm(!showGenerateForm)}
                            className="toggle-button"
                        >
                            {showGenerateForm ? <><Icon name="x" size={14} /> Cancel</> : <><Icon name="plus" size={14} /> Generate Link</>}
                        </button>
                    </div>

                    {showGenerateForm && (
                        <form onSubmit={handleGenerateLink} className="form">
                            <div className="form-group">
                                <label htmlFor="maxUses">Maximum Uses:</label>
                                <div className="counter-container">
                                    <button
                                        type="button"
                                        className="counter-btn minus"
                                        onClick={() => setGenerateForm(prev => ({
                                            ...prev,
                                            maxUses: Math.max(1, prev.maxUses - 1)
                                        }))}
                                        disabled={generateForm.maxUses <= 1}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        id="maxUses"
                                        min="1"
                                        max="100"
                                        value={generateForm.maxUses}
                                        onChange={(e) => setGenerateForm(prev => ({
                                            ...prev,
                                            maxUses: Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                                        }))}
                                        className="input counter-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="counter-btn plus"
                                        onClick={() => setGenerateForm(prev => ({
                                            ...prev,
                                            maxUses: Math.min(100, prev.maxUses + 1)
                                        }))}
                                        disabled={generateForm.maxUses >= 100}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="quick-select-buttons">
                                    <button
                                        type="button"
                                        className="quick-btn"
                                        onClick={() => setGenerateForm(prev => ({ ...prev, maxUses: 1 }))}
                                    >
                                        1
                                    </button>
                                    <button
                                        type="button"
                                        className="quick-btn"
                                        onClick={() => setGenerateForm(prev => ({ ...prev, maxUses: 5 }))}
                                    >
                                        5
                                    </button>
                                    <button
                                        type="button"
                                        className="quick-btn"
                                        onClick={() => setGenerateForm(prev => ({ ...prev, maxUses: 10 }))}
                                    >
                                        10
                                    </button>
                                    <button
                                        type="button"
                                        className="quick-btn"
                                        onClick={() => setGenerateForm(prev => ({ ...prev, maxUses: 25 }))}
                                    >
                                        25
                                    </button>
                                    <button
                                        type="button"
                                        className="quick-btn"
                                        onClick={() => setGenerateForm(prev => ({ ...prev, maxUses: 50 }))}
                                    >
                                        50
                                    </button>
                                </div>
                                <small>How many accounts can be created with this link?</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="linkMonths">Access Duration:</label>
                                <div className="quick-select-buttons">
                                    {MONTH_PRESETS.map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            className={`quick-btn${Number(generateForm.durationMonths) === m ? ' is-selected' : ''}`}
                                            onClick={() => setGenerateForm(prev => ({ ...prev, durationMonths: m }))}
                                        >
                                            {m === 12 ? '1 year' : `${m} mo`}
                                        </button>
                                    ))}
                                </div>
                                <div className="counter-container">
                                    <input
                                        type="number"
                                        id="linkMonths"
                                        min="1"
                                        max={MAX_LINK_MONTHS}
                                        value={generateForm.durationMonths}
                                        onChange={(e) => setGenerateForm(prev => ({
                                            ...prev,
                                            durationMonths: Math.max(1, Math.min(MAX_LINK_MONTHS, parseInt(e.target.value, 10) || 1))
                                        }))}
                                        className="input counter-input"
                                        required
                                    />
                                    <span className="counter-unit">months</span>
                                </div>
                                <small>
                                    Each account made with this link gets {monthsLabel(generateForm.durationMonths)} of
                                    access, counted from its own signup — not from today, so the last person to use a
                                    long-lived link still gets the full period. No invite grants access forever.
                                </small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="linkTrack">Study Track:</label>
                                <select
                                    id="linkTrack"
                                    value={generateForm.track}
                                    onChange={(e) => setGenerateForm(prev => ({
                                        ...prev,
                                        track: e.target.value
                                    }))}
                                    className="input"
                                >
                                    {TRACK_KEYS.map((key) => (
                                        <option key={key} value={key}>
                                            {TRACKS[key].label.en}
                                        </option>
                                    ))}
                                </select>
                                <small>Everyone who signs up with this link gets this track — they are not asked to choose.</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="createdBy">Created By:</label>
                                <input
                                    type="text"
                                    id="createdBy"
                                    value={generateForm.createdBy}
                                    onChange={(e) => setGenerateForm(prev => ({
                                        ...prev,
                                        createdBy: e.target.value
                                    }))}
                                    className="input"
                                    required
                                />
                            </div>

                            <button type="submit" className="button" disabled={loading}>
                                {loading ? <><Icon name="hourglass" size={14} /> Generating...</> : <><Icon name="link" size={14} /> Generate Link</>}
                            </button>
                        </form>
                    )}

                    {/* Show Generated Link */}
                    {generatedLink && (
                        <div className="generated-link-card">
                            <h3><Icon name="check-circle" size={16} /> Link Generated Successfully!</h3>
                            <div className="link-info">
                                <div className="link-url">
                                    <strong>Link URL:</strong>
                                    <div className="url-container">
                                        <input
                                            type="text"
                                            value={generatedLink.url}
                                            readOnly
                                            className="url-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(generatedLink.url)}
                                            className="copy-button"
                                        >
                                            <Icon name="clipboard" size={16} /> Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="link-details">
                                    <p><strong>Token:</strong> {generatedLink.token}</p>
                                    <p><strong>Max Uses:</strong> {generatedLink.maxUses}</p>
                                    <p><strong>Access:</strong> {monthsLabel(generatedLink.durationMonths)} per account</p>
                                    <p><strong>Track:</strong> {TRACKS[normalizeTrack(generatedLink.track)].label.en}</p>
                                    <p><strong>Status:</strong> <span className="status active"><Icon name="check-circle" size={16} /> Active</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Links List Section */}
                <div className="admin-section">
                    <div className="section-header">
                        <h2><Icon name="clipboard" size={16} /> All Temporary Links</h2>
                        <button
                            type="button"
                            onClick={fetchLinks}
                            className="refresh-button"
                            disabled={loading}
                        >
                            <Icon name="refresh" size={16} /> Refresh
                        </button>
                    </div>

                    {loading && links.length === 0 ? (
                        <div className="loading-message"><Icon name="hourglass" size={16} /> Loading links...</div>
                    ) : links.length === 0 ? (
                        <div className="no-data"><Icon name="inbox" size={16} /> No temporary links found.</div>
                    ) : (
                        <div className="links-list">
                            {links.map((link) => (
                                <div key={link.id} className="link-card">
                                    <div className="link-header">
                                        <div className="link-status">
                                            <span className={`status ${link.isActive ? 'active' : 'inactive'}`}>
                                                {link.isActive ? <><Icon name="check-circle" size={14} /> Active</> : <><Icon name="x-circle" size={14} /> Inactive</>}
                                            </span>
                                        </div>
                                        <div className="link-actions">
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(link.url)}
                                                className="action-button copy"
                                                title="Copy link"
                                            >
                                                <Icon name="clipboard" size={16} /> Copy
                                            </button>
                                            {link.isActive && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeactivateLink(link.id)}
                                                    className="action-button deactivate"
                                                    title="Deactivate link"
                                                >
                                                    <Icon name="ban" size={16} /> Deactivate
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="link-content">
                                        <div className="link-url">
                                            <strong>URL:</strong> {link.url}
                                        </div>
                                        
                                        <div className="link-stats">
                                            <div className="stat-item">
                                                <strong>Token:</strong> {link.token}
                                            </div>
                                            <div className="stat-item">
                                                <strong>Track:</strong> {TRACKS[normalizeTrack(link.track)].label.en}
                                            </div>
                                            <div>
                                                <strong>Usage:</strong> {link.currentUses}/{link.maxUses}
                                            </div>
                                            <div className="stat-item">
                                                <strong>Access:</strong> {monthsLabel(link.durationMonths)}
                                            </div>
                                            <div className="stat-item">
                                                <strong>Created:</strong> {formatDate(link.createdAt)}
                                            </div>
                                            <div className="stat-item">
                                                <strong>Created By:</strong> {link.createdBy}
                                            </div>
                                            {link.lastUsedAt && (
                                                <div className="stat-item">
                                                    <strong>Last Used:</strong> {formatDate(link.lastUsedAt)}
                                                </div>
                                            )}
                                        </div>

                                        {link.accountsCreated > 0 && (
                                            <div className="created-accounts">
                                                <strong><Icon name="bar-chart" size={16} /> Accounts Created ({link.accountsCreated}):</strong>
                                                <div className="accounts-list">
                                                    {link.createdAccounts.map((account, index) => (
                                                        <div key={index} className="account-item">
                                                            <span className="username">{account.username}</span>
                                                            <span className="created-date">
                                                                {formatDate(account.created_at)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default TempLinks;
