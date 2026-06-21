import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { api } from '../../utils/apiClient';

const PAGE_SIZE = 25;

/**
 * Study list of every question for the deck's topic, with the correct answer
 * highlighted. Searchable + paginated client-side (topic sets can be ~1k items).
 */
const SummaryQuestionsList = ({ slug }) => {
    const [questions, setQuestions] = useState([]);
    const [status, setStatus] = useState('loading'); // loading | done | error
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');
        api.get(`/api/summaries/${slug}/questions`)
            .then((res) => {
                if (cancelled) return;
                setQuestions(res.data.questions || []);
                setStatus('done');
            })
            .catch(() => { if (!cancelled) setStatus('error'); });
        return () => { cancelled = true; };
    }, [slug]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return questions;
        return questions.filter((item) =>
            item.question_text?.toLowerCase().includes(q)
            || item.correct_option?.toLowerCase().includes(q)
        );
    }, [questions, search]);

    useEffect(() => { setPage(1); }, [search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    if (status === 'loading') return <div className="summaries-loading">جارٍ تحميل الأسئلة…</div>;
    if (status === 'error') return <div className="summaries-error">تعذّر تحميل الأسئلة.</div>;

    return (
        <div>
            <div className="summary-q-toolbar">
                <input
                    className="summary-q-search"
                    type="text"
                    placeholder="ابحث في الأسئلة…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="summary-q-count">{filtered.length} سؤال</span>
            </div>

            {slice.map((item) => {
                const options = [item.option1, item.option2, item.option3, item.option4].filter(Boolean);
                return (
                    <div className="summary-q-card" key={item.id}>
                        <p className="summary-q-text">{item.question_text}</p>
                        <div className="summary-q-options">
                            {options.map((opt, idx) => (
                                <div
                                    key={idx}
                                    className={`summary-q-option ${opt === item.correct_option ? 'correct' : ''}`}
                                >
                                    {opt === item.correct_option ? <Icon name="check" size={13} /> : null} {opt}
                                </div>
                            ))}
                        </div>
                        {item.source && item.source !== 'general' && (
                            <span className="summary-q-source">{item.source}</span>
                        )}
                    </div>
                );
            })}

            {filtered.length === 0 && (
                <div className="summaries-loading">لا توجد أسئلة مطابقة.</div>
            )}

            {totalPages > 1 && (
                <div className="summary-pagination">
                    <button
                        className="summary-ctrl-btn"
                        disabled={safePage <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        السابق
                    </button>
                    <span className="summary-page-indicator">صفحة {safePage} / {totalPages}</span>
                    <button
                        className="summary-ctrl-btn"
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    );
};

export default SummaryQuestionsList;
