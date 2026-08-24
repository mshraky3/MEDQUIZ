import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Globals from '../../global.js';

// Google renders its own official button UI (Google Identity Services) — we
// don't draw it, we only get to pass the options `renderButton` accepts and
// size the box around it. Renders null when the env var isn't set, so an
// incomplete provider setup never ships a dead button.
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

// Google clamps `width` at 400px and ignores anything larger, so 400 is the
// widest this button can ever be. .oauth-block caps its column to the same
// number (see Login.css) — that way the 400 is a deliberate column width the
// submit button also matches, rather than a button that silently stops
// growing partway across the card.
const GSI_MAX_WIDTH = 400;

const OAuthButtons = ({ dividerLabel, onSuccess, onError, track, mode = 'signup' }) => {
  const boxRef = useRef(null);
  // Google needs `width` as a NUMBER of px — it has no notion of 100%. Without
  // it GSI sizes the button to its own label (~220px) and leaves the rest of
  // the column empty, which is what made this button look like it belonged to
  // a different page. Measured rather than hardcoded so it still fits when the
  // card narrows on a phone.
  const [width, setWidth] = useState(GSI_MAX_WIDTH);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => {
      const next = Math.min(Math.round(entry.contentRect.width), GSI_MAX_WIDTH);
      // Only on a real change: GoogleLogin re-runs renderButton whenever its
      // props change, and a width that updates on every observer tick would
      // rebuild the button (and flash it) continuously during a resize.
      if (next > 0) setWidth((prev) => (prev === next ? prev : next));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      const { data } = await axios.post(`${Globals.URL}/api/auth/google`, {
        credential: credentialResponse.credential,
        // 'login' tells the backend not to create an account for a Google
        // identity it has never seen — /login signs people in, it does not
        // sign them up. See the mode branch in POST /api/auth/google.
        mode,
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
  }, [mode, track, onSuccess, onError]);

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="oauth-block">
      <div className="oauth-divider"><span>{dividerLabel}</span></div>
      <div className="oauth-buttons">
        <div className="oauth-buttons-google" ref={boxRef}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => onError?.(new Error('google_login_failed'))}
              text="continue_with"
              // Rectangular, not pill: GSI gives no radius control, and its
              // rectangular corner (~4px) is far closer to the card's 12px
              // than a 20px pill is. Login.css overrides it to 12px on top of
              // this; rectangular is what shows if that override ever stops
              // matching Google's markup.
              shape="rectangular"
              size="large"
              width={width}
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default OAuthButtons;
