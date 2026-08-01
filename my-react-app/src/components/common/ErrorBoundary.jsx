import React from 'react';
import { useRouteError, useNavigate, Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { reportRenderError } from '../../utils/errorTracking';
import { isStaleChunkError, reloadOnceForStaleChunk } from '../../utils/staleChunkReload';
import { useCommon, useLang } from '../../i18n';
import './ErrorScreens.css';

/**
 * The `errorElement` for every route: what a visitor sees when a route's
 * component throws or its chunk fails to load.
 *
 * Not used as a route `element` — with no router error there is nothing to
 * show, and returning null there is what used to make unknown URLs render a
 * blank page. Unmatched paths are handled by NotFound.jsx instead.
 */
const RouteErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const t = useCommon();
    const { dir } = useLang();

    // Stale chunk after a deploy: reload once to pick up the new asset hashes
    // instead of showing the error card. Only report when the reload cooldown
    // says this is a persistent failure, not a routine post-deploy blip.
    const staleChunk = !!error && isStaleChunkError(error?.message);
    const [reloading] = React.useState(() => staleChunk && reloadOnceForStaleChunk());

    React.useEffect(() => {
        if (error && !reloading) {
            console.error('Routing error:', error);
            reportRenderError(
                error instanceof Error ? error : new Error(String(error)),
                { componentStack: 'RouteErrorBoundary' }
            );
        }
    }, [error, reloading]);

    if (reloading) {
        return (
            <div className="errscreen" dir={dir}>
                <div className="errscreen-card">
                    <h1>{t.errors.updatingTitle}</h1>
                    <p>{t.errors.updatingBody}</p>
                </div>
            </div>
        );
    }

    const notFound = error?.status === 404;

    return (
        <div className="errscreen" dir={dir}>
            <div className="errscreen-card">
                <span className="errscreen-icon" aria-hidden="true">
                    <Icon name="alert-triangle" size={30} />
                </span>
                <h1>{notFound ? t.errors.notFoundTitle : t.errors.unexpectedTitle}</h1>
                <p>{notFound ? t.errors.notFoundShort : t.errors.unexpectedBody}</p>
                <div className="errscreen-actions">
                    <button
                        type="button"
                        className="errscreen-btn errscreen-btn--primary"
                        onClick={() => navigate('/')}
                    >
                        <Icon name="home" size={17} /> {t.actions.backHome}
                    </button>
                    <button
                        type="button"
                        className="errscreen-btn errscreen-btn--ghost"
                        onClick={() => window.location.reload()}
                    >
                        <Icon name="refresh" size={17} /> {t.actions.reload}
                    </button>
                </div>
                <nav className="errscreen-links" aria-label={t.actions.quickLinks}>
                    <Link to="/quizs">{t.nav.account}</Link>
                    <Link to="/faq">{t.nav.faq}</Link>
                    <Link to="/contact">{t.nav.contact}</Link>
                </nav>
            </div>
        </div>
    );
};

export default RouteErrorBoundary;
