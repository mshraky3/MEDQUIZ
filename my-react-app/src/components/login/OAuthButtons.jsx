import React from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Globals from '../../global.js';

// Google renders its own official button UI (Google Identity Services) — no
// custom button styling needed, just a container to mount it into and a POST
// of whatever it hands back. Renders null when the env var isn't set, so an
// incomplete provider setup never ships a dead button.
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

const OAuthButtons = ({ dividerLabel, onSuccess, onError }) => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post(`${Globals.URL}/api/auth/google`, {
        credential: credentialResponse.credential,
      });
      onSuccess(data);
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
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default OAuthButtons;
