import React, { useContext, useEffect, useRef, useState } from 'react';
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
/**
 * The price ladder a visitor was shown, as one sortable string:
 * `annual:30000,four_month:12900,monthly:5000` — id:halalas, id-sorted so the
 * same ladder always produces the same key no matter what order the API
 * returned. It goes into a funnel event because prices come from environment
 * variables, which keep no history: once PLAN_ANNUAL_PRICE_HALALAS changes,
 * nothing anywhere records what the people who didn't buy had been quoted.
 *
 * Read by backend/scripts/priceTestReport.js, which groups on it. Change the
 * format there and here together.
 */
const priceLadder = (plans) => (plans || [])
    .map((p) => `${p.id}:${p.priceHalalas}`)
    .sort()
    .join(',');

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
    // React owns this host and keeps it empty; each Moyasar instance is mounted
    // into a throwaway child of it. See the note on the plan effect below.
    const hostRef = useRef(null);
    const mountSeq = useRef(0);

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
                // Exposure, recorded separately from subscribe_view on purpose:
                // the view fires on arrival and must keep counting arrivals
                // whatever the config does, while this one only fires when real
                // prices reached the screen. A price test needs the second
                // number as its denominator, not the first.
                trackFunnel('subscribe_prices_shown', {
                    kind,
                    ladder: priceLadder(cfg.plans),
                    currency: cfg.currency || 'SAR',
                });
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

    // Keep the picker honest when ?plan= changes on an already-mounted page.
    // The effect above only runs once per session, so arriving here a second
    // time from /groups (250 → back → 299) left the FIRST plan selected while
    // the URL named the second one — you'd read "group_5" in the address bar
    // and be charged for group_3.
    useEffect(() => {
        if (!requestedPlanId || !plans.length) return;
        if (!plans.some((p) => p.id === requestedPlanId)) return;
        setSelectedPlanId(requestedPlanId);
    }, [requestedPlanId, plans]);

    // (Re)builds the embedded Moyasar form whenever the selected plan changes.
    //
    // Moyasar.init() is one-shot PER ELEMENT: calling it a second time on an
    // element it has already mounted into does nothing at all — no error, no
    // form — even after the element's innerHTML is cleared. That is what broke
    // every plan except the one selected on first render: switching tier left
    // an empty container, the watchdog below found no <form>, and checkout
    // dead-ended on "the payment form could not be displayed". So each init
    // gets a brand-new node with a selector that has never been used on this
    // page load.
    //
    // Deliberately NOT Moyasar.setAmount(), which is the obvious-looking fix:
    // it changes the charged amount but leaves `metadata.plan` at whatever the
    // first init set. The server grants months from metadata.plan and rejects
    // the payment when amount < that plan's price (paymentService.js), so
    // setAmount would take a 50 SAR payment for a plan tagged four_month and
    // then refuse to activate it. Amount, description and metadata have to
    // move together, and only a full re-init does that.
    useEffect(() => {
        if (!selectedPlanId || !publishableKey || !user?.id) return;
        const plan = plans.find((p) => p.id === selectedPlanId);
        if (!plan) return;

        let cancelled = false;
        let watchdog = null;
        // Read the ref once, here, rather than in the cleanup below: by the time
        // cleanup runs the component may already be unmounting and the ref
        // nulled, and this is the node whose children we need to tear down.
        const host = hostRef.current;
        setStatus('loading');

        (async () => {
            try {
                await loadMoyasarAssets();
                if (cancelled) return;

                // Throw rather than return: bailing out silently would leave
                // the page spinning on 'loading' with no way forward.
                if (!host) throw new Error('payment form host is missing');
                // Drop the previous instance, then mount into a fresh child.
                // React only ever sees the empty host, so it never fights
                // Moyasar over this subtree (and a StrictMode double-invoke or
                // an HMR reload can't stack two forms).
                host.replaceChildren();
                const mountClass = `mysr-mount-${++mountSeq.current}`;
                const target = document.createElement('div');
                target.className = `mysr-form ${mountClass}`;
                host.appendChild(target);

                const planLabel = t.plans[plan.id]?.label || plan.id;
                // A group buyer goes back to /groups, where their new invite
                // links are — not to the quizzes dashboard, which would leave
                // them wondering what they just bought.
                const next = plan.kind === 'group' ? '?next=/groups' : '';
                window.Moyasar.init({
                    element: `.${mountClass}`,
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
                //
                // Polled rather than checked once at 3s: the form typically
                // lands in ~2s, so a single 3s check was one slow network away
                // from telling a paying customer we couldn't show them a form.
                // Polling also stops waiting the moment the form appears.
                const deadline = Date.now() + 8000;
                const checkForForm = () => {
                    if (cancelled) return;
                    const form = target.querySelector('form');
                    if (!form) {
                        if (Date.now() >= deadline) {
                            setStatus('blocked');
                            return;
                        }
                        watchdog = setTimeout(checkForForm, 500);
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
                };
                watchdog = setTimeout(checkForForm, 500);
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
            // Tear the old instance down here too, so an unmount can't leave a
            // dead form (bound to the previous plan's amount) behind.
            if (host) host.replaceChildren();
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
        // The price travels with the choice: which tier someone moved to is
        // only half the signal, and "annual" means a different thing at 99 SAR
        // than at 300.
        trackFunnel('subscribe_plan_select', {
            plan: planId,
            amountHalalas: plans.find((p) => p.id === planId)?.priceHalalas ?? null,
        });
        setSelectedPlanId(planId);
    };

    const riyals = selectedPlan ? selectedPlan.priceHalalas / 100 : null;

    // Which refund window this plan actually has, straight from the policy in
    // i18n/copy/legal.js: 3 days monthly, 14 days for the 4-month and annual
    // terms. Null for anything the policy does not name — today that is the
    // group plans, which the guarantee therefore links to without claiming a
    // number. Keyed off `months` rather than the plan id so a new individual
    // term inherits the right window instead of silently getting none.
    const refundDays = (() => {
        if (!selectedPlan || isGroup) return null;
        if (selectedPlan.months === 1) return t.guaranteeDays3;
        if (selectedPlan.months >= 4) return t.guaranteeDays14;
        return null;
    })();
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
                        <span className="login-pill">{isGroup ? t.groupPill : t.pill}</span>
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

                    {/* Moyasar renders the card form into a throwaway child of
                        this host (see the plan effect). React keeps the host
                        itself empty and never touches what Moyasar puts inside.
                        The form carries its own pay button, so this page
                        deliberately has none of its own — a second one next to
                        it only made people wonder which of the two actually
                        charges them. Everything that is not the act of paying
                        sits below it, so the form is the first thing under the
                        price. */}
                    {/* The refund guarantee, ABOVE the card fields.
                        It was already offered and already written down, three
                        clicks away in /refund-policy — which meant it did no
                        work at the only moment it matters. Read before the card
                        number, it turns the purchase into a trial with the
                        money captured; read afterwards, it is small print.

                        The window is per-plan and must never be generalised:
                        the policy gives 3 days for monthly and 14 for the
                        longer terms, so a flat "14-day guarantee" would be a
                        false promise to every monthly buyer — and monthly is
                        the cheapest, most-bought plan. Group plans are not
                        named in the refund policy at all, so they get the link
                        without a number rather than an invented one. */}
                    {status === 'ready' && (
                        <div className="subscribe-guarantee">
                            <span className="subscribe-guarantee-icon" aria-hidden="true">
                                <Icon name="shield-check" size={20} />
                            </span>
                            <div className="subscribe-guarantee-body">
                                {refundDays && <strong>{t.guaranteeTitle(refundDays)}</strong>}
                                <span>{t.guaranteeBody}</span>
                                <Link to="/refund-policy" target="_blank" rel="noopener">
                                    {t.guaranteeLink}
                                </Link>
                            </div>
                        </div>
                    )}

                    <div
                        className="mysr-host"
                        ref={hostRef}
                        style={{ display: status === 'ready' ? 'block' : 'none' }}
                    />

                    {/* Everything below the card form is reassurance, not the
                        transaction. It used to be five separate stacked blocks
                        — secure note, a three-item perk list, the no-renewal
                        promise, the cross-link and the policy line — roughly
                        400px of small print that pushed the pay button off the
                        first screen on a laptop. Same words, one compact strip:
                        the perks fold into a disclosure, and the rest sits on
                        three tight lines. Nothing is dropped; the no-renewal
                        promise in particular is a commitment in the Terms, so
                        the page that takes the money still states it. */}
                    <div className="subscribe-assurance">
                        <details className="subscribe-perks-toggle">
                            <summary>
                                <Icon name="check-circle" size={15} />
                                {t.perksToggle}
                            </summary>
                            <ul className="subscribe-perks">
                                {(isGroup ? t.groupPerks : t.perks).map((perk) => <li key={perk}>{perk}</li>)}
                            </ul>
                        </details>

                        <p className="subscribe-norenew">
                            <Icon name="lock" size={14} />
                            {t.secureNoteBefore} <strong>{t.secureNoteProvider}</strong>{t.secureNoteAfter}{' '}
                            {t.noAutoRenew}
                        </p>

                        {/* Cross-link to the group plans. They are deliberately
                            not in this page's picker (nothing here explains the
                            invite links), so without this line a student buying
                            for a study group would never find out the option
                            exists. */}
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
        </div>
    );
};

export default Subscribe;
