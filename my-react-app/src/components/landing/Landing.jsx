import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);
  


  const handleFreeTrial = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${Globals.URL}/free-trial/start`);
      const { trialId, user } = response.data;
      navigate('/quizs', { 
        state: { 
          id: trialId, 
          user: user,
          isTrial: true 
        } 
      });
    } catch (error) {
      // Error handling - could add user notification here if needed
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

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);


  

  


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
          <div className="landing-header fade-in-section">
            <div className="landing-logo-container">
              <img src="/tab_logo.png" alt="SQB Logo" className="landing-logo" />
            </div>
            <h1 className="landing-main-title">
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
            <div className="landing-cta-section">
              <div className="landing-cta-primary">
                <button className="landing-btn primary cta-main" onClick={() => navigate('/contact')}>
                  <img src="https://img.icons8.com/?size=100&id=45870&format=png&color=FFFFFF" alt="Rocket" className="cta-icon" />
                  <span>{isArabic ? "تواصل للاشتراك" : "Contact to Subscribe"}</span>
                </button>
                <p className="cta-subtext">
                  {isArabic ? "ابدأ رحلتك نحو النجاح في اختبار البرومترك" : "Start your journey to SMLE success"}
                </p>
              </div>
              <div className="landing-cta-secondary">
                <button className="landing-btn secondary" onClick={handleFreeTrial} disabled={loading}>
                  {loading ? (isArabic ? '...يتم البدء' : 'Starting...') : (isArabic ? "ابدأ التجربة المجانية" : "Start Free Trial")}
                </button>
                <button className="landing-btn secondary" onClick={handleLogin}>
                  {isArabic ? "تسجيل الدخول" : "Login"}
                </button>
              </div>
            </div>
          </div>
          <hr className="section-divider thick" />
          {/* Pricing Section */}
          <div className="landing-pricing fade-in-section">
            <div className="pricing-badge">
              <span className="pricing-label">
                <img src="https://img.icons8.com/?size=100&id=45870&format=png&color=000000" alt="Offer" className="pricing-badge-icon" />
                {isArabic ? "عرض تمهيدي محدود" : "Limited-Time Intro Rate"}
                <img src="https://img.icons8.com/?size=100&id=45870&format=png&color=000000" alt="Offer" className="pricing-badge-icon" />
              </span>
            </div>
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>
                  <img src="https://img.icons8.com/?size=100&id=45870&format=png&color=000000" alt="Offer" className="pricing-header-icon" />
                  {isArabic ? "اشتراك سنوي - سعر تمهيدي ٧٥ ريال" : "Annual Subscription – Introductory 75 SAR"}
                </h3>
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
              <button className="landing-btn primary pricing-cta" onClick={() => navigate('/contact')}>
                <span>{isArabic ? "تواصل للاشتراك" : "Contact Us"}</span>
                <span className="cta-arrow">{isArabic ? "←" : "→"}</span>
              </button>
            </div>
          </div>

          {/* Section Divider */}
          <hr className="section-divider" />

          {/* About Us Section */}
          <div className="landing-about fade-in-section">
            <h2>{isArabic ? "من نحن" : "About Us"}</h2>
            <div className="about-content">
              <div className="about-text">
                <p>
                  {isArabic 
                    ? "نحن فريق من المتخصصين في المجال الطبي والتقني، ملتزمون بتقديم منصة تعليمية حديثة للتحضير لاختبار البرومترك السعودي (SMLE). هدفنا هو مساعدة الطلاب والأطباء على النجاح في اختباراتهم من خلال محتوى تعليمي شامل وتحليلات مفصلة."
                    : "We are a team of medical and technical specialists, committed to providing the leading educational platform for the Saudi Prometric (SMLE) exam. Our goal is to help students and doctors succeed through immersive learning content and detailed analytics."
                  }
                </p>
              </div>
            </div>
          </div>



          {/* Features Section */}
          <div className="landing-features fade-in-section">
            <div className="feature-card">
              <div className="feature-icon">
                <img src="https://img.icons8.com/?size=100&id=18693&format=png&color=000000" alt="Questions" />
              </div>
              <h3>{isArabic ? "منصة تضم أكثر من 8000 سؤال" : "Learning Platform with 8,000+ Questions"}</h3>
              <p>{isArabic ? "منصة تعليمية شاملة تغطي جميع مواضيع البرومترك (SMLE) مع شروحات مفصلة" : "Comprehensive learning experience covering every SMLE topic with deep explanations"}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="https://img.icons8.com/?size=100&id=rqxQtUue6iQU&format=png&color=000000" alt="Analytics" />
              </div>
              <h3>{isArabic ? "تحليلات مفصلة" : "Detailed Analytics"}</h3>
              <p>{isArabic ? "تابع تقدمك مع تحليلات شاملة وتقسيم حسب الموضوع" : "Track your progress with comprehensive performance analysis and topic-wise breakdown"}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src="https://img.icons8.com/?size=100&id=rFihLhz2eItx&format=png&color=000000" alt="Training" />
              </div>
              <h3>{isArabic ? "تدريب موجه" : "Targeted Practice"}</h3>
              <p>{isArabic ? "ركز على مواضيع محددة أو اختبر معلوماتك بشكل عام" : "Focus on specific topics or take mixed quizzes to test your overall knowledge"}</p>
            </div>

          </div>

          {/* Section Divider */}
          

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

        </div>
        {/* Stats + Footer Section */}
        <div className="landing-stats fade-in-section">
            <div className="stats-section">
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
            <div className="footer-section">
              <div className="footer-content">
                <p className="footer-text">
                  {isArabic 
                    ? <>© {new Date().getFullYear()} <strong>SQB</strong>. جميع الحقوق محفوظة.</>
                    : <>© {new Date().getFullYear()} <strong>SQB</strong>. All rights reserved.</>}
                </p>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default Landing; 