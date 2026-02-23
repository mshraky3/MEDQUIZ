import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'ما هي منصة SQB؟ | What is SQB?',
            answer: 'SQB (SMLE Question Bank) هي منصة تعليمية متخصصة في التحضير لاختبار الهيئة السعودية للتخصصات الصحية (SMLE) واختبار البرومترك. توفر المنصة أكثر من 8,000 سؤال طبي مع تحليلات مفصلة وتتبع أداء شامل.\n\nSQB is an educational platform specialized in preparing for the Saudi Medical Licensing Examination (SMLE) and Prometric exams, offering 8,000+ medical questions with detailed analytics and comprehensive performance tracking.'
        },
        {
            question: 'كم عدد الأسئلة المتاحة؟ | How many questions are available?',
            answer: 'تحتوي المنصة على أكثر من 8,000 سؤال طبي تغطي أكثر من 40 تخصص طبي مختلف، تشمل الطب الباطني، الجراحة، طب الأطفال، النساء والتوليد، والمزيد.\n\nThe platform contains over 8,000 medical questions covering 40+ different medical specialties including Internal Medicine, Surgery, Pediatrics, OB/GYN, and more.'
        },
        {
            question: 'هل يمكنني تجربة المنصة مجاناً؟ | Can I try the platform for free?',
            answer: 'نعم! توفر المنصة تجربة مجانية تتيح لك الوصول إلى عدد محدود من الأسئلة لتقييم جودة المحتوى قبل الاشتراك.\n\nYes! The platform offers a free trial that gives you access to a limited number of questions so you can evaluate the content quality before subscribing.'
        },
        {
            question: 'ما هي أنواع الاختبارات المتاحة؟ | What types of quizzes are available?',
            answer: 'نوفر اختبارات بأحجام مختلفة تناسب احتياجاتك:\n• اختبار سريع: 10 أسئلة (للمراجعة السريعة)\n• اختبار متوسط: 20 سؤال\n• اختبار طويل: 50 سؤال\n• اختبار شامل: 100 سؤال (يحاكي الاختبار الفعلي)\n\nWe offer quizzes in different sizes:\n• Quick Quiz: 10 questions (for quick review)\n• Medium Quiz: 20 questions\n• Long Quiz: 50 questions\n• Full Exam: 100 questions (simulates the actual exam)'
        },
        {
            question: 'كيف يعمل نظام التحليلات؟ | How does the analytics system work?',
            answer: 'يوفر نظام التحليلات معلومات مفصلة عن أداءك تشمل:\n• نسبة الإجابات الصحيحة لكل تخصص\n• تتبع التقدم عبر الزمن\n• تحديد المواضيع الضعيفة التي تحتاج مراجعة\n• تاريخ الاختبارات السابقة والنتائج\n• الأسئلة الخاطئة لمراجعتها\n\nThe analytics system provides detailed performance information including:\n• Correct answer rate per specialty\n• Progress tracking over time\n• Identification of weak topics needing review\n• Previous quiz history and results\n• Wrong questions for review'
        },
        {
            question: 'هل الأسئلة محدّثة؟ | Are the questions up to date?',
            answer: 'نعم، يتم تحديث بنك الأسئلة بشكل دوري لضمان توافقه مع أحدث المعايير والمحتوى الطبي. فريقنا يعمل باستمرار على إضافة أسئلة جديدة وتحسين الأسئلة الحالية.\n\nYes, the question bank is regularly updated to ensure it aligns with the latest medical standards and content. Our team continuously works on adding new questions and improving existing ones.'
        },
        {
            question: 'كيف أشترك في المنصة؟ | How do I subscribe?',
            answer: 'يمكنك الاشتراك في المنصة بخطوات بسيطة:\n1. قم بإنشاء حساب مجاني\n2. جرب التجربة المجانية\n3. اختر خطة الاشتراك المناسبة لك\n4. ادفع عبر الطرق المتاحة\n5. ابدأ التحضير لاختبارك!\n\nYou can subscribe in simple steps:\n1. Create a free account\n2. Try the free trial\n3. Choose the subscription plan that suits you\n4. Pay through available methods\n5. Start preparing for your exam!'
        },
        {
            question: 'هل المنصة تابعة للهيئة السعودية للتخصصات الصحية؟ | Is the platform affiliated with SCFHS?',
            answer: 'لا، SQB هي منصة تعليمية مستقلة وغير تابعة للهيئة السعودية للتخصصات الصحية (SCFHS) أو شركة Prometric أو أي جهة رسمية. الأسئلة المقدمة هي للتدريب والممارسة فقط.\n\nNo, SQB is an independent educational platform and is not affiliated with the Saudi Commission for Health Specialties (SCFHS), Prometric, or any official licensing body. The questions provided are for practice purposes only.'
        },
        {
            question: 'كيف أتواصل مع الدعم؟ | How do I contact support?',
            answer: 'يمكنك التواصل معنا عبر:\n• واتساب: 0582619119\n• البريد الإلكتروني: alshraky3@gmail.com\n• صفحة الاتصال على الموقع\n\nYou can contact us via:\n• WhatsApp: 0582619119\n• Email: alshraky3@gmail.com\n• The contact page on our website'
        },
        {
            question: 'هل يمكنني استخدام المنصة على الجوال؟ | Can I use the platform on mobile?',
            answer: 'نعم! المنصة مصممة لتعمل بشكل ممتاز على جميع الأجهزة بما في ذلك الهواتف الذكية والأجهزة اللوحية وأجهزة الكمبيوتر. لا تحتاج لتحميل أي تطبيق - استخدم المنصة مباشرة من المتصفح.\n\nYes! The platform is designed to work excellently on all devices including smartphones, tablets, and computers. No app download needed - use the platform directly from your browser.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="faq-container">
                <Link to="/" className="faq-back">← Back to Home</Link>

                <div className="faq-header">
                    <h1>الأسئلة الشائعة | FAQ</h1>
                    <p>إجابات على الأسئلة الأكثر شيوعاً حول منصة SQB</p>
                    <p>Answers to the most frequently asked questions about SQB</p>
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
                    <h2>لم تجد إجابة لسؤالك؟ | Didn't find your answer?</h2>
                    <p>تواصل معنا وسنكون سعداء بمساعدتك | Contact us and we'll be happy to help</p>
                    <div className="faq-cta-buttons">
                        <Link to="/contact" className="faq-cta-btn">
                            اتصل بنا | Contact Us
                        </Link>
                        <a href="https://wa.link/gqafib" className="faq-cta-btn faq-cta-whatsapp" target="_blank" rel="noopener noreferrer">
                            واتساب | WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
