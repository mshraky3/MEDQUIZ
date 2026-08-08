import React, { useState, useEffect, useMemo } from "react";
import Icon from '../common/Icon.jsx';
import axios from "../../utils/adminApi.js";
import "./add.css";
import "./Admin.css";
import AdminLayout from "./AdminLayout.jsx";
import { TRACKS, TRACK_KEYS, MEDICAL, normalizeTrack } from '../../utils/tracks.js';

/**
 * Collapse the subscription columns into one thing an admin can read at a
 * glance: is this account paying, on trial, free, or grandfathered — and is
 * that still valid today? `subscription_status` alone is not enough, since an
 * 'active' row whose expiry has passed is no longer paid.
 */
// Mirrors paymentService.FREE_QUESTION_ALLOWANCE. Kept in sync manually since
// this is a read-only admin display, not a gate.
const FREE_QUESTION_ALLOWANCE = 40;

const subscriptionInfo = (user) => {
    const expiry = user.subscription_expiry_date ? new Date(user.subscription_expiry_date) : null;
    const expired = expiry ? expiry.getTime() <= Date.now() : false;
    const status = user.subscription_status || 'free';
    const used = Number(user.free_questions_used) || 0;
    const left = Math.max(0, FREE_QUESTION_ALLOWANCE - used);

    // Checked first, mirroring checkSubscriptionAccess: this flag short-circuits
    // the paywall, so subscription_status is meaningless on these rows. Calling
    // them "Free" would read as "not paying yet" rather than "never will".
    if (user.is_admin_created) {
        return { key: 'exempt', label: 'Free forever', cls: 'legacy', detail: 'Admin-created — never charged' };
    }
    if (user.grandfathered_at || status === 'grandfathered') {
        return { key: 'legacy', label: 'Legacy', cls: 'legacy', detail: 'Free lifetime access' };
    }
    if (status === 'refunded') {
        return { key: 'refunded', label: 'Refunded', cls: 'expired', detail: 'Subscription reversed' };
    }
    if (status === 'active') {
        return expired
            ? { key: 'expired', label: 'Expired', cls: 'expired', detail: `Ended ${expiry.toLocaleDateString()}` }
            : { key: 'paid', label: 'Paid', cls: 'paid', detail: expiry ? `Until ${expiry.toLocaleDateString()}` : 'No expiry set' };
    }
    // Free tier. Split by whether the allowance is spent: an account with 0 left
    // is the one worth a nudge, and an account that never answered a question is
    // a different problem entirely.
    if (left <= 0) {
        return { key: 'spent', label: 'Free — used up', cls: 'expired', detail: `Spent all ${FREE_QUESTION_ALLOWANCE} free questions` };
    }
    return {
        key: 'free',
        label: 'Free',
        cls: used > 0 ? 'trial' : 'free',
        detail: used > 0 ? `${left} of ${FREE_QUESTION_ALLOWANCE} free questions left` : 'Has not started yet',
    };
};

/**
 * Did we create this account, or did the student? Two independent markers:
 * temp-link invites set `is_admin_created` (which also exempts them from the
 * paywall), the admin form sets only `account_type` (no exemption).
 */
const adminMade = (user) => Boolean(user.is_admin_created) || user.account_type === 'admin_created';

const PLAN_FILTERS = [
    { value: 'all', label: 'All plans' },
    { value: 'paid', label: 'Paid' },
    { value: 'free', label: 'Free — questions left' },
    { value: 'spent', label: 'Free — used up' },
    { value: 'expired', label: 'Expired / refunded' },
    { value: 'exempt', label: 'Free forever (admin)' },
    { value: 'legacy', label: 'Legacy' },
];

const ADD = (props) => {
    // State for add account form
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // Study track for the account being created, and for a user being moved
    // between tracks — a change only an admin can make.
    const [newUserTrack, setNewUserTrack] = useState(MEDICAL);
    const [changingTrack, setChangingTrack] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // State for dashboard data
    const [users, setUsers] = useState([]);
    const [, setLoadingUsers] = useState(true);

    // State for UI
    const [activeTab, setActiveTab] = useState('users'); // users, suspicious, add
    const [searchQuery, setSearchQuery] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showLoginHistory, setShowLoginHistory] = useState(false);
    const [loginHistory, setLoginHistory] = useState([]);
    const [deletingUser, setDeletingUser] = useState(null);

    // Fetch users with activity data
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await axios.get(`${props.host}/admin/users`);
            setUsers(response.data.users);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            // Fallback to old endpoint
            try {
                const fallbackResponse = await axios.get(`${props.host}/get_all_users`);
                setUsers(fallbackResponse.data.users);
            } catch (fallbackErr) {
                console.error("Fallback also failed:", fallbackErr);
            }
        } finally {
            setLoadingUsers(false);
        }
    };

    // Fetch login history for a user
    const fetchLoginHistory = async (userId) => {
        try {
            const response = await axios.get(`${props.host}/admin/users/${userId}/login-history`);
            setLoginHistory(response.data.loginHistory || []);
        } catch (err) {
            console.error("Failed to fetch login history:", err);
            setLoginHistory([]);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchUsers();

        // Refresh every 60 seconds
        const interval = setInterval(fetchUsers, 60000);

        return () => clearInterval(interval);
    }, []);

    // Handle add account
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter both email and password.");
            setMessage("");
            return;
        }

        // The server enforces this too, but catching it here saves a round trip
        // and explains why: an account whose username is not an email can
        // never sign in.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
            setError("Enter a valid email address — sign-in is by email, so a non-email account could not log in.");
            setMessage("");
            return;
        }

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(`${props.host}/add_account`, {
                username,
                password,
                track: newUserTrack,
            });

            setMessage(`${response.data.message}`);
            setUsername("");
            setPassword("");
            fetchUsers(); // Refresh user list
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to add account. Please try again.";
            setError(`${errorMessage}`);
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Move an account to the other study track. Students cannot do this
     * themselves — one subscription must not unlock both banks — so this is
     * the only path between tracks. History is preserved either way; the
     * dashboard simply starts reporting against the new bank.
     */
    const handleChangeTrack = async (user) => {
        const current = normalizeTrack(user.track);
        const next = TRACK_KEYS.find((k) => k !== current) || current;
        if (!window.confirm(
            `Move "${user.username}" from ${TRACKS[current].label.en} to ${TRACKS[next].label.en}?\n\n`
            + `They will immediately see the ${TRACKS[next].label.en} question bank and summaries. `
            + `Their existing history is kept but stops being counted, since it belongs to the other bank.`
        )) return;

        setChangingTrack(user.id);
        setError("");
        try {
            await axios.post(`${props.host}/admin/users/${user.id}/track`, { track: next });
            setMessage(`Moved ${user.username} to the ${TRACKS[next].label.en} track.`);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change track.');
        } finally {
            setChangingTrack(null);
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"? This will permanently delete all their data including quiz history, analysis, and streaks. This action cannot be undone.`)) {
            return;
        }

        setDeletingUser(userId);
        setError("");
        setMessage("");

        try {
            const response = await axios.delete(`${props.host}/users/${userId}`);
            setMessage(`${response.data.message}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete user. Please try again.";
            setError(`${errorMessage}`);
        } finally {
            setDeletingUser(null);
        }
    };

    // Handle clear suspicious flag
    const handleClearSuspicious = async (userId) => {
        try {
            await axios.post(`${props.host}/admin/users/${userId}/clear-suspicious`);
            setMessage("Suspicious flags cleared");
            fetchUsers();
        } catch (err) {
            setError("Failed to clear suspicious flags");
        }
    };

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        let filtered = [...users];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.id?.toString().includes(query)
            );
        }

        // Narrow to one commercial cohort — "who is actually paying" is the
        // question this table gets asked most.
        if (planFilter !== 'all') {
            filtered = filtered.filter((user) => {
                const { key } = subscriptionInfo(user);
                if (planFilter === 'expired') return key === 'expired' || key === 'refunded';
                return key === planFilter;
            });
        }

        // Apply sort
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'suspicious') {
                aVal = a.suspicious?.hasSuspiciousActivity ? 1 : 0;
                bVal = b.suspicious?.hasSuspiciousActivity ? 1 : 0;
            }

            if (sortBy === 'created_at') {
                aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
                bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
            }

            if (sortBy === 'subscription_status') {
                aVal = subscriptionInfo(a).label;
                bVal = subscriptionInfo(b).label;
            }

            if (typeof aVal === 'string') {
                aVal = aVal?.toLowerCase() || '';
                bVal = bVal?.toLowerCase() || '';
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            }
            return aVal < bVal ? 1 : -1;
        });

        return filtered;
    }, [users, searchQuery, planFilter, sortBy, sortOrder]);

    // Get suspicious users
    const suspiciousUsers = useMemo(() => {
        return users.filter(user => user.suspicious?.hasSuspiciousActivity);
    }, [users]);

    return (
        <AdminLayout containerClassName="admin-dashboard">
                {/* Tab Navigation */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Icon name="users" size={16} /> Users ({users.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'suspicious' ? 'active' : ''}`}
                        onClick={() => setActiveTab('suspicious')}
                    >
                        <Icon name="alert-triangle" size={16} /> Suspicious ({suspiciousUsers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        <Icon name="plus" size={16} /> Add User
                    </button>
                </div>

                {/* Messages */}
                {error && <div className="alert alert-error">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="tab-content">
                        {/* Search and Sort Controls */}
                        <div className="users-controls">
                            <div className="search-box">
                                <span className="search-icon"><Icon name="search" size={16} /></span>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <div className="sort-controls">
                                <select
                                    value={planFilter}
                                    onChange={(e) => setPlanFilter(e.target.value)}
                                    className="sort-select"
                                    title="Filter by subscription"
                                >
                                    {PLAN_FILTERS.map((f) => (
                                        <option key={f.value} value={f.value}>{f.label}</option>
                                    ))}
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="id">ID</option>
                                    <option value="username">Username</option>
                                    <option value="created_at">Created</option>
                                    <option value="subscription_status">Subscription</option>
                                    <option value="total_quizzes">Quizzes</option>
                                    <option value="avg_accuracy">Accuracy</option>
                                    <option value="logged_date">Last Login</option>
                                    <option value="suspicious">Suspicious</option>
                                </select>
                                <button
                                    className="sort-order-btn"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    {sortOrder === 'asc' ? '↑' : '↓'}
                                </button>
                            </div>
                            <button
                                className="refresh-btn"
                                onClick={fetchUsers}
                            >
                                <Icon name="refresh" size={16} /> Refresh
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Subscription</th>
                                        <th>Origin</th>
                                        <th>Status</th>
                                        <th>Activity</th>
                                        <th>Security</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const plan = subscriptionInfo(user);
                                        return (
                                        <tr key={user.id} className={user.suspicious?.hasSuspiciousActivity ? 'suspicious-row' : ''}>
                                            <td className="user-cell">
                                                <div className="user-info-compact">
                                                    <span className="user-avatar-small">
                                                        {user.suspicious?.hasSuspiciousActivity ? <Icon name="alert-triangle" size={16} /> : <Icon name="user" size={16} />}
                                                    </span>
                                                    <div>
                                                        <div className="user-name">{user.username}</div>
                                                        {/* Signups use the email as the username — only worth a
                                                            second line when it actually differs. */}
                                                        {user.email && user.email !== user.username && (
                                                            <div className="user-email">{user.email}</div>
                                                        )}
                                                        <div className="user-id">
                                                            ID: {user.id}
                                                            <span className={`track-chip track-chip--${normalizeTrack(user.track)}`}>
                                                                {TRACKS[normalizeTrack(user.track)].label.en}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="plan-cell">
                                                <span className={`plan-badge plan-badge--${plan.cls}`}>{plan.label}</span>
                                                <div className="plan-detail">{plan.detail}</div>
                                            </td>
                                            <td className="origin-cell">
                                                <span className={`origin-badge ${adminMade(user) ? 'admin' : 'self'}`}>
                                                    <Icon name={adminMade(user) ? 'shield-check' : 'user'} size={13} />
                                                    {adminMade(user) ? 'Admin-created' : 'Self signup'}
                                                </span>
                                                <div className="plan-detail">
                                                    <Icon name="calendar" size={13} />{' '}
                                                    {user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown'}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.isactive ? 'active' : 'inactive'}`}>
                                                    {user.isactive ? <><Icon name="check-circle" size={14} /> Active</> : <><Icon name="x-circle" size={14} /> Inactive</>}
                                                </span>
                                                {user.logged && (
                                                    <span className="online-indicator"><Icon name="circle" size={16} /> Online</span>
                                                )}
                                            </td>
                                            <td className="activity-cell">
                                                <div className="activity-stats">
                                                    <span><Icon name="pen" size={16} /> {user.total_quizzes || 0} quizzes</span>
                                                    <span><Icon name="target" size={16} /> {user.avg_accuracy || 0}% accuracy</span>
                                                    <span><Icon name="calendar" size={16} /> {user.logged_date ? new Date(user.logged_date).toLocaleDateString() : 'Never'}</span>
                                                </div>
                                            </td>
                                            <td className="security-cell">
                                                {user.suspicious?.hasSuspiciousActivity ? (
                                                    <div className="security-warning">
                                                        <span className="warning-badge"><Icon name="alert-triangle" size={16} /> Suspicious</span>
                                                        <div className="security-details">
                                                            <span><Icon name="globe" size={16} /> {user.suspicious.uniqueIPs} IPs</span>
                                                            <span><Icon name="phone" size={16} /> {user.suspicious.uniqueDevices} devices</span>
                                                        </div>
                                                        <div className="suspicious-reasons">
                                                            {user.suspicious.suspiciousReasons}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="security-ok"><Icon name="check-circle" size={16} /> OK</span>
                                                )}
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowLoginHistory(true);
                                                        fetchLoginHistory(user.id);
                                                    }}
                                                    title="View Login History"
                                                >
                                                    <Icon name="clipboard" size={16} />
                                                </button>
                                                {user.suspicious?.hasSuspiciousActivity && (
                                                    <button
                                                        className="action-btn clear-btn"
                                                        onClick={() => handleClearSuspicious(user.id)}
                                                        title="Clear Suspicious Flag"
                                                    >
                                                        <Icon name="check" size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn track-btn"
                                                    onClick={() => handleChangeTrack(user)}
                                                    disabled={changingTrack === user.id}
                                                    title="Change study track"
                                                >
                                                    <Icon name="refresh" size={16} />
                                                </button>
                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                    disabled={deletingUser === user.id}
                                                    title="Delete User"
                                                >
                                                    {deletingUser === user.id ? <Icon name="hourglass" size={16} /> : <Icon name="trash" size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="no-data">No users found</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Suspicious Tab */}
                {activeTab === 'suspicious' && (
                    <div className="tab-content">
                        <div className="suspicious-header">
                            <h2><Icon name="alert-triangle" size={16} /> Suspicious Activity Detection</h2>
                            <p className="suspicious-info">
                                Users are flagged when they show signs of account sharing: multiple IPs in 24h,
                                many different devices, or rapid location changes.
                            </p>
                        </div>

                        {suspiciousUsers.length === 0 ? (
                            <div className="no-suspicious">
                                <span className="no-suspicious-icon"><Icon name="check-circle" size={16} /></span>
                                <h3>No Suspicious Activity Detected</h3>
                                <p>All users appear to be using their accounts normally.</p>
                            </div>
                        ) : (
                            <div className="suspicious-list">
                                {suspiciousUsers.map((user) => (
                                    <div key={user.id} className="suspicious-card">
                                        <div className="suspicious-card-header">
                                            <div className="suspicious-user">
                                                <span className="warning-icon"><Icon name="alert-triangle" size={16} /></span>
                                                <div>
                                                    <h4>{user.username}</h4>
                                                    <span className="user-id-small">ID: {user.id}</span>
                                                </div>
                                            </div>
                                            <div className="suspicious-actions">
                                                <button
                                                    className="btn-secondary"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowLoginHistory(true);
                                                        fetchLoginHistory(user.id);
                                                    }}
                                                >
                                                    <Icon name="clipboard" size={16} /> View History
                                                </button>
                                                <button
                                                    className="btn-success"
                                                    onClick={() => handleClearSuspicious(user.id)}
                                                >
                                                    <Icon name="check" size={16} /> Clear Flag
                                                </button>
                                                <button
                                                    className="btn-danger"
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                >
                                                    <Icon name="trash" size={16} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div className="suspicious-card-body">
                                            <div className="suspicious-stats">
                                                <div className="suspicious-stat">
                                                    <span className="stat-number">{user.suspicious.uniqueIPs}</span>
                                                    <span className="stat-label">Unique IPs (30d)</span>
                                                </div>
                                                <div className="suspicious-stat">
                                                    <span className="stat-number">{user.suspicious.uniqueDevices}</span>
                                                    <span className="stat-label">Unique Devices</span>
                                                </div>
                                                <div className="suspicious-stat">
                                                    <span className="stat-number">{user.total_quizzes || 0}</span>
                                                    <span className="stat-label">Total Quizzes</span>
                                                </div>
                                            </div>
                                            <div className="suspicious-reason-box">
                                                <strong>Detection Reasons:</strong>
                                                <p>{user.suspicious.suspiciousReasons || 'Multiple indicators detected'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Add User Tab */}
                {activeTab === 'add' && (
                    <div className="tab-content">
                        <div className="add-user-section">
                            <h2><Icon name="plus" size={16} /> Add New User Account</h2>
                            <p className="add-user-notice">
                                <Icon name="shield-check" size={15} />
                                Accounts created here skip the paywall permanently — full access,
                                free forever, no expiry. Same as temp-link invites. Paying students
                                should sign up themselves.
                            </p>
                            <form onSubmit={handleSubmit} className="add-user-form">
                                <div className="form-group">
                                    <label htmlFor="username">Email</label>
                                    <input
                                        id="username"
                                        type="email"
                                        placeholder="student@example.com"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                                        className="form-input"
                                    />
                                    <small className="form-hint">
                                        Sign-in is by email, so this must be a real email address —
                                        it becomes both the username and the login.
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newUserTrack">Study Track</label>
                                    <select
                                        id="newUserTrack"
                                        value={newUserTrack}
                                        onChange={(e) => setNewUserTrack(e.target.value)}
                                        className="form-input"
                                    >
                                        {TRACK_KEYS.map((key) => (
                                            <option key={key} value={key}>
                                                {TRACKS[key].label.en}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="form-hint">
                                        Decides which question bank and summaries this account sees.
                                    </small>
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? <><Icon name="hourglass" size={14} /> Creating...</> : <><Icon name="plus" size={14} /> Create Account</>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Login History Modal */}
                {showLoginHistory && selectedUser && (
                    <div className="modal-overlay" onClick={() => setShowLoginHistory(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3><Icon name="clipboard" size={16} /> Login History: {selectedUser.username}</h3>
                                <button className="modal-close" onClick={() => setShowLoginHistory(false)}><Icon name="x" size={16} /></button>
                            </div>
                            <div className="modal-body">
                                {loginHistory.length === 0 ? (
                                    <div className="no-data">No login history available</div>
                                ) : (
                                    <div className="login-history-list">
                                        {loginHistory.map((login, idx) => (
                                            <div key={idx} className={`history-item ${login.is_suspicious ? 'suspicious' : ''}`}>
                                                <div className="history-time">
                                                    {new Date(login.login_time).toLocaleString()}
                                                </div>
                                                <div className="history-details">
                                                    <span className="history-ip"><Icon name="globe" size={16} /> {login.ip_address}</span>
                                                    <span className="history-device">
                                                        {login.device_type === 'Mobile' ? <Icon name="phone" size={14} /> : <Icon name="monitor" size={14} />} {login.device_type}
                                                    </span>
                                                    <span className="history-browser"><Icon name="globe" size={16} /> {login.browser} / {login.os}</span>
                                                </div>
                                                {login.is_suspicious && (
                                                    <div className="history-warning">
                                                        <Icon name="alert-triangle" size={16} /> {login.suspicious_reason}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </AdminLayout>
    );
};

export default ADD;