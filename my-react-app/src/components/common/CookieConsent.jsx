import React, { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import './CookieConsent.css';
import { safeGetItem, safeSetItem } from '../../utils/safeStorage.js';
import { useCommon, useLang } from '../../i18n';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);
    const t = useCommon();
    const { dir } = useLang();

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
        // A same-tab localStorage write fires no 'storage' event (that's
        // cross-tab only), so anything that gated on consent at its own
        // mount — GoogleAd — would otherwise never learn the answer changed
        // until the visitor navigated to a fresh mount.
        window.dispatchEvent(new Event('sqb:consent-changed'));
    };

    const acceptNecessary = () => {
        safeSetItem('cookie-consent', 'necessary-only');
        safeSetItem('cookie-consent-date', new Date().toISOString());
        setShowBanner(false);
        window.dispatchEvent(new Event('sqb:consent-changed'));
    };

    if (!showBanner) return null;

    return (
        <div className="cookie-consent-overlay" role="dialog" aria-label={t.cookies.dialogLabel}>
            <div className="cookie-consent-banner" dir={dir}>
                <div className="cookie-consent-text">
                    <span className="cookie-consent-icon" aria-hidden="true"><Icon name="cookie" size={18} /></span>
                    <p>
                        {t.cookies.text}{' '}
                        <a href="/privacy" className="cookie-consent-link">{t.cookies.privacyLink}</a>
                    </p>
                </div>
                <div className="cookie-consent-actions">
                    <button onClick={acceptNecessary} className="cookie-btn cookie-btn-necessary">
                        {t.cookies.necessaryOnly}
                    </button>
                    <button onClick={acceptAll} className="cookie-btn cookie-btn-accept">
                        {t.cookies.acceptAll}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
