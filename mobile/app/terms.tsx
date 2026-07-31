/**
 * Terms of Use screen — static legal page
 */

import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing } from '../src/constants/theme';

export default function TermsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Terms of Use</Text>

                <Text style={styles.heading}>1. Acceptance of Terms</Text>
                <Text style={styles.body}>
                    By using the SQB application, you agree to these terms. If you do not agree, please do not use the application.
                </Text>

                <Text style={styles.heading}>2. Description of Service</Text>
                <Text style={styles.body}>
                    SQB provides SMLE practice questions, quizzes, and performance analytics for medical exam preparation.
                    The service is provided "as is" without warranty of any kind.
                </Text>

                <Text style={styles.heading}>3. User Accounts</Text>
                <Text style={styles.body}>
                    You are responsible for maintaining the confidentiality of your account credentials.
                    You agree to provide accurate information when creating an account.
                </Text>

                <Text style={styles.heading}>4. Acceptable Use</Text>
                <Text style={styles.body}>
                    You may not share your account with others, attempt to gain unauthorized access, or use the service for any unlawful purpose.
                    Sharing or distributing the questions outside the app is prohibited.
                </Text>

                <Text style={styles.heading}>5. Intellectual Property</Text>
                <Text style={styles.body}>
                    All content, questions, and materials within SQB are the property of the service provider. Reproduction or distribution without permission is prohibited.
                </Text>

                <Text style={styles.heading}>6. Limitation of Liability</Text>
                <Text style={styles.body}>
                    SQB is a study aid and does not guarantee exam success. We are not liable for any damages arising from use of the service.
                </Text>

                <Text style={styles.heading}>7. Subscription & Payment</Text>
                <Text style={styles.body}>
                    The Service operates on a paid annual subscription of 100 SAR per year. Users who registered
                    before the paid rollout are grandfathered and retain free access, and accounts created by
                    administrators are exempt from subscription charges. No free trials are offered. Refunds, where
                    applicable, are governed by our Refund Policy. Payments are processed securely through Moyasar,
                    a licensed Saudi payment gateway; we do not store full card details on our servers.
                </Text>

                <Text style={styles.heading}>8. Changes to Terms</Text>
                <Text style={styles.body}>
                    We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.
                </Text>

                <Text style={styles.heading}>9. Legal Entity & Contact</Text>
                <Text style={styles.body}>
                    شركة دار الخبرة التجارية{'\n'}
                    السجل التجاري: 7040567922{'\n'}
                    Email: alshraky3@gmail.com{'\n'}
                    WhatsApp: +966 58 261 9119
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.bgDark },
    scroll: { padding: Spacing.xl, paddingBottom: Spacing['5xl'] },
    title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, color: Colors.textPrimary, marginBottom: Spacing.xl },
    heading: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: Spacing.xl, marginBottom: Spacing.sm },
    body: { fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 24 },
});
