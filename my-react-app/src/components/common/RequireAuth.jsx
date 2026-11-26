import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { trackFunnel } from '../../utils/analytics.js';
import { callbackSignal } from '../../utils/paymentSignals.js';
import Spinner from './Spinner.jsx';
import FreeAllowanceBanner from './FreeAllowanceBanner.jsx';

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

  // Logging only. A return from the payment gateway with no session (another
  // browser or an in-app browser, cleared storage) is redirected below before
  // PaymentCallback can record anything.
  const lostPaymentReturn = authReady && (!user || !sessionToken)
    && location.pathname === '/payment/callback';
  useEffect(() => {
    if (!lostPaymentReturn) return;
    trackFunnel('payment_return_no_session', {
      stage: 'callback_no_session', ...callbackSignal(location.search),
    });
  }, [lostPaymentReturn, location.search]);

  if (!authReady) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg, #eef2fb)',
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

  // NOTE: there is deliberately no subscription redirect here.
  //
  // This used to bounce any account with `accessAllowed === false` to
  // /subscribe, which meant an unpaid student could not reach their own
  // analytics, their wrong-question list or the free lessons. The free tier
  // replaced that: not paying limits QUIZZES (enforced by the server's 402 on
  // /api/questions), never the account. Do not reintroduce a redirect here.

  return (
    <>
      <FreeAllowanceBanner />
      {children}
    </>
  );
};

export default RequireAuth;
