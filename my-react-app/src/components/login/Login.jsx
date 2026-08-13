import React, { useState, useContext, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import { safeGetItem } from '../../utils/safeStorage.js';
import { useCopy, useLang } from '../../i18n';
import authCopy from '../../i18n/copy/auth.js';

const Login = () => {
  const { setUser, user, sessionToken } = useContext(UserContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();
  const copy = useCopy(authCopy).login;
  const terms = useCopy(authCopy).terms;
  const { dir } = useLang();

  // Handle success message from signup redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Auto-fill username if provided
      if (location.state.username) {
        setForm(prev => ({
          ...prev,
          username: location.state.username
        }));
      }
      // Clear the state to prevent message from showing again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Redirect away from /login if a session ALREADY exists when the page loads.
  // Runs once on mount and reads the stored session directly (not React context)
  // on purpose: a login via the form below is handled by handleSubmit, so this
  // must NOT depend on `user`/`sessionToken` — otherwise it re-fires the instant
  // setUser() runs after a fresh login, races handleSubmit's own routing, skips
  // the terms popup, and can bounce the user around ("kicked out after login").
  useEffect(() => {
    if (window.location.search.includes('session=expired')) {
      setSessionExpired(true);
    }
    let stored = null;
    try { stored = JSON.parse(safeGetItem('user') || 'null'); } catch (_) { stored = null; }
    const storedToken = safeGetItem('sessionToken');
    if (stored && storedToken && stored.username) {
      // Validate the token server-side (the endpoint now checks the token, not
      // just the logged flag) so a stale session never pulls us into the app.
      axios.post(
        `${Globals.URL}/session-validate`,
        { username: stored.username },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
        .then(res => {
          if (res.data.valid) {
            // Everyone lands on the quizzes dashboard. Not paying is not a
            // reason to be sent to the paywall instead of your own account —
            // the free tier limits quizzes, not access.
            navigate('/quizs', { replace: true, state: { id: stored.id } });
          }
        })
        .catch(() => {
          // Network error or server unavailable — stay on login page
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autofill username from context if user is known (never autofill password for security)
  useEffect(() => {
    if (user && user.username) {
      setForm(prev => ({
        username: prev.username || user.username || '',
        password: prev.password || '' // Never autofill password for security reasons
      }));
    }
  }, [user]);


  const supportMailLink = `mailto:alshraky3@gmail.com?subject=${encodeURIComponent(copy.supportSubject)}&body=${encodeURIComponent(copy.supportBody)}`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanedUsername = form.username.trim().toLowerCase();
    const password = form.password;

    if (!cleanedUsername || !password) {
      setError(copy.requiredFieldsError);
      return;
    }

    setError('');
    setLoading(true);

    // NOTE: a hardcoded `admin` / `<password>` shortcut used to sit here that
    // navigated straight to /admin. It granted no access — /admin is behind
    // AdminGate, which verifies the real ADMIN_KEY against the server — but it
    // was a credential literal in client source, shipped in the public bundle
    // and readable by anyone. Admins reach /admin directly and enter the key.

    axios
      .post(`${Globals.URL}/login`, {
        username: cleanedUsername,
        password: password,
      })
      .then((response) => {
        const username = cleanedUsername;

        // The backend returns a `subscription` object when enforcement is on,
        // but logging in is NOT gated on it: a free-tier account signs in to
        // its own dashboard like everyone else. What subscription state
        // affects is the allowance banner and the quiz gate, both downstream.

        if (response.data.showTerms) {
          setShowTermsPopup(true);
          setLoading(false);
          setUser(response.data.user || { username }, response.data.sessionToken);
          return;
        }

        const loggedUser = response.data.user || { username };
        setUser(loggedUser, response.data.sessionToken);

        setLoading(false);
        // Return the user to the protected page they were sent here from
        // (set by RequireAuth), defaulting to the quizzes dashboard.
        const redirectTo = location.state?.from || '/quizs';
        navigate(redirectTo, { state: response.data });
      })
      .catch((err) => {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (err.response?.data?.accountDeleted) {
          setError(copy.accountDeletedError);
        } else if (err.response && err.response.data && err.response.data.alreadyLogged) {
          setError(copy.accountInUseError);
        } else {
          if (newAttempts >= 10) {
            setShowPopup(true);
          }
          setError(copy.credentialsError);
        }
        setLoading(false);
      });
  };

  const handleAcceptTerms = async () => {
    if (!termsChecked) return;
    setShowTermsPopup(false);
    setLoading(true);
    try {
      await axios.post(
        `${Globals.URL}/accept-terms`,
        { username: form.username.trim().toLowerCase() },
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
      setLoading(false);
      navigate('/quizs');
    } catch (err) {
      setLoading(false);
      setError(copy.acceptTermsError);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="login-body" dir={dir}>
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <span className="pill">{copy.pill}</span>
              <h1 className="login-title">{copy.title}</h1>
              <p className="login-subtitle">{copy.subtitle}</p>
            </div>

            {sessionExpired && (
              <div className="alert-box warning">
                {copy.sessionExpired}
              </div>
            )}

            {successMessage && (
              <div className="alert-box success">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-username">{copy.emailLabel}</label>
                <input
                  id="login-username"
                  type="text"
                  name="username"
                  placeholder={copy.emailPlaceholder}
                  value={form.username}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">{copy.passwordLabel}</label>
                <div className="password-input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={copy.passwordPlaceholder}
                    value={form.password}
                    onChange={handleChange}
                    className="form-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                    tabIndex="-1"
                  >
                    {showPassword ? <Icon name="eye" size={18} /> : <Icon name="eye-off" size={18} />}
                  </button>
                </div>
              </div>

              {/* `end`, not `left`: the link hugs whichever edge the reading
                  direction ends on. */}
              <div style={{ textAlign: 'end', marginBottom: 8 }}>
                <a href="/forgot-password" className="link-primary" style={{ fontSize: 13 }}>{copy.forgot}</a>
              </div>

              {error && (
                <div className="alert-box error">
                  {error}
                </div>
              )}

              <button type="submit" className="btn primary large" disabled={loading}>
                {loading ? copy.submitting : copy.submit}
              </button>

              <div className="login-footer-text">
                <span>{copy.noAccount}</span>
                <a href="/signup" className="link-primary">
                  {copy.signupLink}
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Terms of Use Popup */}
        {showTermsPopup && (
          <div className="popup-overlay" style={{ zIndex: 1000 }}>
            <div className="popup-content large-popup">
              <div className="terms-section">
                <h4>{terms.title}</h4>
                {terms.sections.map((sec) => (
                  <p key={sec.heading}>
                    <strong>{sec.heading}:</strong><br />
                    {sec.body}
                  </p>
                ))}
                <div>
                  <strong>{terms.prohibitedHeading}:</strong><br />
                  <ul>
                    {terms.prohibited.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                {terms.sectionsAfter.map((sec) => (
                  <p key={sec.heading}>
                    <strong>{sec.heading}:</strong><br />
                    {sec.body}
                  </p>
                ))}
                <p>{terms.closing}</p>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                />
                {terms.accept}
              </label>
              <button
                className="popup-btn try-free"
                onClick={handleAcceptTerms}
                disabled={!termsChecked}
                style={{ marginTop: '15px' }}
              >
                {terms.continue}
              </button>
            </div>
          </div>
        )}



        {/* Subscription Expired Popup */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content large-popup">
              <h3>{copy.popupTitle}</h3>
              <p>{copy.popupBody}</p>
              <div className="popup-buttons">
                <button onClick={handleClosePopup} className="popup-btn no-thanks">
                  {copy.close}
                </button>
                <button className="popup-btn Contact-Us" onClick={() => navigate('/contact')}>
                  {copy.contactUs}
                </button>
                <button
                  className="popup-btn contact-support"
                  onClick={() => window.location.href = supportMailLink}
                >
                  {copy.contactSupport}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;