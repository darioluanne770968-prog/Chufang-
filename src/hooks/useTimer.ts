import { useEffect, useRef, useCallback } from 'react';
import { useTimer as useTimerContext } from '../context/AppContext';

export function useTimerEffect() {
  const { active, seconds, tick, stopTimer } = useTimerContext();
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element for alarm
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQw3n+rFpG0CJJn8ybF3APCb/8u7gwDnlP/CsoAA6JH7ure//gDikPGts/4A3Izcp7X+ANaI1qKy/gDLhM2dr/0AwIC');
  }, []);

  useEffect(() => {
    if (active && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [active, tick]);

  // Play sound when timer finishes
  useEffect(() => {
    if (active && seconds === 0) {
      audioRef.current?.play().catch(() => {});
      // Also try to vibrate on mobile
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    }
  }, [active, seconds]);

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    active,
    seconds,
    formattedTime: formatTime(seconds),
    stopTimer,
  };
}
