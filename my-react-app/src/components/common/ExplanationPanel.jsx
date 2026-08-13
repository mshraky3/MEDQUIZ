import React, { useContext, useState } from 'react';
import axios from 'axios';
import Icon from './Icon.jsx';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import { useCommon, useLang } from '../../i18n';
import './ExplanationPanel.css';

/**
 * The "why this answer is correct" panel, shared by the quiz screen and every
 * review surface (results, wrong questions, final-exam review, attempt table).
 *
 * The explanation is study content: it comes from the database in English and
 * is rendered verbatim in both site languages, so only the header label follows
 * the UI language and the body is pinned LTR. Same rule as the question stem
 * and its options — see i18n/LanguageContext.jsx.
 *
 * Props:
 *   explanation  the raw markdown-subset string; renders nothing when empty
 *   questionId   fetch the explanation on first open instead of receiving it.
 *                For screens whose question rows come from /api/all-questions,
 *                which omits the column on purpose (5,000 rows × ~1 KB).
 *   defaultOpen  start expanded (the quiz's study mode) vs collapsed (reviews)
 */

/** `**bold**` and `*italic*` — the only inline markup these explanations use. */
function renderInline(text, keyPrefix) {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.filter(Boolean).map((part, index) => {
        const key = `${keyPrefix}-${index}`;
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return <em key={key}>{part.slice(1, -1)}</em>;
        }
        return <React.Fragment key={key}>{part}</React.Fragment>;
    });
}

/**
 * Markdown subset: `- ` bullet runs become lists, every other non-empty line
 * becomes a paragraph. A full renderer would be ~40 KB of dependency for the
 * four constructs the content actually contains, and the import pipeline
 * (backend/scripts/buildExplanationSet.js) normalizes everything else away —
 * headings to `**Bold:**`, `*`/`•` bullets to `-`, LaTeX to real symbols.
 */
function renderBody(explanation) {
    const lines = String(explanation).split('\n');
    const blocks = [];
    let bullets = [];

    const flushBullets = () => {
        if (bullets.length === 0) return;
        const items = bullets;
        bullets = [];
        blocks.push(
            <ul className="sqb-explain-list" key={`ul-${blocks.length}`}>
                {items.map((item, index) => (
                    <li key={index}>{renderInline(item, `li-${blocks.length}-${index}`)}</li>
                ))}
            </ul>
        );
    };

    lines.forEach((rawLine) => {
        const line = rawLine.trim();
        if (!line) { flushBullets(); return; }

        const bullet = /^-\s+(.*)$/.exec(line);
        if (bullet) { bullets.push(bullet[1]); return; }

        flushBullets();
        // A line opening with bold is a section label ("**Diagnosis:**") and
        // gets the extra top spacing that makes the panel scannable.
        const isSection = line.startsWith('**');
        blocks.push(
            <p className={`sqb-explain-line${isSection ? ' is-section' : ''}`} key={`p-${blocks.length}`}>
                {renderInline(line, `p-${blocks.length}`)}
            </p>
        );
    });
    flushBullets();

    return blocks;
}

const ExplanationPanel = ({ explanation, questionId = null, defaultOpen = false }) => {
    const t = useCommon().explanation;
    const { dir } = useLang();
    const { user, sessionToken } = useContext(UserContext);
    const [open, setOpen] = useState(defaultOpen);
    // null = not fetched yet, '' = fetched and this question has none.
    const [fetched, setFetched] = useState(null);
    const [loading, setLoading] = useState(false);

    const provided = explanation && String(explanation).trim() ? String(explanation) : null;
    const lazy = !provided && questionId != null;

    const toggle = () => {
        const next = !open;
        setOpen(next);
        if (!next || !lazy || fetched !== null || loading || !user || !sessionToken) return;

        setLoading(true);
        axios
            .get(
                `${Globals.URL}/api/questions/${questionId}/explanation?username=${encodeURIComponent(user.username)}`,
                { headers: { Authorization: `Bearer ${sessionToken}` } }
            )
            .then(res => setFetched(res.data?.explanation || ''))
            .catch(() => setFetched(''))
            .finally(() => setLoading(false));
    };

    // Nothing to disclose and no way to go and get one.
    if (!provided && !lazy) return null;

    const body = provided ?? fetched;

    return (
        <div className={`sqb-explain${open ? ' is-open' : ''}`} dir={dir}>
            <button
                type="button"
                className="sqb-explain-toggle"
                onClick={toggle}
                aria-expanded={open}
            >
                <Icon name="lightbulb" size={16} />
                <span className="sqb-explain-title">{t.title}</span>
                <span className="sqb-explain-chevron" aria-hidden="true">
                    <Icon name="chevron-down" size={16} />
                </span>
            </button>
            {open && (
                <div className="sqb-explain-body" dir="ltr">
                    {loading && <p className="sqb-explain-line">…</p>}
                    {!loading && body ? renderBody(body) : null}
                    {!loading && !body && <p className="sqb-explain-line">{t.unavailable}</p>}
                </div>
            )}
        </div>
    );
};

export default ExplanationPanel;
