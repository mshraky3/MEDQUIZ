import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Globals from '../../global.js';
import { UserContext } from '../../UserContext';
import Spinner from '../common/Spinner.jsx';
import './Subscribe.css';

// Moyasar embedded payment form (Moyasar.js). 1.16.0 is the latest CDN build
// that resolves; bump this if Moyasar publishes a newer one.
const MOYASAR_VERSION = '1.16.0';
const MOYASAR_CSS = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}/moyasar.css`;
const MOYASAR_JS = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}/moyasar.js`;

// Inject the Moyasar CSS + JS once, resolving when the global is ready.
function loadMoyasarAssets() {
    return new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-moyasar]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = MOYASAR_CSS;
            link.setAttribute('data-moyasar', 'true');
            document.head.appendChild(link);
        }
        if (window.Moyasar) return resolve();

        const existing = document.querySelector('script[data-moyasar]');
        if (existing) {
            existing.addEventListener('load', resolve);
            existing.addEventListener('error', () => reject(new Error('moyasar script error')));
            return;
        }
        const script = document.createElement('script');
        script.src = MOYASAR_JS;
        script.async = true;
        script.setAttribute('data-moyasar', 'true');
        script.onload = resolve;
        script.onerror = () => reject(new Error('moyasar script error'));
        document.body.appendChild(script);
    });
}

const Subscribe = () => {
    const { user, sessionToken } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [error, setError] = useState('');
    const [priceHalalas, setPriceHalalas] = useState(null);
    const [isTestMode, setIsTestMode] = useState(false);

    useEffect(() => {
        document.documentElement.dir = 'rtl';
    }, []);

    useEffect(() => {
        // Payment is tied to a specific account, so a session is required.
        if (!user || !user.id || !sessionToken) {
            navigate('/login', { replace: true, state: { from: '/subscribe' } });
            return;
        }
        let cancelled = false;

        (async () => {
            try {
                const { data: cfg } = await axios.get(`${Globals.URL}/api/payment/config`);
                if (cancelled) return;

                // Enforcement off or misconfigured → no paywall, let them in.
                if (!cfg.enabled || !cfg.publishableKey) {
                    navigate('/quizs', { replace: true });
                    return;
                }

                setPriceHalalas(cfg.priceHalalas);
                setIsTestMode(String(cfg.publishableKey).startsWith('pk_test_'));

                await loadMoyasarAssets();
                if (cancelled) return;

                // Clear first so a StrictMode/HMR remount can't stack two forms.
                const el = document.querySelector('.mysr-form');
                if (el) el.innerHTML = '';

                window.Moyasar.init({
                    element: '.mysr-form',
                    amount: cfg.priceHalalas,
                    currency: cfg.currency || 'SAR',
                    description: `اشتراك سنوي — حساب ${user.id}`,
                    publishable_api_key: cfg.publishableKey,
                    callback_url: `${window.location.origin}/payment/callback`,
                    methods: ['creditcard', 'applepay'],
                    supported_networks: ['visa', 'mastercard', 'mada'],
                    apple_pay: {
                        country: 'SA',
                        label: 'SMLE Question Bank',
                        validate_merchant_url: 'https://api.moyasar.com/v1/applepay/initiate',
                    },
                    metadata: { account_id: String(user.id), plan: 'annual' },
                });
                setStatus('ready');
            } catch (err) {
                if (cancelled) return;
                console.error('Subscribe init failed:', err);
                setError('تعذّر تحميل نموذج الدفع. حدّث الصفحة وحاول مرة أخرى.');
                setStatus('error');
            }
        })();

        return () => { cancelled = true; };
    }, [user, sessionToken, navigate]);

    const riyals = priceHalalas != null ? priceHalalas / 100 : null;
    const trialEnded = new URLSearchParams(location.search).get('reason') === 'trial_expired'
        || user?.subscription_status === 'trial';

    return (
        <div className="login-body" dir="rtl">
            <div className="login-wrapper">
                <div className="login-card subscribe-card">
                    <div className="login-header">
                        <span className="pill">اشتراك المنصة</span>
                        {trialEnded ? (
                            <>
                                <h1 className="login-title">انتهت تجربتك المجانية</h1>
                                <p className="login-subtitle">
                                    اشترك الآن للمتابعة والاستفادة من وصول كامل لجميع الأسئلة والملخصات والتحليلات.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="login-title">فعّل اشتراكك السنوي</h1>
                                <p className="login-subtitle">
                                    وصول كامل لجميع الأسئلة والملخصات والتحليلات لمدة سنة كاملة.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="subscribe-price">
                        <span className="subscribe-price-amount">{riyals != null ? riyals : '—'}</span>
                        <span className="subscribe-price-cur">ريال</span>
                        <span className="subscribe-price-period">/ سنة</span>
                    </div>

                    <ul className="subscribe-perks">
                        <li>بنك أسئلة محدّث بالكامل لنمط 2026 مع شرح سريري</li>
                        <li>تجميعات شهرية جديدة تُضاف طوال مدة اشتراكك</li>
                        <li>تحليلات أداء تكشف نقاط ضعفك وتعيد تدريبك عليها</li>
                    </ul>

                    {isTestMode && (
                        <div className="subscribe-test-banner">
                            وضع تجريبي — استخدم بطاقة الاختبار <strong>4111 1111 1111 1111</strong>،
                            أي تاريخ مستقبلي، وأي رمز CVC.
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="subscribe-loading">
                            <Spinner size="md" />
                            <span>جاري تحميل نموذج الدفع الآمن...</span>
                        </div>
                    )}

                    {status === 'error' && <div className="alert-box error">{error}</div>}

                    {/* Moyasar renders the card form inside this element */}
                    <div className="mysr-form" style={{ display: status === 'ready' ? 'block' : 'none' }} />

                    <p className="subscribe-note">
                        الدفع آمن ومعالَج عبر <strong>ميسر</strong>. لا نقوم بتخزين بيانات بطاقتك على خوادمنا.
                    </p>
                    <p className="subscribe-policy">
                        الاشتراك سنوي (سنة واحدة) ولا يُجدَّد تلقائياً. بالمتابعة فإنك توافق على{' '}
                        <Link to="/terms" target="_blank" rel="noopener">شروط الاستخدام</Link>{' '}و{' '}
                        <Link to="/refund-policy" target="_blank" rel="noopener">سياسة الاسترجاع</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;
