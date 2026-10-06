import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * The on-screen keyboard's height (0 when hidden). Android 15+ forces
 * edge-to-edge windows, and there the system may not shrink the window for the
 * keyboard, which would leave the lower form fields underneath it. Screens add
 * this much scroll room at the bottom so the field being typed in can always be
 * scrolled into view. If the window DOES resize, the extra room is just slack.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;
    const show = Keyboard.addListener('keyboardDidShow', (e) => setHeight(e.endCoordinates?.height || 0));
    const hide = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return height;
}
