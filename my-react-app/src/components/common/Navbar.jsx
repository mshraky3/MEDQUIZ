import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Icon from './Icon.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, sessionToken, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // A visitor is only "home" inside the app once they hold a valid session.
  const isAuthenticated = !!(user && user.id && sessionToken);

  // Authenticated users' "home" is the quizzes dashboard; everyone else's is
  // the public landing page. This is the single source of truth so the brand,
  // the الرئيسية link, and the back button can never send a logged-out visitor
  // into a protected route.
  const homePath = isAuthenticated ? '/quizs' : '/';

  const handleGoBack = () => {
    if (location.pathname === '/quizs' || location.pathname === '/') {
      navigate(homePath);
    } else {
      navigate(homePath, user && user.id ? { state: { id: user.id } } : undefined);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar" dir="rtl">
      <div className="navbar-right">
        <Link to={homePath} className="navbar-brand">SQB</Link>
        {user && user.username && (
          <span className="user-info">
            <svg className="user-icon" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#2563eb" opacity="0.18" />
              <circle cx="12" cy="8" r="2.5" fill="#2563eb" />
              <ellipse cx="12" cy="17" rx="6.5" ry="4.5" fill="#2563eb" opacity="0.18" />
            </svg>
            <span className="user-name">{user.username}</span>
            {user.subscription_status === 'active' && user.subscription_expiry_date && (
              <span className="sub-badge" title="تاريخ انتهاء اشتراكك">
                الاشتراك حتى {new Date(user.subscription_expiry_date).toLocaleDateString('ar-SA')}
              </span>
            )}
          </span>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="logout-button"
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
          >
            <Icon name="log-out" size={17} />
            <span className="logout-label">تسجيل الخروج</span>
          </button>
        )}
      </div>

      <div className="navbar-center">
        <div className={`navbar-nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          {isAuthenticated ? (
            // Inside the app the nav is about studying, not marketing —
            // the marketing pages stay reachable from the footer.
            <>
              <Link to={homePath} className="nav-link" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
              <Link to="/analysis" className="nav-link" onClick={() => setMenuOpen(false)}>التحليل</Link>
              <Link to="/wrong-questions" className="nav-link" onClick={() => setMenuOpen(false)}>أسئلتي الخاطئة</Link>
              <Link to="/summaries" className="nav-link" onClick={() => setMenuOpen(false)}>الملخصات</Link>
              <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>تواصل معنا</Link>
            </>
          ) : (
            <>
              <Link to="/guides" className="nav-link" onClick={() => setMenuOpen(false)}>أدلة التحضير</Link>
              <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>من نحن</Link>
              <Link to="/faq" className="nav-link" onClick={() => setMenuOpen(false)}>الأسئلة الشائعة</Link>
              <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>تواصل معنا</Link>
            </>
          )}
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