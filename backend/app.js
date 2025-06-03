import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const db = new pg.Client({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    const resal = await db.query("SELECT * FROM test");
    res.send(resal.rows[0]?.test || "No data found in test table.");
});

app.post('/ADD_ACCOUNT', async (req, res) => {
    const { email, password } = req.body;
    const check = await db.query("SELECT * FROM accounts WHERE username = $1", [email]);
    if (check.rows.length > 0) {
        return res.status(400).json({ message: 'Email already exists' });
    } else {
        await db.query("INSERT INTO accounts (username, password) VALUES ($1, $2)", [email, password]);
        return res.status(201).json({ message: 'Account created successfully' });
    }
});

app.get('/get_all_users', async (req, res) => {
    try {
        const result = await db.query("SELECT username, password, logged FROM accounts");
        res.json({ users: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received:', req.body);

    try {
        const user = await db.query("SELECT * FROM accounts WHERE username = $1", [username]).then(res => res.rows[0]);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        await db.query("UPDATE accounts SET logged = $1 WHERE id = $2", [true, user.id]);

        const updatedUser = await db.query("SELECT * FROM accounts WHERE id = $1", [user.id]).then(res => res.rows[0]);
        return res.status(200).json({ message: 'Login successful', user: updatedUser });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});



app.get('/user-analysis/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Get overall stats
        const statsRes = await db.query(`
            SELECT 
                COUNT(*) AS total_quizzes,
                SUM(total_questions) AS total_questions_answered,
                SUM(correct_answers) AS total_correct_answers
            FROM user_quiz_sessions
            WHERE user_id = $1;
        `, [userId]);

        const stats = statsRes.rows[0];

        let accuracy = 0;
        if (stats.total_questions_answered > 0) {
            accuracy = parseFloat(((stats.total_correct_answers / stats.total_questions_answered) * 100).toFixed(2));
        }

        // Get latest quiz
        const latestQuizRes = await db.query(`
            SELECT * FROM user_quiz_sessions
            WHERE user_id = $1
            ORDER BY start_time DESC
            LIMIT 1;
        `, [userId]);

        const latestQuiz = latestQuizRes.rows[0] || {};

        // Get last_active from user_analysis
        const analysisRes = await db.query(`
            SELECT last_active FROM user_analysis WHERE user_id = $1;
        `, [userId]);

        const lastActive = analysisRes.rows[0]?.last_active;

        // Build response
        const result = {
            total_quizzes: parseInt(stats.total_quizzes || 0),
            total_questions_answered: parseInt(stats.total_questions_answered || 0),
            total_correct_answers: parseInt(stats.total_correct_answers || 0),
            avg_accuracy: accuracy,
            last_active: lastActive, // Included now ✅
            latest_quiz: {
                id: latestQuiz.id,
                total_questions: latestQuiz.total_questions || 0,
                correct_answers: latestQuiz.correct_answers || 0,
                quiz_accuracy: latestQuiz.quiz_accuracy || 0,
                start_time: latestQuiz.start_time
            }
        };

        res.json(result);

    } catch (err) {
        console.error("Error fetching analysis data:", err);
        res.status(500).json({ message: 'Server error' });
    }
});
app.get('/topic-analysis/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query("SELECT * FROM user_topic_analysis WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/question-attempts/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query("SELECT * FROM user_question_attempts WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/user-streaks/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query("SELECT * FROM user_streaks WHERE user_id = $1", [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No streak data found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/user-streaks', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await db.query(
            `INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_active_date)
             VALUES ($1, 1, 1, $2)
             ON CONFLICT (user_id)
             DO UPDATE SET
                 current_streak = CASE
                     WHEN user_streaks.last_active_date < CURRENT_DATE THEN user_streaks.current_streak + 1
                     ELSE user_streaks.current_streak
                 END,
                 longest_streak = GREATEST(user_streaks.longest_streak, user_streaks.current_streak + 1),
                 last_active_date = NOW(),
                 updated_at = NOW()
             RETURNING *`,
            [user_id, today]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error in /user-streaks:", err.message, err.stack);
        res.status(500).json({ message: 'Failed to update streak' });
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
        // In /topic-analysis POST route
        if (question_type === 'general') {
            return res.status(400).json({ message: "Invalid topic: 'general' not allowed" });
        }
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error in /topic-analysis:", err.message, err.stack);
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
        console.error("Error in /question-attempts:", err.message, err.stack);
        res.status(500).json({ message: 'Failed to record question attempt' });
    }
});
app.post('/user-analysis', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        // Aggregate total stats
        const statsRes = await db.query(`
            SELECT 
                COUNT(*) AS total_quizzes,
                SUM(total_questions) AS total_questions_answered,
                SUM(correct_answers) AS total_correct_answers
            FROM user_quiz_sessions
            WHERE user_id = $1;
        `, [user_id]);

        const stats = statsRes.rows[0];

        let accuracy = 0;
        if (stats.total_questions_answered > 0) {
            accuracy = parseFloat(((stats.total_correct_answers / stats.total_questions_answered) * 100).toFixed(2));
        }

        // Get fastest/slowest time
        const timeRes = await db.query(`
            SELECT 
                MIN(time_taken) AS fastest, 
                MAX(time_taken) AS slowest 
            FROM user_question_attempts 
            WHERE user_id = $1;
        `, [user_id]);

        const times = timeRes.rows[0];

        // Insert or Update user_analysis
        const result = await db.query(`
            INSERT INTO user_analysis 
            (user_id, total_quizzes, total_questions_answered, total_correct_answers, accuracy, fastest_response, slowest_response, last_active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (user_id)
            DO UPDATE SET
                total_quizzes = EXCLUDED.total_quizzes,
                total_questions_answered = EXCLUDED.total_questions_answered,
                total_correct_answers = EXCLUDED.total_correct_answers,
                accuracy = EXCLUDED.accuracy,
                fastest_response = EXCLUDED.fastest_response,
                slowest_response = EXCLUDED.slowest_response,
                last_active = NOW()
            RETURNING *
        `, [
            user_id,
            stats.total_quizzes,
            stats.total_questions_answered,
            stats.total_correct_answers,
            accuracy,
            times.fastest,
            times.slowest
        ]);

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error in /user-analysis:", err.message, err.stack);
        res.status(500).json({ message: 'Failed to update user analysis' });
    }
});
app.post('/quiz-sessions', async (req, res) => {
    const { user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered } = req.body;

    if (!user_id || !total_questions || typeof quiz_accuracy !== 'number') {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const result = await db.query(
            `INSERT INTO user_quiz_sessions 
            (user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, JSON.stringify(topics_covered)]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error in /quiz-sessions:", err.message, err.stack);
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
        console.error("Error fetching questions:", err);
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
        correct_answer
    } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_answer)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [question_text, option1, option2, option3, option4, question_type, correct_answer]
        );

        res.status(201).json({
            message: "Question added successfully",
            question: result.rows[0]
        });
    } catch (err) {
        console.error("Error inserting question:", err);
        res.status(500).json({ message: "Server error" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
