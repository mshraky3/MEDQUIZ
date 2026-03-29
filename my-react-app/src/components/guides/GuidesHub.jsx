import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAd from '../common/GoogleAd.jsx';
import './Guides.css';

const guides = [
    {
        title: 'خطة SMLE من 12 أسبوع: من الصفر إلى الجاهزية',
        path: '/guides/smle-study-plan',
        excerpt: 'خطة أسبوعية واضحة لتغطية التخصصات الأساسية، مع توزيع يومي للمذاكرة، مراجعة الأخطاء، وحل أسئلة عالية العائد.'
    },
    {
        title: 'طريقة مراجعة الأسئلة الخاطئة بدون تكرار نفس الخطأ',
        path: '/guides/wrong-questions-method',
        excerpt: 'دليل عملي لبناء دفتر أخطاء ذكي وتحويل كل خطأ إلى قاعدة تشخيصية أو علاجية ثابتة قبل يوم الاختبار.'
    }
];

const GuidesHub = () => {
    return (
        <main className="guides-page" dir="rtl">
            <header className="guides-hero">
                <p className="guides-kicker">SMLE Guides</p>
                <h1>أدلة التحضير لاختبار SMLE والبرومترك</h1>
                <p>
                    هذه المكتبة مخصصة للمحتوى التعليمي العميق: خطط مذاكرة، استراتيجيات حل الأسئلة، إدارة الوقت،
                    ومناهج مراجعة موجهة لطلاب الطب والأطباء داخل السعودية.
                </p>
            </header>

            <section className="guides-list" aria-label="أدلة التحضير">
                {guides.map((guide) => (
                    <article key={guide.path} className="guide-card">
                        <h2>
                            <Link to={guide.path}>{guide.title}</Link>
                        </h2>
                        <p>{guide.excerpt}</p>
                        <Link className="guide-cta" to={guide.path}>
                            اقرأ الدليل الكامل
                        </Link>
                    </article>
                ))}
            </section>

            <section className="guides-note">
                <h2>كيف تستفيد من الأدلة؟</h2>
                <ul>
                    <li>ابدأ بخطة زمنية واقعية حسب وقتك اليومي.</li>
                    <li>اربط كل جلسة حل أسئلة بمراجعة أخطائك مباشرة.</li>
                    <li>حافظ على التوازن بين Internal Medicine والجراحة وPediatrics وOB/GYN.</li>
                    <li>لا تقيس التقدم بعدد الساعات فقط، بل بجودة التكرار وتصحيح القرار السريري.</li>
                </ul>
            </section>

            <GoogleAd />
        </main>
    );
};

export default GuidesHub;
