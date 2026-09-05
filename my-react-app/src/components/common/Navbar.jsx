import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import Icon from './Icon.jsx';
import NotificationBell from './NotificationBell.jsx';
import apiClient from '../../utils/apiClient.js';
import { useCommon, useLang, LanguageToggle, LocaleLink as Link, useLocaleNavigate, formatDate } from '../../i18n';
import { stripLocale } from '../../seo/locales.js';
import './Navbar.css';

const Navbar = () => {
  const { user, sessionToken, logout } = useContext(UserContext);
  const t = useCommon();
  const { lang, dir } = useLang();
  const navigate = useLocaleNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);
  const userMenuRef = useRef(null);

  // Close the user dropdown on an outside click, on Escape, or when the
  // route changes — otherwise it stays open floating over the new page.
  useEffect(() => {
    if (!userMenuOpen) return;
    const handlePointerDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    const handleKeyDown = (e) => { if (e.key === 'Escape') setUserMenuOpen(false); };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMenuOpen]);

  useEffect(() => { setUserMenuOpen(false); }, [location.pathname]);

  // A visitor is only "home" inside the app once they hold a valid session.
  const isAuthenticated = !!(user && user.id && sessionToken);

  // "My group" only means something for someone who owns a group (there are
  // seat links to manage) — a solo subscriber or a group seat-holder would
  // land on /groups' own buy pitch, which reads as broken from a menu item
  // named "my group". Fetched once per session, same endpoint AccountPage
  // already uses to answer the same question.
  useEffect(() => {
    if (!isAuthenticated) { setHasGroup(false); return; }
    let cancelled = false;
    apiClient.get('/api/groups/mine')
      .then(({ data }) => { if (!cancelled) setHasGroup(Boolean(data?.groups?.length)); })
      .catch(() => { /* advisory only — the link just stays hidden */ });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Authenticated users' "home" is the quizzes dashboard; everyone else's is
  // the public landing page. This is the single source of truth so the brand,
  // the Home link, and the back button can never send a logged-out visitor
  // into a protected route.
  const homePath = isAuthenticated ? '/quizs' : '/';

  const handleGoBack = () => {
    // Compared language-neutrally: /en is the same page as /.
    const here = stripLocale(location.pathname).path;
    if (here === '/quizs' || here === '/') {
      navigate(homePath);
    } else {
      navigate(homePath, user && user.id ? { state: { id: user.id } } : undefined);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar" dir={dir}>
      <div className="navbar-right">
        <Link to={homePath} className="navbar-brand">SQB</Link>
        {user && user.username && (
          <div className={`user-menu${userMenuOpen ? ' user-menu-open' : ''}`} ref={userMenuRef}>
            <button
              type="button"
              className="user-info user-menu-trigger"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
            >
              <svg className="user-icon" width="22" height="22" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" fill="#2563eb" opacity="0.18" />
                <circle cx="12" cy="8" r="2.5" fill="#2563eb" />
                <ellipse cx="12" cy="17" rx="6.5" ry="4.5" fill="#2563eb" opacity="0.18" />
              </svg>
              <span className="user-name">{user.username}</span>
              {isAuthenticated && (
                <svg className="user-menu-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </button>
            {isAuthenticated && userMenuOpen && (
              <div className="user-menu-dropdown" role="menu">
                <span className="user-menu-email">{user.username}</span>
                {user.subscription_status === 'active' && user.subscription_expiry_date && (
                  <span className="sub-badge" title={t.nav.subscriptionExpiryTitle}>
                    {t.nav.subscriptionUntil(formatDate(user.subscription_expiry_date, lang))}
                  </span>
                )}
                {/* The only entry points to the account and group pages.
                    Both live here rather than in the main nav, which is about
                    studying — but they must exist somewhere, or a group buyer
                    has no way back to the invite links they paid for. */}
                <Link to="/account" className="user-menu-link" role="menuitem">
                  <Icon name="user" size={17} />
                  <span>{t.nav.account}</span>
                </Link>
                {hasGroup && (
                  <Link to="/groups" className="user-menu-link" role="menuitem">
                    <Icon name="users" size={17} />
                    <span>{t.nav.myGroup}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="logout-button"
                  role="menuitem"
                >
                  <Icon name="log-out" size={17} />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signed in, this bar is chrome and nothing else: identity, language,
          notifications, back. Every destination in the product is reachable
          from the dashboard, which is the screen built to do that job — a
          second, permanently-visible copy of the same links only ever
          competed with it. Signed out there is no dashboard, so the marketing
          nav stays. The empty div is deliberate: .navbar is a three-column
          grid, and dropping the middle child moves navbar-left into it. */}
      <div className="navbar-center">
        {!isAuthenticated && (
          <div className={`navbar-nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
            <Link to="/guides" className="nav-link" onClick={() => setMenuOpen(false)}>{t.nav.guides}</Link>
            <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>{t.nav.about}</Link>
            <Link to="/faq" className="nav-link" onClick={() => setMenuOpen(false)}>{t.nav.faq}</Link>
            <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>{t.nav.contact}</Link>
          </div>
        )}
      </div>

      <div className="navbar-left">
        {isAuthenticated && <NotificationBell />}
        <LanguageToggle className="navbar-lang-toggle" />
        {/* Nothing to open when the nav links are gone. */}
        <button
          className={`navbar-hamburger${isAuthenticated ? ' is-hidden' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t.nav.menu}
        >
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
          <span className={`hamburger-line ${menuOpen ? 'line-open' : ''}`}></span>
        </button>
        <button onClick={handleGoBack} className="back-button" aria-label={t.nav.back}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 