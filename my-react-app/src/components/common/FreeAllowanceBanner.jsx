import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
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
  // 10-question quiz reads as broken.
  useEffect(() => {
    if (!user?.id || !sessionToken) return undefined;
    let cancelled = false;
    axios.get(`${Globals.URL}/api/user-subscription/${user.id}`, {
      params: { username: user.username },
      headers: { Authorization: `Bearer ${sessionToken}` },
    }).then(({ data }) => {
      if (cancelled) return;
      if (!data?.enforcement) { setRemaining(null); return; }
      const left = data.user?.freeQuestionsRemaining;
      setRemaining(typeof left === 'number' ? left : null);
    }).catch(() => { /* keep whatever we last knew — this is a heads-up, not a gate */ });
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
