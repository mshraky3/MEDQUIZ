import React from 'react';
import GoogleAd from '../common/GoogleAd.jsx';
import { useLang, useLocalePath } from '../../i18n';
import './Guides.css';

/**
 * Renders one study guide from the structured copy in src/i18n/copy/guides.js.
 *
 * Same block shapes as the legal documents (`{ p }`, `{ h3 }`, `{ ul }`, with
 * `**bold**` and `[[/path|label]]` inline), plus a `{ ad: true }` section that
 * drops the in-article ad slot where the original articles had it.
 */

const TOKEN = /(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g;

const renderInline = (text, keyPrefix, localePath = (p) => p) =>
    String(text).split(TOKEN).filter(Boolean).map((part, i) => {
        const key = `${keyPrefix}-${i}`;
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('[[') && part.endsWith(']]')) {
            const [href, label = href] = part.slice(2, -2).split('|');
            return <a key={key} href={localePath(href)}>{label}</a>;
        }
        return <React.Fragment key={key}>{part}</React.Fragment>;
    });

const Block = ({ block, id }) => {
    // Guides cross-link to other guides and to /signup. Read in English, those
    // hrefs have to point into the English tree or the article is a way out of it.
    const localePath = useLocalePath();
    if (block.h3) return <h3>{renderInline(block.h3, id, localePath)}</h3>;
    if (block.ul) {
        return (
            <ul>
                {block.ul.map((item, i) => <li key={i}>{renderInline(item, `${id}-${i}`, localePath)}</li>)}
            </ul>
        );
    }
    return <p>{renderInline(block.p, id, localePath)}</p>;
};

const GuideArticle = ({ guide }) => {
    const { dir } = useLang();

    return (
        <article className="guide-article" dir={dir}>
            <header className="guide-header">
                <p className="guides-kicker">{guide.kicker}</p>
                <h1>{guide.title}</h1>
                <p>{guide.intro}</p>
            </header>

            {guide.sections.map((section, si) => (
                section.ad
                    ? <GoogleAd key={`ad-${si}`} />
                    : (
                        <section key={si}>
                            <h2>{section.heading}</h2>
                            {section.blocks.map((block, bi) => (
                                <Block key={bi} block={block} id={`s${si}b${bi}`} />
                            ))}
                        </section>
                    )
            ))}
        </article>
    );
};

export default GuideArticle;
