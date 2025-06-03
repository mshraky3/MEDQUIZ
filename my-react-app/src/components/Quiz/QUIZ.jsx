import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './QUIZ.css';

const QUIZ = () => {
    const { numQuestions } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state?.id;
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [quizFinished, setQuizFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const quizStartTimeRef = useRef(Date.now());
    const [dataSent, setDataSent] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/questions`, {
                    params: { limit: numQuestions }
                });

                if (response.data.questions?.length > 0) {
                    setQuestions(response.data.questions);
                    setLoading(false);
                } else {
                    setError("No questions were returned.");
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching questions:", err);
                setError("Failed to load questions.");
                setLoading(false);
                alert("Could not load quiz. Redirecting...");
                navigate("/quizs");
            }
        };

        fetchQuestions();
    }, [numQuestions, navigate]);

    const handleSelectOption = (option) => {
        setSelectedAnswer(option);
    };

    const handleSubmitAnswer = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuestion.correct_answer;

        setAnswers(prev => [
            ...prev,
            {
                question: currentQuestion.question_text,
                selected: selectedAnswer,
                correct: currentQuestion.correct_answer,
                isCorrect
            }
        ]);

        setSelectedAnswer(null);

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizFinished(true);
        }
    };

    // Handle sending quiz data once when quiz finishes
    useEffect(() => {
        const sendQuizData = async () => {
            if (!id || dataSent || !quizFinished) return;
            setDataSent(true);

            const duration = Math.floor((Date.now() - quizStartTimeRef.current) / 1000);
            const totalQuestions = answers.length;
            const correctCount = answers.filter(a => a.isCorrect).length;
            const accuracy = ((correctCount / totalQuestions) * 100); // as number

            const topicsCovered = [...new Set(questions.map(q => q.question_type))];
            console.log("Topics covered:", topicsCovered);
            if (topicsCovered.includes(undefined)) {
                console.warn("⚠️ One or more questions have no question_type!");
            }

            try {
                console.log("Sending quiz session data:", {
                    user_id: id,
                    total_questions: parseInt(totalQuestions),
                    correct_answers: parseInt(correctCount),
                    quiz_accuracy: parseFloat(accuracy.toFixed(2)),
                    duration: parseInt(duration),
                    avg_time_per_question: parseFloat((duration / totalQuestions).toFixed(2)),
                    topics_covered: topicsCovered
                });

                const sessionRes = await axios.post("http://localhost:3000/quiz-sessions", {
                    user_id: id,
                    total_questions: parseInt(totalQuestions),
                    correct_answers: parseInt(correctCount),
                    quiz_accuracy: parseFloat(accuracy.toFixed(2)),
                    duration: parseInt(duration),
                    avg_time_per_question: parseFloat((duration / totalQuestions).toFixed(2)),
                    topics_covered: topicsCovered
                });

                const quiz_session_id = sessionRes.data.id;

                // 2. Topic analysis
                const topicMap = {};
                answers.forEach((ans, i) => {
                    const topic = questions[i]?.question_type;

                    if (!topic) {
                        console.warn("⚠️ Question at index", i, "has no topic:", questions[i]);
                        return; // skip invalid
                    }

                    if (!topicMap[topic]) {
                        topicMap[topic] = { total: 0, correct: 0 };
                    }

                    topicMap[topic].total += 1;
                    if (ans.isCorrect) topicMap[topic].correct += 1;
                });

                if (Object.keys(topicMap).length === 0) {
                    console.warn("⚠️ No valid topics to send");
                } else {
                    console.log("Sending topic analysis:", topicMap);

                    for (const [topic, data] of Object.entries(topicMap)) {
                        await axios.post("http://localhost:3000/topic-analysis", {
                            user_id: id,
                            question_type: topic,
                            total_answered: data.total,
                            total_correct: data.correct,
                            accuracy: parseFloat(((data.correct / data.total) * 100).toFixed(2)),
                            avg_time: parseFloat((duration / totalQuestions).toFixed(2))
                        });
                    }
                }

                // 3. Update streak and user analysis
                await axios.post("http://localhost:3000/user-streaks", { user_id: id });

                try {
                    await axios.post("http://localhost:3000/user-analysis", { user_id: id });
                } catch (err) {
                    console.error("Failed to update user analysis:", err.response?.data || err.message);
                }

            } catch (err) {
                console.error("Failed to submit quiz analysis:", err);
                alert("There was an issue saving your quiz results.");
            }
        };

        sendQuizData();
    }, [quizFinished, id, answers, dataSent]);

    if (loading) {
        return (
            <div className="quiz-container">
                <h2>Loading questions...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/quizs", { state: { id: id } })}>Go Back</button>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="quiz-container">
                <h2>No Questions Found</h2>
                <p>There are no questions available in the database.</p>
                <button onClick={() => navigate("/quizs", { state: { id: id } })}>Go Back</button>
            </div>
        );
    }

    if (quizFinished) {
        const totalQuestions = answers.length;
        const correctCount = answers.filter(a => a.isCorrect).length;

        return (
            <div className="quiz-result">
                <h2>Quiz Completed!</h2>
                <p>You got <strong>{correctCount}</strong> out of <strong>{totalQuestions}</strong> correct.</p>
                <button onClick={() => navigate("/quizs" , {state:{id:id}})} className="restart-button">Take another quiz</button>
                <button onClick={() => navigate("/analysis", { state: { id: id } })} className="home-button">View Analysis</button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="progress">
                Question <strong>{currentQuestionIndex + 1}</strong> of <strong>{questions.length}</strong>
            </div>

            <h2 className="question-text">{currentQuestion.question_text}</h2>

            <div className="options">
                {['option1', 'option2', 'option3', 'option4'].map((optKey, index) => (
                    <button
                        key={index}
                        className={`option-button ${selectedAnswer === currentQuestion[optKey] ? "selected" : ""}`}
                        onClick={() => handleSelectOption(currentQuestion[optKey])}
                    >
                        {currentQuestion[optKey]}
                    </button>
                ))}
            </div>

            <div className="submit-section">
                <button
                    className="submit-button"
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                >
                    {currentQuestionIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
                </button>
            </div>
        </div>
    );
};

export default QUIZ;