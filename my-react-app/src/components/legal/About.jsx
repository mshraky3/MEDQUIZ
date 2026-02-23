import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const About = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="legal-back">← Back to Home</Link>

                <h1>About Us | من نحن</h1>
                <p className="legal-updated">SMLE Question Bank (SQB)</p>

                <section className="legal-section">
                    <h2>من نحن | Who We Are</h2>
                    <p>
                        اس كيو بي (SQB) هي منصة تعليمية سعودية متخصصة في التحضير لاختبار الهيئة السعودية 
                        للتخصصات الصحية (SMLE) واختبار البرومترك. تأسست المنصة بهدف مساعدة الأطباء والطلاب 
                        في المملكة العربية السعودية والمنطقة العربية على اجتياز هذه الاختبارات بنجاح.
                    </p>
                    <p>
                        SQB (SMLE Question Bank) is a Saudi-based educational platform dedicated to helping medical 
                        professionals and students prepare for the Saudi Medical Licensing Examination (SMLE) and 
                        Prometric exams. Our platform was founded with a mission to provide accessible, high-quality 
                        exam preparation resources.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>مهمتنا | Our Mission</h2>
                    <p>
                        نسعى لتوفير أفضل تجربة تحضيرية للاختبارات الطبية من خلال تقديم بنك أسئلة شامل 
                        وتحليلات متقدمة تساعد الطلاب على تحديد نقاط القوة والضعف لديهم والتركيز على 
                        المواضيع التي تحتاج إلى مزيد من المراجعة.
                    </p>
                    <p>
                        Our mission is to provide the best exam preparation experience through a comprehensive 
                        question bank and advanced analytics that help students identify their strengths and 
                        weaknesses, enabling them to focus on areas that need improvement.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>ماذا نقدم | What We Offer</h2>
                    <ul>
                        <li>
                            <strong>بنك أسئلة شامل:</strong> أكثر من 8,000 سؤال طبي محدّث يغطي جميع التخصصات الطبية
                            <br/>
                            <em>Comprehensive Question Bank: Over 8,000 updated medical questions covering all medical specialties</em>
                        </li>
                        <li>
                            <strong>تحليلات مفصلة:</strong> تتبع أداءك ومعرفة نقاط القوة والضعف لديك
                            <br/>
                            <em>Detailed Analytics: Track your performance and identify your strengths and weaknesses</em>
                        </li>
                        <li>
                            <strong>اختبارات متنوعة:</strong> اختبارات قصيرة (10 أسئلة) إلى اختبارات شاملة (100 سؤال)
                            <br/>
                            <em>Varied Quizzes: From short quizzes (10 questions) to comprehensive exams (100 questions)</em>
                        </li>
                        <li>
                            <strong>تتبع التقدم:</strong> متابعة تطورك عبر الزمن مع إحصائيات مفصلة
                            <br/>
                            <em>Progress Tracking: Monitor your improvement over time with detailed statistics</em>
                        </li>
                        <li>
                            <strong>أكثر من 40 تخصص:</strong> تغطية شاملة لجميع التخصصات الطبية المطلوبة
                            <br/>
                            <em>40+ Topics: Comprehensive coverage of all required medical specialties</em>
                        </li>
                        <li>
                            <strong>تجربة مجانية:</strong> جرب المنصة مجاناً قبل الاشتراك
                            <br/>
                            <em>Free Trial: Try the platform for free before subscribing</em>
                        </li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>لماذا SQB؟ | Why SQB?</h2>
                    <ul>
                        <li>
                            <strong>تحديث مستمر:</strong> يتم تحديث بنك الأسئلة بانتظام ليتوافق مع أحدث المعايير
                            <br/>
                            <em>Regular Updates: Our question bank is regularly updated to align with the latest standards</em>
                        </li>
                        <li>
                            <strong>تصميم سهل الاستخدام:</strong> واجهة بسيطة وسهلة الاستخدام على جميع الأجهزة
                            <br/>
                            <em>User-Friendly Design: Simple and intuitive interface across all devices</em>
                        </li>
                        <li>
                            <strong>دعم ثنائي اللغة:</strong> المنصة متاحة باللغتين العربية والإنجليزية
                            <br/>
                            <em>Bilingual Support: The platform is available in both Arabic and English</em>
                        </li>
                        <li>
                            <strong>أسعار مناسبة:</strong> اشتراكات بأسعار معقولة تناسب الجميع
                            <br/>
                            <em>Affordable Pricing: Subscription plans that suit everyone's budget</em>
                        </li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>فريقنا | Our Team</h2>
                    <p>
                        يتكون فريقنا من مطورين ومتخصصين في المجال الطبي يعملون معاً لتقديم أفضل 
                        تجربة تعليمية ممكنة. نحن ملتزمون بالتحسين المستمر لمنصتنا بناءً على 
                        ملاحظات واقتراحات مستخدمينا.
                    </p>
                    <p>
                        Our team consists of developers and medical professionals working together to 
                        deliver the best possible educational experience. We are committed to continuously 
                        improving our platform based on user feedback and suggestions.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>إخلاء المسؤولية | Disclaimer</h2>
                    <p>
                        SQB هي منصة تعليمية مستقلة وغير تابعة للهيئة السعودية للتخصصات الصحية (SCFHS) 
                        أو شركة Prometric أو أي جهة رسمية. الأسئلة المقدمة هي للتدريب والممارسة فقط 
                        ولا تمثل الاختبار الفعلي.
                    </p>
                    <p>
                        SQB is an independent educational platform and is not affiliated with the Saudi 
                        Commission for Health Specialties (SCFHS), Prometric, or any official licensing body. 
                        The questions provided are for practice and training purposes only and do not 
                        represent the actual examination.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>تواصل معنا | Contact Us</h2>
                    <p>
                        نرحب بأسئلتكم واقتراحاتكم. يمكنكم التواصل معنا عبر:
                    </p>
                    <ul>
                        <li><strong>البريد الإلكتروني | Email:</strong> alshraky3@gmail.com</li>
                        <li><strong>واتساب | WhatsApp:</strong> 0582619119</li>
                        <li><strong>صفحة الاتصال | Contact Page:</strong> <Link to="/contact">اتصل بنا</Link></li>
                    </ul>
                    <p>
                        <strong>الموقع:</strong> المملكة العربية السعودية
                        <br/>
                        <strong>Location:</strong> Saudi Arabia
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
