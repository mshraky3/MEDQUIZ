import React, { useState } from "react";
import axios from "axios";
import "./ADD.css";

const ADD = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter both email and password.");
            setMessage("");
            return;
        }

        setError("");
        setMessage("");

        try {
            const response = await axios.post(`${props.host}/add_account`, {
                email,
                password,
            });

            setMessage(response.data.message);
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Failed to add account. Please try again.";
            setError(errorMessage);
            setMessage("");
        }
    };

    const handleShowUsers = async () => {
        try {
            const response = await axios.get(`${props.host}/get_all_users`);
            setUsers(response.data.users);
            setShowUsers(!showUsers);
        } catch (err) {
            setError("Failed to fetch users.");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Add Account</h2>
                {error && <div className="error">{error}</div>}
                {message && <div className="success">{message}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                                        <strong>Email:</strong> {user.username}<br />
                                        <strong>Password:</strong> {user.password}<br />
                                        <strong>Logged In:</strong> {user.logged ? "Yes" : "No"}
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