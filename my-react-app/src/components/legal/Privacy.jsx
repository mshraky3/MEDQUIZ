import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Privacy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="legal-back">← Back to Home</Link>

                <h1>Privacy Policy</h1>
                <p className="legal-updated">Last updated: January 2026</p>

                <section className="legal-section">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to SMLE Question Bank ("we," "our," or "us"). We are committed to protecting your
                        personal information and your right to privacy. This Privacy Policy explains how we collect,
                        use, disclose, and safeguard your information when you visit our website and use our services.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Information We Collect</h2>
                    <h3>Personal Information</h3>
                    <p>We may collect personal information that you voluntarily provide to us when you:</p>
                    <ul>
                        <li>Register for an account</li>
                        <li>Use our quiz and practice features</li>
                        <li>Contact us through our contact form</li>
                        <li>Subscribe to our newsletter</li>
                    </ul>
                    <p>This information may include:</p>
                    <ul>
                        <li>Name and email address</li>
                        <li>Username and password</li>
                        <li>Quiz performance and progress data</li>
                    </ul>

                    <h3>Automatically Collected Information</h3>
                    <p>
                        When you access our website, we may automatically collect certain information about your
                        device, including information about your web browser, IP address, time zone, and some of
                        the cookies that are installed on your device.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Create and manage your account</li>
                        <li>Provide personalized quiz experiences and track your progress</li>
                        <li>Analyze and improve our services</li>
                        <li>Communicate with you about updates and features</li>
                        <li>Display relevant advertisements through Google AdSense</li>
                        <li>Protect against fraudulent or unauthorized activity</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>4. Advertising</h2>
                    <p>
                        We use Google AdSense to display advertisements on our website. Google AdSense uses cookies
                        to serve ads based on your prior visits to our website or other websites. You may opt out of
                        personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
                    </p>
                    <p>
                        Third-party vendors, including Google, use cookies to serve ads based on a user's prior
                        visits to your website or other websites. Google's use of advertising cookies enables it
                        and its partners to serve ads to your users based on their visit to your sites and/or
                        other sites on the Internet.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Cookies</h2>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our website and store
                        certain information. Cookies are files with a small amount of data which may include an
                        anonymous unique identifier.
                    </p>
                    <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                </section>

                <section className="legal-section">
                    <h2>6. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational security measures to protect your
                        personal information. However, no method of transmission over the Internet or method of
                        electronic storage is 100% secure.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to processing of your data</li>
                        <li>Request data portability</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>8. Children's Privacy</h2>
                    <p>
                        Our service is not intended for children under 13 years of age. We do not knowingly collect
                        personal information from children under 13.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by
                        posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <p><strong>Email:</strong> alshraky3@gmail.com</p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
