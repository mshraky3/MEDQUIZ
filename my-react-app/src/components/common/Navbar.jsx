import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

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
      </div>
      {user && user.username && (
        <div className="navbar-right">
          <span className="user-info">
            <svg className="user-icon" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#2563eb" opacity="0.18"/>
              <circle cx="12" cy="8" r="2.5" fill="#2563eb"/>
              <ellipse cx="12" cy="17" rx="6.5" ry="4.5" fill="#2563eb" opacity="0.18"/>
            </svg>
            {user.username}
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 