import React from 'react';
import { PLAY_BUILD } from '@/config';
import SignupScreen from '@/features/auth/SignupScreen';
import WebAccountScreen from '@/features/auth/WebAccountScreen';

export default function SignupRoute() {
  // The Google Play build is sign-in only: accounts are created on the website.
  // Invite (/signup/:token) and paid-seat (/join/:token) links still open their own screens.
  return PLAY_BUILD ? <WebAccountScreen /> : <SignupScreen mode="free" />;
}
