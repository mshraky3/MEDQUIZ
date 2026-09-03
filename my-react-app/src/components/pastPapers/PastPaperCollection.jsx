import React from 'react';
import { useParams } from 'react-router-dom';
import { LocaleLink as Link } from '../../i18n';
import Spinner from '../common/Spinner.jsx';
import SEO from '../common/SEO.jsx';
import { useCopy, useLang } from '../../i18n';
import pastPapersCopy from '../../i18n/copy/pastPapers.js';
import publicQuestionsCopy from '../../i18n/copy/publicQuestions.js';
import usePublicQuestions from '../questions/usePublicQuestions.js';
import { SignupCta } from '../questions/PublicQuestionsShared.jsx';
import FaqBlock from '../questions/FaqBlock.jsx';
import {
    HONESTY_NOTE_AR,
    HONESTY_NOTE_EN,
    PAST_PAPERS_ROOT,
    buildCollections,
    collectionSeo,
    completePastPaperSeo,
} from '../../seo/pastPapers.js';
import { questionPath } from '../../seo/publicQuestions.js';
import '../questions/PublicQuestions.css';

/** /past-papers/:slug — one collection: what it holds, and open samples from it. */
const PastPaperCollection = () => {
    const { slug } = useParams();
    const t = useCopy(pastPapersCopy);
    const questionsT = useCopy(publicQuestionsCopy);
    const { dir, lang } = useLang();
    const { index, loading, error, payload } = usePublicQuestions();

    if (loading) return <div className="pq-loading"><Spinner /></div>;

    const data = index && payload ? buildCollections(payload) : null;
    const collection = data?.bySlug.get(slug);

    if (error || !collection) {
        return (
            <main className="pq-page" dir={dir}>
                <header className="pq-hero">
                    <h1>{t.notFound.title}</h1>
                    <p>{t.notFound.body}</p>
                </header>
                <p><Link className="pq-cta-btn" to={PAST_PAPERS_ROOT}>{t.notFound.back}</Link></p>
            </main>
        );
    }

    const isEn = lang === 'en';
    const trackLabel = collection.track === 'medical' ? 'SMLE' : 'SNLE';

    return (
        <main className="pq-page" dir={dir}>
            <SEO {...completePastPaperSeo(collectionSeo(collection, lang), lang)} />

            <nav className="pq-breadcrumb" aria-label={t.breadcrumbRoot}>
                <Link to="/">{t.breadcrumbHome}</Link>
                <Link to={PAST_PAPERS_ROOT}>{t.breadcrumbRoot}</Link>
            </nav>

            <header className="pq-hero">
                <p className="pq-kicker">{collection.labelEn}</p>
                <h1>{isEn ? collection.labelEn : collection.labelAr}</h1>
                <p>
                    {t.collection.intro(
                        isEn ? collection.blurbEn : collection.blurbAr,
                        collection.total,
                        trackLabel
                    )}
                </p>
                <p className="pq-note">{isEn ? HONESTY_NOTE_EN : HONESTY_NOTE_AR}</p>
            </header>

            {collection.specialties.length > 0 && (
                <section>
                    <h2>{t.collection.specialtiesTitle}</h2>
                    <ul className="pq-list">
                        {collection.specialties.map((specialty) => (
                            <li key={specialty.key}>
                                <Link to={specialty.path}>
                                    {isEn ? specialty.labelEn : specialty.labelAr}
                                </Link>
                                {' — '}
                                {t.collection.openCount(specialty.count)}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {collection.samples.length > 0 && (
                <section>
                    <h2>{t.collection.samplesTitle}</h2>
                    <ol className="pq-list">
                        {/* Capped at 30 to match the prerendered page — a collection
                            with 118 published questions would otherwise be a wall of
                            links, and the specialty indexes above already cover it. */}
                        {collection.samples.slice(0, 30).map((question) => (
                            <li key={question.slug}>
                                <Link to={questionPath(question)}>{question.headline}</Link>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            <SignupCta t={questionsT} />

            <FaqBlock title={t.faqTitle} items={t.faq(collection.bankTotal, collection.collectionCount)} />

            {data.collections.length > 1 && (
                <nav className="pq-siblings" aria-label={t.collection.siblingsTitle}>
                    <h2>{t.collection.siblingsTitle}</h2>
                    <div className="pq-sibling-links">
                        {data.collections
                            .filter((c) => c.slug !== collection.slug)
                            .map((c) => (
                                <Link key={c.slug} to={c.path}>
                                    {isEn ? c.labelEn : c.labelAr}
                                </Link>
                            ))}
                    </div>
                </nav>
            )}
        </main>
    );
};

export default PastPaperCollection;
