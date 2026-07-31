/**
 * Contact screen — mirrors Contact.jsx
 * Contact form + WhatsApp/email info + suggestions link
 */

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../src/constants/theme';
import Config from '../../src/constants/config';
import Card from '../../src/components/ui/Card';
import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';

const SUBJECTS = [
    { key: 'subscription', label: 'Subscription' },
    { key: 'report issue', label: 'Report Issue' },
    { key: 'other', label: 'Other' },
];

export default function ContactScreen() {
    const [form, setForm] = useState({ name: '', mobile: '', subject: 'subscription', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.mobile.trim() || !form.message.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${Config.API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    mobile: form.mobile,
                    subject: form.subject,
                    message: form.message,
                }),
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ name: '', mobile: '', subject: 'subscription', message: '' });
            } else {
                throw new Error('Failed');
            }
        } catch {
            // Fallback to email
            const subject = encodeURIComponent(form.subject || 'Contact from SQB');
            const body = encodeURIComponent(
                `Name: ${form.name}\nMobile: ${form.mobile}\n\nMessage:\n${form.message}`,
            );
            Linking.openURL(`mailto:alshraky3@gmail.com?subject=${subject}&body=${body}`);
            setSuccess(true);
            setForm({ name: '', mobile: '', subject: 'subscription', message: '' });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.center}>
                    <Text style={styles.successIcon}>✅</Text>
                    <Text style={styles.successTitle}>Message Sent!</Text>
                    <Text style={styles.successText}>Thank you for reaching out. We'll get back to you soon.</Text>
                    <TouchableOpacity
                        style={styles.whatsappButton}
                        onPress={() => Linking.openURL('https://wa.link/gqafib')}
                    >
                        <Text style={styles.whatsappText}>📱 WhatsApp: 0582619119</Text>
                    </TouchableOpacity>
                    <Button
                        title="Send Another Message"
                        onPress={() => setSuccess(false)}
                        variant="outline"
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Contact Us</Text>
                    <Text style={styles.subtitle}>Get support, ask questions, or share feedback</Text>
                </View>

                {/* Quick contact */}
                <View style={styles.quickRow}>
                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={() => Linking.openURL('https://wa.link/gqafib')}
                    >
                        <Text style={styles.quickIcon}>💬</Text>
                        <Text style={styles.quickLabel}>WhatsApp</Text>
                        <Text style={styles.quickValue}>0582619119</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.quickCard}
                        onPress={() => Linking.openURL('mailto:alshraky3@gmail.com')}
                    >
                        <Text style={styles.quickIcon}>✉️</Text>
                        <Text style={styles.quickLabel}>Email</Text>
                        <Text style={styles.quickValue}>alshraky3@gmail.com</Text>
                    </TouchableOpacity>
                </View>

                {/* Suggestions link */}
                <TouchableOpacity style={styles.suggestionsButton} onPress={() => router.push('/suggestions')}>
                    <Text style={styles.suggestionsIcon}>💡</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.suggestionsTitle}>Suggestions & Ideas</Text>
                        <Text style={styles.suggestionsSubtitle}>Help us improve the app</Text>
                    </View>
                    <Text style={styles.suggestionsArrow}>→</Text>
                </TouchableOpacity>

                {/* Form */}
                <Card style={styles.formCard}>
                    <Text style={styles.formTitle}>Send us a message</Text>

                    <Input
                        label="Your Name *"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChangeText={(v) => setForm({ ...form, name: v })}
                    />
                    <Input
                        label="Phone Number *"
                        placeholder="Enter your phone number"
                        value={form.mobile}
                        onChangeText={(v) => setForm({ ...form, mobile: v })}
                        keyboardType="phone-pad"
                    />

                    {/* Subject picker */}
                    <Text style={styles.inputLabel}>Subject</Text>
                    <View style={styles.subjectRow}>
                        {SUBJECTS.map((s) => (
                            <TouchableOpacity
                                key={s.key}
                                style={[styles.subjectChip, form.subject === s.key && styles.subjectChipActive]}
                                onPress={() => setForm({ ...form, subject: s.key })}
                            >
                                <Text style={[styles.subjectText, form.subject === s.key && styles.subjectTextActive]}>
                                    {s.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Input
                        label="Message *"
                        placeholder="Write your message..."
                        value={form.message}
                        onChangeText={(v) => setForm({ ...form, message: v })}
                        multiline
                        numberOfLines={5}
                        style={{ minHeight: 120, textAlignVertical: 'top' }}
                    />

                    <Button title="Send Message" onPress={handleSubmit} loading={loading} size="large" />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    scroll: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },

    header: { marginBottom: Spacing.xl },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary },
    subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },

    successIcon: { fontSize: 64 },
    successTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: Spacing.lg },
    successText: { color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
    whatsappButton: {
        marginTop: Spacing.xl, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl,
        backgroundColor: '#25D366', borderRadius: BorderRadius.md,
    },
    whatsappText: { color: '#fff', fontWeight: FontWeight.semibold, fontSize: FontSize.base },

    quickRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
    quickCard: {
        flex: 1, backgroundColor: Colors.bgCard, borderRadius: BorderRadius.md,
        padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
    },
    quickIcon: { fontSize: 28, marginBottom: Spacing.sm },
    quickLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
    quickValue: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },

    suggestionsButton: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCard,
        borderRadius: BorderRadius.md, padding: Spacing.lg, gap: Spacing.md,
        borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
    },
    suggestionsIcon: { fontSize: 28 },
    suggestionsTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
    suggestionsSubtitle: { fontSize: FontSize.xs, color: Colors.textMuted },
    suggestionsArrow: { fontSize: 20, color: Colors.textMuted },

    formCard: { padding: Spacing.xl },
    formTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.lg },
    inputLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.sm, marginTop: Spacing.md },
    subjectRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
    subjectChip: {
        paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full, backgroundColor: Colors.bgInput,
        borderWidth: 1, borderColor: Colors.border,
    },
    subjectChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    subjectText: { color: Colors.textSecondary, fontSize: FontSize.sm },
    subjectTextActive: { color: Colors.textInverse, fontWeight: FontWeight.semibold },
});
