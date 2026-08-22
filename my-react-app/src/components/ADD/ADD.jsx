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
    // them "Free" would read as "not paying yet" rather than "granted".
    // The grant is TIMED now, so it lapses like any other and an expired one
    // must stop reading as if it still has access.
    if (user.is_admin_created) {
        if (!expiry) {
            return { key: 'exempt', label: 'Admin — no expiry', cls: 'legacy', detail: 'Legacy grant, never charged' };
        }
        return expired
            ? { key: 'expired', label: 'Admin — expired', cls: 'expired', detail: `Ended ${expiry.toLocaleDateString()}` }
            : { key: 'exempt', label: 'Admin grant', cls: 'legacy', detail: `Until ${expiry.toLocaleDateString()}` };
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
 * Did we create this account, or did the student? `account_type` is the only
 * marker that answers that. Both creation paths — the admin form and temp-link
 * invites — set it to 'admin_created'.
 *
 * Deliberately NOT `is_admin_created`: that flag means "granted by an admin",
 * which is a fact about the SUBSCRIPTION, not about who opened the account. A
 * student who signed up themselves and was later comped from the panel carries
 * the flag, and reading it here would relabel their origin as Admin-created —
 * losing the one column that says where they actually came from. The grant is
 * already shown, in the subscription column, by subscriptionInfo() above.
 */
const adminMade = (user) => user.account_type === 'admin_created';

// English labels for payment plan ids — admin is pinned English/LTR, mirrors
// the ar/en copy in src/i18n/copy/account.js (kept separate since that file
// is student-facing and this is a read-only admin display).
const PLAN_LABELS = {
    monthly: 'Monthly',
    four_month: '4-month',
    annual: 'Annual',
    group_3: 'Group (3 seats)',
    group_5: 'Group (5 seats)',
};
const planLabel = (planId) => (planId ? (PLAN_LABELS[planId] || planId) : null);

// Mirrors DEFAULT_INVITE_MONTHS / MAX_INVITE_MONTHS in backend/app.js. The
// server is the authority — it clamps whatever arrives — these just drive the
// picker and keep the UI from offering a value the server would silently
// rewrite.
const DEFAULT_GRANT_MONTHS = 12;
const MAX_GRANT_MONTHS = 120;
// 4 is here because four_month is a plan we actually sell — the commonest
// term to comp is the one people would otherwise have bought.
const GRANT_PRESETS = [1, 3, 4, 6, 12];

/** "1 year" reads better than "12 months" for the commonest case. */
const monthsLabel = (m) => {
    if (m === 12) return '1 year';
    if (m % 12 === 0) return `${m / 12} years`;
    return `${m} month${m === 1 ? '' : 's'}`;
};

// `tone` picks the badge colour so the summary tiles and the row badges use one
// palette — a "Paid" tile in a different green from the "Paid" badge under it
// reads as two different things.
const PLAN_FILTERS = [
    { value: 'all', label: 'All plans', tone: 'free' },
    { value: 'paid', label: 'Paid', tone: 'paid' },
    { value: 'exempt', label: 'Admin grant (active)', tone: 'legacy' },
    { value: 'free', label: 'Free — questions left', tone: 'free' },
    { value: 'spent', label: 'Free — used up', tone: 'expired' },
    { value: 'expired', label: 'Expired / refunded', tone: 'expired' },
    { value: 'legacy', label: 'Legacy', tone: 'legacy' },
];

/**
 * One predicate, used by BOTH the dropdown filter and the summary tiles above
 * the table. Defined once on purpose: a tile that says "4 Paid" and a filter
 * that then lists 9 rows is worse than having neither.
 */
const matchesPlanFilter = (user, filterValue) => {
    if (filterValue === 'all') return true;
    const { key } = subscriptionInfo(user);
    // 'expired' is the one filter covering two states — a lapsed subscription
    // and a reversed one are the same thing to an admin scanning the list.
    if (filterValue === 'expired') return key === 'expired' || key === 'refunded';
    return key === filterValue;
};

const ADD = (props) => {
    // State for add account form
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // Study track for the account being created, and for a user being moved
    // between tracks — a change only an admin can make.
    const [newUserTrack, setNewUserTrack] = useState(MEDICAL);
    // How long the new account keeps access. There is no "forever" option:
    // the server clamps this to 1..120 months and falls back to 12, so an
    // account created here always carries a real expiry date.
    const [newUserMonths, setNewUserMonths] = useState(DEFAULT_GRANT_MONTHS);
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
    // Granting access to an EXISTING account (the "upgrade" flow). Null target
    // means the modal is closed — one piece of state, not a separate boolean
    // that can disagree with it.
    const [grantTarget, setGrantTarget] = useState(null);
    const [grantMonths, setGrantMonths] = useState(4);
    const [grantReason, setGrantReason] = useState("");
    const [grantSaving, setGrantSaving] = useState(false);

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
                durationMonths: newUserMonths,
            });

            setMessage(`${response.data.message}`);
            setUsername("");
            setPassword("");
            setNewUserMonths(DEFAULT_GRANT_MONTHS);
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

    /**
     * Open the upgrade modal for one account. Defaults the term to 4 months —
     * the plan most people would otherwise have bought — and clears whatever
     * reason was typed for the previous user, which must never carry over into
     * a different account's audit record.
     */
    const openGrant = (user) => {
        setGrantTarget(user);
        setGrantMonths(4);
        setGrantReason("");
        setError("");
        setMessage("");
    };

    /**
     * Give an existing account paid access without a payment.
     *
     * The server is the authority on the resulting date — it recomputes the
     * expiry under a row lock — so the success message quotes what came BACK,
     * never the date this component previewed. The two differ whenever a real
     * payment lands in the same moment, and the admin needs to see the one that
     * actually got written.
     */
    const handleGrantAccess = async () => {
        if (!grantTarget) return;
        setGrantSaving(true);
        setError("");
        try {
            const { data } = await axios.post(
                `${props.host}/admin/users/${grantTarget.id}/grant-subscription`,
                { months: grantMonths, reason: grantReason.trim() || undefined }
            );
            const g = data.grant;
            const until = new Date(g.newExpiry).toLocaleDateString();
            setMessage(
                g.wasActive
                    ? `Added ${monthsLabel(g.months)} to ${g.email} — now paid until ${until}.`
                    : `${g.email} now has access until ${until} (${monthsLabel(g.months)}).`
            );
            setGrantTarget(null);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to grant access.');
        } finally {
            setGrantSaving(false);
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
            filtered = filtered.filter((user) => matchesPlanFilter(user, planFilter));
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

    /**
     * How many accounts are in each access state — the answer to "how many
     * people are ACTUALLY paying", which the row badges alone cannot give you
     * without counting 200 rows by eye.
     *
     * Paid and Admin grant are separate tiles because they are separate facts:
     * a granted account carries subscription_status='active' exactly like a
     * paid one, so anything that treats "active" as "paying" over-reports
     * revenue. (The dashboard's own subscriber count had this bug.)
     */
    const accessMix = useMemo(() => (
        PLAN_FILTERS
            .filter((f) => f.value !== 'all')
            .map((f) => ({ ...f, count: users.filter((u) => matchesPlanFilter(u, f.value)).length }))
    ), [users]);

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
                        {/* Where access actually comes from. Paid and Admin grant
                            look identical in the accounts table — both are
                            subscription_status='active' with an expiry — so they
                            are split here, and each tile doubles as the filter
                            for its own cohort. */}
                        <div className="access-mix">
                            {accessMix.map((tile) => (
                                <button
                                    key={tile.value}
                                    type="button"
                                    className={`access-tile access-tile--${tile.tone}${planFilter === tile.value ? ' is-active' : ''}`}
                                    onClick={() => setPlanFilter(planFilter === tile.value ? 'all' : tile.value)}
                                    title={`Show only: ${tile.label}`}
                                >
                                    <span className="access-tile-count">{tile.count}</span>
                                    <span className="access-tile-label">{tile.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="access-mix-note">
                            <Icon name="info" size={13} />{' '}
                            <strong>Paid</strong> is money received. <strong>Admin grant</strong> is access
                            given from this panel or a temp link — it never counts as revenue.
                        </p>

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
                                        <th>Plan</th>
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
                                            <td className="plan-cell">
                                                {planLabel(user.plan_id)
                                                    ? <span className="plan-badge plan-badge--paid">{planLabel(user.plan_id)}</span>
                                                    : <span className="plan-detail">Never purchased</span>}
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
                                                    className="action-btn grant-btn"
                                                    onClick={() => openGrant(user)}
                                                    title="Grant / extend paid access"
                                                >
                                                    <Icon name="shield-check" size={16} />
                                                </button>
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
                                Accounts created here skip the paywall for the period you set below —
                                full access until it ends, then they drop to the free tier like anyone
                                else. Same as temp-link invites. Paying students should sign up
                                themselves.
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
                                <div className="form-group">
                                    <label htmlFor="newUserMonths">Access Duration</label>
                                    <div className="grant-months-row">
                                        {GRANT_PRESETS.map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                className={`grant-preset${newUserMonths === m ? ' is-selected' : ''}`}
                                                onClick={() => setNewUserMonths(m)}
                                            >
                                                {m === 12 ? '1 year' : `${m} mo`}
                                            </button>
                                        ))}
                                        {/* Input and unit are one flex item, not two:
                                            as siblings the row could wrap between
                                            them, stranding "months" on its own line
                                            under the number it labels. */}
                                        <span className="grant-months-field">
                                            <input
                                                id="newUserMonths"
                                                type="number"
                                                min="1"
                                                max={MAX_GRANT_MONTHS}
                                                value={newUserMonths}
                                                onChange={(e) => setNewUserMonths(
                                                    Math.max(1, Math.min(MAX_GRANT_MONTHS, parseInt(e.target.value, 10) || 1))
                                                )}
                                                className="form-input grant-months-input"
                                                aria-label="Access duration in months"
                                            />
                                            <span className="grant-months-unit">months</span>
                                        </span>
                                    </div>
                                    <small className="form-hint">
                                        Counted from today. No account is granted access forever —
                                        this one expires {monthsLabel(newUserMonths)} from now.
                                    </small>
                                </div>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? <><Icon name="hourglass" size={14} /> Creating...</> : <><Icon name="plus" size={14} /> Create Account</>}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Grant / extend access ("upgrade") */}
                {grantTarget && (() => {
                    const current = subscriptionInfo(grantTarget);
                    const currentExpiry = grantTarget.subscription_expiry_date
                        ? new Date(grantTarget.subscription_expiry_date)
                        : null;
                    // Mirrors computeNewExpiry() on the server: a term stacks on
                    // top of a LIVE subscription and starts from today for a
                    // lapsed or free one. Shown before confirming because
                    // "4 months" means two different dates in those two cases,
                    // and picking the wrong one is invisible afterwards.
                    const stillLive = currentExpiry && currentExpiry.getTime() > Date.now();
                    const preview = new Date(stillLive ? currentExpiry : new Date());
                    preview.setMonth(preview.getMonth() + grantMonths);
                    return (
                        <div className="modal-overlay" onClick={() => !grantSaving && setGrantTarget(null)}>
                            <div className="modal-content grant-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3><Icon name="shield-check" size={18} /> Grant access</h3>
                                    <button className="modal-close" onClick={() => setGrantTarget(null)} disabled={grantSaving}>
                                        <Icon name="x" size={16} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="grant-account">
                                        <div className="grant-account-name">{grantTarget.email || grantTarget.username}</div>
                                        <div className="grant-account-meta">
                                            <span>ID {grantTarget.id}</span>
                                            <span className={`plan-badge plan-badge--${current.cls}`}>{current.label}</span>
                                            <span className="plan-detail">{current.detail}</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="grantMonths">How long</label>
                                        <div className="grant-months-row">
                                            {GRANT_PRESETS.map((m) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    className={`grant-preset${grantMonths === m ? ' is-selected' : ''}`}
                                                    onClick={() => setGrantMonths(m)}
                                                >
                                                    {m === 12 ? '1 year' : `${m} mo`}
                                                </button>
                                            ))}
                                            <span className="grant-months-field">
                                                <input
                                                    id="grantMonths"
                                                    type="number"
                                                    min="1"
                                                    max={MAX_GRANT_MONTHS}
                                                    value={grantMonths}
                                                    onChange={(e) => setGrantMonths(
                                                        Math.max(1, Math.min(MAX_GRANT_MONTHS, parseInt(e.target.value, 10) || 1))
                                                    )}
                                                    className="form-input grant-months-input"
                                                    aria-label="Months of access to grant"
                                                />
                                                <span className="grant-months-unit">months</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grant-preview">
                                        <div className="grant-preview-row">
                                            <span>Access ends</span>
                                            <strong>
                                                {currentExpiry ? currentExpiry.toLocaleDateString() : 'no access'}
                                                {' \u2192 '}
                                                <span className="grant-preview-new">{preview.toLocaleDateString()}</span>
                                            </strong>
                                        </div>
                                        <p className="grant-preview-note">
                                            {stillLive
                                                ? `Stacks: ${monthsLabel(grantMonths)} is ADDED to the time they already have.`
                                                : 'Starts today - they have no live access right now.'}
                                        </p>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="grantReason">Reason <span className="grant-optional">(optional)</span></label>
                                        <input
                                            id="grantReason"
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. support case, giveaway, bank transfer received"
                                            value={grantReason}
                                            onChange={(e) => setGrantReason(e.target.value)}
                                            maxLength={200}
                                        />
                                        <small className="form-hint">
                                            Stored on the audit record. Worth writing when the money arrived
                                            some other way - it is the only note explaining why this account
                                            has access with no payment behind it.
                                        </small>
                                    </div>

                                    <p className="grant-warning">
                                        <Icon name="info" size={13} />{' '}
                                        This is <strong>not</strong> a payment. It is recorded as an admin grant,
                                        stays out of every revenue figure, and this account will show as{' '}
                                        <strong>Admin grant</strong> - not Paid.
                                    </p>

                                    <div className="grant-actions">
                                        <button
                                            className="btn-secondary"
                                            onClick={() => setGrantTarget(null)}
                                            disabled={grantSaving}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn-primary"
                                            onClick={handleGrantAccess}
                                            disabled={grantSaving}
                                        >
                                            {grantSaving
                                                ? <><Icon name="hourglass" size={14} /> Granting...</>
                                                : <><Icon name="shield-check" size={14} /> Grant {monthsLabel(grantMonths)}</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

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