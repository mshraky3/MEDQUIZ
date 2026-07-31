/**
 * Forgot Password screen — 3-step: email → OTP → new password
 */

import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    KeyboardAvoidingView, Platform, TextInput,
} from 'react-native';
import { router } from 'expo-router';
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
                    style={[otpStyles.box, digits[i].trim() ? otpStyles.boxFilled : undefined]}
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
        fontWeight: FontWeight.bold as any,
    },
    boxFilled: { borderColor: Colors.primary },
});

// ─────────────────────────────────────────────────────────────────────────────

type Step = 'email' | 'otp' | 'password';

export default function ForgotPasswordScreen() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async () => {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed) { setError('Please enter your email address.'); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) { setError('Please enter a valid email address.'); return; }

        setLoading(true);
        setError('');
        try {
            await axios.post(`${Config.API_URL}/api/auth/send-otp`, { email: trimmed, purpose: 'reset' });
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = () => {
        if (otp.trim().length !== 4) { setError('Please enter the 4-digit code.'); return; }
        setError('');
        setStep('password');
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) { setError('Please fill in all fields.'); return; }
        if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

        setLoading(true);
        setError('');
        try {
            await axios.post(`${Config.API_URL}/api/auth/reset-password`, {
                email: email.trim().toLowerCase(),
                otp_code: otp.trim(),
                new_password: newPassword,
            });
            router.replace({ pathname: '/login', params: { message: 'Password reset successfully!' } } as any);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stepSubtitle: Record<Step, string> = {
        email: 'Enter your email to receive a verification code',
        otp: 'Enter the 4-digit code sent to your email',
        password: 'Create a new password for your account',
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        {/* Back button */}
                        <TouchableOpacity onPress={() => step === 'email' ? router.back() : setStep(step === 'password' ? 'otp' : 'email')} style={styles.backBtn}>
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>

                        {/* Header */}
                        <View style={styles.header}>
                            <Badge text="Account Recovery" />
                            <Text style={styles.title}>Forgot Password</Text>
                            <Text style={styles.subtitle}>{stepSubtitle[step]}</Text>
                        </View>

                        {/* Step indicators */}
                        <View style={styles.steps}>
                            {(['email', 'otp', 'password'] as Step[]).map((s, i) => (
                                <View
                                    key={s}
                                    style={[styles.stepDot, (step === s || (step === 'password' && i < 2) || (step === 'otp' && i === 0)) && styles.stepDotActive]}
                                />
                            ))}
                        </View>

                        {/* Step 1: Email */}
                        {step === 'email' && (
                            <View>
                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                />
                                {error ? <AlertBox type="error" message={error} /> : null}
                                <Button
                                    title={loading ? 'Sending...' : 'Send Verification Code'}
                                    onPress={handleSendOtp}
                                    loading={loading}
                                    size="large"
                                    style={{ marginTop: Spacing.sm }}
                                />
                            </View>
                        )}

                        {/* Step 2: OTP */}
                        {step === 'otp' && (
                            <View>
                                <Text style={styles.otpHint}>
                                    Code sent to <Text style={styles.otpEmail}>{email}</Text>
                                </Text>
                                <OtpInput value={otp} onChange={setOtp} />
                                {error ? <AlertBox type="error" message={error} /> : null}
                                <Button
                                    title="Next"
                                    onPress={handleVerifyOtp}
                                    size="large"
                                    style={{ marginTop: Spacing.sm }}
                                />
                                <TouchableOpacity
                                    onPress={() => { setStep('email'); setError(''); setOtp(''); }}
                                    style={styles.resendBtn}
                                >
                                    <Text style={styles.resendText}>Change email address</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Step 3: New Password */}
                        {step === 'password' && (
                            <View>
                                <Input
                                    label="New Password"
                                    placeholder="At least 8 characters"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    isPassword
                                />
                                <Input
                                    label="Confirm Password"
                                    placeholder="Re-enter your new password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    isPassword
                                />
                                {error ? <AlertBox type="error" message={error} /> : null}
                                <Button
                                    title={loading ? 'Resetting...' : 'Reset Password'}
                                    onPress={handleResetPassword}
                                    loading={loading}
                                    size="large"
                                    style={{ marginTop: Spacing.sm }}
                                />
                            </View>
                        )}
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
    backBtn: { marginBottom: Spacing.md },
    backText: { color: Colors.textSecondary, fontSize: FontSize.sm },
    header: { alignItems: 'center', marginBottom: Spacing.lg },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold as any, color: Colors.textPrimary, marginTop: Spacing.sm },
    subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
    steps: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: Spacing.xl },
    stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
    stepDotActive: { backgroundColor: Colors.primary },
    otpHint: { textAlign: 'center', color: Colors.textSecondary, fontSize: FontSize.sm, marginBottom: Spacing.xs },
    otpEmail: { color: Colors.textPrimary, fontWeight: FontWeight.semibold as any },
    resendBtn: { alignItems: 'center', marginTop: Spacing.lg },
    resendText: { color: Colors.primary, fontSize: FontSize.sm },
});
