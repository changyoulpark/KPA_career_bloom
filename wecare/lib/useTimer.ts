import { useCallback, useEffect, useRef, useState } from 'react';

interface Options {
  targetSec?: number;
  onFinish?: () => void;
}

export function useTimer(options: Options = {}) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startRef.current = null;
    setIsRunning(false);
  }, []);

  const tick = useCallback(() => {
    if (startRef.current !== null) {
      const diff = Math.floor((Date.now() - startRef.current) / 1000);
      setElapsed(diff);
      if (options.targetSec && diff >= options.targetSec) {
        stop();
        options.onFinish?.();
      }
    }
  }, [options.targetSec, options.onFinish, stop]);

  const start = useCallback(() => {
    if (isRunning) return;
    startRef.current = Date.now() - elapsed * 1000;
    intervalRef.current = setInterval(tick, 1000);
    setIsRunning(true);
  }, [elapsed, isRunning, tick]);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { elapsed, isRunning, start, stop, reset };
}

export default useTimer;

