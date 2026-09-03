import React from 'react';
import { useLocation } from 'react-router-dom';
import GuideArticle from '../guides/GuideArticle.jsx';
import SEO from '../common/SEO.jsx';
import { LocaleLink as Link, useLang } from '../../i18n';
import { stripLocale } from '../../seo/locales.js';
import { examSeo, resolveExamRoute } from '../../seo/examGuides.js';
import '../guides/Guides.css';
import './Exams.css';

/**
 * Every page under /exams, from one component.
 *
 * Thirteen routes share one renderer because they share one shape: a title, an
 * intro, and a list of sections in the same block language the study guides
 * use. Thirteen near-identical components would have been thirteen places for
 * the citation footer to drift.
 *
 * The copy and the metadata both come from seo/examGuides.js — the same module
 * the build-time prerender calls — so the page a crawler is served and the page
 * React renders are generated from one source rather than kept in step by hand.
 *
 * SEO is rendered here rather than left to RouteSEO, which only knows the
 * generic /exams placeholder. Same arrangement as QuestionsHub: the placeholder
 * keeps the document sane before this mounts, and this replaces it.
 */
const ExamPage = () => {
    const { lang, dir } = useLang();
    const { pathname } = useLocation();
    const { path } = stripLocale(pathname);

    const resolved = resolveExamRoute(path, lang);

    // An /exams URL that resolves to nothing is a typo in a link, not a page.
    // Render nothing rather than an empty article; the route only exists for
    // paths examRoutePaths() produced, so this is a guard, not a 404 screen.
    if (!resolved) return null;

    const seo = examSeo(path, lang);
    const { page, cards } = resolved;
    const siblings = cards.filter((card) => card.path !== path);
    const relatedLabel = lang === 'en' ? 'More about the exams' : 'صفحات أخرى عن الاختبار';

    return (
        <main className="exams-page" dir={dir}>
            <SEO {...seo} />
            <GuideArticle guide={page} />

            {siblings.length > 0 && (
                <nav className="exams-related" aria-label={relatedLabel}>
                    <h2>{relatedLabel}</h2>
                    <ul>
                        {siblings.map((card) => (
                            <li key={card.path}>
                                <Link to={card.path}>{card.title}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </main>
    );
};

export default ExamPage;
