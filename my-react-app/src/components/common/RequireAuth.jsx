import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';

/**
 * Route guard for authenticated-only pages.
 *
 * Behavior:
 *  - While auth state is still hydrating from localStorage (authReady === false)
 *    we render a lightweight loader instead of deciding — this prevents a logged-in
 *    user from being bounced to /login on the very first render.
 *  - Once hydrated, an unauthenticated visitor is redirected to /login with
 *    `replace` so the protected URL does not stay in the history stack (closing
 *    the back/forward and "About → الرئيسية" bypass paths).
 *  - The attempted path is passed in location state so /login can return the user
 *    after a successful sign-in.
 */
const RequireAuth = ({ children }) => {
  const { user, sessionToken, authReady } = useContext(UserContext);
  const location = useLocation();

  if (!authReady) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg, #0b1021)',
        }}
        aria-busy="true"
        aria-live="polite"
      >
        <span
          style={{
            width: 36,
            height: 36,
            border: '3px solid rgba(255,255,255,0.15)',
            borderTopColor: 'var(--accent, #22d3ee)',
            borderRadius: '50%',
            animation: 'requireauth-spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes requireauth-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user || !sessionToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default RequireAuth;
