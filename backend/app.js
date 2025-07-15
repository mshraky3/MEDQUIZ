import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import https from "https";
import crypto from 'crypto';

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

// Simple in-memory cache for questions
const questionsCache = {
    data: null,
    timestamp: null,
    ttl: 5 * 60 * 1000 // 5 minutes
};

// Free trial questions - fixed list of 40 questions (10 from each type)
const FREE_TRIAL_QUESTIONS = [
    // Surgery questions (10)
    { id: 1, question_text: "A patient received a severe blow on the inferolateral side of the left knee joint while playing football. Radiographic examination confirmed a fracture of the head and neck of the fibula. Which of the following nerves is most vulnerable for damage?", option1: "Tibial", option2: "Deep peroneal", option3: "Common peroneal", option4: "Superficial peroneal", question_type: "surgery", correct_option: "Common peroneal" },
    { id: 2, question_text: "A 19-year-old fell on an outstretched hand while playing football. Examination confirmed tenderness over the anatomic snuff box. Which of the following is the most suspected fracture?", option1: "Colles", option2: "Cuboid", option3: "Scaphoid", option4: "Hook of hamate", question_type: "surgery", correct_option: "Scaphoid" },
    { id: 3, question_text: "A 45-year-old man had transurethral catheterization before a long surgical procedure. Postoperatively he developed hematuria and a urethral injury is suspected. Which part of the urethra is most likely injured?", option1: "Penile", option2: "Prostatic", option3: "Membranous", option4: "Middle spongy", question_type: "surgery", correct_option: "Membranous" },
    { id: 4, question_text: "A patient presented after a blunt injury over the left leg. Examination confirmed sensory loss on adjacent sides of the great and second toes, and impaired dorsiflexion of the foot. Which nerve is most likely injured?", option1: "Sural", option2: "Saphenous", option3: "Deep peroneal", option4: "Posterior tibial", question_type: "surgery", correct_option: "Deep peroneal" },
    { id: 5, question_text: "A 60-year-old man presents to the Emergency Department with epigastric pain radiating to the back. He is a smoker with long-standing diabetes and hypertension. Abdominal exam reveals a pulsatile supra-umbilical mass. What is the most likely diagnosis?", option1: "Abdominal aortic aneurysm", option2: "Secondary liver metastasis", option3: "Renal cell carcinoma", option4: "Peri-umbilical hernia", question_type: "surgery", correct_option: "Abdominal aortic aneurysm" },
    { id: 6, question_text: "A 45-year-old man presented to the Emergency Department complaining of lower abdominal pain for 3 days. He gave a history of being hit by a piece of wood in the same site of pain 4 days back. Examination revealed lethargic patient in pain, which was aggravated by moving his leg. there was grayish turbid semipurulent secretions from a small break in the skin of right lower quadrant. Which of the following is the most appropriate next step in the management?", option1: "Observation", option2: "Surgical drainage", option3: "CT scan abdomen", option4: "Culture and sensitivity for secretions", question_type: "surgery", correct_option: "Surgical drainage" },
    { id: 7, question_text: "A 37-year-old man was involved in a fight and sustained a stab wound to the neck. On presentation, patient was conscious, alert. Examination showed a 2 cm wound anterior to the left ear and close to the angle of the mandible with blood ooze. which of the following is the most appropriate next step?", option1: "Chest X ray", option2: "Observation", option3: "CTA of the neck", option4: "Exploration of the wound", question_type: "surgery", correct_option: "CTA of the neck" },
    { id: 8, question_text: "A 19-year-old woman brought to the Emergency Department after being stabbed to the right upper quadrant. On arrival, she was conscious and oriented. Examination showed only a penetrating wound to the anterior abdominal wall at anterior axillary line just below the right costal margin. Which of the following is the most appropriate next step?", option1: "Observation", option2: "CT scan abdomen", option3: "Ultrasound abdomen", option4: "Exploratory laparotomy", question_type: "surgery", correct_option: "CT scan abdomen" },
    { id: 9, question_text: "A 25-year-old man brought to the Emergency Department after he was involved in motor vehicle crash, which was driving at a speed of 130 km/hour. Patient was wearing seat belt. On arrival to the Emergency Department, he was conscious, and alert. Chest X-ray: Normal. Which of the following is the most appropriate next step?", option1: "US abdomen", option2: "CT scan abdomen", option3: "Diagnostic laparoscopy", option4: "Exploratory Laparotomy", question_type: "surgery", correct_option: "CT scan abdomen" },
    { id: 10, question_text: "A 33-year-old man was involved in a motor vehicle crash. On arrival to the Emergency Department, he was conscious and alert. Examination showed an open wound to the anterior surface of the neck with devitalized tissue. Blood pressure 100/60 mmHg Heart rate 104/min Respiratory rate 28/min Oxygen saturation 87% Which of the following is the most appropriate next step?", option1: "Oxygen mask", option2: "Tracheostomy", option3: "Cricothyroidotomy", option4: "Endotracheal intubation", question_type: "surgery", correct_option: "Endotracheal intubation" },
    
    // Medicine questions (10)
    { id: 11, question_text: "A 55-year-old man with CHF. Which therapy reduces mortality?", option1: "Digoxin", option2: "Diuretics", option3: "Anticoagulation", option4: "ACE inhibitors", question_type: "medicine", correct_option: "ACE inhibitors" },
    { id: 12, question_text: "Which crystals are responsible for pseudogout?", option1: "Calcium urate", option2: "Calcium oxalate", option3: "Calcium chloride", option4: "Calcium pyrophosphate", question_type: "medicine", correct_option: "Calcium pyrophosphate" },
    { id: 13, question_text: "A surgeon sustains a needle-stick injury from a patient with chronic hepatitis C. Risk of HCV transmission?", option1: "0.03%", option2: "0.3%", option3: "3%", option4: "30%", question_type: "medicine", correct_option: "3%" },
    { id: 14, question_text: "A 64-year-old man presents to the clinic after having first episode of right knee pain for 2 weeks duration. He asks for a medicine to relieve his pain. He does not have any other symptoms apart from epigastric burning. He has no history of injury to the knee. Examination of knee is normal. Which is the most appropriate analgesic for this patient at this stage?", option1: "Aspirin", option2: "Codeine", option3: "Ibuprofen", option4: "Paracetamol", question_type: "medicine", correct_option: "Paracetamol" },
    { id: 15, question_text: "A 40-year-old man with advanced colonic cancer. Most common site of metastasis?", option1: "Lung", option2: "Liver", option3: "Thyroid", option4: "Prostate", question_type: "medicine", correct_option: "Liver" },
    { id: 16, question_text: "What is the best way to prevent giardiasis?", option1: "Hand washing", option2: "Avoid eating fruits", option3: "Avoid eating vegetables", option4: "Prophylactic antibiotics", question_type: "medicine", correct_option: "Hand washing" },
    { id: 17, question_text: "A 40-year-old healthy woman presents to Emergency Room with a 4-hour history of sudden onset right lower limb pain. Her examination reveals intact femoral pulse but absent distal pulses, diminished sensory exam with an altered motor exam. Labs are normal. ECG shows atrial fibrillation. Which of the following is the most appropriate next step?", option1: "Heparin", option2: "Morphine", option3: "CT angiogram", option4: "Vascular ultrasound", question_type: "medicine", correct_option: "Heparin" },
    { id: 18, question_text: "A 62-year-old man with known diabetes and hypertension presents with 4-hour history of sudden left leg pain. He has a prior history of claudication after walking 200 meters relieved by rest. Non-compliant with oral hypoglycemic and statin. Smoker for 40 years. Which of the following is the most appropriate investigation?", option1: "CT angiogram", option2: "Vascular ultrasound", option3: "Conventional angiogram", option4: "Magnetic resonance angiogram", question_type: "medicine", correct_option: "CT angiogram" },
    { id: 19, question_text: "A 54-year-old man with known diabetes and heavy smoker presents with a history of classic vascular claudication of his left leg after walking 100 meters to the mosque. Pulse examination reveals intact pulses on the right leg and diminished distal pulses below the popliteal artery. Which of the following is the most appropriate way to improve his claudication distance?", option1: "Dual antiplatelet therapy", option2: "Supervised exercise program", option3: "Supervised smoking cessation", option4: "Aggressive blood sugar control program", question_type: "medicine", correct_option: "Supervised exercise program" },
    { id: 20, question_text: "A 72-year-old man known to have diabetes and hypertension presents with an ingrowing toenail. Which of the following is the most appropriate step before operating on the toe?", option1: "Start antibiotics", option2: "Examine the other toes", option3: "Swab the toe for culture", option4: "Examine peripheral pulses", question_type: "medicine", correct_option: "Examine peripheral pulses" },
    
    // Pediatric questions (10)
    { id: 21, question_text: "A pediatrician is called to attend a caesarean section delivery of 38 week's gestation baby. On delivery, the neonate does not cry immediately, appears cyanotic and floppy. After drying suctioning and stimulation, the baby cries weakly, has irregular breathing, heart rate 110/min, some flexion of extremities, and pink body with blue extremities. What is the most accurate Apgar score?", option1: "6", option2: "7", option3: "8", option4: "9", question_type: "pediatric", correct_option: "8" },
    { id: 22, question_text: "Most important food allergy to note before flu vaccine?", option1: "Chicken", option2: "Shellfish", option3: "Eggs", option4: "Nuts", question_type: "pediatric", correct_option: "Eggs" },
    { id: 23, question_text: "6-year-old with fever, oral vesicles, and cervical lymphadenopathy. Cause?", option1: "EBV", option2: "Herpes simplex", option3: "Varicella zoster", option4: "HPV", question_type: "pediatric", correct_option: "Herpes simplex" },
    { id: 24, question_text: "6-year-old with fever, vomiting, jaundice, hepatomegaly. Hepatitis type?", option1: "A", option2: "B", option3: "C", option4: "D", question_type: "pediatric", correct_option: "A" },
    { id: 25, question_text: "9-year-old from Africa with fever, meningismus, lymphocytic CSF. Cause?", option1: "Poliovirus", option2: "Coronavirus", option3: "CMV", option4: "EBV", question_type: "pediatric", correct_option: "Poliovirus" },
    { id: 26, question_text: "3-day-old febrile neonate with gram+ bacilli in CSF. Empiric treatment?", option1: "Meropenem", option2: "Cefotaxime", option3: "Gentamicin", option4: "Ampicillin", question_type: "pediatric", correct_option: "Ampicillin" },
    { id: 27, question_text: "3-year-old with fever, anemia, splenomegaly. Giemsa stain shows:", option1: "P. falciparum", option2: "P. malariae", option3: "P. ovale", option4: "P. vivax", question_type: "pediatric", correct_option: "P. falciparum" },
    { id: 28, question_text: "Most common organ affected by mumps in 4-year-old?", option1: "Skin", option2: "Lungs", option3: "Testes", option4: "Parotid", question_type: "pediatric", correct_option: "Parotid" },
    { id: 29, question_text: "Most common causative agent in pediatric acute otitis media?", option1: "Viral", option2: "Fungal", option3: "Bacterial", option4: "Mycoplasma", question_type: "pediatric", correct_option: "Bacterial" },
    { id: 30, question_text: "Which defines \"fever of unknown origin\" in pediatrics?", option1: "7 days", option2: "14 days", option3: "21 days", option4: "28 days", question_type: "pediatric", correct_option: "14 days" },
    
    // Obstetrics and Gynecology questions (10)
    { id: 31, question_text: "A 34-week pregnant woman with chlamydia. Most common neonatal infection acquired?", option1: "Eye", option2: "Ear", option3: "Liver", option4: "Lung", question_type: "obstetrics and gynecology", correct_option: "Eye" },
    { id: 32, question_text: "A 26-year-old woman planning pregnancy. Which supplement is most recommended preconception?", option1: "Zinc", option2: "Iron", option3: "Calcium", option4: "Folic acid", question_type: "obstetrics and gynecology", correct_option: "Folic acid" },
    { id: 33, question_text: "A 28-year-old woman with irregular periods and hirsutism. Most likely diagnosis?", option1: "PCOS", option2: "Hypothyroidism", option3: "Cushing's syndrome", option4: "Adrenal hyperplasia", question_type: "obstetrics and gynecology", correct_option: "PCOS" },
    { id: 34, question_text: "A 35-year-old woman with postmenopausal bleeding. First investigation?", option1: "Endometrial biopsy", option2: "Pap smear", option3: "Ultrasound", option4: "Hormone levels", question_type: "obstetrics and gynecology", correct_option: "Endometrial biopsy" },
    { id: 35, question_text: "A 24-year-old woman with severe dysmenorrhea. Most likely cause?", option1: "Endometriosis", option2: "Fibroids", option3: "PID", option4: "Adenomyosis", question_type: "obstetrics and gynecology", correct_option: "Endometriosis" },
    { id: 36, question_text: "A 30-year-old woman with amenorrhea and galactorrhea. Most likely diagnosis?", option1: "Prolactinoma", option2: "Hypothyroidism", option3: "PCOS", option4: "Pregnancy", question_type: "obstetrics and gynecology", correct_option: "Prolactinoma" },
    { id: 37, question_text: "A 40-year-old woman with heavy menstrual bleeding. Most common cause?", option1: "Fibroids", option2: "Endometrial cancer", option3: "Adenomyosis", option4: "Coagulopathy", question_type: "obstetrics and gynecology", correct_option: "Fibroids" },
    { id: 38, question_text: "A 22-year-old woman with primary amenorrhea. Most common cause?", option1: "Turner syndrome", option2: "PCOS", option3: "Hypothalamic amenorrhea", option4: "Asherman's syndrome", question_type: "obstetrics and gynecology", correct_option: "Turner syndrome" },
    { id: 39, question_text: "A 45-year-old woman with hot flashes and mood changes. Most appropriate treatment?", option1: "HRT", option2: "SSRIs", option3: "Clonidine", option4: "Lifestyle changes", question_type: "obstetrics and gynecology", correct_option: "HRT" },
    { id: 40, question_text: "A 32-year-old woman with recurrent miscarriages. Most common cause?", option1: "Chromosomal abnormalities", option2: "Uterine anomalies", option3: "Antiphospholipid syndrome", option4: "Endocrine disorders", question_type: "obstetrics and gynecology", correct_option: "Chromosomal abnormalities" }
];

// In-memory storage for free trial sessions (in production, use Redis or database)
const freeTrialSessions = new Map();

const app = express();

// Performance monitoring middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

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
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.post('/add_account', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        // Check if username already exists
        const check = await db.query("SELECT * FROM accounts WHERE username = $1", [username]);
        if (check.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Insert new account
        await db.query(
            "INSERT INTO accounts (username, password) VALUES ($1, $2)",
            [username, password]
        );

        return res.status(201).json({ message: 'Account created successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.get('/get_all_users', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, username, password, logged, logged_date, isactive FROM accounts"
        );
        res.json({ users: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching users" });
    }
});

// Helper: 30 minutes in ms
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

app.post('/login', async (req, res) => {
    console.log("Login request received:", req.body);
    const { username, password } = req.body;
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        // Lock the user row for update
        const userResult = await client.query("SELECT * FROM accounts WHERE username = $1 FOR UPDATE", [username]);
        const userRow = userResult.rows[0];
        console.log(`[LOGIN] User row after SELECT FOR UPDATE:`, userRow);

        if (!userRow) {
            await client.query('ROLLBACK');
            client.release();
            console.log(`[LOGIN] No user found for username: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (password !== userRow.password) {
            await client.query('ROLLBACK');
            client.release();
            console.log(`[LOGIN] Invalid password for username: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Session timeout logic
        let now = new Date();
        let allowLogin = true;
        if (userRow.logged) {
            const lastLogin = new Date(userRow.logged_date);
            console.log(`[LOGIN] User is already logged in. Last login: ${lastLogin}, Now: ${now}`);
            if (now - lastLogin < SESSION_TIMEOUT_MS) {
                allowLogin = false;
                console.log(`[LOGIN] Session still active. Blocking login.`);
            } else {
                // Session expired, unlock
                await client.query("UPDATE accounts SET logged = $1 WHERE id = $2", [false, userRow.id]);
                console.log(`[LOGIN] Session expired. Resetting logged flag.`);
            }
        }
        if (!allowLogin) {
            await client.query('ROLLBACK');
            client.release();
            console.log(`[LOGIN] Login blocked for username: ${username}`);
            return res.status(403).json({
                message: 'Account already logged in elsewhere.',
                alreadyLogged: true
            });
        }

        // Check if already active or not
        if (!userRow.isactive) {
            await client.query('ROLLBACK');
            client.release();
            console.log(`[LOGIN] Subscription expired for username: ${username}`);
            return res.status(403).json({
                message: 'Subscription expired',
                expired: true,
                user: userRow
            });
        }

        // Generate a session token
        const sessionToken = crypto.randomBytes(24).toString('hex');

        // Update login state and store session token
        await client.query("UPDATE accounts SET logged = $1, logged_date = $2, session_token = $3 WHERE id = $4", [true, now, sessionToken, userRow.id]);
        console.log(`[LOGIN] Set logged=true and session_token for username: ${username}`);
        await client.query('COMMIT');
        client.release();
        console.log(`[LOGIN] Transaction committed for username: ${username}`);

        const updatedUser = {
            ...userRow,
            logged: true,
            logged_date: now,
            sessionToken,
            terms_accepted: userRow.terms_accepted
        };

        return res.status(200).json({
            message: 'Login successful',
            expired: false,
            user: updatedUser,
            sessionToken,
            showTerms: !userRow.terms_accepted
        });

    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error('[LOGIN] Error during login transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Validate session endpoint
app.post('/session-validate', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await db.query("SELECT * FROM accounts WHERE username = $1", [username]);
        const userRow = user.rows[0];
        if (!userRow) {
            return res.status(401).json({ valid: false, message: 'User not found' });
        }
        let now = new Date();
        const lastLogin = new Date(userRow.logged_date);
        if (userRow.logged && (now - lastLogin < SESSION_TIMEOUT_MS)) {
            return res.status(200).json({ valid: true, user: userRow });
        } else {
            // Session expired, unlock
            await db.query("UPDATE accounts SET logged = $1 WHERE id = $2", [false, userRow.id]);
            return res.status(200).json({ valid: false, message: 'Session expired' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ valid: false, message: 'Internal server error' });
    }
});

// Add logout endpoint
app.post('/logout', async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    try {
        await db.query("UPDATE accounts SET logged = $1 WHERE username = $2", [false, username]);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/user-analysis/:userId', requireSession, async (req, res) => {
    const { userId } = req.params;
    try {
        // Get overall stats, latest quiz, and last active
        const [statsRes, latestQuizRes, analysisRes, topicRes, durationRes] = await Promise.all([
            db.query(`
                SELECT 
                    COUNT(*) AS total_quizzes,
                    SUM(total_questions) AS total_questions_answered,
                    SUM(correct_answers) AS total_correct_answers
                FROM user_quiz_sessions
                WHERE user_id = $1;
            `, [userId]),
            db.query(`
                SELECT * FROM user_quiz_sessions
                WHERE user_id = $1
                ORDER BY start_time DESC
                LIMIT 1;
            `, [userId]),
            db.query(`SELECT last_active FROM user_analysis WHERE user_id = $1`, [userId]),
            db.query(`SELECT question_type, total_answered, total_correct, accuracy
                      FROM user_topic_analysis WHERE user_id = $1`, [userId]),
            db.query(`SELECT SUM(duration) AS total_duration, AVG(duration) AS avg_duration
                      FROM user_quiz_sessions WHERE user_id = $1`, [userId])
        ]);

        const stats = statsRes.rows[0];
        const latestQuiz = latestQuizRes.rows[0] || {};
        const lastActive = analysisRes.rows[0]?.last_active;
        const topics = topicRes.rows;
        const durationStats = durationRes.rows[0];

        const totalQuizzes = parseInt(stats.total_quizzes) || 0;
        const totalQuestionsAnswered = parseInt(stats.total_questions_answered) || 0;
        const totalCorrectAnswers = parseInt(stats.total_correct_answers) || 0;

        let accuracy = 0;
        if (totalQuestionsAnswered > 0) {
            accuracy = parseFloat(((totalCorrectAnswers / totalQuestionsAnswered) * 100).toFixed(2));
        }

        // Best/Worst topic calculation
        let best_topic = null;
        let worst_topic = null;
        if (topics.length > 0) {
            // First try to find topics with 5+ questions for reliability
            const reliableTopics = topics.filter(t => t.total_answered >= 5);
            
            if (reliableTopics.length >= 2) {
                // We have enough reliable topics
                best_topic = reliableTopics.reduce((a, b) => {
                    const aAccuracy = parseFloat(a.accuracy) || 0;
                    const bAccuracy = parseFloat(b.accuracy) || 0;
                    return aAccuracy > bAccuracy ? a : b;
                });
                worst_topic = reliableTopics.reduce((a, b) => {
                    const aAccuracy = parseFloat(a.accuracy) || 0;
                    const bAccuracy = parseFloat(b.accuracy) || 0;
                    return aAccuracy < bAccuracy ? a : b;
                });
            } else if (reliableTopics.length === 1) {
                // Only one reliable topic, include all topics for comparison
                const allTopics = topics.filter(t => t.total_answered > 0);
                if (allTopics.length >= 2) {
                    best_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy > bAccuracy ? a : b;
                    });
                    worst_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy < bAccuracy ? a : b;
                    });
                } else {
                    // Only one topic total
                    best_topic = allTopics[0];
                    worst_topic = allTopics[0];
                }
            } else {
                // No reliable topics, use all topics with at least 1 question
                const allTopics = topics.filter(t => t.total_answered > 0);
                if (allTopics.length >= 2) {
                    best_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy > bAccuracy ? a : b;
                    });
                    worst_topic = allTopics.reduce((a, b) => {
                        const aAccuracy = parseFloat(a.accuracy) || 0;
                        const bAccuracy = parseFloat(b.accuracy) || 0;
                        return aAccuracy < bAccuracy ? a : b;
                    });
                } else if (allTopics.length === 1) {
                    best_topic = allTopics[0];
                    worst_topic = allTopics[0];
                }
            }
        }

        const total_duration = parseInt(durationStats.total_duration) || 0;
        const avg_duration = parseFloat(durationStats.avg_duration) || 0;

        const result = {
            total_quizzes: totalQuizzes,
            total_questions_answered: totalQuestionsAnswered,
            total_correct_answers: totalCorrectAnswers,
            avg_accuracy: accuracy,
            last_active: lastActive,
            latest_quiz: {
                id: latestQuiz.id,
                total_questions: latestQuiz.total_questions || 0,
                correct_answers: latestQuiz.correct_answers || 0,
                quiz_accuracy: latestQuiz.quiz_accuracy || 0,
                start_time: latestQuiz.start_time
            },
            best_topic,
            worst_topic,
            total_duration,
            avg_duration
        };

        res.json(result);
    } catch (err) {
        console.error("Error fetching user analysis:", err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/topic-analysis/user/:userId', requireSession, async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query("SELECT * FROM user_topic_analysis WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/question-attempts/user/:userId', requireSession, async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await db.query(
            "SELECT * FROM user_question_attempts WHERE user_id = $1 ORDER BY attempted_at DESC LIMIT 100",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/question-attempts/session/:sessionId', requireSession, async (req, res) => {
    const { sessionId } = req.params;
    try {
        const result = await db.query(
            "SELECT * FROM user_question_attempts WHERE quiz_session_id = $1 ORDER BY attempted_at ASC",
            [sessionId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/all-questions', async (req, res) => {
    try {
        // Check cache first
        const now = Date.now();
        if (questionsCache.data && questionsCache.timestamp && (now - questionsCache.timestamp) < questionsCache.ttl) {
            return res.json({ questions: questionsCache.data });
        }

        // Only fetch necessary fields for analysis page
        const result = await db.query("SELECT id, question_text, correct_option FROM questions");
        
        // Update cache
        questionsCache.data = result.rows;
        questionsCache.timestamp = now;
        
        res.json({ questions: result.rows });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/user-streaks/:user_id', requireSession, async (req, res) => {
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
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            // Calculate streaks from most recent to oldest
            for (let i = dates.length - 1; i >= 0; i--) {
                const date = dates[i];
                
                if (!prevDate) {
                    runningStreak = 1;
                } else {
                    const diffDays = (prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) {
                        runningStreak++;
                    } else if (diffDays > 1) {
                        runningStreak = 1;
                    }
                }
                
                longestStreak = Math.max(longestStreak, runningStreak);
                prevDate = date;
                
                // Current streak is the streak ending on the most recent quiz date
                // or yesterday if they haven't taken a quiz today
                if (date.getTime() === today.getTime() || date.getTime() === yesterday.getTime()) {
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

app.get('/api/questions', async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const typesParam = req.query.types; // e.g., 'mix' or 'medicine,surgery'
    let query = 'SELECT * FROM questions';
    let values = [];
    let conditions = [];
    if (!typesParam || typesParam === 'mix') {
        // No filter – return all
    } else {
        const selectedTypes = typesParam.split(',');
        conditions.push(`question_type = ANY($1::text[])`);
        values.push(selectedTypes);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY RANDOM() LIMIT $' + (values.length + 1);

    try {
        const result = await db.query(query, [...values, limit]);
        res.json({ questions: result.rows });
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

app.post('/topic-analysis', requireSession, async (req, res) => {

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

app.post('/question-attempts', requireSession, async (req, res) => {
    const { user_id, question_id, selected_option, is_correct, time_taken, quiz_session_id } = req.body;
    if (!user_id || !question_id || selected_option === undefined || is_correct === undefined || time_taken === undefined || quiz_session_id === undefined) {
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
        console.error("Error inserting question attempt:", err);
        res.status(500).json({ message: 'Failed to record question attempt' });
    }

});

app.post('/user-analysis', requireSession, async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try {
        const statsRes = await db.query(`
      SELECT 
        COUNT(*) AS total_quizzes,
        SUM(total_questions) AS total_questions_answered,
        SUM(correct_options) AS total_correct_options
      FROM user_quiz_sessions
      WHERE user_id = $1;
    `, [user_id]);

        const stats = statsRes.rows[0];

        const totalQuizzes = parseInt(stats.total_quizzes) || 0;
        const totalQuestionsAnswered = parseInt(stats.total_questions_answered) || 0;
        const totalCorrectAnswers = parseInt(stats.total_correct_answers) || 0;

        let accuracy = 0;
        if (totalQuestionsAnswered > 0) {
            accuracy = parseFloat(((totalCorrectAnswers / totalQuestionsAnswered) * 100).toFixed(2));
        }


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


app.post('/quiz-sessions', requireSession, async (req, res) => {
    const {
        user_id,
        total_questions,
        correct_answers,
        quiz_accuracy,
        duration,
        avg_time_per_question,
        topics_covered
    } = req.body;

    if (!user_id || !total_questions || typeof quiz_accuracy !== 'number') {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        console.log("Inserting quiz session for user:", [
            correct_answers,
        ]);
        const result = await db.query(
            `INSERT INTO user_quiz_sessions 
            (user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [
                user_id,
                total_questions,
                correct_answers,
                quiz_accuracy,
                duration,
                avg_time_per_question,
                JSON.stringify(topics_covered)
            ]
        );

        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error("Failed to record quiz session", err.message, err.stack);
        res.status(500).json({ message: 'Failed to record quiz session' });
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
        
        // Invalidate cache when new question is added
        questionsCache.data = null;
        questionsCache.timestamp = null;
        
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




app.get('/questions', async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM questions ORDER BY id");
        res.json({ questions: result.rows });
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ message: "Server error" });
    }
});

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

        // Invalidate cache when question is deleted
        questionsCache.data = null;
        questionsCache.timestamp = null;

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

        // Invalidate cache when question is updated
        questionsCache.data = null;
        questionsCache.timestamp = null;

        res.json({
            message: "Question updated successfully",
            question: result.rows[0]
        });
    } catch (err) {
        console.error("Error updating question:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Free trial endpoints
app.post('/free-trial/start', async (req, res) => {
    try {
        // Generate a unique trial session ID
        const trialId = 'trial_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Create trial session data
        const trialSession = {
            id: trialId,
            createdAt: new Date(),
            lastActivity: new Date(),
            isActive: true
        };
        
        // Store in memory (in production, use database)
        freeTrialSessions.set(trialId, trialSession);
        
        res.status(201).json({
            message: 'Free trial started successfully',
            trialId: trialId,
            user: {
                id: trialId,
                username: 'Free Trial User',
                isTrial: true
            }
        });
    } catch (error) {
        console.error('Error starting free trial:', error);
        res.status(500).json({ message: 'Failed to start free trial' });
    }
});

app.get('/free-trial/questions', async (req, res) => {
    const { limit = 10, types } = req.query;
    const numQuestions = parseInt(limit);
    
    try {
        let questions = [...FREE_TRIAL_QUESTIONS];
        
        // Filter by types if specified
        if (types && types !== 'mix') {
            const selectedTypes = types.split(',');
            questions = questions.filter(q => selectedTypes.includes(q.question_type));
        }
        
        // Shuffle and limit
        const shuffled = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, Math.min(numQuestions, questions.length));
        
        res.json({ questions: selectedQuestions });
    } catch (error) {
        console.error('Error fetching free trial questions:', error);
        res.status(500).json({ message: 'Failed to fetch questions' });
    }
});

app.post('/free-trial/quiz-sessions', async (req, res) => {
    const {
        trialId,
        total_questions,
        correct_answers,
        quiz_accuracy,
        duration,
        avg_time_per_question,
        topics_covered
    } = req.body;

    if (!trialId || !total_questions || typeof quiz_accuracy !== 'number') {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Update trial session activity
        const trialSession = freeTrialSessions.get(trialId);
        if (trialSession) {
            trialSession.lastActivity = new Date();
        }
        
        // In free trial, we don't store data permanently, just return success
        res.status(201).json({ 
            id: 'trial_session_' + Date.now(),
            message: 'Quiz session recorded for trial'
        });
    } catch (err) {
        console.error("Failed to record trial quiz session", err.message, err.stack);
        res.status(500).json({ message: 'Failed to record quiz session' });
    }
});

app.post('/free-trial/question-attempts', async (req, res) => {
    const { trialId, question_id, selected_option, is_correct, time_taken, quiz_session_id } = req.body;
    
    if (!trialId || !question_id || selected_option === undefined || is_correct === undefined || time_taken === undefined || quiz_session_id === undefined) {
        return res.status(400).json({ message: "Missing required attempt data" });
    }
    
    try {
        // Update trial session activity
        const trialSession = freeTrialSessions.get(trialId);
        if (trialSession) {
            trialSession.lastActivity = new Date();
        }
        
        // In free trial, we don't store data permanently, just return success
        res.status(201).json({ 
            id: 'trial_attempt_' + Date.now(),
            message: 'Question attempt recorded for trial'
        });
    } catch (err) {
        console.error("Error recording trial question attempt:", err);
        res.status(500).json({ message: 'Failed to record question attempt' });
    }
});

// Cleanup inactive trial sessions (run every hour)
setInterval(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    for (const [trialId, session] of freeTrialSessions.entries()) {
        if (session.lastActivity < oneHourAgo) {
            freeTrialSessions.delete(trialId);
            console.log(`Cleaned up inactive trial session: ${trialId}`);
        }
    }
}, 60 * 60 * 1000); // Run every hour


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// PayPal account creation endpoint
app.post('/api/paypal-create-account', async (req, res) => {
  const { username, password, email, paymentId, token, payerId } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  try {
    // Check if username already exists
    const check = await db.query("SELECT * FROM accounts WHERE username = $1", [username]);
    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Check if email already exists
    const emailCheck = await db.query("SELECT * FROM accounts WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Insert new account with PayPal payment info
    const result = await db.query(
      `INSERT INTO accounts (username, password, email, isactive, signup_method, payment_id, paypal_token, paypal_payer_id, subscription_start, subscription_end) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, username, email`,
      [
        username, 
        password, 
        email, 
        true, 
        'paypal',
        paymentId || null,
        token || null,
        payerId || null,
        new Date(),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year subscription
      ]
    );
    
    return res.status(201).json({ 
      message: 'Account created successfully',
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PayPal webhook endpoint for payment verification
app.post('/api/paypal-webhook', async (req, res) => {
  try {
    const { event_type, resource } = req.body;
    
    // Log webhook for debugging
    console.log('PayPal webhook received:', { event_type, resource_id: resource?.id });
    
    // Handle payment completion
    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const paymentId = resource.id;
      const status = resource.status;
      const amount = resource.amount?.value;
      
      console.log(`Payment ${paymentId} completed with status: ${status}, amount: ${amount}`);
      
      // You can add additional verification here if needed
      // For now, we'll just acknowledge the webhook
    }
    
    // Handle subscription events
    if (event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      const subscriptionId = resource.id;
      console.log(`Subscription ${subscriptionId} activated`);
    }
    
    if (event_type === 'BILLING.SUBSCRIPTION.CANCELLED') {
      const subscriptionId = resource.id;
      console.log(`Subscription ${subscriptionId} cancelled`);
      
      // Update user subscription status
      await db.query(
        "UPDATE accounts SET isactive = false WHERE paypal_subscription_id = $1",
        [subscriptionId]
      );
    }
    
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Verify PayPal payment endpoint
app.post('/api/verify-paypal-payment', async (req, res) => {
  const { paymentId, token, payerId } = req.body;
  
  if (!paymentId || !token || !payerId) {
    return res.status(400).json({ message: 'Missing payment verification parameters' });
  }
  
  try {
    // In a real implementation, you would verify the payment with PayPal's API
    // For now, we'll simulate successful verification
    console.log('Verifying PayPal payment:', { paymentId, token, payerId });
    
    // You can add actual PayPal API verification here
    // const verificationResult = await verifyWithPayPal(paymentId, token, payerId);
    
    res.json({ 
      verified: true, 
      message: 'Payment verified successfully',
      paymentId,
      payerId
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// Get user subscription status
app.get('/api/user-subscription/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await db.query(
      `SELECT id, username, email, isactive, signup_method, subscription_start, subscription_end 
       FROM accounts WHERE id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = result.rows[0];
    const now = new Date();
    const subscriptionEnd = new Date(user.subscription_end);
    const isActive = user.isactive && subscriptionEnd > now;
    
    res.json({
      user: {
        ...user,
        isactive: isActive,
        daysRemaining: Math.max(0, Math.ceil((subscriptionEnd - now) / (1000 * 60 * 60 * 24)))
      }
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ message: 'Failed to fetch subscription status' });
  }
});

app.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        // Start a transaction to ensure all deletions succeed or fail together
        const client = await db.connect();
        
        try {
            await client.query('BEGIN');
            
            // Delete user data from all related tables in the correct order
            // (respecting foreign key constraints)
            
            // 1. Delete question attempts
            await client.query(
                'DELETE FROM user_question_attempts WHERE user_id = $1',
                [userId]
            );
            
            // 2. Delete quiz sessions
            await client.query(
                'DELETE FROM user_quiz_sessions WHERE user_id = $1',
                [userId]
            );
            
            // 3. Delete topic analysis
            await client.query(
                'DELETE FROM user_topic_analysis WHERE user_id = $1',
                [userId]
            );
            
            // 4. Delete user streaks
            await client.query(
                'DELETE FROM user_streaks WHERE user_id = $1',
                [userId]
            );
            
            // 5. Delete user analysis
            await client.query(
                'DELETE FROM user_analysis WHERE user_id = $1',
                [userId]
            );
            
            // 6. Finally, delete the user account
            const result = await client.query(
                'DELETE FROM accounts WHERE id = $1 RETURNING username',
                [userId]
            );
            
            if (result.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'User not found' });
            }
            
            await client.query('COMMIT');
            
            res.json({ 
                message: `User '${result.rows[0].username}' and all associated data deleted successfully` 
            });
            
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
        
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Failed to delete user and associated data' });
    }
});

// Helper to extract session credentials from query or body
function getSessionCredentials(req) {
    if (req.method === 'GET') {
        return {
            username: req.query.username,
            sessionToken: req.query.sessionToken
        };
    } else {
        return {
            username: req.body.username,
            sessionToken: req.body.sessionToken
        };
    }
}

function requireSession(req, res, next) {
    const { username, sessionToken } = getSessionCredentials(req);
    if (!username || !sessionToken) {
        return res.status(401).json({ message: 'Missing session credentials' });
    }
    db.query('SELECT session_token FROM accounts WHERE username = $1', [username])
        .then(result => {
            if (!result.rows.length || result.rows[0].session_token !== sessionToken) {
                return res.status(401).json({ message: 'Session invalid or expired' });
            }
            next();
        })
        .catch(err => {
            console.error('[SESSION] Error checking session:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
}

// Endpoint to accept terms
app.post('/accept-terms', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username required' });
    try {
        await db.query('UPDATE accounts SET terms_accepted = true WHERE username = $1', [username]);
        res.status(200).json({ message: 'Terms accepted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update terms acceptance' });
    }
});