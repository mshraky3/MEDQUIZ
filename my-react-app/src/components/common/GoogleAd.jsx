import React, { useEffect } from 'react';

const GoogleAd = () => {
  useEffect(() => {
    // Only load ads in production and when not blocked
    if (process.env.NODE_ENV === 'production') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Ad could not be loaded', e);
      }
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-9286976335875618"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default GoogleAd;
