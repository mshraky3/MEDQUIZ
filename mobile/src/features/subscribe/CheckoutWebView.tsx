import React, { useCallback, useMemo, useRef } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent, ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { SITE_URL } from '@/config';
import { CheckoutInit, buildCheckoutHtml, isAllowedCheckoutUrl, isCallbackUrl, parseCallbackUrl, CallbackResult } from './checkout';

type Props = {
  init: CheckoutInit;
  height?: number;
  onReady: () => void;
  onBlocked: () => void;
  onPayClick: () => void;
  onResult: (result: CallbackResult) => void;
};

/**
 * Moyasar's hosted card form, run inside the app. It loads from the site's
 * origin (`baseUrl`), which is what Moyasar's domain check for live keys looks
 * at, and ends by redirecting to the site's /payment/callback: that navigation
 * is caught here, never loaded, and handed to the screen as a result.
 */
export function CheckoutWebView({ init, height = 470, onReady, onBlocked, onPayClick, onResult }: Props) {
  const html = useMemo(() => buildCheckoutHtml(init), [init]);
  const handled = useRef(false);

  const deliver = useCallback(
    (url: string) => {
      if (handled.current) return;
      handled.current = true;
      onResult(parseCallbackUrl(url));
    },
    [onResult]
  );

  const onShouldStart = useCallback(
    (request: ShouldStartLoadRequest) => {
      if (isCallbackUrl(request.url)) {
        deliver(request.url);
        return false;
      }
      return isAllowedCheckoutUrl(request.url);
    },
    [deliver]
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data) as { type?: string };
        if (msg.type === 'ready') onReady();
        else if (msg.type === 'pay_click') onPayClick();
        else if (msg.type === 'blocked' || msg.type === 'error') onBlocked();
      } catch {
        /* ignore anything that is not ours */
      }
    },
    [onReady, onBlocked, onPayClick]
  );

  if (Platform.OS === 'web') return null;

  return (
    <View style={{ height, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' }}>
      <WebView
        source={{ html, baseUrl: SITE_URL }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        setSupportMultipleWindows={false}
        allowsInlineMediaPlayback
        mixedContentMode="never"
        onShouldStartLoadWithRequest={onShouldStart}
        // Some Android versions skip the hook above for server redirects, so the
        // final URL is checked here as well.
        onNavigationStateChange={(nav) => {
          if (isCallbackUrl(nav.url)) deliver(nav.url);
        }}
        onMessage={onMessage}
        onError={onBlocked}
        onHttpError={() => {
          /* a 4xx from a third-party page is shown by that page */
        }}
      />
    </View>
  );
}
