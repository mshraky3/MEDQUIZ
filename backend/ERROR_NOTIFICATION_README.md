# Error Email Notification System

A comprehensive error notification system that automatically sends beautifully formatted HTML emails to developers when critical errors occur in the application.

## Features

- **Automatic Error Classification**: Errors are automatically classified as CRITICAL, HIGH, MEDIUM, or LOW based on status codes and error types
- **Rate Limiting**: Prevents email spam with max 20 emails/hour and 5-minute cooldown for same error types
- **Beautiful HTML Emails**: Professional gradient headers, color-coded badges, and mobile-responsive design
- **Offline Queue**: Frontend stores errors when network fails, sends when back online
- **Error Tracking**: Unique error IDs for tracking, frequency badges for repeating errors

## Files Created

### Backend
1. **`backend/services/errorNotificationService.js`** - Core service for sending error notification emails
2. **`backend/routes/error-report.js`** - API routes for receiving error reports from frontend

### Frontend
1. **`my-react-app/src/utils/errorTracking.js`** - Frontend utility for capturing and reporting errors
2. **`my-react-app/src/utils/apiClient.js`** - Pre-configured axios instance with error interceptors
3. **`my-react-app/src/components/common/ErrorBoundary.jsx`** - Enhanced ErrorBoundary with error reporting

## Setup

### 1. Environment Variables

Add these to your backend `.env` file:

```env
# Email Configuration (for error notifications)
ERROR_EMAIL_USER=your-email@gmail.com
ERROR_EMAIL_PASS=your-app-specific-password

# Developer emails (comma-separated)
DEVELOPER_EMAILS=dev1@example.com,dev2@example.com

# App URL (for links in emails)
APP_URL=https://www.smle-question-bank.com

# Environment
NODE_ENV=production
```

### 2. Gmail App Password

To use Gmail SMTP:
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in `ERROR_EMAIL_PASS`

## Usage

### Frontend - Automatic Error Tracking

The system automatically catches:
- **API Errors**: All axios/fetch errors are intercepted
- **React Render Errors**: ErrorBoundary catches component crashes
- **Unhandled Promise Rejections**: Global handler catches async errors
- **Global JavaScript Errors**: Window error events are captured

Error tracking is initialized in `main.jsx`:

```jsx
import { initErrorTracking } from './utils/errorTracking.js';
initErrorTracking();
```

### Frontend - Using the API Client

Replace direct axios calls with the pre-configured client:

```jsx
// Before
import axios from 'axios';
const response = await axios.get(`${Globals.URL}/api/questions`);

// After
import apiClient from '../utils/apiClient';
const response = await apiClient.get('/api/questions');
```

### Frontend - Manual Error Reporting

```jsx
import { reportError } from '../utils/errorTracking';

try {
  // risky operation
} catch (error) {
  reportError('CUSTOM_ERROR', 'Something went wrong', {
    endpoint: '/api/custom',
    statusCode: 500,
    additionalInfo: { customData: 'value' }
  });
}
```

### Backend - Error Middleware

The global error handling middleware is automatically added to catch all unhandled errors:

```javascript
// In app.js - already integrated
app.use(async (err, req, res, next) => {
  await notifyBackendError(err, req);
  res.status(err.statusCode || 500).json({ message: err.message });
});
```

### Backend - Manual Error Notification

```javascript
import { notifyBackendError } from './services/errorNotificationService.js';

try {
  // risky database operation
} catch (error) {
  await notifyBackendError(error, req, {
    operation: 'database_query',
    table: 'users'
  });
}
```

## API Endpoints

### POST `/api/error-report`
Receive single error report from frontend.

**Request Body:**
```json
{
  "errorType": "DATABASE_CONNECTION_ERROR",
  "message": "Error message here",
  "endpoint": "/api/endpoint",
  "method": "GET",
  "statusCode": 500,
  "page": "/current-page-url",
  "userAgent": "Browser info",
  "userId": 123,
  "username": "user_name",
  "timestamp": "2024-01-15T10:30:00Z",
  "stackTrace": "Error stack trace...",
  "requestData": {},
  "responseData": {},
  "additionalInfo": {}
}
```

### POST `/api/error-report/batch`
Receive multiple error reports (for offline queue flush).

**Request Body:**
```json
{
  "errors": [/* array of error objects */]
}
```

### GET `/api/error-report/status`
Get rate limiting status (for monitoring).

## Error Severity Classification

| Severity | Criteria | Email Sent |
|----------|----------|------------|
| CRITICAL | Database errors, 500+ status codes, connection failures | ✅ Yes |
| HIGH | Authentication errors (401/403), unknown errors | ✅ Yes |
| MEDIUM | 4xx client errors | ❌ No |
| LOW | Other minor errors | ❌ No |

## Email Template Preview

The email includes:
- Gradient header with severity badge
- Error type and message
- Error details table (time, page, endpoint, status, user, browser)
- Request/Response data in code blocks
- Stack trace in dark theme code block
- Quick action buttons
- Environment badge (Production/Development)
- Unique Error ID for tracking

## Rate Limiting

- **Maximum 20 emails per hour** globally
- **5-minute cooldown** for the same error type (based on errorType + endpoint + statusCode)
- **Frequency tracking** shows how many times the same error occurred

## Best Practices

1. **Don't expose sensitive data**: The system sanitizes request/response data, but avoid logging passwords
2. **Use meaningful error types**: Custom error types help categorize issues
3. **Check rate limit status**: Monitor `/api/error-report/status` to ensure alerts are being sent
4. **Review email patterns**: Frequent same errors indicate systemic issues
5. **Keep developer emails updated**: Add/remove developers in `DEVELOPER_EMAILS` as needed
