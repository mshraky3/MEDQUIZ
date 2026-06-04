import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

/**
 * Bilingual block: Arabic is primary (RTL), English is the secondary
 * translation (LTR), visually separated so neither language bleeds into
 * the other and long mixed content never overflows horizontally.
 */
const Bilingual = ({ ar, en }) => (
    <div className="bilingual">
        <p className="bilingual-ar" dir="rtl" lang="ar">{ar}</p>
        <p className="bilingual-en" dir="ltr" lang="en">{en}</p>
    </div>
);

const offerings = [
    { ar: 'بنك أسئلة شامل: أكثر من 8,000 سؤال طبي محدّث يغطي جميع التخصصات.', en: 'Comprehensive question bank: 8,000+ updated medical questions across all specialties.' },
    { ar: 'تحليلات مفصلة: تتبّع أداءك وحدّد نقاط القوة والضعف لديك.', en: 'Detailed analytics: track your performance and identify strengths and weaknesses.' },
    { ar: 'اختبارات متنوعة: من جلسات قصيرة (10 أسئلة) إلى اختبارات شاملة (100 سؤال).', en: 'Varied quizzes: from short sessions (10 questions) to full exams (100 questions).' },
    { ar: 'تتبّع التقدم: متابعة تطوّرك عبر الزمن مع إحصائيات دقيقة.', en: 'Progress tracking: monitor your improvement over time with precise statistics.' },
    { ar: 'أكثر من 40 تخصصاً: تغطية شاملة لجميع التخصصات الطبية المطلوبة.', en: '40+ topics: complete coverage of all required medical specialties.' },
    { ar: 'وصول مجاني: المنصة متاحة مجاناً بالكامل لجميع المستخدمين حالياً.', en: 'Free access: the platform is currently fully free for all users.' }
];

const reasons = [
    { ar: 'تحديث مستمر: يُحدَّث بنك الأسئلة بانتظام ليواكب أحدث المعايير.', en: 'Regular updates: the question bank is updated to align with the latest standards.' },
    { ar: 'تصميم سهل الاستخدام: واجهة بسيطة وواضحة على جميع الأجهزة.', en: 'User-friendly design: a simple, clear interface across all devices.' },
    { ar: 'دعم ثنائي اللغة: المنصة متاحة بالعربية والإنجليزية.', en: 'Bilingual support: available in both Arabic and English.' }
];

const About = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="legal-back">الرئيسية →</Link>

                <h1>About Us | من نحن</h1>
                <p className="legal-updated">SMLE Question Bank (SQB)</p>

                <section className="legal-section">
                    <h2>من نحن | Who We Are</h2>
                    <Bilingual
                        ar="اس كيو بي (SQB) منصة تعليمية سعودية متخصصة في التحضير لاختبار الهيئة السعودية للتخصصات الصحية (SMLE) واختبار البرومترك. تأسست المنصة لمساعدة الأطباء والطلاب في المملكة والمنطقة العربية على اجتياز هذه الاختبارات بنجاح."
                        en="SQB (SMLE Question Bank) is a Saudi-based educational platform dedicated to helping medical professionals and students prepare for the Saudi Medical Licensing Examination (SMLE) and Prometric exams, with accessible, high-quality preparation resources."
                    />
                </section>

                <section className="legal-section">
                    <h2>مهمتنا | Our Mission</h2>
                    <Bilingual
                        ar="نسعى لتوفير أفضل تجربة تحضيرية للاختبارات الطبية عبر بنك أسئلة شامل وتحليلات متقدمة تساعد الطلاب على تحديد نقاط القوة والضعف والتركيز على المواضيع التي تحتاج مراجعة."
                        en="Our mission is to deliver the best exam-prep experience through a comprehensive question bank and advanced analytics that help students focus on the areas that need improvement."
                    />
                </section>

                <section className="legal-section">
                    <h2>ماذا نقدم | What We Offer</h2>
                    <div className="bilingual-list">
                        {offerings.map((item, i) => (
                            <Bilingual key={i} ar={item.ar} en={item.en} />
                        ))}
                    </div>
                </section>

                <section className="legal-section">
                    <h2>لماذا SQB؟ | Why SQB?</h2>
                    <div className="bilingual-list">
                        {reasons.map((item, i) => (
                            <Bilingual key={i} ar={item.ar} en={item.en} />
                        ))}
                    </div>
                </section>

                <section className="legal-section">
                    <h2>إخلاء المسؤولية | Disclaimer</h2>
                    <Bilingual
                        ar="SQB منصة تعليمية مستقلة وغير تابعة للهيئة السعودية للتخصصات الصحية (SCFHS) أو شركة Prometric أو أي جهة رسمية. الأسئلة المقدَّمة للتدريب والممارسة فقط ولا تمثل الاختبار الفعلي."
                        en="SQB is an independent educational platform, not affiliated with the Saudi Commission for Health Specialties (SCFHS), Prometric, or any official body. Questions are for practice only and do not represent the actual exam."
                    />
                </section>

                <section className="legal-section">
                    <h2>تواصل معنا | Contact Us</h2>
                    <p className="contact-intro" dir="rtl">نرحب بأسئلتكم واقتراحاتكم. يمكنكم التواصل معنا عبر:</p>
                    <ul className="contact-list">
                        <li>
                            <span className="contact-label">البريد الإلكتروني | Email:</span>
                            <a href="mailto:alshraky3@gmail.com">alshraky3@gmail.com</a>
                        </li>
                        <li>
                            <span className="contact-label">واتساب | WhatsApp:</span>
                            <a href="https://wa.me/966582619119" target="_blank" rel="noopener noreferrer">0582619119</a>
                        </li>
                        <li>
                            <span className="contact-label">صفحة الاتصال | Contact Page:</span>
                            <Link to="/contact">اتصل بنا</Link>
                        </li>
                    </ul>
                    <p className="contact-location" dir="rtl">
                        الموقع: المملكة العربية السعودية &nbsp;·&nbsp; <span dir="ltr">Location: Saudi Arabia</span>
                    </p>
                    <p className="contact-legal" dir="rtl">
                        شركة دار الخبرة التجارية &nbsp;·&nbsp; السجل التجاري: 7040567922
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
