import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Routing error:', error);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      background: '#f8fafc'
    }}>
      <h1 style={{ color: '#dc2626', marginBottom: '20px' }}>Oops! Something went wrong</h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>
        {error?.status === 404 
          ? 'The page you are looking for does not exist.'
          : 'An unexpected error occurred. Please try again.'
        }
      </p>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary; 