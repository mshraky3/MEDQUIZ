/**
 * Reusable Button component matching SQB web styles
 */

import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../constants/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    style,
    textStyle,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.base,
                styles[variant],
                styles[size],
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' ? Colors.primary : Colors.textPrimary}
                />
            ) : (
                <Text
                    style={[
                        styles.text,
                        styles[`${variant}Text` as keyof typeof styles],
                        styles[`${size}Text` as keyof typeof styles],
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.bgCardHover,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    danger: {
        backgroundColor: Colors.error,
    },
    small: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        minHeight: 36,
    },
    medium: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        minHeight: 44,
    },
    large: {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing['2xl'],
        minHeight: 52,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: FontWeight.semibold,
    },
    primaryText: {
        color: Colors.textInverse,
        fontSize: FontSize.base,
    },
    secondaryText: {
        color: Colors.textPrimary,
        fontSize: FontSize.base,
    },
    outlineText: {
        color: Colors.primary,
        fontSize: FontSize.base,
    },
    dangerText: {
        color: Colors.white,
        fontSize: FontSize.base,
    },
    smallText: {
        fontSize: FontSize.sm,
    },
    mediumText: {
        fontSize: FontSize.base,
    },
    largeText: {
        fontSize: FontSize.lg,
    },
});
