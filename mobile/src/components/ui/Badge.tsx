/**
 * Pill / badge component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../constants/theme';

interface BadgeProps {
    text: string;
    color?: string;
    bgColor?: string;
    style?: ViewStyle;
}

function deriveBackground(color: string): string {
    const map: Record<string, string> = {
        [Colors.primary]: 'rgba(34, 211, 238, 0.15)',
        [Colors.success]: 'rgba(34, 197, 94, 0.15)',
        [Colors.error]: 'rgba(239, 68, 68, 0.15)',
        [Colors.warning]: 'rgba(245, 158, 11, 0.15)',
        [Colors.info]: 'rgba(59, 130, 246, 0.15)',
    };
    return map[color] ?? 'rgba(34, 211, 238, 0.15)';
}

export default function Badge({
    text,
    color = Colors.primary,
    bgColor,
    style,
}: BadgeProps) {
    const bg = bgColor ?? deriveBackground(color);
    return (
        <View style={[styles.badge, { backgroundColor: bg }, style]}>
            <Text style={[styles.text, { color }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },
});
