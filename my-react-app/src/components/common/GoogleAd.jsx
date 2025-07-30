import React, { useEffect } from 'react';

const GoogleAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Ad could not be loaded', e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-xxxxxxxxxx" // Replace with your ad client ID
      data-ad-slot="xxxxxxxxxx" // Replace with your ad slot ID
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
};

export default GoogleAd;
