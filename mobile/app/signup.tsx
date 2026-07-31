/**
 * Signup screen — 2-step email + OTP flow, mirrors website Signup.jsx
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Linking, KeyboardAvoidingView, Platform, TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Config from '../src/constants/config';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow } from '../src/constants/theme';
import Button from '../src/components/ui/Button';
import Input from '../src/components/ui/Input';
import AlertBox from '../src/components/ui/AlertBox';
import Badge from '../src/components/ui/Badge';

// ── 4-digit OTP boxes ─────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const refs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    const digits = (value + '    ').slice(0, 4).split('');

    const handleChange = (text: string, idx: number) => {
        const digit = text.replace(/\D/g, '').slice(-1);
        const arr = (value + '    ').slice(0, 4).split('');
        arr[idx] = digit || ' ';
        const next = arr.join('').trimEnd();
        onChange(next);
        if (digit && idx < 3) refs[idx + 1].current?.focus();
    };

    const handleKeyPress = (key: string, idx: number) => {
        if (key === 'Backspace' && !digits[idx].trim() && idx > 0) {
            refs[idx - 1].current?.focus();
        }
    };

    return (
        <View style={otpStyles.row}>
            {[0, 1, 2, 3].map((i) => (
                <TextInput
                    key={i}
                    ref={refs[i]}
                    style={[otpStyles.box, digits[i].trim() && otpStyles.boxFilled]}
                    value={digits[i].trim()}
                    onChangeText={(t) => handleChange(t, i)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                    placeholderTextColor={Colors.textMuted}
                    placeholder="·"
                />
            ))}
        </View>
    );
}

const otpStyles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: Spacing.lg },
    box: {
        width: 60, height: 68,
        backgroundColor: Colors.bgInput,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        color: Colors.textPrimary,
        fontSize: 28,
        fontWeight: FontWeight.bold,
    },
    boxFilled: { borderColor: Colors.primary },
});

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: 'credentials' | 'otp' }) {
    return (
        <View style={stepStyles.container}>
            <View style={[stepStyles.dot, stepStyles.dotActive]} />
            <View style={[stepStyles.line, step === 'otp' && stepStyles.lineActive]} />
            <View style={[stepStyles.dot, step === 'otp' && stepStyles.dotActive]} />
        </View>
    );
}

const stepStyles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.border },
    dotActive: { backgroundColor: Colors.primary },
    line: { width: 60, height: 2, backgroundColor: Colors.border, marginHorizontal: 6 },
    lineActive: { backgroundColor: Colors.primary },
});

// ── Main screen ────────────────────────────────────────────────────────────────
export default function SignupScreen() {
    const { token } = useLocalSearchParams<{ token?: string }>();
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isTempLink, setIsTempLink] = useState(false);

    useEffect(() => {
        if (token) validateTempLink();
    }, [token]);

    const validateTempLink = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${Config.API_URL}/api/validate-temp-link/${token}`);
            if (response.data.valid) {
                setIsTempLink(true);
                setError('');
            } else {
                setError('Invalid or expired link');
                setTimeout(() => router.push('/contact'), 3000);
            }
        } catch {
            setError('Invalid or expired link');
            setTimeout(() => router.push('/contact'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const validateCredentials = (): boolean => {
        if (!form.email || !form.password || !form.confirmPassword) {
            setError('All fields are required'); return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setError('Please enter a valid email address'); return false;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters'); return false;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match'); return false;
        }
        return true;
    };

    const handleSendOtp = async () => {
        setError('');
        if (!validateCredentials()) return;
        setLoading(true);
        try {
            await axios.post(`${Config.API_URL}/api/auth/send-otp`, {
                email: form.email.trim().toLowerCase(),
                purpose: 'signup',
            });
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setError('');
        if (otp.trim().length !== 4) {
            setError('Please enter the 4-digit code'); return;
        }
        setLoading(true);
        try {
            const endpoint = isTempLink ? '/api/signup/temp-link' : '/api/signup/free';
            const payload = isTempLink
                ? { token, email: form.email.trim().toLowerCase(), password: form.password, otp_code: otp }
                : { email: form.email.trim().toLowerCase(), password: form.password, otp_code: otp };

            const response = await axios.post(`${Config.API_URL}${endpoint}`, payload);

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.replace({
                        pathname: '/login',
                        params: { message: 'Account created! You can now log in.', username: form.email.trim().toLowerCase() },
                    });
                }, 2000);
            } else {
                throw new Error(response.data.message || 'Failed to create account');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.successContainer}>
                    <View style={styles.successIconWrap}>
                        <Text style={styles.successIcon}>✓</Text>
                    </View>
                    <Text style={styles.successTitle}>Account Created!</Text>
                    <Text style={styles.successSubtitle}>Redirecting to login...</Text>
                </View>
            </SafeAreaView>
        );
    }

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
                            <Badge text="Create Account" />
                            <Text style={styles.title}>
                                {step === 'credentials' ? 'Create Your Account' : 'Verify Your Email'}
                            </Text>
                            <Text style={styles.subtitle}>
                                {step === 'credentials'
                                    ? 'Sign up to start your SMLE preparation'
                                    : `Enter the 4-digit code sent to\n${form.email}`}
                            </Text>
                            <StepIndicator step={step} />
                        </View>

                        {step === 'credentials' ? (
                            <>
                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChangeText={(t) => setForm({ ...form, email: t })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <Input
                                    label="Password"
                                    placeholder="At least 8 characters"
                                    value={form.password}
                                    onChangeText={(t) => setForm({ ...form, password: t })}
                                    isPassword
                                />
                                <Input
                                    label="Confirm Password"
                                    placeholder="Re-enter your password"
                                    value={form.confirmPassword}
                                    onChangeText={(t) => setForm({ ...form, confirmPassword: t })}
                                    isPassword
                                />

                                {error ? <AlertBox type="error" message={error} /> : null}

                                <Button
                                    title={loading ? 'Sending Code...' : 'Send Verification Code'}
                                    onPress={handleSendOtp}
                                    loading={loading}
                                    size="large"
                                    style={{ marginTop: Spacing.sm }}
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.otpLabel}>Verification Code</Text>
                                <OtpInput value={otp} onChange={setOtp} />

                                {error ? <AlertBox type="error" message={error} /> : null}

                                <Button
                                    title={loading ? 'Creating Account...' : 'Create Account'}
                                    onPress={handleSubmit}
                                    loading={loading}
                                    size="large"
                                    style={{ marginTop: Spacing.sm }}
                                />

                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={() => { setStep('credentials'); setOtp(''); setError(''); }}
                                    disabled={loading}
                                >
                                    <Text style={styles.backButtonText}>← Change email address</Text>
                                </TouchableOpacity>

                                <View style={styles.resendRow}>
                                    <Text style={styles.footerText}>Didn't receive the code? </Text>
                                    <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                                        <Text style={styles.footerLink}>Resend</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        <View style={styles.divider} />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Having trouble? </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:alshraky3@gmail.com?subject=Account Support')}>
                                <Text style={styles.footerLink}>Contact Support</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Text style={styles.footerLink}>Log In</Text>
                        </TouchableOpacity>
                    </View>
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
    header: { alignItems: 'center', marginBottom: Spacing.xl },
    logoBadge: {
        width: 56, height: 56,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    logoText: { color: Colors.bgDark, fontWeight: FontWeight.extrabold, fontSize: FontSize.lg },
    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.extrabold,
        color: Colors.textPrimary,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
        textAlign: 'center',
        lineHeight: 20,
    },
    otpLabel: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        textAlign: 'center',
        marginBottom: -Spacing.sm,
    },
    backButton: { alignItems: 'center', marginTop: Spacing.md },
    backButtonText: { color: Colors.textSecondary, fontSize: FontSize.sm },
    resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
    divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },
    footer: { flexDirection: 'row', justifyContent: 'center' },
    loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
    footerText: { color: Colors.textSecondary, fontSize: FontSize.sm },
    footerLink: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
    successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    successIconWrap: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: Colors.successBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        borderWidth: 2,
        borderColor: Colors.success,
    },
    successIcon: { fontSize: 36, color: Colors.success },
    successTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
    successSubtitle: { color: Colors.textSecondary, fontSize: FontSize.base },
});
