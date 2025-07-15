import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';

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
    <nav style={{
      padding: '0 0 0 0',
      background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)',
      borderBottom: '2px solid #e0e7ef',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      minHeight: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '64px', paddingLeft: 24 }}>
        <button
          onClick={handleGoBack}
          style={{
            fontSize: '16px',
            padding: '8px 22px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 1px 4px rgba(37,99,235,0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8 0%, #0ea5e9 100%)'}
          onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)'}
        >
          &#8592; Go Back
        </button>
      </div>
      {user && user.username && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: 32,
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(90deg, #e0e7ef 0%, #f8fafc 100%)',
            borderRadius: '999px',
            padding: '7px 22px 7px 14px',
            fontWeight: 600,
            color: '#2563eb',
            fontSize: '16px',
            letterSpacing: '0.01em',
            boxShadow: '0 1px 3px rgba(37,99,235,0.04)',
            border: '1.5px solid #dbeafe',
          }}>
            <svg style={{ marginRight: 10 }} width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#2563eb" opacity="0.18"/><circle cx="12" cy="8" r="2.5" fill="#2563eb"/><ellipse cx="12" cy="17" rx="6.5" ry="4.5" fill="#2563eb" opacity="0.18"/></svg>
            {user.username}
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 