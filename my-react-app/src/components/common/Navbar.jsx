import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGoBack = () => {
    if (location.pathname === '/quizs') {
      navigate('/login');
    } else if (user && user.id) {
      navigate('/quizs', { state: { id: user.id } });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar" dir="rtl">
      <div className="navbar-right">
        <Link to="/" className="navbar-brand">SQB</Link>
        {user && user.username && (
          <span className="user-info">
            <svg className="user-icon" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#2563eb" opacity="0.18" />
              <circle cx="12" cy="8" r="2.5" fill="#2563eb" />
              <ellipse cx="12" cy="17" rx="6.5" ry="4.5" fill="#2563eb" opacity="0.18" />
            </svg>
            {user.username}
          </span>
        )}
      </div>

      <div className="navbar-center">
        <div className={`navbar-nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <Link to="/quizs" className="nav-link" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
          <Link to="/guides" className="nav-link" onClick={() => setMenuOpen(false)}>أدلة التحضير</Link>
          <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>من نحن</Link>
          <Link to="/faq" className="nav-link" onClick={() => setMenuOpen(false)}>الأسئلة الشائعة</Link>
          <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>تواصل معنا</Link>
        </div>
      </div>

      <div className="navbar-left">
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="القائمة"
        >
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
        </button>
        <button onClick={handleGoBack} className="back-button" aria-label="رجوع">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 