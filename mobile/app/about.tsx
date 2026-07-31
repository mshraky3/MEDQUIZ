/**
 * About screen — app info page
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../src/constants/theme';
import Card from '../src/components/ui/Card';

export default function AboutScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoText}>SQB</Text>
                    </View>
                    <Text style={styles.title}>SQB — SMLE Question Bank</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>

                <Card style={styles.card}>
                    <Text style={styles.heading}>What is SQB?</Text>
                    <Text style={styles.body}>
                        SQB is a comprehensive SMLE practice platform designed to help medical professionals prepare for the Saudi Medical Licensing Examination.
                        With thousands of practice questions and detailed analytics, SQB helps you study smarter.
                    </Text>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.heading}>Features</Text>
                    <Text style={styles.featureItem}>📝 8,000+ SMLE practice questions</Text>
                    <Text style={styles.featureItem}>📊 Detailed performance analytics</Text>
                    <Text style={styles.featureItem}>⏱️ Timed quiz sessions</Text>
                    <Text style={styles.featureItem}>🔥 Daily streak tracking</Text>
                    <Text style={styles.featureItem}>🎓 Final exam simulation</Text>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.heading}>Contact</Text>
                    <TouchableOpacity onPress={() => Linking.openURL('mailto:alshraky3@gmail.com')}>
                        <Text style={styles.link}>alshraky3@gmail.com</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL('https://wa.link/gqafib')}>
                        <Text style={styles.link}>WhatsApp: 0582619119</Text>
                    </TouchableOpacity>
                </Card>

                <Card style={styles.card}>
                    <Text style={styles.heading}>Legal | قانوني</Text>
                    <Text style={styles.body}>شركة دار الخبرة التجارية</Text>
                    <Text style={styles.body}>السجل التجاري: 7040567922</Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    scroll: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },
    header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
    logoBadge: {
        width: 80, height: 80, borderRadius: 20,
        backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    logoText: { fontSize: 28, fontWeight: FontWeight.extrabold, color: Colors.textInverse },
    title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
    version: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: Spacing.xs },
    card: { padding: Spacing.xl, marginBottom: Spacing.md },
    heading: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.md },
    body: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 24 },
    featureItem: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 28 },
    link: { fontSize: FontSize.base, color: Colors.primary, marginTop: Spacing.sm },
});
