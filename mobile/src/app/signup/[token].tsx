import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SignupScreen from '@/features/auth/SignupScreen';

/** An admin invite link: https://www.smle-question-bank.com/signup/<token>. */
export default function InviteSignupRoute() {
  const { token } = useLocalSearchParams<{ token: string }>();
  return <SignupScreen mode="invite" token={token} />;
}
