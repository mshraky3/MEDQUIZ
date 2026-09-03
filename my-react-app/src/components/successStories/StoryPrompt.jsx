import React, { useCallback, useEffect, useState } from 'react';
import Globals from '../../global.js';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import { useCopy, useLang } from '../../i18n';
import successStoriesCopy from '../../i18n/copy/successStories.js';
import { safeGetItem, safeSetItem } from '../../utils/safeStorage.js';
import { safeTrack } from '../../utils/analytics.js';
import './SuccessStories.css';

/**
 * The in-app ask: "has SQB helped? tell the next student."
 *
 * Deliberately asked at a moment of goodwill rather than on a schedule, and
 * only of accounts that have actually used the thing — the caller decides when
 * (see the strong-result trigger in the quiz result screen). A testimonial
 * request sent to someone who has not got value yet is just noise, and worse,
 * it teaches them the product asks for things before it gives them.
 *
 * Asked ONCE. There is no re-ask timer here, unlike the exam-date prompt: an
 * exam date is a fact that changes, but "would you write about us" is a favour,
 * and asking twice for a favour that was declined is nagging.
 *
 * Consent is a required checkbox and the submit stays disabled without it. The
 * server refuses a story without it too — this is not the only gate, just the
 * honest one.
 */
const StoryPrompt = ({ username, sessionToken, onClose }) => {
    const t = useCopy(successStoriesCopy);
    const { dir } = useLang();
    const { lang } = useLang();
    const f = t.form;

    const [stage, setStage] = useState('ask');   // ask | form | sent
    const [form, setForm] = useState({ name: '', specialty: '', result: '', quote: '' });
    const [consent, setConsent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const submit = useCallback(async () => {
        if (form.quote.trim().length < 40) { setError(f.errorShort); return; }
        if (!consent) { setError(f.errorConsent); return; }
        setSending(true);
        setError('');
        try {
            const res = await fetch(`${Globals.URL}/api/success-stories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify({
                    username,
                    display_name: form.name.trim(),
                    specialty: form.specialty.trim(),
                    exam_result: form.result.trim(),
                    quote: form.quote.trim(),
                    consent_publish: true,
                    lang,
                }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.success) throw new Error(data?.message || 'failed');
            safeTrack('success_story_submitted', {});
            setStage('sent');
        } catch (err) {
            setError(f.errorGeneric);
        } finally {
            setSending(false);
        }
    }, [form, consent, username, sessionToken, lang, f]);

    if (stage === 'sent') {
        return (
            <div className="ss-prompt" dir={dir}>
                <span className="ss-prompt-icon" aria-hidden="true"><Icon name="check-circle" size={22} /></span>
                <div className="ss-prompt-body">
                    <strong>{f.thanksTitle}</strong>
                    <p>{f.thanksBody}</p>
                </div>
                <button type="button" className="ss-prompt-dismiss" onClick={onClose} aria-label={t.prompt.dismiss}>
                    <Icon name="x" size={16} />
                </button>
            </div>
        );
    }

    if (stage === 'ask') {
        return (
            <div className="ss-prompt" dir={dir}>
                <span className="ss-prompt-icon" aria-hidden="true"><Icon name="star" size={22} /></span>
                <div className="ss-prompt-body">
                    <strong>{t.prompt.title}</strong>
                    <p>{t.prompt.body}</p>
                    <div className="ss-prompt-actions">
                        <button type="button" className="ss-btn ss-btn--primary" onClick={() => setStage('form')}>
                            {t.prompt.cta}
                        </button>
                        <button type="button" className="ss-btn" onClick={onClose}>
                            {t.prompt.dismiss}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ss-form" dir={dir}>
            <h3>{f.title}</h3>

            <label className="ss-label" htmlFor="ss-name">{f.nameLabel}</label>
            <input id="ss-name" className="ss-input" value={form.name}
                onChange={set('name')} placeholder={f.namePlaceholder} maxLength={80} />

            <label className="ss-label" htmlFor="ss-result">{f.resultLabel}</label>
            <input id="ss-result" className="ss-input" value={form.result}
                onChange={set('result')} placeholder={f.resultPlaceholder} maxLength={120} />

            <label className="ss-label" htmlFor="ss-specialty">{f.specialtyLabel}</label>
            <input id="ss-specialty" className="ss-input" value={form.specialty}
                onChange={set('specialty')} maxLength={120} />

            <label className="ss-label" htmlFor="ss-quote">{f.quoteLabel}</label>
            <textarea id="ss-quote" className="ss-textarea" rows={5} value={form.quote}
                onChange={set('quote')} placeholder={f.quotePlaceholder} maxLength={900} />
            <p className="ss-hint">{f.quoteHint} · {form.quote.trim().length}/900</p>

            <label className="ss-consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>{f.consent}</span>
            </label>
            <p className="ss-hint">{f.consentNote}</p>

            {error && <p className="ss-error">{error}</p>}

            <div className="ss-prompt-actions">
                <button
                    type="button"
                    className="ss-btn ss-btn--primary"
                    onClick={submit}
                    disabled={sending || !consent || form.quote.trim().length < 40 || !form.name.trim()}
                >
                    {sending ? <><Spinner size="sm" />{f.sending}</> : f.submit}
                </button>
                <button type="button" className="ss-btn" onClick={onClose} disabled={sending}>
                    {f.cancel}
                </button>
            </div>
        </div>
    );
};

/**
 * Decides whether to ask at all, so callers do not each reimplement it.
 *
 * Asks once per account, remembered locally, and never asks an account that has
 * already submitted one (checked against the server, so it holds across
 * devices). Returns null while it does not yet know — the prompt should appear
 * because someone earned it, not because a request was slow.
 */
export function useStoryPrompt({ username, sessionToken, eligible }) {
    const askedKey = `sqb.storyAsked.${username || 'anon'}`;
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!eligible || !username || !sessionToken) return undefined;
        if (safeGetItem(askedKey)) return undefined;

        let alive = true;
        fetch(`${Globals.URL}/api/success-stories/mine?username=${encodeURIComponent(username)}`, {
            headers: { Authorization: `Bearer ${sessionToken}` },
        })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                // Already told us theirs — never ask again, whatever its status.
                if (alive && data?.success && !data.story) setShow(true);
            })
            .catch(() => { /* stay quiet rather than risk asking twice */ });
        return () => { alive = false; };
    }, [eligible, username, sessionToken, askedKey]);

    const dismiss = useCallback(() => {
        safeSetItem(askedKey, '1');
        setShow(false);
    }, [askedKey]);

    return { show, dismiss };
}

export default StoryPrompt;
