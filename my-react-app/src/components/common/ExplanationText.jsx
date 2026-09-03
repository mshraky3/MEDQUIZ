import React from 'react';
import { parseExplanation } from '../../seo/explanation.js';

/**
 * An answer explanation, rendered the same way the prerendered HTML renders it.
 *
 * Both sides go through parseExplanation in src/seo/explanation.js, so a
 * crawler and a student see the same structure — see that file for why these
 * were being printed as one flat paragraph full of asterisks.
 *
 * Runs are rendered as React nodes rather than dangerouslySetInnerHTML: the
 * text comes from the question bank, and there is no reason for any of it to
 * be able to inject markup into a page.
 */
const Runs = ({ runs }) => runs.map((run, i) => (
    run.bold
        ? <strong key={i}>{run.text}</strong>
        : <React.Fragment key={i}>{run.text}</React.Fragment>
));

const ExplanationText = ({ text, className }) => {
    const blocks = parseExplanation(text);
    if (!blocks.length) return null;

    return (
        <div className={className}>
            {blocks.map((block, i) => (
                block.type === 'ul'
                    ? (
                        <ul key={i}>
                            {block.items.map((item, j) => <li key={j}><Runs runs={item} /></li>)}
                        </ul>
                    )
                    : <p key={i}><Runs runs={block.runs} /></p>
            ))}
        </div>
    );
};

export default ExplanationText;
