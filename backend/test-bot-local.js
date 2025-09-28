import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

// Test bot locally with polling (for development only)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('🤖 Bot is running locally in polling mode...');
console.log('📍 Bot username: @smle_questions_bot');
console.log('🔗 Bot URL: https://t.me/smle_questions_bot');

// Simple test handlers
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    console.log(`📨 Received message: "${text}" from user: ${msg.from.username || msg.from.first_name}`);

    if (text === '/start') {
        bot.sendMessage(chatId, `🏥 Welcome to MedQuiz Bot!\n\nHi ${msg.from.first_name}! I'm your medical quiz assistant.\n\nTo start a quiz, use: /quiz\nFor help: /help`);
    } else if (text === '/quiz') {
        bot.sendMessage(chatId, '📝 Quiz feature will be available after deployment!\n\nDeploy to Vercel and set up webhook to enable full functionality.');
    } else if (text === '/help') {
        bot.sendMessage(chatId, '🆘 Available commands:\n/start - Welcome message\n/quiz - Start quiz (after deployment)\n/help - Show this help');
    } else {
        bot.sendMessage(chatId, '❓ I didn\'t understand that. Try /help for available commands.');
    }
});

bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error);
});

console.log('✅ Bot is ready! Message @smle_questions_bot on Telegram to test.');
console.log('⚠️  Remember: This is local testing only. For production, deploy to Vercel and use webhooks.');
