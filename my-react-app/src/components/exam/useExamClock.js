import { useEffect, useRef, useState } from 'react';
import { secondsLeft } from './examClock.js';

/**
 * Re-reads an absolute deadline every second and when the tab becomes visible
 * again (timers are throttled in background tabs, the deadline is not).
 * `onExpire` runs exactly once per deadline, also when the deadline had already
 * passed by the time the hook mounted (a reload after the part ended).
 *
 * Returns { secondsLeft, expired }. With no deadline the clock is idle.
 */
export function useExamClock(deadline, { onExpire } = {}) {
    const [now, setNow] = useState(() => Date.now());
    const expireRef = useRef(onExpire);
    expireRef.current = onExpire;
    const firedFor = useRef(null);

    useEffect(() => {
        if (!Number.isFinite(deadline)) return undefined;
        const tick = () => setNow(Date.now());
        tick();
        const id = setInterval(tick, 1000);
        document.addEventListener('visibilitychange', tick);
        window.addEventListener('focus', tick);
        return () => {
            clearInterval(id);
            document.removeEventListener('visibilitychange', tick);
            window.removeEventListener('focus', tick);
        };
    }, [deadline]);

    const left = Number.isFinite(deadline) ? secondsLeft(deadline, now) : 0;
    const expired = Number.isFinite(deadline) && left === 0;

    useEffect(() => {
        if (!expired || firedFor.current === deadline) return;
        firedFor.current = deadline;
        if (expireRef.current) expireRef.current();
    }, [expired, deadline]);

    return { secondsLeft: left, expired };
}

export default useExamClock;
