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
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={handleGoBack} className="back-button">
          &#8592; Go Back
        </button>
        <Link to="/" className="navbar-brand">SQB</Link>
      </div>
      
      <div className="navbar-center">
        <div className={`navbar-nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/faq" className="nav-link" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
        </div>
      </div>

      <div className="navbar-right">
        {user && user.username && (
          <span className="user-info">
            <svg className="user-icon" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#2563eb" opacity="0.18"/>
              <circle cx="12" cy="8" r="2.5" fill="#2563eb"/>
              <ellipse cx="12" cy="17" rx="6.5" ry="4.5" fill="#2563eb" opacity="0.18"/>
            </svg>
            {user.username}
          </span>
        )}
        <button 
          className="navbar-hamburger" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 