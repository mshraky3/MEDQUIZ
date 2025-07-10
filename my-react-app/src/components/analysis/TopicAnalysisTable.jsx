import React from 'react';
import './analysis.css';

const TopicAnalysisTable = ({ topicAnalysis, topics }) => {
  // Use topics prop if available (for trial), otherwise use topicAnalysis (for normal accounts)
  const data = topics || topicAnalysis;
  
  // Add error handling for undefined or null data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <section className="streak-section">
        <h3 className="section-header">Topic-wise Performance</h3>
        <p className="no-streak">No topic-specific data yet. Keep going!</p>
      </section>
    );
  }

  return (
    <section className="streak-section">
      <h3 className="section-header">Topic-wise Performance</h3>
      <div className="table-wrapper">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Total</th>
              <th>Correct</th>
              <th>Accuracy</th>
              <th>Avg Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((topic, index) => (
              <tr key={index}>
                <td data-label="Topic">{topic.question_type}</td>
                <td data-label="Total">{topic.total_answered}</td>
                <td data-label="Correct">{topic.total_correct}</td>
                <td data-label="Accuracy">
                  {parseFloat(
                    ((topic.total_correct / topic.total_answered) * 100 || 0).toFixed(2)
                  )}
                  %
                </td>
                <td data-label="Avg Time">{parseFloat(topic.avg_time || 0).toFixed(2)}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TopicAnalysisTable;