// Analysis.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './analysis.css';

// Component imports
import OverallStats from './OverallStats';
import StreakInfo from './StreakInfo';
import TopicAnalysisTable from './TopicAnalysisTable';
import QuestionAttemptsTable from './QuestionAttemptsTable';
import LastQuizSummary from './LastQuizSummary';

const Analysis = () => {
    const location = useLocation();
    const id = location.state?.id;
    const navigate = useNavigate();

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
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching analysis data for user ID:", id);
                const [
                    userRes,
                    streakRes,
                    topicRes,
                    questionRes,
                    questionsRes // 🔥 New request for full question data
                ] = await Promise.all([
                    axios.get(`http://localhost:3000/user-analysis/${id}`),
                    axios.get(`http://localhost:3000/user-streaks/${id}`),
                    axios.get(`http://localhost:3000/topic-analysis/user/${id}`),
                    axios.get(`http://localhost:3000/question-attempts/user/${id}`),
                    axios.get(`http://localhost:3000/api/all-questions?nocache=${Date.now()}`)
                ]);
                setUserAnalysis(userRes.data);
                setStreakData(streakRes.data);
                setTopicAnalysis(topicRes.data);
                setQuestionAttempts(questionRes.data);
                setQuestions(questionsRes.data.questions || []);
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

            <OverallStats userAnalysis={userAnalysis} />
            <StreakInfo streakData={streakData} />
            <TopicAnalysisTable topicAnalysis={topicAnalysis} />
            <LastQuizSummary latest_quiz={userAnalysis?.latest_quiz} />
            <QuestionAttemptsTable
                questionAttempts={questionAttempts}
                questions={questions}
            />

            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={() => navigate("/quizs", { state: { id } })} className="home-button">
                    Take Another Quiz
                </button>
            </div>
        </div>
    );
};

export default Analysis;
