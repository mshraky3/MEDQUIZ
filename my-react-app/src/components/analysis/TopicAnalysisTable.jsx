import React from 'react';
import './analysis.css';

const TopicAnalysisTable = ({ topicAnalysis, topics }) => {
  // Use topics prop if available (for trial), otherwise use topicAnalysis (for normal accounts)
  const data = topics || topicAnalysis;

  // Add error handling for undefined or null data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <section className="streak-section">
        <h3 className="section-header">أداء المواضيع</h3>
        <p className="no-streak">لا توجد بيانات بعد. استمر في التدريب!</p>
      </section>
    );
  }

  return (
    <section className="streak-section">
      <h3 className="section-header">أداء المواضيع</h3>
      <div className="questions-grid">
        {data.map((topic, index) => {
          const accuracy = parseFloat(
            ((topic.total_correct / topic.total_answered) * 100 || 0).toFixed(2)
          );
          return (
            <div key={index} className="question-card">
              <div className="question-header">
                <div className="question-meta">
                  <span className="type-badge">
                    📖 {topic.question_type}
                  </span>
                  <span className="accuracy-badge" style={{
                    background: accuracy >= 80 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                      accuracy >= 60 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white'
                  }}>
                    📊 {accuracy}%
                  </span>
                </div>
              </div>

              <div className="question-content">
                <div className="topic-performance-text">
                  <h4>نظرة عامة على الأداء</h4>
                  <p>أداؤك في أسئلة {topic.question_type}:</p>
                </div>

                <div className="answers-section">
                  <div className="answer-row">
                    <span className="answer-label primary">إجمالي الأسئلة:</span>
                    <span className="answer-text primary">{topic.total_answered}</span>
                  </div>

                  <div className="answer-row">
                    <span className="answer-label correct">إجابات صحيحة:</span>
                    <span className="answer-text correct">{topic.total_correct}</span>
                  </div>

                  <div className="answer-row">
                    <span className="answer-label accuracy">الدقة:</span>
                    <span className="answer-text accuracy">{accuracy}%</span>
                  </div>

                  <div className="answer-row">
                    <span className="answer-label time">متوسط الوقت:</span>
                    <span className="answer-text time">{parseFloat(topic.avg_time || 0).toFixed(2)}s</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopicAnalysisTable;