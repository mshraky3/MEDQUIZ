import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Globals from '../../global.js';
import Navbar from '../common/Navbar.jsx';
import { UserContext } from '../../UserContext';

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

  // Add Google AdSense script (only in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9286976335875618";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      return () => {
        // Cleanup script when component unmounts
        const existingScript = document.querySelector(`script[src="${script.src}"]`);
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, []);

  // Auto-login if session is valid
  useEffect(() => {
    if (window.location.search.includes('session=expired')) {
      setSessionExpired(true);
    }
    if (user && sessionToken) {
      axios.post(`${Globals.URL}/session-validate`, { username: user.username })
        .then(res => {
          if (res.data.valid) {
            navigate('/quizs', { state: { id: user.id } });
          }
        });
    }
  }, [user, sessionToken, navigate]);

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
    usernamePlaceholder: "اسم المستخدم",
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
    credentialsError: "اسم المستخدم أو كلمة المرور غير صحيحة. حاول مرة أخرى.",
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

        if (response.data.expired) {
          // Show subscription expired message
          setShowPopup(true);
          setLoading(false);
          return;
        }

        if (response.data.showTerms) {
          setShowTermsPopup(true);
          setLoading(false);
          setUser(response.data.user || { username }, response.data.sessionToken);
          return;
        }

        setLoading(false);
        setUser(response.data.user || { username }, response.data.sessionToken);
        navigate('/quizs', { state: response.data });
      })
      .catch((err) => {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (err.response && err.response.data && err.response.data.alreadyLogged) {
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
                  placeholder="اسم المستخدم"
                  value={form.username}
                  onChange={handleChange}
                  className="form-input"
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
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
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