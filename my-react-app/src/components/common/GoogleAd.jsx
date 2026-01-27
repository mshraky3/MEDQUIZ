import React, { useEffect, useState } from 'react';

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

    // Small delay to ensure page content is loaded
    const timer = setTimeout(() => {
      // Check if the page has substantial content (AdSense policy requirement)
      const mainContent = document.querySelector('.quiz-container, .analysis-wrapper, .quizs-wrapper, .landing-body');

      if (mainContent) {
        // Check for minimum text content (at least 300 characters of actual content)
        const textContent = mainContent.innerText || '';
        const hasSubstantialContent = textContent.length > 300;

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
    if (shouldShow && process.env.NODE_ENV === 'production') {
      try {
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
        data-ad-client="ca-pub-9286976335875618"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAd;
