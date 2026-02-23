import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';
import SEO from '../common/SEO';
import useLang from '../../hooks/useLang';

const stats = [
  { labelEn: 'Questions', labelAr: 'سؤال', value: '8,000+' },
  { labelEn: 'Always Free', labelAr: 'مجاني للأبد', value: 'FREE' },
  { labelEn: 'Daily Practice', labelAr: 'تدريب يومي', value: '24/7' },
  { labelEn: 'Topics Covered', labelAr: 'مواضيع مغطاة', value: '40+' }
];

const features = [
  {
    icon: '📚',
    titleEn: 'Full SMLE coverage',
    titleAr: 'تغطية كاملة لاختبار SMLE',
    descEn: 'Curated bank mapped to the latest Prometric blueprint with clinical context.',
    descAr: 'بنك أسئلة منسق وفق أحدث مخطط برومترك مع سياق سريري واضح.'
  },
  {
    icon: '📈',
    titleEn: 'Analytics that guide',
    titleAr: 'تحليلات موجهة',
    descEn: 'Track weak topics, pace, and accuracy with clean dashboards.',
    descAr: 'تتبع نقاط الضعف والسرعة والدقة عبر لوحات واضحة.'
  },
  {
    icon: '🎯',
    titleEn: 'Adaptive practice',
    titleAr: 'تدريب متكيف',
    descEn: 'Targeted drills, timed mocks, and smart review sessions.',
    descAr: 'تمارين موجهة، محاكاة زمنية، ومراجعة ذكية.'
  },
  {
    icon: '🧠',
    titleEn: 'Clinical reasoning',
    titleAr: 'تفكير سريري',
    descEn: 'Case-based stems that teach decision making, not memorization.',
    descAr: 'سيناريوهات سريرية تركز على اتخاذ القرار لا الحفظ.'
  }
];

const steps = [
  {
    labelEn: 'Create your free workspace',
    labelAr: 'أنشئ حسابك المجاني',
    hintEn: 'Sign up in seconds and keep everything synced.',
    hintAr: 'سجّل خلال ثوانٍ وكل شيء يبقى متزامناً.'
  },
  {
    labelEn: 'Practice with precision',
    labelAr: 'تمرن بدقة',
    hintEn: 'Pick topics, set timers, and focus on the exact competencies you need.',
    hintAr: 'اختر المواضيع، اضبط الوقت، وركّز على المهارات المطلوبة.'
  },
  {
    labelEn: 'Review and improve',
    labelAr: 'راجع وتحسّن',
    hintEn: 'Instant analytics, streaks, and personalized recommendations.',
    hintAr: 'تحليلات فورية، سلاسل إنجاز، وتوصيات مخصصة.'
  }
];

const Landing = () => {
  const [lang, setLang] = useLang();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();

  const handleSignup = () => navigate('/signup');
  const handleLogin = () => navigate('/login');
  const toggleLanguage = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));

  useEffect(() => {
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    return () => {
      document.documentElement.dir = originalDir || 'ltr';
    };
  }, [isArabic]);

  return (
    <>
      <SEO
        title={isArabic ? 'منصة برومترك (SMLE) الشاملة' : 'Ultimate SMLE (Prometric) Prep Platform'}
        description={
          isArabic
            ? 'استعد لاختبار البرومترك السعودي (SMLE) مع مجموعتنا الشاملة التي تضم أكثر من 8000 سؤال دقيق وتحليلات مفصلة. حساب مجاني بالكامل.'
            : 'Master the Saudi Medical Licensing Examination (SMLE) with SQB. Access over 8,000 questions and modern analytics for free.'
        }
        keywords="SMLE, Prometric, Saudi Medical Licensing Examination, medical questions, medical quiz, medical exam preparation, Saudi medical license, medical board exam, medical practice test, medical study guide, Saudi medical students, free"
        url="https://www.smle-question-bank.com"
        lang={lang}
      />
      <div className="landing-body" dir={isArabic ? 'rtl' : 'ltr'}>
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

        <div className="landing-shell">
          <header className="landing-topbar" aria-label={isArabic ? 'التنقل الرئيسي' : 'Primary navigation'}>
            <div className="topbar-brand-wrap">
              <Link to="/" className="topbar-brand">SQB</Link>
              <span className="topbar-tag">{isArabic ? 'بنك أسئلة SMLE' : 'SMLE Question Bank'}</span>
            </div>
            <nav className="topbar-links" aria-label={isArabic ? 'روابط سريعة' : 'Quick links'}>
              <Link to="/about">{isArabic ? 'من نحن' : 'About'}</Link>
              <Link to="/faq">{isArabic ? 'الأسئلة الشائعة' : 'FAQ'}</Link>
              <Link to="/contact">{isArabic ? 'اتصل بنا' : 'Contact'}</Link>
            </nav>
            <div className="topbar-actions">
              <button className="btn ghost" onClick={handleLogin}>
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </button>
              <button className="btn primary" onClick={handleSignup}>
                {isArabic ? 'ابدأ مجاناً' : 'Start free'}
              </button>
            </div>
          </header>

          <section className="hero">
            <div className="hero-copy">
              <span className="pill">
                {isArabic ? 'منصة SMLE' : 'SMLE platform'}
              </span>
              <h1>
                {isArabic
                  ? 'تجربة تدريب على برومترك حديثة، منظمة، ومجانية'
                  : 'A modern, organized, and free Prometric prep experience'}
              </h1>
              <p>
                {isArabic
                  ? 'تعلم بوضوح: أسئلة دقيقة، تحليلات فورية، ومسارات تدريب منظمة تضعك في وضع الاختبار منذ اليوم الأول.'
                  : 'Learn with clarity: precise questions, instant analytics, and organized training tracks that put you in exam mode from day one.'}
              </p>
              <div className="cta-row">
                <button className="btn primary" onClick={handleSignup}>
                  {isArabic ? 'ابدأ مجاناً الآن' : 'Start free now'}
                </button>
                <button className="btn ghost" onClick={handleLogin}>
                  {isArabic ? 'تسجيل الدخول' : 'Login'}
                </button>
              </div>
              <div className="trust-bar">
                <span>{isArabic ? 'مهيأة للجوال • تدعم العربية بالكامل' : 'Mobile-ready • Fully supports Arabic'}</span>
                <span>•</span>
                <span>{isArabic ? 'لا قيود على المحتوى' : 'No content paywalls'}</span>
              </div>
            </div>

            <div className="hero-panel">
              <div className="panel-chip">{isArabic ? 'لوحة أداء مباشرة' : 'Live performance panel'}</div>
              <div className="panel-card">
                <div className="panel-metric">
                  <div className="metric-label">{isArabic ? 'الدقة' : 'Accuracy'}</div>
                  <div className="metric-value">86%</div>
                  <div className="metric-delta positive">+6%</div>
                </div>
                <div className="panel-metric">
                  <div className="metric-label">{isArabic ? 'وقت السؤال' : 'Per question'}</div>
                  <div className="metric-value">41s</div>
                  <div className="metric-delta neutral">=</div>
                </div>
                <div className="panel-track">
                  <div className="track-head">
                    <span>{isArabic ? 'تقدم المواضيع' : 'Topic momentum'}</span>
                    <span className="track-pill">{isArabic ? 'تحديث فوري' : 'Real-time'}</span>
                  </div>
                  <div className="track-bars">
                    <div className="track-bar" style={{ width: '78%' }}>
                      <span>{isArabic ? 'باطنية' : 'Internal Medicine'}</span>
                      <strong>78%</strong>
                    </div>
                    <div className="track-bar" style={{ width: '64%' }}>
                      <span>{isArabic ? 'أطفال' : 'Pediatrics'}</span>
                      <strong>64%</strong>
                    </div>
                    <div className="track-bar" style={{ width: '52%' }}>
                      <span>{isArabic ? 'جراحة' : 'Surgery'}</span>
                      <strong>52%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="stat-grid" aria-label={isArabic ? 'إحصائيات المنصة' : 'Platform stats'}>
            {stats.map((item) => (
              <article key={item.labelEn} className="stat-card">
                <div className="stat-value">{item.value}</div>
                <div className="stat-label">{isArabic ? item.labelAr : item.labelEn}</div>
              </article>
            ))}
          </section>

          <section className="feature-section">
            <div className="section-head">
              <p className="pill subtle">{isArabic ? 'منظم - حديث - واضح' : 'Organized · Modern · Clear'}</p>
              <h2>{isArabic ? 'كل ما تحتاجه في صفحة واحدة أنيقة' : 'Everything you need, in one clean view'}</h2>
              <p>
                {isArabic
                  ? 'صممنا الواجهة لتبقى بسيطاً في التنقل وغنياً في المحتوى — خطوات أقل، تركيز أعلى.'
                  : 'We designed the experience to stay minimal in clicks and rich in clarity—fewer steps, sharper focus.'}
              </p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <div key={feature.titleEn} className="feature-card">
                  <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
                  <h3>{isArabic ? feature.titleAr : feature.titleEn}</h3>
                  <p>{isArabic ? feature.descAr : feature.descEn}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mid-cta">
            <div className="mid-cta-copy">
              <h3>{isArabic ? 'ابدأ جلسة تدريب الآن' : 'Launch a practice session now'}</h3>
              <p>
                {isArabic
                  ? 'انقر للانضمام فوراً، أو سجّل الدخول لاستكمال تقدمك على أي جهاز.'
                  : 'Join instantly or log in to keep your progress synced across devices.'}
              </p>
            </div>
            <div className="mid-cta-actions">
              <button className="btn primary" onClick={handleSignup}>
                {isArabic ? 'إنشاء حساب مجاني' : 'Create free account'}
              </button>
              <button className="btn ghost" onClick={handleLogin}>
                {isArabic ? 'تسجيل الدخول' : 'Login'}
              </button>
            </div>
          </section>

          <section className="flow-section">
            <div className="flow-card">
              <div className="flow-head">
                <p className="pill subtle">{isArabic ? 'تدفق واضح' : 'Clear flow'}</p>
                <h2>{isArabic ? 'ابدأ وتدرّب وراجع خلال دقائق' : 'Start, practice, and review in minutes'}</h2>
                <p>
                  {isArabic
                    ? 'مسار بسيط يقودك من إنشاء الحساب إلى جلسات المراجعة الذكية دون تشتيت.'
                    : 'A straightforward path that guides you from sign-up to smart review sessions without friction.'}
                </p>
              </div>
              <div className="steps">
                {steps.map((step, index) => (
                  <div key={step.labelEn} className="step">
                    <div className="step-index">0{index + 1}</div>
                    <div>
                      <h4>{isArabic ? step.labelAr : step.labelEn}</h4>
                      <p>{isArabic ? step.hintAr : step.hintEn}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flow-side">
              <div className="side-card">
                <h3>{isArabic ? 'تصميم يركز على الإجراءات' : 'Action-first design'}</h3>
                <ul>
                  <li>{isArabic ? 'CTA واضح في الأعلى والأسفل لبدء سريع.' : 'Primary CTAs at the top and bottom for fast start.'}</li>
                  <li>{isArabic ? 'ألوان تباين عالية وخط واضح للحفاظ على التركيز.' : 'High-contrast palette and clean type to keep focus.'}</li>
                  <li>{isArabic ? 'تخطيط شبكي منظم لعرض الميزات دون ازدحام.' : 'Structured grid layout that surfaces features without clutter.'}</li>
                </ul>
              </div>
              <div className="side-card muted">
                <h3>{isArabic ? 'دعم الهاتف والتطبيق' : 'Phone-first and app-friendly'}</h3>
                <p>
                  {isArabic
                    ? 'واجهة مرنة، تعمل بسلاسة على المتصفح والجوال، مع دعم إضافة المنصة كشاشة رئيسية.'
                    : 'Responsive layout that feels natural on web and mobile, ready to live on your home screen.'}
                </p>
              </div>
            </div>
          </section>

          <section className="cta-band">
            <div className="cta-band-content">
              <div>
                <p className="pill subtle">{isArabic ? 'جاهز للبدء؟' : 'Ready to start?'}</p>
                <h2>{isArabic ? 'ادخل وضع الاختبار اليوم' : 'Step into exam mode today'}</h2>
                <p>
                  {isArabic
                    ? 'أنشئ حسابك المجاني، اختر تخصصك، وابدأ جلسة تدريب خلال أقل من دقيقتين.'
                    : 'Create your free account, pick your specialty, and launch a practice session in under two minutes.'}
                </p>
              </div>
              <div className="cta-actions">
                <button className="btn primary" onClick={handleSignup}>
                  {isArabic ? 'إنشاء حساب مجاني' : 'Create free account'}
                </button>
                <button className="btn outline" onClick={handleLogin}>
                  {isArabic ? 'تسجيل الدخول' : 'I already have an account'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="footer-wrapper">
          <footer className="simple-footer">
            <p>
              {isArabic
                ? <>© {new Date().getFullYear()} <strong>SQB</strong>. جميع الحقوق محفوظة.</>
                : <>© {new Date().getFullYear()} <strong>SQB</strong>. All rights reserved.</>}
            </p>
            <div className="footer-links-row">
              <Link to="/privacy">{isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
              <span>•</span>
              <Link to="/terms">{isArabic ? 'شروط الاستخدام' : 'Terms of Service'}</Link>
              <span>•</span>
              <Link to="/about">{isArabic ? 'من نحن' : 'About Us'}</Link>
              <span>•</span>
              <Link to="/faq">{isArabic ? 'الأسئلة الشائعة' : 'FAQ'}</Link>
              <span>•</span>
              <Link to="/contact">{isArabic ? 'اتصل بنا' : 'Contact Us'}</Link>
            </div>
            <p className="footer-disclaimer-text">
              {isArabic
                ? 'منصة تعليمية غير تابعة لـ Prometric أو SCFHS'
                : 'Educational platform not affiliated with Prometric or SCFHS'}
            </p>
          </footer>
        </div>

        <div className="mobile-cta">
          <button className="btn primary" onClick={handleSignup}>
            {isArabic ? 'ابدأ مجاناً' : 'Start free'}
          </button>
          <button className="btn outline" onClick={handleLogin}>
            {isArabic ? 'دخول' : 'Login'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing; 