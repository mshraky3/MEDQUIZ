import React, { useState, useEffect, useContext } from 'react';
import Icon from '../common/Icon.jsx';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { safeTrack, trackFunnel } from '../../utils/analytics.js';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import { UserContext } from '../../UserContext';
import { TRACKS, TRACK_KEYS, normalizeTrack, pick } from '../../utils/tracks.js';
import { useCopy, useLang } from '../../i18n';
import authCopy from '../../i18n/copy/auth.js';
import '../login/Login.css';
import './Signup.css';

const Signup = () => {
    const { setUser } = useContext(UserContext);
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [trialGranted, setTrialGranted] = useState(false);
    const [tempLinkInfo, setTempLinkInfo] = useState(null);
    const [isTempLink, setIsTempLink] = useState(false);
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
    const navigate = useNavigate();
    const { token } = useParams();
    const t = useCopy(authCopy).signup;
    const { lang, dir } = useLang();

    useEffect(() => {
        if (token) {
            validateTempLink();
        } else {
            // Regular signup: ask which kind of student this is, first thing.
            setShowTrackModal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        trackFunnel('signup_view', { entryType: token ? 'temp-link' : 'free-account' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                deviceId: 'placeholder-device-id',
            });

            if (loginRes.data.showTerms) {
                await axios.post(`${Globals.URL}/accept-terms`, { username }).catch(() => {});
            }

            setUser(loginRes.data.user || { username }, loginRes.data.sessionToken);

            const sub = loginRes.data.subscription;
            setTimeout(() => {
                if (sub && sub.enforced && !sub.active) {
                    navigate('/subscribe', { replace: true });
                } else {
                    navigate('/quizs', { replace: true, state: loginRes.data });
                }
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
            const endpoint = isTempLink ? '/api/signup/temp-link' : '/api/signup/free';
            const payload = isTempLink
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
                    entryType: isTempLink ? 'temp-link' : 'free-account',
                    studyTrack: response.data.track || studyTrack,
                });
                if (!isTempLink) trackFunnel('signup_otp_verified', { track: response.data.track || studyTrack });
                if (response.data.trial?.granted) trackFunnel('trial_started', { track: response.data.track || studyTrack });

                setTrialGranted(!!response.data.trial?.granted);
                setSuccess(true);
                await autoLogin();
            } else {
                throw new Error(response.data.message || t.errCreate);
            }
        } catch (error) {
            if (!isTempLink) trackFunnel('signup_otp_failed', { message: error.response?.data?.message || error.message });
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

        if (isTempLink) {
            await createAccount(null);
            return;
        }

        setLoading(true);
        try {
            await sendOtp();
            setStep('otp');
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
        } catch (err) {
            setError(err.response?.data?.message || t.errSendOtp);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 4) {
            setError(t.errOtpLength);
            return;
        }

        await createAccount(otp);
    };

    if (success) {
        return (
            <div className="login-body" dir={dir}>
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short" style={{ textAlign: 'center' }}>
                        <div className="success-icon" style={{ color: 'var(--success-color, #16a34a)', marginBottom: 20 }}><Icon name="check-circle" size={56} /></div>
                        <h2 style={{ color: 'var(--text-dark, #0f1e3d)', fontWeight: 700, marginBottom: 12 }}>{t.successTitle}</h2>
                        {trialGranted && (
                            <p style={{ color: 'var(--text-dark, #0f1e3d)', fontWeight: 600, marginBottom: 8 }}>
                                {t.successTrial}
                            </p>
                        )}
                        <p style={{ color: 'var(--muted)' }}>{t.successRedirect}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (token && loading && !tempLinkInfo && !linkInvalid) {
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
                                {t.invalidLinkBody}
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
                        <div className="pill">{isTempLink ? t.pillInvite : t.pillFree}</div>
                        <div className="login-title">
                            {isTempLink ? t.titleInvite : t.titleFree}
                        </div>
                        <div className="login-subtitle">
                            {step === 'credentials'
                                ? (isTempLink ? t.subtitleInvite : t.subtitleFree)
                                : (isTempLink
                                    ? t.subtitleOtpInvite(form.email)
                                    : t.subtitleOtpFree(form.email))}
                        </div>
                    </div>

                    {!isTempLink && (
                        <div className="trial-callout">
                            <span className="trial-callout-icon" aria-hidden="true"><Icon name="clock" size={20} /></span>
                            <div className="trial-callout-body">
                                <strong>{t.trialCalloutTitle}</strong>
                                <span>{t.trialCalloutBody}</span>
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
                                    required
                                />
                            </div>
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
                                    required
                                />
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
                                    <div className="loading-spinner"><Spinner size="sm" />{isTempLink ? t.creatingAccount : t.sending}</div>
                                ) : (isTempLink ? t.submitInvite : t.submitFree)}
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
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder={t.otpPlaceholder}
                                    maxLength={4}
                                    inputMode="numeric"
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
                                    disabled={loading}
                                >
                                    {t.resend}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* ── Study-track modal ────────────────────────────────────────────
                Opens before anything else on a regular signup and cannot be
                dismissed without answering. It exists because the track decides
                which bank, summaries and analytics the account will ever see,
                and only an admin can move an account afterwards — an inline
                radio with a default was quietly sending nursing students into
                the medical bank. */}
            {showTrackModal && !isTempLink && (
                <div className="track-modal" dir={dir} role="dialog" aria-modal="true" aria-labelledby="track-modal-title">
                    <div className="track-modal-card">
                        <div className="track-modal-head">
                            <span className="track-modal-eyebrow">{t.trackModal.eyebrow}</span>
                            <h2 id="track-modal-title">{t.trackModal.title}</h2>
                            <p>{t.trackModal.body}</p>
                        </div>

                        <div className="track-modal-options">
                            {TRACK_KEYS.map((key) => {
                                const trackDef = TRACKS[key];
                                const selected = studyTrack === key;
                                return (
                                    <button
                                        type="button"
                                        key={key}
                                        className={`track-modal-option${selected ? ' is-selected' : ''}`}
                                        aria-pressed={selected}
                                        onClick={() => { setStudyTrack(key); trackFunnel('signup_track_selected', { track: key }); }}
                                    >
                                        <span className="track-modal-option-icon" aria-hidden="true">
                                            <Icon name={trackDef.icon} size={26} />
                                        </span>
                                        <span className="track-modal-option-title">{pick(trackDef.label, lang)}</span>
                                        <span className="track-modal-option-exam">{pick(trackDef.exam, lang)}</span>
                                        <span className="track-modal-option-desc">{pick(trackDef.blurb, lang)}</span>
                                        <span className="track-modal-option-mark" aria-hidden="true">
                                            <Icon name="check" size={15} />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            className="btn primary large track-modal-confirm"
                            disabled={!studyTrack}
                            onClick={() => { setError(''); setShowTrackModal(false); }}
                        >
                            {studyTrack
                                ? t.trackModal.confirm(pick(TRACKS[studyTrack].label, lang))
                                : t.trackModal.confirmEmpty}
                        </button>

                        <p className="track-modal-note">
                            <Icon name="info" size={14} /> {t.trackModal.note}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
