
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface IdleTimeoutProps {
  onIdle: () => void;
  idleTime?: number;
  warningTime?: number;
}

export function useIdleTimeout({
  onIdle,
  idleTime = 1800000, // Default 30 minutes
  warningTime = 120000, // Default 2 minutes
}: IdleTimeoutProps) {
  const [isIdle, setIsIdle] = useState(false);
  const [isWarningActive, setIsWarningActive] = useState(false);

  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

  const handleIdle = useCallback(() => {
    setIsIdle(true);
    setIsWarningActive(false);
    onIdle();
  }, [onIdle]);
  
  const showWarning = () => {
    setIsWarningActive(true);
  };

  const resetTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    setIsIdle(false);
    setIsWarningActive(false);

    warningTimer.current = setTimeout(showWarning, idleTime - warningTime);
    idleTimer.current = setTimeout(handleIdle, idleTime);
  }, [handleIdle, idleTime, warningTime]);

  const cleanup = useCallback(() => {
    events.forEach(event => {
      window.removeEventListener(event, resetTimers);
    });
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
  }, [events, resetTimers]);
  
  const start = useCallback(() => {
    events.forEach(event => {
      window.addEventListener(event, resetTimers);
    });
    resetTimers();
  }, [events, resetTimers]);

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Initial setup and cleanup
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isIdle,
    isWarningActive,
    reset: resetTimers, // Expose reset to allow user to keep session alive
    start,
    stop,
  };
}
