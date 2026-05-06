# Free Trial Implementation - MEDQIZE

## Overview

The free trial feature allows users to experience the MEDQIZE platform with a limited set of 40 carefully selected questions without requiring registration or login.

## Features

### 🎯 Free Trial Experience

- **40 Sample Questions**: 10 questions from each of the 4 question types (Surgery, Medicine, Pediatrics, Obstetrics & Gynecology)
- **No Registration Required**: Users can start immediately without creating an account
- **Full Quiz Experience**: Complete quiz taking with timer, scoring, and results
- **Separate Trial Analysis**: Dedicated analysis page for trial users that doesn't affect normal accounts
- **Temporary Data**: All trial data is automatically cleaned up after 1 hour of inactivity

### 🔄 User Flow

1. **Landing Page**: User clicks "Get Started Now" → Trial popup appears
2. **Trial Start**: User chooses "Free Trial" → Trial session created
3. **Quiz Selection**: User selects number of questions and types
4. **Quiz Taking**: User takes quiz with trial questions
5. **Results**: User sees results with "Contact Us" and "View Free Analysis" buttons
6. **Trial Analysis**: User navigates to separate `/analysis-temp` page
7. **Cleanup**: Trial data is automatically removed after 1 hour

## Technical Implementation

### Backend (Node.js)

#### Endpoints

- `POST /free-trial/start` - Creates a new trial session
- `GET /free-trial/questions` - Returns trial questions (filtered by type)
- `POST /free-trial/quiz-sessions` - Records trial quiz sessions
- `POST /free-trial/question-attempts` - Records individual question attempts

#### Data Storage

- **In-Memory Storage**: Trial sessions stored in `Map` for quick access
- **Fixed Questions**: 40 predefined questions in `FREE_TRIAL_QUESTIONS` array
- **Automatic Cleanup**: Inactive sessions removed after 1 hour

#### Trial Questions

```javascript
const FREE_TRIAL_QUESTIONS = [
  // 10 Surgery questions
  // 10 Medicine questions
  // 10 Pediatric questions
  // 10 Obstetrics & Gynecology questions
];
```

### Frontend (React)

#### Components Updated

- **Landing.jsx**: Added trial popup and trial start functionality
- **QUIZS.jsx**: Added trial user detection and UI modifications
- **QUIZ.jsx**: Added trial-specific API calls and data handling
- **Result.jsx**: Added trial-specific buttons and messaging
- **TrialAnalysis.jsx**: **NEW** - Separate analysis component for trial users
- **Analysis.jsx**: **UNCHANGED** - Normal analysis remains untouched
- **StreakInfo.jsx**: Updated to handle both normal and trial accounts
- **QuestionAttemptsTable.jsx**: Updated to handle both normal and trial accounts
- **TopicAnalysisTable.jsx**: Updated to handle both normal and trial accounts

#### Trial Data Flow

1. **Session Storage**: Trial answers stored in `sessionStorage` as `trialAnswers`
2. **Data Format**: JSON array of answer objects with question, selected, correct, isCorrect, and topic
3. **Separate Analysis**: Trial data processed in dedicated `TrialAnalysis` component
4. **Cleanup**: Data removed from sessionStorage after analysis viewing

#### Trial User Detection

```javascript
// Trial users have IDs starting with 'trial_'
const isTrial = id && id.startsWith("trial_");
```

#### Routing

- **Normal Analysis**: `/analysis` - Unchanged, works exactly as before
- **Trial Analysis**: `/analysis-temp` - New route for trial users only

## UI/UX Features

### Trial-Specific Elements

- **Trial Notice Banners**: Purple gradient banners indicating trial mode
- **Restricted Features**: Streak tracking and AI analysis show upgrade prompts
- **Contact Integration**: WhatsApp links for easy communication
- **Responsive Design**: All trial elements work on mobile and desktop

### Visual Indicators

- 🎯 Trial mode indicators throughout the app
- ⭐ Upgrade prompts for premium features
- 📞 Contact buttons for full access
- 🔥 Streak badges (hidden for trial users)

## Security & Data Management

### Data Privacy

- **No Permanent Storage**: Trial data not stored in database
- **Session-Based**: Data only exists during browser session
- **Automatic Cleanup**: Inactive sessions removed automatically
- **No Personal Info**: No collection of personal information

### Session Management

- **Unique IDs**: Each trial session gets unique identifier
- **Activity Tracking**: Last activity timestamp for cleanup
- **Memory Efficient**: In-memory storage with automatic cleanup

## Configuration

### Environment Variables

No additional environment variables required for trial functionality.

### Customization

- **Question Count**: Modify `FREE_TRIAL_QUESTIONS` array
- **Session Duration**: Change cleanup interval in backend
- **UI Messages**: Update trial-specific text in components
- **Contact Links**: Modify WhatsApp URLs in components

## Testing

### Test Scenarios

1. **Trial Start**: Verify trial session creation
2. **Quiz Taking**: Test quiz functionality with trial questions
3. **Trial Analysis**: Verify separate trial analysis page works correctly
4. **Normal Analysis**: Verify normal analysis page is completely unaffected
5. **Data Cleanup**: Test automatic session cleanup
6. **Error Handling**: Test missing trial data scenarios

### Manual Testing

1. Start free trial from landing page
2. Take a quiz with trial questions
3. View results and navigate to trial analysis
4. Verify normal analysis page still works for regular users
5. Verify trial data cleanup after 1 hour

### Key Benefits

- **Complete Separation**: Trial functionality doesn't affect normal accounts at all
- **No Interference**: Normal analysis page works exactly as before
- **Isolated Testing**: Trial features can be tested independently
- **Easy Maintenance**: Changes to trial features don't risk breaking normal functionality

## Future Enhancements

### Potential Improvements

- **Trial Limits**: Limit number of trial sessions per IP
- **Analytics**: Track trial conversion rates
- **Personalization**: Customize trial questions based on user behavior
- **Social Sharing**: Allow trial users to share results
- **Email Capture**: Optional email collection for follow-up

### Scalability Considerations

- **Database Storage**: Move to Redis or database for production
- **CDN Integration**: Serve trial questions from CDN
- **Caching**: Implement caching for trial questions
- **Load Balancing**: Distribute trial sessions across servers

## Support

For questions or issues with the free trial implementation, contact the development team or refer to the main project documentation.
