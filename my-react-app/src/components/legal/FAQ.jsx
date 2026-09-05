import React, { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommon, useCopy, useLang } from '../../i18n';
import faqCopy from '../../i18n/copy/faq.js';
import './FAQ.css';

// Lazy: the animated walkthrough (and its CSS) should only cost anyone who
// actually opens this one FAQ item, not every visitor to the page.
const InstallShowcase = lazy(() => import('../common/InstallShowcase.jsx'));

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const t = useCopy(faqCopy);
    const common = useCommon();
    const { dir } = useLang();

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-page" dir={dir}>
            <div className="faq-container">
                <Link to="/" className="faq-back">
                    {common.nav.home} <span aria-hidden="true">{dir === 'rtl' ? '←' : '→'}</span>
                </Link>

                <div className="faq-header">
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                <div className="faq-list">
                    {t.items.map((faq, index) => (
                        <div
                            key={faq.question}
                            className={`faq-item ${openIndex === index ? 'faq-item-open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                            </button>
                            {openIndex === index && (
                                <div className="faq-answer">
                                    {/* Answers keep their line breaks — the bulleted
                                        ones are unreadable as one paragraph. */}
                                    {faq.answer.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                    {/* The animated "add to home screen" walkthrough,
                                        moved here from the landing page — it only
                                        mounts once this item is actually opened. */}
                                    {faq.richContent === 'install' && (
                                        <Suspense fallback={null}>
                                            <InstallShowcase />
                                        </Suspense>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-contact-cta">
                    <h2>{t.ctaTitle}</h2>
                    <p>{t.ctaBody}</p>
                    <div className="faq-cta-buttons">
                        <Link to="/contact" className="faq-cta-btn">
                            {t.ctaContact}
                        </Link>
                        <a href="https://wa.link/gqafib" className="faq-cta-btn faq-cta-whatsapp" target="_blank" rel="noopener noreferrer">
                            {t.ctaWhatsapp}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
