/**
 * Quiz engine screen — mirrors QUIZ.jsx
 * Fetches questions, manages timer, handles answer submission
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, BackHandler,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Config from '../src/constants/config';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';
import { protectedGet, protectedPost } from '../src/utils/protectedApi';
import LoadingScreen from '../src/components/ui/LoadingScreen';
import Button from '../src/components/ui/Button';
import ReportQuestionModal from '../src/components/ui/ReportQuestionModal';

export default function QuizScreen() {
    const params = useLocalSearchParams<{
        numQuestions: string; types: string; source: string;
        timer: string; id: string; isFinalQuiz: string;
    }>();

    const numQuestions = parseInt(params.numQuestions || '10');
    const types = params.types || 'mix';
    // 'mix' is NOT a legal value for the user_quiz_sessions check_valid_quiz_source
    // constraint, so the fallback must be the unified bank, not 'mix'.
    const source = params.source || 'MidgardGameBoy';
    const timerMinutes = params.timer ? parseInt(params.timer) : null;
    const userId = params.id ? parseInt(params.id) : null;
    const isFinalQuiz = params.isFinalQuiz === 'true';

    const { user, sessionToken } = useAuth();

    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
    const [quizFinished, setQuizFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dataSent, setDataSent] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(timerMinutes ? timerMinutes * 60 : null);
    const [finalDuration, setFinalDuration] = useState<number | null>(null);
    const [reportVisible, setReportVisible] = useState(false);

    const quizStartTime = useRef(Date.now());

    // Prevent back navigation during quiz
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert('Leave Quiz?', 'Your progress will be lost.', [
                { text: 'Stay', style: 'cancel' },
                { text: 'Leave', style: 'destructive', onPress: () => router.back() },
            ]);
            return true;
        });
        return () => backHandler.remove();
    }, []);

    // Timer
    useEffect(() => {
        if (!timerMinutes || quizFinished) return;
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (!prev || prev <= 1) {
                    clearInterval(interval);
                    const duration = Math.floor((Date.now() - quizStartTime.current) / 1000);
                    setFinalDuration(duration);
                    setQuizFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerMinutes, quizFinished]);

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                setError(null);
                let response;

                if (isFinalQuiz) {
                    response = await protectedGet(`${Config.API_URL}/final-quiz/questions`, {
                        params: { questionType: types, source },
                    });
                } else {
                    response = await protectedGet(`${Config.API_URL}/api/questions`, {
                        params: { limit: numQuestions, types, source, userId },
                    });
                }

                const data = response?.data;
                if (data?.questions?.length > 0) {
                    setQuestions(data.questions);
                } else {
                    setError('No questions returned.');
                }
            } catch {
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // Submit quiz data
    useEffect(() => {
        if (!userId || dataSent || !quizFinished || finalDuration === null || questions.length === 0) return;
        setDataSent(true);

        const finalAnswers = questions.map((q, i) => ({
            question: q.question_text,
            selected: questionAnswers[i],
            correct: q.correct_option,
            isCorrect: questionAnswers[i] === q.correct_option,
            topic: q.question_type,
        }));

        const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
        const accuracy = ((correctCount / finalAnswers.length) * 100).toFixed(2);
        const topicsCovered = [...new Set(questions.map((q: any) => q.question_type))];

        (async () => {
            try {
                const endpoint = isFinalQuiz ? '/final-quiz/submit' : '/quiz-sessions';

                if (isFinalQuiz) {
                    const questionAttempts = finalAnswers.map((a, i) => ({
                        questionId: questions[i].id,
                        userAnswer: a.selected,
                        correctAnswer: a.correct,
                        isCorrect: a.isCorrect,
                        timeTaken: Math.floor(finalDuration / finalAnswers.length),
                    }));

                    await protectedPost(`${Config.API_URL}${endpoint}`, {
                        userId, questionType: types, source,
                        totalQuestions: finalAnswers.length,
                        correctAnswers: correctCount,
                        timeTaken: finalDuration,
                        timeLimit: timerMinutes ? timerMinutes * 60 : null,
                        questionIds: questions.map((q: any) => q.id),
                        questionAttempts,
                        sessionMetadata: { device: 'mobile', timestamp: new Date().toISOString() },
                    });
                } else {
                    const sessionRes = await protectedPost(`${Config.API_URL}${endpoint}`, {
                        user_id: userId,
                        total_questions: finalAnswers.length,
                        correct_answers: correctCount,
                        quiz_accuracy: parseFloat(accuracy),
                        duration: finalDuration,
                        avg_time_per_question: parseFloat((finalDuration / finalAnswers.length).toFixed(2)),
                        topics_covered: topicsCovered,
                        source: source === 'mix' ? 'general' : source,
                        question_ids: questions.map((q: any) => q.id),
                    });

                    const quizSessionId = sessionRes?.data?.id;
                    if (quizSessionId) {
                        await Promise.all(
                            finalAnswers.map((answer, i) =>
                                protectedPost(`${Config.API_URL}/question-attempts`, {
                                    user_id: userId,
                                    question_id: questions[i].id,
                                    selected_option: answer.selected,
                                    is_correct: answer.isCorrect,
                                    time_taken: Math.floor(finalDuration / finalAnswers.length),
                                    quiz_session_id: quizSessionId,
                                }),
                            ),
                        );

                        await Promise.all(
                            topicsCovered.map((topic) => {
                                const topicQs = questions.filter((q: any) => q.question_type === topic);
                                const topicAs = finalAnswers.filter((_, i) => questions[i].question_type === topic);
                                const topicCorrect = topicAs.filter((a) => a.isCorrect).length;
                                return protectedPost(`${Config.API_URL}/topic-analysis`, {
                                    user_id: userId,
                                    question_type: topic,
                                    total_answered: topicQs.length,
                                    total_correct: topicCorrect,
                                    accuracy: topicQs.length > 0 ? (topicCorrect / topicQs.length) * 100 : 0,
                                    avg_time: Math.floor(finalDuration / finalAnswers.length),
                                });
                            }),
                        );
                    }
                }
            } catch (err) {
                console.error('Error sending quiz data:', err);
            }
        })();
    }, [quizFinished, finalDuration, dataSent]);

    // ─── Render helpers ───

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (!timeRemaining) return Colors.textSecondary;
        if (timeRemaining <= 60) return Colors.error;
        if (timeRemaining <= 300) return Colors.warning;
        return Colors.success;
    };

    const handleSelect = (option: string) => {
        setQuestionAnswers({ ...questionAnswers, [currentIndex]: option });
    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const handleFinish = () => {
        const unanswered = questions.filter((_, i) => !questionAnswers[i]).length;
        if (unanswered > 0) {
            Alert.alert(
                `${unanswered} Unanswered Questions`,
                'Go to the first unanswered question?',
                [
                    { text: 'Submit Anyway', onPress: finishQuiz },
                    {
                        text: 'Go to Unanswered',
                        onPress: () => {
                            const idx = questions.findIndex((_, i) => !questionAnswers[i]);
                            if (idx !== -1) setCurrentIndex(idx);
                        },
                    },
                ],
            );
            return;
        }
        finishQuiz();
    };

    const finishQuiz = () => {
        const duration = Math.floor((Date.now() - quizStartTime.current) / 1000);
        setFinalDuration(duration);
        setQuizFinished(true);
    };

    // ─── Loading / Error states ───

    if (loading) return <LoadingScreen message="Loading questions..." />;

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorIcon}>❌</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button title="Go Back" onPress={() => router.back()} variant="outline" />
                </View>
            </SafeAreaView>
        );
    }

    // ─── Result screen ───

    if (quizFinished) {
        const finalAnswers = questions.map((q, i) => ({
            selected: questionAnswers[i],
            correct: q.correct_option,
            isCorrect: questionAnswers[i] === q.correct_option,
        }));
        const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
        const total = finalAnswers.length;
        const accuracy = ((correctCount / total) * 100).toFixed(1);
        const duration = finalDuration ?? Math.floor((Date.now() - quizStartTime.current) / 1000);

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.resultScroll}>
                    <Text style={styles.resultEmoji}>{parseFloat(accuracy) >= 70 ? '🎉' : '📊'}</Text>
                    <Text style={styles.resultTitle}>Quiz Complete!</Text>
                    <Text style={styles.resultScore}>
                        {correctCount} / {total}
                    </Text>
                    <Text style={styles.resultAccuracy}>{accuracy}%</Text>
                    <Text style={styles.resultTime}>
                        Time: {Math.floor(duration / 60)}m {duration % 60}s
                    </Text>

                    {/* Answer review */}
                    <View style={styles.reviewSection}>
                        <Text style={styles.reviewTitle}>Answer Review</Text>
                        {questions.map((q, i) => {
                            const selected = questionAnswers[i];
                            const isCorrect = selected === q.correct_option;
                            return (
                                <View key={i} style={[styles.reviewCard, { borderLeftColor: isCorrect ? Colors.success : Colors.error }]}>
                                    <Text style={styles.reviewQ}>Q{i + 1}: {q.question_text}</Text>
                                    {selected && (
                                        <Text style={[styles.reviewAnswer, { color: isCorrect ? Colors.success : Colors.error }]}>
                                            Your answer: {selected} {isCorrect ? '✓' : '✗'}
                                        </Text>
                                    )}
                                    {!isCorrect && (
                                        <Text style={[styles.reviewAnswer, { color: Colors.success }]}>
                                            Correct: {q.correct_option}
                                        </Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.resultButtons}>
                        <Button title="New Quiz" onPress={() => router.replace('/(tabs)/quizs')} size="large" style={{ flex: 1 }} />
                        <Button
                            title="Analysis"
                            onPress={() => router.push('/(tabs)/analysis')}
                            variant="outline"
                            size="large"
                            style={{ flex: 1 }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // ─── Question screen ───

    const q = questions[currentIndex];
    const selectedAnswer = questionAnswers[currentIndex];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.quizHeader}>
                {/* Progress */}
                <View style={styles.progressRow}>
                    <Text style={styles.progressText}>
                        Question {currentIndex + 1}/{questions.length}
                    </Text>
                    {timeRemaining !== null && (
                        <Text style={[styles.timerText, { color: getTimerColor() }]}>
                            ⏱ {formatTime(timeRemaining)}
                        </Text>
                    )}
                </View>
                {/* Progress bar */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.questionScroll}>
                {/* Question text */}
                <Text style={styles.questionText}>{q.question_text}</Text>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    {['option1', 'option2', 'option3', 'option4'].map((optKey, idx) => {
                        const optValue = q[optKey];
                        if (!optValue) return null;
                        const isSelected = selectedAnswer === optValue;
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[styles.optionButton, isSelected && styles.optionSelected]}
                                onPress={() => handleSelect(optValue)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
                                    <Text style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                                        {String.fromCharCode(65 + idx)}
                                    </Text>
                                </View>
                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                    {optValue}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Report button */}
                {user && (
                    <TouchableOpacity style={styles.reportBtn} onPress={() => setReportVisible(true)}>
                        <Text style={styles.reportBtnText}>🚩 Report this question</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Navigation */}
            <View style={styles.navRow}>
                <TouchableOpacity
                    style={[styles.navButton, currentIndex === 0 && styles.navDisabled]}
                    onPress={handlePrev}
                    disabled={currentIndex === 0}
                >
                    <Text style={styles.navButtonText}>← Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, styles.navButtonPrimary]}
                    onPress={currentIndex === questions.length - 1 ? handleFinish : handleNext}
                >
                    <Text style={[styles.navButtonText, styles.navButtonPrimaryText]}>
                        {currentIndex === questions.length - 1 ? 'Finish' : 'Next →'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ReportQuestionModal
                visible={reportVisible}
                questionId={q?.id ?? null}
                questionText={q?.question_text}
                userId={user?.id ?? null}
                userEmail={user?.email ?? null}
                onClose={() => setReportVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    // Header
    quizHeader: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md },
    progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    progressText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
    timerText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
    progressBar: { height: 4, backgroundColor: Colors.bgCardHover, borderRadius: 2 },
    progressFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
    // Question
    questionScroll: { padding: Spacing.xl, paddingBottom: Spacing['4xl'] },
    questionText: { fontSize: FontSize.lg, color: Colors.textPrimary, lineHeight: 28, fontWeight: FontWeight.medium, marginBottom: Spacing['2xl'] },
    // Options
    optionsContainer: { gap: Spacing.md },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.md,
        padding: Spacing.lg,
        borderWidth: 1.5,
        borderColor: Colors.border,
        gap: Spacing.md,
    },
    optionSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(34, 211, 238, 0.08)' },
    optionCircle: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: Colors.bgInput,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: Colors.borderLight,
    },
    optionCircleSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    optionLetter: { color: Colors.textMuted, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
    optionLetterSelected: { color: Colors.textInverse },
    optionText: { flex: 1, color: Colors.textSecondary, fontSize: FontSize.base, lineHeight: 22 },
    optionTextSelected: { color: Colors.textPrimary },
    // Nav
    navRow: {
        flexDirection: 'row',
        padding: Spacing.xl,
        gap: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.bgCard,
    },
    navButton: {
        flex: 1, paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md, alignItems: 'center',
        backgroundColor: Colors.bgCardHover,
    },
    navButtonPrimary: { backgroundColor: Colors.primary },
    navDisabled: { opacity: 0.4 },
    navButtonText: { color: Colors.textSecondary, fontSize: FontSize.base, fontWeight: FontWeight.semibold },
    navButtonPrimaryText: { color: Colors.textInverse },
    // Report button
    reportBtn: {
        alignSelf: 'flex-end',
        marginTop: Spacing.lg,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: '#2d3f60',
    },
    reportBtnText: {
        color: '#64748b',
        fontSize: FontSize.xs,
    },
    // Error
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.lg },
    errorIcon: { fontSize: 48 },
    errorText: { color: Colors.textSecondary, fontSize: FontSize.base, textAlign: 'center' },
    // Result
    resultScroll: { padding: Spacing.xl, alignItems: 'center', paddingBottom: Spacing['5xl'] },
    resultEmoji: { fontSize: 64, marginBottom: Spacing.lg },
    resultTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.md },
    resultScore: { fontSize: FontSize['4xl'], fontWeight: FontWeight.extrabold, color: Colors.primary },
    resultAccuracy: { fontSize: FontSize.xl, color: Colors.textSecondary, marginTop: Spacing.xs },
    resultTime: { fontSize: FontSize.base, color: Colors.textMuted, marginTop: Spacing.sm, marginBottom: Spacing['2xl'] },
    resultButtons: { flexDirection: 'row', gap: Spacing.md, width: '100%', marginTop: Spacing['2xl'] },
    // Review
    reviewSection: { width: '100%', marginTop: Spacing['2xl'] },
    reviewTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.lg },
    reviewCard: {
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.md,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderLeftWidth: 4,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    reviewQ: { color: Colors.textPrimary, fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.sm },
    reviewAnswer: { fontSize: FontSize.sm, lineHeight: 18 },
});
