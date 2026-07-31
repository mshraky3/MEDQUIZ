/**
 * Root layout — wraps entire app with AuthProvider, SafeArea, StatusBar.
 * Expo Router file-based routing entry point.
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { Colors } from '../src/constants/theme';
import { flushErrorQueue } from '../src/utils/errorTracking';

export default function RootLayout() {
    // Flush any queued errors from previous offline session
    useEffect(() => {
        flushErrorQueue();
    }, []);

    return (
        <AuthProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.bgDark },
                    animation: 'slide_from_right',
                }}
            />
        </AuthProvider>
    );
}
