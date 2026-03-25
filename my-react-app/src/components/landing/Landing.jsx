import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

const stats = [
  { label: 'سؤال', value: '11,000+' },
  { label: 'مجاني للأبد', value: 'FREE' },
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

  const handleSignup = () => navigate('/signup');
  const handleLogin = () => navigate('/login');

  useEffect(() => {
    const originalDir = document.documentElement.dir;
    document.documentElement.dir = 'rtl';
    return () => {
      document.documentElement.dir = originalDir || 'ltr';
    };
  }, []);

  return (
    <>
      <div className="landing-body" dir="rtl">
        <div className="landing-shell">
          <header className="landing-topbar" aria-label="التنقل الرئيسي">
            <div className="topbar-brand-wrap">
              <Link to="/" className="topbar-brand">SQB</Link>
              <span className="topbar-tag">بنك أسئلة SMLE</span>
            </div>
            <nav className="topbar-links" aria-label="روابط سريعة">
              <Link to="/about">من نحن</Link>
              <Link to="/faq">الأسئلة الشائعة</Link>
              <Link to="/contact">اتصل بنا</Link>
            </nav>
            <div className="topbar-actions">
              <button className="btn ghost" onClick={handleLogin}>
                تسجيل الدخول
              </button>
              <button className="btn primary" onClick={handleSignup}>
                ابدأ مجاناً
              </button>
            </div>
          </header>

          <section className="hero">
            <div className="hero-copy">
              <span className="pill">
                منصة SMLE
              </span>
              <h1>
                تجربة تدريب على برومترك حديثة، منظمة، ومجانية
              </h1>
              <p>
                تعلم بوضوح: أسئلة دقيقة، تحليلات فورية، ومسارات تدريب منظمة تضعك في وضع الاختبار منذ اليوم الأول.
              </p>
              <div className="cta-row">
                <button className="btn primary" onClick={handleSignup}>
                  ابدأ مجاناً الآن
                </button>
                <button className="btn ghost" onClick={handleLogin}>
                  تسجيل الدخول
                </button>
              </div>
              <div className="trust-bar">
                <span>مهيأة للجوال • تدعم العربية بالكامل</span>
                <span>•</span>
                <span>لا قيود على المحتوى</span>
              </div>
            </div>

            <div className="hero-panel">
              <div className="panel-chip">لوحة أداء مباشرة</div>
              <div className="panel-card">
                <div className="panel-metric">
                  <div className="metric-label">الدقة</div>
                  <div className="metric-value">86%</div>
                  <div className="metric-delta positive">+6%</div>
                </div>
                <div className="panel-metric">
                  <div className="metric-label">وقت السؤال</div>
                  <div className="metric-value">41s</div>
                  <div className="metric-delta neutral">=</div>
                </div>
                <div className="panel-track">
                  <div className="track-head">
                    <span>تقدم المواضيع</span>
                    <span className="track-pill">تحديث فوري</span>
                  </div>
                  <div className="track-bars">
                    <div className="track-bar" style={{ width: '78%' }}>
                      <span>Internal Medicine</span>
                      <strong>78%</strong>
                    </div>
                    <div className="track-bar" style={{ width: '64%' }}>
                      <span>Pediatric</span>
                      <strong>64%</strong>
                    </div>
                    <div className="track-bar" style={{ width: '52%' }}>
                      <span>Surgery</span>
                      <strong>52%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

          <section className="mid-cta">
            <div className="mid-cta-copy">
              <h3>ابدأ جلسة تدريب الآن</h3>
              <p>
                انقر للانضمام فوراً، أو سجّل الدخول لاستكمال تقدمك على أي جهاز.
              </p>
            </div>
            <div className="mid-cta-actions">
              <button className="btn primary" onClick={handleSignup}>
                إنشاء حساب مجاني
              </button>
              <button className="btn ghost" onClick={handleLogin}>
                تسجيل الدخول
              </button>
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
            <div className="flow-side">
              <div className="side-card">
                <h3>تصميم يركز على الإجراءات</h3>
                <ul>
                  <li>CTA واضح في الأعلى والأسفل لبدء سريع.</li>
                  <li>ألوان تباين عالية وخط واضح للحفاظ على التركيز.</li>
                  <li>تخطيط شبكي منظم لعرض الميزات دون ازدحام.</li>
                </ul>
              </div>
              <div className="side-card muted">
                <h3>دعم الهاتف والتطبيق</h3>
                <p>
                  واجهة مرنة، تعمل بسلاسة على المتصفح والجوال، مع دعم إضافة المنصة كشاشة رئيسية.
                </p>
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