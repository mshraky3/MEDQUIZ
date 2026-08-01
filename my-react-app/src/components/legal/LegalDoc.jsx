import React from 'react';
import { Link } from 'react-router-dom';
import { useCommon, useLang } from '../../i18n';
import './Legal.css';

/**
 * Renders a legal document (terms, privacy, refund policy, about) from the
 * structured copy in src/i18n/copy/legal.js.
 *
 * These pages used to be hand-written JSX per language — Privacy and About
 * interleaved English and Arabic paragraph by paragraph, which is exactly the
 * mixed-language reading experience this work removes. One renderer over one
 * data shape keeps both languages structurally identical, so a section can
 * never exist in one language and go missing in the other.
 *
 * Block shapes:
 *   { p: 'text' }                a paragraph
 *   { h3: 'text' }               a sub-heading
 *   { ul: ['item', …] }          a bulleted list
 *
 * Inline markup inside any string:
 *   **bold**
 *   [[href|label]]   → a router <Link> for in-app paths, <a> for URLs
 */

const TOKEN = /(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g;

const renderInline = (text, keyPrefix) =>
    String(text).split(TOKEN).filter(Boolean).map((part, i) => {
        const key = `${keyPrefix}-${i}`;
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('[[') && part.endsWith(']]')) {
            const [href, label = href] = part.slice(2, -2).split('|');
            if (/^https?:/i.test(href)) {
                return (
                    <a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                );
            }
            return <Link key={key} to={href}>{label}</Link>;
        }
        return <React.Fragment key={key}>{part}</React.Fragment>;
    });

const Block = ({ block, id }) => {
    if (block.h3) return <h3>{renderInline(block.h3, id)}</h3>;
    if (block.ul) {
        return (
            <ul>
                {block.ul.map((item, i) => <li key={i}>{renderInline(item, `${id}-${i}`)}</li>)}
            </ul>
        );
    }
    return <p>{renderInline(block.p, id)}</p>;
};

const LegalDoc = ({ doc }) => {
    const t = useCommon();
    const { dir } = useLang();

    return (
        <div className="legal-page" dir={dir}>
            <div className="legal-container">
                <Link to="/" className="legal-back">
                    {t.nav.home} <span aria-hidden="true">{dir === 'rtl' ? '←' : '→'}</span>
                </Link>

                <h1>{doc.title}</h1>
                {doc.updated && <p className="legal-updated">{doc.updated}</p>}

                {doc.sections.map((section, si) => (
                    <section className="legal-section" key={si}>
                        {section.heading && <h2>{section.heading}</h2>}
                        {section.blocks.map((block, bi) => (
                            <Block key={bi} block={block} id={`s${si}b${bi}`} />
                        ))}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default LegalDoc;
