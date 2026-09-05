import React, { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element once it scrolls into view, then stops watching it.
 * Modelled on InstallShowcase's useStepPlayer: skips straight to the visible
 * state under prefers-reduced-motion, feature-detects IntersectionObserver,
 * and never re-triggers once shown (no re-hiding on scroll back up).
 */
export default function useScrollReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const io = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold, rootMargin: '0px 0px -10% 0px' });

    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/**
 * Thin wrapper so call sites don't each wire up the hook + className by hand.
 * Built with createElement rather than JSX: this project's eslint config has
 * no react plugin to mark a variable used only as a JSX tag name (`<Tag>`) as
 * referenced, so a dynamic element type has to be a plain function argument
 * instead for `no-unused-vars` to see it.
 */
export const Reveal = ({ as: tag = 'div', className = '', children, ...rest }) => {
  const [ref, visible] = useScrollReveal();
  return React.createElement(
    tag,
    { ref, className: `lp-reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`, ...rest },
    children
  );
};
