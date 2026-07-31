/**
 * Alert box for success/error/warning messages
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing } from '../../constants/theme';

interface AlertBoxProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

const bgMap = {
    success: Colors.successBg,
    error: Colors.errorBg,
    warning: Colors.warningBg,
    info: 'rgba(59, 130, 246, 0.1)',
};

const colorMap = {
    success: Colors.success,
    error: Colors.error,
    warning: Colors.warning,
    info: Colors.info,
};

export default function AlertBox({ message, type }: AlertBoxProps) {
    return (
        <View style={[styles.container, { backgroundColor: bgMap[type], borderLeftColor: colorMap[type] }]}>
            <Text style={[styles.text, { color: colorMap[type] }]}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.sm,
        borderLeftWidth: 4,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    text: {
        fontSize: FontSize.sm,
        lineHeight: 20,
    },
});
