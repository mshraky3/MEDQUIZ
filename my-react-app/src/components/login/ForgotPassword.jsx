import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import { useCopy, useLang } from '../../i18n';
import authCopy from '../../i18n/copy/auth.js';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const t = useCopy(authCopy).forgot;
    const { dir } = useLang();
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
            setError(t.errEmailRequired);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError(t.errEmailInvalid);
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
            setError(err.response?.data?.message || t.errSendFailed);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError(t.errOtpLength);
            return;
        }
        setError('');
        setStep('password');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            setError(t.errAllFields);
            return;
        }
        if (newPassword.length < 8) {
            setError(t.errPasswordLength);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t.errPasswordMatch);
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
            navigate('/login', { state: { message: t.done } });
        } catch (err) {
            setError(err.response?.data?.message || t.errResetFailed);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-body" dir={dir}>
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <span className="pill">{t.pill}</span>
                        <h1 className="login-title">{t.title}</h1>
                        <p className="login-subtitle">
                            {step === 'email' && t.subtitleEmail}
                            {step === 'otp' && t.subtitleOtp}
                            {step === 'password' && t.subtitlePassword}
                        </p>
                    </div>

                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleSendOtp} className="login-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="forgot-email">{t.emailLabel}</label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    placeholder={t.emailPlaceholder}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    autoComplete="email"
                                />
                            </div>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large" disabled={loading}>
                                {loading ? t.sending : t.sendOtp}
                            </button>
                            <div className="login-footer-text">
                                <a href="/login" className="link-primary">{t.backToLogin}</a>
                            </div>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOtp} className="login-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="forgot-otp">{t.otpLabel}</label>
                                <input
                                    id="forgot-otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder={t.otpPlaceholder}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="form-input"
                                    autoComplete="one-time-code"
                                    style={{ textAlign: 'center', fontSize: 28, letterSpacing: 12 }}
                                />
                            </div>
                            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                                {t.otpSentTo} <strong style={{ color: '#94a3b8' }} dir="ltr">{email}</strong>
                            </p>
                            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.6 }}>
                                {t.spamHintBefore} <strong>{t.spamFolder}</strong> {t.spamOr} <strong>{t.trashFolder}</strong>.
                            </p>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large">{t.next}</button>
                            <div className="login-footer-text">
                                <button
                                    type="button"
                                    className="link-primary"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    onClick={() => { setStep('email'); setError(''); setOtp(''); }}
                                >
                                    {t.changeEmail}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 'password' && (
                        <form onSubmit={handleResetPassword} className="login-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="forgot-new-password">{t.newPasswordLabel}</label>
                                <input
                                    id="forgot-new-password"
                                    type="password"
                                    placeholder={t.newPasswordPlaceholder}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="form-input"
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="forgot-confirm-password">{t.confirmLabel}</label>
                                <input
                                    id="forgot-confirm-password"
                                    type="password"
                                    placeholder={t.confirmPlaceholder}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    autoComplete="new-password"
                                />
                            </div>
                            {error && <div className="alert-box error">{error}</div>}
                            <button type="submit" className="btn primary large" disabled={loading}>
                                {loading ? t.submitting : t.submit}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
