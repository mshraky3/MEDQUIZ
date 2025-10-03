import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import https from "https";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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
    // Connection pooling optimizations
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
});

// Email configuration
const Email = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    tls: true,
    secure: false,
    auth: {
        user: "alshrakynodeapp@gmail.com",
        pass: "ymfnqdsctolgcfzv",
    }
});

// Email notification functions
const sendEmail = async (to, subject, text, html = null) => {
    try {
        const result = await Email.sendMail({
            from: "alshrakynodeapp@gmail.com",
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        console.log('📧 Email sent successfully:', result.messageId);
        return result;
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        throw error;
    }
};

// Simple in-memory cache for questions
const questionsCache = {
    data: null,
    timestamp: null,
    ttl: 5 * 60 * 1000 
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

    // Convert to lowercase
    const lowercaseUsername = username.toLowerCase();
    const lowercasePassword = password.toLowerCase();

    try {
        // Check if username already exists
        const check = await db.query("SELECT * FROM accounts WHERE username = $1", [lowercaseUsername]);
        if (check.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Insert new account with proper defaults
        // isactive: true (admin creates active accounts)
        // logged: false (not logged in yet)
        // terms_accepted: false (must accept terms on first login)
        const result = await db.query(
            "INSERT INTO accounts (username, password, isactive, logged, terms_accepted) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [lowercaseUsername, lowercasePassword, true, false, false]
        );

        const newUserId = result.rows[0].id;

        // Send email notification for admin-created account
        try {
            const emailSubject = `🔧 Admin Account Created - ${username}`;
            const emailText = `
New account created by admin:

Username: ${username}
User ID: ${newUserId}
Created: ${new Date().toLocaleString()}
Created by: Admin Panel

This account has been activated and is ready for use.
            `;
            
            const emailHtml = `
                <h2>🔧 Admin Account Created</h2>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>User ID:</strong> ${newUserId}</p>
                <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Created by:</strong> Admin Panel</p>
                <p><strong>Status:</strong> Active and ready for use</p>
            `;

            await sendEmail('muhmodalshraky3@gmail.com', emailSubject, emailText, emailHtml);
            console.log('📧 Admin account creation email sent for user:', username);
        } catch (emailError) {
            console.error('❌ Failed to send admin account creation email:', emailError);
            // Don't fail the account creation if email fails
        }

        console.log(`✅ Admin created account: ${lowercaseUsername} (ID: ${newUserId})`);
        return res.status(201).json({ 
            message: 'Account created successfully',
            userId: newUserId
        });

    } catch (err) {
        console.error('❌ Error creating admin account:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

app.get('/get_all_users', async (req, res) => {
    try {
        // First, ensure accounts table has all necessary columns
        try {
            // Add missing columns if they don't exist
            await db.query(`
                ALTER TABLE accounts 
                ADD COLUMN IF NOT EXISTS email VARCHAR(255),
                ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
                ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            console.log('✅ Ensured all necessary columns exist in accounts table');
        } catch (alterErr) {
            console.log('Note: Some columns might already exist:', alterErr.message);
        }
        
        // Check what columns actually exist in the accounts table
        const columnCheck = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'accounts' AND table_schema = 'public'
            ORDER BY ordinal_position
        `);
        
        const existingColumns = columnCheck.rows.map(row => row.column_name);
        console.log('Available columns in accounts table:', existingColumns);
        
        // Build the SELECT query with only necessary columns for admin interface
        const availableColumns = existingColumns.filter(col => 
            ['id', 'username', 'password', 'logged_date', 'isactive', 'terms_accepted', 'email', 'payment_status', 'created_at'].includes(col)
        );
        
        if (availableColumns.length === 0) {
            return res.status(500).json({ message: "No valid columns found in accounts table" });
        }
        
        const selectQuery = `SELECT ${availableColumns.join(', ')} FROM accounts`;
        console.log('Executing query:', selectQuery);
        
        const result = await db.query(selectQuery);
        res.json({ users: result.rows });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: "Server error while fetching users" });
    }
});

// Helper: 30 minutes in ms
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

app.post('/login', async (req, res) => {
    console.log("Login request received:", req.body);
    const { username, password } = req.body;
    
    // Convert to lowercase
    const lowercaseUsername = username.toLowerCase();
    const lowercasePassword = password.toLowerCase();
    
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        // Lock the user row for update
        const userResult = await client.query("SELECT * FROM accounts WHERE username = $1 FOR UPDATE", [lowercaseUsername]);
        const userRow = userResult.rows[0];
        console.log(`[LOGIN] User row after SELECT FOR UPDATE:`, userRow);

        if (!userRow) {
            await client.query('ROLLBACK');
            client.release();
            console.log(`[LOGIN] No user found for username: ${lowercaseUsername}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (lowercasePassword !== userRow.password) {
            await client.query('ROLLBACK');
            client.release();
            console.log(`[LOGIN] Invalid password for username: ${lowercaseUsername}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Session timeout logic
        let now = new Date();
        if (userRow.logged) {
            const lastLogin = new Date(userRow.logged_date);
            console.log(`[LOGIN] User is already logged in. Last login: ${lastLogin}, Now: ${now}`);
            if (now - lastLogin < SESSION_TIMEOUT_MS) {
                console.log(`[LOGIN] Session still active. Overwriting session.`);
            } else {
                // Session expired, unlock
                await client.query("UPDATE accounts SET logged = $1 WHERE id = $2", [false, userRow.id]);
                console.log(`[LOGIN] Session expired. Resetting logged flag.`);
            }
        }

        // Check if already active or not
        if (!userRow.isactive) {
            await client.query('ROLLBACK');
            client.release();
            console.log(`[LOGIN] Subscription expired for username: ${lowercaseUsername}`);
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
        console.log(`[LOGIN] Set logged=true and session_token for username: ${lowercaseUsername}`);
        await client.query('COMMIT');
        client.release();
        console.log(`[LOGIN] Transaction committed for username: ${lowercaseUsername}`);

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
        // First, ensure all required columns exist in user_quiz_sessions table
        try {
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'general'
            `);
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0
            `);
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN IF NOT EXISTS avg_time_per_question DECIMAL(10, 2) DEFAULT 0
            `);
        } catch (err) {
            // Columns might already exist, ignore error
            console.log('Column creation warning:', err.message);
        }

        // Get overall stats, latest quiz, and last active
        const [statsRes, latestQuizRes, analysisRes, topicRes, durationRes, sourceRes] = await Promise.all([
            db.query(`
                SELECT 
                    COUNT(*) AS total_quizzes,
                    SUM(total_questions) AS total_questions_answered,
                    SUM(correct_answers) AS total_correct_answers
                FROM user_quiz_sessions
                WHERE user_id = $1;
            `, [userId]),
            db.query(`
                SELECT id, total_questions, correct_answers, quiz_accuracy, start_time, COALESCE(source, 'general') as source, topics_covered, duration, avg_time_per_question
                FROM user_quiz_sessions
                WHERE user_id = $1
                ORDER BY start_time DESC
                LIMIT 1;
            `, [userId]).then(result => {
                console.log('Latest Quiz Query Result:', result.rows[0]);
                return result;
            }),
            db.query(`SELECT last_active FROM user_analysis WHERE user_id = $1`, [userId]),
            db.query(`SELECT question_type, total_answered, total_correct, accuracy
                      FROM user_topic_analysis WHERE user_id = $1`, [userId]),
            db.query(`SELECT SUM(duration) AS total_duration, AVG(duration) AS avg_duration
                      FROM user_quiz_sessions WHERE user_id = $1`, [userId]),
            db.query(`
                SELECT 
                    COALESCE(source, 'general') as source,
                    COUNT(*) AS quiz_count,
                    SUM(total_questions) AS total_questions,
                    SUM(correct_answers) AS total_correct,
                    ROUND(AVG(quiz_accuracy), 2) AS avg_accuracy
                FROM user_quiz_sessions
                WHERE user_id = $1
                GROUP BY COALESCE(source, 'general')
                ORDER BY quiz_count DESC;
            `, [userId])
        ]);

        const stats = statsRes.rows[0];
        const latestQuiz = latestQuizRes.rows[0] || {};
        const lastActive = analysisRes.rows[0]?.last_active;
        const topics = topicRes.rows;
        const durationStats = durationRes.rows[0];
        const sourceBreakdown = sourceRes.rows;

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
                start_time: latestQuiz.start_time,
                source: latestQuiz.source || 'general',
                topics_covered: latestQuiz.topics_covered ? 
                    (typeof latestQuiz.topics_covered === 'string' ? 
                        JSON.parse(latestQuiz.topics_covered) : 
                        latestQuiz.topics_covered) : 
                    []
            },
            best_topic,
            worst_topic,
            total_duration,
            avg_duration,
            source_breakdown: sourceBreakdown
        };

        // Debug logging
        console.log("User analysis for user:", userId);
        console.log("Source breakdown:", sourceBreakdown);
        console.log("Latest quiz source:", latestQuiz.source);
        console.log("Latest quiz topics_covered (raw):", latestQuiz.topics_covered);
        console.log("Latest quiz topics_covered (type):", typeof latestQuiz.topics_covered);


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

app.get('/wrong-questions/user/:userId', requireSession, async (req, res) => {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    try {
        // Get wrong question attempts with question details
        const result = await db.query(`
            SELECT 
                uqa.*,
                q.question_text,
                q.correct_option,
                q.question_type,
                q.source
            FROM user_question_attempts uqa
            JOIN questions q ON uqa.question_id = q.id
            WHERE uqa.user_id = $1 
            AND uqa.is_correct = false
            ORDER BY uqa.attempted_at DESC
            LIMIT $2 OFFSET $3
        `, [userId, parseInt(limit), parseInt(offset)]);
        
        // Get total count for pagination
        const countResult = await db.query(`
            SELECT COUNT(*) as total
            FROM user_question_attempts uqa
            WHERE uqa.user_id = $1 
            AND uqa.is_correct = false
        `, [userId]);
        
        res.json({
            wrongQuestions: result.rows,
            total: parseInt(countResult.rows[0].total),
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('Error fetching wrong questions:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/all-questions', async (req, res) => {
    try {
        // Check cache first (disabled for now to ensure fresh data)
        const now = Date.now();
        // if (questionsCache.data && questionsCache.timestamp && (now - questionsCache.timestamp) < questionsCache.ttl) {
        //     return res.json({ questions: questionsCache.data });
        // }

        // Ensure source column exists in questions table
        try {
            await db.query(`
                ALTER TABLE questions 
                ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'general'
            `);
            // Update any NULL sources to 'general'
            await db.query(`
                UPDATE questions SET source = 'general' WHERE source IS NULL
            `);
        } catch (err) {
            // Column might already exist, ignore error
        }

        // Fetch all necessary fields for question library
        const result = await db.query("SELECT id, question_text, option1, option2, option3, option4, question_type, correct_option, source FROM questions");
        
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
    const sourceParam = req.query.source; // e.g., 'general', 'Midgard', 'GameBoy'
    const userId = req.query.userId; // User ID to filter completed questions
    let query = 'SELECT * FROM questions';
    let values = [];
    let conditions = [];
    
    // Handle question type filtering
    if (!typesParam || typesParam === 'mix') {
        // No filter – return all
    } else {
        const selectedTypes = typesParam.split(',');
        conditions.push(`question_type = ANY($1::text[])`);
        values.push(selectedTypes);
    }
    
    // Handle source filtering
    if (sourceParam && sourceParam !== 'mix') {
        const paramIndex = values.length + 1;
        conditions.push(`source = $${paramIndex}`);
        values.push(sourceParam);
    }

    // Handle user progress filtering - exclude completed questions
    if (userId) {
        const paramIndex = values.length + 1;
        conditions.push(`id NOT IN (
            SELECT DISTINCT question_id 
            FROM user_question_progress 
            WHERE user_id = $${paramIndex}
        )`);
        values.push(userId);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY RANDOM() LIMIT $' + (values.length + 1);

    try {
        // Log query for debugging
        console.log('Executing questions query:', query);
        console.log('Query params:', [...values, limit]);
        
        const startTime = Date.now();
        const result = await db.query(query, [...values, limit]);
        const endTime = Date.now();
        
        console.log(`Questions query executed in ${endTime - startTime}ms, returned ${result.rows.length} questions`);
        
        res.json({ questions: result.rows });
    } catch (err) {
        console.error('Error fetching questions:', err);
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
        topics_covered,
        source,
        question_ids
    } = req.body;

    if (!user_id || !total_questions || typeof quiz_accuracy !== 'number') {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // First, ensure all required columns exist in the table
        try {
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'general'
            `);
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 0
            `);
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD COLUMN IF NOT EXISTS avg_time_per_question DECIMAL(10, 2) DEFAULT 0
            `);
            // Also add a check constraint for valid sources
            await db.query(`
                ALTER TABLE user_quiz_sessions 
                ADD CONSTRAINT IF NOT EXISTS check_valid_quiz_source 
                CHECK (source IN ('general', 'Midgard', 'GameBoy'))
            `);
        } catch (err) {
            // Column might already exist, ignore error
            console.log('Column creation warning:', err.message);
        }

        // Determine the actual source based on the questions that were answered
        let actualSource = source || 'general';
        
        // If we have question IDs, determine the source from the actual questions
        if (question_ids && question_ids.length > 0) {
            try {
                const sourceQuery = await db.query(`
                    SELECT source, COUNT(*) as count 
                    FROM questions 
                    WHERE id = ANY($1) 
                    GROUP BY source 
                    ORDER BY count DESC 
                    LIMIT 1
                `, [question_ids]);
                
                if (sourceQuery.rows.length > 0) {
                    actualSource = sourceQuery.rows[0].source;
                }
            } catch (err) {
                console.log('Error determining source from questions:', err.message);
                // Fall back to the provided source
            }
        }

        console.log("Creating quiz session for user:", user_id, "with source:", actualSource);
        console.log("Question IDs:", question_ids);
        console.log("Topics covered received:", topics_covered);
        console.log("Topics covered type:", typeof topics_covered);

        const result = await db.query(
            `INSERT INTO user_quiz_sessions 
            (user_id, total_questions, correct_answers, quiz_accuracy, duration, avg_time_per_question, topics_covered, source) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [
                user_id,
                total_questions,
                correct_answers,
                quiz_accuracy,
                duration,
                avg_time_per_question,
                JSON.stringify(topics_covered),
                actualSource
            ]
        );

        // Record question progress for each answered question
        if (question_ids && question_ids.length > 0) {
            const questionDetails = await db.query(`
                SELECT id, question_type, source 
                FROM questions 
                WHERE id = ANY($1)
            `, [question_ids]);

            for (const question of questionDetails.rows) {
                await db.query(`
                    INSERT INTO user_question_progress (user_id, question_id, question_type, source)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (user_id, question_id) DO NOTHING
                `, [user_id, question.id, question.question_type, question.source || 'general']);
            }
        }

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
        correct_option,
        source = 'general'
    } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO questions (question_text, option1, option2, option3, option4, question_type, correct_option, source)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [question_text, option1, option2, option3, option4, question_type, correct_option, source]
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
        // Check if API key is available
        if (!process.env.APIKEY) {
            console.error("APIKEY environment variable is not set");
            return res.status(500).json({ error: "AI service configuration error." });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.APIKEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://medquiz.vercel.app",
                "X-Title": "MEDQIZE"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3.1:free",
                messages: [
                    {
                        role: "user",
                        content: `Here's a multiple-choice question:\n\nQuestion: ${question}\nUser's Answer: ${selected_answer}\nCorrect Answer: ${correct_option}\n\nWhich one is more accurate and why? in no longer than 40 words. if the words are less than 40 . dont say the number of words . and ne style needed just text `
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", response.status, errorText);
            return res.status(500).json({ error: "AI service failed. Please try again later." });
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
        res.status(500).json({ error: "Failed to fetch AI analysis. Please try again later." });
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

// Check if user has completed all questions in a cardinality (type + source combination)
app.get('/api/check-completion/:userId', requireSession, async (req, res) => {
    const { userId } = req.params;
    const { type, source } = req.query;
    
    try {
        // Get total questions for this cardinality
        const totalQuery = await db.query(`
            SELECT COUNT(*) as total
            FROM questions 
            WHERE question_type = $1 AND source = $2
        `, [type, source]);
        
        // Get completed questions for this cardinality
        const completedQuery = await db.query(`
            SELECT COUNT(*) as completed
            FROM user_question_progress 
            WHERE user_id = $1 AND question_type = $2 AND source = $3
        `, [userId, type, source]);
        
        const total = parseInt(totalQuery.rows[0].total);
        const completed = parseInt(completedQuery.rows[0].completed);
        const isCompleted = total > 0 && completed >= total;
        
        res.json({
            total,
            completed,
            isCompleted,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        });
    } catch (err) {
        console.error('Error checking completion:', err);
        res.status(500).json({ message: 'Failed to check completion' });
    }
});

// Award achievement when user completes a cardinality
app.post('/api/award-achievement', requireSession, async (req, res) => {
    const { userId, achievementType, achievementKey, achievementName, achievementDescription } = req.body;
    
    try {
        const result = await db.query(`
            INSERT INTO user_achievements (user_id, achievement_type, achievement_key, achievement_name, achievement_description)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id, achievement_type, achievement_key) DO NOTHING
            RETURNING *
        `, [userId, achievementType, achievementKey, achievementName, achievementDescription]);
        
        res.json({ success: true, achievement: result.rows[0] });
    } catch (err) {
        console.error('Error awarding achievement:', err);
        res.status(500).json({ message: 'Failed to award achievement' });
    }
});

// Get user achievements
app.get('/api/user-achievements/:userId', requireSession, async (req, res) => {
    const { userId } = req.params;
    
    try {
        const result = await db.query(`
            SELECT * FROM user_achievements 
            WHERE user_id = $1 
            ORDER BY earned_at DESC
        `, [userId]);
        
        res.json({ achievements: result.rows });
    } catch (err) {
        console.error('Error fetching achievements:', err);
        res.status(500).json({ message: 'Failed to fetch achievements' });
    }
});

// Reset user progress for a specific cardinality
app.post('/api/reset-progress', requireSession, async (req, res) => {
    const { userId, type, source } = req.body;
    
    try {
        await db.query(`
            DELETE FROM user_question_progress 
            WHERE user_id = $1 AND question_type = $2 AND source = $3
        `, [userId, type, source]);
        
        res.json({ success: true, message: 'Progress reset successfully' });
    } catch (err) {
        console.error('Error resetting progress:', err);
        res.status(500).json({ message: 'Failed to reset progress' });
    }
});

// Create user progress tracking tables
app.post('/init-progress-tables', async (req, res) => {
    try {
        // Create user_question_progress table to track completed questions by cardinality
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_question_progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
                question_type VARCHAR(50),
                source VARCHAR(50),
                completed_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, question_id)
            )
        `);

        // Create user_achievements table to track completed cardinalities
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_achievements (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                achievement_type VARCHAR(50) NOT NULL,
                achievement_key VARCHAR(100) NOT NULL,
                achievement_name VARCHAR(200) NOT NULL,
                achievement_description TEXT,
                earned_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(user_id, achievement_type, achievement_key)
            )
        `);

        // Create indexes for better performance
        await db.query(`CREATE INDEX IF NOT EXISTS idx_user_question_progress_user_id ON user_question_progress(user_id)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_user_question_progress_cardinality ON user_question_progress(user_id, question_type, source)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id)`);

        res.json({ message: 'Progress tracking tables initialized successfully' });
    } catch (err) {
        console.error('Error initializing progress tables:', err);
        res.status(500).json({ message: 'Failed to initialize progress tables' });
    }
});

// Debug endpoint to check database schema
app.get('/debug/schema', async (req, res) => {
    try {
        const tables = ['user_quiz_sessions', 'questions'];
        const schema = {};
        
        for (const table of tables) {
            const result = await db.query(`
                SELECT column_name, data_type, column_default, is_nullable
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [table]);
            schema[table] = result.rows;
        }
        
        res.json(schema);
    } catch (err) {
        console.error("Error fetching schema:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Debug endpoint to check quiz sessions data
app.get('/debug/quiz-sessions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.query(`
            SELECT id, user_id, total_questions, correct_answers, COALESCE(source, 'general') as source, start_time
            FROM user_quiz_sessions 
            WHERE user_id = $1 
            ORDER BY start_time DESC 
            LIMIT 10
        `, [userId]);
        
        res.json({ quiz_sessions: result.rows });
    } catch (err) {
        console.error("Error fetching quiz sessions:", err);
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
        correct_option,
        source
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
                 correct_option = $7,
                 source = $8
             WHERE id = $9
             RETURNING *`,
            [question_text, option1, option2, option3, option4,
                question_type, correct_option, source, id]
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
    const { limit = 10, types, source } = req.query;
    const numQuestions = parseInt(limit);
    
    try {
        let questions = [...FREE_TRIAL_QUESTIONS];
        
        // Filter by types if specified
        if (types && types !== 'mix') {
            const selectedTypes = types.split(',');
            questions = questions.filter(q => selectedTypes.includes(q.question_type));
        }
        
        // Filter by source if specified (for free trial, we'll use 'general' as default source)
        if (source && source !== 'mix') {
            // For free trial, we'll treat all questions as 'general' source
            // This ensures free trial users get questions regardless of source selection
            questions = questions.map(q => ({ ...q, source: 'general' }));
        } else {
            // Add source field to all questions
            questions = questions.map(q => ({ ...q, source: 'general' }));
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
        topics_covered,
        source
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
    
    if (!userId) {
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
            
            // 6. Finally, delete the user account from accounts table
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

// Note: Migration endpoint removed - using accounts table only

// ===== PAYMENT WORKFLOW ENDPOINTS =====

// REMOVED: Duplicate endpoint - using the one below with proper payment details handling

// Note: Payment status checking endpoint removed - no longer needed with simplified flow

// Note: Ko-fi webhook endpoint removed - no longer needed with simplified flow

// Note: Find by transaction ID endpoint removed - no longer needed with simplified flow

// Manual payment confirmation endpoint (for when webhook fails)
app.post('/api/payment/confirm', async (req, res) => {
    console.log('🔧 [Backend] Manual payment confirmation request received');
    try {
        const { userId } = req.body;
        console.log('🔍 [Backend] User ID for manual confirmation:', userId);
        
        if (!userId) {
            console.log('❌ [Backend] No user ID provided for manual confirmation');
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        const client = await db.connect();
        try {
            // Check if user exists
            console.log('📊 [Backend] Checking if user exists in database...');
            const userCheck = await client.query(
                'SELECT username, password FROM accounts WHERE id = $1',
                [userId]
            );
            
            if (userCheck.rows.length === 0) {
                console.log('❌ [Backend] User not found for manual confirmation:', userId);
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            
            const currentUser = userCheck.rows[0];
            console.log('📋 [Backend] Current user:', currentUser.username);
            
            // Update user to mark as paid (change password to 'paid' to indicate payment status)
            console.log('💳 [Backend] Updating user to mark as paid...');
            await client.query(
                'UPDATE accounts SET password = $1, isactive = $2 WHERE id = $3',
                ['paid', true, userId]
            );
            
            // Send email notification for payment confirmation
            try {
                const emailSubject = `💰 Payment Confirmed - User ID: ${userId}`;
                const emailText = `
Payment has been confirmed:

User ID: ${userId}
Username: ${currentUser.username}
Payment Amount: $1.00 USD (3.75 SAR)
Confirmed: ${new Date().toLocaleString()}
Status: Payment confirmed, user can now complete account setup

The user can now proceed to the signup page to create their account.
                `;
                
                const emailHtml = `
                    <h2>💰 Payment Confirmed</h2>
                    <p><strong>User ID:</strong> ${userId}</p>
                    <p><strong>Username:</strong> ${currentUser.username}</p>
                    <p><strong>Payment Amount:</strong> $1.00 USD (3.75 SAR)</p>
                    <p><strong>Confirmed:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Status:</strong> Payment confirmed, user can now complete account setup</p>
                    <p>The user can now proceed to the signup page to create their account.</p>
                `;

                await sendEmail('muhmodalshraky3@gmail.com', emailSubject, emailText, emailHtml);
                console.log('📧 Payment confirmation email sent for user:', userId);
            } catch (emailError) {
                console.error('❌ Failed to send payment confirmation email:', emailError);
                // Don't fail the payment confirmation if email fails
            }
            
            console.log(`✅ [Backend] Manual payment confirmation successful for user: ${userId}`);
            res.status(200).json({ 
                success: true, 
                message: 'Payment confirmed successfully' 
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ [Backend] Error during manual payment confirmation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to confirm payment' 
        });
    }
});

// Create user record after payment (before account setup)
app.post('/api/payment/create-user', async (req, res) => {
    try {
        const { userId, paymentDetails } = req.body;
        
        if (!userId || !paymentDetails) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and payment details are required' 
            });
        }

        const client = await db.connect();
        try {
            // Check if user already exists
            const existingUser = await client.query(
                'SELECT id FROM accounts WHERE id = $1',
                [userId]
            );
            
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User already exists' 
                });
            }

            // Create user record with 'paid' status
            // isactive: true (paid users get active accounts)
            // logged: false (not logged in yet)
            // terms_accepted: false (must accept terms on first login)
            await client.query(
                'INSERT INTO accounts (id, username, password, isactive, logged, terms_accepted) VALUES ($1, $2, $3, $4, $5, $6)',
                [userId, `temp_${userId}`, 'paid', true, false, false]
            );
            
            console.log(`✅ User record created for payment: ${userId}`);
            res.status(200).json({ 
                success: true, 
                message: 'User record created successfully',
                userId: userId
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating user record:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create user record' 
        });
    }
});

// Create account for paid user
app.post('/api/payment/create-account', async (req, res) => {
    try {
        const { userId, username, password } = req.body;
        
        if (!userId || !username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Convert to lowercase
        const lowercaseUsername = username.toLowerCase();
        const lowercasePassword = password.toLowerCase();

        const client = await db.connect();
        try {
            // Check if user exists and payment is confirmed
            const userCheck = await client.query(
                'SELECT username, password FROM accounts WHERE id = $1',
                [userId]
            );
            
            if (userCheck.rows.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            
            if (userCheck.rows[0].password !== 'paid') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Payment not confirmed' 
                });
            }

            // Check if username already exists
            const existingUser = await client.query(
                'SELECT id FROM accounts WHERE username = $1',
                [lowercaseUsername]
            );
            
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Username already exists' 
                });
            }

            // Store password as plain text for now (we'll add encryption later)
            // TODO: Add password hashing/encryption here

            // Update user with account details
            await client.query(
                'UPDATE accounts SET username = $1, password = $2 WHERE id = $3',
                [lowercaseUsername, lowercasePassword, userId]
            );
            
            // Send email notification for account completion
            try {
                const emailSubject = `✅ Account Setup Complete - ${lowercaseUsername}`;
                const emailText = `
User has completed their account setup after payment:

Username: ${lowercaseUsername}
User ID: ${userId}
Payment Method: PayPal Credit Card
Payment Amount: $1.00 USD (3.75 SAR)
Completed: ${new Date().toLocaleString()}
Status: Account is now active and ready for use

The user can now log in and access all premium features.
                `;
                
                const emailHtml = `
                    <h2>✅ Account Setup Complete</h2>
                    <p><strong>Username:</strong> ${lowercaseUsername}</p>
                    <p><strong>User ID:</strong> ${userId}</p>
                    <p><strong>Payment Method:</strong> PayPal Credit Card</p>
                    <p><strong>Payment Amount:</strong> $1.00 USD (3.75 SAR)</p>
                    <p><strong>Completed:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Status:</strong> Account is now active and ready for use</p>
                    <p>The user can now log in and access all premium features.</p>
                `;

                await sendEmail('muhmodalshraky3@gmail.com', emailSubject, emailText, emailHtml);
                console.log('📧 Account completion email sent for user:', lowercaseUsername);
            } catch (emailError) {
                console.error('❌ Failed to send account completion email:', emailError);
                // Don't fail the account creation if email fails
            }
            
            console.log(`✅ Account setup completed for user: ${lowercaseUsername} (ID: ${userId})`);
            res.status(200).json({ 
                success: true, 
                message: 'Account created successfully' 
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create account' 
        });
    }
});

// PayPal webhook endpoint for payment verification
app.post('/api/paypal/webhook', async (req, res) => {
    console.log('🔔 [PayPal Webhook] Payment notification received');
    try {
        const { event_type, resource } = req.body;
        
        // Handle payment capture events
        if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            console.log('✅ [PayPal Webhook] Payment captured successfully');
            console.log('💰 [PayPal Webhook] Payment details:', {
                id: resource.id,
                status: resource.status,
                amount: resource.amount,
                payer: resource.payer
            });
            
            // Here you would typically:
            // 1. Verify the webhook signature with PayPal
            // 2. Check if this payment ID was already processed
            // 3. Update user account status
            // 4. Send confirmation email
            
            res.status(200).json({ success: true, message: 'Webhook processed' });
        } else {
            console.log('ℹ️ [PayPal Webhook] Unhandled event type:', event_type);
            res.status(200).json({ success: true, message: 'Event type not handled' });
        }
    } catch (error) {
        console.error('❌ [PayPal Webhook] Error processing webhook:', error);
        res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
});

// PayPal payment verification endpoint
app.post('/api/paypal/verify-payment', async (req, res) => {
    console.log('🔍 [PayPal] Verifying payment...');
    try {
        const { paymentId, userId } = req.body;
        
        if (!paymentId || !userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Payment ID and User ID are required' 
            });
        }

        // In a real implementation, you would:
        // 1. Call PayPal API to verify the payment
        // 2. Check payment status and amount
        // 3. Update user account accordingly
        
        // For now, we'll simulate successful verification
        console.log('✅ [PayPal] Payment verified successfully:', paymentId);
        
        // Update user account to active
        const client = await db.connect();
        try {
            await client.query(
                'UPDATE accounts SET isactive = $1, password = $2 WHERE id = $3',
                [true, 'paid', userId]
            );
            
            res.status(200).json({ 
                success: true, 
                message: 'Payment verified and account activated' 
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ [PayPal] Error verifying payment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Payment verification failed' 
        });
    }
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
    try {
        const emailSubject = '🧪 Test Email - MEDQIZE System';
        const emailText = `
This is a test email from the MEDQIZE system.

System Status: ✅ Email system is working properly
Timestamp: ${new Date().toLocaleString()}
Server: Backend API
Purpose: Testing email notifications

If you receive this email, the notification system is working correctly.
        `;
        
        const emailHtml = `
            <h2>🧪 Test Email - MEDQIZE System</h2>
            <p><strong>System Status:</strong> ✅ Email system is working properly</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Server:</strong> Backend API</p>
            <p><strong>Purpose:</strong> Testing email notifications</p>
            <hr>
            <p>If you receive this email, the notification system is working correctly.</p>
        `;

        await sendEmail('muhmodalshraky3@gmail.com', emailSubject, emailText, emailHtml);
        
        res.status(200).json({ 
            success: true, 
            message: 'Test email sent successfully' 
        });
    } catch (error) {
        console.error('❌ Test email failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send test email',
            error: error.message 
        });
    }
});

// ===== CONTACT FORM FEATURE =====

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, mobile, subject, message } = req.body;

        if (!name || !mobile || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, mobile, and message are required'
            });
        }

        // Send email notification for contact form
        try {
            const emailSubject = `📞 Contact Form - ${subject || 'General Inquiry'}`;
            const emailText = `
New contact form submission from MEDQIZE:

Name: ${name}
Mobile: ${mobile}
Subject: ${subject || 'General Inquiry'}
Submitted: ${new Date().toLocaleString()}

Message:
${message}

Please respond to the user as soon as possible.
            `;
            
            const emailHtml = `
                <h2>📞 Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Please respond to the user as soon as possible.</p>
            `;

            await sendEmail('muhmodalshraky3@gmail.com', emailSubject, emailText, emailHtml);
            console.log('📧 Contact form email sent for:', name);
        } catch (emailError) {
            console.error('❌ Failed to send contact form email:', emailError);
            // Don't fail the contact form if email fails
        }

        res.status(200).json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

// ===== TEMPORARY SIGNUP LINKS FEATURE =====

// Create temporary signup links table
app.post('/api/admin/init-temp-links-tables', async (req, res) => {
    try {
        // Create temporary_signup_links table
        await db.query(`
            CREATE TABLE IF NOT EXISTS temporary_signup_links (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) UNIQUE NOT NULL,
                max_uses INTEGER NOT NULL DEFAULT 1,
                current_uses INTEGER NOT NULL DEFAULT 0,
                is_active BOOLEAN NOT NULL DEFAULT true,
                created_by VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP,
                last_used_at TIMESTAMP
            )
        `);

        // Create temp_link_accounts table to track accounts created from links
        await db.query(`
            CREATE TABLE IF NOT EXISTS temp_link_accounts (
                id SERIAL PRIMARY KEY,
                link_id INTEGER NOT NULL REFERENCES temporary_signup_links(id) ON DELETE CASCADE,
                user_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                username VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(link_id, user_id)
            )
        `);

        // Create indexes for better performance
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_links_token ON temporary_signup_links(token)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_links_active ON temporary_signup_links(is_active)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_link_accounts_link_id ON temp_link_accounts(link_id)`);
        await db.query(`CREATE INDEX IF NOT EXISTS idx_temp_link_accounts_user_id ON temp_link_accounts(user_id)`);

        res.json({ message: 'Temporary signup links tables initialized successfully' });
    } catch (err) {
        console.error('Error initializing temp links tables:', err);
        res.status(500).json({ message: 'Failed to initialize temp links tables' });
    }
});

// Generate temporary signup link
app.post('/api/admin/generate-temp-link', async (req, res) => {
    try {
        const { maxUses, createdBy } = req.body;
        
        if (!maxUses || maxUses < 1) {
            return res.status(400).json({ message: 'Max uses must be at least 1' });
        }

        // Generate a unique token (similar to your preferred format)
        const token = Math.random().toString(36).substring(2, 8);
        
        // Insert the new link
        const result = await db.query(
            `INSERT INTO temporary_signup_links (token, max_uses, created_by) 
             VALUES ($1, $2, $3) RETURNING *`,
            [token, maxUses, createdBy || 'admin']
        );

        const link = result.rows[0];
        // Use frontend URL instead of backend URL for the signup link
        const frontendUrl = 'https://www.smle-question-bank.com';
        const fullUrl = `${frontendUrl}/signup/${link.token}`;

        res.status(201).json({
            success: true,
            link: {
                id: link.id,
                token: link.token,
                url: fullUrl,
                maxUses: link.max_uses,
                currentUses: link.current_uses,
                isActive: link.is_active,
                createdAt: link.created_at
            }
        });
    } catch (err) {
        console.error('Error generating temp link:', err);
        res.status(500).json({ message: 'Failed to generate temporary link' });
    }
});

// Get all temporary links with statistics
app.get('/api/admin/temp-links', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                tsl.*,
                COUNT(tla.id) as accounts_created,
                ARRAY_AGG(
                    CASE 
                        WHEN tla.id IS NOT NULL 
                        THEN json_build_object(
                            'username', tla.username,
                            'created_at', tla.created_at
                        )
                        ELSE NULL 
                    END
                ) FILTER (WHERE tla.id IS NOT NULL) as created_accounts
            FROM temporary_signup_links tsl
            LEFT JOIN temp_link_accounts tla ON tsl.id = tla.link_id
            GROUP BY tsl.id
            ORDER BY tsl.created_at DESC
        `);

        // Use frontend URL instead of backend URL for the signup links
        const frontendUrl = 'https://www.smle-question-bank.com';
        
        const links = result.rows.map(link => ({
            id: link.id,
            token: link.token,
            url: `${frontendUrl}/signup/${link.token}`,
            maxUses: link.max_uses,
            currentUses: link.current_uses,
            isActive: link.is_active,
            createdBy: link.created_by,
            createdAt: link.created_at,
            lastUsedAt: link.last_used_at,
            accountsCreated: parseInt(link.accounts_created),
            createdAccounts: link.created_accounts || []
        }));

        res.json({ links });
    } catch (err) {
        console.error('Error fetching temp links:', err);
        res.status(500).json({ message: 'Failed to fetch temporary links' });
    }
});

// Validate temporary signup link
app.get('/api/validate-temp-link/:token', async (req, res) => {
    try {
        const { token } = req.params;
        
        const result = await db.query(
            `SELECT * FROM temporary_signup_links WHERE token = $1 AND is_active = true`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                valid: false, 
                message: 'Invalid or expired link' 
            });
        }

        const link = result.rows[0];
        
        if (link.current_uses >= link.max_uses) {
            // Auto-deactivate link when limit is reached
            await db.query(
                `UPDATE temporary_signup_links SET is_active = false WHERE id = $1`,
                [link.id]
            );
            
            return res.status(400).json({ 
                valid: false, 
                message: 'This link has reached its usage limit' 
            });
        }

        res.json({ 
            valid: true, 
            link: {
                id: link.id,
                token: link.token,
                maxUses: link.max_uses,
                currentUses: link.current_uses,
                remainingUses: link.max_uses - link.current_uses
            }
        });
    } catch (err) {
        console.error('Error validating temp link:', err);
        res.status(500).json({ message: 'Failed to validate link' });
    }
});

// Create account from temporary link
app.post('/api/signup/temp-link', async (req, res) => {
    try {
        const { token, username, password } = req.body;
        
        if (!token || !username || !password) {
            return res.status(400).json({ message: 'Token, username, and password are required' });
        }

        // Convert to lowercase
        const lowercaseUsername = username.toLowerCase();
        const lowercasePassword = password.toLowerCase();

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Validate the link
            const linkResult = await client.query(
                `SELECT * FROM temporary_signup_links WHERE token = $1 AND is_active = true FOR UPDATE`,
                [token]
            );

            if (linkResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(404).json({ message: 'Invalid or expired link' });
            }

            const link = linkResult.rows[0];

            if (link.current_uses >= link.max_uses) {
                // Auto-deactivate link
                await client.query(
                    `UPDATE temporary_signup_links SET is_active = false WHERE id = $1`,
                    [link.id]
                );
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'This link has reached its usage limit' });
            }

            // Check if username already exists
            const existingUser = await client.query(
                'SELECT id FROM accounts WHERE username = $1',
                [lowercaseUsername]
            );

            if (existingUser.rows.length > 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Create the account
            const accountResult = await client.query(
                `INSERT INTO accounts (username, password, isactive, logged, terms_accepted) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                [lowercaseUsername, lowercasePassword, true, false, false]
            );

            const newUserId = accountResult.rows[0].id;

            // Record the account creation in temp_link_accounts
            await client.query(
                `INSERT INTO temp_link_accounts (link_id, user_id, username) 
                 VALUES ($1, $2, $3)`,
                [link.id, newUserId, lowercaseUsername]
            );

            // Update link usage
            await client.query(
                `UPDATE temporary_signup_links 
                 SET current_uses = current_uses + 1, 
                     last_used_at = NOW(),
                     is_active = CASE 
                         WHEN current_uses + 1 >= max_uses THEN false 
                         ELSE true 
                     END
                 WHERE id = $1`,
                [link.id]
            );

            await client.query('COMMIT');

            // Send email notification
            try {
                const emailSubject = `🔗 Account Created via Temp Link - ${lowercaseUsername}`;
                const emailText = `
New account created via temporary signup link:

Username: ${lowercaseUsername}
User ID: ${newUserId}
Link Token: ${token}
Created: ${new Date().toLocaleString()}
Link Usage: ${link.current_uses + 1}/${link.max_uses}

This account was created using a temporary signup link and is ready for use.
                `;
                
                const emailHtml = `
                    <h2>🔗 Account Created via Temp Link</h2>
                    <p><strong>Username:</strong> ${lowercaseUsername}</p>
                    <p><strong>User ID:</strong> ${newUserId}</p>
                    <p><strong>Link Token:</strong> ${token}</p>
                    <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Link Usage:</strong> ${link.current_uses + 1}/${link.max_uses}</p>
                    <p>This account was created using a temporary signup link and is ready for use.</p>
                `;

                await sendEmail('muhmodalshraky3@gmail.com', emailSubject, emailText, emailHtml);
            } catch (emailError) {
                console.error('Failed to send temp link account creation email:', emailError);
            }

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                userId: newUserId
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (err) {
        console.error('Error creating account from temp link:', err);
        res.status(500).json({ message: 'Failed to create account' });
    }
});

// Deactivate temporary link manually
app.post('/api/admin/deactivate-temp-link/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query(
            `UPDATE temporary_signup_links SET is_active = false WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Link not found' });
        }

        res.json({ 
            success: true, 
            message: 'Link deactivated successfully' 
        });
    } catch (err) {
        console.error('Error deactivating temp link:', err);
        res.status(500).json({ message: 'Failed to deactivate link' });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});