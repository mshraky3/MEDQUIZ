import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import './Landing.css';

const stats = [
  { label: 'سؤال', value: '11,000+' },
  { label: 'بدء مجاني', value: '0 ريال' },
  { label: 'تدريب يومي', value: '24/7' },
  { label: 'مواضيع مغطاة', value: '40+' }
];

const features = [
  {
    icon: '📚',
    title: 'تغطية كاملة لاختبار SMLE',
    desc: 'بنك أسئلة منسق وفق أحدث مخطط برومترك مع سياق سريري واضح.'
  },
  {
    icon: '📈',
    title: 'تحليلات موجهة',
    desc: 'تتبع نقاط الضعف والسرعة والدقة عبر لوحات واضحة.'
  },
  {
    icon: '🎯',
    title: 'تدريب متكيف',
    desc: 'تمارين موجهة، محاكاة زمنية، ومراجعة ذكية.'
  },
  {
    icon: '🧠',
    title: 'تفكير سريري',
    desc: 'سيناريوهات سريرية تركز على اتخاذ القرار لا الحفظ.'
  }
];

const steps = [
  {
    label: 'أنشئ حسابك المجاني',
    hint: 'سجّل خلال ثوانٍ وكل شيء يبقى متزامناً.'
  },
  {
    label: 'تمرن بدقة',
    hint: 'اختر المواضيع، اضبط الوقت، وركّز على المهارات المطلوبة.'
  },
  {
    label: 'راجع وتحسّن',
    hint: 'تحليلات فورية، سلاسل إنجاز، وتوصيات مخصصة.'
  }
];

const seoTopics = [
  {
    title: 'تحضير منظم لاختبار SMLE',
    desc: 'ابدأ بجلسات قصيرة أو طويلة حسب وقتك، وراجع أداءك حسب التخصص والموضوع.'
  },
  {
    title: 'تغطية لأسئلة البرومترك الطبية',
    desc: 'المنصة مصممة لدعم التحضير للأطباء والطلاب الباحثين عن تدريب عربي واضح على نمط الأسئلة الطبية الشائع.'
  },
  {
    title: 'مراجعة نقاط الضعف بسرعة',
    desc: 'اعرف أين تخطئ، وارجع إلى الأسئلة الخاطئة، وركّز على المواضيع التي تحتاج إلى عمل فعلي.'
  }
];

const faqHighlights = [
  'ما الفرق بين الجلسة السريعة والجلسة الطويلة داخل المنصة؟',
  'هل تعمل SQB على الهاتف والأجهزة اللوحية؟',
  'كيف تساعدني التحليلات على رفع مستواي قبل اختبار SMLE؟'
];

const Landing = () => {
  const navigate = useNavigate();

  const safeTrack = (eventName, payload) => {
    try {
      track(eventName, payload);
    } catch (error) {
      console.debug('Analytics track skipped:', error);
    }
  };

  const handleSignup = () => {
    safeTrack('landing_cta_signup_click', { section: 'landing' });
    navigate('/signup');
  };

  const handleLogin = () => {
    safeTrack('landing_cta_login_click', { section: 'landing' });
    navigate('/login');
  };

  useEffect(() => {
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';
    return () => {
      document.documentElement.dir = originalDir || 'ltr';
    };
  }, []);

  return (
    <>
      <div className="landing-body">
        <div className="landing-shell">

          <section className="hero">
            <span className="pill">منصة SMLE · بنك أسئلة طبي</span>
            <h1>ابدأ تدريب SMLE خلال دقيقة واحدة</h1>
            <p>
              بنك أسئلة واضح وسريع: أنشئ حسابك، ابدأ أول اختبار، وارجع يومياً بخطة مراجعة عملية.
            </p>
            <div className="cta-row">
              <button className="btn primary" onClick={handleSignup}>
                ابدأ مجاناً الآن
              </button>
              <button className="btn ghost" onClick={handleLogin}>
                تسجيل الدخول
              </button>
            </div>
            <ul className="hero-trust">
              <li>بدء مجاني</li>
              <li>بدون بطاقة بنكية</li>
              <li>مهيأة للجوال</li>
              <li>تدعم العربية بالكامل</li>
            </ul>
          </section>

          <section className="stat-grid" aria-label="إحصائيات المنصة">
            {stats.map((item) => (
              <article key={item.label} className="stat-card">
                <div className="stat-value">{item.value}</div>
                <div className="stat-label">{item.label}</div>
              </article>
            ))}
          </section>

          <section className="feature-section">
            <div className="section-head">
              <p className="pill subtle">منظم - حديث - واضح</p>
              <h2>كل ما تحتاجه في صفحة واحدة أنيقة</h2>
              <p>
                صممنا الواجهة لتبقى بسيطاً في التنقل وغنياً في المحتوى — خطوات أقل، تركيز أعلى.
              </p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <div key={feature.title} className="feature-card">
                  <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="seo-section">
            <div className="section-head">
              <p className="pill subtle">SMLE • برومترك • السعودية</p>
              <h2>محتوى موجّه لما يبحث عنه طلاب الطب والأطباء فعلاً</h2>
              <p>
                إذا كنت تبحث عن بنك أسئلة لاختبار الهيئة السعودية للتخصصات الصحية أو طريقة عملية للتحضير لاختبار البرومترك،
                فهذه المنصة تجمع بين الأسئلة، التدرج في التدريب، والتحليل بعد كل جلسة.
              </p>
            </div>
            <div className="seo-grid">
              {seoTopics.map((topic) => (
                <article key={topic.title} className="seo-card">
                  <h3>{topic.title}</h3>
                  <p>{topic.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="flow-section">
            <div className="flow-card">
              <div className="flow-head">
                <p className="pill subtle">تدفق واضح</p>
                <h2>ابدأ وتدرّب وراجع خلال دقائق</h2>
                <p>
                  مسار بسيط يقودك من إنشاء الحساب إلى جلسات المراجعة الذكية دون تشتيت.
                </p>
              </div>
              <div className="steps">
                {steps.map((step, index) => (
                  <div key={step.label} className="step">
                    <div className="step-index">0{index + 1}</div>
                    <div>
                      <h4>{step.label}</h4>
                      <p>{step.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="resource-section">
            <div className="resource-card">
              <div className="section-head">
                <p className="pill subtle">روابط أساسية</p>
                <h2>صفحات تساعدك قبل البدء</h2>
                <p>
                  قبل إنشاء الحساب أو بدء التدريب، يمكنك قراءة مزيد من التفاصيل عن المنصة، الاطلاع على الأسئلة الشائعة،
                  أو التواصل معنا مباشرة إذا كنت تحتاج مساعدة.
                </p>
              </div>
              <div className="resource-links">
                <Link to="/about" className="resource-link-card">
                  <h3>من نحن</h3>
                  <p>تعرف على هدف SQB وما الذي تقدمه للأطباء وطلاب الطب في السعودية.</p>
                </Link>
                <Link to="/guides" className="resource-link-card">
                  <h3>أدلة التحضير</h3>
                  <p>مقالات عملية عن خطة SMLE، مراجعة الأخطاء، وإدارة الوقت قبل الاختبار.</p>
                </Link>
                <Link to="/faq" className="resource-link-card">
                  <h3>الأسئلة الشائعة</h3>
                  <p>إجابات سريعة حول الحسابات، الاستخدام، والجوال وطبيعة بنك الأسئلة.</p>
                </Link>
                <Link to="/contact" className="resource-link-card">
                  <h3>اتصل بنا</h3>
                  <p>تواصل مع فريق SQB إذا احتجت دعماً أو كان لديك استفسار عن المنصة.</p>
                </Link>
              </div>
            </div>
            <aside className="faq-preview-card">
              <h3>أسئلة يبحث عنها المستخدمون كثيراً</h3>
              <ul>
                {faqHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link to="/faq" className="faq-preview-link">عرض صفحة الأسئلة الشائعة</Link>
            </aside>
          </section>

          <section className="cta-band">
            <div className="cta-band-content">
              <div>
                <p className="pill subtle">جاهز للبدء؟</p>
                <h2>ادخل وضع الاختبار اليوم</h2>
                <p>
                  أنشئ حسابك المجاني، اختر تخصصك، وابدأ جلسة تدريب خلال أقل من دقيقتين.
                </p>
              </div>
              <div className="cta-actions">
                <button className="btn primary" onClick={handleSignup}>
                  إنشاء حساب مجاني
                </button>
                <button className="btn outline" onClick={handleLogin}>
                  تسجيل الدخول
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mobile-cta">
          <button className="btn primary" onClick={handleSignup}>
            ابدأ مجاناً
          </button>
          <button className="btn outline" onClick={handleLogin}>
            دخول
          </button>
        </div>
      </div>
    </>
  );
};

export default Landing; 