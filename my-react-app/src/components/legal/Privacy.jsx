import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Privacy = () => {
    return (
        <div className="legal-page">
            <div className="legal-container">
                <Link to="/" className="legal-back">← Back to Home</Link>

                <h1>Privacy Policy | سياسة الخصوصية</h1>
                <p className="legal-updated">Last updated: February 2026 | آخر تحديث: فبراير 2026</p>

                <section className="legal-section">
                    <h2>1. Introduction | المقدمة</h2>
                    <p>
                        Welcome to SMLE Question Bank ("SQB," "we," "our," or "us"). We are committed to protecting your
                        personal information and your right to privacy. This Privacy Policy explains how we collect,
                        use, disclose, and safeguard your information when you visit our website
                        (www.smle-question-bank.com) and use our services.
                    </p>
                    <p>
                        مرحباً بكم في منصة اس كيو بي (SQB). نلتزم بحماية معلوماتكم الشخصية وحقكم في الخصوصية.
                        توضح سياسة الخصوصية هذه كيف نجمع معلوماتكم ونستخدمها ونكشف عنها ونحميها عند زيارتكم
                        لموقعنا واستخدام خدماتنا.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. Information We Collect | المعلومات التي نجمعها</h2>
                    <h3>Personal Information | المعلومات الشخصية</h3>
                    <p>We may collect personal information that you voluntarily provide to us when you:</p>
                    <ul>
                        <li>Register for an account (الاسم والبريد الإلكتروني)</li>
                        <li>Use our quiz and practice features (بيانات الأداء)</li>
                        <li>Contact us through our contact form</li>
                        <li>Subscribe to our services</li>
                    </ul>
                    <p>This information may include:</p>
                    <ul>
                        <li>Name and email address</li>
                        <li>Username and password (encrypted)</li>
                        <li>Quiz performance and progress data</li>
                        <li>Phone/WhatsApp number (if provided)</li>
                    </ul>

                    <h3>Automatically Collected Information | المعلومات المجمعة تلقائياً</h3>
                    <p>
                        When you access our website, we may automatically collect certain information about your
                        device, including information about your web browser, IP address, time zone, and some of
                        the cookies that are installed on your device. We also collect information about the
                        individual web pages you visit, what websites or search terms referred you to our site,
                        and information about how you interact with our website.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. How We Use Your Information | كيف نستخدم معلوماتك</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Create and manage your account</li>
                        <li>Provide personalized quiz experiences and track your progress</li>
                        <li>Analyze and improve our services and content</li>
                        <li>Communicate with you about updates and features</li>
                        <li>Display relevant advertisements through Google AdSense</li>
                        <li>Protect against fraudulent or unauthorized activity</li>
                        <li>Comply with legal obligations</li>
                    </ul>
                    <p><strong>Legal Basis for Processing (GDPR):</strong> We process your personal data based on:</p>
                    <ul>
                        <li><strong>Consent:</strong> When you agree to cookie usage and personalized ads</li>
                        <li><strong>Contract:</strong> To provide the services you've subscribed to</li>
                        <li><strong>Legitimate Interest:</strong> To improve our platform and prevent fraud</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>4. Advertising & Third-Party Services | الإعلانات وخدمات الطرف الثالث</h2>
                    <p>
                        We use <strong>Google AdSense</strong> to display advertisements on our website. Google AdSense uses
                        cookies and web beacons to serve ads based on your prior visits to our website or other websites
                        on the Internet.
                    </p>
                    <p>
                        <strong>Google's DoubleClick DART Cookie:</strong> Google, as a third-party vendor, uses the DART
                        cookie to serve ads to our site visitors based upon their visit to our site and other sites
                        on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad
                        and content network privacy policy.
                    </p>
                    <p>
                        Third-party vendors, including Google, use cookies to serve ads based on a user's prior
                        visits to your website or other websites. Google's use of advertising cookies enables it
                        and its partners to serve ads to your users based on their visit to your sites and/or
                        other sites on the Internet.
                    </p>
                    <p>You may opt out of personalized advertising by visiting:</p>
                    <ul>
                        <li>
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                                Google Ads Settings
                            </a>
                        </li>
                        <li>
                            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                                Google Privacy & Terms - Advertising
                            </a>
                        </li>
                        <li>
                            <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
                                Network Advertising Initiative opt-out page
                            </a>
                        </li>
                        <li>
                            <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
                                Digital Advertising Alliance opt-out page
                            </a>
                        </li>
                    </ul>
                    <p>
                        For more information about how Google uses data, please visit:{' '}
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                            Google Privacy Policy
                        </a>
                    </p>
                </section>

                <section className="legal-section">
                    <h2>5. Cookies & Tracking Technologies | ملفات تعريف الارتباط</h2>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our website and store
                        certain information. Types of cookies we use:
                    </p>
                    <ul>
                        <li>
                            <strong>Essential Cookies:</strong> Required for the website to function properly
                            (e.g., authentication, session management)
                        </li>
                        <li>
                            <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website
                        </li>
                        <li>
                            <strong>Advertising Cookies:</strong> Used by Google AdSense and its partners to display
                            relevant advertisements based on your browsing behavior
                        </li>
                        <li>
                            <strong>Preference Cookies:</strong> Remember your settings and preferences
                            (e.g., language preference)
                        </li>
                    </ul>
                    <p>
                        You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                        However, if you do not accept cookies, some features of our website may not function properly.
                    </p>
                    <p>
                        <strong>Cookie Consent:</strong> We display a cookie consent banner when you first visit our
                        website. You can choose to accept all cookies or only essential cookies. You can change your
                        cookie preferences at any time by clearing your browser cookies and revisiting our site.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Data Retention | الاحتفاظ بالبيانات</h2>
                    <p>
                        We retain your personal information for as long as your account is active or as needed to
                        provide you with our services. Specifically:
                    </p>
                    <ul>
                        <li><strong>Account Data:</strong> Retained until you request account deletion</li>
                        <li><strong>Quiz Performance Data:</strong> Retained for the duration of your account</li>
                        <li><strong>Cookie Data:</strong> Advertising cookies are typically retained for up to 13 months</li>
                        <li><strong>Contact Form Data:</strong> Retained for up to 12 months</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>7. Data Security | أمان البيانات</h2>
                    <p>
                        We implement appropriate technical and organizational security measures to protect your
                        personal information, including encryption of passwords and secure data transmission.
                        However, no method of transmission over the Internet or method of electronic storage
                        is 100% secure.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Your Rights | حقوقك</h2>
                    <h3>For All Users | لجميع المستخدمين</h3>
                    <ul>
                        <li>Access your personal data (الوصول إلى بياناتك)</li>
                        <li>Correct inaccurate data (تصحيح البيانات غير الدقيقة)</li>
                        <li>Request deletion of your data (طلب حذف بياناتك)</li>
                        <li>Object to processing of your data (الاعتراض على معالجة بياناتك)</li>
                        <li>Opt out of personalized advertising (إلغاء الإعلانات المخصصة)</li>
                    </ul>

                    <h3>GDPR Rights (EU/EEA Users) | حقوق GDPR</h3>
                    <p>If you are a resident of the European Economic Area (EEA), you have additional rights:</p>
                    <ul>
                        <li><strong>Right to Data Portability:</strong> Request a copy of your data in a portable format</li>
                        <li><strong>Right to Restriction:</strong> Request restriction of processing of your data</li>
                        <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time</li>
                        <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
                    </ul>

                    <h3>CCPA Rights (California Users)</h3>
                    <p>If you are a California resident, you have the right to:</p>
                    <ul>
                        <li>Know what personal information is collected about you</li>
                        <li>Know whether your personal information is sold or disclosed</li>
                        <li>Say no to the sale of personal information</li>
                        <li>Access your personal information</li>
                        <li>Equal service and price, even if you exercise your privacy rights</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>9. Children's Privacy | خصوصية الأطفال</h2>
                    <p>
                        Our service is not intended for children under 13 years of age. We do not knowingly collect
                        personal information from children under 13. If we discover that a child under 13 has
                        provided us with personal information, we will delete it immediately.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. International Data Transfers | نقل البيانات الدولي</h2>
                    <p>
                        Your information may be transferred to and maintained on servers located outside your
                        country of residence. We ensure that adequate safeguards are in place to protect your
                        data when transferred internationally.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>11. Changes to This Policy | التغييرات على هذه السياسة</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by
                        posting the new Privacy Policy on this page and updating the "Last updated" date.
                        We encourage you to review this page periodically.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>12. Contact Us | تواصل معنا</h2>
                    <p>
                        If you have any questions about this Privacy Policy, wish to exercise your data rights,
                        or have concerns about how your data is handled, please contact us at:
                    </p>
                    <ul>
                        <li><strong>Email | البريد الإلكتروني:</strong> alshraky3@gmail.com</li>
                        <li><strong>WhatsApp | واتساب:</strong> 0582619119</li>
                        <li><strong>Location | الموقع:</strong> Saudi Arabia | المملكة العربية السعودية</li>
                    </ul>
                    <p>
                        <Link to="/contact">Contact Us Page | صفحة الاتصال</Link>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
