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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Create WhatsApp message
        const message = encodeURIComponent(`
*Contact from MEDQIZE*

Name: ${form.name}
Mobile: ${form.mobile}
Subject: ${form.subject || 'General Inquiry'}

Message:
${form.message}

---
Sent from MEDQIZE Contact Form
        `);

        const whatsappLink = `https://wa.me/966501234567?text=${message}`;
        
        // Open WhatsApp
        window.open(whatsappLink, '_blank');
        
        // Show success message
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            setForm({ name: '', mobile: '', subject: '', message: '' });
        }, 1000);
    };

    const contactInfo = [
        {
            icon: '📱',
            title: 'WhatsApp',
            value: '+966 50 123 4567',
            link: 'https://wa.me/966501234567'
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
                    <p>WhatsApp should have opened. If not, you can contact us directly:</p>
                    <div className="contact-fallback">
                        <a href="https://wa.me/966501234567" className="whatsapp-link">
                            📱 WhatsApp: +966 50 123 4567
                        </a>
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
                                        Opening WhatsApp...
                                    </div>
                                ) : (
                                    'Send '
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
