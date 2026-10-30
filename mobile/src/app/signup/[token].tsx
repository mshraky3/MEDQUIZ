import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PLAY_BUILD } from '@/config';
import SignupScreen from '@/features/auth/SignupScreen';
import WebAccountScreen from '@/features/auth/WebAccountScreen';

/** An admin invite link: https://www.smle-question-bank.com/signup/<token>. */
export default function InviteSignupRoute() {
  const { token } = useLocalSearchParams<{ token: string }>();
  return PLAY_BUILD ? <WebAccountScreen path={`/signup/${encodeURIComponent(token ?? '')}`} /> : <SignupScreen mode="invite" token={token} />;
}
