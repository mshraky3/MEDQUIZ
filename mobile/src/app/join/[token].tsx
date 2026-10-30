import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PLAY_BUILD } from '@/config';
import SignupScreen from '@/features/auth/SignupScreen';
import WebAccountScreen from '@/features/auth/WebAccountScreen';

/** A paid group seat: https://www.smle-question-bank.com/join/<token>. */
export default function JoinSeatRoute() {
  const { token } = useLocalSearchParams<{ token: string }>();
  return PLAY_BUILD ? <WebAccountScreen path={`/join/${encodeURIComponent(token ?? '')}`} /> : <SignupScreen mode="seat" token={token} />;
}
