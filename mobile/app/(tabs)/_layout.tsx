/**
 * Protected layout — wraps authenticated screens with navigation guard + bottom tabs
 */

import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Colors, FontSize } from '../../src/constants/theme';
import { ActivityIndicator, View, Text } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        quizs: '📝',
        analysis: '📊',
        'wrong-questions': '❌',
        contact: '📞',
    };
    return (
        <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
            {icons[name] || '•'}
        </Text>
    );
}

export default function ProtectedLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgDark }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.bgCard,
                    borderTopColor: Colors.border,
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: FontSize.xs,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="quizs"
                options={{ title: 'Quiz', tabBarLabel: 'Quiz', tabBarIcon: ({ focused }) => <TabIcon name="quizs" focused={focused} /> }}
            />
            <Tabs.Screen
                name="analysis"
                options={{ title: 'Analysis', tabBarLabel: 'Analysis', tabBarIcon: ({ focused }) => <TabIcon name="analysis" focused={focused} /> }}
            />
            <Tabs.Screen
                name="wrong-questions"
                options={{ title: 'Review', tabBarLabel: 'Review', tabBarIcon: ({ focused }) => <TabIcon name="wrong-questions" focused={focused} /> }}
            />
            <Tabs.Screen
                name="contact"
                options={{ title: 'Contact', tabBarLabel: 'Contact', tabBarIcon: ({ focused }) => <TabIcon name="contact" focused={focused} /> }}
            />
        </Tabs>
    );
}
