import React, { useState } from "react";
import axios from "axios";
import "./add.css";

const ADD = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter both username and password.");
            setMessage("");
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await axios.post(`${props.host}/add_account`, {
                username,
                password,
            });

            setMessage(response.data.message);
            setUsername(""); // Clear input after success
            setPassword("");
            // Refresh user list if it's currently shown
            if (showUsers) {
                handleShowUsers();
            }
        } catch {
            const errorMessage =
                "Failed to add account. Please try again.";
            setError(errorMessage);
            setMessage("");
        }
    };

    const handleShowUsers = async () => {
        if (showUsers) {
            // If already showing, just hide
            setShowUsers(false);
            return;
        }
        
        try {
            const response = await axios.get(`${props.host}/get_all_users`);
            setUsers(response.data.users);
            setShowUsers(true);
        } catch (err) {
            setError("Failed to fetch users.");
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
            setMessage(response.data.message);
            // Remove the deleted user from the local state
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to delete user. Please try again.";
            setError(errorMessage);
        } finally {
            setDeletingUser(null);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Add Account</h2>
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

                <button type="submit" className="button">
                    Add Account
                </button>

                <button
                    type="button"
                    onClick={handleShowUsers}
                    className="toggle-button"
                >
                    {showUsers ? "Hide Users" : "Show All Users"}
                </button>

                {/* Show User List */}
                {showUsers && (
                    <div className="user-list">
                        <h3>All Users ({users.length}):</h3>
                        <ul>
                            {users.length > 0 ? (
                                users.map((user, index) => {
                                    console.log('Rendering user:', user); // Debug log
                                    return (
                                        <li key={user.id || index} className="user-item">
                                            <div className="user-info">
                                                <strong>ID:</strong> {user.id}<br />
                                                <strong>Username:</strong> {user.username}<br />
                                                <strong>Password:</strong> {user.password}<br />
                                                <strong>Logged In:</strong> {user.logged ? "Yes" : "No"}<br />
                                                <strong>Last Login Date:</strong> {user.logged_date ? new Date(user.logged_date).toLocaleDateString() : 'Never'}<br />
                                                <strong>Status:</strong> {user.isactive ? "Active" : "Inactive"}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteUser(user.id, user.username)}
                                                disabled={deletingUser === user.id}
                                                className="delete-button"
                                                style={{
                                                    backgroundColor: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    minWidth: '120px'
                                                }}
                                            >
                                                {deletingUser === user.id ? "Deleting..." : "🗑️ Delete User"}
                                            </button>
                                        </li>
                                    );
                                })
                            ) : (
                                <p>No users found.</p>
                            )}
                        </ul>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ADD;