import React, { useState, useEffect } from 'react';
import './Contact.css';
import useLang from '../../hooks/useLang';

const Contact = () => {
    const [lang] = useLang();
    const isArabic = lang === 'ar';
    
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        subject: 'subscription',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Set document direction based on language
        const originalDir = document.documentElement.dir;
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        
        // Cleanup function to restore original direction when component unmounts
        return () => {
            document.documentElement.dir = originalDir || 'ltr';
        };
    }, [lang, isArabic]);

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
                    subject: form.subject || (isArabic ? 'اتصال من SQB' : 'Contact from SQB'),
                    message: form.message
                })
            });

            if (response.ok) {
                setSuccess(true);
                setForm({ name: '', mobile: '', subject: 'subscription', message: '' });
            } else {
                throw new Error(isArabic ? 'فشل إرسال الرسالة' : 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback to email client
            const subject = encodeURIComponent(form.subject || (isArabic ? 'اتصال من SQB' : 'Contact from SQB'));
            const body = encodeURIComponent(`
Name: ${form.name}
Mobile: ${form.mobile}

Message:
${form.message}

---
${isArabic ? 'تم الإرسال من نموذج الاتصال SQB' : 'Sent from SQB Contact Form'}
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
            title: isArabic ? 'دعم واتساب' : 'WhatsApp Support',
            value: '0582619119',
            link: 'https://wa.link/gqafib'
        },
        {
            icon: 'https://img.icons8.com/?size=100&id=yY3YzfabynRr&format=png&color=000000',
            title: isArabic ? 'البريد الإلكتروني' : 'Email',
            value: 'alshraky3@gmail.com',
            link: 'mailto:alshraky3@gmail.com'
        }
    ];

    if (success) {
        return (
            <div className="contact-container" dir={isArabic ? "rtl" : "ltr"}>
                <div className="contact-card success">
                    <div className="success-icon">✅</div>
                    <h2>{isArabic ? 'تم إرسال الرسالة!' : 'Message Sent!'}</h2>
                    <p>{isArabic ? 'شكراً لتواصلك معنا! سنعود إليك في أقرب وقت ممكن.' : "Thank you for contacting us! We'll get back to you as soon as possible."}</p>
                    <div className="contact-fallback">
                        <p>{isArabic ? 'يمكنك أيضاً التواصل معنا مباشرة:' : 'You can also reach us directly:'}</p>
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
        <div className="contact-container" dir={isArabic ? "rtl" : "ltr"}>
            <div className="contact-card">
                <div className="contact-header">
                    <h1>{isArabic ? ' اتصل بنا' : ' Contact Us'}</h1>
                    <p>{isArabic ? 'تواصل معنا للحصول على الدعم أو الأسئلة أو الملاحظات' : 'Get in touch with us for support, questions, or feedback'}</p>
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
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>{isArabic ? 'أرسل لنا رسالة وسنعود إليك' : 'Send us a Message and we will get back to you'}</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">{isArabic ? 'اسمك *' : 'Your Name *'}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile">{isArabic ? 'رقم جوالك *' : 'Your Mobile *'}</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleInputChange}
                                        placeholder={isArabic ? 'أدخل رقم جوالك' : 'Enter your mobile number'}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">{isArabic ? 'الموضوع' : 'Subject'}</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleInputChange}
                                >
                                    <option value="subscription">{isArabic ? 'اشتراك' : 'Subscription'}</option>
                                    <option value="report issue">{isArabic ? 'الإبلاغ عن مشكلة' : 'Report Issue'}</option>
                                    <option value="other">{isArabic ? 'أخرى' : 'Other'}</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">{isArabic ? 'الرسالة *' : 'Message *'}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleInputChange}
                                    placeholder={isArabic ? 'أخبرنا كيف يمكننا مساعدتك...' : 'Tell us how we can help you...'}
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
                                        {isArabic ? 'جاري الإرسال...' : 'Sending Message...'}
                                    </div>
                                ) : (
                                    isArabic ? '📧 إرسال الرسالة' : '📧 Send Message'
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
