import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
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
    { path: '/admin', label: 'Dashboard', icon: 'home' },
    { path: '/ADD_ACCOUNT', label: 'Users', icon: 'user' },
    { path: '/ADDQ', label: 'Add Questions', icon: 'plus' },
    { path: '/Bank', label: 'Question Bank', icon: 'book-open' },
    { path: '/question-reports', label: 'Reports', icon: 'flag' },
    { path: '/TEMP_LINKS', label: 'Temp Links', icon: 'link' },
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        {/* Logo/Brand */}
        <div className="admin-navbar-brand">
          <span className="admin-navbar-icon"><Icon name="settings" size={18} /></span>
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
              <Icon name={link.icon} size={16} /> {link.label}
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
          {menuOpen ? <Icon name="x" size={20} /> : <Icon name="menu" size={20} />}
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
            <span className="mobile-link-icon"><Icon name={link.icon} size={18} /></span>
            {link.label}
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
