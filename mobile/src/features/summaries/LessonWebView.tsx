import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Linking, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { ShouldStartLoadRequest, WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { SITE_URL } from '@/config';
import { buildLessonHtml } from './lessonHtml';

export type LessonCommands = {
  setTool: (tool: string) => void;
  setColor: (color: string) => void;
  undo: () => void;
  clear: () => void;
};

type Props = { summaryHtml: string; accent?: string; onReady?: () => void };

/**
 * One lesson, rendered by a WebView with the website's own stylesheet so the
 * tables, algorithms and diagrams look exactly as they do on the site. The app
 * drives the drawing tools through `ref` (see annotation.ts).
 */
export const LessonWebView = forwardRef<LessonCommands, Props>(function LessonWebView({ summaryHtml, accent, onReady }, ref) {
  const html = useMemo(() => buildLessonHtml({ summaryHtml, accent }), [summaryHtml, accent]);
  const webRef = useRef<WebView>(null);

  const run = useCallback((js: string) => webRef.current?.injectJavaScript(`${js}; true;`), []);

  useImperativeHandle(
    ref,
    () => ({
      setTool: (tool) => run(`window.sqb && window.sqb.setTool(${JSON.stringify(tool)})`),
      setColor: (color) => run(`window.sqb && window.sqb.setColor(${JSON.stringify(color)})`),
      undo: () => run('window.sqb && window.sqb.undo()'),
      clear: () => run('window.sqb && window.sqb.clear()'),
    }),
    [run]
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data) as { type?: string; url?: string };
        if (msg.type === 'ready') onReady?.();
        else if (msg.type === 'link' && msg.url && /^https?:\/\//i.test(msg.url)) Linking.openURL(msg.url).catch(() => {});
      } catch {
        /* not ours */
      }
    },
    [onReady]
  );

  // The lesson never navigates: anything but the page itself is an external link.
  const onShouldStart = useCallback((request: ShouldStartLoadRequest) => {
    if (request.url === 'about:blank' || request.url === SITE_URL || request.url === `${SITE_URL}/`) return true;
    if (/^https?:\/\//i.test(request.url)) Linking.openURL(request.url).catch(() => {});
    return false;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <WebView
        ref={webRef}
        // baseUrl makes /summaries/<image>.webp resolve to the site's public images.
        source={{ html, baseUrl: SITE_URL }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onMessage={onMessage}
        onShouldStartLoadWithRequest={onShouldStart}
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        nestedScrollEnabled
        overScrollMode="never"
        showsVerticalScrollIndicator
        mixedContentMode="never"
        allowsInlineMediaPlayback
      />
    </View>
  );
});
