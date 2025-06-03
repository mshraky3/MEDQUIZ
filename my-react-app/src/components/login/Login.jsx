import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { Router, useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
            setError('Please enter both username and password.');
            setSuccessMessage('');
            return;
        }
        setError('');
        axios.post('http://localhost:3000/login', {
            username: form.username,
            password: form.password,
        })
            .then((response) => {
                setSuccessMessage(response.data.message);
                navigate('/quizs', { state: response.data });
                console.log('Login successful:', response.data);
                setError('');
            })
            .catch((error) => {
                setError('Error: ' + (error.response?.data?.message || error.message));
                setSuccessMessage('');
            });
    };

    return (<>
        <center>
            <h1>
                Welcome to the Quiz App
            </h1>
        </center>
        <div className="login-container">

            <h2 className="login-title">Login</h2>
            {error && <div className="login-error">{error}</div>}
            {successMessage && <div className="login-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="login-form-group">
                    <label className="login-label">
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="login-input"
                            autoComplete="username"
                        />
                    </label>
                </div>
                <div className="login-form-group">
                    <label className="login-label">
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="login-input"
                            autoComplete="current-password"
                        />
                    </label>
                </div>
                <button type="submit" className="login-button">
                    Login
                </button>
            </form>

        </div>
        <center>
                <button type="submit" className="button">
            contact us
        </button>
        </center>

    </>);
};

export default Login;