-- Database Performance Indexes for MEDQIZE
-- Run this script in your PostgreSQL database to improve query performance

-- Index for user_question_attempts table
-- This will significantly speed up the question-attempts/user/:userId endpoint
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_user_id 
ON user_question_attempts(user_id);

-- Composite index for user_question_attempts with ordering
-- This will speed up queries that filter by user_id and order by attempted_at
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_user_id_attempted_at 
ON user_question_attempts(user_id, attempted_at DESC);

-- Index for user_quiz_sessions table
-- This will speed up streak calculations and user analysis queries
CREATE INDEX IF NOT EXISTS idx_user_quiz_sessions_user_id 
ON user_quiz_sessions(user_id);

-- Index for user_quiz_sessions with time ordering
-- This will speed up queries that need the latest quiz sessions
CREATE INDEX IF NOT EXISTS idx_user_quiz_sessions_user_id_start_time 
ON user_quiz_sessions(user_id, start_time DESC);

-- Index for user_question_attempts by quiz session
-- This will speed up the question-attempts/session/:sessionId endpoint
CREATE INDEX IF NOT EXISTS idx_user_question_attempts_quiz_session_id 
ON user_question_attempts(quiz_session_id);

-- Index for user_topic_analysis table
-- This will speed up topic analysis queries
CREATE INDEX IF NOT EXISTS idx_user_topic_analysis_user_id 
ON user_topic_analysis(user_id);

-- Index for questions table (if not already exists)
-- This will speed up question lookups
CREATE INDEX IF NOT EXISTS idx_questions_id 
ON questions(id);

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('user_question_attempts', 'user_quiz_sessions', 'user_topic_analysis', 'questions')
ORDER BY tablename, indexname; 