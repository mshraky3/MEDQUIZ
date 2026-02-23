import React, { useState, useEffect } from 'react';
import './Suggestions.css';

const Suggestions = () => {
    const isArabic = true; // Always Arabic

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
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        return () => {
            document.documentElement.dir = 'ltr';
        };
    }, [isArabic]);

    const categories = [
        { value: 'feature', labelEn: '✨ New Feature', labelAr: '✨ ميزة جديدة' },
        { value: 'improvement', labelEn: '🚀 Improvement', labelAr: '🚀 تحسين' },
        { value: 'ui', labelEn: '🎨 UI/Design', labelAr: '🎨 واجهة/تصميم' },
        { value: 'content', labelEn: '📚 Content/Questions', labelAr: '📚 محتوى/أسئلة' },
        { value: 'bug', labelEn: '🐛 Bug Report', labelAr: '🐛 إبلاغ عن خطأ' },
        { value: 'other', labelEn: '💡 Other', labelAr: '💡 أخرى' }
    ];

    const priorities = [
        { value: 'low', labelEn: 'Nice to have', labelAr: 'من الجيد وجودها', color: '#22c55e' },
        { value: 'medium', labelEn: 'Would be helpful', labelAr: 'ستكون مفيدة', color: '#eab308' },
        { value: 'high', labelEn: 'Really need this', labelAr: 'أحتاجها حقاً', color: '#ef4444' }
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
            alert(isArabic ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="suggestions-container" dir={isArabic ? "rtl" : "ltr"}>
                <div className="suggestions-card success-card">
                    <div className="success-animation">
                        <div className="success-checkmark">
                            <svg viewBox="0 0 52 52">
                                <circle cx="26" cy="26" r="25" fill="none" className="checkmark-circle" />
                                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="checkmark-check" />
                            </svg>
                        </div>
                    </div>
                    <h2>{isArabic ? 'شكراً لاقتراحك! 🎉' : 'Thank You! 🎉'}</h2>
                    <p>{isArabic
                        ? 'نقدر مساهمتك في تحسين التطبيق. سنراجع اقتراحك ونأخذه بعين الاعتبار.'
                        : 'We appreciate your contribution to improving the app. We will review your suggestion carefully.'}
                    </p>
                    <button
                        className="submit-another-btn"
                        onClick={() => setSuccess(false)}
                    >
                        {isArabic ? '📝 إرسال اقتراح آخر' : '📝 Submit Another Suggestion'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="suggestions-container" dir={isArabic ? "rtl" : "ltr"}>
            <div className="suggestions-card">
                {/* Header */}
                <div className="suggestions-header">
                    <div className="header-icon">💡</div>
                    <h1>{isArabic ? 'الاقتراحات والأفكار' : 'Suggestions & Ideas'}</h1>
                    <p>{isArabic
                        ? 'ساعدنا في تحسين التطبيق! شاركنا أفكارك واقتراحاتك'
                        : 'Help us improve! Share your ideas and suggestions'}
                    </p>
                </div>

                {/* Info Banner */}
                <div className="info-banner">
                    <span className="info-icon">ℹ️</span>
                    <span>{isArabic
                        ? 'اقتراحاتك مهمة جداً لنا ونقوم بمراجعتها بشكل دوري'
                        : 'Your suggestions are very important to us and we review them regularly'}
                    </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="suggestions-form">
                    {/* Category Selection */}
                    <div className="form-section">
                        <label className="section-label">
                            {isArabic ? '📂 نوع الاقتراح' : '📂 Suggestion Type'}
                        </label>
                        <div className="category-grid">
                            {categories.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`category-btn ${form.category === cat.value ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, category: cat.value }))}
                                >
                                    {isArabic ? cat.labelAr : cat.labelEn}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="form-section">
                        <label className="section-label" htmlFor="title">
                            {isArabic ? '📝 عنوان الاقتراح *' : '📝 Suggestion Title *'}
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleInputChange}
                            placeholder={isArabic ? 'مثال: إضافة وضع ليلي للتطبيق' : 'Example: Add dark mode to the app'}
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div className="form-section">
                        <label className="section-label" htmlFor="description">
                            {isArabic ? '📋 وصف تفصيلي *' : '📋 Detailed Description *'}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            placeholder={isArabic
                                ? 'اشرح اقتراحك بالتفصيل... كيف سيحسن هذا تجربة الاستخدام؟'
                                : 'Explain your suggestion in detail... How will this improve the experience?'}
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
                            {isArabic ? '⭐ مدى الأهمية' : '⭐ How Important?'}
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
                                    <span className="priority-text">{isArabic ? pri.labelAr : pri.labelEn}</span>
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
                                <span>{isArabic ? 'جاري الإرسال...' : 'Submitting...'}</span>
                            </div>
                        ) : (
                            <>
                                <span>🚀</span>
                                <span>{isArabic ? 'إرسال الاقتراح' : 'Submit Suggestion'}</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Back Link */}
                <a href="/quizs" className="back-link">
                    ← العودة للاختبارات
                </a>
            </div>
        </div>
    );
};

export default Suggestions;
