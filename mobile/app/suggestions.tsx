/**
 * Suggestions screen — mirrors Suggestions.jsx
 * Category/title/description/priority form → POST /api/suggestions
 */

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../src/constants/theme';
import Config from '../src/constants/config';
import Card from '../src/components/ui/Card';
import Button from '../src/components/ui/Button';
import Input from '../src/components/ui/Input';

const CATEGORIES = [
    { key: 'feature', label: '✨ New Feature' },
    { key: 'improvement', label: '🚀 Improvement' },
    { key: 'ui', label: '🎨 UI/Design' },
    { key: 'content', label: '📚 Content' },
    { key: 'bug', label: '🐛 Bug Report' },
    { key: 'other', label: '💡 Other' },
];

const PRIORITIES = [
    { key: 'low', label: 'Nice to have', color: '#22c55e' },
    { key: 'medium', label: 'Would be useful', color: '#eab308' },
    { key: 'high', label: 'Really need it', color: '#ef4444' },
];

export default function SuggestionsScreen() {
    const [form, setForm] = useState({ category: 'feature', title: '', description: '', priority: 'medium' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            Alert.alert('Missing fields', 'Please fill in a title and description.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${Config.API_URL}/api/suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ category: 'feature', title: '', description: '', priority: 'medium' });
            } else {
                throw new Error('Failed');
            }
        } catch {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.successIcon}>🎉</Text>
                    <Text style={styles.successTitle}>Thank you!</Text>
                    <Text style={styles.successText}>We appreciate your suggestion and will review it soon.</Text>
                    <Button title="Submit Another" onPress={() => setSuccess(false)} variant="outline" style={{ marginTop: Spacing.xl }} />
                    <Button title="Back to Quizzes" onPress={() => router.replace('/(tabs)/quizs')} style={{ marginTop: Spacing.md }} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerIcon}>💡</Text>
                    <Text style={styles.title}>Suggestions & Ideas</Text>
                    <Text style={styles.subtitle}>Help us improve the app — share your thoughts!</Text>
                </View>

                <Card style={styles.formCard}>
                    {/* Category */}
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((c) => (
                            <TouchableOpacity
                                key={c.key}
                                style={[styles.catChip, form.category === c.key && styles.catChipActive]}
                                onPress={() => setForm({ ...form, category: c.key })}
                            >
                                <Text style={[styles.catText, form.category === c.key && styles.catTextActive]}>{c.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Title */}
                    <Input
                        label="Title *"
                        placeholder="e.g. Add dark mode toggle"
                        value={form.title}
                        onChangeText={(v) => setForm({ ...form, title: v })}
                        maxLength={100}
                    />

                    {/* Description */}
                    <Input
                        label="Description *"
                        placeholder="Describe your suggestion in detail..."
                        value={form.description}
                        onChangeText={(v) => setForm({ ...form, description: v })}
                        multiline
                        numberOfLines={5}
                        maxLength={1000}
                        style={{ minHeight: 120, textAlignVertical: 'top' }}
                    />
                    <Text style={styles.charCount}>{form.description.length}/1000</Text>

                    {/* Priority */}
                    <Text style={styles.label}>How important is this?</Text>
                    <View style={styles.priorityRow}>
                        {PRIORITIES.map((p) => (
                            <TouchableOpacity
                                key={p.key}
                                style={[styles.priorityChip, form.priority === p.key && { borderColor: p.color, backgroundColor: `${p.color}15` }]}
                                onPress={() => setForm({ ...form, priority: p.key })}
                            >
                                <View style={[styles.priorityDot, { backgroundColor: p.color, opacity: form.priority === p.key ? 1 : 0.4 }]} />
                                <Text style={[styles.priorityText, form.priority === p.key && { color: Colors.textPrimary }]}>{p.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button title="🚀 Submit Suggestion" onPress={handleSubmit} loading={loading} size="large" />
                </Card>

                <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backText}>← Go back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    scroll: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },

    header: { alignItems: 'center', marginBottom: Spacing.xl },
    headerIcon: { fontSize: 48, marginBottom: Spacing.md },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },

    successIcon: { fontSize: 64 },
    successTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: Spacing.lg },
    successText: { color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },

    formCard: { padding: Spacing.xl },
    label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.lg },

    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    catChip: {
        paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md, backgroundColor: Colors.bgInput,
        borderWidth: 1, borderColor: Colors.border,
    },
    catChipActive: { backgroundColor: 'rgba(34, 211, 238, 0.15)', borderColor: 'rgba(34, 211, 238, 0.5)' },
    catText: { fontSize: FontSize.xs, color: Colors.textMuted },
    catTextActive: { color: Colors.primary },

    charCount: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'right', marginTop: Spacing.xs },

    priorityRow: { gap: Spacing.sm, marginBottom: Spacing.xl },
    priorityChip: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
        paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.full, backgroundColor: Colors.bgInput,
        borderWidth: 1, borderColor: Colors.border,
    },
    priorityDot: { width: 10, height: 10, borderRadius: 5 },
    priorityText: { fontSize: FontSize.sm, color: Colors.textMuted },

    backLink: { alignItems: 'center', marginTop: Spacing.xl },
    backText: { color: Colors.primary, fontSize: FontSize.sm },
});
