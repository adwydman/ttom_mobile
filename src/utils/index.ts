import { useRef, useEffect } from 'react';

export const GLOBALS = {
  backendUrl: 'http://52.14.13.77:3000',
  // backendUrl: 'http://10.0.0.74:3000',
}

export const buildUrl = (route: string): string => `${GLOBALS.backendUrl}${route}`;

export const useInterval = (callback, delay) => {
  const intervalRef = useRef(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);
  return intervalRef;
}
