import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../common/Icon.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './analysis.css';
import Globals from '../../global.js';
import Spinner from '../common/Spinner.jsx';
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
    const { user, sessionToken, setUser } = useContext(UserContext);
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

    const protectedGet = useCallback(async (url, config = {}) => {
        if (!user || !sessionToken) throw new Error('Not authenticated');
        const urlWithUser = url + (url.includes('?') ? '&' : '?') + `username=${encodeURIComponent(user.username)}`;
        try {
            return await axios.get(urlWithUser, { ...config, headers: { ...(config.headers || {}), Authorization: `Bearer ${sessionToken}` } });
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setUser(null, null);
                localStorage.removeItem('user'); localStorage.removeItem('sessionToken');
                window.location.href = '/login?session=expired';
                return;
            }
            throw err;
        }
    }, [user, sessionToken, setUser]);

    const fetchWrongQuestions = useCallback(async (page = 0, append = false) => {
        if (!user?.id) return;

        try {
            setError(null);
            if (page === 0) setLoading(true);

            const params = new URLSearchParams({
                limit: String(limit),
                offset: String(page * limit),
            });
            if (query) params.set('q', query);
            if (typeFilter) params.set('type', typeFilter);

            const response = await protectedGet(`${Globals.URL}/wrong-questions/user/${user.id}?${params}`);

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
            console.error('Error fetching wrong questions:', err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    }, [user?.id, limit, protectedGet, query, typeFilter, t.error]);

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
        <div className="analysis-wrapper fade-in" dir={dir}>
                <div className="screen-header">

                    <h2 className="screen-title">{t.title}</h2>
                    <p className="screen-subtitle">
                        {t.subtitle}
                    </p>
                </div>

                {loading && wrongQuestions.length === 0 && !isFiltering ? (
                    <div className="loading-state">
                        <Spinner size="lg" />
                        <p>{t.loading}</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p><Icon name="x-circle" size={15} /> {error}</p>
                        <button
                            onClick={() => fetchWrongQuestions(0, false)}
                            className="primary-button"
                        >
                            {t.retry}
                        </button>
                    </div>
                ) : trulyEmpty ? (
                    <div className="no-data-state">
                        <h3><Icon name="sparkles" size={20} /> {t.emptyTitle}</h3>
                        <p>{t.emptyBody}</p>
                        <button
                            onClick={() => navigate('/quizs')}
                            className="primary-button"
                        >
                            {t.emptyCta}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="stats-summary">
                            <div className="stat-card">
                                <h3>{t.totalWrong}</h3>
                                <p className="stat-number">{totalQuestions}</p>
                            </div>
                            <div className="stat-card">
                                <h3>{t.loaded}</h3>
                                <p className="stat-number">{wrongQuestions.length}</p>
                            </div>
                        </div>

                        <section className="streak-section">
                            <h3 className="section-header">{t.listTitle}</h3>

                            {searchBar}

                            {wrongQuestions.length === 0 ? (
                                <div className="no-data-state">
                                    <h3>{t.noResultsTitle}</h3>
                                    <p>{t.noResultsBody}</p>
                                    <button onClick={clearSearch} className="primary-button">
                                        {t.noResultsCta}
                                    </button>
                                </div>
                            ) : (
                                <div className="questions-grid">
                                    {wrongQuestions.map((question, index) => (
                                        <div key={question.id || index} className="question-card">
                                            <div className="question-header">
                                                <div className="question-meta">
                                                    <span className="type-badge">
                                                        <Icon name="book" size={15} /> {getTypeLabel(question.question_type, lang)}
                                                    </span>
                                                    <span className="source-badge">
                                                        <Icon name="book-open" size={15} /> {getSourceLabel(question.source, lang)}
                                                    </span>
                                                    <span className="date-badge">
                                                        <Icon name="calendar" size={15} /> {formatDate(question.attempted_at, lang)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="question-content">
                                                <div className="question-text">
                                                    {question.question_text}
                                                </div>

                                                <div className="answers-section">
                                                    <div className="answer-row">
                                                        <span className="answer-label wrong">{t.yourAnswer}</span>
                                                        <span className="answer-text wrong">{question.selected_option}</span>
                                                    </div>
                                                    <div className="answer-row">
                                                        <span className="answer-label correct">{t.correctAnswer}</span>
                                                        <span className="answer-text correct">{question.correct_option}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {hasMore && wrongQuestions.length > 0 && (
                                <div className="load-more-container">
                                    <button
                                        onClick={loadMoreQuestions}
                                        className="load-more-button"
                                        disabled={loading}
                                    >
                                        {loading ? t.loadingMore : t.loadMore(Math.min(limit, totalQuestions - wrongQuestions.length))}
                                    </button>
                                </div>
                            )}
                        </section>
                    </>
                )}

            </div>
    );
};

export default WrongQuestions;
