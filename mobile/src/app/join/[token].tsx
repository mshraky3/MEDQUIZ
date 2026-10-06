import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SignupScreen from '@/features/auth/SignupScreen';

/** A paid group seat: https://www.smle-question-bank.com/join/<token>. */
export default function JoinSeatRoute() {
  const { token } = useLocalSearchParams<{ token: string }>();
  return <SignupScreen mode="seat" token={token} />;
}
