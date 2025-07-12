import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import SEO from '../common/SEO';
import axios from 'axios';
import Globals from '../../global';

const PAYPAL_BUTTON_ID = "7JKAEKKCAGGW6";
const WHATSAPP_LINK = 'https://wa.link/pzhg6j';

const Landing = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('options'); // options | paypal
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const paypalRef = useRef(null);

  // Free Trial
  const handleFreeTrial = async () => {
    setLoading(true);
    setFormError('');
    try {
      const response = await axios.post(`${Globals.URL}/free-trial/start`);
      const { trialId, user } = response.data;
      setShowModal(false);
      navigate('/quizs', { 
        state: { 
          id: trialId, 
          user: user,
          isTrial: true 
        } 
      });
    } catch (error) {
      setFormError('Failed to start free trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp
  const handleWhatsApp = () => {
    window.open(WHATSAPP_LINK, '_blank');
  };

  // PayPal Registration Flow
  const handlePayPalStart = () => {
    setModalStep('paypal');
    setForm({ username: '', email: '', password: '', confirmPassword: '' });
    setFormError('');
    setSuccessMsg('');
    setPaypalReady(false);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      return 'All fields are required.';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return 'Invalid email address.';
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setPaypalReady(true);
  };

  // Render PayPal button after form is valid and paypalReady
  useEffect(() => {
    if (modalStep === 'paypal' && paypalReady && window.paypal && paypalRef.current) {
      paypalRef.current.innerHTML = '';
      window.paypal.HostedButtons({
        hostedButtonId: PAYPAL_BUTTON_ID,
        createOrder: (data, actions) => {
          return actions.order.create({});
        },
        onApprove: async (data, actions) => {
          setLoading(true);
          setFormError('');
          try {
            const res = await axios.post(`${Globals.URL}/api/paypal-create-account`, {
              username: form.username,
              password: form.password,
              email: form.email,
              paymentId: data.orderID,
              payerId: data.payerID,
              token: data.facilitatorAccessToken || ''
            });
            setSuccessMsg('Account created successfully! Redirecting to login...');
            setTimeout(() => {
              setShowModal(false);
              navigate('/login');
            }, 2000);
          } catch (err) {
            setFormError(err.response?.data?.message || 'Account creation failed.');
          } finally {
            setLoading(false);
          }
        },
        onError: (err) => {
          setFormError('PayPal payment failed. Please try again.');
        }
      }).render('#paypal-container-7JKAEKKCAGGW6');
    }
  }, [modalStep, paypalReady, form, navigate]);

  const handleGetStarted = () => {
    setShowModal(true);
    setModalStep('options');
    setFormError('');
    setSuccessMsg('');
    setPaypalReady(false);
    setLoading(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <SEO 
        title="Ultimate SMLE Prep Platform"
        description="Master the Saudi Medical Licensing Examination (SMLE) with MEDQIZE. Access over 5,000 carefully curated questions with detailed analytics, targeted practice, and comprehensive performance tracking. Start your free trial today!"
        keywords="SMLE, Saudi Medical Licensing Examination, medical questions, medical quiz, medical exam preparation, Saudi medical license, medical board exam, medical practice test, medical study guide, Saudi medical students, free trial"
        url="https://www.smle-question-bank.com"
      />
      <div className="landing-body">
        {/* Decorative SVG Wave at the Top */}
        <div className="landing-top-wave">
          <svg viewBox="0 0 2880 180" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <g className="wave-anim-group">
              <path d="M0,80 C360,180 1080,0 1440,100 L1440,0 L0,0 Z" fill="#00b6e0" fillOpacity="0.10" />
              <path d="M0,80 C360,180 1080,0 1440,100 L1440,0 L0,0 Z" fill="#00b6e0" fillOpacity="0.10" transform="scale(-1,1) translate(-2880,0)" />
            </g>
          </svg>
        </div>
        {/* Faint Background Icon */}
        <div className="landing-bg-icon">?</div>
        <div className="landing-wrapper landing-main-container">
          {/* Badge Above Main Title */}
          <div className="landing-badge">#1 Affordable SMLE Prep</div>
          {/* Header Section */}
          <div className="landing-header">
            <h1 className="landing-main-title landing-title-shadow">SQB</h1>
            <h2 className="landing-subtitle">Your Ultimate SMLE Question Bank</h2>
            <p className="landing-description">
              Master the Saudi Medical Licensing Examination with our comprehensive collection of over 5,000 carefully curated questions
            </p>
          </div>
          <div className="landing-cta">
            <div className="landing-buttons">
              <button className="landing-btn primary" onClick={handleGetStarted}>
                Get Started Now
              </button>
              <button className="landing-btn secondary" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
          {/* Pricing Section */}
          <div className="landing-pricing">
            <div className="pricing-badge">
              <span className="pricing-label">Best Value</span>
            </div>
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Annual Subscription</h3>
                <div className="price">
                  <span className="currency">SAR</span>
                  <span className="amount">50</span>
                  <span className="period">/year</span>
                </div>
                <p className="pricing-subtitle">The most affordable SMLE preparation service</p>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>Access to all 5,000+ questions</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>Detailed performance analytics</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>Topic-wise practice sessions</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>24/7 unlimited access</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>Mobile-friendly platform</span>
                </div>
              </div>
              <div className="pricing-comparison">
                <p>Save up to <strong>80%</strong> compared to other SMLE services</p>
              </div>
              <button className="landing-btn primary" style={{marginTop: 24, width: '100%'}} onClick={() => { setShowModal(true); setModalStep('paypal'); setFormError(''); setSuccessMsg(''); setPaypalReady(false); setLoading(false); setForm({ username: '', email: '', password: '', confirmPassword: '' }); }}>
                Subscribe / Buy Now
              </button>
            </div>
          </div>
          {/* Features Section */}
          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>5,000+ Questions</h3>
              <p>Extensive question bank covering all SMLE topics with detailed explanations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Analytics</h3>
              <p>Track your progress with comprehensive performance analysis and topic-wise breakdown</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Targeted Practice</h3>
              <p>Focus on specific topics or take mixed quizzes to test your overall knowledge</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Study anywhere, anytime with our responsive design that works on all devices</p>
            </div>
          </div>
          {/* Stats Section */}
          <div className="landing-stats">
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Questions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">SAR 50</div>
              <div className="stat-label">Per Year</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
          {/* Footer */}
          <div className="landing-footer" />
        </div>
        {/* Modal for registration and PayPal */}
        {showModal && (
          <div className="popup-overlay" style={{ zIndex: 1000 }}>
            <div className={`popup-content${modalStep === 'paypal' ? ' paypal-active' : ''}`}> 
              {modalStep === 'options' && (
                <>
                  <h3>Choose how to get started:</h3>
                  <div className="trial-options">
                    <div className="trial-option">
                      <h4>🎯 Free Trial</h4>
                      <p>Try our platform with 40 carefully selected questions from all 4 topics. No registration required!</p>
                      <ul>
                        <li>✓ 40 sample questions</li>
                        <li>✓ All 4 question types</li>
                        <li>✓ Instant access</li>
                        <li>✓ No login needed</li>
                      </ul>
                      <button className="popup-btn primary" onClick={handleFreeTrial} disabled={loading} style={{ marginTop: 12 }}>
                        {loading ? 'Starting...' : 'Start Free Trial'}
                      </button>
                    </div>
                    <div className="trial-option">
                      <h4>💳 Full Access (PayPal)</h4>
                      <p>Get complete access to all 5,000+ questions and features instantly by paying with PayPal.</p>
                      <ul>
                        <li>✓ All 5,000+ questions</li>
                        <li>✓ Detailed analytics</li>
                        <li>✓ Progress tracking</li>
                        <li>✓ 1-year full access</li>
                      </ul>
                      <button className="popup-btn primary" onClick={handlePayPalStart} style={{ marginTop: 12 }}>
                        Continue with PayPal
                      </button>
                    </div>
                    <div className="trial-option">
                      <h4>📱 Create Account via WhatsApp</h4>
                      <p>Contact our support team on WhatsApp to create your account and get full access.</p>
                      <ul>
                        <li>✓ Personal support</li>
                        <li>✓ All features unlocked</li>
                        <li>✓ Fast response</li>
                      </ul>
                      <button className="popup-btn secondary" onClick={handleWhatsApp} style={{ marginTop: 12 }}>
                        Contact on WhatsApp
                      </button>
                    </div>
                  </div>
                  {formError && <div className="paypal-error" style={{ marginTop: 10 }}>{formError}</div>}
                  <button className="popup-btn no-thanks" onClick={() => setShowModal(false)} style={{ marginTop: 20 }}>Cancel</button>
                </>
              )}
              {modalStep === 'paypal' && (
                <>
                  {successMsg ? (
                    <div className="paypal-success">{successMsg}</div>
                  ) : !paypalReady ? (
                    <>
                      <h3>Create Your Account</h3>
                      <form onSubmit={handleFormSubmit}>
                        <input
                          type="text"
                          name="username"
                          placeholder="Username"
                          value={form.username}
                          onChange={handleFormChange}
                          className="popup-input"
                          autoComplete="username"
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={form.email}
                          onChange={handleFormChange}
                          className="popup-input"
                          autoComplete="email"
                          required
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={form.password}
                          onChange={handleFormChange}
                          className="popup-input"
                          autoComplete="new-password"
                          required
                        />
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={form.confirmPassword}
                          onChange={handleFormChange}
                          className="popup-input"
                          autoComplete="new-password"
                          required
                        />
                        {formError && <div className="paypal-error" style={{ marginBottom: 8 }}>{formError}</div>}
                        <button className="popup-btn primary" type="submit" disabled={loading} style={{ marginTop: 10 }}>
                          {loading ? 'Please wait...' : 'Continue to Payment'}
                        </button>
                      </form>
                      <button className="popup-btn no-thanks" onClick={() => setShowModal(false)} style={{ marginTop: 10 }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <h3>Pay with PayPal</h3>
                      <div ref={paypalRef} className="paypal-modal-container" id="paypal-container-7JKAEKKCAGGW6" style={{ margin: '20px 0' }} />
                      {formError && <div className="paypal-error" style={{ marginBottom: 8 }}>{formError}</div>}
                      <button className="popup-btn no-thanks" onClick={() => setShowModal(false)} style={{ marginTop: 10 }}>Cancel</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Landing; 