/**
 * Analysis dashboard — mirrors Analysis.jsx
 * Tabs: Overview, Topics, Recent, History, Progress, Final Exams
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../src/constants/theme';
import Config from '../../src/constants/config';
import { useAuth } from '../../src/contexts/AuthContext';
import { protectedGet } from '../../src/utils/protectedApi';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Badge from '../../src/components/ui/Badge';

const TABS = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'topics', label: 'Topics', icon: '📚' },
    { id: 'recent', label: 'Last Quiz', icon: '🕐' },
    { id: 'history', label: 'History', icon: '📈' },
    { id: 'progress', label: 'Progress', icon: '🎯' },
    { id: 'final-exams', label: 'Finals', icon: '🎓' },
];

export default function AnalysisScreen() {
    const { user } = useAuth();
    const userId = user?.id;

    const [activeTab, setActiveTab] = useState('overview');
    const [refreshing, setRefreshing] = useState(false);

    const [userAnalysis, setUserAnalysis] = useState<any>(null);
    const [streakData, setStreakData] = useState<any>(null);
    const [topicAnalysis, setTopicAnalysis] = useState<any[]>([]);
    const [quizHistory, setQuizHistory] = useState<any[]>([]);
    const [finalExams, setFinalExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        if (!userId) return;
        try {
            const t = Date.now();
            const [analysisRes, streakRes, topicRes] = await Promise.all([
                protectedGet(`${Config.API_URL}/user-analysis/${userId}?_=${t}`),
                protectedGet(`${Config.API_URL}/user-streaks/${userId}?_=${t}`),
                protectedGet(`${Config.API_URL}/topic-analysis/user/${userId}?_=${t}`),
            ]);
            if (analysisRes?.data) setUserAnalysis(analysisRes.data);
            if (streakRes?.data) setStreakData(streakRes.data);
            if (topicRes?.data) setTopicAnalysis(topicRes.data);
        } catch (err) {
            console.error('Analysis fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId]);

    const fetchHistory = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await protectedGet(`${Config.API_URL}/quiz-sessions/history/${userId}?_=${Date.now()}`);
            if (res?.data) setQuizHistory(Array.isArray(res.data) ? res.data : []);
        } catch { }
    }, [userId]);

    const fetchFinals = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await protectedGet(`${Config.API_URL}/final-quiz/sessions/${userId}?_=${Date.now()}`);
            if (res?.data) setFinalExams(Array.isArray(res.data) ? res.data : []);
        } catch { }
    }, [userId]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Lazy load tab-specific data
    useEffect(() => {
        if ((activeTab === 'history' || activeTab === 'progress') && quizHistory.length === 0) fetchHistory();
        if (activeTab === 'final-exams' && finalExams.length === 0) fetchFinals();
    }, [activeTab]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAll();
        if (activeTab === 'history') fetchHistory();
        if (activeTab === 'final-exams') fetchFinals();
    };

    // ─── Computed values ───

    const stats = userAnalysis;
    const currentStreak = streakData?.current_streak ?? streakData?.currentStreak ?? 0;
    const longestStreak = streakData?.longest_streak ?? streakData?.longestStreak ?? 0;

    const bestTopic = topicAnalysis.length > 0
        ? topicAnalysis.reduce((best, t) => {
            const acc = t.total_answered > 0 ? (t.total_correct / t.total_answered) * 100 : 0;
            const bestAcc = best.total_answered > 0 ? (best.total_correct / best.total_answered) * 100 : 0;
            return acc > bestAcc ? t : best;
        })
        : null;

    const worstTopic = topicAnalysis.length > 0
        ? topicAnalysis.reduce((worst, t) => {
            const acc = t.total_answered > 0 ? (t.total_correct / t.total_answered) * 100 : 0;
            const worstAcc = worst.total_answered > 0 ? (worst.total_correct / worst.total_answered) * 100 : 0;
            return acc < worstAcc ? t : worst;
        })
        : null;

    // ─── Tab renderers ───

    const renderOverview = () => (
        <View style={styles.tabContent}>
            {/* Streak banner */}
            <Card style={styles.streakBanner}>
                <View style={styles.streakRow}>
                    <Text style={styles.streakFire}>{currentStreak > 0 ? '🔥' : '💤'}</Text>
                    <View>
                        <Text style={styles.streakValue}>{currentStreak}-day streak</Text>
                        <Text style={styles.streakLongest}>Longest: {longestStreak} days</Text>
                    </View>
                </View>
            </Card>

            {/* Overall stats */}
            {stats && (
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.total_quizzes ?? 0}</Text>
                        <Text style={styles.statLabel}>Quizzes</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{stats.total_questions ?? 0}</Text>
                        <Text style={styles.statLabel}>Questions</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: Colors.primary }]}>
                            {stats.overall_accuracy ? `${Number(stats.overall_accuracy).toFixed(1)}%` : '0%'}
                        </Text>
                        <Text style={styles.statLabel}>Accuracy</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {stats.avg_time_per_question ? `${Number(stats.avg_time_per_question).toFixed(0)}s` : '-'}
                        </Text>
                        <Text style={styles.statLabel}>Avg Time</Text>
                    </Card>
                </View>
            )}

            {/* Best / Worst topics */}
            {bestTopic && (
                <View style={styles.topicCompare}>
                    <Card style={[styles.topicCard, { borderLeftColor: Colors.success }]}>
                        <Text style={styles.topicCardEmoji}>🏆</Text>
                        <Text style={styles.topicCardTitle}>Best Topic</Text>
                        <Text style={styles.topicCardName}>{bestTopic.question_type}</Text>
                        <Text style={[styles.topicCardAcc, { color: Colors.success }]}>
                            {bestTopic.total_answered > 0
                                ? `${((bestTopic.total_correct / bestTopic.total_answered) * 100).toFixed(1)}%`
                                : 'N/A'}
                        </Text>
                    </Card>
                    {worstTopic && (
                        <Card style={[styles.topicCard, { borderLeftColor: Colors.error }]}>
                            <Text style={styles.topicCardEmoji}>📉</Text>
                            <Text style={styles.topicCardTitle}>Needs Work</Text>
                            <Text style={styles.topicCardName}>{worstTopic.question_type}</Text>
                            <Text style={[styles.topicCardAcc, { color: Colors.error }]}>
                                {worstTopic.total_answered > 0
                                    ? `${((worstTopic.total_correct / worstTopic.total_answered) * 100).toFixed(1)}%`
                                    : 'N/A'}
                            </Text>
                        </Card>
                    )}
                </View>
            )}
        </View>
    );

    const renderTopics = () => (
        <View style={styles.tabContent}>
            {topicAnalysis.length === 0 ? (
                <Text style={styles.emptyText}>No topic data yet. Complete some quizzes first!</Text>
            ) : (
                topicAnalysis.map((topic, i) => {
                    const acc = topic.total_answered > 0 ? (topic.total_correct / topic.total_answered) * 100 : 0;
                    return (
                        <Card key={i} style={styles.topicRow}>
                            <View style={styles.topicRowHeader}>
                                <Text style={styles.topicName}>{topic.question_type}</Text>
                                <Badge text={`${acc.toFixed(1)}%`} color={acc >= 70 ? Colors.success : acc >= 50 ? Colors.warning : Colors.error} />
                            </View>
                            {/* Progress bar */}
                            <View style={styles.topicBar}>
                                <View style={[styles.topicBarFill, { width: `${Math.min(acc, 100)}%`, backgroundColor: acc >= 70 ? Colors.success : acc >= 50 ? Colors.warning : Colors.error }]} />
                            </View>
                            <Text style={styles.topicDetail}>
                                {topic.total_correct}/{topic.total_answered} correct
                            </Text>
                        </Card>
                    );
                })
            )}
        </View>
    );

    const renderRecent = () => {
        const latest = stats?.latest_quiz;
        if (!latest) return <Text style={styles.emptyText}>No recent quiz found.</Text>;
        const acc = latest.quiz_accuracy ?? (latest.correct_answers && latest.total_questions
            ? (latest.correct_answers / latest.total_questions) * 100 : 0);
        return (
            <View style={styles.tabContent}>
                <Card style={styles.recentCard}>
                    <Text style={styles.recentTitle}>Last Quiz Summary</Text>
                    <View style={styles.recentStats}>
                        <View style={styles.recentStat}>
                            <Text style={styles.recentStatVal}>{latest.correct_answers ?? 0}/{latest.total_questions ?? 0}</Text>
                            <Text style={styles.recentStatLabel}>Score</Text>
                        </View>
                        <View style={styles.recentStat}>
                            <Text style={[styles.recentStatVal, { color: Colors.primary }]}>{Number(acc).toFixed(1)}%</Text>
                            <Text style={styles.recentStatLabel}>Accuracy</Text>
                        </View>
                        <View style={styles.recentStat}>
                            <Text style={styles.recentStatVal}>
                                {latest.duration ? `${Math.floor(latest.duration / 60)}m` : '-'}
                            </Text>
                            <Text style={styles.recentStatLabel}>Duration</Text>
                        </View>
                    </View>
                    {latest.created_at && (
                        <Text style={styles.recentDate}>
                            {new Date(latest.created_at).toLocaleDateString()}
                        </Text>
                    )}
                </Card>
            </View>
        );
    };

    const renderHistory = () => (
        <View style={styles.tabContent}>
            {quizHistory.length === 0 ? (
                <Text style={styles.emptyText}>No quiz history yet.</Text>
            ) : (
                quizHistory.slice(0, 20).map((quiz, i) => {
                    const acc = quiz.quiz_accuracy ?? (quiz.correct_answers && quiz.total_questions
                        ? (quiz.correct_answers / quiz.total_questions) * 100 : 0);
                    return (
                        <Card key={quiz.id || i} style={styles.historyCard}>
                            <View style={styles.historyHeader}>
                                <Text style={styles.historyDate}>
                                    {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : '-'}
                                </Text>
                                <Badge text={`${Number(acc).toFixed(0)}%`} color={acc >= 70 ? Colors.success : Colors.warning} />
                            </View>
                            <Text style={styles.historyDetail}>
                                {quiz.correct_answers ?? 0}/{quiz.total_questions ?? 0} questions • {quiz.duration ? `${Math.floor(quiz.duration / 60)}m` : '-'}
                            </Text>
                        </Card>
                    );
                })
            )}
        </View>
    );

    const renderProgress = () => {
        // Calculate progress from quiz history
        const recent10 = quizHistory.slice(0, 10);
        const avgAccuracy = recent10.length > 0
            ? recent10.reduce((sum, q) => sum + (q.quiz_accuracy ?? 0), 0) / recent10.length
            : 0;

        return (
            <View style={styles.tabContent}>
                <Card style={styles.progressCard}>
                    <Text style={styles.progressTitle}>📈 Your Progress</Text>
                    <Text style={styles.progressValue}>{avgAccuracy.toFixed(1)}%</Text>
                    <Text style={styles.progressLabel}>Average accuracy (last 10 quizzes)</Text>
                </Card>
                <Card style={styles.progressCard}>
                    <Text style={styles.progressTitle}>📊 Total Activity</Text>
                    <Text style={styles.progressValue}>{stats?.total_quizzes ?? 0}</Text>
                    <Text style={styles.progressLabel}>Quizzes completed</Text>
                </Card>
                <Card style={styles.progressCard}>
                    <Text style={styles.progressTitle}>🔥 Streak</Text>
                    <Text style={styles.progressValue}>{currentStreak}</Text>
                    <Text style={styles.progressLabel}>Current streak (days)</Text>
                </Card>
            </View>
        );
    };

    const renderFinalExams = () => (
        <View style={styles.tabContent}>
            {finalExams.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No final exams taken yet.</Text>
                    <Button
                        title="Start Final Exam"
                        onPress={() => router.push('/(tabs)/quizs')}
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            ) : (
                finalExams.map((exam, i) => {
                    const acc = exam.total_questions > 0
                        ? (exam.correct_answers / exam.total_questions) * 100 : 0;
                    return (
                        <Card key={exam.id || i} style={styles.historyCard}>
                            <View style={styles.historyHeader}>
                                <Text style={styles.historyDate}>
                                    {exam.created_at ? new Date(exam.created_at).toLocaleDateString() : '-'}
                                </Text>
                                <Badge text={`${acc.toFixed(0)}%`} color={acc >= 70 ? Colors.success : Colors.error} />
                            </View>
                            <Text style={styles.historyDetail}>
                                {exam.correct_answers}/{exam.total_questions} • {exam.time_taken ? `${Math.floor(exam.time_taken / 60)}m` : '-'}
                            </Text>
                        </Card>
                    );
                })
            )}
        </View>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'topics': return renderTopics();
            case 'recent': return renderRecent();
            case 'history': return renderHistory();
            case 'progress': return renderProgress();
            case 'final-exams': return renderFinalExams();
            default: return null;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading analysis...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Tab navigation */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabBar}
                contentContainerStyle={styles.tabBarContent}
            >
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Text style={styles.tabIcon}>{tab.icon}</Text>
                        <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
            >
                {renderContent()}

                {/* Action buttons */}
                <View style={styles.actions}>
                    <Button
                        title="📚 Review Wrong Questions"
                        onPress={() => router.push('/(tabs)/wrong-questions')}
                        variant="secondary"
                        size="large"
                    />
                    <Button
                        title="Start New Quiz"
                        onPress={() => router.push('/(tabs)/quizs')}
                        size="large"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: Colors.textSecondary, marginTop: Spacing.md },
    scroll: { paddingBottom: Spacing['5xl'] },

    // Tab bar
    tabBar: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: Colors.border },
    tabBarContent: { paddingHorizontal: Spacing.md, gap: Spacing.xs, alignItems: 'center' },
    tabItem: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full, marginVertical: Spacing.xs,
    },
    tabItemActive: { backgroundColor: 'rgba(34, 211, 238, 0.15)' },
    tabIcon: { fontSize: 16 },
    tabLabel: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: FontWeight.medium },
    tabLabelActive: { color: Colors.primary, fontWeight: FontWeight.semibold },

    // Tab content
    tabContent: { padding: Spacing.xl, gap: Spacing.md },

    // Streak banner
    streakBanner: { marginBottom: Spacing.md },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    streakFire: { fontSize: 36 },
    streakValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.warning },
    streakLongest: { fontSize: FontSize.xs, color: Colors.textMuted },

    // Stats grid
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    statCard: { flex: 1, minWidth: '45%', alignItems: 'center', padding: Spacing.lg },
    statValue: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
    statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },

    // Topic compare
    topicCompare: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
    topicCard: { flex: 1, borderLeftWidth: 4, padding: Spacing.lg },
    topicCardEmoji: { fontSize: 24 },
    topicCardTitle: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },
    topicCardName: { fontSize: FontSize.base, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: Spacing.xs },
    topicCardAcc: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginTop: Spacing.xs },

    // Topics
    topicRow: { padding: Spacing.lg },
    topicRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    topicName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
    topicBar: { height: 6, backgroundColor: Colors.bgCardHover, borderRadius: 3, marginBottom: Spacing.xs },
    topicBarFill: { height: 6, borderRadius: 3 },
    topicDetail: { fontSize: FontSize.xs, color: Colors.textMuted },

    // Recent
    recentCard: { padding: Spacing.xl, alignItems: 'center' },
    recentTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.lg },
    recentStats: { flexDirection: 'row', gap: Spacing.xl },
    recentStat: { alignItems: 'center' },
    recentStatVal: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
    recentStatLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },
    recentDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.lg },

    // History
    historyCard: { padding: Spacing.lg },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
    historyDate: { fontSize: FontSize.sm, color: Colors.textSecondary },
    historyDetail: { fontSize: FontSize.xs, color: Colors.textMuted },

    // Progress
    progressCard: { padding: Spacing.xl, alignItems: 'center' },
    progressTitle: { fontSize: FontSize.base, color: Colors.textSecondary, marginBottom: Spacing.sm },
    progressValue: { fontSize: FontSize['3xl'], fontWeight: FontWeight.extrabold, color: Colors.primary },
    progressLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },

    // Empty
    emptyContainer: { alignItems: 'center', padding: Spacing.xl },
    emptyText: { color: Colors.textMuted, fontSize: FontSize.base, textAlign: 'center' },

    // Actions
    actions: { padding: Spacing.xl, gap: Spacing.md },
});
