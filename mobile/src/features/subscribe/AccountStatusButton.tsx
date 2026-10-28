import React from 'react';
import { router } from 'expo-router';
import { useApp } from '@/i18n';
import { Button } from '@/ui';

/**
 * The Play build's stand-in for every "Subscribe" button: it opens the neutral account-status
 * screen (no prices, no purchase). Never a link to a payment page (Play payments policy).
 */
export function AccountStatusButton({ size = 'md', variant = 'primary' }: { size?: 'sm' | 'md' | 'lg'; variant?: 'primary' | 'secondary' | 'ghost' }) {
  const app = useApp().playAccess;
  return <Button label={app.cta} size={size} variant={variant} icon="user" onPress={() => router.push('/subscribe')} />;
}
