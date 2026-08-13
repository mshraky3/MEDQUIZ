import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import { UserContext } from '../../UserContext';
import { userTrack } from '../../utils/tracks.js';
import Globals from '../../global.js';
import { useCopy, useLang } from '../../i18n';
import supportCopy from '../../i18n/copy/support.js';
import './Suggestions.css';

const Suggestions = () => {
    // Best-effort attribution — the page is reachable signed out.
    const { user } = useContext(UserContext);
    const t = useCopy(supportCopy).suggestions;
    const { dir } = useLang();
    const [form, setForm] = useState({
        category: 'feature',
        title: '',
        description: '',
        priority: 'medium'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [charCount, setCharCount] = useState(0);

    // The `value`s are stable keys stored server-side; only labels are localised.
    const categories = [
        { value: 'feature' },
        { value: 'improvement' },
        { value: 'ui' },
        { value: 'content' },
        { value: 'bug' },
        { value: 'other' }
    ].map((c) => ({ ...c, label: t.categories[c.value] }));

    const priorities = [
        { value: 'low', color: '#22c55e' },
        { value: 'medium', color: '#eab308' },
        { value: 'high', color: '#ef4444' }
    ].map((p) => ({ ...p, label: t.priorities[p.value] }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === 'description') {
            setCharCount(value.length);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${Globals.URL}/api/suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: form.category,
                    title: form.title,
                    description: form.description,
                    priority: form.priority,
                    track: user ? userTrack(user) : null,
                    username: user?.username || null
                })
            });

            if (response.ok) {
                setSuccess(true);
                setForm({ category: 'feature', title: '', description: '', priority: 'medium' });
                setCharCount(0);
            } else {
                throw new Error('Failed to submit suggestion');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(t.failed);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="suggestions-container" dir={dir}>
                <div className="suggestions-card success-card">
                    <div className="success-animation">
                        <div className="success-checkmark">
                            <svg viewBox="0 0 52 52">
                                <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle" />
                                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check" />
                            </svg>
                        </div>
                    </div>
                    <h2>{t.successTitle} <Icon name="sparkles" size={20} /></h2>
                    <p>{t.successBody}</p>
                    <button
                        className="submit-another-btn"
                        onClick={() => setSuccess(false)}
                    >
                        <Icon name="pen" size={15} /> {t.another}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="suggestions-container" dir={dir}>
            <div className="suggestions-card">
                {/* Header */}
                <div className="suggestions-header">
                    <div className="header-icon"><Icon name="lightbulb" size={32} /></div>
                    <h1>{t.title}</h1>
                    <p>{t.subtitle}</p>
                </div>

                {/* Info Banner */}
                <div className="info-banner">
                    <span className="info-icon"><Icon name="info" size={16} /></span>
                    <span>{t.banner}</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="suggestions-form">
                    {/* Category Selection */}
                    <div className="form-section">
                        <label className="section-label">
                            <Icon name="folder" size={14} /> {t.categoryLabel}
                        </label>
                        <div className="category-grid">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`category-btn ${form.category === cat.value ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, category: cat.value }))}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="form-section">
                        <label className="section-label" htmlFor="title">
                            <Icon name="pen" size={14} /> {t.titleLabel}
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder={t.titlePlaceholder}
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <label className="section-label" htmlFor="description">
                            <Icon name="clipboard" size={14} /> {t.descriptionLabel}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            placeholder={t.descriptionPlaceholder}
                            required
                            rows="4"
                            maxLength={1000}
                        />
                        <div className="char-counter">
                            <span className={charCount > 900 ? 'warning' : ''}>{charCount}/1000</span>
                        </div>
                    </div>

                    {/* Priority Selection */}
                    <div className="form-section">
                        <label className="section-label">
                            <Icon name="star" size={14} /> {t.priorityLabel}
                        </label>
                        <div className="priority-options">
                            {priorities.map(pri => (
                                <label
                                    key={pri.value}
                                    className={`priority-option ${form.priority === pri.value ? 'active' : ''}`}
                                    style={{ '--priority-color': pri.color }}
                                >
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={pri.value}
                                        checked={form.priority === pri.value}
                                        onChange={handleInputChange}
                                    />
                                    <span className="priority-dot"></span>
                                    <span className="priority-text">{pri.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="btn-loading">
                                <Spinner size="sm" />
                                <span>{t.sending}</span>
                            </div>
                        ) : (
                            <>
                                <span><Icon name="rocket" size={16} /></span>
                                <span>{t.send}</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Back Link - /contact, now that it's the only page that
                    links here (the footer link and /quizs hub button are gone). */}
                <Link to="/contact" className="back-link">
                    {t.back} <span aria-hidden="true">{dir === 'rtl' ? '\u2190' : '\u2192'}</span>
                </Link>
            </div>
        </div>
    );
};

export default Suggestions;
