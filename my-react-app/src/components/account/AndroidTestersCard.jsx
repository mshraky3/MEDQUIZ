import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import { useCopy, useLang, formatNumber } from '../../i18n';
import androidTestersCopy from '../../i18n/copy/androidTesters.js';
import { cleanLink } from '../../utils/androidApp.js';
import { looksLikeEmail, offerView, joinErrorKey } from '../../utils/androidTesters.js';
import './AndroidTestersCard.css';

// Opt-in link of the Play closed test (build-time Vercel env, same one the login card uses).
const TESTER_URL = cleanLink((import.meta.env || {}).VITE_ANDROID_TESTER_URL);

/**
 * "Android testers offer" on /account: the first few students who join get 1 month
 * free when they sign in from the Android app. Everything comes from the server:
 * while the offer is off (ANDROID_TESTERS_OFFER_ENABLED) the status call answers 404
 * and the card renders nothing, so it is invisible until the owner switches it on.
 */
const AndroidTestersCard = ({ username, sessionToken }) => {
    const t = useCopy(androidTestersCopy);
    const { lang } = useLang();
    const [status, setStatus] = useState(null);
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const auth = useCallback(() => ({
        params: { username },
        headers: { Authorization: `Bearer ${sessionToken}` },
    }), [username, sessionToken]);

    useEffect(() => {
        if (!username || !sessionToken) return undefined;
        let cancelled = false;
        axios.get(`${Globals.URL}/api/android-testers/status`, auth())
            .then(({ data }) => { if (!cancelled) setStatus(data); })
            .catch(() => { /* off (404), not ready (503) or offline: the card stays hidden */ });
        return () => { cancelled = true; };
    }, [username, sessionToken, auth]);

    const join = async (event) => {
        event.preventDefault();
        setError('');
        if (!looksLikeEmail(email)) { setError(t.errors.invalidEmail); return; }
        setBusy(true);
        try {
            const { data } = await axios.post(`${Globals.URL}/api/android-testers/join`,
                { username, email: email.trim() },
                { headers: { Authorization: `Bearer ${sessionToken}` } });
            setStatus((prev) => ({
                ...prev, joined: true, playEmail: data.playEmail, left: data.left, redeemed: false,
            }));
        } catch (err) {
            setError(t.errors[joinErrorKey(err.response?.data?.reason)] || t.errors.generic);
        } finally {
            setBusy(false);
        }
    };

    const view = offerView(status);
    if (view === 'hidden') return null;

    return (
        <section className="account-card atc" aria-label={t.title}>
            <div className="atc-head">
                <span className="atc-icon" aria-hidden="true"><Icon name="phone" size={20} /></span>
                <div>
                    <span className="atc-pill">{t.pill}</span>
                    <h2 className="atc-title">{t.title}</h2>
                </div>
            </div>

            {view === 'join' || view === 'full' ? <p className="atc-body">{t.body}</p> : null}

            {view === 'join' ? (
                <form className="atc-form" onSubmit={join} noValidate>
                    <p className="atc-spots">{t.spots(formatNumber(status.left, lang))}</p>
                    <label className="atc-label" htmlFor="atc-email">{t.emailLabel}</label>
                    <input
                        id="atc-email"
                        className="atc-input"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        dir="auto"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        aria-describedby="atc-hint"
                    />
                    <p id="atc-hint" className="atc-hint">{t.emailHint}</p>
                    {error ? <p className="atc-error" role="alert">{error}</p> : null}
                    <button type="submit" className="btn primary atc-submit" disabled={busy}>
                        {busy ? t.joining : t.join}
                    </button>
                    <p className="atc-hint">{t.limit}</p>
                </form>
            ) : null}

            {view === 'full' ? <p className="atc-full">{t.full}</p> : null}

            {view === 'joined' ? (
                <div className="atc-done">
                    <p className="atc-done-title">
                        <Icon name="check-circle" size={18} /> {t.joinedTitle}
                    </p>
                    <p className="atc-body">{t.joinedBody(status.playEmail)}</p>
                    {TESTER_URL ? (
                        <a className="btn primary atc-submit" href={TESTER_URL} target="_blank" rel="noopener noreferrer">
                            {t.optIn}
                        </a>
                    ) : <p className="atc-hint">{t.noLink}</p>}
                </div>
            ) : null}

            {view === 'redeemed' ? (
                <div className="atc-done">
                    <p className="atc-done-title">
                        <Icon name="check-circle" size={18} /> {t.redeemedTitle}
                    </p>
                    <p className="atc-body">{t.redeemedBody}</p>
                </div>
            ) : null}
        </section>
    );
};

export default AndroidTestersCard;
