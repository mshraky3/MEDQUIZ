import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const [showBetaPopup, setShowBetaPopup] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowBetaPopup(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleWhatsAppRedirect = () => {
    window.open('https://wa.link/pzhg6j', '_blank');
  };

  const handleClosePopup = () => {
    setShowBetaPopup(false);
  };

  return (
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
      {/* Beta Version Popup */}
      {showBetaPopup && (
        <div className="popup-overlay" style={{ zIndex: 1000 }}>
          <div className="popup-content">
            <h3>🚀 Beta Version Notice</h3>
            <p>
              Welcome to MEDQIZE! We're currently in beta version and all accounts are created through our WhatsApp support team.
            </p>
            <p>
              To get started with your account or request a free trial, please contact us via WhatsApp.
            </p>
            <div className="popup-buttons">
              <button
                className="popup-btn Contact-Us"
                onClick={handleWhatsAppRedirect}
              >
                Contact via WhatsApp
              </button>
              <button
                className="popup-btn no-thanks"
                onClick={handleClosePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing; 