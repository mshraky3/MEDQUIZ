import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleGoBack = () => {
    if (location.pathname === '/quizs') {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  const navLinks = [
    { path: '/admin', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/ADD_ACCOUNT', label: '👤 Users', icon: '👤' },
    { path: '/ADDQ', label: '➕ Add Questions', icon: '➕' },
    { path: '/Bank', label: '📚 Question Bank', icon: '📚' },
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        {/* Logo/Brand */}
        <div className="admin-navbar-brand">
          <span className="admin-navbar-icon">⚙️</span>
          <span className="admin-navbar-title">Admin Panel</span>
        </div>

        {/* Desktop Navigation */}
        <div className="admin-navbar-links">
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`admin-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Back Button */}
        <button className="admin-back-btn" onClick={handleGoBack}>
          ← Back
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="admin-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`admin-mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <button
            key={link.path}
            className={`admin-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => {
              navigate(link.path);
              setMenuOpen(false);
            }}
          >
            <span className="mobile-link-icon">{link.icon}</span>
            {link.label.replace(link.icon + ' ', '')}
          </button>
        ))}
        <button
          className="admin-mobile-link back"
          onClick={() => {
            handleGoBack();
            setMenuOpen(false);
          }}
        >
          <span className="mobile-link-icon">←</span>
          Go Back Home
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
