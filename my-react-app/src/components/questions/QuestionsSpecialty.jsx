import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';
import { useCopy, useLang } from '../../i18n';
import publicQuestionsCopy from '../../i18n/copy/publicQuestions.js';
import SEO from '../common/SEO.jsx';
import { completeSeo, questionPath, specialtySeo } from '../../seo/publicQuestions.js';
import usePublicQuestions from './usePublicQuestions.js';
import { Breadcrumb, SignupCta, PublicQuestionsError } from './PublicQuestionsShared.jsx';
import './PublicQuestions.css';

/** /questions/:specialty — every published question in one specialty. */
const QuestionsSpecialty = () => {
    const { specialty: specialtyParam } = useParams();
    const t = useCopy(publicQuestionsCopy);
    const { dir } = useLang();
    const { index, loading, error } = usePublicQuestions();

    if (loading) return <div className="pq-loading"><Spinner /></div>;
    if (error || !index) return <PublicQuestionsError t={t} />;

    const group = index.bySpecialtySlug.get(specialtyParam);
    if (!group) return <PublicQuestionsError t={t} />;

    const siblings = index.specialties.filter((s) => s.slug !== group.slug);

    return (
        <main className="pq-page" dir={dir}>
            <SEO {...completeSeo(specialtySeo(group))} />
            <Breadcrumb t={t} />

            <header className="pq-hero">
                <p className="pq-kicker">{group.labelEn}</p>
                <h1>{t.specialty.title(group.labelAr)}</h1>
                <p>{t.specialty.intro(group.questions.length, group.labelAr)}</p>
            </header>

            <section>
                <h2>{t.specialty.listTitle}</h2>
                <ol className="pq-list">
                    {group.questions.map((question) => (
                        <li key={question.slug}>
                            <Link to={questionPath(question)}>{question.headline}</Link>
                        </li>
                    ))}
                </ol>
            </section>

            <SignupCta t={t} />

            {siblings.length > 0 && (
                <nav className="pq-siblings" aria-label={t.specialty.siblingsTitle}>
                    <h2>{t.specialty.siblingsTitle}</h2>
                    <div className="pq-sibling-links">
                        {siblings.map((s) => (
                            <Link key={s.slug} to={s.path}>{s.labelAr}</Link>
                        ))}
                    </div>
                </nav>
            )}
        </main>
    );
};

export default QuestionsSpecialty;
