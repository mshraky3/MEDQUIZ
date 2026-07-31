/**
 * FAQ screen — frequently asked questions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../src/constants/theme';

const FAQS = [
    {
        q: 'What is SQB?',
        a: 'SQB (SMLE Question Bank) is a mobile and web application for practicing SMLE exam questions. It offers thousands of questions with detailed analytics.',
    },
    {
        q: 'What does the question bank cover?',
        a: 'SQB covers Pediatrics, Medicine, Surgery and OB/GYN in a single unified question bank.',
    },
    {
        q: 'What is a streak?',
        a: 'A streak counts consecutive days you complete at least one quiz. Maintaining streaks helps build consistent study habits.',
    },
    {
        q: 'Can I review my wrong answers?',
        a: 'Yes! The "Wrong Questions" tab shows all questions you answered incorrectly, along with the correct answers.',
    },
    {
        q: 'What is a Final Exam?',
        a: 'A Final Exam simulates a real SMLE-style exam with comprehensive questions. Results are tracked separately for progress monitoring.',
    },
    {
        q: 'How do I contact support?',
        a: 'Use the Contact tab in the app, or reach us directly on WhatsApp (0582619119) or email (alshraky3@gmail.com).',
    },
    {
        q: 'Is my data secure?',
        a: 'Yes. Your credentials are stored securely on your device. Session tokens are used for authentication and expire after 30 minutes of inactivity.',
    },
];

export default function FAQScreen() {
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Frequently Asked Questions</Text>
                <Text style={styles.subtitle}>Find answers to common questions about SQB</Text>

                {FAQS.map((faq, i) => {
                    const isOpen = expanded === i;
                    return (
                        <TouchableOpacity
                            key={i}
                            style={[styles.card, isOpen && styles.cardOpen]}
                            onPress={() => setExpanded(isOpen ? null : i)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.qRow}>
                                <Text style={[styles.qText, isOpen && styles.qTextOpen]}>{faq.q}</Text>
                                <Text style={styles.chevron}>{isOpen ? '▲' : '▼'}</Text>
                            </View>
                            {isOpen && <Text style={styles.aText}>{faq.a}</Text>}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    scroll: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.xs },
    subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl },

    card: {
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.md,
        padding: Spacing.lg,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardOpen: { borderColor: Colors.primary },
    qRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    qText: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary, flex: 1 },
    qTextOpen: { color: Colors.primary },
    chevron: { fontSize: 12, color: Colors.textMuted, marginLeft: Spacing.md },
    aText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22, marginTop: Spacing.md },
});
