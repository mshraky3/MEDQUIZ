import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        mobile: '',
        subject: '',
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
            // Send email notification to admin
            const response = await fetch('https://medquiz.vercel.app/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.name,
                    mobile: form.mobile,
                    subject: form.subject || 'Contact from MEDQIZE',
                    message: form.message
                })
            });

            if (response.ok) {
                setSuccess(true);
                setForm({ name: '', mobile: '', subject: '', message: '' });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback to email client
            const subject = encodeURIComponent(form.subject || 'Contact from MEDQIZE');
            const body = encodeURIComponent(`
Name: ${form.name}
Mobile: ${form.mobile}

Message:
${form.message}

---
Sent from MEDQIZE Contact Form
            `);

            const mailtoLink = `mailto:alshraky3@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            setSuccess(true);
            setForm({ name: '', mobile: '', subject: '', message: '' });
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: '📱',
            title: 'WhatsApp Support',
            value: '0582619119',
            link: 'https://wa.link/gqafib'
        },
        {
            icon: '📱',
            title: 'WhatsApp Support',
            value: '050 999 5980',
            link: 'https://wa.link/soreie'
        },
        {
            icon: '📧',
            title: 'Email',
            value: 'alshraky3@gmail.com',
            link: 'mailto:alshraky3@gmail.com'
        }
    ];

    if (success) {
        return (
            <div className="contact-container">
                <div className="contact-card success">
                    <div className="success-icon">✅</div>
                    <h2>Message Sent!</h2>
                    <p>Thank you for contacting us! We'll get back to you as soon as possible.</p>
                    <div className="contact-fallback">
                        <p>You can also reach us directly:</p>
                        <div className="whatsapp-links">
                            <a href="https://wa.link/gqafib" className="whatsapp-link">
                                📱 WhatsApp: 0582619119
                            </a>
                            <a href="https://wa.link/soreie" className="whatsapp-link">
                                📱 WhatsApp: 050 999 5980
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-container">
            <div className="contact-card">
                <div className="contact-header">
                    <h1>📞 Contact Us</h1>
                    <p>Get in touch with us for support, questions, or feedback</p>
                </div>

                <div className="contact-content">
                    {/* Contact Information */}
                    <div className="contact-info-section">
                        <div className="contact-info-grid">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="contact-info-item">
                                    <div className="info-icon">{info.icon}</div>
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
                        <h2> Send us a Message and we will get back to you </h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Your Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobile">Your Mobile *</label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleInputChange}
                                        placeholder="Enter your mobile number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleInputChange}
                                    placeholder="What is this about?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleInputChange}
                                    placeholder="Tell us how we can help you..."
                                    rows="6"
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
                                        Sending Message...
                                    </div>
                                ) : (
                                    '📧 Send Message'
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
