import React, { useEffect, useState } from 'react';
import { safeGetItem } from '../../utils/safeStorage.js';

const ADSENSE_SCRIPT_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9286976335875618';
const ADSENSE_CLIENT_ID = 'ca-pub-9286976335875618';

// Keep ads off utility/auth/interactive-only views.
const AD_ELIGIBLE_PATHS = new Set([
  '/',
  '/guides',
  '/guides/smle-study-plan',
  '/guides/wrong-questions-method',
  '/about',
  '/faq',
  '/contact',
  '/privacy',
  '/terms'
]);

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
  const [shouldShow, setShouldShow] = useState(false);
  useEffect(() => {
    // Don't show if explicitly disabled
    if (disabled) {
      setShouldShow(false);
      return;
    }
    if (typeof window === 'undefined') {
      setShouldShow(false);
      return;
    }

    const currentPath = window.location.pathname;
    if (!AD_ELIGIBLE_PATHS.has(currentPath) || !isConsentAccepted()) {
      setShouldShow(false);
      return;
    }

    // Small delay to ensure page content is loaded
    const timer = setTimeout(() => {
      // Check if the page has substantial content (AdSense policy requirement)
      const mainContent = document.querySelector('.landing-body, .legal-page, .faq-page, .contact-container, .guides-page, .guide-article');

      if (mainContent) {
        // Require substantial text content before displaying ads.
        const textContent = mainContent.innerText || '';
        const hasSubstantialContent = textContent.length > 1200;

        // Check we're not on a loading or error state
        const isLoading = document.querySelector('.loading-spinner, .loading-content');
        const isError = document.querySelector('.error-content, .error-screen');

        if (hasSubstantialContent && !isLoading && !isError) {
          setShouldShow(true);
        }
      }
    }, 1000); // Wait for content to render

    return () => clearTimeout(timer);
  }, [disabled]);

  useEffect(() => {
    // Only load ads in production and when conditions are met
    if (shouldShow && import.meta.env.PROD) {
      try {
        ensureAdSenseScript();
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Ad could not be loaded', e);
      }
    }
  }, [shouldShow]);

  // Don't render anything if conditions not met
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="ad-container" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAd;
