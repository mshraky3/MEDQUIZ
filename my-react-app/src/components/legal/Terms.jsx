import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Terms = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="legal-back">← Back to Home</Link>

                <h1>Terms of Service</h1>
                <p className="legal-updated">Last updated: January 2026</p>

                <section className="legal-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using SMLE Question Bank ("the Service"), you accept and agree to be bound
                        by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Description of Service</h2>
                    <p>
                        SMLE Question Bank is an educational platform designed to help medical professionals and
                        students prepare for the Saudi Medical Licensing Examination (SMLE). Our Service provides:
                    </p>
                    <ul>
                        <li>Access to a comprehensive question bank with 8,000+ practice questions</li>
                        <li>Quiz and practice test functionality</li>
                        <li>Performance analytics and progress tracking</li>
                        <li>Study resources organized by medical specialty</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>3. User Accounts</h2>
                    <p>To access certain features of the Service, you must create an account. You agree to:</p>
                    <ul>
                        <li>Provide accurate and complete information during registration</li>
                        <li>Maintain the security of your password and account</li>
                        <li>Notify us immediately of any unauthorized use of your account</li>
                        <li>Accept responsibility for all activities that occur under your account</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>4. Acceptable Use</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use the Service for any unlawful purpose</li>
                        <li>Share your account credentials with others</li>
                        <li>Attempt to copy, reproduce, or distribute our content without permission</li>
                        <li>Interfere with or disrupt the Service or servers</li>
                        <li>Use automated systems to access the Service without permission</li>
                        <li>Impersonate any person or entity</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>5. Intellectual Property</h2>
                    <p>
                        All content on SMLE Question Bank, including but not limited to questions, explanations,
                        graphics, logos, and software, is the property of SMLE Question Bank or its content suppliers
                        and is protected by intellectual property laws.
                    </p>
                    <p>
                        You may not reproduce, distribute, modify, or create derivative works from any content
                        without our prior written consent.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Educational Disclaimer</h2>
                    <p>
                        The content provided on SMLE Question Bank is for educational and informational purposes only.
                        While we strive to provide accurate and up-to-date information:
                    </p>
                    <ul>
                        <li>We are not affiliated with Prometric, SCFHS, or any official licensing body</li>
                        <li>Our questions are practice materials and may not reflect actual exam content</li>
                        <li>Success on our platform does not guarantee success on the actual SMLE exam</li>
                        <li>Users should verify information with official sources</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>7. Advertisements</h2>
                    <p>
                        The Service may display advertisements provided by third parties, including Google AdSense.
                        We are not responsible for the content of these advertisements. Your interactions with
                        advertisers are solely between you and the advertiser.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, SMLE Question Bank shall not be liable for any
                        indirect, incidental, special, consequential, or punitive damages, or any loss of profits
                        or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill,
                        or other intangible losses.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>9. Service Modifications</h2>
                    <p>
                        We reserve the right to modify, suspend, or discontinue the Service (or any part thereof)
                        at any time with or without notice. We shall not be liable to you or any third party for
                        any modification, suspension, or discontinuation of the Service.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Termination</h2>
                    <p>
                        We may terminate or suspend your account and access to the Service immediately, without
                        prior notice or liability, for any reason, including breach of these Terms.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>11. Changes to Terms</h2>
                    <p>
                        We reserve the right to update these Terms at any time. We will notify users of significant
                        changes by posting a notice on our website. Continued use of the Service after changes
                        constitutes acceptance of the new Terms.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>12. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of Saudi Arabia,
                        without regard to its conflict of law provisions.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>13. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p><strong>Email:</strong> alshraky3@gmail.com</p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
