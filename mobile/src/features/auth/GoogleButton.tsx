import React from 'react';
import { GOOGLE_WEB_CLIENT_ID } from '@/config';

/**
 * Whether this build can offer Google sign-in at all. The website treats Google
 * as the PRIMARY route on /signup and collapses the email form behind it, so a
 * build without Google must open the email form instead.
 *
 * Google Sign-In on Android needs a native OAuth client (package
 * com.m_alshraky3.sqb + the EAS signing SHA-1) in the same Google Cloud project
 * as the website's web client, created by the owner. Until EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
 * is set the button is not drawn. See docs/GOOGLE_SIGN_IN.md.
 */
export const GOOGLE_SIGN_IN_AVAILABLE = false && Boolean(GOOGLE_WEB_CLIENT_ID);

type Props = {
  mode: 'login' | 'signup';
  dividerLabel: string;
  dividerPosition?: 'before' | 'after';
  track?: string | null;
  onSuccess: (data: any) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

export function GoogleButton(_props: Props): React.ReactElement | null {
  if (!GOOGLE_SIGN_IN_AVAILABLE) return null;
  return null;
}
