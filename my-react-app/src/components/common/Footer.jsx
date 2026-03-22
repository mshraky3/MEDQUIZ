import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">📚 SMLE Question Bank</span>
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
            <Link to="/privacy">Privacy Policy | الخصوصية</Link>
            <Link to="/terms">Terms of Service | الشروط</Link>
          </div>

          <div className="footer-section">
            <h4>Resources | موارد</h4>
            <a href="mailto:alshraky3@gmail.com">Support | الدعم</a>
            <a href="https://wa.link/gqafib" target="_blank" rel="noopener noreferrer">WhatsApp | واتساب</a>
            <span className="footer-info">8,000+ Questions | أسئلة</span>
            <span className="footer-info">40+ Topics | تخصص</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} SMLE Question Bank (SQB). All rights reserved. جميع الحقوق محفوظة</p>
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