import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { buildLessonHtml } from './lessonHtml';
import type { LessonCommands } from './LessonWebView';

type Props = { summaryHtml: string; accent?: string; onReady?: () => void };

/**
 * Browser build of the lesson view (used by the web preview only): the same HTML
 * in an iframe, driven through the same commands. It exists so lessons and the
 * drawing layer can be checked on a computer; the app itself uses the WebView.
 */
export const LessonWebView = forwardRef<LessonCommands, Props>(function LessonWebView({ summaryHtml, accent, onReady }, ref) {
  const html = useMemo(() => buildLessonHtml({ summaryHtml, accent }), [summaryHtml, accent]);
  const frame = useRef<HTMLIFrameElement | null>(null);

  const call = (code: string) => {
    try {
      (frame.current?.contentWindow as unknown as { eval: (c: string) => void } | null)?.eval(code);
    } catch {
      /* the frame is not ready yet */
    }
  };

  useImperativeHandle(ref, () => ({
    setTool: (tool) => call(`window.sqb && window.sqb.setTool(${JSON.stringify(tool)})`),
    setColor: (color) => call(`window.sqb && window.sqb.setColor(${JSON.stringify(color)})`),
    undo: () => call('window.sqb && window.sqb.undo()'),
    clear: () => call('window.sqb && window.sqb.clear()'),
  }));

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.sqb?.type === 'ready') onReady?.();
      if (e.data?.sqb?.type === 'link' && e.data.sqb.url) window.open(e.data.sqb.url, '_blank', 'noopener');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onReady]);

  return React.createElement('iframe', {
    ref: frame,
    srcDoc: html,
    title: 'lesson',
    style: { flex: 1, width: '100%', height: '100%', border: 0, background: '#fff' },
  });
});
