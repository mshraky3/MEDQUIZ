/**
 * Landing / Index screen
 * First screen users see — app intro + CTA to login/signup
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../src/constants/theme';
import Button from '../src/components/ui/Button';
import { useAuth } from '../src/contexts/AuthContext';
import LoadingScreen from '../src/components/ui/LoadingScreen';

export default function LandingScreen() {
    const { user, isLoading } = useAuth();

    // If already logged in, go to quiz setup
    React.useEffect(() => {
        if (!isLoading && user) {
            router.replace('/(tabs)/quizs');
        }
    }, [user, isLoading]);

    if (isLoading) return <LoadingScreen />;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoText}>SQB</Text>
                    </View>
                    <Text style={styles.title}>SMLE Question Bank</Text>
                    <Text style={styles.subtitle}>
                        The most comprehensive platform to prepare for the Saudi Medical Licensing Exam with 11,000+ practice questions and detailed analytics.
                    </Text>
                </View>

                {/* Features */}
                <View style={styles.features}>
                    {featureData.map((f, i) => (
                        <View key={i} style={styles.featureCard}>
                            <Text style={styles.featureIcon}>{f.icon}</Text>
                            <Text style={styles.featureTitle}>{f.title}</Text>
                            <Text style={styles.featureDesc}>{f.desc}</Text>
                        </View>
                    ))}
                </View>

                {/* CTA */}
                <View style={styles.cta}>
                    <Button
                        title="Log In"
                        onPress={() => router.push('/login')}
                        variant="primary"
                        size="large"
                        style={styles.ctaButton}
                    />
                    <Button
                        title="Create Free Account"
                        onPress={() => router.push('/signup')}
                        variant="outline"
                        size="large"
                        style={styles.ctaButton}
                    />
                </View>

                <Text style={styles.footer}>© 2025 SQB — Built for medical students</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const featureData = [
    { icon: '📚', title: '11,000+ Questions', desc: 'Covering all SMLE topics with verified answers and explanations.' },
    { icon: '📊', title: 'Smart Analytics', desc: 'Track your performance by topic, identify weaknesses, and improve.' },
    { icon: '⏱️', title: 'Timed Quizzes', desc: 'Practice under exam conditions with customizable timers.' },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgDark,
    },
    scroll: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing['5xl'],
    },
    hero: {
        alignItems: 'center',
        paddingTop: Spacing['4xl'],
        paddingBottom: Spacing['3xl'],
    },
    logoBadge: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        ...Shadow.lg,
    },
    logoText: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.textInverse,
    },
    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    subtitle: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: Spacing.lg,
    },
    features: {
        gap: Spacing.lg,
        marginBottom: Spacing['3xl'],
    },
    featureCard: {
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    featureIcon: {
        fontSize: 28,
        marginBottom: Spacing.sm,
    },
    featureTitle: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    featureDesc: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    cta: {
        gap: Spacing.md,
        marginBottom: Spacing['3xl'],
    },
    ctaButton: {
        width: '100%',
    },
    footer: {
        textAlign: 'center',
        color: Colors.textMuted,
        fontSize: FontSize.xs,
    },
});
