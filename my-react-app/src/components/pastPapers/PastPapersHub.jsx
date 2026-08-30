import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';
import SEO from '../common/SEO.jsx';
import { useCopy, useLang } from '../../i18n';
import pastPapersCopy from '../../i18n/copy/pastPapers.js';
import publicQuestionsCopy from '../../i18n/copy/publicQuestions.js';
import usePublicQuestions from '../questions/usePublicQuestions.js';
import { SignupCta } from '../questions/PublicQuestionsShared.jsx';
import {
    HONESTY_NOTE_AR,
    HONESTY_NOTE_EN,
    buildCollections,
    completePastPaperSeo,
    pastPapersHubSeo,
} from '../../seo/pastPapers.js';
import { QUESTIONS_ROOT } from '../../seo/publicQuestions.js';
import '../questions/PublicQuestions.css';

/** /past-papers — what each collection in the bank is, and how big it is. */
const PastPapersHub = () => {
    const t = useCopy(pastPapersCopy);
    const questionsT = useCopy(publicQuestionsCopy);
    const { dir, lang } = useLang();
    const { index: rawIndex, loading, error, payload } = usePublicQuestions();

    if (loading) return <div className="pq-loading"><Spinner /></div>;
    if (error || !rawIndex || !payload) {
        return (
            <main className="pq-page" dir={dir}>
                <header className="pq-hero">
                    <h1>{t.notFound.title}</h1>
                    <p>{t.notFound.body}</p>
                </header>
            </main>
        );
    }

    const data = buildCollections(payload);

    return (
        <main className="pq-page" dir={dir}>
            <SEO {...completePastPaperSeo(pastPapersHubSeo(data))} />

            <nav className="pq-breadcrumb" aria-label={t.breadcrumbRoot}>
                <Link to="/">{t.breadcrumbHome}</Link>
            </nav>

            <header className="pq-hero">
                <p className="pq-kicker">{t.hub.kicker}</p>
                <h1>{t.hub.title}</h1>
                <p>{t.hub.intro(data.bankTotal, data.collections.length)}</p>
                {/* Stated up front rather than in a footnote: SCFHS and Prometric
                    do not publish past papers, and the heading uses the phrase
                    people search for. */}
                <p className="pq-note">{lang === 'en' ? HONESTY_NOTE_EN : HONESTY_NOTE_AR}</p>
            </header>

            {data.tracks.map((track) => (
                <section key={track.key} className="pq-track">
                    <h2>{t.hub.tracks[track.key] || track.key}</h2>
                    <div className="pq-specialty-grid">
                        {track.collections.map((collection) => (
                            <Link key={collection.slug} className="pq-specialty-card" to={collection.path}>
                                <span className="pq-specialty-name">
                                    {lang === 'en' ? collection.labelEn : collection.labelAr}
                                </span>
                                <span className="pq-specialty-en">
                                    {lang === 'en' ? collection.blurbEn : collection.blurbAr}
                                </span>
                                <span className="pq-specialty-count">
                                    {t.hub.countLabel(collection.total)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}

            <SignupCta t={questionsT} />

            <nav className="pq-siblings" aria-label={t.links.allQuestions}>
                <div className="pq-sibling-links">
                    <Link to={QUESTIONS_ROOT}>{t.links.allQuestions}</Link>
                    <Link to="/guides">{t.links.guides}</Link>
                </div>
            </nav>
        </main>
    );
};

export default PastPapersHub;
