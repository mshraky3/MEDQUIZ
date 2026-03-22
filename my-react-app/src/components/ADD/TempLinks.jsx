import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./add.css";
import "./Admin.css";
import AdminNavbar from "./AdminNavbar.jsx";

const TempLinks = (props) => {
    const navigate = useNavigate();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showGenerateForm, setShowGenerateForm] = useState(false);
    const [generateForm, setGenerateForm] = useState({
        maxUses: 1,
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
            setError("❌ Failed to fetch temporary links. Please try again.");
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
                maxUses: parseInt(generateForm.maxUses),
                createdBy: generateForm.createdBy
            });

            if (response.data.success) {
                setGeneratedLink(response.data.link);
                setMessage(`✅ Temporary link generated successfully!`);
                setGenerateForm({ maxUses: 1, createdBy: "admin" });
                setShowGenerateForm(false);
                fetchLinks(); // Refresh the list
            } else {
                throw new Error(response.data.message || "Failed to generate link");
            }
        } catch (err) {
            setError(`❌ ${err.response?.data?.message || err.message || "Failed to generate link"}`);
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
                setMessage("✅ Link deactivated successfully!");
                fetchLinks(); // Refresh the list
            } else {
                throw new Error(response.data.message || "Failed to deactivate link");
            }
        } catch (err) {
            setError(`❌ ${err.response?.data?.message || err.message || "Failed to deactivate link"}`);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setMessage("✅ Link copied to clipboard!");
            setTimeout(() => setMessage(""), 3000);
        }).catch(() => {
            setError("❌ Failed to copy link to clipboard");
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
    };

    return (
        <div className="admin-page-wrapper">
            <AdminNavbar />
            <div className="container">
                <div className="admin-header">
                    <h1>🔗 Temporary Signup Links</h1>
                    <p>Create and manage temporary signup links for free accounts</p>
                </div>

                {error && <div className="error">{error}</div>}
                {message && <div className="success">{message}</div>}

                {/* Generate New Link Section */}
                <div className="admin-section">
                    <div className="section-header">
                        <h2>➕ Generate New Link</h2>
                        <button
                            type="button"
                            onClick={() => setShowGenerateForm(!showGenerateForm)}
                            className="toggle-button"
                        >
                            {showGenerateForm ? "❌ Cancel" : "➕ Generate Link"}
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
                                {loading ? "⏳ Generating..." : "🔗 Generate Link"}
                            </button>
                        </form>
                    )}

                    {/* Show Generated Link */}
                    {generatedLink && (
                        <div className="generated-link-card">
                            <h3>✅ Link Generated Successfully!</h3>
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
                                            📋 Copy
                                        </button>
                                    </div>
                                </div>
                                <div className="link-details">
                                    <p><strong>Token:</strong> {generatedLink.token}</p>
                                    <p><strong>Max Uses:</strong> {generatedLink.maxUses}</p>
                                    <p><strong>Status:</strong> <span className="status active">✅ Active</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Links List Section */}
                <div className="admin-section">
                    <div className="section-header">
                        <h2>📋 All Temporary Links</h2>
                        <button
                            type="button"
                            onClick={fetchLinks}
                            className="refresh-button"
                            disabled={loading}
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    {loading && links.length === 0 ? (
                        <div className="loading-message">⏳ Loading links...</div>
                    ) : links.length === 0 ? (
                        <div className="no-data">📭 No temporary links found.</div>
                    ) : (
                        <div className="links-list">
                            {links.map((link) => (
                                <div key={link.id} className="link-card">
                                    <div className="link-header">
                                        <div className="link-status">
                                            <span className={`status ${link.isActive ? 'active' : 'inactive'}`}>
                                                {link.isActive ? "✅ Active" : "❌ Inactive"}
                                            </span>
                                        </div>
                                        <div className="link-actions">
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(link.url)}
                                                className="action-button copy"
                                                title="Copy link"
                                            >
                                                📋 Copy
                                            </button>
                                            {link.isActive && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeactivateLink(link.id)}
                                                    className="action-button deactivate"
                                                    title="Deactivate link"
                                                >
                                                    🚫 Deactivate
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
                                                <strong>Usage:</strong> {link.currentUses}/{link.maxUses}
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
                                                <strong>📊 Accounts Created ({link.accountsCreated}):</strong>
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
        </div>
    );
};

export default TempLinks;
