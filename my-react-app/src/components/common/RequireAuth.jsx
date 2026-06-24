import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Spinner from './Spinner.jsx';

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
          background: 'var(--bg, #0f172a)',
        }}
        aria-busy="true"
        aria-live="polite"
      >
        <Spinner size="md" />
      </div>
    );
  }

  if (!user || !sessionToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Subscription gate. `accessAllowed === false` is set only by a fresh login
  // under payment enforcement for an unpaid/expired account; it funnels the
  // user to the paywall. `undefined` (legacy stored sessions, and the
  // grandfathered/admin/active cases) passes through untouched, so no one is
  // locked out mid-session. Never redirect while already on the paywall flow.
  const onPaywall =
    location.pathname.startsWith('/subscribe') || location.pathname.startsWith('/payment');
  if (user.accessAllowed === false && !onPaywall) {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
};

export default RequireAuth;
