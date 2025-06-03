import React, { useState } from 'react';
import axios from 'axios';
import './ADDQ.css';

const ADDQ = () => {
    const [questionText, setQuestionText] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [questionType, setQuestionType] = useState('pediatric');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const questionTypes = [
        'pediatric',
        'obstetrics and gynecology',
        'medicine',
        'surgery'
    ];

    const options = [
        { label: 'Option 1', value: option1 },
        { label: 'Option 2', value: option2 },
        { label: 'Option 3', value: option3 },
        { label: 'Option 4', value: option4 }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!questionText || !option1 || !option2 || !option3 || !option4 || !correctAnswer) {
            setError("Please fill in all fields and select a correct answer.");
            return;
        }

        if (!questionTypes.includes(questionType)) {
            setError("Please select a valid question type.");
            return;
        }

        const newQuestion = {
            question_text: questionText,
            option1,
            option2,
            option3,
            option4,
            question_type: questionType,
            correct_answer: correctAnswer
        };

        try {
            const response = await axios.post('http://localhost:3000/api/questions', newQuestion);
            setMessage(response.data.message || 'Question added successfully!');
            setError('');
            // Reset form
            setQuestionText('');
            setOption1('');
            setOption2('');
            setOption3('');
            setOption4('');
            setCorrectAnswer('');
            setQuestionType('pediatric');
        } catch (err) {
            console.error("Error adding question:", err);
            setError("Failed to add question. Please try again.");
            setMessage('');
        }
    };

    return (
        <div className="add-question-container">
            <h2>Add New Question</h2>
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}

            <form onSubmit={handleSubmit} className="question-form">

                <label>
                    Question Text:
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Option 1:
                    <input
                        type="text"
                        value={option1}
                        onChange={(e) => setOption1(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Option 2:
                    <input
                        type="text"
                        value={option2}
                        onChange={(e) => setOption2(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Option 3:
                    <input
                        type="text"
                        value={option3}
                        onChange={(e) => setOption3(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Option 4:
                    <input
                        type="text"
                        value={option4}
                        onChange={(e) => setOption4(e.target.value)}
                        required
                    />
                </label>

                {/* Dropdown to choose correct answer */}
                <label>
                    Select Correct Answer:
                    <select
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                    >
                        <option value="">-- Select Correct Option --</option>
                        {options.map((opt, index) =>
                            opt.value ? (
                                <option key={index} value={opt.value}>
                                    {opt.value}
                                </option>
                            ) : null
                        )}
                    </select>
                </label>

                <label>
                    Question Type:
                    <select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value)}
                    >
                        {questionTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit" className="submit-button">Add Question</button>
            </form>
        </div>
    );
};

export default ADDQ;