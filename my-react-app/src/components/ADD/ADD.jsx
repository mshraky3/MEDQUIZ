import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./add.css";
import AdminNavbar from "./AdminNavbar.jsx";

const ADD = (props) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Refresh user data periodically to update logged-in status
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            if (showUsers) {
                handleShowUsers();
            }
        }, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(refreshInterval);
    }, [showUsers]);

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
            setUsername(""); // Clear input after success
            setPassword("");
            // Refresh user list if it's currently shown
            if (showUsers) {
                handleShowUsers();
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to add account. Please try again.";
            setError(`❌ ${errorMessage}`);
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    const handleShowUsers = async () => {
        if (showUsers) {
            // If already showing, just hide
            setShowUsers(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await axios.get(`${props.host}/get_all_users`);
            setUsers(response.data.users);
            setShowUsers(true);
            setError("");
        } catch (err) {
            setError("❌ Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
            // Remove the deleted user from the local state
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete user. Please try again.";
            setError(`❌ ${errorMessage}`);
        } finally {
            setDeletingUser(null);
        }
    };

    return (
        <div className="admin-page-wrapper">
            <AdminNavbar />
            <div className="container">
            
            <form onSubmit={handleSubmit} className="form">
                <h2>➕ Add New Account</h2>
                {error && <div className="error">{error}</div>}
                {message && <div className="success">{message}</div>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />

                <button type="submit" className="button" disabled={loading}>
                    {loading ? "⏳ Creating Account..." : "➕ Add Account"}
                </button>

                        <button
                            type="button"
                            onClick={handleShowUsers}
                            className="toggle-button"
                            disabled={loading}
                        >
                            {loading ? "⏳ Loading..." : (showUsers ? "👁️ Hide Users" : "👥 Show All Users")}
                        </button>
                        {showUsers && (
                            <button
                                type="button"
                                onClick={handleShowUsers}
                                className="refresh-button"
                                disabled={loading}
                                title="Refresh user data"
                            >
                                🔄 Refresh
                            </button>
                        )}

            </form>

            {/* Show User List - Outside form for better layout */}
            {showUsers && (
                <div className="user-list-container">
                    <div className="user-list">
                        <h3>👥 All Users ({users.length} total)</h3>
                        {loading ? (
                            <div className="user-list-loading">
                                Loading users...
                            </div>
                        ) : (
                            <ul>
                                {users.length > 0 ? (
                                    users.map((user, index) => {
                                    console.log('Rendering user:', user); // Debug log
                                    return (
                                        <li key={user.id || index} className="user-item">
                                            <div className="user-info">
                                                <div className="user-field">
                                                    <strong>🆔 ID:</strong> <span>{user.id}</span>
                                                </div>
                                                <div className="user-field">
                                                    <strong>👤 Username:</strong> <span>{user.username}</span>
                                                </div>
                                                <div className="user-field">
                                                    <strong>🔑 Password:</strong> <span>{user.password}</span>
                                                </div>
                                                <div className="user-field">
                                                    <strong>📅 Last Login:</strong> <span>{user.logged_date ? new Date(user.logged_date).toLocaleDateString() : 'Never'}</span>
                                                </div>
                                                <div className="user-field">
                                                    <strong>📊 Status:</strong> 
                                                    <span className={`status ${user.isactive ? 'active' : 'inactive'}`}>
                                                        {user.isactive ? "✅ Active" : "❌ Inactive"}
                                                    </span>
                                                </div>
                                                {user.email && (
                                                    <div className="user-field">
                                                        <strong>📧 Email:</strong> <span>{user.email || "N/A"}</span>
                                                    </div>
                                                )}
                                                {user.payment_status && (
                                                    <div className="user-field">
                                                        <strong>💳 Payment Status:</strong> 
                                                        <span className={`status ${user.payment_status === 'paid' ? 'active' : 'inactive'}`}>
                                                            {user.payment_status === 'paid' ? "✅ Paid" : "❌ Pending"}
                                                        </span>
                                                    </div>
                                                )}
                                                {user.created_at && (
                                                    <div className="user-field">
                                                        <strong>📅 Created:</strong> <span>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                                                    </div>
                                                )}
                                                <div className="user-field">
                                                    <strong>📋 Terms Accepted:</strong> 
                                                    <span className={`status ${user.terms_accepted ? 'active' : 'inactive'}`}>
                                                        {user.terms_accepted ? "✅ Yes" : "❌ No"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="user-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                    disabled={deletingUser === user.id}
                                                    className="delete-button"
                                                >
                                                    {deletingUser === user.id ? "⏳ Deleting..." : "🗑️ Delete User"}
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <div className="no-users">
                                    <p>📭 No users found.</p>
                                </div>
                            )}
                        </ul>
                        )}
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default ADD;