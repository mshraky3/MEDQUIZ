import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Globals from '../../global';
import { Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clean username: trim whitespace and convert to lowercase
    const cleanedUsername = form.username.trim().toLowerCase();
    const password = form.password;

    if (!cleanedUsername || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');

    if (cleanedUsername === 'admin' && password === 'admin1810') {
      navigate('/ADDQ');
      return;
    }

    if (cleanedUsername === 'admin' && password === 'admin18102019') {
      navigate('/ADD_ACCOUNT');
      return;
    }

    axios
      .post(`${Globals.URL}/login`, {
        username: cleanedUsername,
        password: password,
      })
      .then((response) => {
        navigate('/quizs', { state: response.data });
      })
      .catch((error) => {
        setError('Your username is wrong! Try again' + error);
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-header">
        <div className="login-icon"/> 
        <h2>Future Doctors Service!</h2>
      </div>

      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <p className="login-subtitle">Sign in to continue.</p>
        <p className="login-small">
          You don't have account? <br /> <span> <a href="https://wa.link/pzhg6j" target="_blank" rel="noopener noreferrer">Contact with us to give you one!!</a> </span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="USERNAME"
            value={form.username}
            onChange={handleChange}
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={form.password}
            onChange={handleChange}
            className="login-input"
          />
          <button type="submit" className="login-btn">
            Log in
          </button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>

      <div className="login-footer" />
    </div>
  );
};

export default Login;
