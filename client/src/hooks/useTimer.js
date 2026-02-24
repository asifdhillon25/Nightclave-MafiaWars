// src/hooks/useTimer.js
import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimer = (initialSeconds, onTimeout) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback((newSeconds = initialSeconds) => {
    setIsActive(false);
    setSeconds(newSeconds);
  }, [initialSeconds]);

  const stop = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
  }, []);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      if (onTimeout) onTimeout();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, seconds, onTimeout]);

  return {
    seconds,
    isActive,
    start,
    pause,
    reset,
    stop,
    formattedTime: `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  };
};