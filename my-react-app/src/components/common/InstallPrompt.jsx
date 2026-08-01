import React, { useCallback, useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { safeGetItem, safeSetItem } from '../../utils/safeStorage.js';
import { useCopy, useLang } from '../../i18n';
import installCopy from '../../i18n/copy/install.js';
import './InstallPrompt.css';

const DISMISS_KEY = 'sqb_install_dismissed_at';
const REPROMPT_DAYS = 14;

const isStandaloneMode = () =>
    (typeof window !== 'undefined' &&
        (window.matchMedia?.('(display-mode: standalone)').matches ||
            window.navigator.standalone === true)) || false;

// iOS can't fire beforeinstallprompt, so we detect it to show manual steps.
// iPadOS 13+ masquerades as a Mac, so also treat touch-capable "Macs" as iOS.
const detectIOS = () => {
    if (typeof navigator === 'undefined') return { iOS: false, iOSSafari: false };
    const ua = navigator.userAgent || '';
    const iOS =
        /iphone|ipad|ipod/i.test(ua) ||
        (/macintosh/i.test(ua) && typeof document !== 'undefined' && 'ontouchend' in document);
    // Only Safari on iOS can add to the home screen (Chrome/Firefox on iOS can't).
    const iOSSafari = iOS && /safari/i.test(ua) && !/crios|fxios|edgios/i.test(ua);
    return { iOS, iOSSafari };
};

/**
 * Shared install state. Captures Android's `beforeinstallprompt`, tracks whether
 * the app is already installed (standalone), and detects iOS.
 */
export function useInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [installed, setInstalled] = useState(isStandaloneMode());

    useEffect(() => {
        const onBeforeInstall = (e) => {
            e.preventDefault(); // stash it; we trigger the prompt from our own button
            setDeferredPrompt(e);
        };
        const onInstalled = () => {
            setInstalled(true);
            setDeferredPrompt(null);
        };
        window.addEventListener('beforeinstallprompt', onBeforeInstall);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstall);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!deferredPrompt) return false;
        deferredPrompt.prompt();
        try { await deferredPrompt.userChoice; } catch (_) { /* dismissed */ }
        setDeferredPrompt(null);
        return true;
    }, [deferredPrompt]);

    const { iOS, iOSSafari } = detectIOS();
    return {
        canInstallAndroid: !!deferredPrompt,
        isIOS: iOS,
        isIOSSafari: iOSSafari,
        isStandalone: installed,
        promptInstall
    };
}

// ---- Original inline step icons (no third-party/App Store imagery) ----
const ShareGlyph = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 15V3" /><path d="m8 7 4-4 4 4" />
        <path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
    </svg>
);
const DotsGlyph = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
    </svg>
);

/**
 * Floating, dismissible install banner. Shows on mobile only (Android install
 * button, or iOS manual hint); hidden when already installed or recently
 * dismissed.
 */
export default function InstallPrompt() {
    const { canInstallAndroid, isIOS, isStandalone, promptInstall } = useInstallPrompt();
    const t = useCopy(installCopy);
    const { dir } = useLang();
    const [hidden, setHidden] = useState(true); // hidden until we've read the dismissal

    useEffect(() => {
        const at = Number(safeGetItem(DISMISS_KEY) || 0);
        const fresh = !at || (Date.now() - at) > REPROMPT_DAYS * 86400000;
        setHidden(!fresh);
    }, []);

    if (isStandalone) return null;                 // already installed
    if (hidden) return null;                        // dismissed recently
    if (!canInstallAndroid && !isIOS) return null;  // nothing to offer (desktop / unsupported)

    const dismiss = () => {
        safeSetItem(DISMISS_KEY, String(Date.now()));
        setHidden(true);
    };

    return (
        <div className="install-banner" role="dialog" aria-label={t.bannerLabel} dir={dir}>
            <span className="install-banner-icon"><Icon name="home" size={20} /></span>
            <div className="install-banner-text">
                <strong>{t.bannerTitle}</strong>
                <span>
                    {isIOS
                        ? <>{t.bannerIOSBefore} <ShareGlyph /> {t.bannerIOSAfter}</>
                        : t.bannerAndroid}
                </span>
            </div>
            {canInstallAndroid && (
                <button className="install-banner-btn" onClick={promptInstall}>{t.install}</button>
            )}
            <button className="install-banner-close" onClick={dismiss} aria-label={t.close}>
                <Icon name="x" size={16} />
            </button>
        </div>
    );
}

/**
 * Inline landing-page section explaining how to add SQB to the home screen on
 * both iOS and Android, with a one-tap install button when the browser supports
 * it. Hidden when the app is already installed.
 */
export function InstallGuideSection() {
    const { canInstallAndroid, isStandalone, promptInstall } = useInstallPrompt();
    const t = useCopy(installCopy);
    if (isStandalone) return null;

    // The leading glyph of each step, in the order the steps are written.
    const iosIcons = [<ShareGlyph />, <Icon name="plus" size={18} />, <Icon name="check" size={18} />];
    const androidIcons = [<DotsGlyph />, <Icon name="home" size={18} />, <Icon name="check" size={18} />];

    const steps = (items, icons) => (
        <ol className="install-steps">
            {items.map((step, i) => (
                <li key={step}><span className="install-step-ic">{icons[i]}</span> {step}</li>
            ))}
        </ol>
    );

    return (
        <section className="install-section" aria-label={t.sectionLabel}>
            <div className="section-head">
                <p className="pill subtle">{t.pill}</p>
                <h2>{t.sectionTitle}</h2>
                <p>{t.sectionBody}</p>
            </div>

            <div className="install-guide-grid">
                <article className="install-guide-card">
                    <h3><span className="install-os"></span> {t.iosTitle}</h3>
                    {steps(t.iosSteps, iosIcons)}
                </article>

                <article className="install-guide-card">
                    <h3><span className="install-os"></span> {t.androidTitle}</h3>
                    {steps(t.androidSteps, androidIcons)}
                </article>
            </div>

            {canInstallAndroid && (
                <div className="install-section-cta">
                    <button className="btn primary" onClick={promptInstall}>
                        <Icon name="home" size={18} /> {t.installNow}
                    </button>
                </div>
            )}
        </section>
    );
}
