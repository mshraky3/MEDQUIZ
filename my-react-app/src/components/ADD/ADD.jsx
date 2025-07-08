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
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add account. Please try again.");
            setMessage("");
        }
    };

    const handleShowUsers = async () => {
        try {
            const response = await axios.get(`${props.host}/get_all_users`);
            setUsers(response.data.users);
            setShowUsers(!showUsers);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch users.");
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
                    onChange={(e) => setUsername(e.target.value)}
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
                        <h3>All Users:</h3>
                        <ul>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <li key={index}>
                                        <strong>Username:</strong> {user.username}<br />
                                        <strong>Password:</strong> {user.password}<br />
                                        <strong>Logged In:</strong> {user.logged ? "Yes" : "No"}<br />
                                        <strong>Last Login Date:</strong> {user.logged_date ? new Date(user.logged_date).toLocaleDateString() : 'Never'}<br />
                                        <strong>Status:</strong> {user.isactive ? "Active" : "Inactive"}
                                        <hr />
                                    </li>
                                ))
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