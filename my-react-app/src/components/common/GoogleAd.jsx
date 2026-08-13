import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { safeGetItem } from '../../utils/safeStorage.js';

const ADSENSE_SCRIPT_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9286976335875618';
const ADSENSE_CLIENT_ID = 'ca-pub-9286976335875618';

// Strict allowlist: only long-form publisher content pages.
const AD_ELIGIBLE_PATHS = new Set([
  '/guides',
  '/guides/smle-study-plan',
  '/guides/wrong-questions-method',
  '/guides/smle-vs-prometric-differences',
  '/guides/smle-high-yield-topics'
]);

// Defense-in-depth: hard block utility, auth, and interactive exam paths.
const AD_BLOCKED_PREFIXES = [
  '/login',
  '/signup',
  '/contact',
  '/suggestions',
  '/quizs',
  '/quiz',
  '/analysis',
  '/wrong-questions',
  '/ADD',
  '/admin',
  '/Bank',
  '/TEMP_LINKS'
];

const isConsentAccepted = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return safeGetItem('cookie-consent') === 'accepted';
};

const ensureAdSenseScript = () => {
  if (typeof document === 'undefined') {
    return;
  }
  const existing = document.querySelector(`script[src="${ADSENSE_SCRIPT_SRC}"]`);
  if (existing) {
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = ADSENSE_SCRIPT_SRC;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

/**
 * GoogleAd Component - AdSense Compliant
 * 
 * IMPORTANT: Only show ads on pages with substantial publisher content.
 * Do NOT show ads on:
 * - Loading screens
 * - Error screens
 * - Empty states
 * - Under construction pages
 * 
 * @param {boolean} disabled - Set to true to prevent ad from showing (for loading/error states)
 * @param {number} minContentLength - Minimum content on page before showing ad (default: check for substantial content)
 */
const GoogleAd = ({ disabled = false }) => {
  const location = useLocation();
  // eligible: path + consent say an ad COULD render here — decided
  // synchronously, so the space for it is reserved from first paint instead
  // of only once shouldShow flips true a second later. That's what was
  // causing the layout shift: nothing was reserved, then a full ad block
  // popped in and pushed the article text down.
  const [eligible, setEligible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const insRef = useRef(null);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') {
      setEligible(false);
      setShouldShow(false);
      return undefined;
    }

    const evaluate = () => {
      const currentPath = location.pathname;
      const isBlockedPath = AD_BLOCKED_PREFIXES.some((prefix) => currentPath.startsWith(prefix));
      if (isBlockedPath || !AD_ELIGIBLE_PATHS.has(currentPath) || !isConsentAccepted()) {
        setEligible(false);
        setShouldShow(false);
        return;
      }
      setEligible(true);

      // Small delay to ensure page content is loaded
      const timer = setTimeout(() => {
        // Check if the page has substantial content (AdSense policy requirement)
        const mainContent = document.querySelector('.guides-page, .guide-article');

        if (mainContent) {
          // Require substantial text content before displaying ads.
          const textContent = mainContent.innerText || '';
          const hasSubstantialContent = textContent.length > 1400;

          // Check we're not on a loading or error state
          const isLoading = document.querySelector('.loading-spinner, .loading-content');
          const isError = document.querySelector('.error-content, .error-screen');
          const hasFormOnlyPattern = !!document.querySelector('form') && textContent.length < 1800;

          if (hasSubstantialContent && !isLoading && !isError && !hasFormOnlyPattern) {
            setShouldShow(true);
          }
        }
      }, 1000); // Wait for content to render
      return () => clearTimeout(timer);
    };

    const cleanup = evaluate();
    // A visitor who accepts the cookie banner AFTER this component already
    // mounted (and decided isConsentAccepted() === false) used to never see
    // an ad on that page view — this re-runs the same check the moment
    // consent changes, same-tab, without needing a navigation.
    window.addEventListener('sqb:consent-changed', evaluate);
    return () => {
      cleanup?.();
      window.removeEventListener('sqb:consent-changed', evaluate);
    };
  }, [disabled, location.pathname]);

  useEffect(() => {
    // Only load ads in production and when conditions are met
    if (shouldShow && import.meta.env.PROD) {
      try {
        ensureAdSenseScript();
        // Guard against pushing to an already-initialized ins element (SPA re-mounts)
        if (insRef.current && !insRef.current.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.error('Ad could not be loaded', e);
      }
    }
  }, [shouldShow]);

  // Nothing reserved on ineligible pages (admin, quiz, auth, ...) or once
  // consent/content checks come back negative and there is genuinely no ad.
  if (!eligible) {
    return null;
  }

  return (
    <div
      className="ad-container"
      // min-height matches a typical AdSense auto-responsive unit so this
      // box is already the right size before the <ins> below has anything
      // in it — the layout shift was never the ad's fault, it was this
      // wrapper having no size of its own while waiting.
      style={{ marginTop: '2rem', marginBottom: '1rem', minHeight: shouldShow ? undefined : 280 }}
    >
      {shouldShow && (
        // TODO(ads): data-ad-slot is required for a manual AdSense unit to
        // serve at all — this was shipped without one. Create a display ad
        // unit in the AdSense dashboard for these guide pages and set its
        // slot id here (or via an env var) rather than leaving format="auto"
        // to carry the whole placement.
        <ins className="adsbygoogle"
          ref={insRef}
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      )}
    </div>
  );
};

export default GoogleAd;
