import React from 'react';
import { LocaleLink as Link } from '../../i18n';
import Spinner from '../common/Spinner.jsx';
import { useCopy, useLang } from '../../i18n';
import publicQuestionsCopy from '../../i18n/copy/publicQuestions.js';
import SEO from '../common/SEO.jsx';
import { completeSeo, hubSeo } from '../../seo/publicQuestions.js';
import usePublicQuestions from './usePublicQuestions.js';
import { Breadcrumb, SignupCta, PublicQuestionsError } from './PublicQuestionsShared.jsx';
import FaqBlock from './FaqBlock.jsx';
import './PublicQuestions.css';

/** /questions — the library hub, one card per specialty. */
const QuestionsHub = () => {
    const t = useCopy(publicQuestionsCopy);
    const { dir, lang } = useLang();
    const { index, loading, error } = usePublicQuestions();

    if (loading) return <div className="pq-loading"><Spinner /></div>;
    if (error || !index) return <PublicQuestionsError t={t} />;

    return (
        <main className="pq-page" dir={dir}>
            {/* Overrides the generic placeholder RouteSEO applied for /questions.
                Same builder the prerendered HTML uses, so the two agree. */}
            <SEO {...completeSeo(hubSeo(index, lang), lang)} />
            <Breadcrumb t={t} />

            <header className="pq-hero">
                <p className="pq-kicker">{t.hub.kicker}</p>
                <h1>{t.hub.title}</h1>
                <p>{t.hub.intro(index.total)}</p>
            </header>

            {index.tracks.map((track) => (
                <section key={track.key} className="pq-track">
                    <h2>{t.hub.tracks[track.key] || track.key}</h2>
                    <div className="pq-specialty-grid">
                        {track.specialties.map((specialty) => (
                            <Link key={specialty.slug} className="pq-specialty-card" to={specialty.path}>
                                <span className="pq-specialty-name">
                                    {lang === 'en' ? specialty.labelEn : specialty.labelAr}
                                </span>
                                {lang !== 'en' && (
                                    <span className="pq-specialty-en">{specialty.labelEn}</span>
                                )}
                                <span className="pq-specialty-count">
                                    {t.hub.countLabel(specialty.questions.length)}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}

            <SignupCta t={t} />

            <FaqBlock title={t.faqTitle} items={t.faq(index.total, index.bankTotal || index.total)} />
        </main>
    );
};

export default QuestionsHub;
