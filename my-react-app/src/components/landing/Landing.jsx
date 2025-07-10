import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Landing.css';
import Globals from '../../global';
import SEO from '../common/SEO';

const Landing = () => {
  const [showBetaPopup, setShowBetaPopup] = useState(false);
  const [showTrialPopup, setShowTrialPopup] = useState(false);
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const navigate = useNavigate();

  // SEO structured data for the landing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "MEDQIZE - Ultimate SMLE Prep Platform",
    "description": "Master the Saudi Medical Licensing Examination (SMLE) with over 5,000 carefully curated questions, detailed analytics, and targeted practice sessions.",
    "url": "https://medquiz.vercel.app/",
    "mainEntity": {
      "@type": "EducationalService",
      "name": "MEDQIZE SMLE Prep",
      "description": "Comprehensive SMLE preparation platform with 5,000+ questions and detailed analytics",
      "provider": {
        "@type": "Organization",
        "name": "MEDQIZE",
        "url": "https://medquiz.vercel.app/"
      },
      "offers": {
        "@type": "Offer",
        "price": "50",
        "priceCurrency": "SAR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "50",
          "priceCurrency": "SAR",
          "billingIncrement": "P1Y"
        }
      },
      "educationalLevel": "Professional",
      "teaches": "Saudi Medical Licensing Examination",
      "audience": {
        "@type": "Audience",
        "audienceType": "Medical Students"
      }
    }
  };

  const handleGetStarted = () => {
    setShowTrialPopup(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleWhatsAppRedirect = () => {
    window.open('https://wa.link/pzhg6j', '_blank');
  };

  const handleClosePopup = () => {
    setShowBetaPopup(false);
    setShowTrialPopup(false);
  };

  const handleStartFreeTrial = async () => {
    setIsStartingTrial(true);
    try {
      const response = await axios.post(`${Globals.URL}/free-trial/start`);
      const { trialId, user } = response.data;
      
      // Navigate directly to quiz selection with trial user data
      navigate('/quizs', { 
        state: { 
          id: trialId, 
          user: user,
          isTrial: true 
        } 
      });
    } catch (error) {
      console.error('Error starting free trial:', error);
      alert('Failed to start free trial. Please try again.');
    } finally {
      setIsStartingTrial(false);
      setShowTrialPopup(false);
    }
  };

  const handleContactWhatsApp = () => {
    setShowTrialPopup(false);
    setShowBetaPopup(true);
  };

  return (
    <>
      <SEO 
        title="Ultimate SMLE Prep Platform"
        description="Master the Saudi Medical Licensing Examination (SMLE) with MEDQIZE. Access over 5,000 carefully curated questions with detailed analytics, targeted practice, and comprehensive performance tracking. Start your free trial today!"
        keywords="SMLE, Saudi Medical Licensing Examination, medical questions, medical quiz, medical exam preparation, Saudi medical license, medical board exam, medical practice test, medical study guide, Saudi medical students, free trial"
        url="https://medquiz.vercel.app/"
        structuredData={structuredData}
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
        
        {/* Free Trial Popup */}
        {showTrialPopup && (
          <div className="popup-overlay" style={{ zIndex: 1000 }}>
            <div className="popup-content">
              <h3>🚀 Choose Your Experience</h3>
              <p>
                Welcome to MEDQIZE! You have two options to get started:
              </p>
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
                </div>
                <div className="trial-option">
                  <h4>📞 Full Access</h4>
                  <p>Get complete access to all 5,000+ questions and features through our WhatsApp support team.</p>
                  <ul>
                    <li>✓ All 5,000+ questions</li>
                    <li>✓ Detailed analytics</li>
                    <li>✓ Progress tracking</li>
                    <li>✓ Personal support</li>
                  </ul>
                </div>
              </div>
              <div className="popup-buttons">
                <button
                  className="popup-btn primary"
                  onClick={handleStartFreeTrial}
                  disabled={isStartingTrial}
                >
                  {isStartingTrial ? 'Starting Trial...' : 'Start Free Trial'}
                </button>
                <button
                  className="popup-btn secondary"
                  onClick={handleContactWhatsApp}
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
    </>
  );
};

export default Landing; 