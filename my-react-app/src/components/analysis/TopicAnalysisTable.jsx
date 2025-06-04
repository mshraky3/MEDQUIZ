const TopicAnalysisTable = ({ topicAnalysis }) => {
    return (
        <section className="analysis-section">
            <h3>📚 Topic-wise Performance</h3>
            {topicAnalysis.length > 0 ? (
                <table className="analysis-table">
                    <thead>
                        <tr>
                            <th>Topic</th>
                            <th>Total Questions</th>
                            <th>Correct</th>
                            <th>Accuracy (%)</th>
                            <th>Avg Time per Question</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topicAnalysis.map((topic, index) => (
                            <tr key={index}>
                                <td>{topic.question_type}</td>
                                <td>{topic.total_answered}</td>
                                <td>{topic.total_correct}</td>
                                <td>{parseFloat(((topic.total_correct / topic.total_answered) * 100 || 0).toFixed(2))}%</td>
                                <td>{parseFloat(topic.avg_time || 0).toFixed(2)}s</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No topic-specific analysis found.</p>
            )}
        </section>
    );
};

export default TopicAnalysisTable;