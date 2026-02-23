import React, { Component } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { reportRenderError } from '../../utils/errorTracking';

// Class-based Error Boundary for catching render errors
class RenderErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Report render error to backend
    reportRenderError(error, errorInfo);

    console.error('React render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          textAlign: 'center',
          background: '#0b1021'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '500px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}>
            <h1 style={{ color: '#f87171', marginBottom: '20px', fontSize: '1.8rem' }}>Oops! Something went wrong</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.6' }}>
              An unexpected error occurred while rendering this page.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(34, 211, 238, 0.3)'
                }}
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route Error Boundary (for react-router errors)
const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Report route error
  React.useEffect(() => {
    if (error) {
      console.error('Routing error:', error);
      reportRenderError(
        error instanceof Error ? error : new Error(String(error)),
        { componentStack: 'RouteErrorBoundary' }
      );
    }
  }, [error]);

  // If no error, render nothing (let the route render normally)
  if (!error) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      background: '#0b1021'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '500px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        <h1 style={{ color: '#f87171', marginBottom: '20px', fontSize: '1.8rem' }}>Oops! Something went wrong</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.6' }}>
          {error?.status === 404
            ? 'The page you are looking for does not exist.'
            : 'An unexpected error occurred. Please try again.'
          }
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(34, 211, 238, 0.3)'
            }}
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Export both - RouteErrorBoundary as default for react-router
export default RouteErrorBoundary;
export { RenderErrorBoundary }; 