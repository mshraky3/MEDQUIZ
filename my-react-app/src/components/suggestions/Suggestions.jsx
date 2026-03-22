import React, { useState, useEffect } from 'react';
import './Suggestions.css';

const Suggestions = () => {
    const [form, setForm] = useState({
        category: 'feature',
        title: '',
        description: '',
        priority: 'medium'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        document.documentElement.dir = 'rtl';
        return () => {
            document.documentElement.dir = 'ltr';
        };
    }, []);

    const categories = [
        { value: 'feature', label: '✨ ميزة جديدة' },
        { value: 'improvement', label: '🚀 تحسين' },
        { value: 'ui', label: '🎨 واجهة/تصميم' },
        { value: 'content', label: '📚 محتوى/أسئلة' },
        { value: 'bug', label: '🐛 إبلاغ عن خطأ' },
        { value: 'other', label: '💡 أخرى' }
    ];

    const priorities = [
        { value: 'low', label: 'من الجيد وجودها', color: '#22c55e' },
        { value: 'medium', label: 'ستكون مفيدة', color: '#eab308' },
        { value: 'high', label: 'أحتاجها حقاً', color: '#ef4444' }
    ];

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
            const response = await fetch('https://medquiz.vercel.app/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: form.category,
                    title: form.title,
                    description: form.description,
                    priority: form.priority
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
            alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="suggestions-container" dir="rtl">
                <div className="suggestions-card success-card">
                    <div className="success-animation">
                        <div className="success-checkmark">
                            <svg viewBox="0 0 52 52">
                                <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle" />
                                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check" />
                            </svg>
                        </div>
                    </div>
                    <h2>شكراً لاقتراحك! 🎉</h2>
                    <p>نقدر مساهمتك في تحسين التطبيق. سنراجع اقتراحك ونأخذه بعين الاعتبار.</p>
                    <button
                        className="submit-another-btn"
                        onClick={() => setSuccess(false)}
                    >
                        📝 إرسال اقتراح آخر
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="suggestions-container" dir="rtl">
            <div className="suggestions-card">
                {/* Header */}
                <div className="suggestions-header">
                    <div className="header-icon">💡</div>
                    <h1>الاقتراحات والأفكار</h1>
                    <p>ساعدنا في تحسين التطبيق! شاركنا أفكارك واقتراحاتك</p>
                </div>

                {/* Info Banner */}
                <div className="info-banner">
                    <span className="info-icon">ℹ️</span>
                    <span>اقتراحاتك مهمة جداً لنا ونقوم بمراجعتها بشكل دوري</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="suggestions-form">
                    {/* Category Selection */}
                    <div className="form-section">
                        <label className="section-label">
                            📂 نوع الاقتراح
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
                            📝 عنوان الاقتراح *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder="مثال: إضافة وضع ليلي للتطبيق"
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <label className="section-label" htmlFor="description">
                            📋 وصف تفصيلي *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            placeholder="اشرح اقتراحك بالتفصيل... كيف سيحسن هذا تجربة الاستخدام؟"
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
                            ⭐ مدى الأهمية
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
                                <div className="spinner"></div>
                                <span>جاري الإرسال...</span>
                            </div>
                        ) : (
                            <>
                                <span>🚀</span>
                                <span>إرسال الاقتراح</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Back Link */}
                <a href="/quizs" className="back-link">
                    العودة للاختبارات →
                </a>
            </div>
        </div>
    );
};

export default Suggestions;
