import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useCommon, useLang, LanguageToggle } from '../../i18n';
import './Footer.css';

/**
 * Compact, mobile-first footer.
 *
 * It used to be four stacked columns with a heading over each — which on a
 * phone became a ~700px column of headings and single-item lists that nobody
 * scrolls to the bottom of. There are only eleven links here; eleven links do
 * not need four headings. They are now one wrapping row, with contact reduced
 * to three icon buttons and the legal text to two lines.
 *
 * /guides is included deliberately: the landing page's "Essential links" card
 * was removed, and this is now the only internal link to it — dropping both
 * would strand a whole content section with no path in.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useCommon();
  const { dir } = useLang();

  const links = [
    { to: '/about', label: t.nav.about },
    { to: '/guides', label: t.nav.guides },
    { to: '/faq', label: t.nav.faq },
    { to: '/suggestions', label: t.footer.suggestions },
    { to: '/contact', label: t.footer.contactUs },
    { to: '/login', label: t.nav.login },
    { to: '/signup', label: t.nav.signup },
    { to: '/terms', label: t.footer.terms },
    { to: '/refund-policy', label: t.footer.refund },
    { to: '/privacy', label: t.footer.privacy },
  ];

  return (
    <footer className="footer" dir={dir}>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            {/* The product name stays "SMLE Question Bank" in both languages —
                it is the brand, and the exam it names has an English name. */}
            <span className="footer-logo"><Icon name="book-open" size={17} /> SMLE Question Bank</span>
            <p className="footer-tagline">{t.footer.tagline}</p>
          </div>

          <div className="footer-reach">
            {/* Three icon buttons instead of three label/value rows. The
                accessible name carries the channel; the href carries the
                value, so nothing is lost by dropping the visible text. */}
            <a
              className="footer-icon-btn"
              href="mailto:alshraky3@gmail.com"
              aria-label={`${t.footer.email}: alshraky3@gmail.com`}
              title="alshraky3@gmail.com"
            >
              <Icon name="mail" size={17} />
            </a>
            <a
              className="footer-icon-btn"
              href="https://wa.me/966582619119"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t.footer.whatsapp}: 0582619119`}
              title="0582619119"
            >
              <Icon name="phone" size={17} />
            </a>
            <Link className="footer-icon-btn" to="/contact" aria-label={t.footer.contactPage}>
              <Icon name="message-circle" size={17} />
            </Link>
            <LanguageToggle compact className="footer-lang-toggle" />
          </div>
        </div>

        <nav className="footer-nav" aria-label={t.footer.platform}>
          {links.map((link) => (
            <Link key={link.to} to={link.to}>{link.label}</Link>
          ))}
        </nav>

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
