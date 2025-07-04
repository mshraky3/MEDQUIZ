import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Globals from '../../global';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedUsername = form.username.trim().toLowerCase();
    const password = form.password;

    if (!cleanedUsername || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');

    // Admin bypass
    if (cleanedUsername === 'admin' && password === 'admin1810') {
      navigate('/admin');
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
      .catch((err) => {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 3) {
          setShowPopup(true);
        }
        setError('Your username is wrong! Try again.');
      });
  };

  const handleContactClick = (e) => {
    e.preventDefault(); // prevent default anchor action
    setShowPopup(true);
  };

  const handleTryFreeQuiz = () => {
    setShowPopup(false);
    navigate('/temp-quiz');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="login-body">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-icon" />
          <h2>Future Doctors Service!</h2>
        </div>

        <div className="login-box">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Sign in to continue.</p>
          <p className="login-small">
            You don't have account? <br />{' '}
            <span>
              <a href="#contact" onClick={handleContactClick} rel="noopener noreferrer">
                Contact with us to give you one!!
              </a>
            </span>
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

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>
              Don't have an account? You can try a small trial for free first!
            </p>
            <div className="popup-buttons">
              <button onClick={handleClosePopup} className="popup-btn no-thanks">
                No thanks
              </button>
              <button onClick={handleTryFreeQuiz} className="popup-btn try-free">
                OK, try free quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;