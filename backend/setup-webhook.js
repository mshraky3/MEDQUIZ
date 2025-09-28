import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

const setupWebhook = async () => {
    try {
        // Replace with your actual Vercel URL after deployment
        const webhookUrl = 'https://medquiz.vercel.app/telegram-webhook';
        
        console.log('🔗 Setting up Telegram webhook...');
        
        const result = await bot.setWebHook(webhookUrl);
        
        if (result) {
            console.log('✅ Webhook set successfully!');
            console.log(`📍 Webhook URL: ${webhookUrl}`);
        } else {
            console.log('❌ Failed to set webhook');
        }
        
        // Get webhook info
        const webhookInfo = await bot.getWebHookInfo();
        console.log('📊 Webhook Info:', JSON.stringify(webhookInfo, null, 2));
        
    } catch (error) {
        console.error('❌ Error setting up webhook:', error);
    }
};

setupWebhook();
