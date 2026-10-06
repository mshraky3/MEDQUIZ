import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GOOGLE_WEB_CLIENT_ID } from '@/config';
import { useApp } from '@/i18n';
import { api } from '@/lib/api';
import { colors, radius } from '@/theme';
import { Spinner, T } from '@/ui';

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
export const GOOGLE_SIGN_IN_AVAILABLE = Platform.OS === 'android' && Boolean(GOOGLE_WEB_CLIENT_ID);

type Props = {
  mode: 'login' | 'signup';
  dividerLabel: string;
  dividerPosition?: 'before' | 'after';
  track?: string | null;
  onSuccess: (data: any) => void | Promise<void>;
  onError?: (err: unknown) => void;
};

let configured = false;

/**
 * The native module is loaded on the first tap, not at startup: it does not
 * exist on the web preview, and a build with no client id never needs it.
 */
async function loadGoogle() {
  const mod = await import('@react-native-google-signin/google-signin');
  if (!configured) {
    // The ID token is minted for the WEB client id: that is the audience the
    // backend verifies (POST /api/auth/google), the same one the website uses.
    mod.GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    configured = true;
  }
  return mod;
}

const GoogleG = () => (
  <Svg width={20} height={20} viewBox="0 0 18 18">
    <Path
      fill="#4285F4"
      d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
    />
    <Path
      fill="#34A853"
      d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
    />
    <Path
      fill="#FBBC05"
      d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z"
    />
    <Path
      fill="#EA4335"
      d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
    />
  </Svg>
);

function Divider({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ flex: 1, height: StyleSheet.hairlineWidth * 2, backgroundColor: colors.border }} />
      <T size={12} color={colors.textLight}>
        {label}
      </T>
      <View style={{ flex: 1, height: StyleSheet.hairlineWidth * 2, backgroundColor: colors.border }} />
    </View>
  );
}

export function GoogleButton({ mode, dividerLabel, dividerPosition = 'before', track, onSuccess, onError }: Props) {
  const app = useApp();
  const [busy, setBusy] = useState(false);
  if (!GOOGLE_SIGN_IN_AVAILABLE) return null;

  const press = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } = await loadGoogle();
      try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const response = await GoogleSignin.signIn();
        // Closing the account chooser is not an error.
        if (!isSuccessResponse(response)) return;
        const credential = response.data.idToken;
        if (!credential) throw new Error('google_no_id_token');
        // Forget the device-level Google session so the next tap offers the
        // account chooser again instead of silently reusing this account.
        GoogleSignin.signOut().catch(() => {});
        const data = await api.post<any>(
          '/api/auth/google',
          // mode 'login' tells the backend not to create an account for an
          // identity it has never seen; track is only used on first sign-in.
          { credential, mode, ...(track ? { track } : {}) },
          { auth: false }
        );
        // The credential rides along so a caller that gets needsTrackSelection
        // can re-post it with the chosen track without a second Google tap.
        await onSuccess({ ...data, credential });
      } catch (err) {
        if (isErrorWithCode(err) && err.code === statusCodes.SIGN_IN_CANCELLED) return;
        onError?.(err);
      }
    } catch (err) {
      // The native module itself failed to load.
      onError?.(err);
    } finally {
      setBusy(false);
    }
  };

  const divider = <Divider label={dividerLabel} />;
  return (
    <View style={{ gap: 12 }}>
      {dividerPosition === 'before' ? divider : null}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => void press()}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={app.continueWithGoogle}
        style={{
          minHeight: 48,
          borderRadius: radius.md,
          borderWidth: 1.5,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          paddingHorizontal: 16,
        }}
      >
        {busy ? <Spinner size="sm" /> : <GoogleG />}
        <T weight="semibold" size={15}>
          {app.continueWithGoogle}
        </T>
      </TouchableOpacity>
      {dividerPosition === 'after' ? divider : null}
    </View>
  );
}
