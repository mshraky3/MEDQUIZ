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
  const [lang, setLang] = useLang();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [showAddToHome, setShowAddToHome] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);
  


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
    // Only set document direction when on landing page
    // Store original direction to restore later
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    
    // Cleanup function to restore original direction when component unmounts
    return () => {
      document.documentElement.dir = originalDir || 'ltr';
    };
  }, [lang, isArabic]);


  

  

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <>
      <SEO 
        title={isArabic ? "منصة برومترك (SMLE) الشاملة" : "Ultimate SMLE (Prometric) Prep Platform"}
        description={isArabic
          ? "استعد لاختبار البرومترك السعودي (SMLE) مع مجموعتنا الشاملة التي تضم أكثر من 8000 سؤال دقيق وتحليلات مفصلة وتجربة مجانية."
          : "Master the Saudi Medical Licensing Examination (SMLE) and Prometric with SQB. Access over 8,000 carefully curated questions with detailed analytics, targeted practice, and comprehensive performance tracking. Start your free trial today!"}
        keywords="SMLE, Prometric, Saudi Medical Licensing Examination, medical questions, medical quiz, medical exam preparation, Saudi medical license, medical board exam, medical practice test, medical study guide, Saudi medical students, free trial, Prometric questions, Prometric Saudi, برومترك, اسئلة برومترك, اسئلة اختبار البرومترك, اسئلة الهيئة السعودية للتخصصات الصحية, بنك اسئلة برومترك, بنك اسئلة SMLE, تجميعات برومترك, تجميعات SMLE, اختبار البرومترك, اختبار الهيئة السعودية, اسئلة طبية, بنك اسئلة طبية, تدريب برومترك, تدريب SMLE, اسئلة امتحان برومترك, اسئلة امتحان SMLE, اسئلة طبية سعودية, اسئلة طبية برومترك, Saudi Prometric, Prometric exam, Prometric practice, Prometric medicine, Prometric Saudi Arabia, Saudi Prometric questions, Saudi Prometric bank, Saudi Prometric practice, Saudi Prometric free, Saudi Prometric trial, Saudi Prometric preparation, Saudi Prometric online, Saudi Prometric MCQ, Saudi Prometric test, Saudi Prometric review, Saudi Prometric study, Saudi Prometric guide, Saudi Prometric analytics, Saudi Prometric performance, Saudi Prometric topics, Saudi Prometric mobile, Saudi Prometric affordable, Saudi Prometric subscription, Saudi Prometric unlimited, Saudi Prometric 2024, Saudi Prometric 2025"
        url="https://www.smle-question-bank.com"
        lang={lang}
      />
      <div className="landing-body" dir={isArabic ? "rtl" : "ltr"}>
        <div className="landing-lang-toggle">
          <button 
            type="button" 
            className="lang-toggle-btn" 
            onClick={toggleLanguage}
            aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
          >
            <span className="lang-toggle-icon" role="img" aria-hidden="true">🌐</span>
            <span className="lang-toggle-text">{isArabic ? 'EN' : 'ع'}</span>
          </button>
        </div>
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
              SQB{isArabic && <><br/><span style={{fontWeight:'normal',fontSize:'22px'}}>منصة SQB التعليمية المتخصصة</span></>}
            </h1>
            <h2 className="landing-subtitle">
              {isArabic ? "منصتك التعليمية الشاملة لاختبار البرومترك (SMLE)" : "Your Ultimate SMLE (Prometric) Learning Platform"}
            </h2>
            <p className="landing-description">
              {isArabic
                ? "استعد لاختبار البرومترك السعودي (SMLE) مع منصتنا التعليمية الشاملة التي تضم أكثر من 8000 سؤال دقيق"
                : "Master the Saudi Medical Licensing Examination (SMLE) with our comprehensive educational platform featuring over 8,000 carefully curated questions"}
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
              <span className="pricing-label">{isArabic ? "💡 عرض تمهيدي محدود 💡" : "💡 Limited-Time Intro Rate 💡"}</span>
            </div>
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>{isArabic ? "🔥 اشتراك سنوي - سعر تمهيدي ٧٥ ريال" : "🔥 Annual Subscription – Introductory 75 SAR"}</h3>
                <div className="price">
                  <span className="currency">SAR</span>
                  <span className="amount">75</span>
                  <span className="period">{isArabic ? "لمدة سنة كاملة" : "FOR 1 FULL YEAR"}</span>
                </div>
                <p className="pricing-subtitle">
                  {isArabic 
                    ? "سعر تمهيدي متاح حتى ننهي التجربة بالكامل. سيصبح السعر ١٢٥ ريال بعد الإطلاق الرسمي."
                    : "Introductory pricing while we finalize the app. Price increases to 125 SAR once the full launch goes live."}
                </p>
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
                <p>
                  {isArabic 
                    ? "استفد من السعر الحالي ٧٥ ريال قبل أن يرتفع إلى ١٢٥ ريال عند الإطلاق الكامل."
                    : "Lock in 75 SAR now before the full launch price moves to 125 SAR."}
                </p>
              </div>
              <button className="landing-btn primary" style={{marginTop: 24, width: '100%'}} onClick={() => navigate('/contact')}  >
                {isArabic ? "تواصل للاشتراك" : "Contact Us "}
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
                    ? "نحن فريق من المتخصصين في المجال الطبي والتقني، ملتزمون بتقديم منصة تعليمية حديثة للتحضير لاختبار البرومترك السعودي (SMLE). هدفنا هو مساعدة الطلاب والأطباء على النجاح في اختباراتهم من خلال محتوى تعليمي شامل وتحليلات مفصلة."
                    : "We are a team of medical and technical specialists, committed to providing the leading educational platform for the Saudi Prometric (SMLE) exam. Our goal is to help students and doctors succeed through immersive learning content and detailed analytics."
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
              <h3>{isArabic ? "منصة تضم أكثر من 8000 سؤال" : "Learning Platform with 8,000+ Questions"}</h3>
              <p>{isArabic ? "منصة تعليمية شاملة تغطي جميع مواضيع البرومترك (SMLE) مع شروحات مفصلة" : "Comprehensive learning experience covering every SMLE topic with deep explanations"}</p>
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
          

          {/* Add to Home Screen Buttons */}
          <div className="add-to-home-trigger">
            <div className="add-to-home-buttons">
              <button 
                className="landing-btn ios-btn" 
                onClick={() => {
                  setShowIOSInstructions(!showIOSInstructions);
                  setShowAndroidInstructions(false);
                }}
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=30659&format=png&color=000000" 
                  alt="iOS" 
                  className="btn-icon"
                />
                {isArabic ? "تعليمات iOS" : "add to home screen - iOS"}
              </button>
              <button 
                className="landing-btn android-btn" 
                onClick={() => {
                  setShowAndroidInstructions(!showAndroidInstructions);
                  setShowIOSInstructions(false);
                }}
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=2586&format=png&color=000000" 
                  alt="Android" 
                  className="btn-icon"
                />
                {isArabic ? "تعليمات Android" : "add to home screen - Android"}
              </button>
            </div>
          </div>

          {/* iOS Instructions Section */}
          {showIOSInstructions && (
            <div className="add-to-home-section important-section">
              <h2>
                <img 
                  src="https://img.icons8.com/?size=100&id=30659&format=png&color=000000" 
                  alt="iOS" 
                  className="platform-icon"
                />
                {isArabic ? "كيفية إضافة الموقع إلى الشاشة الرئيسية - iOS" : "How to Add to Home Screen - iOS"}
              </h2>
              <div className="add-to-home-content">
                <div className="add-to-home-instructions">
                  <div className="add-to-home-platform ios-platform">
                    <h3>
                      <img 
                        src="https://img.icons8.com/?size=100&id=30659&format=png&color=000000" 
                        alt="iOS" 
                        className="step-icon"
                        style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
                      />
                      {isArabic ? "على أجهزة iPhone/iOS:" : "On iPhone/iOS:"}
                    </h3>
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

          {/* Android Instructions Section */}
          {showAndroidInstructions && (
            <div className="add-to-home-section important-section">
              <h2>
                <img 
                  src="https://img.icons8.com/?size=100&id=2586&format=png&color=000000" 
                  alt="Android" 
                  className="platform-icon"
                />
                {isArabic ? "كيفية إضافة الموقع إلى الشاشة الرئيسية - Android" : "How to Add to Home Screen - Android"}
              </h2>
              <div className="add-to-home-content">
                <div className="add-to-home-instructions">
                  <div className="add-to-home-platform android-platform">
                    <h3>
                      <img 
                        src="https://img.icons8.com/?size=100&id=2586&format=png&color=000000" 
                        alt="Android" 
                        className="step-icon"
                        style={{width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle'}}
                      />
                      {isArabic ? "على أجهزة Android:" : "On Android:"}
                    </h3>
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
              <div className="stat-number">SAR 75</div>
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
                      <h4 >{isArabic ? "اشتراك كامل" : "Full Subscription"} </h4>
                      <p>{isArabic ? "احصل على الوصول الكامل إلى جميع الأسئلة والتحليلات." : "Get full access to all questions and analytics."}</p>
                      <ul>
                        <li>{isArabic ? "وصول كامل" : "Full access"}</li>
                        <li>{isArabic ? "حفظ التقدم" : "Progress saving"}</li>
                        <li>{isArabic ? "تحليلات مخصصة" : "Personalized analytics"}</li>
                      </ul>
                      <button className="landing-btn primary" onClick={() => { setShowModal(false); navigate('/contact'); }} style={{ marginTop: 12 }}>
                        {isArabic ? "تواصل للاشتراك" : "Contact us"}
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