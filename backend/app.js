import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import https from "https";

dotenv.config();
const agent = new https.Agent({ keepAlive: true });
const db = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: {
        rejectUnauthorized: false
    },
});

const app = express();



app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true
}));




app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const resal = await db.query("SELECT * FROM test");
        res.send(resal.rows[0]?.test || "No data found in test table.");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

app.post('/ADD_ACCOUNT', async (req, res) => {
    const { email, password } = req.body;
    try {
        const check = await db.query("SELECT * FROM accounts WHERE username = $1", [email]);
        if (check.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        await db.query("INSERT INTO accounts (username, password) VALUES ($1, $2)", [email, password]);
        return res.status(201).json({ message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/get_all_users', async (req, res) => {
    try {
        const result = await db.query("SELECT username, password, logged FROM accounts");
        res.json({ users: result.rows });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.query("SELECT * FROM accounts WHERE username = $1", [username]);
        const userRow = user.rows[0];
        if (!userRow) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (password !== userRow.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        await db.query("UPDATE accounts SET logged = $1 WHERE id = $2", [true, userRow.id]);
        const updatedUser = await db.query("SELECT * FROM accounts WHERE id = $1", [userRow.id]);
        return res.status(200).json({ message: 'Login successful', user: updatedUser.rows[0] });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/user-analysis/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const [statsRes, latestQuizRes, analysisRes] = await Promise.all([
            db.query(`
                SELECT 
                    COUNT(*) AS total_quizzes,
                    SUM(total_questions) AS total_questions_answered,
                    SUM(correct_options) AS total_correct_options
                FROM user_quiz_sessions
                WHERE user_id = $1;
            `, [userId]),
            db.query(`
                SELECT * FROM user_quiz_sessions
                WHERE user_id = $1
                ORDER BY start_time DESC
                LIMIT 1;
            `, [userId]),
            db.query(`SELECT last_active FROM user_analysis WHERE user_id = $1`, [userId])
        ]);

        const stats = statsRes.rows[0];
        const latestQuiz = latestQuizRes.rows[0] || {};
        const lastActive = analysisRes.rows[0]?.last_active;

        let accuracy = 0;
        if (stats.total_questions_answered > 0) {
            accuracy = parseFloat(((stats.total_correct_options / stats.total_questions_answered) * 100).toFixed(2));
        }

        const result = {
            total_quizzes: parseInt(stats.total_quizzes || 0),
            total_questions_answered: parseInt(stats.total_questions_answered || 0),
            total_correct_options: parseInt(stats.total_correct_options || 0),
            avg_accuracy: accuracy,
            last_active: lastActive,
            latest_quiz: {
                id: latestQuiz.id,
                total_questions: latestQuiz.total_questions || 0,
                correct_options: latestQuiz.correct_options || 0,
                quiz_accuracy: latestQuiz.quiz_accuracy || 0,
                start_time: latestQuiz.start_time
            }
        };
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/topic-analysis/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query("SELECT * FROM user_topic_analysis WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/question-attempts/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(
            "SELECT * FROM user_question_attempts WHERE user_id = $1 ORDER BY attempted_at DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/all-questions', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM questions");
        res.json({ questions: result.rows });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/user-streaks', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const hasQuizToday = await db.query(
            `SELECT 1 FROM user_quiz_sessions 
             WHERE user_id = $1 
             AND end_time BETWEEN $2 AND $3 
             LIMIT 1`,
            [user_id, todayStart, todayEnd]
        );
        if (!hasQuizToday.rows.length) {
            return res.status(400).json({ message: "No quiz completed today" });
        }

        const currentStreakData = await db.query(
            `SELECT * FROM user_streaks WHERE user_id = $1`,
            [user_id]
        );

        let currentStreak = 1;
        let longestStreak = 1;
        let lastActiveDate = new Date();
        if (currentStreakData.rows.length > 0) {
            const existing = currentStreakData.rows[0];
            const lastDate = new Date(existing.last_active_date);
            lastDate.setHours(0, 0, 0, 0);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);

            if (lastDate.getTime() === yesterday.getTime()) {
                currentStreak = existing.current_streak + 1;
            } else if (lastDate.getTime() < yesterday.getTime()) {
                currentStreak = 1;
            } else {
                currentStreak = existing.current_streak;
            }
            longestStreak = Math.max(existing.longest_streak, currentStreak);
        }

        const result = await db.query(
            `INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_active_date)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id)
             DO UPDATE SET
                 current_streak = EXCLUDED.current_streak,
                 longest_streak = EXCLUDED.longest_streak,
                 last_active_date = EXCLUDED.last_active_date,
                 updated_at = NOW()
             RETURNING *`,
            [user_id, currentStreak, longestStreak, lastActiveDate]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update streak' });
    }
});

app.get('/user-streaks/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        const quizDates = await db.query(
            `SELECT DISTINCT DATE(COALESCE(end_time, start_time)) AS quiz_date
        FROM user_quiz_sessions 
        WHERE user_id = $1
        ORDER BY quiz_date ASC`,
            [user_id]
        );
        let currentStreak = 0;
        let longestStreak = 0;
        let lastActiveDate = null;

        if (quizDates.rows.length > 0) {
            const dates = quizDates.rows.map(row => new Date(row.quiz_date))
                .map(d => {
                    d.setHours(0, 0, 0, 0);
                    return d;
                })
                .sort((a, b) => a.getTime() - b.getTime());
            let runningStreak = 0;
            let prevDate = null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            for (const date of dates) {
                if (!prevDate) {
                    runningStreak = 1;
                } else {
                    const diffDays = (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) {
                        runningStreak++;
                    } else if (diffDays > 1) {
                        runningStreak = 1;
                    }
                }
                longestStreak = Math.max(longestStreak, runningStreak);
                prevDate = date;
                if (
                    date.getTime() === today.getTime() ||
                    (runningStreak === 1 && date.getTime() === today.getTime() - 86400000)
                ) {
                    currentStreak = runningStreak;
                }
            }
            lastActiveDate = dates[dates.length - 1];
        }

        res.json({
            current_streak: currentStreak,
            longest_streak: longestStreak,
            last_active_date: lastActiveDate
        });

    } catch (err) {
        console.error("Error in GET /user-streaks/:user_id", err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/topic-analysis', async (req, res) => {
    const { user_id, question_type, total_answered, total_correct, accuracy, avg_time } = req.body;
    if (!user_id || !question_type || typeof accuracy !== 'number') {
        return res.status(400).json({ message: "Invalid or missing topic analysis data" });
    }
    try {
        const result = await db.query(
            `INSERT INTO user_topic_analysis 
            (user_id, question_type, total_answered, total_correct, accuracy, avg_time) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            ON CONFLICT (user_id, question_type) 
            DO UPDATE SET 
                total_answered = user_topic_analysis.total_answered + EXCLUDED.total_answered,
                total_correct = user_topic_analysis.total_correct + EXCLUDED.total_correct,
                accuracy = ROUND((EXCLUDED.total_correct::numeric / EXCLUDED.total_answered::numeric) * 100, 2),
                avg_time = (user_topic_analysis.avg_time * user_topic_analysis.total_answered + EXCLUDED.avg_time * EXCLUDED.total_answered) 
                            / (user_topic_analysis.total_answered + EXCLUDED.total_answered),
                last_practiced = NOW()
            RETURNING *`,
            [user_id, question_type, total_answered, total_correct, accuracy, avg_time]
        );

        if (question_type === 'general') {
            return res.status(400).json({ message: "Invalid topic: 'general' not allowed" });
        }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update topic analysis' });
    }
});

app.post('/question-attempts', async (req, res) => {
    const { user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id } = req.body;
    if (!user_id || !question_id || selected_option === undefined || is_correct === undefined || time_taken === undefined) {
        return res.status(400).json({ message: "Missing required attempt data" });
    }
    try {
        const result = await db.query(
            `INSERT INTO user_question_attempts 
            (user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to record question attempt' });
    }
});

app.post('/user-analysis', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Get quiz stats
    const statsRes = await db.query(`
      SELECT 
        COUNT(*) AS total_quizzes,
        SUM(total_questions) AS total_questions_answered,
        SUM(correct_options) AS total_correct_options
      FROM user_quiz_sessions
      WHERE user_id = $1;
    `, [user_id]);

    const stats = statsRes.rows[0];

    // Safely coerce values to numbers (or 0 if null)
    const totalQuizzes = parseInt(stats.total_quizzes) || 0;
    const totalQuestionsAnswered = parseInt(stats.total_questions_answered) || 0;
    const totalCorrectAnswers = parseInt(stats.total_correct_options) || 0;

    let accuracy = 0;
    if (totalQuestionsAnswered > 0) {
      accuracy = parseFloat(((totalCorrectAnswers / totalQuestionsAnswered) * 100).toFixed(2));
    }

    // Get response times
    const timeRes = await db.query(`
      SELECT 
        MIN(time_taken) AS fastest, 
        MAX(time_taken) AS slowest 
      FROM user_question_attempts 
      WHERE user_id = $1;
    `, [user_id]);

    const times = timeRes.rows[0];

    const fastestResponse = parseFloat(times.fastest) || 0;
    const slowestResponse = parseFloat(times.slowest) || 0;

    // Insert or update user analysis
    const result = await db.query(`
      INSERT INTO user_analysis 
      (user_id, total_quizzes, total_questions_answered, total_correct_options, accuracy, fastest_response, slowest_response, last_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        total_quizzes = EXCLUDED.total_quizzes,
        total_questions_answered = EXCLUDED.total_questions_answered,
        total_correct_options = EXCLUDED.total_correct_options,
        accuracy = EXCLUDED.accuracy,
        fastest_response = EXCLUDED.fastest_response,
        slowest_response = EXCLUDED.slowest_response,
        last_active = NOW()
      RETURNING *
    `, [
      user_id,
      totalQuizzes,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      accuracy,
      fastestResponse,
      slowestResponse
    ]);

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Error in /user-analysis:', err);
    res.status(500).json({ message: 'Failed to update user analysis' });
  }
});


app.post('/quiz-sessions', async (req, res) => {
    const { user_id, total_questions, correct_options, quiz_accuracy, duration, avg_time_per_question, topics_covered } = req.body;
    if (!user_id || !total_questions || typeof quiz_accuracy !== 'number') {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const result = await db.query(
            `INSERT INTO user_quiz_sessions 
            (user_id, total_questions, correct_options, quiz_accuracy, duration, avg_time_per_question, topics_covered) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [user_id, total_questions, correct_options, quiz_accuracy, duration, avg_time_per_question, JSON.stringify(topics_covered)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Failed to record quiz session' });
    }
});

app.get('/api/questions', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    try {
        const result = await db.query(
            `SELECT * FROM questions ORDER BY RANDOM() LIMIT $1`, [limit]
        );
        res.json({ questions: result.rows });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/questions', async (req, res) => {
    const {
        question_text,
        option1,
        option2,
        option3,
        option4,
        question_type,
        correct_option
    } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [question_text, option1, option2, option3, option4, question_type, correct_option]
        );
        res.status(201).json({
            message: "Question added successfully",
            question: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});



app.post("/ai-analysis", async (req, res) => {
    const { question, selected_answer, correct_option } = req.body;

    if (!question || !selected_answer || !correct_option) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.APIKEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    {
                        role: "user",
                        content: `Here’s a multiple-choice question:\n\nQuestion: ${question}\nUser's Answer: ${selected_answer}\nCorrect Answer: ${correct_option}\n\nWhich one is more accurate and why? in no longer than 40 words. if the words are less than 40 . dont say the number of words . and ne style needed just text `
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", response.status, errorText);
            return res.status(500).json({ error: "AI service failed." });
        }

        const data = await response.json();
        const aiAnswer = data.choices?.[0]?.message?.content;

        if (!aiAnswer) {
            console.error("OpenRouter API responded with no choices.", data);
            return res.status(500).json({ error: "Invalid AI response format." });
        }

        res.json({ answer: aiAnswer });

    } catch (error) {
        console.error("AI analysis error:", error);
        res.status(500).json({ error: "Failed to fetch AI analysis." });
    }
});








// Existing code remains unchanged until...

// === NEW ROUTES FOR QUESTIONS ===

// Get all questions
app.get('/questions', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM questions ORDER BY id");
        res.json({ questions: result.rows });
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get single question by ID
app.get('/questions/:id', async (req, res) => {
    const { id } = req.params;
    
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }
    
    try {
        const result = await db.query("SELECT * FROM questions WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }
        
        res.json({ question: result.rows[0] });
    } catch (err) {
        console.error("Error fetching question:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a question by ID
app.delete('/questions/:id', async (req, res) => {
    const { id } = req.params;
    
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }
    
    try {
        const result = await db.query(
            "DELETE FROM questions WHERE id = $1 RETURNING *", 
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }
        
        res.json({ 
            message: "Question deleted successfully",
            question: result.rows[0] 
        });
    } catch (err) {
        console.error("Error deleting question:", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.put('/questions/:id', async (req, res) => {
    const { id } = req.params;
    const {
        question_text,
        option1,
        option2,
        option3,
        option4,
        question_type,
        correct_option
    } = req.body;

    // Input validation
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid question ID" });
    }

    if (!question_text || !option1 || !option2 || !option3 || !option4 || !correct_option) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const result = await db.query(
            `UPDATE questions 
             SET question_text = $1,
                 option1 = $2,
                 option2 = $3,
                 option3 = $4,
                 option4 = $5,
                 question_type = $6,
                 correct_option = $7
             WHERE id = $8
             RETURNING *`,
            [question_text, option1, option2, option3, option4, 
             question_type, correct_option, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({
            message: "Question updated successfully",
            question: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating question:", err);
        res.status(500).json({ message: "Server error" });
    }
});



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});