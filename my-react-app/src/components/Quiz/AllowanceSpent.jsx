import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient.js';
import { calculateBestWorstTopics, totalsFromTopics } from '../../utils/topicStats.js';
import { getTypeLabel } from '../../utils/typeLabels';
import Icon from '../common/Icon.jsx';
import Spinner from '../common/Spinner.jsx';
import { useLang } from '../../i18n';
import './AllowanceSpent.css';

/**
 * The screen a student sees when their free questions run out.
 *
 * This is the highest-intent instant that will ever exist in this funnel, and
 * until now it rendered a lock icon and a link to the pricing page — a price
 * list, to someone who has known the product for about twenty minutes. 17
 * accounts have reached this moment and 1 of them subscribed.
 *
 * So it leads with what they built instead: how many they answered, how
 * accurate they were, which specialty is costing them marks by name, and how
 * many wrong answers are sitting waiting to be worked through. Every one of
 * those numbers is already computed and already theirs — none of it is new
 * analysis, it was simply never shown at the moment it means the most.
 *
 * The plans still come, underneath. The order is the whole point: proof first,
 * then the ask.
 *
 * If the numbers cannot be loaded the component renders the ask on its own
 * rather than a spinner or an error — a failed stats call must not stand
 * between someone and the thing they were trying to do.
 */
const AllowanceSpent = ({ userId, t, onBack }) => {
    const navigate = useNavigate();
    const { lang, dir } = useLang();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) { setLoading(false); return undefined; }
        const controller = new AbortController();
        Promise.all([
            apiClient.get(`/topic-analysis/user/${userId}`, { signal: controller.signal }),
            apiClient.get(`/wrong-questions/user/${userId}`, {
                params: { limit: 1 }, signal: controller.signal,
            }).catch(() => null),
        ])
            .then(([topicsRes, wrongRes]) => {
                const topics = topicsRes.data || [];
                setStats({
                    ...totalsFromTopics(topics),
                    worst: calculateBestWorstTopics(topics).worst,
                    wrongCount: wrongRes?.data?.total ?? 0,
                });
            })
            .catch(() => { /* fall through to the ask on its own */ })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, [userId]);

    if (loading) {
        return <div className="alw-loading"><Spinner /></div>;
    }

    const worstLabel = stats?.worst ? getTypeLabel(stats.worst.question_type, lang) : null;
    const hasProof = !!stats && stats.answered > 0;

    return (
        <div className="alw" dir={dir}>
            <div className="alw-card">
                {hasProof ? (
                    <>
                        <span className="alw-eyebrow">{t.spent.eyebrow}</span>
                        <h2>{t.spent.title}</h2>

                        <div className="alw-figures">
                            <div className="alw-figure">
                                <span className="alw-figure-n">{stats.answered}</span>
                                <span className="alw-figure-l">{t.spent.answered}</span>
                            </div>
                            <div className="alw-figure">
                                <span className="alw-figure-n">{Math.round(stats.accuracy)}%</span>
                                <span className="alw-figure-l">{t.spent.accuracy}</span>
                            </div>
                        </div>

                        <ul className="alw-facts">
                            {worstLabel && (
                                <li>
                                    <Icon name="target" size={15} />
                                    <span>{t.spent.weakest(worstLabel, Math.round(stats.worst.accuracy))}</span>
                                </li>
                            )}
                            {stats.wrongCount > 0 && (
                                <li>
                                    <Icon name="alert-triangle" size={15} />
                                    <span>{t.spent.wrong(stats.wrongCount)}</span>
                                </li>
                            )}
                        </ul>

                        <p className="alw-pitch">
                            {worstLabel ? t.spent.pitch(worstLabel) : t.spent.pitchGeneric}
                        </p>
                    </>
                ) : (
                    <>
                        <span className="alw-icon" aria-hidden="true"><Icon name="lock" size={36} /></span>
                        <h2>{t.paywallSpentTitle}</h2>
                        <p className="alw-pitch">{t.paywallSpentBody}</p>
                    </>
                )}

                <button type="button" className="alw-cta" onClick={() => navigate('/subscribe')}>
                    {t.paywallCta}
                </button>
                <div className="alw-secondary">
                    {hasProof && (
                        <button type="button" className="alw-link" onClick={() => navigate('/analysis')}>
                            {t.spent.seeAnalysis}
                        </button>
                    )}
                    <button type="button" className="alw-link" onClick={onBack}>
                        {t.paywallBack}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllowanceSpent;
