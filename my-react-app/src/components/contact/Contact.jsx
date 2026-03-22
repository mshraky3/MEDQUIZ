import React, { useState, useEffect } from 'react';
import './Contact.css';

const Contact = () => {

    const [form, setForm] = useState({
        name: '',
        mobile: '',
        subject: 'subscription',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const originalDir = document.documentElement.dir;
        document.documentElement.dir = 'rtl';

        return () => {
            document.documentElement.dir = originalDir || 'ltr';
        };
    }, []);

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
            // Send email notification to admin
            const response = await fetch('https://medquiz.vercel.app/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    mobile: form.mobile,
                    subject: form.subject || 'اتصال من SQB',
                    message: form.message
                })
            });

            if (response.ok) {
                setSuccess(true);
                setForm({ name: '', mobile: '', subject: 'subscription', message: '' });
            } else {
                throw new Error('فشل إرسال الرسالة');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback to email client
            const subject = encodeURIComponent(form.subject || 'اتصال من SQB');
            const body = encodeURIComponent(`
Name: ${form.name}
Mobile: ${form.mobile}

Message:
${form.message}

---
تم الإرسال من نموذج الاتصال SQB
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
            title: 'دعم واتساب',
            value: '0582619119',
            link: 'https://wa.link/gqafib'
        },
        {
            icon: 'https://img.icons8.com/?size=100&id=yY3YzfabynRr&format=png&color=000000',
            title: 'البريد الإلكتروني',
            value: 'alshraky3@gmail.com',
            link: 'mailto:alshraky3@gmail.com'
        }
    ];

    if (success) {
        return (
            <div className="contact-container" dir="rtl">
                <div className="contact-card success">
                    <div className="success-icon">✅</div>
                    <h2>تم إرسال الرسالة!</h2>
                    <p>شكراً لتواصلك معنا! سنعود إليك في أقرب وقت ممكن.</p>
                    <div className="contact-fallback">
                        <p>يمكنك أيضاً التواصل معنا مباشرة:</p>
                        <div className="whatsapp-links">
                            <a href="https://wa.link/gqafib" className="whatsapp-link">
                                📱 WhatsApp: 0582619119
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-container" dir="rtl">
            <div className="contact-card">
                <div className="contact-header">
                    <h1> اتصل بنا</h1>
                    <p>تواصل معنا للحصول على الدعم أو الأسئلة أو الملاحظات</p>
                </div>

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
                            <span className="suggestions-icon">💡</span>
                            <div className="suggestions-text">
                                <span className="suggestions-title">الاقتراحات والأفكار</span>
                                <span className="suggestions-subtitle">ساعدنا في تحسين التطبيق</span>
                            </div>
                            <span className="suggestions-arrow">←</span>
                        </a>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>أرسل لنا رسالة وسنعود إليك</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">اسمك *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        placeholder="أدخل اسمك الكامل"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile">رقم جوالك *</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleInputChange}
                                        placeholder="أدخل رقم جوالك"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">الموضوع</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleInputChange}
                                >
                                    <option value="subscription">اشتراك</option>
                                    <option value="report issue">الإبلاغ عن مشكلة</option>
                                    <option value="other">أخرى</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">الرسالة *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleInputChange}
                                    placeholder="أخبرنا كيف يمكننا مساعدتك..."
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
                                        <div className="spinner"></div>
                                        جاري الإرسال...
                                    </div>
                                ) : (
                                    '📧 إرسال الرسالة'
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
