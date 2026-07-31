/**
 * Quiz setup screen — mirrors QUIZS.jsx
 * Source, type, count, timer selection → starts a quiz
 */

import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Config from '../../src/constants/config';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { protectedGet } from '../../src/utils/protectedApi';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import Badge from '../../src/components/ui/Badge';
import BottomSheet from '../../src/components/ui/BottomSheet';

// One unified question bank — the source picker was removed so that the app can
// never request a retired collection. The backend allowlist resolves anything
// else to the same bank, so this must stay in sync with KEPT_SOURCES/UNIFIED_BANK
// in backend/app.js. 'mix' is NOT a legal value for the user_quiz_sessions
// check_valid_quiz_source constraint, so it must not be sent.
const QUESTION_SOURCE = 'MidgardGameBoy';
const QUESTION_SOURCE_LABEL = 'Midgard & GameBoy2026';

const TYPES = [
    { key: 'mix', label: 'All Topics' },
    { key: 'pediatric', label: 'Pediatrics' },
    { key: 'obstetrics', label: 'OB/GYN' },
    { key: 'medicine', label: 'Medicine' },
    { key: 'surgery', label: 'Surgery' },
];

const PRESETS = [10, 25, 50, 100];

const TIMER_OPTIONS = [
    { key: null, label: 'No Timer' },
    { key: 15, label: '15 min' },
    { key: 30, label: '30 min' },
    { key: 60, label: '60 min' },
    { key: 90, label: '90 min' },
    { key: 120, label: '120 min' },
];

export default function QuizSetupScreen() {
    const { user } = useAuth();
    const [types, setTypes] = useState('mix');
    const [numQuestions, setNumQuestions] = useState(10);
    const [timer, setTimer] = useState<number | null>(null);
    const [showTypeSheet, setShowTypeSheet] = useState(false);
    const [showTimerSheet, setShowTimerSheet] = useState(false);
    const [streak, setStreak] = useState({ current: 0, longest: 0 });

    useEffect(() => {
        if (!user?.id) return;
        protectedGet(`${Config.API_URL}/user-streaks/${user.id}`)
            .then((res) => setStreak({ current: res?.data?.currentStreak || 0, longest: res?.data?.longestStreak || 0 }))
            .catch(() => { });
    }, [user?.id]);

    const startQuiz = () => {
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to start a quiz.');
            return;
        }
        router.push({
            pathname: '/quiz',
            params: {
                numQuestions: String(numQuestions),
                types,
                source: QUESTION_SOURCE,
                timer: timer ? String(timer) : '',
                id: String(user.id),
                isFinalQuiz: 'false',
            },
        });
    };

    const startFinalQuiz = () => {
        if (!user?.id) return;
        router.push({
            pathname: '/quiz',
            params: {
                numQuestions: '0', // final quiz fetches all
                types,
                source: QUESTION_SOURCE,
                timer: timer ? String(timer) : '',
                id: String(user.id),
                isFinalQuiz: 'true',
            },
        });
    };

    const selectedTypeLabel = TYPES.find((t) => t.key === types)?.label || 'All Topics';
    const selectedTimerLabel = TIMER_OPTIONS.find((t) => t.key === timer)?.label || 'No Timer';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Start a Quiz</Text>
                    <Text style={styles.subtitle}>Customize your practice session</Text>
                </View>

                {/* Streak */}
                {streak.current > 0 && (
                    <Card style={styles.streakCard}>
                        <Text style={styles.streakEmoji}>🔥</Text>
                        <View>
                            <Text style={styles.streakText}>{streak.current}-day streak!</Text>
                            <Text style={styles.streakSub}>Longest: {streak.longest} days</Text>
                        </View>
                    </Card>
                )}

                {/* Source — one unified bank, no longer selectable */}
                <Text style={styles.sectionLabel}>Source</Text>
                <View style={styles.pickerButton}>
                    <Text style={styles.pickerText}>{QUESTION_SOURCE_LABEL}</Text>
                </View>

                {/* Type picker */}
                <Text style={styles.sectionLabel}>Topic</Text>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTypeSheet(true)}>
                    <Text style={styles.pickerText}>{selectedTypeLabel}</Text>
                    <Text style={styles.pickerChevron}>▼</Text>
                </TouchableOpacity>

                {/* Question count */}
                <Text style={styles.sectionLabel}>Number of Questions</Text>
                <View style={styles.presetRow}>
                    {PRESETS.map((n) => (
                        <TouchableOpacity
                            key={n}
                            style={[styles.presetChip, numQuestions === n && styles.presetChipActive]}
                            onPress={() => setNumQuestions(n)}
                        >
                            <Text style={[styles.presetText, numQuestions === n && styles.presetTextActive]}>{n}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Timer picker */}
                <Text style={styles.sectionLabel}>Timer</Text>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimerSheet(true)}>
                    <Text style={styles.pickerText}>⏱️ {selectedTimerLabel}</Text>
                    <Text style={styles.pickerChevron}>▼</Text>
                </TouchableOpacity>

                {/* Start buttons */}
                <View style={styles.startButtons}>
                    <Button title="Start Quiz" onPress={startQuiz} size="large" style={{ flex: 1 }} />
                    <Button title="Final Exam" onPress={startFinalQuiz} variant="outline" size="large" style={{ flex: 1 }} />
                </View>
            </ScrollView>

            {/* Bottom sheets */}
            <BottomSheet visible={showTypeSheet} onClose={() => setShowTypeSheet(false)} title="Select Topic">
                {TYPES.map((t) => (
                    <TouchableOpacity
                        key={t.key}
                        style={[styles.sheetOption, types === t.key && styles.sheetOptionActive]}
                        onPress={() => { setTypes(t.key); setShowTypeSheet(false); }}
                    >
                        <Text style={[styles.sheetOptionText, types === t.key && styles.sheetOptionTextActive]}>{t.label}</Text>
                    </TouchableOpacity>
                ))}
            </BottomSheet>

            <BottomSheet visible={showTimerSheet} onClose={() => setShowTimerSheet(false)} title="Select Timer">
                {TIMER_OPTIONS.map((t) => (
                    <TouchableOpacity
                        key={String(t.key)}
                        style={[styles.sheetOption, timer === t.key && styles.sheetOptionActive]}
                        onPress={() => { setTimer(t.key); setShowTimerSheet(false); }}
                    >
                        <Text style={[styles.sheetOptionText, timer === t.key && styles.sheetOptionTextActive]}>{t.label}</Text>
                    </TouchableOpacity>
                ))}
            </BottomSheet>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    scroll: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },
    header: { marginBottom: Spacing['2xl'] },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
    streakCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
    streakEmoji: { fontSize: 32 },
    streakText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.warning },
    streakSub: { fontSize: FontSize.xs, color: Colors.textMuted },
    sectionLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.lg },
    pickerButton: {
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerText: { color: Colors.textPrimary, fontSize: FontSize.base },
    pickerChevron: { color: Colors.textMuted, fontSize: 12 },
    presetRow: { flexDirection: 'row', gap: Spacing.sm },
    presetChip: {
        flex: 1,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.bgCard,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    presetChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    presetText: { color: Colors.textSecondary, fontSize: FontSize.base, fontWeight: FontWeight.semibold },
    presetTextActive: { color: Colors.textInverse },
    startButtons: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing['3xl'] },
    sheetOption: {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    sheetOptionActive: { backgroundColor: 'rgba(34, 211, 238, 0.1)' },
    sheetOptionText: { color: Colors.textSecondary, fontSize: FontSize.base },
    sheetOptionTextActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
});
