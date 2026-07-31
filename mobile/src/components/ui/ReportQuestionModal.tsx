import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';
import { protectedPost } from '../../utils/protectedApi';
import Config from '../../constants/config';

interface Props {
    visible: boolean;
    questionId: number | null;
    questionText?: string;
    userId: number | null;
    userEmail: string | null;
    onClose: () => void;
}

export default function ReportQuestionModal({ visible, questionId, questionText, userId, userEmail, onClose }: Props) {
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async () => {
        if (status === 'loading' || status === 'success') return;
        if (!questionId || !userId || !userEmail) return;

        setStatus('loading');
        try {
            await protectedPost(`${Config.API_URL}/api/question-reports`, {
                question_id: questionId,
                user_id: userId,
                user_email: userEmail,
                reason: reason.trim() || null,
            });
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    const handleClose = () => {
        setReason('');
        setStatus('idle');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.centered} keyboardShouldPersistTaps="handled">
                    <View style={styles.modal}>
                        <View style={styles.header}>
                            <Text style={styles.title}>🚩 Report Question</Text>
                            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Text style={styles.closeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {status === 'success' ? (
                            <View style={styles.successBox}>
                                <Text style={styles.successText}>
                                    ✅ Report submitted! We'll review it and email you the result.
                                </Text>
                                <TouchableOpacity style={styles.submitBtn} onPress={handleClose}>
                                    <Text style={styles.submitBtnText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                {questionText ? (
                                    <View style={styles.questionPreview}>
                                        <Text style={styles.questionPreviewText} numberOfLines={3}>{questionText}</Text>
                                    </View>
                                ) : null}

                                <Text style={styles.label}>
                                    What seems wrong?{' '}
                                    <Text style={styles.optional}>(optional)</Text>
                                </Text>
                                <TextInput
                                    style={styles.textarea}
                                    placeholder="e.g. The correct answer should be option 2..."
                                    placeholderTextColor={Colors.textSecondary}
                                    value={reason}
                                    onChangeText={setReason}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={500}
                                    textAlignVertical="top"
                                />

                                {status === 'error' && (
                                    <Text style={styles.errorText}>Failed to submit. Please try again.</Text>
                                )}

                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.submitBtn, status === 'loading' && styles.disabledBtn]}
                                        onPress={handleSubmit}
                                        disabled={status === 'loading'}
                                    >
                                        <Text style={styles.submitBtnText}>
                                            {status === 'loading' ? 'Submitting...' : 'Submit Report'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
    },
    centered: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modal: {
        width: '100%',
        maxWidth: 480,
        backgroundColor: '#1a2237',
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: '#2d3f60',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.bold,
        color: Colors.text,
    },
    closeBtn: {
        color: Colors.textSecondary,
        fontSize: FontSize.md,
        padding: 4,
    },
    questionPreview: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: '#2d3f60',
    },
    questionPreviewText: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        lineHeight: 20,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        marginBottom: Spacing.xs,
    },
    optional: {
        color: '#475569',
        fontSize: FontSize.xs,
    },
    textarea: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: '#2d3f60',
        borderRadius: BorderRadius.md,
        color: Colors.text,
        padding: Spacing.sm,
        fontSize: FontSize.sm,
        minHeight: 72,
        marginBottom: Spacing.sm,
    },
    errorText: {
        color: Colors.error,
        fontSize: FontSize.sm,
        marginBottom: Spacing.sm,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    cancelBtn: {
        borderWidth: 1,
        borderColor: '#2d3f60',
        borderRadius: BorderRadius.md,
        paddingVertical: 9,
        paddingHorizontal: 18,
    },
    cancelBtnText: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: 9,
        paddingHorizontal: 18,
    },
    disabledBtn: {
        opacity: 0.6,
    },
    submitBtnText: {
        color: '#0b1021',
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
    },
    successBox: {
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    successText: {
        color: '#86efac',
        fontSize: FontSize.sm,
        textAlign: 'center',
        marginBottom: Spacing.md,
        lineHeight: 22,
    },
});
