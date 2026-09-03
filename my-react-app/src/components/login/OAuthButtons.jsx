import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Globals from '../../global.js';
import { useLang } from '../../i18n';

// Google renders its own official button UI (Google Identity Services) — we
// don't draw it, we only get to pass the options `renderButton` accepts and
// size the box around it. Renders null when the env var isn't set, so an
// incomplete provider setup never ships a dead button.
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID;

/**
 * Whether this build can offer Google sign-in at all.
 *
 * Exported because a caller that treats Google as the PRIMARY route (see
 * /signup, which collapses its email form behind it) has to know when there is
 * no primary route to collapse behind — otherwise a missing env var leaves the
 * page with nothing but a secondary button.
 */
export const GOOGLE_SIGN_IN_AVAILABLE = Boolean(GOOGLE_CLIENT_ID);

// Google clamps `width` at 400px and ignores anything larger, so 400 is the
// widest this button can ever be. .oauth-block caps its column to the same
// number (see Login.css) — that way the 400 is a deliberate column width the
// submit button also matches, rather than a button that silently stops
// growing partway across the card.
const GSI_MAX_WIDTH = 400;

/**
 * @param {'before'|'after'} dividerPosition
 *   Which side of the Google button the divider sits on. It is a prop rather
 *   than a constant because the two callers stack the block differently:
 *   /login puts this component BELOW its email form, so "or" belongs above the
 *   Google button; /signup puts it ABOVE the email fields, so a label like
 *   "or create your account manually" has to come after it — otherwise the
 *   page reads as though Google *is* the manual option.
 */
const OAuthButtons = ({ dividerLabel, onSuccess, onError, track, mode = 'signup', dividerPosition = 'before' }) => {
  const boxRef = useRef(null);
  // GSI draws its own button and picks its own language — by default the
  // visitor's Google/browser locale, which is how an Arabic "المواصلة باستخدام
  // Google" ended up in the middle of the English signup page. Passing the
  // site language puts the button in the language the rest of the page is in.
  //
  // Note this is applied via `?hl=` on the GSI script URL, which is fetched
  // once per page load: switching language in-session re-renders everything
  // else immediately, but Google's own button keeps its original language
  // until the next full load.
  const { lang } = useLang();
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

  const divider = <div className="oauth-divider"><span>{dividerLabel}</span></div>;

  return (
    <div className="oauth-block">
      {dividerPosition === 'before' && divider}
      <div className="oauth-buttons">
        <div className="oauth-buttons-google" ref={boxRef}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale={lang}>
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
      {dividerPosition === 'after' && divider}
    </div>
  );
};

export default OAuthButtons;
