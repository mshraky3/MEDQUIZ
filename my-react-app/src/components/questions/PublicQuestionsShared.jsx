import React from 'react';
import { LocaleLink as Link } from '../../i18n';
import { QUESTIONS_ROOT } from '../../seo/publicQuestions.js';

/**
 * Pieces shared by the three public-question routes.
 *
 * These pages are the only ones on the site a stranger can read in full with
 * no account, so every one of them carries the same breadcrumb (for crawlers
 * and for orientation) and the same signup CTA (because a visitor who reads a
 * whole explanation is the warmest traffic this site gets).
 */

export const Breadcrumb = ({ t, trail = [] }) => (
    <nav className="pq-breadcrumb" aria-label={t.breadcrumbRoot}>
        <Link to="/">{t.breadcrumbHome}</Link>
        <Link to={QUESTIONS_ROOT}>{t.breadcrumbRoot}</Link>
        {trail.map((item) => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
        ))}
    </nav>
);

export const SignupCta = ({ t }) => (
    <section className="pq-cta">
        <h2>{t.cta.title}</h2>
        <p>{t.cta.body}</p>
        <Link className="pq-cta-btn" to="/signup">{t.cta.button}</Link>
        <p className="pq-cta-note">{t.cta.note}</p>
    </section>
);

export const PublicQuestionsError = ({ t }) => (
    <main className="pq-page">
        <header className="pq-hero">
            <h1>{t.notFound.title}</h1>
            <p>{t.notFound.body}</p>
        </header>
        <p><Link className="pq-cta-btn" to={QUESTIONS_ROOT}>{t.notFound.back}</Link></p>
    </main>
);
