import React, { useState, useContext } from 'react';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import { UserContext } from '../../UserContext';
import { userTrack } from '../../utils/tracks.js';
import Globals from '../../global.js';
import { useCopy, useLang } from '../../i18n';
import supportCopy from '../../i18n/copy/support.js';
import './Contact.css';

// Direct WhatsApp line — the fastest way to reach us, so it gets a CTA of its
// own above the form rather than only a row in the contact list.
const WHATSAPP_LINK = 'https://wa.link/bjflcg';

const Contact = () => {
    // The form is reachable while signed out, so this is best-effort: when we
    // do know who is writing, tell the inbox which track they study — a
    // "content is wrong" message means different things per track.
    const { user } = useContext(UserContext);
    const t = useCopy(supportCopy).contact;
    const { dir } = useLang();
    // Decorative "go" arrows point the way the page reads.
    const arrow = dir === 'rtl' ? '←' : '→';

    const [form, setForm] = useState({
        name: '',
        mobile: '',
        subject: 'subscription',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send email notification to admin. Uses the shared API base like
            // every other request — hardcoding the production host meant this
            // one form kept posting to prod from local/preview builds.
            const response = await fetch(`${Globals.URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    mobile: form.mobile,
                    subject: form.subject || t.mailSubject,
                    message: form.message,
                    track: user ? userTrack(user) : null,
                    username: user?.username || null
                })
            });

            if (response.ok) {
                setSuccess(true);
                setForm({ name: '', mobile: '', subject: 'subscription', message: '' });
            } else {
                throw new Error(t.failed);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback to email client
            const subject = encodeURIComponent(form.subject || t.mailSubject);
            const body = encodeURIComponent(`
Name: ${form.name}
Mobile: ${form.mobile}

Message:
${form.message}

---
${t.mailFooter}
            `);

            const mailtoLink = `mailto:alshraky3@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            setSuccess(true);
            setForm({ name: '', mobile: '', subject: 'subscription', message: '' });
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: 'https://img.icons8.com/?size=100&id=yY3YzfabynRr&format=png&color=000000',
            title: t.whatsappSupport,
            value: '0582619119',
            link: WHATSAPP_LINK
        },
        {
            icon: 'https://img.icons8.com/?size=100&id=yY3YzfabynRr&format=png&color=000000',
            title: t.email,
            value: 'alshraky3@gmail.com',
            link: 'mailto:alshraky3@gmail.com'
        }
    ];

    if (success) {
        return (
            <div className="contact-container" dir={dir}>
                <div className="contact-card success">
                    <div className="success-icon"><Icon name="check-circle" size={40} /></div>
                    <h2>{t.successTitle}</h2>
                    <p>{t.successBody}</p>
                    <div className="contact-fallback">
                        <p>{t.successAlso}</p>
                        <div className="whatsapp-links">
                            <a href={WHATSAPP_LINK} className="whatsapp-link" target="_blank" rel="noopener noreferrer">
                                <Icon name="phone" size={15} /> WhatsApp: 0582619119
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-container" dir={dir}>
            <div className="contact-card">
                <div className="contact-header">
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                <a
                    href={WHATSAPP_LINK}
                    className="whatsapp-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="whatsapp-cta-icon"><Icon name="phone" size={20} /></span>
                    <span className="whatsapp-cta-text">
                        <strong>{t.whatsappCta}</strong>
                        <small>{t.whatsappHint}</small>
                    </span>
                    <span className="whatsapp-cta-arrow" aria-hidden="true">{arrow}</span>
                </a>

                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info-section">
                        <div className="contact-info-grid">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="contact-info-item">
                                    <div className="info-icon">
                                        <img src={info.icon} alt={info.title} />
                                    </div>
                                    <div className="info-content">
                                        <h3>{info.title}</h3>
                                        {info.link ? (
                                            <a href={info.link} className="info-link" target="_blank" rel="noopener noreferrer">
                                                {info.value}
                                            </a>
                                        ) : (
                                            <p>{info.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Suggestions Button */}
                        <a href="/suggestions" className="suggestions-button">
                            <span className="suggestions-icon"><Icon name="lightbulb" size={18} /></span>
                            <div className="suggestions-text">
                                <span className="suggestions-title">{t.suggestionsTitle}</span>
                                <span className="suggestions-subtitle">{t.suggestionsSubtitle}</span>
                            </div>
                            <span className="suggestions-arrow" aria-hidden="true">{arrow}</span>
                        </a>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>{t.formTitle}</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">{t.name}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        placeholder={t.namePlaceholder}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile">{t.mobile}</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleInputChange}
                                        placeholder={t.mobilePlaceholder}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">{t.subject}</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleInputChange}
                                >
                                    {/* The values are stable keys the admin
                                        inbox reads — only the labels change. */}
                                    <option value="subscription">{t.subjectSubscription}</option>
                                    <option value="report issue">{t.subjectIssue}</option>
                                    <option value="other">{t.subjectOther}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">{t.message}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleInputChange}
                                    placeholder={t.messagePlaceholder}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="loading-spinner">
                                        <Spinner size="sm" />
                                        {t.sending}
                                    </div>
                                ) : (
                                    (<><Icon name="send" size={16} /> {t.send}</>)
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
