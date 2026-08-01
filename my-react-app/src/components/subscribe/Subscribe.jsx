import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import Spinner from '../common/Spinner.jsx';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang } from '../../i18n';
import supportCopy from '../../i18n/copy/support.js';
// The card shell (.login-card, .btn, .alert-box) lives in Login.css. Import it
// explicitly — landing on /subscribe directly would otherwise render unstyled.
import '../login/Login.css';
import './Subscribe.css';

// Moyasar embedded payment form (Moyasar.js). 1.16.0 is the latest CDN build
// that resolves; bump this if Moyasar publishes a newer one.
const MOYASAR_VERSION = '1.16.0';
const MOYASAR_CSS = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}/moyasar.css`;
const MOYASAR_JS = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}/moyasar.js`;

// Inject the Moyasar CSS + JS once, resolving when the global is ready.
function loadMoyasarAssets() {
    return new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-moyasar]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = MOYASAR_CSS;
            link.setAttribute('data-moyasar', 'true');
            document.head.appendChild(link);
        }
        if (window.Moyasar) return resolve();

        const existing = document.querySelector('script[data-moyasar]');
        if (existing) {
            existing.addEventListener('load', resolve);
            existing.addEventListener('error', () => reject(new Error('moyasar script error')));
            return;
        }
        const script = document.createElement('script');
        script.src = MOYASAR_JS;
        script.async = true;
        script.setAttribute('data-moyasar', 'true');
        script.onload = resolve;
        script.onerror = () => reject(new Error('moyasar script error'));
        document.body.appendChild(script);
    });
}

const Subscribe = () => {
    const { user, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const t = useCopy(supportCopy).subscribe;
    const { dir } = useLang();
    // loading  → fetching config / injecting Moyasar
    // ready    → the card form is on screen and usable
    // blocked  → Moyasar loaded but refused to render a form (e.g. non-HTTPS
    //            origin, or a live key on an unregistered domain). Without this
    //            state the page is a dead end: a price and no way to pay.
    // error    → config or asset load failed outright
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [priceHalalas, setPriceHalalas] = useState(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        // Payment is tied to a specific account, so a session is required.
        if (!user || !user.id || !sessionToken) {
            navigate('/login', { replace: true, state: { from: '/subscribe' } });
            return;
        }
        let cancelled = false;
        let watchdog = null;

        (async () => {
            try {
                const { data: cfg } = await axios.get(`${Globals.URL}/api/payment/config`);
                if (cancelled) return;

                // Enforcement off or misconfigured → no paywall, let them in.
                if (!cfg.enabled || !cfg.publishableKey) {
                    navigate('/quizs', { replace: true });
                    return;
                }

                setPriceHalalas(cfg.priceHalalas);
                setIsTestMode(String(cfg.publishableKey).startsWith('pk_test_'));

                await loadMoyasarAssets();
                if (cancelled) return;

                // Clear first so a StrictMode/HMR remount can't stack two forms.
                const el = document.querySelector('.mysr-form');
                if (el) el.innerHTML = '';

                window.Moyasar.init({
                    element: '.mysr-form',
                    amount: cfg.priceHalalas,
                    currency: cfg.currency || 'SAR',
                    description: t.paymentDescription(user.id),
                    publishable_api_key: cfg.publishableKey,
                    callback_url: `${window.location.origin}/payment/callback`,
                    methods: ['creditcard', 'applepay'],
                    supported_networks: ['visa', 'mastercard', 'mada'],
                    apple_pay: {
                        country: 'SA',
                        label: 'SMLE Question Bank',
                        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
                    },
                    metadata: { account_id: String(user.id), plan: 'annual' },
                });
                setStatus('ready');

                // Moyasar.init() resolves even when it then declines to build
                // the form. Confirm a real <form> actually landed, otherwise
                // fall back to a state that still tells the user what to do.
                watchdog = setTimeout(() => {
                    if (cancelled) return;
                    if (!document.querySelector('.mysr-form form')) {
                        setStatus('blocked');
                    }
                }, 3000);
            } catch (err) {
                if (cancelled) return;
                console.error('Subscribe init failed:', err);
                setError(t.loadError);
                setStatus('error');
            }
        })();

        return () => {
            cancelled = true;
            if (watchdog) clearTimeout(watchdog);
        };
    }, [user, sessionToken, navigate]);

    // Scroll the card form into view — on mobile the perks push it below the
    // fold, so the price is visible but the way to pay is not.
    const goToPaymentForm = () => {
        const el = formRef.current;
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.querySelector('input')?.focus({ preventScroll: true });
    };

    const riyals = priceHalalas != null ? priceHalalas / 100 : null;
    const trialEnded = new URLSearchParams(location.search).get('reason') === 'trial_expired'
        || user?.subscription_status === 'trial';

    return (
        <div className="login-body" dir={dir}>
            <div className="login-wrapper">
                <div className="login-card subscribe-card">
                    <div className="login-header">
                        <span className="pill">{t.pill}</span>
                        {trialEnded ? (
                            <>
                                <h1 className="login-title">{t.trialEndedTitle}</h1>
                                <p className="login-subtitle">{t.trialEndedBody}</p>
                            </>
                        ) : (
                            <>
                                <h1 className="login-title">{t.title}</h1>
                                <p className="login-subtitle">{t.body}</p>
                            </>
                        )}
                    </div>

                    <div className="subscribe-price">
                        <span className="subscribe-price-amount">{riyals != null ? riyals : '—'}</span>
                        <span className="subscribe-price-cur">{t.currency}</span>
                        <span className="subscribe-price-period">{t.period}</span>
                    </div>

                    <ul className="subscribe-perks">
                        {t.perks.map((perk) => <li key={perk}>{perk}</li>)}
                    </ul>

                    {isTestMode && (
                        <div className="subscribe-test-banner">
                            {t.testBannerBefore} <strong dir="ltr">4111 1111 1111 1111</strong> {t.testBannerAfter}
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="subscribe-loading">
                            <Spinner size="md" />
                            <span>{t.loadingForm}</span>
                        </div>
                    )}

                    {/* Primary CTA — the page must never show a price without an
                        obvious next step, on any screen size. */}
                    {status === 'ready' && (
                        <button
                            type="button"
                            className="btn primary large subscribe-cta"
                            onClick={goToPaymentForm}
                        >
                            <Icon name="lock" size={18} />
                            {riyals != null ? t.payCta(t.amountWithCurrency(riyals)) : t.payCtaPlain}
                        </button>
                    )}

                    {(status === 'error' || status === 'blocked') && (
                        <div className="subscribe-fallback">
                            <div className="alert-box error">
                                {status === 'blocked' ? t.blocked : error}
                            </div>
                            <button
                                type="button"
                                className="btn primary large"
                                onClick={() => window.location.reload()}
                            >
                                <Icon name="refresh" size={18} />
                                {t.reload}
                            </button>
                            <Link to="/contact" className="btn subscribe-fallback-secondary">
                                {t.contactUs}
                            </Link>
                        </div>
                    )}

                    {/* Moyasar renders the card form inside this element */}
                    <div
                        ref={formRef}
                        className="mysr-form"
                        style={{ display: status === 'ready' ? 'block' : 'none' }}
                    />

                    <p className="subscribe-note">
                        {t.secureNoteBefore} <strong>{t.secureNoteProvider}</strong>{t.secureNoteAfter}
                    </p>
                    <p className="subscribe-policy">
                        {t.policyBefore}{' '}
                        <Link to="/terms" target="_blank" rel="noopener">{t.terms}</Link>{' '}{t.and}{' '}
                        <Link to="/refund-policy" target="_blank" rel="noopener">{t.refund}</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;
