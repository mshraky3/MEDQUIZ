import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Icon from './Icon.jsx';
import './TrialBanner.css';

/**
 * Slim countdown banner shown while a signup free trial is active.
 * Purely cosmetic — the server (subscriptionGuard) is what actually cuts
 * access off; this just gives the user a heads-up before that happens.
 */
const TrialBanner = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [msLeft, setMsLeft] = useState(null);

  const isTrial = user?.subscription_status === 'trial' && user?.subscription_expiry_date;
  const onPaywall = location.pathname.startsWith('/subscribe') || location.pathname.startsWith('/payment');
  // Mid-quiz expiry grace: never yank the user off an in-progress quiz — they
  // finish it (and see their results) first; the paywall catches them on the
  // next navigation. The server stays the real gate for API access.
  const onQuiz = location.pathname.startsWith('/quiz/');

  useEffect(() => {
    if (!isTrial) return undefined;

    const expiryMs = new Date(user.subscription_expiry_date).getTime();
    const tick = () => setMsLeft(Math.max(0, expiryMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isTrial, user?.subscription_expiry_date]);

  useEffect(() => {
    if (msLeft === 0 && !onPaywall && !onQuiz) {
      setUser({ ...user, accessAllowed: false }, localStorage.getItem('sessionToken'));
      navigate('/subscribe?reason=trial_expired', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msLeft, onPaywall, onQuiz]);

  if (!isTrial || msLeft === null || onPaywall) return null;

  // Expired mid-quiz: stay visible with a grace message instead of vanishing.
  if (msLeft <= 0) {
    if (!onQuiz) return null;
    return (
      <div className="trial-banner trial-banner-urgent" dir="rtl" role="status">
        <span className="trial-banner-text">
          <Icon name="clock" size={16} />
          انتهت تجربتك المجانية — أكمل اختبارك الحالي وشاهد نتيجتك
        </span>
        <button type="button" className="trial-banner-cta" onClick={() => navigate('/subscribe')}>
          اشترك الآن
        </button>
      </div>
    );
  }

  const totalSeconds = Math.floor(msLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const urgent = msLeft <= 5 * 60 * 1000;

  return (
    <div className={`trial-banner${urgent ? ' trial-banner-urgent' : ''}`} dir="rtl" role="status">
      <span className="trial-banner-text">
        <Icon name="clock" size={16} />
        تجربة مجانية — {minutes}:{seconds.toString().padStart(2, '0')} متبقية
      </span>
      <button type="button" className="trial-banner-cta" onClick={() => navigate('/subscribe')}>
        اشترك الآن
      </button>
    </div>
  );
};

export default TrialBanner;
