import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { api } from '../../utils/apiClient';
import { UserContext } from '../../UserContext';
import SlideDeck from './SlideDeck';
import SummaryProgress from './SummaryProgress';
import SummaryQuestionsList from './SummaryQuestionsList';
import './Summaries.css';

const PRACTICE_COUNT = 25;

const SummaryViewer = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [data, setData] = useState(null);      // { summary, progress, stats }
    const [status, setStatus] = useState('loading');
    const [tab, setTab] = useState('slides');     // slides | questions

    const summary = data?.summary;
    const contentHtml = summary?.content_html || null;

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');
        api.get(`/api/summaries/${slug}`)
            .then((res) => {
                if (cancelled) return;
                setData(res.data);
                setStatus('done');
            })
            .catch((err) => {
                if (cancelled) return;
                setStatus(err?.response?.status === 404 ? 'notfound' : 'error');
            });
        return () => { cancelled = true; };
    }, [slug]);

    // Persist reading progress as a percentage (debounced).
    const saveProgress = useMemo(
        () => debounce((pct) => {
            api.post(`/api/summaries/${slug}/progress`, { last_page: pct, completed: pct >= 95 })
                .catch(() => { /* non-critical */ });
        }, 800),
        [slug]
    );
    useEffect(() => () => saveProgress.flush(), [saveProgress]);

    const startPractice = () => {
        navigate(`/quiz/${PRACTICE_COUNT}`, {
            state: { id: user?.id, types: summary.question_type, source: 'mix', timer: null },
        });
    };

    if (status === 'loading') {
        return <div className="summaries-page"><div className="summaries-loading">جارٍ التحميل…</div></div>;
    }
    if (status === 'notfound' || status === 'error' || !data) {
        return (
            <div className="summaries-page">
                <div className="summaries-container">
                    <button className="summaries-back" onClick={() => navigate('/summaries')}>← الملخصات</button>
                    <div className="summaries-error">
                        {status === 'notfound' ? 'هذا الملخص غير متوفر.' : 'تعذّر تحميل الملخص. حاول لاحقاً.'}
                    </div>
                </div>
            </div>
        );
    }

    const { progress, stats } = data;

    return (
        <div className="summaries-page">
            <div className="summaries-container">
                <button className="summaries-back" onClick={() => navigate('/summaries')}>← كل الملخصات</button>

                <div className="summary-viewer-top">
                    <h1 className="summary-viewer-title">{summary.title}</h1>
                    <div className="summary-tabs">
                        <button className={`summary-tab ${tab === 'slides' ? 'active' : ''}`} onClick={() => setTab('slides')}>
                            الشرائح
                        </button>
                        <button className={`summary-tab ${tab === 'questions' ? 'active' : ''}`} onClick={() => setTab('questions')}>
                            الأسئلة ({stats.total_questions})
                        </button>
                    </div>
                </div>

                <SummaryProgress pageCount={0} progress={progress} stats={stats} isHtml />

                {tab === 'slides' && (
                    <>
                        {contentHtml ? (
                            <SlideDeck
                                contentHtml={contentHtml}
                                resumePct={progress?.max_page_reached || 0}
                                onProgress={saveProgress}
                            />
                        ) : (
                            <div className="summary-stage">
                                <div className="summary-stage-empty">
                                    محتوى هذا الملخص قيد الإعداد. يمكنك الآن دراسة الأسئلة والتدرب عليها.
                                </div>
                            </div>
                        )}
                        <div className="summary-controls">
                            <button className="summary-practice-btn" onClick={startPractice}>
                                🎯 تدرّب على {PRACTICE_COUNT} سؤال من هذا الموضوع
                            </button>
                        </div>
                    </>
                )}

                {tab === 'questions' && (
                    <>
                        <SummaryQuestionsList slug={slug} />
                        <div className="summary-controls">
                            <button className="summary-practice-btn" onClick={startPractice}>
                                🎯 تدرّب على {PRACTICE_COUNT} سؤال من هذا الموضوع
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SummaryViewer;
