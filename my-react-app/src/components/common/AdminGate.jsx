import React, { useEffect, useState } from 'react';
import Globals from '../../global.js';
import adminApi, { getAdminKey, setAdminKey, clearAdminKey } from '../../utils/adminApi.js';
import Spinner from './Spinner.jsx';

/**
 * Gate screen for admin-only routes (/admin, /ADD_ACCOUNT, /ADDQ, /Bank,
 * /TEMP_LINKS, /question-reports).
 *
 * Verifies the stored admin key against GET /api/admin/verify-key before
 * rendering any admin UI; otherwise shows a key prompt. The key travels in
 * the `x-admin-key` header on every admin request (see utils/adminApi.js).
 */
const wrapStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0b1021',
    padding: 16,
};
const cardStyle = {
    width: '100%',
    maxWidth: 400,
    background: '#111827',
    border: '1px solid #1e293b',
    borderRadius: 14,
    padding: '32px 28px',
    color: '#e2e8f0',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
};
const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: '#0b1021',
    border: '1px solid #1e293b',
    borderRadius: 8,
    color: '#e2e8f0',
    padding: '12px 14px',
    fontSize: 15,
    outline: 'none',
    direction: 'ltr',
};
const buttonStyle = {
    width: '100%',
    marginTop: 14,
    background: '#22d3ee',
    color: '#0b1021',
    border: 'none',
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
};

const AdminGate = ({ children }) => {
    // checking | prompt | verifying | ok
    const [state, setState] = useState('checking');
    const [keyInput, setKeyInput] = useState('');
    const [error, setError] = useState('');

    const verify = async (key) => {
        try {
            await adminApi.get(`${Globals.URL}/api/admin/verify-key`, {
                headers: key ? { 'x-admin-key': key } : {},
            });
            return { ok: true };
        } catch (err) {
            const status = err.response?.status;
            if (status === 503) {
                return { ok: false, message: 'مفتاح الإدارة غير مُفعَّل على الخادم (ADMIN_KEY). أضِفه في إعدادات Vercel ثم أعد النشر.' };
            }
            if (status === 401) {
                return { ok: false, message: 'مفتاح الإدارة غير صحيح.' };
            }
            return { ok: false, message: 'تعذّر الاتصال بالخادم. حاول مرة أخرى.' };
        }
    };

    useEffect(() => {
        (async () => {
            const stored = getAdminKey();
            const result = await verify(stored);
            if (result.ok) {
                setState('ok');
            } else {
                if (stored) clearAdminKey();
                setState('prompt');
            }
        })();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        const key = keyInput.trim();
        if (!key) return;
        setState('verifying');
        setError('');
        const result = await verify(key);
        if (result.ok) {
            setAdminKey(key);
            setState('ok');
        } else {
            setError(result.message);
            setState('prompt');
        }
    };

    if (state === 'ok') return children;

    if (state === 'checking') {
        return (
            <div style={wrapStyle} aria-busy="true">
                <Spinner size="md" />
            </div>
        );
    }

    return (
        <div style={wrapStyle} dir="rtl">
            <form style={cardStyle} onSubmit={submit}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#22d3ee', marginBottom: 6 }}>
                    لوحة الإدارة
                </div>
                <p style={{ margin: '0 0 20px', fontSize: 13.5, color: '#94a3b8', lineHeight: 1.7 }}>
                    هذه الصفحة مخصصة للمشرف فقط. أدخل مفتاح الإدارة للمتابعة.
                </p>
                <input
                    style={inputStyle}
                    type="password"
                    autoFocus
                    placeholder="Admin key"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    disabled={state === 'verifying'}
                />
                {error && (
                    <p style={{ margin: '10px 0 0', fontSize: 13, color: '#f87171' }}>{error}</p>
                )}
                <button style={buttonStyle} type="submit" disabled={state === 'verifying' || !keyInput.trim()}>
                    {state === 'verifying' ? 'جاري التحقق…' : 'دخول'}
                </button>
            </form>
        </div>
    );
};

export default AdminGate;
