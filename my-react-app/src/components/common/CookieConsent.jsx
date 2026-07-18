import React, { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
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
        <div className="cookie-consent-overlay" role="dialog" aria-label="ملفات تعريف الارتباط | Cookies">
            <div className="cookie-consent-banner" dir="rtl">
                <div className="cookie-consent-text">
                    <span className="cookie-consent-icon" aria-hidden="true"><Icon name="cookie" size={18} /></span>
                    <p>
                        نستخدم الكوكيز لتحسين تجربتك وعرض إعلانات مخصصة.
                        {' '}<bdi>We use cookies to improve your experience.</bdi>{' '}
                        <a href="/privacy" className="cookie-consent-link">سياسة الخصوصية</a>
                    </p>
                </div>
                <div className="cookie-consent-actions">
                    <button onClick={acceptNecessary} className="cookie-btn cookie-btn-necessary">
                        الضرورية فقط
                    </button>
                    <button onClick={acceptAll} className="cookie-btn cookie-btn-accept">
                        قبول الكل
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
