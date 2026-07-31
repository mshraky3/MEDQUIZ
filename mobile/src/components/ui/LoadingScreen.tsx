/**
 * Full-screen loading spinner
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../../constants/theme';

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bgDark,
        padding: Spacing.xl,
    },
    text: {
        color: Colors.textSecondary,
        fontSize: FontSize.base,
        marginTop: Spacing.lg,
    },
});
