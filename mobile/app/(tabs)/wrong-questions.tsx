/**
 * Wrong Questions review — mirrors WrongQuestions.jsx
 * Paginated list of wrong answers
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from '../../src/constants/config';
import { Colors, FontSize, FontWeight, Spacing } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { protectedGet } from '../../src/utils/protectedApi';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Badge from '../../src/components/ui/Badge';

const LIMIT = 20;

export default function WrongQuestionsScreen() {
    const { user } = useAuth();
    const userId = user?.id;

    const [questions, setQuestions] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = useCallback(async (pageNum: number, append: boolean) => {
        if (!userId) return;
        try {
            setError(null);
            if (pageNum === 0) setLoading(true);
            else setLoadingMore(true);

            const res = await protectedGet(
                `${Config.API_URL}/wrong-questions/user/${userId}?limit=${LIMIT}&offset=${pageNum * LIMIT}`,
            );

            const { wrongQuestions: newQs, total: t } = res?.data ?? {};
            if (append) {
                setQuestions((prev) => [...prev, ...(newQs || [])]);
            } else {
                setQuestions(newQs || []);
            }
            setTotal(t ?? 0);
            setHasMore((pageNum + 1) * LIMIT < (t ?? 0));
            setPage(pageNum);
        } catch {
            setError('Failed to load wrong questions.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchQuestions(0, false);
    }, [fetchQuestions]);

    const loadMore = () => {
        if (hasMore && !loadingMore) fetchQuestions(page + 1, true);
    };

    // ─── Loading ───

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading wrong questions...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // ─── Error ───

    if (error) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.center}>
                    <Text style={styles.errorIcon}>❌</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button title="Retry" onPress={() => fetchQuestions(0, false)} variant="outline" />
                </View>
            </SafeAreaView>
        );
    }

    // ─── Empty ───

    if (questions.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.center}>
                    <Text style={styles.emptyEmoji}>🎉</Text>
                    <Text style={styles.emptyTitle}>Excellent!</Text>
                    <Text style={styles.emptyText}>You haven't answered any question wrong yet.</Text>
                    <Button title="Start a Quiz" onPress={() => router.push('/(tabs)/quizs')} style={{ marginTop: Spacing.lg }} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Wrong Questions</Text>
                    <Text style={styles.subtitle}>Review your mistakes and learn from them</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{total}</Text>
                        <Text style={styles.statLabel}>Total Wrong</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={styles.statValue}>{questions.length}</Text>
                        <Text style={styles.statLabel}>Loaded</Text>
                    </Card>
                </View>

                {/* Question cards */}
                {questions.map((q, i) => {
                    const id = String(q.id ?? i);

                    return (
                        <Card key={id} style={styles.card}>
                            <View style={styles.cardMeta}>
                                <Badge text={q.question_type || 'General'} />
                                {q.attempted_at && (
                                    <Text style={styles.cardDate}>
                                        {new Date(q.attempted_at).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>

                            <Text style={styles.cardQuestion}>{q.question_text}</Text>

                            <View style={styles.answerRow}>
                                <Text style={styles.answerLabel}>Your answer:</Text>
                                <Text style={[styles.answerValue, { color: Colors.error }]}>{q.selected_option}</Text>
                            </View>
                            <View style={styles.answerRow}>
                                <Text style={styles.answerLabel}>Correct:</Text>
                                <Text style={[styles.answerValue, { color: Colors.success }]}>{q.correct_option}</Text>
                            </View>
                        </Card>
                    );
                })}

                {/* Load more */}
                {hasMore && (
                    <Button
                        title={loadingMore ? 'Loading...' : 'Load More'}
                        onPress={loadMore}
                        variant="outline"
                        loading={loadingMore}
                        style={{ marginTop: Spacing.lg }}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    scroll: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },
    loadingText: { color: Colors.textSecondary, marginTop: Spacing.md },
    errorIcon: { fontSize: 48 },
    errorText: { color: Colors.textSecondary, fontSize: FontSize.base, textAlign: 'center', marginBottom: Spacing.lg },
    emptyEmoji: { fontSize: 64 },
    emptyTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: Spacing.md },
    emptyText: { color: Colors.textSecondary, marginTop: Spacing.sm, textAlign: 'center' },

    header: { marginBottom: Spacing.xl },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },

    statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
    statCard: { flex: 1, alignItems: 'center', padding: Spacing.lg },
    statValue: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.primary },
    statLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },

    card: { marginBottom: Spacing.md, padding: Spacing.lg },
    cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    cardDate: { fontSize: FontSize.xs, color: Colors.textMuted },
    cardQuestion: { fontSize: FontSize.base, color: Colors.textPrimary, lineHeight: 22, marginBottom: Spacing.lg },

    answerRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
    answerLabel: { fontSize: FontSize.sm, color: Colors.textMuted, minWidth: 100 },
    answerValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, flex: 1 },
});
