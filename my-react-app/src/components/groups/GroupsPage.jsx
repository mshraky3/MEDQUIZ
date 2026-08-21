import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import Spinner from '../common/Spinner.jsx';
import Icon from '../common/Icon.jsx';
import SEO from '../common/SEO.jsx';
import { useCopy, useLang } from '../../i18n';
import { formatDate } from '../../i18n/format.js';
import groupsCopy from '../../i18n/copy/groups.js';
// The buy-a-seat CTA matches the button style used on /subscribe (which this
// page also funnels a buyer to for the individual plans) — was previously
// the plainer global default, a jarring style change across a single click.
import '../login/Login.css';
import './GroupsPage.css';

/**
 * /groups — buy a group subscription, then manage its invite links.
 *
 * Deliberately one page for both halves of the story. Before paying, a buyer
 * sees the seat placeholders they will get; after paying, the same rows fill in
 * with real links. Showing the shape first is the whole reason this is not just
 * two extra cards on /subscribe: "3 accounts for 250" means nothing until you
 * can see that one of them is yours and two are links you hand out.
 *
 * The owner never sees who claimed a seat — the API does not return it. See the
 * privacy rule in backend/routes/groups.js.
 *
 * Readable WITHOUT a session. It used to bounce logged-out visitors straight to
 * /login, which made group plans invisible to everyone who had not already been
 * told they exist — the landing page, the footer and search engines all had
 * nowhere to point. A guest now gets the same plan cards and seat preview from
 * the public /api/payment/config probe, and only hits the login wall when they
 * choose to buy.
 */
const GroupsPage = () => {
    const { user, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();
    const t = useCopy(groupsCopy);
    const { dir, lang } = useLang();

    const [state, setState] = useState('loading'); // loading | ready | error
    const [plans, setPlans] = useState([]);
    const [groups, setGroups] = useState([]);
    const [copiedToken, setCopiedToken] = useState(null);

    const isAuthenticated = Boolean(user?.username && sessionToken);

    useEffect(() => {
        let cancelled = false;
        // Signed in → the private view, which also carries any group they own.
        // Signed out → the public plan ladder only. Same shape either way; the
        // guest response simply has no `groups`.
        const request = isAuthenticated
            ? axios.get(`${Globals.URL}/api/groups/mine`, {
                params: { username: user.username },
                headers: { Authorization: `Bearer ${sessionToken}` },
            })
            : axios.get(`${Globals.URL}/api/payment/config`, { params: { kind: 'group' } });

        request.then(({ data }) => {
            if (cancelled) return;
            setPlans(data.plans || []);
            setGroups(data.groups || []);
            setState('ready');
        }).catch(() => {
            if (!cancelled) setState('error');
        });
        return () => { cancelled = true; };
    }, [isAuthenticated, user?.username, sessionToken]);

    const copyLink = async (link, key) => {
        try {
            await navigator.clipboard.writeText(link);
            setCopiedToken(key);
            setTimeout(() => setCopiedToken((c) => (c === key ? null : c)), 2000);
        } catch (_) {
            // Clipboard denied (insecure context / permissions). The link is
            // rendered as selectable text next to the button precisely so this
            // failure is never a dead end.
        }
    };

    const checkoutPath = (planId) => `/subscribe?kind=group&plan=${encodeURIComponent(planId)}`;
    // A guest picking a plan is sent to sign up, not silently to a login wall.
    // Login keeps `from`, so someone who already has an account lands back on
    // the checkout for the exact plan they clicked.
    const buy = (planId) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: checkoutPath(planId) } });
            return;
        }
        navigate(checkoutPath(planId));
    };

    return (
        <div className="groups-page" dir={dir}>
            {/* The signed-in view lists a person's own seats and links, so it is
                never indexed. The guest view is a plain price page and is one of
                the few ways anyone discovers group plans at all — let it in. */}
            <SEO
                title={t.pageTitle}
                robots={isAuthenticated ? 'noindex, nofollow' : 'index, follow'}
            />
            <div className="groups-wrap">
                {/* The "buy a group subscription" pitch belongs to the guest/buy
                    view — once state is known and the visitor already owns a
                    group, they're here to manage seats/links, not to be sold
                    to again on every visit. Shown during loading/error too,
                    since ownership isn't known yet at that point. */}
                {!(state === 'ready' && groups.length > 0) && (
                    <header className="groups-header">
                        <span className="groups-pill">{t.pill}</span>
                        <h1>{t.introTitle}</h1>
                        <p>{t.introBody}</p>
                    </header>
                )}

                {state === 'loading' && (
                    <div className="groups-loading">
                        <Spinner size="md" />
                        <span>{t.loading}</span>
                    </div>
                )}

                {state === 'error' && (
                    <div className="alert-box error">{t.loadError}</div>
                )}

                {state === 'ready' && groups.length === 0 && (
                    <section className="groups-buy">
                        <h2 className="groups-section-title">{t.chooseTitle}</h2>
                        <div className="groups-plan-grid">
                            {plans.map((plan) => (
                                <article key={plan.id} className="groups-plan">
                                    <div className="groups-plan-head">
                                        <span className="groups-plan-seats">{t.seatsLabel(plan.seats)}</span>
                                        <span className="groups-plan-price">
                                            {t.priceWithCurrency(plan.priceHalalas / 100)}
                                        </span>
                                        <span className="groups-plan-months">{t.monthsLabel(plan.months)}</span>
                                        <span className="groups-plan-perseat">
                                            {t.perSeat(Math.round((plan.priceHalalas / plan.seats) / 100))}
                                        </span>
                                    </div>

                                    {/* The placeholders. Seat 1 is always "you" —
                                        this is where a buyer works out that a
                                        3-seat group means 2 links, not 3. */}
                                    <p className="groups-preview-note">{t.previewNote}</p>
                                    <ul className="groups-seat-list">
                                        {Array.from({ length: plan.seats }, (_, i) => i + 1).map((n) => (
                                            <li key={n} className={`groups-seat${n === 1 ? ' is-you' : ''}`}>
                                                <Icon name={n === 1 ? 'user' : 'link'} size={15} />
                                                <span>{n === 1 ? t.seatYouPreview : t.seatLinkPreview(n)}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button type="button" className="btn primary groups-buy-cta" onClick={() => buy(plan.id)}>
                                        {isAuthenticated
                                            ? t.buyCta(t.priceWithCurrency(plan.priceHalalas / 100))
                                            : t.buyCtaGuest(t.priceWithCurrency(plan.priceHalalas / 100))}
                                    </button>
                                </article>
                            ))}
                        </div>
                        <p className="groups-norenew">{t.noAutoRenew}</p>
                        {!isAuthenticated && (
                            <p className="groups-guest-note">
                                {t.guestNote}{' '}
                                <Link to="/signup">{t.guestSignup}</Link>
                            </p>
                        )}
                    </section>
                )}

                {state === 'ready' && groups.map((group) => {
                    const used = group.seatList.filter((s) => s.claimed).length;
                    return (
                        <section key={group.id} className="groups-owned">
                            <h2 className="groups-section-title">{t.yourGroupTitle}</h2>
                            {group.expired ? (
                                <div className="groups-expired">
                                    <strong>{t.expiredTitle}</strong>
                                    <p>{t.expiredBody}</p>
                                </div>
                            ) : (
                                <p className="groups-meta">
                                    {t.endsOn(formatDate(group.expiresAt, lang))}
                                    {' · '}
                                    {t.seatsUsed(used, group.seats)}
                                </p>
                            )}

                            <ul className="groups-seat-list owned">
                                {group.seatList.map((seat) => (
                                    <li
                                        key={seat.seatIndex}
                                        className={`groups-seat${seat.isYou ? ' is-you' : ''}${seat.claimed ? ' is-claimed' : ''}`}
                                    >
                                        <span className="groups-seat-label">
                                            <Icon name={seat.isYou ? 'user' : seat.claimed ? 'check' : 'link'} size={15} />
                                            {seat.isYou ? t.seatYou : t.seatNumber(seat.seatIndex)}
                                        </span>

                                        {seat.isYou ? (
                                            <span className="groups-seat-state">{t.seatActive}</span>
                                        ) : seat.claimed ? (
                                            <span className="groups-seat-state">
                                                {seat.claimedAt ? t.seatUsedOn(formatDate(seat.claimedAt, lang)) : t.seatActive}
                                            </span>
                                        ) : seat.link ? (
                                            <span className="groups-seat-link">
                                                {/* dir="ltr" so a URL never renders
                                                    reversed inside the Arabic page. */}
                                                <code dir="ltr">{seat.link}</code>
                                                <button
                                                    type="button"
                                                    className="groups-copy"
                                                    onClick={() => copyLink(seat.link, seat.seatIndex)}
                                                >
                                                    <Icon name={copiedToken === seat.seatIndex ? 'check' : 'clipboard'} size={14} />
                                                    {copiedToken === seat.seatIndex ? t.copied : t.copy}
                                                </button>
                                            </span>
                                        ) : (
                                            <span className="groups-seat-state">{t.seatAvailable}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {!group.expired && <p className="groups-hint">{t.shareHint}</p>}
                            <p className="groups-privacy">{t.privacyNote}</p>
                        </section>
                    );
                })}

                {state === 'ready' && (
                    isAuthenticated ? (
                        <button type="button" className="groups-back" onClick={() => navigate('/quizs')}>
                            {t.backToQuizzes}
                        </button>
                    ) : (
                        // A guest has no /quizs to go back to, and /subscribe is
                        // itself behind the login wall — so the individual plans
                        // they might want instead are the ones on the landing
                        // page, which is the only version of them a guest can
                        // actually read.
                        <Link to="/" className="groups-back">{t.backToIndividual}</Link>
                    )
                )}
            </div>
        </div>
    );
};

export default GroupsPage;
