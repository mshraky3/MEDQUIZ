import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">📚 SMLE Question Bank</span>
          <p className="footer-tagline">Your comprehensive SMLE preparation platform</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Platform</h4>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <a href="mailto:alshraky3@gmail.com">Support</a>
            <span className="footer-info">8,000+ Questions</span>
            <span className="footer-info">40+ Topics</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} SMLE Question Bank. All rights reserved.</p>
          <p className="footer-disclaimer">
            This platform is for educational purposes. Not affiliated with Prometric or SCFHS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 