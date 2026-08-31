import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LocaleLink as Link } from '../../i18n';
import Icon from './Icon.jsx';
import { useCommon, useLang } from '../../i18n';
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
    const t = useCommon();
    const { dir } = useLang();

    return (
        <div className="errscreen" dir={dir}>
            <div className="errscreen-card">
                <span className="errscreen-code" aria-hidden="true">404</span>
                <h1>{t.errors.notFoundTitle}</h1>
                <p>{t.errors.notFoundBody}</p>
                <div className="errscreen-actions">
                    <Link to="/" className="errscreen-btn errscreen-btn--primary">
                        <Icon name="home" size={17} /> {t.actions.backHome}
                    </Link>
                    <button
                        type="button"
                        className="errscreen-btn errscreen-btn--ghost"
                        onClick={() => navigate(-1)}
                    >
                        {/* "Back" points toward where the page came from, which
                            is the start edge — it flips with the language. */}
                        <Icon name={dir === 'rtl' ? 'chevron-right' : 'chevron-left'} size={17} /> {t.nav.back}
                    </button>
                </div>
                <nav className="errscreen-links" aria-label={t.actions.quickLinks}>
                    <Link to="/quizs">{t.nav.account}</Link>
                    <Link to="/signup">{t.nav.signup}</Link>
                    <Link to="/login">{t.nav.login}</Link>
                    <Link to="/guides">{t.nav.guides}</Link>
                    <Link to="/faq">{t.nav.faq}</Link>
                    <Link to="/contact">{t.nav.contact}</Link>
                </nav>
            </div>
        </div>
    );
};

export default NotFound;
