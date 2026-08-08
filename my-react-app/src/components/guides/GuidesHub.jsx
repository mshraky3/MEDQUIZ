import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAd from '../common/GoogleAd.jsx';
import { useCopy, useLang } from '../../i18n';
import guidesCopy from '../../i18n/copy/guides.js';
import './Guides.css';

const GuidesHub = () => {
    const t = useCopy(guidesCopy).hub;
    const { dir } = useLang();

    return (
        <main className="guides-page" dir={dir}>
            <header className="guides-hero">
                <p className="guides-kicker">{t.kicker}</p>
                <h1>{t.title}</h1>
                <p>{t.intro}</p>
            </header>

            <section className="guides-list" aria-label={t.listLabel}>
                {t.cards.map((guide) => (
                    <article key={guide.path} className="guide-card">
                        <h2>
                            <Link to={guide.path}>{guide.title}</Link>
                        </h2>
                        <p>{guide.excerpt}</p>
                        <Link className="guide-cta" to={guide.path}>
                            {t.readMore}
                        </Link>
                    </article>
                ))}
            </section>

            <section className="guides-note">
                <h2>{t.notesTitle}</h2>
                <ul>
                    {t.notes.map((note) => <li key={note}>{note}</li>)}
                </ul>
            </section>

            <GoogleAd />
        </main>
    );
};

export default GuidesHub;
