import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { getSourceLabel } from '../../utils/sourceLabels';
import { getTypeLabel } from '../../utils/typeLabels';

const Result = ({
  correctAnswers,
  totalQuestions,
  accuracy,
  duration,
  answers = [],
  isFinalQuiz,
  onRetry,
  userId,
  completedTopics = []
}) => {
  const navigate = useNavigate();
  const wrongCount = answers.filter(a => !a.isCorrect).length;
  // Students review mistakes first; fall back to everything on a perfect run.
  const [filter, setFilter] = useState(wrongCount > 0 ? 'wrong' : 'all');

  const handleViewAnalysis = () => {
    if (isFinalQuiz) {
      // For final quiz, navigate to analysis with Final Exams tab
      navigate('/analysis', { state: { id: userId, activeTab: 'final-exams' } });
    } else {
      // For regular users, navigate to analysis with user ID
      navigate('/analysis', { state: { id: userId } });
    }
  };

  const visibleAnswers = answers
    .map((answer, index) => ({ answer, index }))
    .filter(({ answer }) => filter === 'all' || !answer.isCorrect);

  return (
    <div className="quiz-result" dir="rtl">
      {completedTopics.length > 0 && (
        <div className="result-completion-banner" dir="rtl">
          <Icon name="trophy" size={20} />
          <span>
            🎉 مبروك! أنهيت جميع أسئلة{' '}
            {completedTopics
              .map(c => `${getTypeLabel(c.type)} · ${getSourceLabel(c.source)}`)
              .join('، ')}
          </span>
        </div>
      )}
      <h2>اكتمل الاختبار!</h2>
      <p>أجبت على <strong>{correctAnswers}</strong> من أصل <strong>{totalQuestions}</strong> بشكل صحيح.</p>
      <p>الدقة: <strong>{accuracy}%</strong></p>
      <p>الوقت المستغرق: <strong>{Math.floor(duration / 60)}د {duration % 60}ث</strong></p>

      <div className="result-buttons">
        <button onClick={onRetry} className="restart-button">
          اختبار آخر
        </button>
        <button onClick={handleViewAnalysis} className="home-button">
          عرض التحليل
        </button>
      </div>

      {answers.length > 0 && (
        <section className="result-review">
          <div className="result-review-header">
            <h3>مراجعة الأسئلة</h3>
            <div className="result-review-filters" role="group" aria-label="تصفية الأسئلة">
              <button
                type="button"
                className={`result-filter-btn ${filter === 'wrong' ? 'active' : ''}`}
                onClick={() => setFilter('wrong')}
                disabled={wrongCount === 0}
              >
                الخاطئة ({wrongCount})
              </button>
              <button
                type="button"
                className={`result-filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                الكل ({answers.length})
              </button>
            </div>
          </div>

          {visibleAnswers.length === 0 ? (
            <p className="result-review-empty">
              <Icon name="sparkles" size={16} /> لا توجد أسئلة خاطئة — أداء ممتاز!
            </p>
          ) : (
            <ul className="result-review-list">
              {visibleAnswers.map(({ answer, index }) => (
                <li
                  key={index}
                  className={`result-review-item ${answer.isCorrect ? 'is-correct' : 'is-wrong'}`}
                >
                  <div className="result-review-meta">
                    <span className="result-review-num">سؤال {index + 1}</span>
                    <span className="result-review-topic">{getTypeLabel(answer.topic)}</span>
                    <span className={`result-review-state ${answer.isCorrect ? 'ok' : 'bad'}`}>
                      {answer.isCorrect
                        ? <><Icon name="check-circle" size={14} /> صحيحة</>
                        : <><Icon name="x-circle" size={14} /> خاطئة</>}
                    </span>
                  </div>
                  <p className="result-review-question" dir="auto">{answer.question}</p>
                  <div className="result-review-answers">
                    {answer.selected ? (
                      <div className={`result-review-answer ${answer.isCorrect ? 'ok' : 'bad'}`}>
                        <span>إجابتك:</span> <bdi>{answer.selected}</bdi>
                      </div>
                    ) : (
                      <div className="result-review-answer bad">
                        <span>لم تُجب على هذا السؤال</span>
                      </div>
                    )}
                    {!answer.isCorrect && (
                      <div className="result-review-answer ok">
                        <span>الإجابة الصحيحة:</span> <bdi>{answer.correct}</bdi>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default Result;
