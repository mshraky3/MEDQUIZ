/**
 * Reusable text input with label and error support
 */

import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet, TouchableOpacity, TextInputProps as RNProps } from 'react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '../../constants/theme';

interface InputProps extends RNProps {
    label?: string;
    error?: string;
    isPassword?: boolean;
}

export default function Input({ label, error, isPassword, style, ...rest }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputWrapper, isFocused && styles.inputFocused, error && styles.inputError]}>
                <RNTextInput
                    style={[styles.input, style]}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={isPassword && !showPassword}
                    autoCapitalize="none"
                    onFocus={(e) => { setIsFocused(true); rest.onFocus?.(e); }}
                    onBlur={(e) => { setIsFocused(false); rest.onBlur?.(e); }}
                    {...rest}
                />
                {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggle}>
                        <Text style={styles.toggleText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginBottom: Spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgInput,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inputFocused: {
        borderColor: Colors.borderFocus,
    },
    inputError: {
        borderColor: Colors.error,
    },
    input: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: FontSize.base,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    toggle: {
        paddingHorizontal: Spacing.md,
    },
    toggleText: {
        fontSize: 18,
    },
    error: {
        color: Colors.error,
        fontSize: FontSize.xs,
        marginTop: Spacing.xs,
    },
});
