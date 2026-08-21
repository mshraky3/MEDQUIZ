import React, { useState, useEffect, useContext } from 'react';
import Icon from '../common/Icon.jsx';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { safeTrack, trackFunnel } from '../../utils/analytics.js';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import { UserContext } from '../../UserContext';
import { TRACKS, normalizeTrack, pick } from '../../utils/tracks.js';
import { useCopy, useLang } from '../../i18n';
import { formatDate } from '../../i18n/format.js';
import authCopy from '../../i18n/copy/auth.js';
import OAuthButtons from '../login/OAuthButtons.jsx';
import TrackModal from '../common/TrackModal.jsx';
import '../login/Login.css';
import './Signup.css';

const Signup = () => {
    const { setUser } = useContext(UserContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
    // Seconds until "resend" is clickable again — resets to 30 on every send,
    // ticks down via the effect below. Nothing server-side rate-limits this
    // click, so without it a visitor can spam send-otp as fast as they can tap.
    const [resendCooldown, setResendCooldown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tempLinkInfo, setTempLinkInfo] = useState(null);
    const [isTempLink, setIsTempLink] = useState(false);
    // A PAID group seat (/join/:token), as opposed to an admin invite
    // (/signup/:token). Both are token links and both skip the email OTP, but a
    // seat creates a paying account with the group's end date, and its claimer
    // picks their own track — a group can be mixed medical/nursing.
    const [seatExpiresAt, setSeatExpiresAt] = useState(null);
    const [seatError, setSeatError] = useState(null);
    // An invite link that came back invalid/expired. Rendered as its own screen
    // with explicit choices — never as an automatic redirect (see below).
    const [linkInvalid, setLinkInvalid] = useState(false);
    // The study track this account is created on. Named studyTrack because
    // `track` in this file is already the Vercel analytics function.
    // Chosen once, here — afterwards only an admin can move an account.
    //
    // Starts null on purpose: there is no default track. Picking the wrong one
    // is the single most expensive mistake a new account can make (it decides
    // which question bank, summaries and analytics the account ever sees, and
    // only an admin can undo it), so the choice is made explicitly in a modal
    // before the form is usable rather than inherited from a preselected radio.
    const [studyTrack, setStudyTrack] = useState(null);
    const [showTrackModal, setShowTrackModal] = useState(false);
    // Google sign-in skips the inline terms checkbox entirely, so a
    // brand-new Google account still needs the same explicit accept step a
    // brand-new password account gets on its first login (see Login.jsx's
    // identical popup) — held here as its own state because it belongs to
    // the freshly created session, not the credentials form.
    const [showTermsPopup, setShowTermsPopup] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);
    const [oauthSession, setOauthSession] = useState(null);
    const navigate = useNavigate();
    const { token } = useParams();
    const location = useLocation();
    const t = useCopy(authCopy).signup;
    const terms = useCopy(authCopy).terms;
    const { lang, dir } = useLang();

    const isGroupSeat = location.pathname.startsWith('/join/');
    const entryType = isGroupSeat ? 'group-seat' : token ? 'temp-link' : 'free-account';

    useEffect(() => {
        if (token && isGroupSeat) {
            validateGroupSeat();
            // The seat holder chooses their own track, so the same modal a
            // regular signup gets applies here.
            setShowTrackModal(true);
        } else if (token) {
            validateTempLink();
        } else {
            // Regular signup: ask which kind of student this is, first thing.
            setShowTrackModal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, isGroupSeat]);

    useEffect(() => {
        trackFunnel('signup_view', { entryType });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const id = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [resendCooldown]);

    const validateGroupSeat = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${Globals.URL}/api/groups/seat/${token}`);
            if (data.valid) {
                setSeatExpiresAt(data.expiresAt);
                setSeatError(null);
                setError('');
            } else {
                // Keep the specific reason: "already used" and "expired" call
                // for very different next steps from whoever sent the link.
                setSeatError(data.reason || 'error');
                setLinkInvalid(true);
                setShowTrackModal(false);
            }
        } catch (err) {
            setSeatError('error');
            setLinkInvalid(true);
            setShowTrackModal(false);
        } finally {
            setLoading(false);
        }
    };

    const validateTempLink = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${Globals.URL}/api/validate-temp-link/${token}`);
            if (response.data.valid) {
                setTempLinkInfo(response.data.link);
                setIsTempLink(true);
                setLinkInvalid(false);
                // An invite is issued for one cohort; the server ignores any
                // track we send on this path, so mirror the link's own track.
                setStudyTrack(normalizeTrack(response.data.link.track));
                setError('');
            } else {
                setLinkInvalid(true);
            }
        } catch (err) {
            setLinkInvalid(true);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateCredentials = () => {
        // Belt and braces: the modal blocks the form, but a track must never be
        // guessed on the way to the server.
        if (!isTempLink && !studyTrack) {
            setError(t.errTrackFirst);
            setShowTrackModal(true);
            return false;
        }

        if (!form.email || !form.password || !form.confirmPassword) {
            setError(t.errAllFields);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            setError(t.errEmail);
            return false;
        }

        if (form.password.length < 8) {
            setError(t.errPasswordLength);
            return false;
        }

        if (form.password !== form.confirmPassword) {
            setError(t.errPasswordMatch);
            return false;
        }

        if (!termsAgreed) {
            setError(t.errTerms);
            return false;
        }

        return true;
    };

    // Sign the freshly created account in directly — no bouncing to /login to
    // re-type credentials while the free-trial hour is already counting down.
    // Terms were accepted on the signup form, so the post-login terms popup is
    // recorded silently. Falls back to the manual login page if anything fails.
    const autoLogin = async () => {
        const username = form.email.trim().toLowerCase();
        try {
            const loginRes = await axios.post(`${Globals.URL}/login`, {
                username,
                password: form.password,
            });

            if (loginRes.data.showTerms) {
                await axios.post(
                    `${Globals.URL}/accept-terms`,
                    { username },
                    { headers: { Authorization: `Bearer ${loginRes.data.sessionToken}` } }
                ).catch(() => {});
            }

            setUser(loginRes.data.user || { username }, loginRes.data.sessionToken);

            // Straight into the app, whatever the subscription state. A brand
            // new free account has 40 questions to spend — sending it to the
            // paywall before it has seen a single question is how the old trial
            // flow lost people.
            setTimeout(() => {
                navigate('/quizs', { replace: true, state: loginRes.data });
            }, 1200);
        } catch (err) {
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: t.createdFallback,
                        username
                    }
                });
            }, 1500);
        }
    };

    const sendOtp = async () => {
        await axios.post(`${Globals.URL}/api/auth/send-otp`, {
            email: form.email.trim().toLowerCase(),
            purpose: 'signup'
        });
        trackFunnel('signup_otp_sent', { track: studyTrack });
    };

    // Create the account. `otpCode` is null for temp/invite-link signups, which
    // are OTP-free (the admin-generated invite link is the trust anchor), so the
    // invite flow works even while transactional email is down.
    const createAccount = async (otpCode) => {
        setLoading(true);
        try {
            const endpoint = isGroupSeat
                ? '/api/signup/group-seat'
                : isTempLink ? '/api/signup/temp-link' : '/api/signup/free';
            const payload = isGroupSeat
                ? {
                    token,
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    // The seat does NOT inherit the buyer's track.
                    track: studyTrack,
                }
                : isTempLink
                    ? { token, email: form.email.trim().toLowerCase(), password: form.password }
                    : {
                        email: form.email.trim().toLowerCase(),
                        password: form.password,
                        otp_code: otpCode,
                        track: studyTrack,
                    };

            const response = await axios.post(`${Globals.URL}${endpoint}`, payload);

            if (response.data.success) {
                safeTrack('signup_success', {
                    entryType,
                    studyTrack: response.data.track || studyTrack,
                });
                if (!token) trackFunnel('signup_otp_verified', { track: response.data.track || studyTrack });

                setSuccess(true);
                await autoLogin();
            } else {
                throw new Error(response.data.message || t.errCreate);
            }
        } catch (error) {
            if (!token) trackFunnel('signup_otp_failed', { message: error.response?.data?.message || error.message });
            setError(error.response?.data?.message || error.message || t.errCreate);
        } finally {
            setLoading(false);
        }
    };

    // Submit of the first (credentials) form. Temp/invite links skip the email
    // OTP entirely and create the account directly; free signups send an OTP
    // and advance to the verification step.
    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateCredentials()) return;

        // Both token flows are OTP-free: the link itself is the trust anchor,
        // so invites keep working even while transactional email is down.
        if (isTempLink || isGroupSeat) {
            await createAccount(null);
            return;
        }

        setLoading(true);
        try {
            await sendOtp();
            setStep('otp');
            setResendCooldown(30);
        } catch (err) {
            setError(err.response?.data?.message || t.errSendOtp);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setLoading(true);
        try {
            await sendOtp();
            setResendCooldown(30);
        } catch (err) {
            setError(err.response?.data?.message || t.errSendOtp);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError(t.errOtpLength);
            return;
        }

        await createAccount(otp);
    };

    // Google sign-in shares the exact response shape /login and the
    // email/password signup return (showTerms, user, sessionToken) — the
    // backend creates the account on first sight of this Google identity,
    // on the study track already chosen in the blocking modal above (see
    // OAuthButtons' `track` prop). No OTP step: Google has already verified
    // the email address.
    const handleOAuthSuccess = (data) => {
        setError('');
        if (data.showTerms) {
            setOauthSession({ username: data.user?.username || data.user?.email, sessionToken: data.sessionToken });
            setUser(data.user, data.sessionToken);
            setShowTermsPopup(true);
            return;
        }
        setUser(data.user, data.sessionToken);
        safeTrack('signup_success', { entryType: 'google-oauth', studyTrack });
        navigate('/quizs', { replace: true, state: data });
    };

    const handleOAuthError = () => {
        setError(t.oauthError);
    };

    const handleAcceptOAuthTerms = async () => {
        if (!termsChecked || !oauthSession) return;
        setShowTermsPopup(false);
        setLoading(true);
        try {
            await axios.post(
                `${Globals.URL}/accept-terms`,
                { username: oauthSession.username },
                { headers: { Authorization: `Bearer ${oauthSession.sessionToken}` } }
            );
            safeTrack('signup_success', { entryType: 'google-oauth', studyTrack });
            navigate('/quizs', { replace: true });
        } catch (err) {
            setError(t.errCreate);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-body" dir={dir}>
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short" style={{ textAlign: 'center' }}>
                        <div className="success-icon" style={{ color: 'var(--success-color, #16a34a)', marginBottom: 20 }}><Icon name="check-circle" size={56} /></div>
                        <h2 style={{ color: 'var(--text-dark, #0f1e3d)', fontWeight: 700, marginBottom: 12 }}>{t.successTitle}</h2>
                        <p style={{ color: 'var(--text-dark, #0f1e3d)', fontWeight: 600, marginBottom: 8 }}>
                            {isGroupSeat ? t.successSeat : isTempLink ? t.successInvite : t.successFree}
                        </p>
                        <p style={{ color: 'var(--muted)' }}>{t.successRedirect}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (token && loading && !tempLinkInfo && !seatExpiresAt && !linkInvalid) {
        return (
            <div className="login-body" dir={dir}>
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
                            <Spinner size="md" />
                            <span>{t.validatingLink}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // An expired/unknown invite link used to set a 3s timer to /contact. The
    // timer was never cleared, so it fired even after the visitor had navigated
    // somewhere else — the support page appearing "on its own" mid-signup. The
    // dead end is now a screen the visitor leaves deliberately.
    if (linkInvalid) {
        return (
            <div className="login-body" dir={dir}>
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short" style={{ textAlign: 'center' }}>
                        <div className="login-header">
                            <div className="login-title">{t.invalidLinkTitle}</div>
                            <div className="login-subtitle">
                                {/* A paid seat gets the specific reason — "already
                                    used" and "expired" need different answers from
                                    whoever sent the link. */}
                                {seatError ? (t.seatReasons[seatError] || t.seatReasons.error) : t.invalidLinkBody}
                            </div>
                        </div>
                        <div className="login-form">
                            <button
                                type="button"
                                className="btn primary large"
                                onClick={() => {
                                    // Both /signup and /signup/:token render this same
                                    // component, so the router may reuse the instance —
                                    // clear the dead-link state ourselves.
                                    setLinkInvalid(false);
                                    setError('');
                                    navigate('/signup', { replace: true });
                                }}
                            >
                                {t.invalidLinkCta}
                            </button>
                            <div className="login-footer-text">
                                {t.invalidLinkThinkError}{' '}
                                <Link to="/contact" className="link-primary">{t.contactSupport}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-body" dir={dir}>
            <div className="login-wrapper signup-wide">
                <div className="login-card signup-short">
                    <div className="login-header">
                        {/* The free-account pill was a promotional badge repeating what
                            the title/subtitle already say — three "free questions"
                            mentions stacked in a row read as an ad, not a signup form.
                            Seat/invite keep theirs: those convey actual account state
                            (a paid seat, an admin invite), not a sales pitch. */}
                        {(isGroupSeat || isTempLink) && (
                            <div className="pill">
                                {isGroupSeat ? t.pillSeat : t.pillInvite}
                            </div>
                        )}
                        <div className="login-title">
                            {isGroupSeat ? t.titleSeat : isTempLink ? t.titleInvite : t.titleFree}
                        </div>
                        <div className="login-subtitle">
                            {step === 'credentials'
                                ? (isGroupSeat
                                    ? t.subtitleSeat
                                    : isTempLink ? t.subtitleInvite : t.subtitleFree)
                                : (isTempLink
                                    ? t.subtitleOtpInvite(form.email)
                                    : t.subtitleOtpFree(form.email))}
                        </div>
                    </div>

                    {isGroupSeat && seatExpiresAt && (
                        <div className="trial-callout">
                            <span className="trial-callout-icon" aria-hidden="true"><Icon name="users" size={20} /></span>
                            <div className="trial-callout-body">
                                <strong>{t.seatCalloutTitle}</strong>
                                <span>{t.seatCalloutBody(formatDate(seatExpiresAt, lang))}</span>
                            </div>
                        </div>
                    )}

                    {step === 'credentials' ? (
                        <form onSubmit={handleCredentialsSubmit} className="login-form">
                            {isTempLink ? (
                                <div className="track-locked">
                                    <Icon name={TRACKS[studyTrack].icon} size={18} />
                                    <span>{t.trackLockedPrefix} <strong>{pick(TRACKS[studyTrack].label, lang)}</strong> {t.trackLockedSuffix}</span>
                                </div>
                            ) : (
                                <div className="track-chosen">
                                    <span className="track-chosen-icon" aria-hidden="true">
                                        <Icon name={studyTrack ? TRACKS[studyTrack].icon : 'help-circle'} size={20} />
                                    </span>
                                    <span className="track-chosen-body">
                                        <span className="track-chosen-label">{t.trackLabel}</span>
                                        <strong className="track-chosen-value">
                                            {studyTrack ? pick(TRACKS[studyTrack].label, lang) : t.trackUnset}
                                        </strong>
                                    </span>
                                    <button
                                        type="button"
                                        className="track-chosen-change"
                                        onClick={() => setShowTrackModal(true)}
                                    >
                                        {studyTrack ? t.trackChange : t.trackChoose}
                                    </button>
                                </div>
                            )}
                            {!token && (
                                <OAuthButtons
                                    dividerLabel={t.dividerOr}
                                    onSuccess={handleOAuthSuccess}
                                    onError={handleOAuthError}
                                    track={studyTrack}
                                />
                            )}
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">{t.emailLabel}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder={t.emailPlaceholder}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="signup-password-row">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">{t.passwordLabel}</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-input"
                                        value={form.password}
                                        onChange={handleInputChange}
                                        placeholder={t.passwordPlaceholder}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="confirmPassword">{t.confirmLabel}</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-input"
                                        value={form.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder={t.confirmPlaceholder}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>
                            </div>
                            <label className="terms-agree-row">
                                <input
                                    type="checkbox"
                                    checked={termsAgreed}
                                    onChange={(e) => setTermsAgreed(e.target.checked)}
                                />
                                <span>
                                    {t.agreePrefix}{' '}
                                    <Link to="/terms" target="_blank" rel="noopener" className="link-primary">{t.termsLink}</Link>
                                    {' '}{t.and}{' '}
                                    <Link to="/privacy" target="_blank" rel="noopener" className="link-primary">{t.privacyLink}</Link>
                                </span>
                            </label>
                            {error && <div className="alert-box error">{error}</div>}
                            <button
                                type="submit"
                                className="btn primary large"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="loading-spinner"><Spinner size="sm" />{token ? t.creatingAccount : t.sending}</div>
                                ) : (isGroupSeat ? t.submitSeat : isTempLink ? t.submitInvite : t.submitFree)}
                            </button>
                            <div className="login-footer-text">
                                {t.haveAccount}{' '}
                                <Link to="/login" className="link-primary">{t.loginLink}</Link>
                            </div>
                            <div className="login-footer-text">
                                {t.troubleQuestion}{' '}
                                <a className="link-primary" href="mailto:alshraky3@gmail.com?subject=Account Support">
                                    {t.contactSupport}
                                </a>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="otp">{t.otpLabel}</label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    className="form-input"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder={t.otpPlaceholder}
                                    maxLength={6}
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    required
                                    style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                                />
                                <p className="form-hint" style={{ marginTop: 8, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                                    {t.otpSpamHintBefore} <strong>{t.otpSpamFolder}</strong> {t.otpSpamOr} <strong>{t.otpTrashFolder}</strong>.
                                </p>
                            </div>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large" disabled={loading}>
                                {loading ? (
                                    <div className="loading-spinner"><Spinner size="sm" />{t.creatingAccount}</div>
                                ) : t.otpSubmit}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                style={{ background: 'transparent', color: 'var(--muted)', marginTop: 8 }}
                                onClick={() => { setStep('credentials'); setOtp(''); setError(''); }}
                                disabled={loading}
                            >
                                {t.changeEmail}
                            </button>
                            <div className="login-footer-text">
                                {t.noCode}{' '}
                                <button
                                    type="button"
                                    className="link-primary"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    onClick={handleResendOtp}
                                    disabled={loading || resendCooldown > 0}
                                >
                                    {resendCooldown > 0 ? t.resendCooldown(resendCooldown) : t.resend}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Terms popup for a Google-created account — see handleOAuthSuccess.
                Identical content/markup to Login.jsx's popup of the same name,
                just scoped to the oauthSession this page tracks itself. */}
            {showTermsPopup && (
                <div className="popup-overlay">
                    <div className="popup-content large-popup">
                        <div className="terms-section">
                            <h4>{terms.title}</h4>
                            {terms.sections.map((sec) => (
                                <p key={sec.heading}>
                                    <strong>{sec.heading}:</strong><br />
                                    {sec.body}
                                </p>
                            ))}
                            <div>
                                <strong>{terms.prohibitedHeading}:</strong><br />
                                <ul>
                                    {terms.prohibited.map((item) => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                            {terms.sectionsAfter.map((sec) => (
                                <p key={sec.heading}>
                                    <strong>{sec.heading}:</strong><br />
                                    {sec.body}
                                </p>
                            ))}
                            <p>{terms.closing}</p>
                        </div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={termsChecked}
                                onChange={(e) => setTermsChecked(e.target.checked)}
                            />
                            {terms.accept}
                        </label>
                        <button
                            className="popup-btn try-free"
                            onClick={handleAcceptOAuthTerms}
                            disabled={!termsChecked}
                            style={{ marginTop: '15px' }}
                        >
                            {terms.continue}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Study-track modal ────────────────────────────────────────────
                Opens before anything else on a regular signup and cannot be
                dismissed without answering. It exists because the track decides
                which bank, summaries and analytics the account will ever see,
                and only an admin can move an account afterwards — an inline
                radio with a default was quietly sending nursing students into
                the medical bank. */}
            {showTrackModal && !isTempLink && (
                <TrackModal
                    studyTrack={studyTrack}
                    onSelect={(key) => { setStudyTrack(key); trackFunnel('signup_track_selected', { track: key }); }}
                    onConfirm={() => { setError(''); setShowTrackModal(false); }}
                />
            )}
        </div>
    );
};

export default Signup;
