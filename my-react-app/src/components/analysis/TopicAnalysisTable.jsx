import React from 'react';
import Icon from '../common/Icon.jsx';
import { getTypeLabel } from '../../utils/typeLabels';
import { TRACK_KEYS, specialtiesOf } from '../../utils/tracks.js';
import { useCopy, useLang } from '../../i18n';
import analysisCopy from '../../i18n/copy/analysis.js';
import './analysisPanels.css';

// Specialty keys never overlap between tracks, so one flat lookup covers both
// and this component does not need to know which track it is rendering.
const ICON_BY_TYPE = TRACK_KEYS.reduce((acc, track) => {
  specialtiesOf(track).forEach(({ key, icon }) => { acc[key] = icon; });
  return acc;
}, {});

const tone = (pct) => (pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low');

/**
 * Per-specialty performance.
 *
 * Was a grid of cards, each one repeating the same blurb ("Performance
 * overview / how you do on X questions") above four full-width pastel bars —
 * for data whose whole purpose is comparing specialties against each other,
 * which rows on a shared baseline do and separate cards do not.
 */
const TopicAnalysisTable = ({ topicAnalysis, topics }) => {
  const t = useCopy(analysisCopy).topics;
  const { lang } = useLang();
  // Use topics prop if available (for trial), otherwise use topicAnalysis (for normal accounts)
  const data = topics || topicAnalysis;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p className="ap-empty">{t.empty}</p>;
  }

  return (
    <ul className="ap-rows">
      {data.map((topic, index) => {
        const answered = Number(topic.total_answered) || 0;
        const correct = Number(topic.total_correct) || 0;
        const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
        const label = getTypeLabel(topic.question_type, lang);
        return (
          <li key={index} className="ap-row">
            <span className="ap-row-name">
              <span className="ap-row-icon" aria-hidden="true">
                <Icon name={ICON_BY_TYPE[topic.question_type] || 'book'} size={16} />
              </span>
              {label}
            </span>

            <span className="ap-row-facts">
              <span>{t.rowAnswered(answered)}</span>
              <span>{t.rowCorrect(correct)}</span>
              {topic.avg_time > 0 && (
                <span>{t.rowAvgTime(parseFloat(topic.avg_time).toFixed(1))}</span>
              )}
            </span>

            <span className={`ap-acc tone-${tone(accuracy)}`} aria-label={`${t.accuracy} ${accuracy}%`}>
              <bdi>{accuracy}%</bdi>
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default TopicAnalysisTable;
