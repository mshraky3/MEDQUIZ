import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'ما هي منصة SQB؟',
            answer: 'SQB (SMLE Question Bank) هي منصة تعليمية متخصصة في التحضير لاختبار الهيئة السعودية للتخصصات الصحية (SMLE) واختبار البرومترك. توفر المنصة أكثر من 8,000 سؤال طبي مع تحليلات مفصلة وتتبع أداء شامل.'
        },
        {
            question: 'كم عدد الأسئلة المتاحة؟',
            answer: 'تحتوي المنصة على أكثر من 8,000 سؤال طبي تغطي أكثر من 40 تخصص طبي مختلف، تشمل Internal Medicine، Surgery، Pediatric، OB/GYN، والمزيد.'
        },
        {
            question: 'هل يمكنني تجربة المنصة مجاناً؟',
            answer: 'نعم! توفر المنصة تجربة مجانية تتيح لك الوصول إلى عدد محدود من الأسئلة لتقييم جودة المحتوى قبل الاشتراك.'
        },
        {
            question: 'ما هي أنواع الاختبارات المتاحة؟',
            answer: 'نوفر اختبارات بأحجام مختلفة تناسب احتياجاتك:\n• اختبار سريع: 10 أسئلة (للمراجعة السريعة)\n• اختبار متوسط: 20 سؤال\n• اختبار طويل: 50 سؤال\n• اختبار شامل: 100 سؤال (يحاكي الاختبار الفعلي)'
        },
        {
            question: 'كيف يعمل نظام التحليلات؟',
            answer: 'يوفر نظام التحليلات معلومات مفصلة عن أداءك تشمل:\n• نسبة الإجابات الصحيحة لكل تخصص\n• تتبع التقدم عبر الزمن\n• تحديد المواضيع الضعيفة التي تحتاج مراجعة\n• تاريخ الاختبارات السابقة والنتائج\n• الأسئلة الخاطئة لمراجعتها'
        },
        {
            question: 'هل الأسئلة محدّثة؟',
            answer: 'نعم، يتم تحديث بنك الأسئلة بشكل دوري لضمان توافقه مع أحدث المعايير والمحتوى الطبي. فريقنا يعمل باستمرار على إضافة أسئلة جديدة وتحسين الأسئلة الحالية.'
        },
        {
            question: 'كيف أشترك في المنصة؟',
            answer: 'يمكنك الاشتراك في المنصة بخطوات بسيطة:\n1. قم بإنشاء حساب مجاني\n2. جرب التجربة المجانية\n3. اختر خطة الاشتراك المناسبة لك\n4. ادفع عبر الطرق المتاحة\n5. ابدأ التحضير لاختبارك!'
        },
        {
            question: 'هل المنصة تابعة للهيئة السعودية للتخصصات الصحية؟',
            answer: 'لا، SQB هي منصة تعليمية مستقلة وغير تابعة للهيئة السعودية للتخصصات الصحية (SCFHS) أو شركة Prometric أو أي جهة رسمية. الأسئلة المقدمة هي للتدريب والممارسة فقط.'
        },
        {
            question: 'كيف أتواصل مع الدعم؟',
            answer: 'يمكنك التواصل معنا عبر:\n• واتساب: 0582619119\n• البريد الإلكتروني: alshraky3@gmail.com\n• صفحة الاتصال على الموقع'
        },
        {
            question: 'هل يمكنني استخدام المنصة على الجوال؟',
            answer: 'نعم! المنصة مصممة لتعمل بشكل ممتاز على جميع الأجهزة بما في ذلك الهواتف الذكية والأجهزة اللوحية وأجهزة الكمبيوتر. لا تحتاج لتحميل أي تطبيق - استخدم المنصة مباشرة من المتصفح.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="faq-container">
                <Link to="/" className="faq-back">الرئيسية →</Link>

                <div className="faq-header">
                    <h1>الأسئلة الشائعة</h1>
                    <p>إجابات على الأسئلة الأكثر شيوعاً حول منصة SQB</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'faq-item-open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    {faq.answer.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-contact-cta">
                    <h2>لم تجد إجابة لسؤالك؟</h2>
                    <p>تواصل معنا وسنكون سعداء بمساعدتك</p>
                    <div className="faq-cta-buttons">
                        <Link to="/contact" className="faq-cta-btn">
                            اتصل بنا
                        </Link>
                        <a href="https://wa.link/gqafib" className="faq-cta-btn faq-cta-whatsapp" target="_blank" rel="noopener noreferrer">
                            واتساب
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
