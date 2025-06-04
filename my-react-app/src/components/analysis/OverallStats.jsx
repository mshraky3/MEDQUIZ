// OverallStats.jsx
const OverallStats = ({ userAnalysis }) => {
    return (
        <section className="analysis-section">
            <h3>Overall Performance</h3>
            {userAnalysis ? (
                <ul>
                    <li><strong>Total Sessions:</strong> {userAnalysis.total_quizzes ?? 0}</li>
                    <li>
                        <strong>Average Accuracy:</strong>{" "}
                        {userAnalysis.total_questions_answered > 0
                            ? ((userAnalysis.total_correct_answers / userAnalysis.total_questions_answered) * 100).toFixed(2)
                            : "000"
                        }%
                    </li>
                    <li><strong>Total Questions Answered:</strong> {userAnalysis.total_questions_answered ?? 0}</li>
                </ul>
            ) : (
                <p>No overall data found.</p>
            )}
        </section>
    );
};

export default OverallStats;