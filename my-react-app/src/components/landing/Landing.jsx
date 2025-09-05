import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import SEO from '../common/SEO';
import axios from 'axios';
import Globals from '../../global.js';
import useLang from '../../hooks/useLang';
import andriodVideo from './videos/andriod.mp4';
import iosVideo from './videos/ios.mp4';




const Landing = () => {
  const lang = useLang();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [successMsg, setSuccessMsg] = useState('');
  const [showAddToHome, setShowAddToHome] = useState(false);
  


  const handleFreeTrial = async () => {
    setLoading(true);
    setFormError('');
    try {
      const response = await axios.post(`${Globals.URL}/free-trial/start`);
      const { trialId, user } = response.data;
      setShowModal(false);
      navigate('/quizs', { 
        state: { 
          id: trialId, 
          user: user,
          isTrial: true 
        } 
      });
    } catch (error) {
      setFormError('Failed to start free trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [lang, isArabic]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      return 'All fields are required.';
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      return 'Invalid email address.';
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  

  

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <SEO 
        title={isArabic ? "منصة برومترك (SMLE) الشاملة" : "Ultimate SMLE (Prometric) Prep Platform"}
        description={isArabic
          ? "استعد لاختبار البرومترك السعودي (SMLE) مع مجموعتنا الشاملة التي تضم أكثر من 8000 سؤال دقيق وتحليلات مفصلة وتجربة مجانية."
          : "Master the Saudi Medical Licensing Examination (SMLE) and Prometric with MEDQIZE. Access over 8,000 carefully curated questions with detailed analytics, targeted practice, and comprehensive performance tracking. Start your free trial today!"}
        keywords="SMLE, Prometric, Saudi Medical Licensing Examination, medical questions, medical quiz, medical exam preparation, Saudi medical license, medical board exam, medical practice test, medical study guide, Saudi medical students, free trial, Prometric questions, Prometric Saudi, برومترك, اسئلة برومترك, اسئلة اختبار البرومترك, اسئلة الهيئة السعودية للتخصصات الصحية, بنك اسئلة برومترك, بنك اسئلة SMLE, تجميعات برومترك, تجميعات SMLE, اختبار البرومترك, اختبار الهيئة السعودية, اسئلة طبية, بنك اسئلة طبية, تدريب برومترك, تدريب SMLE, اسئلة امتحان برومترك, اسئلة امتحان SMLE, اسئلة طبية سعودية, اسئلة طبية برومترك, Saudi Prometric, Prometric exam, Prometric practice, Prometric medicine, Prometric Saudi Arabia, Saudi Prometric questions, Saudi Prometric bank, Saudi Prometric practice, Saudi Prometric free, Saudi Prometric trial, Saudi Prometric preparation, Saudi Prometric online, Saudi Prometric MCQ, Saudi Prometric test, Saudi Prometric review, Saudi Prometric study, Saudi Prometric guide, Saudi Prometric analytics, Saudi Prometric performance, Saudi Prometric topics, Saudi Prometric mobile, Saudi Prometric affordable, Saudi Prometric subscription, Saudi Prometric unlimited, Saudi Prometric 2024, Saudi Prometric 2025"
        url="https://www.smle-question-bank.com"
        lang={lang}
      />
      <div className="landing-body" dir={isArabic ? "rtl" : "ltr"}>
        {/* Decorative SVG Wave at the Top */}
        <div className="landing-top-wave" dir="ltr">
          <svg viewBox="0 0 2880 180" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <g className="wave-anim-group">
              <path d="M0,80 C360,180 1080,0 1440,100 L1440,0 L0,0 Z" fill="#00b6e0" fillOpacity="0.10" />
              <path d="M0,80 C360,180 1080,0 1440,100 L1440,0 L0,0 Z" fill="#00b6e0" fillOpacity="0.10" transform="scale(-1,1) translate(-2880,0)" />
            </g>
          </svg>
        </div>
        {/* Faint Background Icon */}
        <div className="landing-bg-icon">?</div>
        <div className="landing-wrapper landing-main-container">
          {/* Badge Above Main Title */}
          <div className="landing-badge">
            {isArabic ? "الأفضل سعراً لاختبار البرومترك (SMLE)" : "#1 Affordable SMLE (Prometric) Prep"}
          </div>
          {/* Header Section */}
          <div className="landing-header">
            <h1 className="landing-main-title landing-title-shadow">
              SQB{isArabic && <><br/><span style={{fontWeight:'normal',fontSize:'22px'}}>بنك الأسئلة السعودي</span></>}
            </h1>
            <h2 className="landing-subtitle">
              {isArabic ? "بنك أسئلة برومترك (SMLE) الشامل الخاص بك" : "Your Ultimate SMLE (Prometric) Question Bank"}
            </h2>
            <p className="landing-description">
              {isArabic
                ? "استعد لاختبار البرومترك السعودي (SMLE) مع مجموعتنا الشاملة التي تضم أكثر من 8000 سؤال دقيق"
                : "Master the Saudi Medical Licensing Examination (SMLE) and Prometric with our comprehensive collection of over 8,000 carefully curated questions"}
            </p>
          </div>
          
          <div className="landing-cta">
            <div className="landing-buttons">
              <button className="landing-btn primary" onClick={handleGetStarted}>
                {isArabic ? "ابدأ الآن" : "Get Started Now"}
              </button>
              <button className="landing-btn secondary" onClick={handleLogin}>
                {isArabic ? "تسجيل الدخول" : "Login"}
              </button>
            </div>
          </div>
          <hr className="section-divider thick" />
          {/* Pricing Section */}
          <div className="landing-pricing">
            <div className="pricing-badge">
              <span className="pricing-label">{isArabic ? "أفضل قيمة" : "Best Value"}</span>
            </div>
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>{isArabic ? "🔥 اشتراك سنوي - سنة كاملة " : " ANNUAL SUBSCRIPTION - FULL YEAR "}</h3>
                <div className="price">
                  <span className="currency">SAR</span>
                  <span className="amount">50</span>
                  <span className="period">{isArabic ? "لمدة سنة كاملة" : "FOR 1 FULL YEAR"}</span>
                </div>
                <p className="pricing-subtitle">{isArabic ? "ليس شهرياً - اشتراك لمدة سنة كاملة" : "NOT MONTHLY - SUBSCRIPTION FOR 1 FULL YEAR"}</p>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>{isArabic ? "الوصول إلى جميع الأسئلة (8000+)" : "Access to all 8,000+ questions"}</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>{isArabic ? "تحليلات أداء مفصلة" : "Detailed performance analytics"}</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>{isArabic ? "تدريب حسب الموضوع" : "Topic-wise practice sessions"}</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>{isArabic ? "دخول غير محدود 24/7" : "24/7 unlimited access"}</span>
                </div>
                <div className="pricing-feature">
                  <span className="feature-check">✓</span>
                  <span>{isArabic ? "منصة متوافقة مع الجوال" : "Mobile-friendly platform"}</span>
                </div>
              </div>
              <div className="pricing-comparison">
                <p>{isArabic ? "وفر حتى ٨٠٪ مقارنة بالخدمات الأخرى" : "Save up to 80% compared to other SMLE (Prometric) services"}</p>
              </div>
              <button className="landing-btn primary" style={{marginTop: 24, width: '100%'}} onClick={() => navigate('/payment')}  >
                {isArabic ? "اشترك الآن" : "Subscribe / Buy Now"}
              </button>
            </div>
          </div>

          {/* Section Divider */}
          <hr className="section-divider" />

          {/* About Us Section */}
          <div className="landing-about">
            <h2>{isArabic ? "من نحن" : "About Us"}</h2>
            <div className="about-content">
              <div className="about-text">
                <p>
                  {isArabic 
                    ? "نحن فريق من المتخصصين في المجال الطبي والتقني، ملتزمون بتقديم أفضل منصة تحضير لاختبار البرومترك السعودي (SMLE). هدفنا هو مساعدة الطلاب والأطباء على النجاح في اختباراتهم من خلال بنك أسئلة شامل وتحليلات مفصلة."
                    : "We are a team of medical and technical specialists, committed to providing the best preparation platform for the Saudi Prometric (SMLE) exam. Our goal is to help students and doctors succeed in their exams through a comprehensive question bank and detailed analytics."
                  }
                </p>
                <div className="about-features">
                  <div className="about-feature">
                    <span className="feature-icon">🎯</span>
                    <span>{isArabic ? "دقة عالية في الأسئلة" : "High Accuracy Questions"}</span>
                  </div>
                  <div className="about-feature">
                    <span className="feature-icon">📊</span>
                    <span>{isArabic ? "تحليلات متقدمة" : "Advanced Analytics"}</span>
                  </div>
                  <div className="about-feature">
                    <span className="feature-icon">💡</span>
                    <span>{isArabic ? "شروحات مفصلة" : "Detailed Explanations"}</span>
                  </div>
                  <div className="about-feature">
                    <span className="feature-icon">🚀</span>
                    <span>{isArabic ? "تحديثات مستمرة" : "Continuous Updates"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <hr className="section-divider" />

          {/* Features Section */}
          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>{isArabic ? "أكثر من 8000 سؤال" : "8,000+ Questions"}</h3>
              <p>{isArabic ? "بنك أسئلة شامل يغطي جميع مواضيع البرومترك (SMLE) مع شروحات مفصلة" : "Extensive question bank covering all SMLE (Prometric) topics with detailed explanations"}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>{isArabic ? "تحليلات مفصلة" : "Detailed Analytics"}</h3>
              <p>{isArabic ? "تابع تقدمك مع تحليلات شاملة وتقسيم حسب الموضوع" : "Track your progress with comprehensive performance analysis and topic-wise breakdown"}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{isArabic ? "تدريب موجه" : "Targeted Practice"}</h3>
              <p>{isArabic ? "ركز على مواضيع محددة أو اختبر معلوماتك بشكل عام" : "Focus on specific topics or take mixed quizzes to test your overall knowledge"}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>{isArabic ? "متوافق مع الجوال" : "Mobile Friendly"}</h3>
              <p>{isArabic ? "ادرس في أي مكان وزمان مع تصميم متجاوب لجميع الأجهزة" : "Study anywhere, anytime with our responsive design that works on all devices"}</p>
            </div>
          </div>

          {/* Section Divider */}
          

          {/* Add to Home Screen Button */}
          <div className="add-to-home-trigger">
            <button 
              className="landing-btn secondary" 
              onClick={() => setShowAddToHome(!showAddToHome)}
            >
              {isArabic ? "📱 كيفية إضافة الموقع للشاشة الرئيسية" : "📱 How to Add to Home Screen"}
            </button>
          </div>

          {/* How to Add to Home Screen Section (hidden by default) */}
          {showAddToHome && (
            <div className="add-to-home-section important-section">
              <h2>{isArabic ? "كيفية إضافة الموقع إلى الشاشة الرئيسية" : "How to Add This Website to Your Home Screen"}</h2>
              <div className="add-to-home-content">
                <div className="add-to-home-instructions">
                  <div className="add-to-home-platform">
                    <h3><span role="img" aria-label="Android">🤖</span> {isArabic ? "على أجهزة Android:" : "On Android:"}</h3>
                    <ol>
                      {isArabic ? (
                        <>
                          <li><span className="step-icon" role="img" aria-label="browser">🌐</span> افتح الموقع في متصفح <b>Chrome</b>.</li>
                          <li><span className="step-icon" role="img" aria-label="menu">⋮</span> اضغط على النقاط الثلاث في أعلى يمين الشاشة.</li>
                          <li><span className="step-icon" role="img" aria-label="add">➕</span> اختر "إضافة إلى الشاشة الرئيسية".</li>
                          <li><span className="step-icon" role="img" aria-label="home">🏠</span> اضغط "إضافة" وسيظهر الموقع على شاشتك الرئيسية.</li>
                        </>
                      ) : (
                        <>
                          <li><span className="step-icon" role="img" aria-label="browser">🌐</span> Open the website in <b>Chrome</b> browser.</li>
                          <li><span className="step-icon" role="img" aria-label="menu">⋮</span> Tap the three dots menu at the top right.</li>
                          <li><span className="step-icon" role="img" aria-label="add">➕</span> Select "Add to Home screen".</li>
                          <li><span className="step-icon" role="img" aria-label="home">🏠</span> Tap "Add" and the site will appear on your home screen.</li>
                        </>
                      )}
                    </ol>
                    <div className="add-to-home-video">
                      {/* Android video tutorial */}
                      <div className="responsive-video-wrapper">
                        <video
                          src={andriodVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls={false}
                          className="responsive-video"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="add-to-home-platform">
                    <h3 style={{marginTop: 32}}><span role="img" aria-label="iOS">🍏</span> {isArabic ? "على أجهزة iPhone/iOS:" : "On iPhone/iOS:"}</h3>
                    <ol>
                      {isArabic ? (
                        <>
                          <li><span className="step-icon" role="img" aria-label="browser">🌐</span> افتح الموقع في متصفح <b>Safari</b>.</li>
                          <li><span className="step-icon" role="img" aria-label="share">🔗</span> اضغط على زر المشاركة (المربع والسهم في الأسفل).</li>
                          <li><span className="step-icon" role="img" aria-label="add">➕</span> اختر "إضافة إلى الشاشة الرئيسية".</li>
                          <li><span className="step-icon" role="img" aria-label="home">🏠</span> اضغط "إضافة" وسيظهر الموقع على شاشتك الرئيسية.</li>
                        </>
                      ) : (
                        <>
                          <li><span className="step-icon" role="img" aria-label="browser">🌐</span> Open the website in <b>Safari</b> browser.</li>
                          <li><span className="step-icon" role="img" aria-label="share">🔗</span> Tap the Share button (the square with an arrow at the bottom).</li>
                          <li><span className="step-icon" role="img" aria-label="add">➕</span> Select "Add to Home Screen".</li>
                          <li><span className="step-icon" role="img" aria-label="home">🏠</span> Tap "Add" and the site will appear on your home screen.</li>
                        </>
                      )}
                    </ol>
                    <div className="add-to-home-video">
                      {/* iOS video tutorial */}
                      <div className="responsive-video-wrapper">
                        <video
                          src={iosVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls={false}
                          className="responsive-video"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Divider */}
          <hr className="section-divider" />

          {/* Stats Section - Last Section */}
          <div className="landing-stats">
            <div className="stat-item">
              <div className="stat-number">8,000+</div>
              <div className="stat-label">{isArabic ? "سؤال" : "Questions"}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">SAR 50</div>
              <div className="stat-label">{isArabic ? "سنة كاملة" : "Full Year"}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">{isArabic ? "متاح دائماً" : "Available"}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="landing-footer" />
        </div>
        {/* Modal for registration and WhatsApp */}
        {showModal && (
          <div className="landing-modal-overlay" style={{ zIndex: 1000 }}>
            <div className="landing-modal-content">
                  <h3>{isArabic ? "اختر طريقة البدء" : "Choose how to get started:"}</h3>
                  <div className="trial-options">
                    <div className="trial-option">
                      <h4 >{isArabic ? "إنشاء حساب" : "Create Account"} </h4>
                      <p>{isArabic ? "قم بإنشاء حساب للوصول الكامل إلى جميع ميزاتنا." : "Create an account for full access to all our features."}</p>
                      <ul>
                        <li>{isArabic ? "وصول كامل" : "Full access"}</li>
                        <li>{isArabic ? "حفظ التقدم" : "Progress saving"}</li>
                        <li>{isArabic ? "تحليلات مخصصة" : "Personalized analytics"}</li>
                      </ul>
                      <button className="landing-btn primary" onClick={handleGetStarted} style={{ marginTop: 12 }}>
                        {isArabic ? "إنشاء حساب" : "Create Account"}
                      </button>
                    </div>
                    <div className="trial-option">
                      <h4>{isArabic ? "تجربة مجانية" : "Free Trial"}</h4>
                      <p>{isArabic ? "جرب منصتنا مع 40 سؤالاً مختاراً من جميع المواضيع. لا حاجة للتسجيل!" : "Try our platform with 40 carefully selected questions from all 4 topics. No registration required!"}</p>
                      <ul>
                        <li>{isArabic ? "٤٠ سؤال تجريبي" : "40 sample questions"}</li>
                        <li>{isArabic ? "جميع أنواع الأسئلة الأربعة" : "All 4 question types"}</li>
                        <li>{isArabic ? "دخول فوري" : "Instant access"}</li>
                        <li>{isArabic ? "بدون تسجيل دخول" : "No login needed"}</li>
                      </ul>
                      <button  onClick={handleFreeTrial} className="popup-btn" disabled={loading} style={{ marginTop: 12 }}>
                        {loading ? (isArabic ? '...يتم البدء' : 'Starting...') : (isArabic ? 'ابدأ التجربة المجانية' : 'Start Free Trial')}
                      </button>
                    </div>
                  </div>
                  <button className="popup-btn no-thanks" onClick={() => setShowModal(false)} style={{ marginTop: 20 }}>{isArabic ? "إلغاء" : "Cancel"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Landing; 