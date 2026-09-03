import React from 'react';

/**
 * The visible half of a FAQPage block.
 *
 * Google requires FAQ markup to describe text a reader can actually see, so
 * this renders the same `{q, a}` array that src/seo/faqSchema.js turns into
 * schema — and the prerendered markup in the seo modules mirrors this DOM.
 * Change one, change all three.
 */
const FaqBlock = ({ title, items }) => {
    if (!Array.isArray(items) || !items.length) return null;

    return (
        <section className="pq-faq">
            <h2>{title}</h2>
            {items.map((item) => (
                <div className="pq-faq-item" key={item.q}>
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                </div>
            ))}
        </section>
    );
};

export default FaqBlock;
