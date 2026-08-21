import React from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Globals from '../../global.js';

// Google renders its own official button UI (Google Identity Services) — no
// custom button styling needed, just a container to mount it into and a POST
// of whatever it hands back. Renders null when the env var isn't set, so an
// incomplete provider setup never ships a dead button.
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

const OAuthButtons = ({ dividerLabel, onSuccess, onError, track }) => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post(`${Globals.URL}/api/auth/google`, {
        credential: credentialResponse.credential,
        // Only meaningful the first time this Google identity signs in —
        // the backend ignores it for an existing account, whose track is
        // already fixed. Undefined on the login page, which passes no track.
        ...(track ? { track } : {}),
      });
      // The credential is still valid for ~1hr — passed through so a caller
      // that gets back `needsTrackSelection` (a brand-new identity with no
      // track yet) can re-POST it with a track once the visitor picks one,
      // without asking them to click the Google button a second time.
      onSuccess({ ...data, credential: credentialResponse.credential });
    } catch (err) {
      onError?.(err);
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="oauth-block">
      <div className="oauth-divider"><span>{dividerLabel}</span></div>
      <div className="oauth-buttons">
        <div className="oauth-buttons-google">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => onError?.(new Error('google_login_failed'))}
              text="continue_with"
              shape="pill"
              size="large"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default OAuthButtons;
