import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LocaleLink as Link } from '../../i18n';
import Spinner from '../common/Spinner.jsx';
import { useCopy, useLang } from '../../i18n';
import publicQuestionsCopy from '../../i18n/copy/publicQuestions.js';
import SEO from '../common/SEO.jsx';
import { completeSeo, questionPath, questionSeo, relatedQuestions, specialtyPath, stemBody } from '../../seo/publicQuestions.js';
import usePublicQuestions from './usePublicQuestions.js';
import { Breadcrumb, SignupCta, PublicQuestionsError } from './PublicQuestionsShared.jsx';
import './PublicQuestions.css';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * /questions/:specialty/:slug — one published question.
 *
 * The correct option is marked from first paint, and the explanation is always
 * visible. Two reasons, and they are the same reason: the prerendered HTML
 * (src/seo/publicQuestions.js) renders it that way, and a page that shows a
 * crawler more than it shows a reader is cloaking. Picking an option adds your
 * own answer on top of that — it is self-testing, not a gate.
 */
const QuestionPage = () => {
    const { slug } = useParams();
    const t = useCopy(publicQuestionsCopy);
    const { dir, lang } = useLang();
    const { index, loading, error } = usePublicQuestions();
    const [picked, setPicked] = useState(null);

    if (loading) return <div className="pq-loading"><Spinner /></div>;
    if (error || !index) return <PublicQuestionsError t={t} />;

    const question = index.byQuestionSlug.get(slug);
    if (!question) return <PublicQuestionsError t={t} />;

    const related = relatedQuestions(index, question);

    return (
        <main className="pq-page" dir={dir}>
            <SEO {...completeSeo(questionSeo(question, lang), lang)} />
            <Breadcrumb
                t={t}
                trail={[{ to: specialtyPath(question.specialty), label: question.specialtyLabelAr }]}
            />

            {/* The clinical content is English in both site languages, exactly as
                it is inside the app — so this block pins its own lang/dir rather
                than inheriting the site's. */}
            <article className="pq-question" lang="en" dir="ltr">
                <p className="pq-kicker">{question.specialtyLabelEn}</p>
                <h1>{question.headline}</h1>
                <p className="pq-stem">{stemBody(question)}</p>

                <p className="pq-hint" lang={dir === 'rtl' ? 'ar' : 'en'} dir={dir}>
                    {t.question.tryFirst}
                </p>

                <ol className="pq-options">
                    {question.options.map((option, i) => {
                        const isCorrect = i === question.correctIndex;
                        const isPicked = picked === i;
                        const classes = [
                            'pq-option',
                            isCorrect ? 'is-correct' : '',
                            isPicked && !isCorrect ? 'is-wrong' : '',
                        ].filter(Boolean).join(' ');

                        return (
                            <li key={i} className={classes}>
                                <button
                                    type="button"
                                    onClick={() => setPicked(i)}
                                    aria-pressed={isPicked}
                                >
                                    <span className="pq-letter">{OPTION_LETTERS[i]}</span>
                                    <span className="pq-option-text">{option}</span>
                                    {isCorrect && (
                                        <span className="pq-correct-tag">{t.question.answerLabel}</span>
                                    )}
                                    {isPicked && !isCorrect && (
                                        <span className="pq-your-tag">{t.question.yourAnswer}</span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <section className="pq-explanation">
                    <h2>{t.question.explanationTitle}</h2>
                    <p>{question.explanation}</p>
                </section>
            </article>

            <SignupCta t={t} />

            {related.length > 0 && (
                <nav className="pq-related" aria-label={t.question.relatedTitle(question.specialtyLabelAr)}>
                    <h2>{t.question.relatedTitle(question.specialtyLabelAr)}</h2>
                    <ul>
                        {related.map((q) => (
                            <li key={q.slug}>
                                <Link to={questionPath(q)}>{q.headline}</Link>
                            </li>
                        ))}
                    </ul>
                    <p>
                        <Link to={specialtyPath(question.specialty)}>
                            {t.question.allInSpecialty(question.specialtyLabelAr)}
                        </Link>
                    </p>
                </nav>
            )}
        </main>
    );
};

export default QuestionPage;
