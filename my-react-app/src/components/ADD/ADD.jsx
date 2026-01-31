import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./add.css";
import "./Admin.css";
import AdminNavbar from "./AdminNavbar.jsx";

const ADD = (props) => {
    const navigate = useNavigate();

    // State for add account form
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // State for dashboard data
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // State for UI
    const [activeTab, setActiveTab] = useState('overview'); // overview, users, suspicious
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showLoginHistory, setShowLoginHistory] = useState(false);
    const [loginHistory, setLoginHistory] = useState([]);
    const [deletingUser, setDeletingUser] = useState(null);

    // Fetch dashboard stats
    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const response = await axios.get(`${props.host}/admin/stats`);
            setStats(response.data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoadingStats(false);
        }
    };

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
        fetchStats();
        fetchUsers();

        // Refresh every 60 seconds
        const interval = setInterval(() => {
            fetchStats();
            fetchUsers();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // Handle add account
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter both username and password.");
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
            });

            setMessage(`✅ ${response.data.message}`);
            setUsername("");
            setPassword("");
            fetchUsers(); // Refresh user list
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to add account. Please try again.";
            setError(`❌ ${errorMessage}`);
            setMessage("");
        } finally {
            setLoading(false);
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
            setMessage(`✅ ${response.data.message}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete user. Please try again.";
            setError(`❌ ${errorMessage}`);
        } finally {
            setDeletingUser(null);
        }
    };

    // Handle clear suspicious flag
    const handleClearSuspicious = async (userId) => {
        try {
            await axios.post(`${props.host}/admin/users/${userId}/clear-suspicious`);
            setMessage("✅ Suspicious flags cleared");
            fetchUsers();
        } catch (err) {
            setError("❌ Failed to clear suspicious flags");
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

        // Apply sort
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (sortBy === 'suspicious') {
                aVal = a.suspicious?.hasSuspiciousActivity ? 1 : 0;
                bVal = b.suspicious?.hasSuspiciousActivity ? 1 : 0;
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
    }, [users, searchQuery, sortBy, sortOrder]);

    // Get suspicious users
    const suspiciousUsers = useMemo(() => {
        return users.filter(user => user.suspicious?.hasSuspiciousActivity);
    }, [users]);

    // Simple bar chart component
    const SimpleBarChart = ({ data, labelKey, valueKey, maxBars = 7 }) => {
        if (!data || data.length === 0) return <div className="no-data">No data available</div>;

        const slicedData = data.slice(0, maxBars);
        const maxValue = Math.max(...slicedData.map(d => parseInt(d[valueKey]) || 0));

        return (
            <div className="simple-chart">
                {slicedData.map((item, index) => {
                    const value = parseInt(item[valueKey]) || 0;
                    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    const label = item[labelKey] || 'Unknown';

                    return (
                        <div key={index} className="chart-bar-container">
                            <div className="chart-label">{typeof label === 'string' ? label.slice(0, 10) : label}</div>
                            <div className="chart-bar-wrapper">
                                <div
                                    className="chart-bar"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="chart-value">{value}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="admin-page-wrapper">
            <AdminNavbar />
            <div className="admin-dashboard">
                {/* Tab Navigation */}
                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users ({users.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'suspicious' ? 'active' : ''}`}
                        onClick={() => setActiveTab('suspicious')}
                    >
                        ⚠️ Suspicious ({suspiciousUsers.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add')}
                    >
                        ➕ Add User
                    </button>
                </div>

                {/* Messages */}
                {error && <div className="alert alert-error">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="tab-content">
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card-mini">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.overview?.totalUsers || 0}</span>
                                    <span className="stat-label">Total Users</span>
                                </div>
                            </div>
                            <div className="stat-card-mini">
                                <div className="stat-icon">🟢</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.overview?.activeUsers || 0}</span>
                                    <span className="stat-label">Active (7 days)</span>
                                </div>
                            </div>
                            <div className="stat-card-mini">
                                <div className="stat-icon">🆕</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.overview?.newUsersWeek || 0}</span>
                                    <span className="stat-label">New This Week</span>
                                </div>
                            </div>
                            <div className="stat-card-mini">
                                <div className="stat-icon">📝</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.overview?.totalQuizzes || 0}</span>
                                    <span className="stat-label">Total Quizzes</span>
                                </div>
                            </div>
                            <div className="stat-card-mini">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-info">
                                    <span className="stat-value">{stats?.overview?.avgAccuracy || 0}%</span>
                                    <span className="stat-label">Avg Accuracy</span>
                                </div>
                            </div>
                            <div className="stat-card-mini warning">
                                <div className="stat-icon">⚠️</div>
                                <div className="stat-info">
                                    <span className="stat-value">{suspiciousUsers.length}</span>
                                    <span className="stat-label">Suspicious</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3>📈 Logins (Last 7 Days)</h3>
                                <SimpleBarChart
                                    data={stats?.loginsByDay || []}
                                    labelKey="date"
                                    valueKey="count"
                                />
                            </div>
                            <div className="chart-card">
                                <h3>🏆 Top Users</h3>
                                <SimpleBarChart
                                    data={stats?.topUsers || []}
                                    labelKey="username"
                                    valueKey="quiz_count"
                                    maxBars={5}
                                />
                            </div>
                            <div className="chart-card">
                                <h3>📚 Questions by Topic</h3>
                                <SimpleBarChart
                                    data={stats?.quizzesByTopic || []}
                                    labelKey="topic"
                                    valueKey="count"
                                />
                            </div>
                        </div>

                        {/* Recent Logins */}
                        <div className="recent-section">
                            <h3>🕐 Recent Logins</h3>
                            <div className="recent-logins-list">
                                {stats?.recentLogins?.slice(0, 5).map((login, idx) => (
                                    <div key={idx} className={`recent-login-item ${login.is_suspicious ? 'suspicious' : ''}`}>
                                        <div className="login-user">
                                            <span className="login-avatar">👤</span>
                                            <span className="login-username">{login.username}</span>
                                        </div>
                                        <div className="login-details">
                                            <span className="login-device">{login.device_type} • {login.browser}</span>
                                            <span className="login-ip">{login.ip_address}</span>
                                        </div>
                                        <div className="login-time">
                                            {new Date(login.login_time).toLocaleString()}
                                        </div>
                                        {login.is_suspicious && (
                                            <span className="suspicious-badge">⚠️</span>
                                        )}
                                    </div>
                                ))}
                                {(!stats?.recentLogins || stats.recentLogins.length === 0) && (
                                    <div className="no-data">No recent logins recorded</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="tab-content">
                        {/* Search and Sort Controls */}
                        <div className="users-controls">
                            <div className="search-box">
                                <span className="search-icon">🔍</span>
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
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="id">ID</option>
                                    <option value="username">Username</option>
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
                                onClick={() => { fetchUsers(); fetchStats(); }}
                            >
                                🔄 Refresh
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Status</th>
                                        <th>Activity</th>
                                        <th>Security</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className={user.suspicious?.hasSuspiciousActivity ? 'suspicious-row' : ''}>
                                            <td className="user-cell">
                                                <div className="user-info-compact">
                                                    <span className="user-avatar-small">
                                                        {user.suspicious?.hasSuspiciousActivity ? '⚠️' : '👤'}
                                                    </span>
                                                    <div>
                                                        <div className="user-name">{user.username}</div>
                                                        <div className="user-id">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.isactive ? 'active' : 'inactive'}`}>
                                                    {user.isactive ? '✅ Active' : '❌ Inactive'}
                                                </span>
                                                {user.logged && (
                                                    <span className="online-indicator">🟢 Online</span>
                                                )}
                                            </td>
                                            <td className="activity-cell">
                                                <div className="activity-stats">
                                                    <span>📝 {user.total_quizzes || 0} quizzes</span>
                                                    <span>🎯 {user.avg_accuracy || 0}% accuracy</span>
                                                    <span>📅 {user.logged_date ? new Date(user.logged_date).toLocaleDateString() : 'Never'}</span>
                                                </div>
                                            </td>
                                            <td className="security-cell">
                                                {user.suspicious?.hasSuspiciousActivity ? (
                                                    <div className="security-warning">
                                                        <span className="warning-badge">⚠️ Suspicious</span>
                                                        <div className="security-details">
                                                            <span>🌐 {user.suspicious.uniqueIPs} IPs</span>
                                                            <span>📱 {user.suspicious.uniqueDevices} devices</span>
                                                        </div>
                                                        <div className="suspicious-reasons">
                                                            {user.suspicious.suspiciousReasons}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="security-ok">✅ OK</span>
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
                                                    📋
                                                </button>
                                                {user.suspicious?.hasSuspiciousActivity && (
                                                    <button
                                                        className="action-btn clear-btn"
                                                        onClick={() => handleClearSuspicious(user.id)}
                                                        title="Clear Suspicious Flag"
                                                    >
                                                        ✓
                                                    </button>
                                                )}
                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                    disabled={deletingUser === user.id}
                                                    title="Delete User"
                                                >
                                                    {deletingUser === user.id ? '⏳' : '🗑️'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
                            <h2>⚠️ Suspicious Activity Detection</h2>
                            <p className="suspicious-info">
                                Users are flagged when they show signs of account sharing: multiple IPs in 24h,
                                many different devices, or rapid location changes.
                            </p>
                        </div>

                        {suspiciousUsers.length === 0 ? (
                            <div className="no-suspicious">
                                <span className="no-suspicious-icon">✅</span>
                                <h3>No Suspicious Activity Detected</h3>
                                <p>All users appear to be using their accounts normally.</p>
                            </div>
                        ) : (
                            <div className="suspicious-list">
                                {suspiciousUsers.map((user) => (
                                    <div key={user.id} className="suspicious-card">
                                        <div className="suspicious-card-header">
                                            <div className="suspicious-user">
                                                <span className="warning-icon">⚠️</span>
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
                                                    📋 View History
                                                </button>
                                                <button
                                                    className="btn-success"
                                                    onClick={() => handleClearSuspicious(user.id)}
                                                >
                                                    ✓ Clear Flag
                                                </button>
                                                <button
                                                    className="btn-danger"
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                >
                                                    🗑️ Delete
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
                            <h2>➕ Add New User Account</h2>
                            <form onSubmit={handleSubmit} className="add-user-form">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                                        className="form-input"
                                    />
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
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? "⏳ Creating..." : "➕ Create Account"}
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
                                <h3>📋 Login History: {selectedUser.username}</h3>
                                <button className="modal-close" onClick={() => setShowLoginHistory(false)}>✕</button>
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
                                                    <span className="history-ip">🌐 {login.ip_address}</span>
                                                    <span className="history-device">
                                                        {login.device_type === 'Mobile' ? '📱' : '💻'} {login.device_type}
                                                    </span>
                                                    <span className="history-browser">🌍 {login.browser} / {login.os}</span>
                                                </div>
                                                {login.is_suspicious && (
                                                    <div className="history-warning">
                                                        ⚠️ {login.suspicious_reason}
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
            </div>
        </div>
    );
};

export default ADD;