import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('email'); // 'email' | 'otp' | 'password'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('يرجى إدخال البريد الإلكتروني');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post(`${Globals.URL}/api/auth/send-otp`, {
                email: email.trim().toLowerCase(),
                purpose: 'reset',
            });
            setStep('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'فشل إرسال الرمز. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp.length !== 4) {
            setError('يرجى إدخال الرمز المكون من 4 أرقام');
            return;
        }
        setError('');
        setStep('password');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError('يرجى ملء جميع الحقول');
            return;
        }
        if (newPassword.length < 8) {
            setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post(`${Globals.URL}/api/auth/reset-password`, {
                email: email.trim().toLowerCase(),
                otp_code: otp,
                new_password: newPassword,
            });
            navigate('/login', { state: { message: 'تم تغيير كلمة المرور بنجاح' } });
        } catch (err) {
            setError(err.response?.data?.message || 'فشل تغيير كلمة المرور. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-body" dir="rtl">
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <span className="pill">استعادة الحساب</span>
                        <h1 className="login-title">نسيت كلمة المرور؟</h1>
                        <p className="login-subtitle">
                            {step === 'email' && 'أدخل بريدك الإلكتروني لاستقبال رمز التحقق'}
                            {step === 'otp' && 'أدخل الرمز المرسل إلى بريدك الإلكتروني'}
                            {step === 'password' && 'أدخل كلمة المرور الجديدة'}
                        </p>
                    </div>

                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOtp} className="login-form">
                            <div className="form-group">
                                <label className="form-label">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    placeholder="أدخل بريدك الإلكتروني"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    autoComplete="email"
                                />
                            </div>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large" disabled={loading}>
                                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
                            </button>
                            <div className="login-footer-text">
                                <a href="/login" className="link-primary">العودة لتسجيل الدخول</a>
                            </div>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="login-form">
                            <div className="form-group">
                                <label className="form-label">رمز التحقق</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="أدخل الرمز المكون من 4 أرقام"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    className="form-input"
                                    style={{ textAlign: 'center', fontSize: 28, letterSpacing: 12 }}
                                />
                            </div>
                            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                                تم إرسال الرمز إلى: <strong style={{ color: '#94a3b8' }}>{email}</strong>
                            </p>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large">التالي</button>
                            <div className="login-footer-text">
                                <button
                                    type="button"
                                    className="link-primary"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    onClick={() => { setStep('email'); setError(''); setOtp(''); }}
                                >
                                    تغيير البريد الإلكتروني
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 'password' && (
                        <form onSubmit={handleResetPassword} className="login-form">
                            <div className="form-group">
                                <label className="form-label">كلمة المرور الجديدة</label>
                                <input
                                    type="password"
                                    placeholder="8 أحرف على الأقل"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">تأكيد كلمة المرور</label>
                                <input
                                    type="password"
                                    placeholder="أعد إدخال كلمة المرور"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large" disabled={loading}>
                                {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
