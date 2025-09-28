import TelegramBot from 'node-telegram-bot-api';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const db = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// User sessions storage (in production, use Redis or database)
const userSessions = new Map();

// Load questions from CSV
const loadQuestions = async () => {
    try {
        const csvPath = path.join(__dirname, '../questions.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.split('\n').slice(1); // Skip header
        
        const questions = lines
            .filter(line => line.trim())
            .map(line => {
                const [id, question_text, option1, option2, option3, option4, question_type, correct_option] = 
                    line.split(',').map(field => field.replace(/"/g, ''));
                
                return {
                    id: parseInt(id),
                    question_text,
                    options: [option1, option2, option3, option4],
                    question_type,
                    correct_option
                };
            });
        
        console.log(`✅ Loaded ${questions.length} questions from CSV`);
        return questions;
    } catch (error) {
        console.error('❌ Error loading questions:', error);
        return [];
    }
};

// Database helper functions
const getUserOrCreate = async (telegramUser) => {
    try {
        const result = await db.query(
            'SELECT * FROM telegram_users WHERE telegram_id = $1',
            [telegramUser.id]
        );
        
        if (result.rows.length === 0) {
            // Create new user
            await db.query(
                `INSERT INTO telegram_users (telegram_id, username, first_name, last_name) 
                 VALUES ($1, $2, $3, $4)`,
                [telegramUser.id, telegramUser.username, telegramUser.first_name, telegramUser.last_name]
            );
            
            return {
                telegram_id: telegramUser.id,
                username: telegramUser.username,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                total_quizzes: 0,
                total_correct: 0,
                total_questions: 0
            };
        }
        
        return result.rows[0];
    } catch (error) {
        console.error('Error getting/creating user:', error);
        return null;
    }
};

const saveQuizSession = async (telegramUserId, questions, answers, score, totalQuestions) => {
    try {
        await db.query(
            `INSERT INTO telegram_quiz_sessions (telegram_user_id, questions, answers, score, total_questions, quiz_type)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [telegramUserId, JSON.stringify(questions), JSON.stringify(answers), score, totalQuestions, 'trial']
        );
        
        // Update user stats
        await db.query(
            `UPDATE telegram_users 
             SET total_quizzes = total_quizzes + 1,
                 total_correct = total_correct + $1,
                 total_questions = total_questions + $2,
                 last_quiz_at = CURRENT_TIMESTAMP
             WHERE telegram_id = $3`,
            [score, totalQuestions, telegramUserId]
        );
        
        // Log engagement
        await db.query(
            `INSERT INTO telegram_user_engagement (telegram_user_id, action, metadata)
             VALUES ($1, $2, $3)`,
            [telegramUserId, 'quiz_completed', JSON.stringify({ score, totalQuestions })]
        );
        
    } catch (error) {
        console.error('Error saving quiz session:', error);
    }
};

const logEngagement = async (telegramUserId, action, metadata = {}) => {
    try {
        await db.query(
            `INSERT INTO telegram_user_engagement (telegram_user_id, action, metadata)
             VALUES ($1, $2, $3)`,
            [telegramUserId, action, JSON.stringify(metadata)]
        );
    } catch (error) {
        console.error('Error logging engagement:', error);
    }
};

// Bot message handlers
const handleStart = async (msg) => {
    const chatId = msg.chat.id;
    const user = await getUserOrCreate(msg.from);
    
    if (!user) {
        return bot.sendMessage(chatId, '❌ Error initializing user. Please try again.');
    }
    
    await logEngagement(user.telegram_id, 'bot_started');
    
    const welcomeMessage = `🏥 *Welcome to MedQuiz Bot!*

Hi ${user.first_name || 'there'}! I'm here to help you practice medical knowledge through interactive quizzes.

🎯 *What you'll get:*
• Medical quiz questions from various specialties
• Instant feedback on your answers
• Score tracking to see your progress
• Access to our full web application

Ready to test your medical knowledge? Use /quiz to start!`;

    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
};

const handleQuiz = async (msg) => {
    const chatId = msg.chat.id;
    const user = await getUserOrCreate(msg.from);
    
    if (!user) {
        return bot.sendMessage(chatId, '❌ Error initializing user. Please try /start first.');
    }
    
    // Start quiz session
    const questions = await loadQuestions();
    const quizQuestions = questions.slice(0, 10); // 10 questions for trial
    
    userSessions.set(chatId, {
        userId: user.telegram_id,
        questions: quizQuestions,
        currentQuestion: 0,
        answers: [],
        startTime: Date.now()
    });
    
    await logEngagement(user.telegram_id, 'quiz_started');
    
    sendQuestion(chatId);
};

const sendQuestion = async (chatId) => {
    const session = userSessions.get(chatId);
    if (!session) return;
    
    const question = session.questions[session.currentQuestion];
    const questionNumber = session.currentQuestion + 1;
    const totalQuestions = session.questions.length;
    
    const questionText = `📝 *Question ${questionNumber}/${totalQuestions}*

${question.question_text}

*Category:* ${question.question_type}`;
    
    const options = question.options.map((option, index) => 
        `${index + 1}. ${option}`
    ).join('\n');
    
    const fullMessage = `${questionText}\n\n${options}`;
    
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '1️⃣', callback_data: `answer_0` },
                    { text: '2️⃣', callback_data: `answer_1` }
                ],
                [
                    { text: '3️⃣', callback_data: `answer_2` },
                    { text: '4️⃣', callback_data: `answer_3` }
                ]
            ]
        }
    };
    
    bot.sendMessage(chatId, fullMessage, { 
        parse_mode: 'Markdown',
        ...keyboard 
    });
};

const handleAnswer = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const answerIndex = parseInt(callbackQuery.data.split('_')[1]);
    
    const session = userSessions.get(chatId);
    if (!session) {
        return bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Session expired. Please start a new quiz.' });
    }
    
    const question = session.questions[session.currentQuestion];
    const selectedAnswer = question.options[answerIndex];
    const isCorrect = selectedAnswer === question.correct_option;
    
    // Store answer
    session.answers.push({
        question: question.question_text,
        selected: selectedAnswer,
        correct: question.correct_option,
        isCorrect,
        topic: question.question_type
    });
    
    // Show immediate feedback
    const feedback = isCorrect ? '✅ Correct!' : '❌ Incorrect!';
    const correctAnswer = `\n*Correct answer:* ${question.correct_option}`;
    
    bot.editMessageText(
        `${callbackQuery.message.text}\n\n${feedback}${isCorrect ? '' : correctAnswer}`,
        {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown'
        }
    );
    
    // Wait a moment then show next question or results
    setTimeout(() => {
        session.currentQuestion++;
        
        if (session.currentQuestion < session.questions.length) {
            sendQuestion(chatId);
        } else {
            showResults(chatId);
        }
    }, 2000);
    
    bot.answerCallbackQuery(callbackQuery.id, { text: feedback });
};

const showResults = async (chatId) => {
    const session = userSessions.get(chatId);
    if (!session) return;
    
    const score = session.answers.filter(a => a.isCorrect).length;
    const totalQuestions = session.answers.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Save quiz session to database
    await saveQuizSession(session.userId, session.questions, session.answers, score, totalQuestions);
    
    // Clear session
    userSessions.delete(chatId);
    
    // Create results message
    let resultsMessage = `🎯 *Quiz Complete!*

📊 *Your Results:*
• Score: ${score}/${totalQuestions} (${percentage}%)
• Time taken: ${Math.round((Date.now() - session.startTime) / 1000)} seconds

`;
    
    if (percentage >= 80) {
        resultsMessage += `🏆 *Excellent!* You have strong medical knowledge!`;
    } else if (percentage >= 60) {
        resultsMessage += `👍 *Good job!* You're on the right track!`;
    } else {
        resultsMessage += `📚 *Keep studying!* Practice makes perfect!`;
    }
    
    resultsMessage += `\n\n🎁 *Want more questions and detailed analysis?*

Try our full web application with:
• 4500+ medical questions
• Detailed explanations
• Progress tracking
• Specialized quizzes
• Performance analytics

👉 *Get started now:* https://medquiz.vercel.app`;
    
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '🌐 Visit Web App', url: 'https://medquiz.vercel.app' },
                    { text: '🔄 Take Another Quiz', callback_data: 'new_quiz' }
                ],
                [
                    { text: '📊 My Stats', callback_data: 'show_stats' }
                ]
            ]
        }
    };
    
    bot.sendMessage(chatId, resultsMessage, { 
        parse_mode: 'Markdown',
        ...keyboard 
    });
    
    await logEngagement(session.userId, 'app_promoted', { score, percentage });
};

const handleStats = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const session = userSessions.get(chatId);
    
    if (!session) {
        // Try to get user from database
        const result = await db.query(
            'SELECT * FROM telegram_users WHERE telegram_id = $1',
            [callbackQuery.from.id]
        );
        
        if (result.rows.length === 0) {
            return bot.answerCallbackQuery(callbackQuery.id, { text: '❌ No stats found. Take a quiz first!' });
        }
        
        const user = result.rows[0];
        const avgScore = user.total_questions > 0 ? Math.round((user.total_correct / user.total_questions) * 100) : 0;
        
        const statsMessage = `📊 *Your Statistics*

• Total quizzes: ${user.total_quizzes}
• Total questions: ${user.total_questions}
• Correct answers: ${user.total_correct}
• Average score: ${avgScore}%
• Member since: ${new Date(user.created_at).toLocaleDateString()}`;
        
        bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
    }
    
    bot.answerCallbackQuery(callbackQuery.id);
};

const handleNewQuiz = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Starting new quiz...' });
    handleQuiz({ chat: { id: chatId }, from: callbackQuery.from });
};

const handleHelp = async (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `🆘 *Help & Commands*

*Available commands:*
/start - Welcome message and introduction
/quiz - Start a medical knowledge quiz
/help - Show this help message
/about - About MedQuiz Bot

*How to use:*
1. Use /quiz to start a 10-question medical quiz
2. Answer questions by clicking the numbered buttons
3. Get instant feedback and your final score
4. Access our full web app for more features

*Questions?* Contact us at support@medquiz.com`;

    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
};

const handleAbout = async (msg) => {
    const chatId = msg.chat.id;
    const aboutMessage = `🏥 *About MedQuiz*

MedQuiz is a comprehensive medical knowledge platform designed for healthcare professionals, medical students, and anyone interested in medical education.

*Our mission:* Make medical education accessible and engaging through interactive quizzes and detailed explanations.

*Features:*
• 4500+ carefully curated medical questions
• Multiple specialties (Medicine, Surgery, Pediatrics, OB/GYN)
• Detailed explanations for each answer
• Progress tracking and analytics
• Mobile-responsive web application

*Learn more:* https://medquiz.vercel.app`;

    bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
};

// Bot event handlers
bot.on('message', async (msg) => {
    try {
        if (msg.text?.startsWith('/start')) {
            await handleStart(msg);
        } else if (msg.text?.startsWith('/quiz')) {
            await handleQuiz(msg);
        } else if (msg.text?.startsWith('/help')) {
            await handleHelp(msg);
        } else if (msg.text?.startsWith('/about')) {
            await handleAbout(msg);
        }
    } catch (error) {
        console.error('Error handling message:', error);
        bot.sendMessage(msg.chat.id, '❌ An error occurred. Please try again.');
    }
});

bot.on('callback_query', async (callbackQuery) => {
    try {
        if (callbackQuery.data.startsWith('answer_')) {
            await handleAnswer(callbackQuery);
        } else if (callbackQuery.data === 'new_quiz') {
            await handleNewQuiz(callbackQuery);
        } else if (callbackQuery.data === 'show_stats') {
            await handleStats(callbackQuery);
        }
    } catch (error) {
        console.error('Error handling callback query:', error);
        bot.answerCallbackQuery(callbackQuery.id, { text: '❌ An error occurred.' });
    }
});

// Webhook setup for Vercel
export const telegramWebhook = async (req, res) => {
    try {
        if (req.method === 'POST') {
            await bot.processUpdate(req.body);
            res.status(200).json({ success: true });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default bot;
