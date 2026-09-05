import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../common/Icon.jsx';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient.js';
// The review cards are the same ones /analysis renders for its last-quiz
// review — one review card in the product, not two.
import './analysisPanels.css';
import './WrongQuestions.css';
import Spinner from '../common/Spinner.jsx';
import ExplanationPanel from '../common/ExplanationPanel.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useCopy, useLang, formatDate } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';

/**
 * The wrong-answer review list, with search.
 *
 * Search is a SERVER query, not a filter over the rows already on screen. The
 * list is paginated 20 at a time, so filtering the loaded page would search a
 * window rather than a history — a student with 400 wrong answers looking for
 * "myasthenia" would be told there are none. The endpoint takes `q` and `type`
 * and returns a matching total plus per-specialty counts, so the header count
 * and the filter chips always describe the same result set.
 */

const DEBOUNCE_MS = 350;
const LIMIT = 20;

const WrongQuestions = () => {
    const navigate = useNavigate();
    const t = useCopy(analysisCopy).wrong;
    const { lang, dir } = useLang();
    const { user } = useContext(UserContext);
    const [wrongQuestions, setWrongQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [byType, setByType] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    // `search` is what the user is typing; `query` is what has actually been
    // sent. Keeping them apart is what makes the debounce visible ("Searching…")
    // without firing a request per keystroke.
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const limit = LIMIT;

    // Aborts the previous fresh (page 0) search when a newer one starts, so a
    // slow response to an earlier keystroke/filter can't land after a faster
    // one and overwrite it with stale results. "Load more" appends are never
    // aborted by a later one — there's only ever one in flight at a time
    // because the button disables itself while loading.
    const searchAbortRef = React.useRef(null);

    const fetchWrongQuestions = useCallback(async (page = 0, append = false) => {
        if (!user?.id) return;

        if (!append) {
            searchAbortRef.current?.abort();
            searchAbortRef.current = new AbortController();
        }

        try {
            setError(null);
            if (page === 0) setLoading(true);

            const params = { limit, offset: page * limit };
            if (query) params.q = query;
            if (typeFilter) params.type = typeFilter;

            const response = await apiClient.get(`/wrong-questions/user/${user.id}`, {
                params,
                signal: append ? undefined : searchAbortRef.current.signal,
            });

            const { wrongQuestions: newQuestions, total, byType: facets } = response.data;

            if (append) {
                setWrongQuestions(prev => [...prev, ...newQuestions]);
            } else {
                setWrongQuestions(newQuestions);
            }

            setTotalQuestions(total);
            if (Array.isArray(facets)) setByType(facets);
            setHasMore((page + 1) * limit < total);
            setCurrentPage(page);

        } catch (err) {
            if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return;
            console.error('Error fetching wrong questions:', err);
            setError(t.error);
            setLoading(false);
            return;
        }
        // Not in `finally` — an aborted request must not clear loading for the
        // newer request that superseded it (finally runs even after the early
        // `return` above, which is exactly the case it would otherwise hit).
        setLoading(false);
    }, [user?.id, limit, query, typeFilter, t.error]);

    // Any change of query or filter restarts pagination from page 0 — appending
    // page 2 of the old search onto page 1 of the new one would interleave two
    // different result sets.
    useEffect(() => {
        fetchWrongQuestions(0, false);
    }, [fetchWrongQuestions]);

    // Debounce the typed term into the committed one.
    useEffect(() => {
        const trimmed = search.trim();
        if (trimmed === query) return;
        const id = setTimeout(() => setQuery(trimmed), DEBOUNCE_MS);
        return () => clearTimeout(id);
    }, [search, query]);

    const loadMoreQuestions = useCallback(() => {
        if (hasMore && !loading) {
            fetchWrongQuestions(currentPage + 1, true);
        }
    }, [hasMore, loading, currentPage, fetchWrongQuestions]);

    const clearSearch = () => {
        setSearch('');
        setQuery('');
        setTypeFilter('');
    };

    const isFiltering = !!(query || typeFilter);
    const pendingSearch = search.trim() !== query;
    // "You have no wrong questions" is only true when nothing is being
    // filtered — with a search active, an empty list is a no-results state,
    // and congratulating someone for a failed search would be absurd.
    const trulyEmpty = !isFiltering && !loading && wrongQuestions.length === 0;

    const searchBar = (
        <div className="wq-tools">
            <div className="wq-search">
                <span className="wq-search-icon" aria-hidden="true"><Icon name="search" size={16} /></span>
                <input
                    type="search"
                    className="wq-search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    aria-label={t.searchLabel}
                />
                {!!search && (
                    <button type="button" className="wq-search-clear" onClick={clearSearch} aria-label={t.searchClear}>
                        <Icon name="x" size={15} />
                    </button>
                )}
            </div>

            {byType.length > 1 && (
                <div className="wq-chips" role="group" aria-label={t.filterAll}>
                    <button
                        type="button"
                        className={`wq-chip${!typeFilter ? ' is-on' : ''}`}
                        aria-pressed={!typeFilter}
                        onClick={() => setTypeFilter('')}
                    >
                        {t.filterAll}
                    </button>
                    {byType.map((f) => (
                        <button
                            key={f.question_type}
                            type="button"
                            className={`wq-chip${typeFilter === f.question_type ? ' is-on' : ''}`}
                            aria-pressed={typeFilter === f.question_type}
                            onClick={() => setTypeFilter(f.question_type)}
                        >
                            {getTypeLabel(f.question_type, lang)} <span className="wq-chip-n">{f.total}</span>
                        </button>
                    ))}
                </div>
            )}

            {isFiltering && (
                <p className="wq-results" role="status">
                    {pendingSearch
                        ? t.searching
                        : query
                            ? t.resultsFor(totalQuestions, query)
                            : t.resultsFiltered(totalQuestions)}
                </p>
            )}
        </div>
    );

    return (
        <div className="wq-page" dir={dir}>
            <header className="wq-head">
                <h1 className="wq-title">{t.title}</h1>
                <p className="wq-sub">{t.subtitle}</p>
            </header>

            {loading && wrongQuestions.length === 0 && !isFiltering ? (
                <div className="wq-loading">
                    <Spinner size="lg" />
                    <p>{t.loading}</p>
                </div>
            ) : error ? (
                <div className="wq-state is-error">
                    <h3><Icon name="x-circle" size={19} /> {error}</h3>
                    <button type="button" onClick={() => fetchWrongQuestions(0, false)} className="wq-cta">
                        {t.retry}
                    </button>
                </div>
            ) : trulyEmpty ? (
                <div className="wq-state">
                    <h3><Icon name="sparkles" size={19} /> {t.emptyTitle}</h3>
                    <p>{t.emptyBody}</p>
                    <button type="button" onClick={() => navigate('/quizs')} className="wq-cta">
                        {t.emptyCta}
                    </button>
                </div>
            ) : (
                <>
                    {searchBar}

                    {wrongQuestions.length === 0 ? (
                        <div className="wq-state">
                            <h3>{t.noResultsTitle}</h3>
                            <p>{t.noResultsBody}</p>
                            <button type="button" onClick={clearSearch} className="wq-cta">
                                {t.noResultsCta}
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="wq-summary">{t.summary(totalQuestions, wrongQuestions.length)}</p>

                            <div className="ap-reviews">
                                {wrongQuestions.map((question, index) => (
                                    <article key={question.id || index} className="ap-review">
                                        <div className="ap-review-head">
                                            <span className="ap-badge">
                                                <Icon name="book" size={14} /> {getTypeLabel(question.question_type, lang)}
                                            </span>
                                            <span className="ap-badge">
                                                <Icon name="book-open" size={14} /> {getSourceLabel(question.source, lang)}
                                            </span>
                                            <span className="ap-badge">
                                                <Icon name="calendar" size={14} /> {formatDate(question.attempted_at, lang)}
                                            </span>
                                        </div>

                                        <div className="ap-review-body">
                                            <p className="ap-question">{question.question_text}</p>

                                            <div className="ap-answers">
                                                <div className="ap-answer is-wrong">
                                                    <span className="ap-answer-label">{t.yourAnswer}</span>
                                                    <span className="ap-answer-value">{question.selected_option}</span>
                                                </div>
                                                <div className="ap-answer is-correct">
                                                    <span className="ap-answer-label">{t.correctAnswer}</span>
                                                    <span className="ap-answer-value">{question.correct_option}</span>
                                                </div>
                                            </div>

                                            <ExplanationPanel explanation={question.explanation} />
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="wq-more-wrap">
                                    <button
                                        type="button"
                                        onClick={loadMoreQuestions}
                                        className="wq-more"
                                        disabled={loading}
                                    >
                                        {loading ? t.loadingMore : t.loadMore(Math.min(limit, totalQuestions - wrongQuestions.length))}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default WrongQuestions;
