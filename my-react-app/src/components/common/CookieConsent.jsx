import React, { useState, useEffect } from 'react';
import './CookieConsent.css';
import { safeGetItem, safeSetItem } from '../../utils/safeStorage.js';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = safeGetItem('cookie-consent');
        if (!consent) {
            // Small delay so banner appears after page loads
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        safeSetItem('cookie-consent', 'accepted');
        safeSetItem('cookie-consent-date', new Date().toISOString());
        setShowBanner(false);
    };

    const acceptNecessary = () => {
        safeSetItem('cookie-consent', 'necessary-only');
        safeSetItem('cookie-consent-date', new Date().toISOString());
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="cookie-consent-overlay">
            <div className="cookie-consent-banner">
                <div className="cookie-consent-content">
                    <div className="cookie-consent-icon">🍪</div>
                    <div className="cookie-consent-text">
                        <h3>نستخدم ملفات تعريف الارتباط | We use cookies</h3>
                        <p>
                            نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك على موقعنا وعرض إعلانات مخصصة عبر Google AdSense.
                            بالنقر على "قبول الكل"، فإنك توافق على استخدام جميع ملفات تعريف الارتباط.
                        </p>
                        <p>
                            We use cookies to improve your experience and display personalized ads through Google AdSense.
                            By clicking "Accept All", you consent to the use of all cookies.
                        </p>
                        <a href="/privacy" className="cookie-consent-link">
                            سياسة الخصوصية | Privacy Policy
                        </a>
                    </div>
                </div>
                <div className="cookie-consent-actions">
                    <button onClick={acceptNecessary} className="cookie-btn cookie-btn-necessary">
                        الضرورية فقط | Necessary Only
                    </button>
                    <button onClick={acceptAll} className="cookie-btn cookie-btn-accept">
                        قبول الكل | Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
