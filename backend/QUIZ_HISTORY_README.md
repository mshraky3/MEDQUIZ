# Quiz Session History System

## Overview

The quiz session history system has been implemented to maintain and display records for all quiz sessions, not just the most recent one. This enables comprehensive progress tracking and performance analysis over time.

## Key Features

### 🗄️ Database Enhancements

- **Unique Session IDs**: Each quiz session now has a unique UUID for precise tracking
- **Enhanced Session Data**: Additional fields for comprehensive session information
- **Optimized Indexing**: Improved query performance for historical data retrieval
- **Backward Compatibility**: Existing data is preserved and enhanced

### 📊 New Database Fields

| Field                   | Type        | Description                                  |
| ----------------------- | ----------- | -------------------------------------------- |
| `session_id`            | UUID        | Unique identifier for each session           |
| `end_time`              | TIMESTAMP   | Calculated end time of the session           |
| `quiz_type`             | VARCHAR(50) | Type of quiz (practice, exam, review)        |
| `difficulty_level`      | VARCHAR(20) | Difficulty level (easy, medium, hard, mixed) |
| `device_type`           | VARCHAR(20) | Device used (desktop, mobile, tablet)        |
| `fastest_question_time` | INTEGER     | Fastest question response time               |
| `slowest_question_time` | INTEGER     | Slowest question response time               |
| `session_metadata`      | JSONB       | Additional session information               |

### 🔧 Backend API Endpoints

#### Get Quiz Session History

```
GET /quiz-sessions/history/:userId
```

**Query Parameters:**

- `page` (default: 1) - Page number for pagination
- `limit` (default: 10) - Number of sessions per page
- `source` - Filter by source (general, Midgard, GameBoy)
- `quiz_type` - Filter by quiz type (practice, exam, review)
- `start_date` - Filter sessions from this date
- `end_date` - Filter sessions until this date

**Response:**

```json
{
  "sessions": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_sessions": 50,
    "limit": 10
  }
}
```

#### Get Detailed Session Information

```
GET /quiz-sessions/:sessionId
```

**Response:**

```json
{
  "session": {
    "id": 123,
    "session_id": "uuid-here",
    "total_questions": 20,
    "correct_answers": 16,
    "quiz_accuracy": 80.0,
    "duration": 1200,
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T10:20:00Z",
    "source": "general",
    "quiz_type": "practice",
    "difficulty_level": "mixed",
    "device_type": "desktop",
    "fastest_question_time": 5,
    "slowest_question_time": 45,
    "session_metadata": {}
  },
  "question_attempts": [...]
}
```

#### Get Session Statistics

```
GET /quiz-sessions/stats/:userId
```

**Query Parameters:**

- `period` - Time period (all, week, month, year)

**Response:**

```json
{
  "overall_stats": {
    "total_sessions": 25,
    "total_questions_answered": 500,
    "average_accuracy": 75.5,
    "average_duration": 1200
  },
  "accuracy_trends": [...],
  "source_breakdown": [...]
}
```

### 🎨 Frontend Components

#### QuizHistory Component

- **Location**: `my-react-app/src/components/analysis/QuizHistory.jsx`
- **Features**:
  - Paginated session list with filtering
  - Session details modal with question attempts
  - Performance metrics visualization
  - Responsive design for all devices

#### Integration

- **Analysis Page**: New "📈 History" tab added
- **Tabbed Interface**: Seamlessly integrated with existing analysis sections
- **Mobile Responsive**: Optimized for mobile and tablet devices

## Migration Instructions

### 1. Run Database Migration

```bash
cd backend
node run-migration.js
```

### 2. Update Frontend

The frontend components are already integrated. No additional setup required.

### 3. Test the System

1. Take a quiz to create a new session
2. Navigate to Analysis → History tab
3. Verify session data is displayed correctly
4. Test filtering and pagination features

## Usage Examples

### Frontend Integration

```jsx
import QuizHistory from "./components/analysis/QuizHistory";

// In your component
<QuizHistory userId={userId} sessionToken={sessionToken} />;
```

### API Usage

```javascript
// Get user's quiz history
const response = await fetch("/quiz-sessions/history/123?page=1&limit=10");
const data = await response.json();

// Get specific session details
const sessionResponse = await fetch("/quiz-sessions/456");
const sessionData = await sessionResponse.json();
```

## Benefits

### For Users

- **Progress Tracking**: View all quiz attempts over time
- **Performance Analysis**: Identify strengths and weaknesses
- **Goal Setting**: Set and track improvement targets
- **Historical Context**: Understand learning progression

### For Administrators

- **User Analytics**: Comprehensive user behavior insights
- **System Performance**: Monitor quiz system usage
- **Content Optimization**: Identify popular and challenging topics
- **Progress Reporting**: Generate detailed progress reports

## Technical Considerations

### Performance

- **Indexed Queries**: Optimized database indexes for fast retrieval
- **Pagination**: Efficient handling of large datasets
- **Caching**: Consider implementing Redis caching for frequently accessed data

### Security

- **Session Validation**: All endpoints require valid session tokens
- **Data Privacy**: User data is properly isolated and secured
- **Input Validation**: All inputs are validated and sanitized

### Scalability

- **Database Optimization**: Efficient queries with proper indexing
- **Pagination**: Handles large datasets without performance issues
- **Modular Design**: Easy to extend with additional features

## Future Enhancements

### Planned Features

- **Export Functionality**: Download session data as CSV/PDF
- **Advanced Analytics**: Machine learning insights
- **Goal Tracking**: Set and monitor learning objectives
- **Social Features**: Compare progress with peers
- **Notification System**: Progress reminders and achievements

### API Extensions

- **Bulk Operations**: Batch processing of session data
- **Real-time Updates**: WebSocket support for live progress
- **Advanced Filtering**: More sophisticated query options
- **Data Visualization**: Chart and graph data endpoints

## Troubleshooting

### Common Issues

1. **Migration Fails**: Check database permissions and connection
2. **Sessions Not Loading**: Verify user authentication and API endpoints
3. **Performance Issues**: Check database indexes and query optimization

### Support

For technical support or questions about the quiz history system, please refer to the development team or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Compatibility**: Node.js 14+, PostgreSQL 12+
