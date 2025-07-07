import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Globals from '../../global';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
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
        const username = cleanedUsername;

        if (response.data.expired) {
          // Show subscription expired message
          setShowPopup(true);
          return;
        }

        // Check localStorage for previous login
        const hasLoggedInBefore = localStorage.getItem(`hasLoggedIn_${username}`);

        if (!hasLoggedInBefore) {
          // First login → show Terms of Use
          localStorage.setItem(`hasLoggedIn_${username}`, 'true');
          setShowTermsPopup(true);
        } else {
          // Already logged in before → go to quizs
          navigate('/quizs', { state: response.data });
        }
      })
      .catch((err) => {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 3) {
          setShowPopup(true);
        }
        setError('Your username or password is wrong! Try again.');
      });
  };

  const handleAcceptTerms = () => {
    if (!termsChecked) return;
    setShowTermsPopup(false);
    navigate('/quizs');
  };

  const handleContactClick = (e) => {
    e.preventDefault();

    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="login-body">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="login-icon" />
          <h2>question bank for SMLE</h2>
        </div>

        <div className="login-box">
          <h2 className="login-title">Login</h2>

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
                        <a href="#contact" onClick={handleContactClick} className='login-small' rel="noopener noreferrer">
              click to create an account or get  free trial
            </a>
            {error && <p className="login-error">{error}</p>}
          </form>
        </div>

        <div className="login-footer" />
      </div>

      {/* Terms of Use Popup */}
      {showTermsPopup && (
        <div className="popup-overlay" style={{ zIndex: 1000 }}>
          <div className="popup-content large-popup">
            {/* English Section */}
            <div className="terms-section">
              <h4>Terms of Use</h4>

              <p>
                <strong>Purpose of the Site:</strong><br />
                All questions and related materials available on this website were compiled through personal efforts of university students and are <strong>not affiliated with, endorsed by, or recognized by any official academic institution, governing body, or medical authority</strong>. They are intended solely for educational and review purposes.
              </p>

              <p>
                <strong>Accuracy Disclaimer:</strong><br />
                We make every effort to ensure the accuracy and relevance of the materials provided. However, the content on this website may contain errors, inaccuracies, or omissions. The site does <strong>not guarantee the correctness, completeness, or reliability</strong> of any content. Users should always consult official resources and professional guidance when preparing for exams or making decisions based on the material presented.
              </p>

              <p>
                <strong>User Account Policies:</strong><br />
                You are responsible for maintaining the confidentiality of your account login information. Sharing your account credentials with unauthorized individuals or non-participants is strictly prohibited. The site owner and administrators reserve the <strong>full right to suspend, delete, or block access</strong> to any account found to be in violation of this policy.
              </p>

              <p>
                <strong>Prohibited Conduct:</strong><br />
                You agree not to:
                <ul>
                  <li>Attempt to download, copy, or otherwise extract the question bank without prior written permission from the site owner.</li>
                  <li>Use automated tools or scripts to scrape or collect content from the website.</li>
                  <li>Misrepresent your identity or affiliation when using the service.</li>
                </ul>
                The site owner and administrators reserve the <strong>full right to suspend or terminate accounts</strong> involved in such activities without prior notice.
              </p>

              <p>
                <strong>Intellectual Property:</strong><br />
                All content on this website, including text, images, questions, and databases, is the property of this service or its contributors and is protected by copyright laws. Unauthorized use, reproduction, or distribution is strictly prohibited.
              </p>

              <p>
                <strong>Limitation of Liability:</strong><br />
                In no event shall this service, its owners, staff, or contributors be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the website or reliance on any content.
              </p>
              <p>
                By using this service, you acknowledge that you have read, understood, and agreed to all terms outlined above.
              </p>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
              />
              I accept the Terms of Use
            </label>
            <button
              className="popup-btn try-free"
              onClick={handleAcceptTerms}
              disabled={!termsChecked}
              style={{ marginTop: '15px' }}
            >
              Continue
            </button>
          </div>
        </div>
      )}


      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content large-popup">
            <h3>Subscription Expired </h3>
            <p>Your subscription has expired. Please contact us to renew it.</p>
            <a href="#contact" onClick={handleContactClick} rel="noopener noreferrer">
              Contact Us
            </a>
            <div className="popup-buttons">
              <button onClick={handleClosePopup} className="popup-btn no-thanks">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;