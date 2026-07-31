import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import './ErrorScreens.css';

/**
 * The catch-all route.
 *
 * This used to be `<ErrorBoundary />`, which is a *route error* element: with no
 * router error to read it returned null, so every mistyped or dead URL rendered
 * a blank white page. A 404 is a normal thing for a visitor to hit (an old
 * shared link, a typo, a stale search result) and it needs to route them back
 * into the site rather than dead-end them.
 */
const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="errscreen" dir="rtl">
            <div className="errscreen-card">
                <span className="errscreen-code" aria-hidden="true">404</span>
                <h1>الصفحة غير موجودة</h1>
                <p>
                    الرابط الذي فتحته غير صحيح أو لم يعد متاحاً.
                    يمكنك العودة للرئيسية أو الانتقال مباشرة إلى ما تبحث عنه.
                </p>
                <div className="errscreen-actions">
                    <Link to="/" className="errscreen-btn errscreen-btn--primary">
                        <Icon name="home" size={17} /> العودة للرئيسية
                    </Link>
                    <button
                        type="button"
                        className="errscreen-btn errscreen-btn--ghost"
                        onClick={() => navigate(-1)}
                    >
                        <Icon name="chevron-right" size={17} /> رجوع
                    </button>
                </div>
                <nav className="errscreen-links" aria-label="روابط سريعة">
                    <Link to="/quizs">حسابي</Link>
                    <Link to="/signup">إنشاء حساب</Link>
                    <Link to="/login">تسجيل الدخول</Link>
                    <Link to="/guides">أدلة التحضير</Link>
                    <Link to="/faq">الأسئلة الشائعة</Link>
                    <Link to="/contact">تواصل معنا</Link>
                </nav>
            </div>
        </div>
    );
};

export default NotFound;
