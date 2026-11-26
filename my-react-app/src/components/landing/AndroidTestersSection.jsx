import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import { useCopy, LocaleLink as Link } from '../../i18n';
import androidTestersCopy from '../../i18n/copy/androidTesters.js';
import { androidAppConfig, testerSteps } from '../../utils/androidApp.js';
import { looksLikeEmail, joinErrorKey } from '../../utils/androidTesters.js';
import { ANDROID_ANCHOR, ANDROID_SIGNUP_PATH, rememberAndroidReturn, clearAndroidReturn } from '../../utils/androidReturn.js';
import { trackFunnel } from '../../utils/analytics.js';
import { safeGetSessionItem, safeSetSessionItem } from '../../utils/safeStorage.js';
import './AndroidTestersSection.css';

// Build-time links of the "next steps": see utils/androidApp.js.
const CONFIG = androidAppConfig(import.meta.env || {});

/**
 * The Android testers offer. The whole join happens here: a visitor creates an
 * account and is brought back to #android-testers, then types their Google Play
 * e-mail and sees the next steps. The study home opens this same section from
 * its small card (AndroidTestersHubCard.jsx) with placement="hub".
 *
 * What to show comes from useAndroidOffer.js (the API is the switch).
 */
const AndroidTestersSection = ({ offer, placement = 'landing' }) => {
    const t = useCopy(androidTestersCopy);
    const { hash } = useLocation();
    const { view, status, setStatus, username, sessionToken } = offer;
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const sectionRef = useRef(null);
    const scrolled = useRef(false);

    const visible = view !== 'hidden';

    // Back from signup (or a shared /#android-testers link): the section only
    // exists after the API answers, so the browser's own jump has already missed.
    // The second pass covers the blocks above it that load a moment later.
    useEffect(() => {
        if (!visible || scrolled.current || hash !== `#${ANDROID_ANCHOR}`) return undefined;
        scrolled.current = true;
        clearAndroidReturn();
        const jump = () => sectionRef.current?.scrollIntoView({ block: 'start' });
        jump();
        const again = setTimeout(jump, 700);
        const stop = () => clearTimeout(again);
        window.addEventListener('touchstart', stop, { once: true, passive: true });
        window.addEventListener('wheel', stop, { once: true, passive: true });
        return () => {
            stop();
            window.removeEventListener('touchstart', stop);
            window.removeEventListener('wheel', stop);
        };
    }, [visible, hash]);

    // "Card seen": once per tab session for each state, and only when on screen.
    useEffect(() => {
        const node = sectionRef.current;
        // On the study home the small card has already counted the view.
        if (placement !== 'landing') return undefined;
        if (!visible || !node || typeof IntersectionObserver === 'undefined') return undefined;
        const key = `sqb_android_seen_${view}`;
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer.disconnect();
            if (safeGetSessionItem(key)) return;
            safeSetSessionItem(key, '1');
            trackFunnel('android_offer_view', { state: view });
        }, { threshold: 0.35 });
        observer.observe(node);
        return () => observer.disconnect();
    }, [visible, view, placement]);

    const clicked = (button) => trackFunnel('android_offer_click', { button, placement });

    const startSignup = () => {
        // Set here as well as on /signup, so the "already have an account? log in"
        // way through that page also comes back.
        rememberAndroidReturn(ANDROID_ANCHOR);
        clicked('signup');
        trackFunnel('landing_cta_signup_click', { placement: 'android_testers' });
    };

    const join = async (event) => {
        event.preventDefault();
        setError('');
        if (!looksLikeEmail(email)) { setError(t.errors.invalidEmail); return; }
        clicked('join');
        setBusy(true);
        try {
            const response = await fetch(`${Globals.URL}/api/android-testers/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionToken}` },
                body: JSON.stringify({ username, email: email.trim() }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.joined) {
                setError(t.errors[joinErrorKey(data.reason)] || t.errors.generic);
                return;
            }
            trackFunnel('android_offer_joined', { placement });
            setStatus((prev) => ({
                ...prev, joined: true, playEmail: data.playEmail, left: data.left, redeemed: false,
            }));
        } catch (_) {
            setError(t.errors.generic);
        } finally {
            setBusy(false);
        }
    };

    if (!visible) return null;

    const showOffer = view === 'guest' || view === 'join' || view === 'full';

    return (
        <section
            ref={sectionRef}
            id={ANDROID_ANCHOR}
            className={`atl-card atl-card--${view}`}
            aria-labelledby="atl-title"
        >
            <div className="atl-head">
                <span className="atl-icon" aria-hidden="true"><Icon name="phone" size={22} /></span>
                <div className="atl-heading">
                    <span className="atl-pill">{t.pill}</span>
                    <h2 id="atl-title" className="atl-title">{t.title}</h2>
                </div>
            </div>

            <div className="atl-grid">
                <div className="atl-info">
                    {showOffer && view !== 'full' ? <p className="atl-gift">{t.gift}</p> : null}
                    {showOffer ? <p className="atl-body">{t.body}</p> : null}
                    {showOffer ? <p className="atl-terms">{t.terms}</p> : null}
                    <p className="atl-saudi"><Icon name="alert-triangle" size={15} aria-hidden="true" /> {t.saudi}</p>
                </div>

                <div className="atl-action">
                    {view === 'guest' ? (
                        <>
                            <ol className="atl-steps">
                                {t.guestSteps.map((step) => <li key={step}><span>{step}</span></li>)}
                            </ol>
                            <Link className="btn primary atl-btn" to={ANDROID_SIGNUP_PATH} onClick={startSignup}>
                                {t.guestCta}
                            </Link>
                            <p className="atl-hint">{t.spots()}</p>
                        </>
                    ) : null}

                    {view === 'join' ? (
                        <form className="atl-form" onSubmit={join} noValidate>
                            <p className="atl-lead">{t.memberLead}</p>
                            <label className="atl-label" htmlFor="atl-email">{t.emailLabel}</label>
                            <input
                                id="atl-email"
                                className="atl-input"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                dir="auto"
                                value={email}
                                onChange={(ev) => setEmail(ev.target.value)}
                                aria-describedby="atl-hint"
                            />
                            <p id="atl-hint" className="atl-hint">
                                {t.emailHint} <Link to="/privacy">{t.privacyLink}</Link>
                            </p>
                            {error ? <p className="atl-error" role="alert">{error}</p> : null}
                            <button type="submit" className="btn primary atl-btn" disabled={busy}>
                                {busy ? t.joining : t.join}
                            </button>
                            <p className="atl-hint">{t.limit}</p>
                        </form>
                    ) : null}

                    {view === 'full' ? <p className="atl-full">{t.full}</p> : null}

                    {view === 'joined' ? (
                        <div className="atl-done" aria-live="polite">
                            <p className="atl-done-title"><Icon name="check-circle" size={18} /> {t.joinedTitle}</p>
                            <p className="atl-body">{t.savedAs} <bdi>{status.playEmail}</bdi></p>
                            <h3 className="atl-next">{t.nextTitle}</h3>
                            <ol className="atl-steps">
                                {testerSteps(CONFIG, t).map((step) => (
                                    <li key={step.key}>
                                        <span>{step.text}</span>
                                        {step.href ? (
                                            <a
                                                className="atl-link"
                                                href={step.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => clicked(step.key)}
                                            >
                                                {step.linkLabel}
                                            </a>
                                        ) : null}
                                        {step.missing ? <span className="atl-hint">{step.missing}</span> : null}
                                    </li>
                                ))}
                            </ol>
                            <p className="atl-hint">{t.monthNote}</p>
                        </div>
                    ) : null}

                    {view === 'redeemed' ? (
                        <div className="atl-done">
                            <p className="atl-done-title"><Icon name="check-circle" size={18} /> {t.redeemedTitle}</p>
                            <p className="atl-body">{t.redeemedBody}</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
};

export default AndroidTestersSection;
