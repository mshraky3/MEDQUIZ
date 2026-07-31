/**
 * Login screen — mirrors Login.jsx
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Config from '../src/constants/config';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../src/constants/theme';
import { useAuth } from '../src/contexts/AuthContext';
import Button from '../src/components/ui/Button';
import Input from '../src/components/ui/Input';
import AlertBox from '../src/components/ui/AlertBox';
import Badge from '../src/components/ui/Badge';
import LoadingScreen from '../src/components/ui/LoadingScreen';

export default function LoginScreen() {
    const { user, sessionToken, setUser, isLoading } = useAuth();
    const params = useLocalSearchParams<{ session?: string; message?: string; username?: string }>();

    const [form, setForm] = useState({ username: '', password: '' }); // 'username' field accepts email or username
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    useEffect(() => {
        if (params.session === 'expired') setSessionExpired(true);
        if (params.message) setSuccessMessage(params.message);
        if (params.username) setForm((prev) => ({ ...prev, username: params.username! }));
    }, [params]);

    // Auto-login if session valid
    useEffect(() => {
        if (isLoading || !user || !sessionToken) return;
        axios
            .post(`${Config.API_URL}/session-validate`, { username: user.username })
            .then((res) => {
                if (res.data.valid) router.replace('/(tabs)/quizs');
            })
            .catch(() => { });
    }, [user, sessionToken, isLoading]);

    if (isLoading) return <LoadingScreen />;

    const handleSubmit = async () => {
        if (loading) return;
        const cleanedUsername = form.username.trim().toLowerCase();
        const password = form.password;

        if (!cleanedUsername || !password) {
            setError('Please enter your email and password.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${Config.API_URL}/login`, {
                username: cleanedUsername,
                password,
                deviceId: 'mobile-app',
            });

            if (response.data.expired) {
                Alert.alert(
                    'Subscription Expired',
                    'Your subscription has expired or you are a new user. Please contact us to reactivate.',
                    [
                        { text: 'Close', style: 'cancel' },
                        { text: 'Contact Us', onPress: () => router.push('/contact') },
                    ],
                );
                setLoading(false);
                return;
            }

            if (response.data.showTerms) {
                setShowTermsModal(true);
                await setUser(response.data.user || { username: cleanedUsername } as any, response.data.sessionToken);
                setLoading(false);
                return;
            }

            await setUser(response.data.user || { username: cleanedUsername } as any, response.data.sessionToken);
            setLoading(false);
            router.replace('/(tabs)/quizs');
        } catch (err: any) {
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);

            if (err.response?.data?.alreadyLogged) {
                setError('This account is already in use on another device. Please wait 30 minutes or log out from the other device.');
            } else {
                setError(err.response?.data?.message || 'Incorrect email or password. Please try again.');
            }
            setLoading(false);
        }
    };

    const handleAcceptTerms = async () => {
        if (!termsChecked) return;
        setShowTermsModal(false);
        setLoading(true);
        try {
            await axios.post(`${Config.API_URL}/accept-terms`, {
                username: form.username.trim().toLowerCase(),
            });
            setLoading(false);
            router.replace('/(tabs)/quizs');
        } catch {
            setLoading(false);
            setError('Failed to accept terms. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.logoBadge}>
                                <Text style={styles.logoText}>SQB</Text>
                            </View>
                            <Badge text="Welcome back" />
                            <Text style={styles.title}>Log In</Text>
                            <Text style={styles.subtitle}>Continue your SMLE journey</Text>
                        </View>

                        {sessionExpired && (
                            <AlertBox type="warning" message="Your session has expired or another user logged in with this account. Please log in again." />
                        )}
                        {successMessage ? <AlertBox type="success" message={successMessage} /> : null}

                        {/* Form */}
                        <Input
                            label="Email Address"
                            placeholder="Enter your email"
                            value={form.username}
                            onChangeText={(t) => setForm({ ...form, username: t })}
                            keyboardType="email-address"
                            autoCorrect={false}
                        />
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChangeText={(t) => setForm({ ...form, password: t })}
                            isPassword
                        />

                        <TouchableOpacity onPress={() => router.push('/forgot-password')} style={styles.forgotLink}>
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </TouchableOpacity>

                        {error ? <AlertBox type="error" message={error} /> : null}

                        <Button title={loading ? 'Logging in...' : 'Log In'} onPress={handleSubmit} loading={loading} size="large" style={{ marginTop: Spacing.sm }} />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={styles.footerLink}>Create Free Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Terms modal */}
                    {showTermsModal && (
                        <View style={styles.termsOverlay}>
                            <View style={styles.termsCard}>
                                <Text style={styles.termsTitle}>Terms of Use</Text>
                                <ScrollView style={styles.termsScroll}>
                                    <Text style={styles.termsBody}>
                                        {`Purpose: All questions and materials are collected through individual student efforts and are not affiliated with any official educational or health authority. They are purely for educational review and preparation.\n\nAccuracy Notice: We do our best to maintain content accuracy, but there may be errors or incomplete information. We do not guarantee the accuracy, completeness, or reliability of any material.\n\nAccount Policies: You are responsible for keeping your login credentials confidential. Account sharing is prohibited. Management reserves the right to suspend or delete any violating account.\n\nProhibited Behaviors:\n• Downloading or copying content without written permission.\n• Using automated tools to collect questions.\n• Identity fraud or impersonation.\n\nIntellectual Property: All content is protected by intellectual property rights.\n\nLiability Limitations: The platform and its operators bear no responsibility for any direct or indirect damages resulting from your use of the site.`}
                                    </Text>
                                </ScrollView>
                                <TouchableOpacity
                                    style={styles.checkboxRow}
                                    onPress={() => setTermsChecked(!termsChecked)}
                                >
                                    <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]}>
                                        {termsChecked && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                    <Text style={styles.checkboxLabel}>I agree to the Terms of Use</Text>
                                </TouchableOpacity>
                                <Button title="Continue" onPress={handleAcceptTerms} disabled={!termsChecked} size="large" style={{ marginTop: Spacing.lg }} />
                            </View>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
    card: {
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.lg,
        padding: Spacing['2xl'],
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadow.md,
    },
    header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
    logoBadge: {
        width: 56, height: 56,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    logoText: { color: Colors.bgDark, fontWeight: FontWeight.extrabold, fontSize: FontSize.lg },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginTop: Spacing.sm },
    subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
    footer: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs, marginTop: Spacing.xl },
    footerText: { color: Colors.textSecondary, fontSize: FontSize.sm },
    footerLink: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    forgotLink: { alignItems: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.md },
    forgotText: { color: Colors.primary, fontSize: FontSize.sm },
    // Terms modal
    termsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.bgModal,
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    termsCard: {
        backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        maxHeight: '80%',
    },
    termsTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.lg },
    termsScroll: { maxHeight: 300, marginBottom: Spacing.lg },
    termsBody: { color: Colors.textSecondary, fontSize: FontSize.sm, lineHeight: 22 },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    checkbox: {
        width: 22, height: 22, borderRadius: 4,
        borderWidth: 2, borderColor: Colors.borderLight,
        justifyContent: 'center', alignItems: 'center',
    },
    checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    checkmark: { color: Colors.textInverse, fontSize: 14, fontWeight: FontWeight.bold },
    checkboxLabel: { color: Colors.textSecondary, fontSize: FontSize.sm },
});
