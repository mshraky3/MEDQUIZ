import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Analysis.css';

const Analysis = () => {
    const location = useLocation();
    const id = location.state?.id;
    const navigate = useNavigate();


    const getRelativeDate = (dateString) => {
        const now = new Date();
        const date = new Date(dateString + 'Z'); // Assume UTC time from backend

        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;

        return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
    };


    useEffect(() => {
        if (!id) {
            navigate("/");
        }
    }, [id, navigate]);

    const [userAnalysis, setUserAnalysis] = useState(null);
    const [streakData, setStreakData] = useState(null);
    const [topicAnalysis, setTopicAnalysis] = useState([]);
    const [questionAttempts, setQuestionAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    userRes,
                    streakRes,
                    topicRes,
                    questionRes
                ] = await Promise.all([
                    axios.get(`http://localhost:3000/user-analysis/${id}`),
                    axios.get(`http://localhost:3000/user-streaks/${id}`),
                    axios.get(`http://localhost:3000/topic-analysis/user/${id}`),
                    axios.get(`http://localhost:3000/question-attempts/user/${id}`)
                ]);

                setUserAnalysis(userRes.data);
                setStreakData(streakRes.data);
                setTopicAnalysis(topicRes.data);
                setQuestionAttempts(questionRes.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching analysis data:", err);
                setError("Failed to load analysis. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="analysis-container">Loading analysis...</div>;
    }

    if (error) {
        return (
            <div className="analysis-container">
                <p style={{ color: "red" }}>{error}</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="analysis-container">
            <h2>📊 Your Quiz Analysis</h2>

            {/* Overall User Analysis */}
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

            {/* Streak Info */}
            <section className="analysis-section">
                <h3>🎯 Streak</h3>
                {streakData ? (
                    <ul>
                        <li><strong>Current Streak:</strong> {streakData.current_streak ?? 0} days</li>
                        <li><strong>Longest Streak:</strong> {streakData.longest_streak ?? 0} days</li>
                    </ul>
                ) : (
                    <p>No streak data available.</p>
                )}
            </section>

            {/* Topic-wise Analysis */}
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
                                    <td>{parseFloat(((topic.total_correct / topic.total_answered) * 100) || 0).toFixed(2)}%</td>
                                    <td>{parseFloat(topic.avg_time || 0).toFixed(2)}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No topic-specific analysis found.</p>
                )}
            </section>

            {/* Question Attempts */}
            <section className="analysis-section">
                <h3>✍️ Question Attempts</h3>
                {questionAttempts.length > 0 ? (
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>Question ID</th>
                                <th>Selected Option</th>
                                <th>Is Correct</th>
                                <th>Time Taken (s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionAttempts.map((attempt, index) => (
                                <tr key={attempt.id || index}>
                                    <td>{attempt.question_id}</td>
                                    <td>{attempt.selected_option}</td>
                                    <td>{attempt.is_correct ? "✅ Yes" : "❌ No"}</td>
                                    <td>{parseFloat(attempt.time_taken || 0).toFixed(2)}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No question attempts recorded yet.</p>
                )}
            </section>

            {/* Last Quiz Summary */}
            <section className="analysis-section">
                <h3>🕒 Last Quiz Summary</h3>
                {userAnalysis?.latest_quiz?.id ? (
                    <table className="analysis-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Quiz ID:</strong></td>
                                <td>{userAnalysis.latest_quiz.id}</td>
                            </tr>
                            <tr>
                                <td><strong>Total Questions:</strong></td>
                                <td>{userAnalysis.latest_quiz.total_questions}</td>
                            </tr>
                            <tr>
                                <td><strong>Correct Answers:</strong></td>
                                <td>{userAnalysis.latest_quiz.correct_answers}</td>
                            </tr>
                            <tr>
                                <td><strong>Accuracy:</strong></td>
                                <td>
                                    {userAnalysis.latest_quiz.total_questions > 0
                                        ? ((userAnalysis.latest_quiz.correct_answers / userAnalysis.latest_quiz.total_questions) * 100).toFixed(2)
                                        : "0.00"
                                    }%
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Total Questions Answered:</strong></td>
                                <td>{userAnalysis.latest_quiz.total_questions}</td>
                            </tr>
                            <tr>
                                <td><strong>Date:</strong></td>
                                <td>{new Date(userAnalysis.latest_quiz.start_time).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p>No previous quiz found.</p>
                )}
            </section>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={() => navigate("/quizs", { state: { id } })} className="home-button">
                    Take Another Quiz
                </button>
            </div>
        </div>
    );
};

export default Analysis;