import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { trackFunnel } from '../../utils/analytics.js';
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
    const [plans, setPlans] = useState([]); // [{id, months, priceHalalas}], from /api/payment/config
    const [currency, setCurrency] = useState('SAR');
    const [publishableKey, setPublishableKey] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [isTestMode, setIsTestMode] = useState(false);

    // /subscribe?kind=group&plan=group_3 is how the groups page hands off to
    // checkout. The default is the personal ladder — a group plan must never
    // surface here on its own, because this page says nothing about the invite
    // links a group buyer is really paying for.
    const params = new URLSearchParams(location.search);
    const kind = params.get('kind') === 'group' ? 'group' : 'individual';
    const requestedPlanId = params.get('plan');
    const isGroup = kind === 'group';

    // Fetch config + plan ladder once per session. Building the actual Moyasar
    // form is a separate effect keyed on selectedPlanId, so switching plans
    // re-inits the form with the new amount without re-fetching config.
    useEffect(() => {
        if (!user || !user.id || !sessionToken) {
            navigate('/login', { replace: true, state: { from: '/subscribe' } });
            return;
        }
        trackFunnel('subscribe_view', {
            reason: new URLSearchParams(location.search).get('reason') || null,
        });
        let cancelled = false;

        (async () => {
            try {
                const { data: cfg } = await axios.get(`${Globals.URL}/api/payment/config`, {
                    params: { kind },
                });
                if (cancelled) return;

                if (!cfg.enabled || !cfg.publishableKey || !cfg.plans?.length) {
                    navigate('/quizs', { replace: true });
                    return;
                }

                setPlans(cfg.plans);
                setCurrency(cfg.currency || 'SAR');
                setPublishableKey(cfg.publishableKey);
                setIsTestMode(String(cfg.publishableKey).startsWith('pk_test_'));
                // An explicit ?plan= wins (the groups page picked it), then the
                // recommended tier, then whatever is first.
                const asked = requestedPlanId && cfg.plans.find((p) => p.id === requestedPlanId);
                const recommended = cfg.plans.find((p) => p.id === t.recommendedPlan);
                setSelectedPlanId((asked || recommended || cfg.plans[0]).id);
            } catch (err) {
                if (cancelled) return;
                console.error('Subscribe init failed:', err);
                setError(t.loadError);
                setStatus('error');
            }
        })();

        return () => { cancelled = true; };
    }, [user, sessionToken, navigate]);

    // (Re)builds the embedded Moyasar form whenever the selected plan changes.
    useEffect(() => {
        if (!selectedPlanId || !publishableKey || !user?.id) return;
        const plan = plans.find((p) => p.id === selectedPlanId);
        if (!plan) return;

        let cancelled = false;
        let watchdog = null;
        setStatus('loading');

        (async () => {
            try {
                await loadMoyasarAssets();
                if (cancelled) return;

                // Clear first so a StrictMode/HMR remount — or switching plans —
                // can't stack two forms.
                const el = document.querySelector('.mysr-form');
                if (el) el.innerHTML = '';

                const planLabel = t.plans[plan.id]?.label || plan.id;
                // A group buyer goes back to /groups, where their new invite
                // links are — not to the quizzes dashboard, which would leave
                // them wondering what they just bought.
                const next = plan.kind === 'group' ? '?next=/groups' : '';
                window.Moyasar.init({
                    element: '.mysr-form',
                    amount: plan.priceHalalas,
                    currency,
                    description: t.paymentDescription(user.id, planLabel),
                    publishable_api_key: publishableKey,
                    callback_url: `${window.location.origin}/payment/callback${next}`,
                    methods: ['creditcard', 'applepay'],
                    supported_networks: ['visa', 'mastercard', 'mada'],
                    apple_pay: {
                        country: 'SA',
                        label: 'SMLE Question Bank',
                        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
                    },
                    // seats rides along so accounting can tell one payment that
                    // activated five accounts from one that activated one. The
                    // server never trusts it for entitlement — that comes from
                    // PLANS[plan.id].seats — it is a reporting label only.
                    metadata: {
                        account_id: String(user.id),
                        plan: plan.id,
                        seats: String(plan.seats || 1),
                    },
                });
                setStatus('ready');

                // Moyasar.init() resolves even when it then declines to build
                // the form. Confirm a real <form> actually landed, otherwise
                // fall back to a state that still tells the user what to do.
                watchdog = setTimeout(() => {
                    if (cancelled) return;
                    const form = document.querySelector('.mysr-form form');
                    if (!form) {
                        setStatus('blocked');
                        return;
                    }
                    // The funnel step used to be our own pay button; that button
                    // is gone (Moyasar's form has its own), so the submit of the
                    // real form is what marks the attempt now — and it is the
                    // truer signal of the two.
                    form.addEventListener('submit', () => {
                        trackFunnel('subscribe_pay_click', {
                            amountHalalas: plan.priceHalalas, plan: plan.id,
                        });
                    }, { once: true });
                }, 3000);
            } catch (err) {
                if (cancelled) return;
                console.error('Subscribe form init failed:', err);
                setError(t.loadError);
                setStatus('error');
            }
        })();

        return () => {
            cancelled = true;
            if (watchdog) clearTimeout(watchdog);
        };
    }, [selectedPlanId, publishableKey, currency, plans, user?.id]);

    const selectedPlan = plans.find((p) => p.id === selectedPlanId) || null;

    // A plan is "on offer" only when the server sent a compare-at price that is
    // genuinely higher than what it charges. Never derive this in the UI: the
    // struck-through number has to be a real former price, not decoration.
    const offer = (plan) => {
        if (!plan || !(Number(plan.compareAtHalalas) > Number(plan.priceHalalas))) return null;
        const was = plan.compareAtHalalas / 100;
        const now = plan.priceHalalas / 100;
        return { was, saved: was - now, pct: Math.round((1 - now / was) * 100) };
    };
    const selectedOffer = offer(selectedPlan);

    const selectPlan = (planId) => {
        if (planId === selectedPlanId) return;
        trackFunnel('subscribe_plan_select', { plan: planId });
        setSelectedPlanId(planId);
    };

    const riyals = selectedPlan ? selectedPlan.priceHalalas / 100 : null;
    // The student has spent their 40 free questions. Not an expiry and not a
    // lockout — their account still works — so the page only changes its
    // heading to acknowledge where they are.
    const allowanceSpent = params.get('reason') === 'free_allowance_exhausted'
        || user?.free_questions_remaining === 0;

    return (
        <div className="login-body" dir={dir}>
            <div className="login-wrapper">
                <div className="login-card subscribe-card">
                    <div className="login-header">
                        <span className="pill">{isGroup ? t.groupPill : t.pill}</span>
                        {isGroup ? (
                            <>
                                <h1 className="login-title">{t.groupTitle}</h1>
                                <p className="login-subtitle">{t.groupBody}</p>
                            </>
                        ) : allowanceSpent ? (
                            <>
                                <h1 className="login-title">{t.allowanceSpentTitle}</h1>
                                <p className="login-subtitle">{t.allowanceSpentBody}</p>
                            </>
                        ) : (
                            <>
                                <h1 className="login-title">{t.title}</h1>
                                <p className="login-subtitle">{t.body}</p>
                            </>
                        )}
                    </div>

                    {plans.length > 0 && (
                        <div className="subscribe-plans">
                            {plans.map((plan) => {
                                const planCopy = t.plans[plan.id];
                                if (!planCopy) return null;
                                const perMonth = Math.round((plan.priceHalalas / plan.months) / 100);
                                const planOffer = offer(plan);
                                return (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        className={`subscribe-plan${plan.id === selectedPlanId ? ' selected' : ''}${planOffer ? ' on-offer' : ''}`}
                                        onClick={() => selectPlan(plan.id)}
                                    >
                                        {/* An offer badge replaces the static one: a live
                                            discount is the stronger thing to say, and two
                                            badges on one tile would just fight each other. */}
                                        {planOffer ? (
                                            <span className="subscribe-plan-badge offer">{t.offerBadge(planOffer.pct)}</span>
                                        ) : planCopy.badge && (
                                            <span className="subscribe-plan-badge">{planCopy.badge}</span>
                                        )}
                                        <span className="subscribe-plan-label">{planCopy.label}</span>
                                        <span className="subscribe-plan-amount">
                                            {planOffer && <s className="subscribe-plan-was">{planOffer.was}</s>}
                                            {plan.priceHalalas / 100}
                                        </span>
                                        {plan.seats > 1 ? (
                                            // For a group the useful per-unit number is per ACCOUNT,
                                            // not per month — that is the comparison a buyer is making.
                                            <span className="subscribe-plan-permonth">
                                                {t.perSeat(Math.round((plan.priceHalalas / plan.seats) / 100))}
                                            </span>
                                        ) : plan.months > 1 && (
                                            <span className="subscribe-plan-permonth">{t.perMonth(perMonth)}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="subscribe-price">
                        {selectedOffer && <span className="subscribe-price-was">{selectedOffer.was}</span>}
                        <span className="subscribe-price-amount">{riyals != null ? riyals : '—'}</span>
                        <span className="subscribe-price-cur">{t.currency}</span>
                        <span className="subscribe-price-period">{selectedPlan ? t.plans[selectedPlan.id]?.period : ''}</span>
                    </div>

                    {selectedOffer && (
                        <p className="subscribe-save-note">{t.saveNote(selectedOffer.saved, selectedOffer.pct)}</p>
                    )}

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

                    {(status === 'error' || status === 'blocked') && (
                        <div className="subscribe-fallback">
                            <div className="alert-box error">
                                {status === 'blocked' ? t.blocked : error}
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary large"
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

                    {/* Moyasar renders the card form inside this element. It
                        carries its own pay button, so this page deliberately has
                        none of its own — a second one next to it only made
                        people wonder which of the two actually charges them.
                        Everything that is not the act of paying now sits below
                        it, so the form is the first thing under the price. */}
                    <div
                        className="mysr-form"
                        style={{ display: status === 'ready' ? 'block' : 'none' }}
                    />

                    <p className="subscribe-note">
                        {t.secureNoteBefore} <strong>{t.secureNoteProvider}</strong>{t.secureNoteAfter}
                    </p>

                    <ul className="subscribe-perks">
                        {(isGroup ? t.groupPerks : t.perks).map((perk) => <li key={perk}>{perk}</li>)}
                    </ul>

                    {/* Stated on every checkout, in both languages: nothing here
                        renews itself. It is a promise in the Terms, so the page
                        that takes the money has to make it too. */}
                    <p className="subscribe-norenew">{t.noAutoRenew}</p>

                    {/* Cross-link to the group plans. They are deliberately not
                        in this page's picker (nothing here explains the invite
                        links), so without this line a student buying for a study
                        group would never find out the option exists. */}
                    {isGroup ? (
                        <Link to="/subscribe" className="subscribe-crosslink">
                            <Icon name="user" size={15} />
                            {t.crossToIndividual}
                        </Link>
                    ) : (
                        <Link to="/groups" className="subscribe-crosslink">
                            <Icon name="users" size={15} />
                            {t.crossToGroup}
                        </Link>
                    )}
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
