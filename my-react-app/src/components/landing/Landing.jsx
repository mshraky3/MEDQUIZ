import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { track } from '@vercel/analytics';
import Icon from '../common/Icon.jsx';
import HeroArt from './HeroArt.jsx';
import './Landing.css';

const stats = [
  { label: 'سؤال', value: '11,000+' },
  { label: 'الاشتراك السنوي', value: '99 ريال' },
  { label: 'تدريب يومي', value: '24/7' },
  { label: 'مواضيع مغطاة', value: '40+' }
];

const features = [
  {
    icon: 'book-open',
    title: 'تغطية كاملة لاختبار SMLE',
    desc: 'بنك أسئلة منسق وفق أحدث مخطط برومترك مع سياق سريري واضح.'
  },
  {
    icon: 'trending-up',
    title: 'تحليلات موجهة',
    desc: 'تتبع نقاط الضعف والسرعة والدقة عبر لوحات واضحة.'
  },
  {
    icon: 'target',
    title: 'تدريب متكيف',
    desc: 'تمارين موجهة، محاكاة زمنية، ومراجعة ذكية.'
  },
  {
    icon: 'brain',
    title: 'تفكير سريري',
    desc: 'سيناريوهات سريرية تركز على اتخاذ القرار لا الحفظ.'
  }
];

const steps = [
  {
    label: 'أنشئ حسابك',
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

const included = [
  'أكثر من 11,000 سؤال محدّث بنمط SMLE والبرومترك، مع تجميعات شهرية جديدة',
  'شرح سريري واضح لكل سؤال — تفهم "لماذا" لا تحفظ فقط',
  'ملخصات مركّزة للمواضيع عالية التكرار بدل تشتت الملفات والمصادر',
  'اختبارات محاكية بتوقيت حقيقي تهيّئك لأجواء الاختبار الفعلي',
  'لوحة تحليلات تكشف نقاط ضعفك وتعيد تدريبك عليها تلقائياً',
  'مراجعة أسئلتك الخاطئة في أي وقت حتى تتقنها',
  'يعمل على الجوال والكمبيوتر، وتقدّمك محفوظ ومتزامن دائماً'
];

const valuePoints = [
  {
    icon: 'award',
    title: 'استثمار صغير، عائد كبير',
    desc: 'رسوم دخول الاختبار وإعادته تتجاوز مئات الريالات، ودورات التحضير تكلف آلافاً. اشتراك SQB يكلف 99 ريالاً فقط للسنة كاملة — أقل من ريالين في الأسبوع.'
  },
  {
    icon: 'check-circle',
    title: 'دفع آمن وبدون التزامات',
    desc: 'دفعة واحدة عبر بوابة ميسر السعودية المرخّصة (مدى، Visa، Mastercard). بدون تجديد تلقائي وبدون رسوم مخفية — سنة كاملة من الوصول غير المحدود.'
  },
  {
    icon: 'refresh',
    title: 'محتوى لا يتوقف عن التحديث',
    desc: 'نضيف تجميعات شهرية جديدة تواكب أحدث نمط لأسئلة الهيئة السعودية، فتتدرب دائماً على الأقرب لما ستراه في اختبارك.'
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
  },
  {
    title: 'تجميعات SMLE شهرية محدّثة',
    desc: 'بنك أسئلة يتجاوز 11,000 سؤال مع تجميعات شهرية محدّثة تواكب أحدث نمط أسئلة اختبار الهيئة السعودية والبرومترك.'
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
      {/* Explicit dir: index.css sets body{direction:ltr}, which would cancel
          the documentElement dir for everything inside. */}
      <div className="landing-body" dir="rtl" lang="ar">
        <div className="landing-shell">

          <section className="hero">
            <HeroArt />
            <span className="pill">منصة SMLE · أكثر من 11,000 سؤال محدّث</span>
            <h1>تدرّب بذكاء، واجتَز اختبار SMLE بثقة</h1>
            <p>
              بنك أسئلة محدّث على نمط البرومترك، مع شرح سريري لكل إجابة وتحليل فوري يكشف نقاط ضعفك
              ويرتّب أولويات مراجعتك — كل ما تحتاجه للوصول إلى درجتك المستهدفة في مكان واحد.
            </p>
            <div className="cta-row">
              <button className="btn primary" onClick={handleSignup}>
                ابدأ الآن
              </button>
              <button className="btn ghost" onClick={handleLogin}>
                تسجيل الدخول
              </button>
            </div>
            <ul className="hero-trust">
              <li>اشتراك سنوي 99 ريال</li>
              <li>وصول كامل لمدة سنة</li>
              <li>شرح سريري لكل سؤال</li>
              <li>تحليلات فورية للأداء</li>
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
                  <span className="feature-icon" aria-hidden="true"><Icon name={feature.icon} size={28} /></span>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="value-section" aria-label="الاشتراك والأسعار">
            <div className="section-head">
              <p className="pill subtle">لماذا الاشتراك؟</p>
              <h2>كل تحضيرك لاختبار SMLE مقابل 99 ريالاً في السنة</h2>
              <p>
                نجاحك في الاختبار يفتح لك باب التدريب والوظيفة — والرسوب يكلفك رسوم إعادة، وشهوراً
                من الانتظار، وضغطاً أنت في غنى عنه. صُممت SQB لتوصلك لدرجتك المستهدفة من أول محاولة.
              </p>
            </div>

            <div className="value-grid">
              <div className="value-points">
                {valuePoints.map((point) => (
                  <div key={point.title} className="value-point">
                    <span className="feature-icon" aria-hidden="true"><Icon name={point.icon} size={24} /></span>
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="price-card" aria-label="تفاصيل الاشتراك">
                <p className="price-card-plan">اشتراك سنوي — دفعة واحدة</p>
                <div className="price-card-amount">
                  <span className="price-card-value">99</span>
                  <span className="price-card-cur">ريال / سنة</span>
                </div>
                <ul className="price-card-list">
                  {included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button className="btn primary price-card-cta" onClick={handleSignup}>
                  اشترك الآن — 99 ريال
                </button>
                <p className="price-card-note">
                  دفع آمن عبر ميسر · مدى / Visa / Mastercard · بدون تجديد تلقائي
                </p>
              </aside>
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
                  أنشئ حسابك، اختر تخصصك، وابدأ جلسة تدريب خلال أقل من دقيقتين.
                </p>
              </div>
              <div className="cta-actions">
                <button className="btn primary" onClick={handleSignup}>
                  إنشاء حساب
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
            ابدأ الآن
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