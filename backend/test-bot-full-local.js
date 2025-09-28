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

// Initialize bot with polling (for local testing)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// User sessions storage
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

// Bot message handlers
const handleStart = async (msg) => {
    const chatId = msg.chat.id;
    const user = await getUserOrCreate(msg.from);
    
    if (!user) {
        return bot.sendMessage(chatId, '❌ Error initializing user. Please try again.');
    }
    
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
    const quizQuestions = questions.slice(0, 5); // 5 questions for local testing
    
    userSessions.set(chatId, {
        userId: user.telegram_id,
        questions: quizQuestions,
        currentQuestion: 0,
        answers: [],
        startTime: Date.now()
    });
    
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
                ]
            ]
        }
    };
    
    bot.sendMessage(chatId, resultsMessage, { 
        parse_mode: 'Markdown',
        ...keyboard 
    });
};

const handleNewQuiz = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Starting new quiz...' });
    handleQuiz({ chat: { id: chatId }, from: callbackQuery.from });
};

// Bot event handlers
bot.on('message', async (msg) => {
    try {
        if (msg.text?.startsWith('/start')) {
            await handleStart(msg);
        } else if (msg.text?.startsWith('/quiz')) {
            await handleQuiz(msg);
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
        }
    } catch (error) {
        console.error('Error handling callback query:', error);
        bot.answerCallbackQuery(callbackQuery.id, { text: '❌ An error occurred.' });
    }
});

bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error);
});

console.log('🤖 Full bot is running locally with database!');
console.log('📍 Bot username: @smle_questions_bot');
console.log('🔗 Bot URL: https://t.me/smle_questions_bot');
console.log('✅ Test with /start and /quiz commands');
console.log('⚠️  This is LOCAL TESTING - use webhook for production!');
