import { useEffect, useRef, useState } from 'react';

interface Options {
  targetSec: number;
  onEnd?: (elapsedSec: number) => void;
}

export function useTimer({ targetSec, onEnd }: Options) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tick = () => {
    if (!startRef.current) return;
    const diff = Math.floor((Date.now() - startRef.current) / 1000);
    setElapsed(diff);
    if (diff >= targetSec) {
      stop();
      onEnd?.(diff);
    }
  };

  const start = () => {
    if (startRef.current) return;
    startRef.current = Date.now();
    setElapsed(0);
    tick();
    timerRef.current = setInterval(tick, 1000);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  };

  useEffect(() => {
    return stop;
  }, []);

  return { elapsed, start, stop };
}

