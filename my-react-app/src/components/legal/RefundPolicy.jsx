import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const RefundPolicy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="legal-back">الرئيسية →</Link>

                <h1>Refund Policy</h1>
                <p className="legal-updated">Last updated: June 2026</p>

                <section className="legal-section">
                    <h2>1. Subscription Pricing</h2>
                    <p>
                        SMLE Question Bank is available for <strong>99 SAR per year</strong>. This subscription provides full access to all features including the comprehensive question bank, detailed analytics, and progress tracking.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Refund Terms</h2>
                    <p>
                        The following refund terms apply to subscription purchases:
                    </p>
                    <ul>
                        <li>
                            <strong>14-day refund window:</strong> You may request a full refund within 14 days of the
                            initial subscription purchase, provided the request is made in good faith.
                        </li>
                        <li>
                            Refund requests made after 14 days from the purchase date are generally not eligible,
                            except where required by applicable Saudi consumer protection law.
                        </li>
                        <li>
                            Renewals may be cancelled at any time to prevent future billing; cancellation stops the
                            next renewal but does not retroactively refund the current active period.
                        </li>
                        <li>
                            Admin-created accounts with special access terms are not subject to billing and therefore not eligible for refunds.
                        </li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>3. How to Request a Refund</h2>
                    <p>
                        When subscriptions are active, refund requests can be submitted via email or WhatsApp using
                        the contact details below. Please include your account email and the approximate date of
                        purchase. We aim to respond within 5 business days.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Payment Processing</h2>
                    <p>
                        Future payments will be processed securely through Moyasar, a licensed Saudi payment gateway.
                        We do not store full card details on our servers.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Governing Law</h2>
                    <p>
                        This Refund Policy is governed by and construed in accordance with the laws of the Kingdom of
                        Saudi Arabia.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Contact Information</h2>
                    <p>For refund requests or questions about this policy, contact us at:</p>
                    <p><strong>Email:</strong> alshraky3@gmail.com</p>
                    <p><strong>WhatsApp:</strong> +966 58 261 9119</p>
                    <p><strong>Legal Entity | الكيان القانوني:</strong> شركة دار الخبرة التجارية</p>
                    <p><strong>Commercial Registration | السجل التجاري:</strong> 7040567922</p>
                    <p>
                        See also our <Link to="/terms">Terms of Service</Link> and{' '}
                        <Link to="/privacy">Privacy Policy</Link>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default RefundPolicy;
