import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import Icon from './Icon.jsx';
import { useCommon, useLang } from '../../i18n';
import './FreeAllowanceBanner.css';

/**
 * Slim banner showing how many free questions an account has left.
 *
 * Replaces TrialBanner, and is deliberately much less machinery: the old banner
 * ran a per-second countdown, an idle detector and a 20-second heartbeat,
 * because the trial was a budget of engaged time that only the client could
 * observe. An allowance is spent by answering questions, which the server
 * already sees, so this only has to display a number the server sends.
 *
 * It NEVER redirects. The old banner navigated to /subscribe when the clock hit
 * zero — that was the lockout, and the lockout is the thing the free tier
 * removes. Running out of questions means quizzes stop; the account, the
 * analytics and the free lessons stay open, so there is nowhere to send anyone.
 */
// Module-level, not component state: RequireAuth (which renders this banner)
// sits inside main.jsx's per-route <Layout>, so it remounts on every
// navigation — this throttle is what survives that remount and actually
// limits the request rate, since a fresh dependency-array comparison on a
// freshly-mounted effect never counts as "unchanged".
const MIN_REFETCH_MS = 20_000;
let lastFetchedAt = 0;

const FreeAllowanceBanner = () => {
  const { user, sessionToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const t = useCommon();
  const { dir } = useLang();
  const [remaining, setRemaining] = useState(
    typeof user?.free_questions_remaining === 'number' ? user.free_questions_remaining : null
  );

  // null remaining = unlimited (paid, admin-created or grandfathered).
  const isFree = remaining !== null;
  const onPaywall = location.pathname.startsWith('/subscribe')
    || location.pathname.startsWith('/payment')
    || location.pathname.startsWith('/groups');

  // Re-sync from the server on navigation: the stored login snapshot goes stale
  // the moment a quiz is submitted, and a banner that still says 40 after a
  // 10-question quiz reads as broken. Throttled — this used to fire on every
  // single route change (RequireAuth, which renders this, remounts on every
  // navigation), not just the ones after a quiz.
  useEffect(() => {
    if (!user?.id || !sessionToken) return undefined;
    if (Date.now() - lastFetchedAt < MIN_REFETCH_MS) return undefined;
    lastFetchedAt = Date.now();
    let cancelled = false;
    // Plain fetch, not axios — this banner is rendered by RequireAuth, which
    // is eagerly bundled (every authed route wraps its page in it), so a
    // static axios import here shipped the 34KB library to every visitor,
    // including ones on public pages who are never signed in.
    const url = new URL(`${Globals.URL}/api/user-subscription/${user.id}`);
    url.searchParams.set('username', user.username);
    fetch(url, { headers: { Authorization: `Bearer ${sessionToken}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (cancelled) return;
        if (!data?.enforcement) { setRemaining(null); return; }
        const left = data.user?.freeQuestionsRemaining;
        setRemaining(typeof left === 'number' ? left : null);
      })
      .catch(() => { /* keep whatever we last knew — this is a heads-up, not a gate */ });
    return () => { cancelled = true; };
  }, [user?.id, user?.username, sessionToken, location.pathname]);

  if (!isFree || onPaywall) return null;

  const usedUp = remaining <= 0;

  return (
    <div className={`allowance-banner${usedUp ? ' allowance-banner-spent' : ''}`} dir={dir} role="status">
      <span className="allowance-banner-text">
        <Icon name={usedUp ? 'lock' : 'help-circle'} size={16} />
        {usedUp ? t.freeAllowance.spent : t.freeAllowance.remaining(remaining)}
      </span>
      <button type="button" className="allowance-banner-cta" onClick={() => navigate('/subscribe')}>
        {t.freeAllowance.cta}
      </button>
    </div>
  );
};

export default FreeAllowanceBanner;
