# Telegram Bot Setup Guide

## Prerequisites

1. ✅ Created Telegram bot with @BotFather
2. ✅ Got your bot token
3. ✅ Set up database tables

## Environment Variables

Add these to your `.env` file in the backend directory:

```env
# Add this line to your existing .env file
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

## Deployment Steps

### 1. Deploy to Vercel

```bash
# From the backend directory
vercel --prod
```

### 2. Set Up Webhook

After deployment, update the webhook URL in `setup-webhook.js`:

```javascript
const webhookUrl = "https://YOUR-VERCEL-APP-NAME.vercel.app/telegram-webhook";
```

Then run:

```bash
node setup-webhook.js
```

### 3. Test Your Bot

1. Message your bot on Telegram
2. Send `/start`
3. Send `/quiz`
4. Complete a quiz
5. Verify the app promotion appears

## Bot Features

### Commands

- `/start` - Welcome message and introduction
- `/quiz` - Start a 10-question medical quiz
- `/help` - Show help and commands
- `/about` - About MedQuiz Bot

### Quiz Flow

1. User starts quiz with `/quiz`
2. Bot sends 10 medical questions one by one
3. User selects answers using inline buttons
4. Immediate feedback after each answer
5. Final score and statistics
6. **App promotion with link to web app**
7. Options to take another quiz or view stats

### Database Tables Created

- `telegram_users` - User information and statistics
- `telegram_quiz_sessions` - Quiz session data
- `telegram_user_engagement` - User interaction tracking

## Monitoring

### Check User Engagement

```sql
SELECT
    telegram_user_id,
    COUNT(*) as total_actions,
    COUNT(CASE WHEN action = 'quiz_completed' THEN 1 END) as quizzes_taken,
    COUNT(CASE WHEN action = 'app_promoted' THEN 1 END) as app_promotions_shown
FROM telegram_user_engagement
GROUP BY telegram_user_id;
```

### View Quiz Statistics

```sql
SELECT
    COUNT(*) as total_quizzes,
    AVG(score) as average_score,
    AVG(total_questions) as avg_questions_per_quiz
FROM telegram_quiz_sessions;
```

## Troubleshooting

### Bot Not Responding

1. Check webhook status: `node setup-webhook.js`
2. Verify environment variables are set
3. Check Vercel deployment logs
4. Ensure database connection is working

### Database Errors

1. Run `node setup-telegram-tables.js` again
2. Check database credentials in `.env`
3. Verify tables exist in your database

### Webhook Issues

1. Ensure your Vercel URL is correct
2. Check that `/telegram-webhook` route is accessible
3. Verify HTTPS is working (Telegram requires HTTPS)

## Success Metrics to Track

- Number of users who start quizzes
- Quiz completion rate
- Click-through rate to web app
- User retention (returning for more quizzes)
- Average quiz scores

## Next Steps

1. Monitor bot performance and user engagement
2. A/B test different app promotion messages
3. Add more quiz types or difficulty levels
4. Implement referral system
5. Add leaderboards or achievements
