import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    if (location.pathname === '/quizs') {
      navigate('/login');
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
      flexDirection: 'row-reverse',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '64px', paddingRight: 24 }}>
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: 32,
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
          <svg style={{ marginRight: 10 }} width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke="#2563eb" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Admin Dashboard
        </span>
      </div>
    </nav>
  );
};

export default AdminNavbar;
