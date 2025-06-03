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
        const result = await db.query("SELECT * FROM user_analysis WHERE user_id = $1", [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No analysis found for this user' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/user-analysis', async (req, res) => {
    const { user_id } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO user_analysis (user_id) VALUES ($1) RETURNING *",
            [user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create user analysis' });
    }
});

app.post('/question-attempts', async (req, res) => {
    const { user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO user_question_attempts (user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to record attempt' });
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

app.post('/quiz-sessions', async (req, res) => {
    const { user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO user_quiz_sessions (user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, JSON.stringify(topics_covered)]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to start quiz session' });
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
    try {
        const result = await db.query(
            "INSERT INTO user_streaks (user_id) VALUES ($1) RETURNING *",
            [user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to initialize streak' });
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

app.post('/topic-analysis', async (req, res) => {
    const { user_id, question_type, total_answered, total_correct, accuracy, avg_time } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO user_topic_analysis (user_id, question_type, total_answered, total_correct, accuracy, avg_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [user_id, question_type, total_answered, total_correct, accuracy, avg_time]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add topic analysis' });
    }
});

app.get('/api/questions', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided
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