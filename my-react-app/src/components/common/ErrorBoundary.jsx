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
          background: '#eef2fb'
        }}>
          <div style={{
            background: '#ffffff',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '500px',
            border: '1px solid #d4deee',
            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)'
          }}>
            <h1 style={{ color: '#dc2626', marginBottom: '20px', fontSize: '1.8rem' }}>حدث خطأ غير متوقع</h1>
            <p style={{ color: '#475569', marginBottom: '30px', lineHeight: '1.6' }}>
              حدث خطأ أثناء تحميل هذه الصفحة.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                }}
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  background: '#eef2fb',
                  color: '#1e293b',
                  border: '1px solid #d4deee',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                إعادة تحميل
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
      background: '#eef2fb'
    }}>
      <div style={{
        background: '#ffffff',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '500px',
        border: '1px solid #d4deee',
        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)'
      }}>
        <h1 style={{ color: '#dc2626', marginBottom: '20px', fontSize: '1.8rem' }}>حدث خطأ غير متوقع</h1>
        <p style={{ color: '#475569', marginBottom: '30px', lineHeight: '1.6' }}>
          {error?.status === 404
            ? 'الصفحة المطلوبة غير موجودة.'
            : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
          }
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
            }}
          >
            Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 24px',
              background: '#eef2fb',
              color: '#1e293b',
              border: '1px solid #d4deee',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
};

// Export both - RouteErrorBoundary as default for react-router
export default RouteErrorBoundary;
export { RenderErrorBoundary }; 