import React from 'react';
import './TopicAnalysisTable.css';

const TopicAnalysisTable = ({ topicAnalysis }) => {
    return (
        <section className="streak-section">
            <h3 className="section-header">Topic-wise Performance</h3>
            {topicAnalysis.length > 0 ? (
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
                            {topicAnalysis.map((topic, index) => (
                                <tr key={index}>
                                    <td>{topic.question_type}</td>
                                    <td>{topic.total_answered}</td>
                                    <td>{topic.total_correct}</td>
                                    <td>
                                        {parseFloat(
                                            ((topic.total_correct / topic.total_answered) * 100 || 0).toFixed(2)
                                        )}%
                                    </td>
                                    <td>{parseFloat(topic.avg_time || 0).toFixed(2)}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-streak">No topic-specific data yet. Keep going!</p>
            )}
        </section>
    );
};

export default TopicAnalysisTable;
