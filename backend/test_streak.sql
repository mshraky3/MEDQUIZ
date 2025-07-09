-- Test script to verify streak calculation
-- This will create test data and show how the streak calculation works

-- First, let's see what data we currently have for user 14
SELECT 
    user_id,
    DATE(COALESCE(end_time, start_time)) AS quiz_date,
    COUNT(*) as quizzes_on_date
FROM user_quiz_sessions 
WHERE user_id = 14
GROUP BY user_id, DATE(COALESCE(end_time, start_time))
ORDER BY quiz_date DESC;

-- Now let's see the streak calculation logic in action
WITH quiz_dates AS (
    SELECT DISTINCT DATE(COALESCE(end_time, start_time)) AS quiz_date
    FROM user_quiz_sessions 
    WHERE user_id = 14
    ORDER BY quiz_date ASC
),
date_analysis AS (
    SELECT 
        quiz_date,
        LAG(quiz_date) OVER (ORDER BY quiz_date) as prev_date,
        LEAD(quiz_date) OVER (ORDER BY quiz_date) as next_date
    FROM quiz_dates
)
SELECT 
    quiz_date,
    prev_date,
    next_date,
    CASE 
        WHEN prev_date IS NULL THEN 1
        WHEN quiz_date - prev_date = 1 THEN 1
        ELSE 0
    END as continues_streak,
    CASE 
        WHEN next_date IS NULL THEN 1
        WHEN next_date - quiz_date = 1 THEN 1
        ELSE 0
    END as streak_continues
FROM date_analysis
ORDER BY quiz_date DESC;

SELECT CURRENT_DATE as today; 