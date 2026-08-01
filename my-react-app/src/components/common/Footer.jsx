import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useCommon, useLang, LanguageToggle } from '../../i18n';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useCommon();
  const { dir } = useLang();

  return (
    <footer className="footer" dir={dir}>
      <div className="footer-content">
        <div className="footer-brand">
          {/* The product name stays "SMLE Question Bank" in both languages — it
              is the brand, and the exam it names has an English name. */}
          <span className="footer-logo"><Icon name="book-open" size={20} /> SMLE Question Bank</span>
          <p className="footer-tagline">{t.footer.tagline}</p>
          <LanguageToggle className="footer-lang-toggle" />
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h4>{t.footer.platform}</h4>
            <Link to="/login">{t.nav.login}</Link>
            <Link to="/signup">{t.nav.signup}</Link>
            <Link to="/contact">{t.footer.contactUs}</Link>
          </div>

          <div className="footer-section">
            <h4>{t.footer.information}</h4>
            <Link to="/about">{t.nav.about}</Link>
            <Link to="/faq">{t.nav.faq}</Link>
            <Link to="/suggestions">{t.footer.suggestions}</Link>
          </div>

          <div className="footer-section">
            <h4>{t.footer.legal}</h4>
            <Link to="/terms">{t.footer.terms}</Link>
            <Link to="/refund-policy">{t.footer.refund}</Link>
            <Link to="/privacy">{t.footer.privacy}</Link>
          </div>

          <div className="footer-section footer-contact-section">
            <h4>{t.footer.contactHeading}</h4>
            {/* The address and phone keep dir="ltr" so their digits and
                punctuation never reorder inside Arabic text. */}
            <p className="footer-contact-line">
              <span>{t.footer.email}:</span>
              <a href="mailto:alshraky3@gmail.com" dir="ltr">alshraky3@gmail.com</a>
            </p>
            <p className="footer-contact-line">
              <span>{t.footer.whatsapp}:</span>
              <a href="https://wa.me/966582619119" target="_blank" rel="noopener noreferrer" dir="ltr">0582619119</a>
            </p>
            <p className="footer-contact-line">
              <span>{t.footer.contactPage}:</span>
              <Link to="/contact">{t.footer.contactUs}</Link>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.footer.rights(currentYear)}</p>
          <p className="footer-legal-entity">{t.footer.legalEntity}</p>
          <p className="footer-disclaimer">{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
