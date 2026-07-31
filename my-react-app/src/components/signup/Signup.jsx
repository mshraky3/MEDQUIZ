import React, { useState, useEffect, useContext } from 'react';
import Icon from '../common/Icon.jsx';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { track } from '@vercel/analytics';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import { UserContext } from '../../UserContext';
import { TRACKS, TRACK_KEYS, normalizeTrack } from '../../utils/tracks.js';
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

    useEffect(() => {
        if (token) {
            validateTempLink();
        } else {
            // Regular signup: ask which kind of student this is, first thing.
            setShowTrackModal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

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
            setError('يرجى اختيار مسارك الدراسي أولاً');
            setShowTrackModal(true);
            return false;
        }

        if (!form.email || !form.password || !form.confirmPassword) {
            setError('جميع الحقول مطلوبة');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            setError('يرجى إدخال بريد إلكتروني صحيح');
            return false;
        }

        if (form.password.length < 8) {
            setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return false;
        }

        if (form.password !== form.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return false;
        }

        if (!termsAgreed) {
            setError('يجب الموافقة على شروط الاستخدام للمتابعة');
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
                        message: 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.',
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
                try {
                    track('signup_success', {
                        entryType: isTempLink ? 'temp-link' : 'free-account',
                        studyTrack: response.data.track || studyTrack,
                    });
                } catch (trackError) {
                    console.debug('Analytics track skipped:', trackError);
                }

                setTrialGranted(!!response.data.trial?.granted);
                setSuccess(true);
                await autoLogin();
            } else {
                throw new Error(response.data.message || 'فشل في إنشاء الحساب');
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'فشل في إنشاء الحساب');
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
            setError(err.response?.data?.message || 'فشل إرسال رمز التحقق. حاول مرة أخرى.');
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
            setError(err.response?.data?.message || 'فشل إرسال رمز التحقق. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 4) {
            setError('يرجى إدخال الرمز المكون من 4 أرقام');
            return;
        }

        await createAccount(otp);
    };

    if (success) {
        return (
            <div className="login-body" dir="rtl">
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short" style={{ textAlign: 'center' }}>
                        <div className="success-icon" style={{ color: 'var(--success-color, #16a34a)', marginBottom: 20 }}><Icon name="check-circle" size={56} /></div>
                        <h2 style={{ color: 'var(--text-dark, #0f1e3d)', fontWeight: 700, marginBottom: 12 }}>تم إنشاء الحساب بنجاح!</h2>
                        {trialGranted && (
                            <p style={{ color: 'var(--text-dark, #0f1e3d)', fontWeight: 600, marginBottom: 8 }}>
                                لديك الآن ساعة وصول كامل مجاناً لكل الأسئلة والملخصات والتحليلات 🎉
                            </p>
                        )}
                        <p style={{ color: 'var(--muted)' }}>جاري تسجيل دخولك وتحويلك للمنصة...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (token && loading && !tempLinkInfo && !linkInvalid) {
        return (
            <div className="login-body" dir="rtl">
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
                            <Spinner size="md" />
                            <span>جاري التحقق من الرابط...</span>
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
            <div className="login-body" dir="rtl">
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short" style={{ textAlign: 'center' }}>
                        <div className="login-header">
                            <div className="login-title">رابط الدعوة غير صالح</div>
                            <div className="login-subtitle">
                                انتهت صلاحية هذا الرابط أو تم استخدامه من قبل. يمكنك إنشاء حساب عادي الآن والبدء بتجربة مجانية.
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
                                إنشاء حساب والبدء مجاناً
                            </button>
                            <div className="login-footer-text">
                                تعتقد أن هذا خطأ؟{' '}
                                <Link to="/contact" className="link-primary">تواصل مع الدعم</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-body" dir="rtl">
            <div className="login-wrapper signup-wide">
                <div className="login-card signup-short">
                    <div className="login-header">
                        <div className="pill">{isTempLink ? 'إنشاء حساب' : '🎁 تجربة مجانية — ساعة كاملة'}</div>
                        <div className="login-title">
                            {isTempLink ? 'أنشئ حسابك' : 'ابدأ تجربتك المجانية'}
                        </div>
                        <div className="login-subtitle">
                            {step === 'credentials'
                                ? (isTempLink
                                    ? 'أنشئ حسابك المجاني ثم ابدأ اختباراً سريعاً من 10 أسئلة'
                                    : 'أنشئ حسابك وأكّد بريدك لتبدأ فوراً ساعة وصول كامل مجاناً')
                                : (isTempLink
                                    ? `أدخل رمز التحقق المرسل إلى ${form.email}`
                                    : `أدخل الرمز المرسل إلى ${form.email} — وبتأكيده تبدأ ساعتك المجانية`)}
                        </div>
                    </div>

                    {!isTempLink && (
                        <div className="trial-callout">
                            <span className="trial-callout-icon" aria-hidden="true"><Icon name="clock" size={20} /></span>
                            <div className="trial-callout-body">
                                <strong>ساعة كاملة مجاناً بعد تأكيد بريدك</strong>
                                <span>وصول كامل لكل الأسئلة والتحليلات — بدون بطاقة دفع، وبدون التزام.</span>
                            </div>
                        </div>
                    )}

                    {step === 'credentials' ? (
                        <form onSubmit={handleCredentialsSubmit} className="login-form">
                            {isTempLink ? (
                                <div className="track-locked">
                                    <Icon name={TRACKS[studyTrack].icon} size={18} />
                                    <span>مسار الدراسة: <strong>{TRACKS[studyTrack].labelAr}</strong> — محدَّد مسبقاً في رابط الدعوة.</span>
                                </div>
                            ) : (
                                <div className="track-chosen">
                                    <span className="track-chosen-icon" aria-hidden="true">
                                        <Icon name={studyTrack ? TRACKS[studyTrack].icon : 'help-circle'} size={20} />
                                    </span>
                                    <span className="track-chosen-body">
                                        <span className="track-chosen-label">مسارك الدراسي</span>
                                        <strong className="track-chosen-value">
                                            {studyTrack ? TRACKS[studyTrack].labelAr : 'لم يُحدَّد بعد'}
                                        </strong>
                                    </span>
                                    <button
                                        type="button"
                                        className="track-chosen-change"
                                        onClick={() => setShowTrackModal(true)}
                                    >
                                        {studyTrack ? 'تغيير' : 'اختر الآن'}
                                    </button>
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    placeholder="أدخل بريدك الإلكتروني"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">كلمة المرور</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    value={form.password}
                                    onChange={handleInputChange}
                                    placeholder="8 أحرف على الأقل"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">تأكيد كلمة المرور</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    value={form.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="أعد كتابة كلمة المرور"
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
                                    أوافق على{' '}
                                    <Link to="/terms" target="_blank" rel="noopener" className="link-primary">شروط الاستخدام</Link>
                                    {' '}و{' '}
                                    <Link to="/privacy" target="_blank" rel="noopener" className="link-primary">سياسة الخصوصية</Link>
                                </span>
                            </label>
                            {error && <div className="alert-box error">{error}</div>}
                            <button
                                type="submit"
                                className="btn primary large"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="loading-spinner"><Spinner size="sm" />{isTempLink ? 'جاري إنشاء الحساب...' : 'جاري الإرسال...'}</div>
                                ) : (isTempLink ? 'إنشاء الحساب' : 'إرسال رمز التحقق')}
                            </button>
                            <div className="login-footer-text">
                                لديك حساب بالفعل؟{' '}
                                <Link to="/login" className="link-primary">تسجيل الدخول</Link>
                            </div>
                            <div className="login-footer-text">
                                تواجه مشكلة؟{' '}
                                <a className="link-primary" href="mailto:alshraky3@gmail.com?subject=Account Support">
                                    تواصل مع الدعم
                                </a>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="otp">رمز التحقق</label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    className="form-input"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="أدخل الرمز المكون من 4 أرقام"
                                    maxLength={4}
                                    inputMode="numeric"
                                    required
                                    style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                                />
                                <p className="form-hint" style={{ marginTop: 8, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                                    ⚠️ إذا لم تجد الرمز في بريدك، تحقّق من مجلد <strong>الرسائل غير المرغوب فيها (Spam)</strong> أو <strong>المهملات</strong>.
                                </p>
                            </div>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large" disabled={loading}>
                                {loading ? (
                                    <div className="loading-spinner"><Spinner size="sm" />جاري إنشاء الحساب...</div>
                                ) : 'تأكيد وبدء التجربة المجانية'}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                style={{ background: 'transparent', color: 'var(--muted)', marginTop: 8 }}
                                onClick={() => { setStep('credentials'); setOtp(''); setError(''); }}
                                disabled={loading}
                            >
                                ← تغيير البريد الإلكتروني
                            </button>
                            <div className="login-footer-text">
                                لم يصلك الرمز؟{' '}
                                <button
                                    type="button"
                                    className="link-primary"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                >
                                    أعد الإرسال
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
                <div className="track-modal" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="track-modal-title">
                    <div className="track-modal-card">
                        <div className="track-modal-head">
                            <span className="track-modal-eyebrow">الخطوة الأولى</span>
                            <h2 id="track-modal-title">هل أنت طالب/خريج تمريض أم طب بشري؟</h2>
                            <p>
                                اختيارك يحدّد بنك الأسئلة والملخصات وتحليل الأداء الذي ستستخدمه.
                                اختر بدقّة — لا يمكن تغييره لاحقاً إلا عبر الدعم.
                            </p>
                        </div>

                        <div className="track-modal-options">
                            {TRACK_KEYS.map((key) => {
                                const t = TRACKS[key];
                                const selected = studyTrack === key;
                                return (
                                    <button
                                        type="button"
                                        key={key}
                                        className={`track-modal-option${selected ? ' is-selected' : ''}`}
                                        aria-pressed={selected}
                                        onClick={() => setStudyTrack(key)}
                                    >
                                        <span className="track-modal-option-icon" aria-hidden="true">
                                            <Icon name={t.icon} size={26} />
                                        </span>
                                        <span className="track-modal-option-title">{t.labelAr}</span>
                                        <span className="track-modal-option-exam">{t.examAr}</span>
                                        <span className="track-modal-option-desc">{t.blurbAr}</span>
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
                                ? `متابعة كـ«${TRACKS[studyTrack].labelAr}»`
                                : 'اختر مسارك للمتابعة'}
                        </button>

                        <p className="track-modal-note">
                            <Icon name="info" size={14} /> اخترت المسار الخطأ؟ راسل الدعم قبل الاشتراك ونحوّل حسابك مجاناً.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
