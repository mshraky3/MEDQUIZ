import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import './Signup.css';
import useLang from '../../hooks/useLang';

// Use login/landing style classes

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tempLinkInfo, setTempLinkInfo] = useState(null);
    const [isTempLink, setIsTempLink] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useParams();

    const [lang, setLang] = useLang();
    const isArabic = lang === 'ar';
    const toggleLanguage = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));

    useEffect(() => {
        // Check if this is a temporary link signup
        if (token) {
            validateTempLink();
            return;
        }

        // For free accounts, no payment flow needed
        // User can sign up directly
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
                setError('❌ Invalid or expired temporary link');
                setTimeout(() => {
                    navigate('/contact');
                }, 3000);
            }
        } catch (err) {
            setError('❌ Invalid or expired temporary link');
            setTimeout(() => {
                navigate('/contact');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // For username, remove whitespace and only allow letters, numbers, and underscores
        if (name === 'username') {
            const sanitizedValue = value.replace(/\s/g, '').toLowerCase();
            setForm(prev => ({
                ...prev,
                [name]: sanitizedValue
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value.toLowerCase()
            }));
        }
    };

    const validateForm = () => {
        if (!form.username || !form.password || !form.confirmPassword) {
            setError(isArabic ? 'جميع الحقول مطلوبة' : 'All fields are required');
            return false;
        }

        // Username validation: only letters, numbers, and underscores allowed
        const usernameRegex = /^[a-z0-9_]+$/;
        if (!usernameRegex.test(form.username)) {
            setError(isArabic ? 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام و _ فقط' : 'Username can only contain letters, numbers, and underscores');
            return false;
        }

        if (form.username.length < 3) {
            setError(isArabic ? 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' : 'Username must be at least 3 characters long');
            return false;
        }

        if (form.password !== form.confirmPassword) {
            setError(isArabic ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
            return false;
        }

        if (form.password.length < 6) {
            setError(isArabic ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            if (isTempLink) {
                // Create account from temporary link
                const response = await axios.post(`${Globals.URL}/api/signup/temp-link`, {
                    token: token,
                    username: form.username,
                    password: form.password
                });

                if (response.data.success) {
                    setSuccess(true);

                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        navigate('/login', {
                            state: {
                                message: 'Account created successfully! Please log in.',
                                username: form.username
                            }
                        });
                    }, 2000);
                } else {
                    throw new Error(response.data.message || 'Failed to create account');
                }
            } else {
                // Free account creation
                const response = await axios.post(`${Globals.URL}/api/signup/free`, {
                    username: form.username,
                    password: form.password
                });

                if (response.data.success) {
                    setSuccess(true);

                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        navigate('/login', {
                            state: {
                                message: 'Account created successfully! Please log in.',
                                username: form.username
                            }
                        });
                    }, 2000);
                } else {
                    throw new Error(response.data.message || 'Failed to create account');
                }
            }

        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response?.data?.message || error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-body">
                <div className="landing-lang-toggle">
                    <button
                        type="button"
                        className="lang-toggle-btn"
                        onClick={toggleLanguage}
                        aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
                    >
                        <span className="lang-toggle-icon" role="img" aria-hidden="true">🌐</span>
                        <span className="lang-toggle-text">{isArabic ? 'EN' : 'ع'}</span>
                    </button>
                </div>
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short" style={{ textAlign: 'center' }}>
                        <div className="success-icon" style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
                        <h2 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 12 }}>Account Created Successfully!</h2>
                        <p style={{ color: 'var(--muted)' }}>Your account has been created. Redirecting to login...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading && isTempLink) {
        return (
            <div className="login-body">
                <div className="landing-lang-toggle">
                    <button
                        type="button"
                        className="lang-toggle-btn"
                        onClick={toggleLanguage}
                        aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
                    >
                        <span className="lang-toggle-icon" role="img" aria-hidden="true">🌐</span>
                        <span className="lang-toggle-text">{isArabic ? 'EN' : 'ع'}</span>
                    </button>
                </div>
                <div className="login-wrapper signup-wide">
                    <div className="login-card signup-short">
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            Validating temporary link...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-body" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="landing-lang-toggle">
                <button
                    type="button"
                    className="lang-toggle-btn"
                    onClick={toggleLanguage}
                    aria-label={isArabic ? 'Switch to English' : 'التبديل إلى العربية'}
                >
                    <span className="lang-toggle-icon" role="img" aria-hidden="true">🌐</span>
                    <span className="lang-toggle-text">{isArabic ? 'EN' : 'ع'}</span>
                </button>
            </div>
            <div className="login-wrapper signup-wide">
                <div className="login-card signup-short">
                    <div className="login-header">
                        <div className="pill">{isArabic ? 'إنشاء حساب' : 'Sign Up'}</div>
                        <div className="login-title">{isArabic ? 'أنشئ حسابك' : 'Create Your Account'}</div>
                        <div className="login-subtitle">
                            {isTempLink
                                ? (isArabic ? 'أنشئ حسابك المجاني' : 'Create your free account')
                                : (isArabic ? 'أنشئ حسابك المجاني' : 'Create your free account')}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">{isArabic ? 'اسم المستخدم' : 'Username'}</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="form-input"
                                value={form.username}
                                onChange={handleInputChange}
                                placeholder={isArabic ? 'اختر اسم مستخدم' : 'Choose a username'}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">{isArabic ? 'كلمة المرور' : 'Password'}</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                                value={form.password}
                                onChange={handleInputChange}
                                placeholder={isArabic ? 'أنشئ كلمة مرور' : 'Create a password'}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">{isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                value={form.confirmPassword}
                                onChange={handleInputChange}
                                placeholder={isArabic ? 'أعد كتابة كلمة المرور' : 'Confirm your password'}
                                required
                            />
                        </div>
                        {error && (
                            <div className="alert-box error">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn primary large"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    {isArabic ? 'جاري إنشاء الحساب...' : 'Creating Account...'}
                                </div>
                            ) : (
                                isArabic ? 'أنشئ الحساب' : 'Create Account'
                            )}
                        </button>
                        <div className="login-footer-text">
                            {isArabic ? 'تواجه مشكلة؟' : 'Having trouble?'}{' '}
                            <a
                                className="link-primary"
                                href="mailto:alshraky3@gmail.com?subject=Account Support&body=Hi, I need help creating my account."
                            >
                                {isArabic ? 'تواصل مع الدعم' : 'Contact Support'}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
