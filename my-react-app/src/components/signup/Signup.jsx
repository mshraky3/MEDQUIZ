import React, { useState, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { track } from '@vercel/analytics';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
import '../login/Login.css';
import './Signup.css';

const Signup = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tempLinkInfo, setTempLinkInfo] = useState(null);
    const [isTempLink, setIsTempLink] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useParams();

    useEffect(() => {
        if (token) {
            validateTempLink();
        }
    }, [location.state, navigate, token]);

    const validateTempLink = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${Globals.URL}/api/validate-temp-link/${token}`);
            if (response.data.valid) {
                setTempLinkInfo(response.data.link);
                setIsTempLink(true);
                setError('');
            } else {
                setError('Invalid or expired temporary link');
                setTimeout(() => navigate('/contact'), 3000);
            }
        } catch (err) {
            setError('Invalid or expired temporary link');
            setTimeout(() => navigate('/contact'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateCredentials = () => {
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

        return true;
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
                : { email: form.email.trim().toLowerCase(), password: form.password, otp_code: otpCode };

            const response = await axios.post(`${Globals.URL}${endpoint}`, payload);

            if (response.data.success) {
                try {
                    track('signup_success', { entryType: isTempLink ? 'temp-link' : 'free-account' });
                } catch (trackError) {
                    console.debug('Analytics track skipped:', trackError);
                }

                setSuccess(true);
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.',
                            username: form.email.trim().toLowerCase()
                        }
                    });
                }, 2000);
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
                        <div className="success-icon" style={{ fontSize: 60, marginBottom: 20 }}><Icon name="check-circle" size={56} /></div>
                        <h2 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 12 }}>تم إنشاء الحساب بنجاح!</h2>
                        <p style={{ color: 'var(--muted)' }}>جاري التحويل لتسجيل الدخول...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading && isTempLink && !tempLinkInfo) {
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

    return (
        <div className="login-body" dir="rtl">
            <div className="login-wrapper signup-wide">
                <div className="login-card signup-short">
                    <div className="login-header">
                        <div className="pill">إنشاء حساب</div>
                        <div className="login-title">أنشئ حسابك</div>
                        <div className="login-subtitle">
                            {step === 'credentials'
                                ? 'أنشئ حسابك المجاني ثم ابدأ اختباراً سريعاً من 10 أسئلة'
                                : `أدخل رمز التحقق المرسل إلى ${form.email}`}
                        </div>
                    </div>

                    {step === 'credentials' ? (
                        <form onSubmit={handleCredentialsSubmit} className="login-form">
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
                                ) : 'إنشاء الحساب'}
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
        </div>
    );
};

export default Signup;
