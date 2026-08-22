import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import Spinner from '../common/Spinner.jsx';
import Icon from '../common/Icon.jsx';
import SEO from '../common/SEO.jsx';
import { useCopy, useLang } from '../../i18n';
import { formatDate } from '../../i18n/format.js';
import accountCopy from '../../i18n/copy/account.js';
// The subscribe/renew CTA below matches the button style used on the page it
// navigates to (/subscribe, styled via Login.css) — was previously the
// plainer global default, a jarring style change across a single click.
import '../login/Login.css';
import './AccountPage.css';

/**
 * /account — the one place that answers "what do I actually have?"
 *
 * There was nowhere in the product to see your own subscription state: the
 * paywall told you what to buy, and nothing told you what you had already
 * bought or how much of the free tier was left. Since no plan auto-renews,
 * this page is also the only reminder anyone gets that a term is running out.
 *
 * Everything shown comes from the server on load. The stored login snapshot
 * goes stale the moment a quiz is submitted, and a page whose whole job is to
 * state facts about your account cannot show a stale one.
 */
const AccountPage = () => {
    const { user, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();
    const t = useCopy(accountCopy);
    const { dir, lang } = useLang();

    const [state, setState] = useState('loading'); // loading | ready | error
    const [sub, setSub] = useState(null);
    const [allowance, setAllowance] = useState(40);
    const [hasGroup, setHasGroup] = useState(false);
    // What they actually bought, from the most recent paid payment. null for an
    // account that has never paid.
    const [purchase, setPurchase] = useState(null);

    useEffect(() => {
        if (!user?.id || !sessionToken) {
            navigate('/login', { replace: true, state: { from: '/account' } });
            return undefined;
        }
        let cancelled = false;

        Promise.all([
            axios.get(`${Globals.URL}/api/user-subscription/${user.id}`, {
                params: { username: user.username },
                headers: { Authorization: `Bearer ${sessionToken}` },
            }),
            axios.get(`${Globals.URL}/api/groups/mine`, {
                params: { username: user.username },
                headers: { Authorization: `Bearer ${sessionToken}` },
                // A missing group is the normal case, not an error.
                validateStatus: () => true,
            }),
        ]).then(([subRes, groupRes]) => {
            if (cancelled) return;
            setSub({ ...subRes.data.user, enforcement: subRes.data.enforcement });
            setAllowance(subRes.data.allowance || 40);
            setPurchase(subRes.data.purchase || null);
            setHasGroup(Boolean(groupRes.data?.groups?.length));
            setState('ready');
        }).catch(() => {
            if (!cancelled) setState('error');
        });

        return () => { cancelled = true; };
    }, [user?.id, user?.username, sessionToken, navigate]);

    // An admin-granted ("managed") account is time-limited now, so the grant
    // can lapse. Once it has, this account is an ordinary free-tier one and
    // must be shown as such — otherwise it reads "Managed account, permanent
    // access" on a page that is also refusing to start a quiz, and offers no
    // way to subscribe.
    const adminGrantExpiry = sub?.is_admin_created ? sub.subscription_expiry_date : null;
    const adminGrantLive = Boolean(sub?.is_admin_created)
        && (!adminGrantExpiry || new Date(adminGrantExpiry).getTime() > Date.now());

    const statusLabel = () => {
        if (!sub) return '';
        if (adminGrantLive) return t.statusAdmin;
        if (sub.grandfathered_at) return t.statusLegacy;
        // subscription_status stays 'active' after the expiry date passes —
        // nothing rewrites the column when time runs out — so the date has to
        // be checked here too, or a lapsed account reads "Active" on the very
        // page it opens to find out why it lost access. The admin users table
        // already draws this distinction (see planState in ADD.jsx).
        const stillValid = sub.subscription_expiry_date
            ? new Date(sub.subscription_expiry_date).getTime() > Date.now()
            : false;
        if (sub.subscription_status === 'active' && stillValid) {
            return sub.account_type === 'group_seat' ? t.statusGroupSeat : t.statusActive;
        }
        return t.statusFree;
    };

    // freeQuestionsRemaining is null for anyone with unlimited access, which is
    // exactly the test for "is this a paying/exempt account".
    const isFree = sub != null && typeof sub.freeQuestionsRemaining === 'number';
    const isPaid = sub != null && !isFree && sub.subscription_status === 'active';
    // "Legacy" means access with no end date at all. A managed account with a
    // real expiry is NOT that: it needs the end date, the renew button and the
    // no-auto-renew line, exactly like a paid one.
    const isLegacy = sub != null && (sub.grandfathered_at || (sub.is_admin_created && !sub.subscription_expiry_date));

    return (
        <div className="account-page" dir={dir}>
            <SEO title={t.pageTitle} robots="noindex, nofollow" />
            <div className="account-wrap">
                <h1 className="account-heading">{t.heading}</h1>

                {state === 'loading' && (
                    <div className="account-loading">
                        <Spinner size="md" />
                        <span>{t.loading}</span>
                    </div>
                )}

                {state === 'error' && <div className="alert-box error">{t.loadError}</div>}

                {state === 'ready' && sub && (
                    <>
                        <section className="account-card">
                            <dl className="account-facts">
                                <div>
                                    <dt>{t.emailLabel}</dt>
                                    <dd dir="ltr" className="account-email">{sub.email || sub.username}</dd>
                                </div>
                                <div>
                                    <dt>{t.statusLabel}</dt>
                                    <dd>
                                        <span className={`account-badge${isPaid ? ' is-paid' : isLegacy ? ' is-legacy' : ''}`}>
                                            {statusLabel()}
                                        </span>
                                    </dd>
                                </div>
                                {/* Which plan, not just "you are subscribed". An
                                    expiry date alone never said whether this was
                                    a 50 SAR month or a 300 SAR year. */}
                                {purchase && (
                                    <div>
                                        <dt>{t.planLabel}</dt>
                                        <dd>
                                            {t.planNames[purchase.planId] || t.planUnknown}
                                            <span className="account-daysleft">
                                                {t.paidAmount(purchase.amountSar, purchase.currency)}
                                            </span>
                                        </dd>
                                    </div>
                                )}
                                {purchase?.startedAt && (
                                    <div>
                                        <dt>{t.startedLabel}</dt>
                                        <dd>{formatDate(purchase.startedAt, lang)}</dd>
                                    </div>
                                )}
                                {isPaid && sub.subscription_expiry_date && (
                                    <div>
                                        <dt>{t.endsLabel}</dt>
                                        <dd>
                                            {formatDate(sub.subscription_expiry_date, lang)}
                                            {typeof sub.daysRemaining === 'number' && (
                                                <span className="account-daysleft">{t.daysLeft(sub.daysRemaining)}</span>
                                            )}
                                        </dd>
                                    </div>
                                )}
                            </dl>

                            {/* The promise, stated where it matters most: on the
                                page someone opens when they wonder whether they
                                are about to be charged again. */}
                            {isLegacy
                                ? <p className="account-note">{t.legacyNote}</p>
                                : adminGrantLive
                                ? <p className="account-note">{t.adminGrantNote}</p>
                                : <p className="account-note account-norenew">
                                    <Icon name="shield-check" size={15} />
                                    {t.noAutoRenew}
                                </p>}
                        </section>

                        {isFree && (
                            <section className="account-card">
                                <h2 className="account-subheading">{t.freeTitle}</h2>
                                <div className="account-meter" role="img"
                                     aria-label={t.freeRemaining(sub.freeQuestionsRemaining, allowance)}>
                                    <span
                                        className="account-meter-fill"
                                        style={{ width: `${Math.round(((allowance - sub.freeQuestionsRemaining) / allowance) * 100)}%` }}
                                    />
                                </div>
                                <p className="account-meter-label">
                                    {t.freeRemaining(sub.freeQuestionsRemaining, allowance)}
                                </p>
                                <p className="account-note">
                                    {sub.freeQuestionsRemaining <= 0 ? t.freeSpentNote : t.freeLeftNote}
                                </p>
                            </section>
                        )}

                        <div className="account-actions">
                            {!isLegacy && (
                                <button type="button" className="btn primary" onClick={() => navigate('/subscribe')}>
                                    {isPaid ? t.renewCta : t.subscribeCta}
                                </button>
                            )}
                            <button type="button" className="account-secondary" onClick={() => navigate('/groups')}>
                                <Icon name="users" size={16} />
                                {hasGroup ? t.groupCta : t.groupBuyCta}
                            </button>
                            <button type="button" className="account-secondary" onClick={() => navigate('/quizs')}>
                                {t.backToQuizzes}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AccountPage;
