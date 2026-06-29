import React, { useState, useContext, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import axios from 'axios';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import { safeGetItem } from '../../utils/safeStorage.js';

const Login = () => {
  const { setUser, user, sessionToken } = useContext(UserContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email migration state
  const [showMigrationPopup, setShowMigrationPopup] = useState(false);
  const [migrationEmail, setMigrationEmail] = useState('');
  const [migrationOtp, setMigrationOtp] = useState('');
  const [migrationStep, setMigrationStep] = useState('notify'); // 'notify' | 'otp'
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [migrationUsername, setMigrationUsername] = useState('');
  const [graceLoginsUsed, setGraceLoginsUsed] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';
    return () => {
      document.documentElement.dir = originalDir || 'rtl';
    };
  }, []);

  // Handle success message from signup redirect
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Auto-fill username if provided
      if (location.state.username) {
        setForm(prev => ({
          ...prev,
          username: location.state.username
        }));
      }
      // Clear the state to prevent message from showing again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Redirect away from /login if a session ALREADY exists when the page loads.
  // Runs once on mount and reads the stored session directly (not React context)
  // on purpose: a login via the form below is handled by handleSubmit, so this
  // must NOT depend on `user`/`sessionToken` — otherwise it re-fires the instant
  // setUser() runs after a fresh login, races handleSubmit's own routing, skips
  // the terms popup, and can bounce the user around ("kicked out after login").
  useEffect(() => {
    if (window.location.search.includes('session=expired')) {
      setSessionExpired(true);
    }
    let stored = null;
    try { stored = JSON.parse(safeGetItem('user') || 'null'); } catch (_) { stored = null; }
    const storedToken = safeGetItem('sessionToken');
    if (stored && storedToken && stored.username) {
      // Validate the token server-side (the endpoint now checks the token, not
      // just the logged flag) so a stale session never pulls us into the app.
      axios.post(
        `${Globals.URL}/session-validate`,
        { username: stored.username },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      )
        .then(res => {
          if (res.data.valid) {
            // Respect the subscription gate: unpaid/expired accounts belong on
            // the paywall, everyone else on the quizzes dashboard.
            if (stored.accessAllowed === false) {
              navigate('/subscribe', { replace: true });
            } else {
              navigate('/quizs', { replace: true, state: { id: stored.id } });
            }
          }
        })
        .catch(() => {
          // Network error or server unavailable — stay on login page
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autofill username from context if user is known (never autofill password for security)
  useEffect(() => {
    if (user && user.username) {
      setForm(prev => ({
        username: prev.username || user.username || '',
        password: prev.password || '' // Never autofill password for security reasons
      }));
    }
  }, [user]);

  const copy = {
    loginTitle: "تسجيل الدخول",
    sessionExpired: "انتهت جلسة الدخول الخاصة بك أو قام مستخدم آخر بتسجيل الدخول بهذا الحساب. الرجاء تسجيل الدخول مرة أخرى.",
    usernamePlaceholder: "البريد الإلكتروني",
    passwordPlaceholder: "كلمة المرور",
    loginButton: "تسجيل الدخول",
    loggingIn: "جاري تسجيل الدخول...",
    contactLink: "إنشاء حساب مجاني",
    termsTitle: "شروط الاستخدام",
    termsAccept: "أوافق على شروط الاستخدام",
    continue: "متابعة",
    popupTitle: "تجديد الاشتراك",
    popupBody: "انتهى اشتراكك أو أنك مستخدم جديد؟ يرجى التواصل معنا لإعادة التفعيل.",
    close: "إغلاق",
    contactUs: "تواصل معنا للاشتراك",
    contactSupport: "تواصل مع الدعم",
    requiredFieldsError: "يرجى إدخال اسم المستخدم وكلمة المرور.",
    accountInUseError: "هذا الحساب مستخدم حالياً على جهاز أو متصفح آخر. يرجى الانتظار 30 دقيقة أو تسجيل الخروج من الجهاز الآخر.",
    credentialsError: "البريد الإلكتروني أو كلمة المرور غير صحيحة. حاول مرة أخرى.",
    acceptTermsError: "تعذر قبول الشروط. يرجى المحاولة مرة أخرى.",
    popupIntro: "انتهى اشتراكك أو أنك مستخدم جديد؟\nيرجى التواصل معنا.",
    contactSupportEmail: "مرحباً، أحتاج مساعدة في تسجيل الدخول إلى حسابي.",
    supportSubject: "دعم تسجيل الدخول"
  };

  const supportMailLink = `mailto:alshraky3@gmail.com?subject=${encodeURIComponent(copy.supportSubject)}&body=${encodeURIComponent(copy.contactSupportEmail)}`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanedUsername = form.username.trim().toLowerCase();
    const password = form.password;

    if (!cleanedUsername || !password) {
      setError(copy.requiredFieldsError);
      return;
    }

    setError('');
    setLoading(true);

    // Admin bypass
    if (cleanedUsername === 'admin' && password === 'admin1810') {
      setLoading(false);
      navigate('/admin');
      return;
    }

    axios
      .post(`${Globals.URL}/login`, {
        username: cleanedUsername,
        password: password,
        deviceId: 'placeholder-device-id', // TODO: Replace with real device ID
      })
      .then((response) => {
        const username = cleanedUsername;

        // Subscription gate: when payment enforcement is on, the backend returns
        // a `subscription` object. Unpaid / expired accounts are funnelled to the
        // /subscribe paywall (handled in the redirect below); grandfathered,
        // admin, and active accounts pass straight through. RequireAuth is the
        // safety net for the popup paths (terms / email-migration) that follow.

        if (response.data.showTerms) {
          setShowTermsPopup(true);
          setLoading(false);
          setUser(response.data.user || { username }, response.data.sessionToken);
          return;
        }

        const loggedUser = response.data.user || { username };
        setUser(loggedUser, response.data.sessionToken);

        if (response.data.showEmailMigrationNotice) {
          setMigrationUsername(loggedUser.username || cleanedUsername);
          setMigrationEmail(loggedUser.email || '');
          setMigrationStep('notify');
          setMigrationError('');
          setGraceLoginsUsed(response.data.graceLoginsUsed || 0);
          setShowMigrationPopup(true);
          setLoading(false);
          return;
        }

        setLoading(false);
        // Unpaid / expired subscription → paywall.
        const sub = response.data.subscription;
        if (sub && sub.enforced && !sub.active) {
          navigate('/subscribe', { replace: true });
          return;
        }
        // Return the user to the protected page they were sent here from
        // (set by RequireAuth), defaulting to the quizzes dashboard.
        const redirectTo = location.state?.from || '/quizs';
        navigate(redirectTo, { state: response.data });
      })
      .catch((err) => {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (err.response?.data?.accountDeleted) {
          setError('تم حذف حسابك لعدم إضافة بريد إلكتروني بعد 3 محاولات. يمكنك إنشاء حساب جديد.');
        } else if (err.response && err.response.data && err.response.data.alreadyLogged) {
          setError(copy.accountInUseError);
        } else {
          if (newAttempts >= 10) {
            setShowPopup(true);
          }
          setError(copy.credentialsError);
        }
        setLoading(false);
      });
  };

  const handleSendMigrationOtp = async () => {
    if (!migrationEmail) {
      setMigrationError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(migrationEmail)) {
      setMigrationError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    setMigrationLoading(true);
    setMigrationError('');
    try {
      await axios.post(`${Globals.URL}/api/auth/send-otp`, {
        email: migrationEmail.toLowerCase().trim(),
        purpose: 'migration'
      });
      setMigrationStep('otp');
    } catch (err) {
      setMigrationError(err.response?.data?.message || 'فشل إرسال الرمز. حاول مرة أخرى.');
    } finally {
      setMigrationLoading(false);
    }
  };

  const handleVerifyMigrationOtp = async () => {
    if (!migrationOtp || migrationOtp.length !== 4) {
      setMigrationError('يرجى إدخال الرمز المكون من 4 أرقام');
      return;
    }
    setMigrationLoading(true);
    setMigrationError('');
    try {
      await axios.post(`${Globals.URL}/api/auth/verify-migration-otp`, {
        username: migrationUsername,
        email: migrationEmail.toLowerCase().trim(),
        otp_code: migrationOtp
      });
      setShowMigrationPopup(false);
      navigate('/quizs');
    } catch (err) {
      setMigrationError(err.response?.data?.message || 'الرمز غير صحيح أو منتهي الصلاحية');
    } finally {
      setMigrationLoading(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!termsChecked) return;
    setShowTermsPopup(false);
    setLoading(true);
    try {
      await axios.post(`${Globals.URL}/accept-terms`, { username: form.username.trim().toLowerCase() });
      setLoading(false);
      navigate('/quizs');
    } catch (err) {
      setLoading(false);
      setError(copy.acceptTermsError);
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    navigate('/contact');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="login-body" dir="rtl">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <span className="pill">
                مرحباً بعودتك
              </span>
              <h1 className="login-title">{copy.loginTitle}</h1>
              <p className="login-subtitle">
                استكمل رحلتك التدريبية وتابع تقدمك
              </p>
            </div>

            {sessionExpired && (
              <div className="alert-box warning">
                {copy.sessionExpired}
              </div>
            )}

            {successMessage && (
              <div className="alert-box success">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">{copy.usernamePlaceholder}</label>
                <input
                  type="text"
                  name="username"
                  placeholder="البريد الإلكتروني"
                  value={form.username}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{copy.passwordPlaceholder}</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="كلمة المرور"
                    value={form.password}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <Icon name="eye" size={18} /> : <Icon name="eye-off" size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'left', marginBottom: 8 }}>
                <a href="/forgot-password" className="link-primary" style={{ fontSize: 13 }}>نسيت كلمة المرور؟</a>
              </div>

              {error && (
                <div className="alert-box error">
                  {error}
                </div>
              )}

              <button type="submit" className="btn primary large" disabled={loading}>
                {loading ? copy.loggingIn : copy.loginButton}
              </button>

              <div className="login-footer-text">
                <span>لا تملك حساباً؟</span>
                <a href="/signup" className="link-primary">
                  {copy.contactLink}
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Terms of Use Popup */}
        {showTermsPopup && (
          <div className="popup-overlay" style={{ zIndex: 1000 }}>
            <div className="popup-content large-popup">
              <div className="terms-section">
                <h4>شروط الاستخدام</h4>
                <p>
                  <strong>هدف المنصة:</strong><br />
                  جميع الأسئلة والمواد المتاحة هنا جُمعت بجهود طلابية فردية ولا ترتبط بأي جهة تعليمية أو صحية رسمية. الغرض منها تعليمي بحت للمراجعة والتحضير.
                </p>
                <p>
                  <strong>تنبيه حول الدقة:</strong><br />
                  نبذل قصارى جهدنا للحفاظ على دقة المحتوى، لكن قد توجد أخطاء أو معلومات ناقصة. لا نضمن صحة أو اكتمال أو موثوقية أي مادة، ويجب الرجوع للمصادر الرسمية عند الاستعداد للاختبارات.
                </p>
                <p>
                  <strong>سياسات الحساب:</strong><br />
                  أنت مسؤول عن سرية بيانات الدخول. يمنع مشاركة الحساب مع أشخاص غير مصرح لهم، وللإدارة الحق في إيقاف أو حذف أي حساب مخالف.
                </p>
                <div>
                  <strong>سلوكيات محظورة:</strong><br />
                  <ul>
                    <li>تحميل أو نسخ المحتوى دون إذن كتابي من إدارة المنصة.</li>
                    <li>استخدام أدوات آلية لجمع أو نسخ الأسئلة.</li>
                    <li>تزييف الهوية أو الانتحال عند استخدام الخدمة.</li>
                  </ul>
                </div>
                <p>
                  <strong>الملكية الفكرية:</strong><br />
                  جميع المحتوى محمي بحقوق الملكية الفكرية، وأي استخدام غير مصرح به يعرض صاحبه للمساءلة.
                </p>
                <p>
                  <strong>حدود المسؤولية:</strong><br />
                  لا تتحمل المنصة أو القائمون عليها أي مسؤولية عن أضرار مباشرة أو غير مباشرة ناتجة عن استخدامك للموقع أو اعتمادك على المحتوى.
                </p>
                <p>
                  باستخدامك لهذه الخدمة فأنت تقر بقراءة الشروط والموافقة عليها بالكامل.
                </p>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                />
                {copy.termsAccept}
              </label>
              <button
                className="popup-btn try-free"
                onClick={handleAcceptTerms}
                disabled={!termsChecked}
                style={{ marginTop: '15px' }}
              >
                {copy.continue}
              </button>
            </div>
          </div>
        )}

        {/* Email Migration Popup */}
        {showMigrationPopup && (() => {
          const graceLeft = 3 - graceLoginsUsed;
          const isLastChance = graceLeft <= 0;
          const warningColor = graceLeft <= 1 ? '#ef4444' : graceLeft === 2 ? '#f97316' : '#6366f1';
          const warningText = isLastChance
            ? 'هذه آخر فرصة! لن تتمكن من الدخول مرة أخرى بدون بريد إلكتروني.'
            : graceLeft === 1
              ? `تحذير: لديك محاولة دخول واحدة فقط متبقية قبل حذف حسابك نهائياً.`
              : `لديك ${graceLeft} محاولات دخول متبقية قبل حذف حسابك.`;
          return (
            <div className="popup-overlay" style={{ zIndex: 1100 }}>
              <div className="popup-content large-popup" style={{ maxWidth: 420 }}>
                {migrationStep === 'notify' ? (
                  <>
                    <h3 style={{ color: warningColor, marginBottom: 12 }}><Icon name="mail" size={18} /> أضف بريدك الإلكتروني</h3>
                    <div style={{ background: isLastChance ? '#450a0a' : graceLeft === 1 ? '#431407' : '#1e1b4b', border: `1px solid ${warningColor}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: warningColor, fontSize: 14, lineHeight: 1.7 }}>
                      {warningText}
                    </div>
                    <p style={{ marginBottom: 16, lineHeight: 1.7, color: '#94a3b8', fontSize: 14 }}>
                      أضف بريدك الإلكتروني الآن لتأمين حسابك والاستفادة من جميع ميزات المنصة.
                    </p>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', marginBottom: 6, color: '#94a3b8', fontSize: 14 }}>البريد الإلكتروني</label>
                      <input
                        type="email"
                        className="form-input"
                        value={migrationEmail}
                        onChange={(e) => setMigrationEmail(e.target.value)}
                        placeholder="أدخل بريدك الإلكتروني"
                        style={{ marginBottom: 0 }}
                      />
                    </div>
                    {migrationError && <div className="alert-box error" style={{ marginBottom: 12 }}>{migrationError}</div>}
                    <div className="popup-buttons" style={{ flexDirection: 'column', gap: 8 }}>
                      <button
                        className="popup-btn try-free"
                        onClick={handleSendMigrationOtp}
                        disabled={migrationLoading}
                      >
                        {migrationLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
                      </button>
                      {!isLastChance && (
                        <button
                          className="popup-btn no-thanks"
                          onClick={() => { setShowMigrationPopup(false); navigate('/quizs'); }}
                          disabled={migrationLoading}
                        >
                          تخطى الآن
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ color: '#6366f1', marginBottom: 12 }}>تأكيد البريد الإلكتروني</h3>
                    <p style={{ marginBottom: 16, color: '#94a3b8' }}>
                      أدخل الرمز المرسل إلى {migrationEmail}
                    </p>
                    <input
                      type="text"
                      className="form-input"
                      value={migrationOtp}
                      onChange={(e) => setMigrationOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="0000"
                      maxLength={4}
                      inputMode="numeric"
                      style={{ textAlign: 'center', fontSize: '28px', letterSpacing: '10px', marginBottom: 12 }}
                    />
                    {migrationError && <div className="alert-box error" style={{ marginBottom: 12 }}>{migrationError}</div>}
                    <div className="popup-buttons" style={{ flexDirection: 'column', gap: 8 }}>
                      <button
                        className="popup-btn try-free"
                        onClick={handleVerifyMigrationOtp}
                        disabled={migrationLoading}
                      >
                        {migrationLoading ? 'جاري التحقق...' : 'تأكيد'}
                      </button>
                      <button
                        className="popup-btn no-thanks"
                        onClick={() => { setMigrationStep('notify'); setMigrationOtp(''); setMigrationError(''); }}
                        disabled={migrationLoading}
                      >
                        ← رجوع
                      </button>
                      {!isLastChance && (
                        <button
                          className="popup-btn no-thanks"
                          onClick={() => { setShowMigrationPopup(false); navigate('/quizs'); }}
                          disabled={migrationLoading}
                          style={{ color: '#64748b' }}
                        >
                          تخطى الآن
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* Subscription Expired Popup */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content large-popup">
              <h3>{copy.popupTitle}</h3>
              <p>{copy.popupBody}</p>
              <div className="popup-buttons">
                <button onClick={handleClosePopup} className="popup-btn no-thanks">
                  {copy.close}
                </button>
                <button className="popup-btn Contact-Us" onClick={() => navigate('/contact')}>
                  {copy.contactUs}
                </button>
                <button
                  className="popup-btn contact-support"
                  onClick={() => window.location.href = supportMailLink}
                >
                  {copy.contactSupport}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;