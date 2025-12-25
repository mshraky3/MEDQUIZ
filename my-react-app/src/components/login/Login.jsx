import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Globals from '../../global.js';
import SEO from '../common/SEO';
import Navbar from '../common/Navbar.jsx';
import { UserContext } from '../../UserContext';
import useLang from '../../hooks/useLang';

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
  const [lang] = useLang();
  const isArabic = lang === 'ar';

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    return () => {
      document.documentElement.dir = originalDir || 'ltr';
    };
  }, [isArabic]);

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": isArabic ? "تسجيل الدخول - منصة SQB للتحضير لاختبار SMLE" : "SQB Login - Access Your SMLE Prep Account",
    "description": isArabic
      ? "سجّل دخولك إلى منصة SQB للوصول إلى أكثر من 5000 سؤال تدريبي وتحليلات دقيقة وأدوات تحضير شاملة لاختبار البرومترك (SMLE)."
      : "Login to your SQB account to access over 5,000 SMLE practice questions, detailed analytics, and comprehensive exam preparation tools.",
    "url": "https://medquiz.vercel.app/login",
    "mainEntity": {
      "@type": "LoginAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://medquiz.vercel.app/login"
      }
    }
  };

  const copy = {
    loginTitle: isArabic ? "تسجيل الدخول" : "Login",
    sessionExpired: isArabic
      ? "انتهت جلسة الدخول الخاصة بك أو قام مستخدم آخر بتسجيل الدخول بهذا الحساب. الرجاء تسجيل الدخول مرة أخرى."
      : "Your session has expired or another user has logged in with this account. Please log in again.",
    usernamePlaceholder: isArabic ? "اسم المستخدم" : "USERNAME",
    passwordPlaceholder: isArabic ? "كلمة المرور" : "PASSWORD",
    loginButton: isArabic ? "تسجيل الدخول" : "Log in",
    loggingIn: isArabic ? "جاري تسجيل الدخول..." : "Logging in...",
    contactLink: isArabic ? "إنشاء حساب مجاني" : "Create free account",
    termsTitle: isArabic ? "شروط الاستخدام" : "Terms of Use",
    termsAccept: isArabic ? "أوافق على شروط الاستخدام" : "I accept the Terms of Use",
    continue: isArabic ? "متابعة" : "Continue",
    popupTitle: isArabic ? "تجديد الاشتراك" : "Renew Subscription",
    popupBody: isArabic ? "انتهى اشتراكك أو أنك مستخدم جديد؟ يرجى التواصل معنا لإعادة التفعيل." : "Your subscription has expired or you are a new user? Please contact us.",
    close: isArabic ? "إغلاق" : "Close",
    contactUs: isArabic ? "تواصل معنا للاشتراك" : "Contact Us to Subscribe",
    contactSupport: isArabic ? "تواصل مع الدعم" : "Contact Support",
    requiredFieldsError: isArabic ? "يرجى إدخال اسم المستخدم وكلمة المرور." : "Please enter both username and password.",
    accountInUseError: isArabic
      ? "هذا الحساب مستخدم حالياً على جهاز أو متصفح آخر. يرجى الانتظار 30 دقيقة أو تسجيل الخروج من الجهاز الآخر."
      : "This account is already in use on another device or browser. Please wait 30 minutes or ask the other user to log out.",
    credentialsError: isArabic ? "اسم المستخدم أو كلمة المرور غير صحيحة. حاول مرة أخرى." : "Your username or password is wrong! Try again.",
    acceptTermsError: isArabic ? "تعذر قبول الشروط. يرجى المحاولة مرة أخرى." : "Failed to accept terms. Please try again.",
    popupIntro: isArabic ? "انتهى اشتراكك أو أنك مستخدم جديد؟\nيرجى التواصل معنا." : "Your subscription has expired or you are a new user?\nPlease contact us.",
    contactSupportEmail: isArabic ? "مرحباً، أحتاج مساعدة في تسجيل الدخول إلى حسابي." : "Hi, I need help with my account login.",
    supportSubject: isArabic ? "دعم تسجيل الدخول" : "Login Support"
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
      <Navbar />
      <SEO 
        title={isArabic ? "تسجيل الدخول - منصة SQB للتحضير لاختبار SMLE" : "Login - Access Your SMLE Prep Account"}
        description={isArabic
          ? "سجّل دخولك للوصول إلى أسئلة SQB التدريبية، والتحليلات المتقدمة، وأدوات التحضير الشاملة لاختبار البرومترك (SMLE)."
          : "Login to your SQB account to access over 5,000 SMLE practice questions, detailed analytics, and comprehensive exam preparation tools. Secure login for medical students."
        }
        keywords={isArabic
          ? "تسجيل دخول SMLE, منصة SQB, أسئلة برومترك, منصة طبية تعليمية"
          : "SMLE login, medical exam login, Saudi medical license login, SQB login, medical quiz login, secure login"
        }
        url="https://medquiz.vercel.app/login"
        structuredData={structuredData}
      />
      <div className="login-body" dir={isArabic ? "rtl" : "ltr"}>
        <div className="login-wrapper">
          <div className="login-header">
            <div className="login-icon" />
          </div>

          <div className="login-box">
            <h2 className="login-title">{copy.loginTitle}</h2>
            {sessionExpired && (
              <div className="login-error" style={{ marginBottom: 10 }}>
                {copy.sessionExpired}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder={copy.usernamePlaceholder}
                value={form.username}
                onChange={handleChange}
                className="login-input"
              />
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={copy.passwordPlaceholder}
                  value={form.password}
                  onChange={handleChange}
                  className="login-input"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <img 
                    src="https://img.icons8.com/?size=100&id=988&format=png&color=000000" 
                    alt={isArabic ? (showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور") : (showPassword ? "Hide password" : "Show password")}
                    className="password-toggle-icon"
                  />
                </button>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? copy.loggingIn : copy.loginButton}
              </button>
              <a href="/signup" className='login-small' rel="noopener noreferrer">
                {copy.contactLink}
              </a>
              {successMessage && <p className="login-success">{successMessage}</p>}
              {error && <p className="login-error">{error}</p>}
            </form>
          </div>

          <div className="login-footer" />
        </div>

        {/* Terms of Use Popup */}
        {showTermsPopup && (
          <div className="popup-overlay" style={{ zIndex: 1000 }}>
            <div className="popup-content large-popup">
              <div className="terms-section">
                {isArabic ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <h4>Terms of Use</h4>
                    <p>
                      <strong>Purpose of the Site:</strong><br />
                      All questions and related materials available on this website were compiled through personal efforts of university students and are <strong>not affiliated with, endorsed by, or recognized by any official academic institution, governing body, or medical authority</strong>. They are intended solely for educational and review purposes.
                    </p>
                    <p>
                      <strong>Accuracy Disclaimer:</strong><br />
                      We make every effort to ensure the accuracy and relevance of the materials provided. However, the content on this website may contain errors, inaccuracies, or omissions. The site does <strong>not guarantee the correctness, completeness, or reliability</strong> of any content. Users should always consult official resources and professional guidance when preparing for exams or making decisions based on the material presented.
                    </p>
                    <p>
                      <strong>User Account Policies:</strong><br />
                      You are responsible for maintaining the confidentiality of your account login information. Sharing your account credentials with unauthorized individuals or non-participants is strictly prohibited. The site owner and administrators reserve the <strong>full right to suspend, delete, or block access</strong> to any account found to be in violation of this policy.
                    </p>
                    <div>
                      <strong>Prohibited Conduct:</strong><br />
                      You agree not to:
                      <ul>
                        <li>Attempt to download, copy, or otherwise extract the question bank without prior written permission from the site owner.</li>
                        <li>Use automated tools or scripts to scrape or collect content from the website.</li>
                        <li>Misrepresent your identity or affiliation when using the service.</li>
                      </ul>
                      The site owner and administrators reserve the <strong>full right to suspend or terminate accounts</strong> involved in such activities without prior notice.
                    </div>
                    <p>
                      <strong>Intellectual Property:</strong><br />
                      All content on this website, including text, images, questions, and databases, is the property of this service or its contributors and is protected by copyright laws. Unauthorized use, reproduction, or distribution is strictly prohibited.
                    </p>
                    <p>
                      <strong>Limitation of Liability:</strong><br />
                      In no event shall this service, its owners, staff, or contributors be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the website or reliance on any content.
                    </p>
                    <p>
                      By using this service, you acknowledge that you have read, understood, and agreed to all terms outlined above.
                    </p>
                  </>
                )}
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