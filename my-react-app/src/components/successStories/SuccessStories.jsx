import React from 'react';
import SEO from '../common/SEO.jsx';
import { useCopy, useLang, LocaleLink as Link } from '../../i18n';
import successStoriesCopy from '../../i18n/copy/successStories.js';
import { successStoriesSeo, storiesFrom } from '../../seo/successStories.js';
import storiesData from '../../seo/data/successStories.json';
import './SuccessStories.css';

/**
 * /success-stories — what students say, in their own words.
 *
 * Reads the same committed JSON the prerender reads, so the page a visitor
 * gets and the page a crawler gets are the same page. The file is produced by
 * backend/scripts/exportSuccessStories.js from rows that are both approved and
 * carry recorded consent; nothing reaches this component that a person did not
 * deliberately publish.
 *
 * Statically imported rather than lazily fetched because it is a handful of
 * short quotes — a few KB — not the 400 KB question bank.
 *
 * With no stories the page renders an honest empty state and marks itself
 * noindex, and the prerender emits nothing at all. There is no state in which
 * it shows an example, a placeholder or a sample quote: an invented
 * testimonial is a lie about a person, and the whole point of this page is
 * that it is not one.
 */
const SuccessStories = () => {
    const t = useCopy(successStoriesCopy);
    const { lang, dir } = useLang();
    const stories = storiesFrom(storiesData);

    const seo = successStoriesSeo(stories.length, lang);
    if (!stories.length) seo.robots = 'noindex, follow';

    return (
        <main className="ss-page" dir={dir}>
            <SEO {...seo} />

            <header className="ss-hero">
                <p className="ss-kicker">{t.kicker}</p>
                <h1>{t.title}</h1>
                {stories.length > 0 && <p>{t.intro(stories.length)}</p>}
            </header>

            {stories.length > 0 && (
                <section className="ss-list">
                    {stories.map((s) => (
                        <figure key={s.id} className="ss-story">
                            {/* The quote keeps the direction it was written in,
                                not the page's — a student writing in Arabic on
                                the English page must still read correctly. */}
                            <blockquote dir={s.lang === 'en' ? 'ltr' : 'rtl'}>{s.quote}</blockquote>
                            <figcaption>
                                <strong>{s.name}</strong>
                                {s.examResult && <span className="ss-result">{s.examResult}</span>}
                                {s.specialty && <span className="ss-specialty">{s.specialty}</span>}
                            </figcaption>
                        </figure>
                    ))}
                </section>
            )}

            <section className="ss-cta">
                <h2>{t.ctaTitle}</h2>
                <p>{t.ctaBody}</p>
                <div className="ss-cta-row">
                    <Link className="ss-cta-btn" to="/demo">{t.ctaDemo}</Link>
                    <Link className="ss-cta-link" to="/signup">{t.ctaSignup}</Link>
                </div>
            </section>
        </main>
    );
};

export default SuccessStories;
