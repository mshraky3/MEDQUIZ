import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo"><Icon name="book-open" size={20} /> SMLE Question Bank</span>
          <p className="footer-tagline">Your comprehensive SMLE preparation platform</p>
          <p className="footer-tagline-ar">منصتك الشاملة للتحضير لاختبار الهيئة والبرومترك</p>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>Platform | المنصة</h4>
            <Link to="/login">Login | تسجيل الدخول</Link>
            <Link to="/signup">Sign Up | إنشاء حساب</Link>
            <Link to="/contact">Contact Us | اتصل بنا</Link>
          </div>

          <div className="footer-section">
            <h4>Information | معلومات</h4>
            <Link to="/about">About Us | من نحن</Link>
            <Link to="/faq">FAQ | الأسئلة الشائعة</Link>
            <Link to="/suggestions">Suggestions | الاقتراحات</Link>
          </div>

          <div className="footer-section">
            <h4>Legal | قانوني</h4>
            <Link to="/terms">Terms of Service | الشروط</Link>
            <Link to="/refund-policy">Refund Policy | سياسة الاسترداد</Link>
            <Link to="/privacy">Privacy Policy | الخصوصية</Link>
            <Link to="/contact">Contact Us | اتصل بنا</Link>
          </div>

          <div className="footer-section footer-contact-section">
            <h4>Contact | تواصل</h4>
            <p className="footer-contact-line" dir="rtl">
              <span>البريد الإلكتروني | Email:</span>
              <a href="mailto:alshraky3@gmail.com" dir="ltr">alshraky3@gmail.com</a>
            </p>
            <p className="footer-contact-line" dir="rtl">
              <span>واتساب | WhatsApp:</span>
              <a href="https://wa.me/966582619119" target="_blank" rel="noopener noreferrer" dir="ltr">0582619119</a>
            </p>
            <p className="footer-contact-line" dir="rtl">
              <span>صفحة الاتصال | Contact Page:</span>
              <Link to="/contact">اتصل بنا</Link>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} SMLE Question Bank (SQB). All rights reserved. جميع الحقوق محفوظة</p>
          <p className="footer-legal-entity" dir="rtl">
            شركة دار الخبرة التجارية &nbsp;|&nbsp; السجل التجاري (الرقم الموحد): 7040567922
          </p>
          <p className="footer-disclaimer">
            This platform is for educational purposes only. Not affiliated with Prometric or SCFHS.
          </p>
          <p className="footer-disclaimer">
            هذه المنصة للأغراض التعليمية فقط. غير تابعة للهيئة السعودية للتخصصات الصحية أو Prometric.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 