import { useRef, useEffect, useCallback } from 'react';
import { triggerHaptic } from '../utils/platform';

interface GestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  longPressDelay?: number;
}

export function useGestures<T extends HTMLElement>(options: GestureOptions) {
  const ref = useRef<T>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<number | null>(null);

  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDoubleTap,
    onLongPress,
    threshold = 50,
    longPressDelay = 500,
  } = options;

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Long press detection
      if (onLongPress) {
        longPressTimerRef.current = window.setTimeout(() => {
          triggerHaptic(50);
          onLongPress();
        }, longPressDelay);
      }
    },
    [onLongPress, longPressDelay]
  );

  const handleTouchMove = useCallback(() => {
    // Cancel long press if finger moves
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      // Cancel long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Double tap detection
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        const now = Date.now();
        if (now - lastTapRef.current < 300 && onDoubleTap) {
          triggerHaptic(10);
          onDoubleTap();
          lastTapRef.current = 0;
        } else {
          lastTapRef.current = now;
        }
      }

      // Swipe detection
      if (deltaTime < 500) {
        if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0 && onSwipeRight) {
            triggerHaptic(10);
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            triggerHaptic(10);
            onSwipeLeft();
          }
        } else if (Math.abs(deltaY) > threshold && Math.abs(deltaY) > Math.abs(deltaX)) {
          if (deltaY > 0 && onSwipeDown) {
            triggerHaptic(10);
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            triggerHaptic(10);
            onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, threshold]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return ref;
}

export default useGestures;
