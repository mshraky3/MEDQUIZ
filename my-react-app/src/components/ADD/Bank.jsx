import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bank.css";
import Globals from "../../global";

const Bank = () => {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question_text: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    question_type: "",
    correct_option: ""
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // Track current question index

  const questionTypes = [
    "pediatric",
    "obstetrics and gynecology",
    "medicine",
    "surgery"
  ];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${Globals.URL}/api/questions`);
      setQuestions(response.data.questions);
      setAllQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setQuestions(allQuestions);
    } else {
      const filtered = allQuestions.filter((q) =>
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setQuestions(filtered);
    }
    setCurrentIndex(0); // Reset to first question on search
  }, [searchTerm, allQuestions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (question) => {
    setEditingQuestion(question.id);
    setFormData({
      question_text: question.question_text,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      question_type: question.question_type || "",
      correct_option: question.correct_option
    });
  };

  const cancelEditing = () => {
    setEditingQuestion(null);
    setFormData({
      question_text: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      question_type: "",
      correct_option: ""
    });
  };

  const saveQuestion = async () => {
    try {
      const response = await axios.put(
        `${Globals.URL}/api/questions/${editingQuestion}`,
        formData
      );
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion ? response.data.question : q))
      );
      setAllQuestions((prev) =>
        prev.map((q) => (q.id === editingQuestion ? response.data.question : q))
      );
      cancelEditing();
      setSuccessMessage("✅ Question updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating question:", error);
      setSuccessMessage("");
      alert("Failed to update question. Please try again.");
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentQuestion = questions[currentIndex];
  const nextQuestion = currentIndex < questions.length - 1 ? questions[currentIndex + 1] : null;

  return (
    <div className="app-container">
      <h1 className="title">Question Bank</h1>
      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading questions, please wait...</p>
        </div>
      ) : (
        <>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="question-list">
            {questions.length === 0 ? (
              <p>No questions found.</p>
            ) : (
              <div className="card-wrapper">
                {/* Main Question Card */}
                <div className="question-card">
                  {editingQuestion === currentQuestion?.id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Question Text:</label>
                        <textarea
                          name="question_text"
                          value={formData.question_text}
                          onChange={handleInputChange}
                          rows="3"
                        />
                      </div>
                      <div className="form-group">
                        <label>Options:</label>
                        <input
                          name="option1"
                          value={formData.option1}
                          onChange={handleInputChange}
                        />
                        <input
                          name="option2"
                          value={formData.option2}
                          onChange={handleInputChange}
                        />
                        <input
                          name="option3"
                          value={formData.option3}
                          onChange={handleInputChange}
                        />
                        <input
                          name="option4"
                          value={formData.option4}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Question Type:</label>
                        <select
                          name="question_type"
                          value={formData.question_type}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Type</option>
                          {questionTypes.map((type, idx) => (
                            <option key={idx} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Correct Answer:</label>
                        <select
                          name="correct_option"
                          value={formData.correct_option}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Correct Option</option>
                          {[formData.option1, formData.option2, formData.option3, formData.option4].map((opt, idx) => (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="button-group">
                        <button className="quiz-button" onClick={saveQuestion}>
                          Save
                        </button>
                        <button
                          className="analysis-button"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="question-text">{currentQuestion.question_text}</p>
                      <div className="options">
                        <p>1. {currentQuestion.option1}</p>
                        <p>2. {currentQuestion.option2}</p>
                        <p>3. {currentQuestion.option3}</p>
                        <p>4. {currentQuestion.option4}</p>
                      </div>
                      <p className="correct-answer">
                        <strong>Answer:</strong> {currentQuestion.correct_option}
                      </p>
                      <p className="question-type">
                        <strong>Type:</strong> {currentQuestion.question_type || "N/A"}
                      </p>
                      <button
                        className="quiz-button"
                        onClick={() => startEditing(currentQuestion)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
                <div className="navigation-buttons">
                  <button
                    className="quiz-button"
                    disabled={currentIndex === 0}
                    onClick={goToPrev}
                  >
                    Previous
                  </button>
                  <span>{currentIndex + 1} / {questions.length}</span>
                  <button
                    className="quiz-button"
                    disabled={currentIndex === questions.length - 1}
                    onClick={goToNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bank;