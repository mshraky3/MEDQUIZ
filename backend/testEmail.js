import dotenv from 'dotenv';
dotenv.config();
import { sendErrorNotification } from './services/errorNotificationService.js';

const testError = {
    errorType: 'CRITICAL_TEST_ERROR',
    message: 'Testing the improved email design - looks beautiful!',
    endpoint: '/api/quiz/submit',
    method: 'POST',
    statusCode: 500,
    page: '/quiz',
    userAgent: 'Chrome/120.0.0.0',
    timestamp: new Date().toISOString(),
    stackTrace: 'Error: Test error\n    at submitQuiz (quiz.js:142)\n    at handleSubmit (handler.js:89)',
    requestData: { quizId: 'SMLE-2024', questionId: 42 },
    additionalInfo: { sessionId: 'test-session-123' }
};

sendErrorNotification(testError).then(result => {
    console.log('Result:', JSON.stringify(result, null, 2));
    process.exit(0);
}).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
