/**
 * Bottom sheet modal overlay
 */

import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
    const insets = useSafeAreaInsets();

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.xl }]}
                >
                    <View style={styles.handle} />
                    {title && <Text style={styles.title}>{title}</Text>}
                    <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.bgModal,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: Colors.bgCard,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.xl,
        maxHeight: '85%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.borderLight,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
});
