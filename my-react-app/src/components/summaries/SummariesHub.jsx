import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/apiClient';
import './Summaries.css';

// Canonical topic catalog (matches questions.question_type / the quiz engine).
// Decks not yet uploaded render as "coming soon".
const TOPIC_CATALOG = [
    { question_type: 'surgery', icon: '🔪', fallbackTitle: 'ملخص الجراحة' },
    { question_type: 'pediatric', icon: '🧒', fallbackTitle: 'ملخص طب الأطفال' },
    { question_type: 'medicine', icon: '🩺', fallbackTitle: 'ملخص الباطنة' },
    { question_type: 'obstetrics and gynecology', icon: '🤰', fallbackTitle: 'ملخص النساء والولادة' },
];

const readPct = (s) => {
    if (!s.progress) return 0;
    // HTML decks store a scroll percentage; image decks store a page number.
    if (s.has_content) return Math.min(100, Math.max(0, s.progress.max_page_reached || 0));
    if (!s.page_count) return 0;
    return Math.min(100, Math.round((s.progress.max_page_reached / s.page_count) * 100));
};

const SummariesHub = () => {
    const navigate = useNavigate();
    const [summaries, setSummaries] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        let cancelled = false;
        api.get('/api/summaries')
            .then((res) => {
                if (cancelled) return;
                setSummaries(res.data.summaries || []);
                setStatus('done');
            })
            .catch(() => { if (!cancelled) setStatus('error'); });
        return () => { cancelled = true; };
    }, []);

    const bySlugType = {};
    summaries.forEach((s) => { bySlugType[s.question_type] = s; });

    const cards = TOPIC_CATALOG.map((t) => {
        const live = bySlugType[t.question_type];
        const available = !!(live && (live.has_content || live.page_count > 0));
        return available ? { ...t, ...live, available: true } : { ...t, available: false };
    });

    return (
        <div className="summaries-page">
            <div className="summaries-container">
                <header className="summaries-header">
                    <h1>📚 الملخصات</h1>
                    <p className="summaries-subtitle">
                        ملخصات مركّزة لكل تخصص، ومعها أسئلة الموضوع للدراسة والتدريب — مع تتبّع تقدّمك.
                    </p>
                </header>

                {status === 'loading' && <div className="summaries-loading">جارٍ التحميل…</div>}
                {status === 'error' && <div className="summaries-error">تعذّر تحميل الملخصات. حاول لاحقاً.</div>}

                {status === 'done' && (
                    <div className="summaries-grid">
                        {cards.map((card) => {
                            if (!card.available) {
                                return (
                                    <div className="summary-card is-soon" key={card.question_type}>
                                        <div className="summary-card-icon">{card.icon}</div>
                                        <h3 className="summary-card-title">{card.fallbackTitle}</h3>
                                        <p className="summary-card-desc">سيتم إضافة هذا الملخص قريباً.</p>
                                        <div className="summary-card-meta">
                                            <span className="summary-soon-badge">قريباً</span>
                                        </div>
                                    </div>
                                );
                            }
                            const progress = readPct(card);
                            return (
                                <div
                                    className="summary-card"
                                    key={card.slug}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate(`/summaries/${card.slug}`)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/summaries/${card.slug}`); }}
                                >
                                    <div className="summary-card-icon">{card.icon}</div>
                                    <h3 className="summary-card-title">{card.title}</h3>
                                    <p className="summary-card-desc">{card.description}</p>
                                    {card.progress && card.page_count > 0 && (
                                        <div className="summary-progress-bar">
                                            <div className="summary-progress-fill" style={{ width: `${progress}%` }} />
                                        </div>
                                    )}
                                    <div className="summary-card-meta">
                                        <span className="summary-chip">{card.total_questions} سؤال</span>
                                        <span>{card.progress ? `${progress}% مقروء` : 'ابدأ الآن'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummariesHub;
