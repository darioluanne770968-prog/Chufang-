import { useRef, useState, useCallback, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { triggerHaptic } from '../../utils/platform';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className = '',
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);
  const isAtTopRef = useRef(true);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      isAtTopRef.current = true;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!startYRef.current || !isAtTopRef.current || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      if (diff > 0) {
        // Apply resistance
        const resistance = 0.4;
        const distance = Math.min(diff * resistance, 150);
        setPullDistance(distance);

        if (distance >= threshold) {
          triggerHaptic(10);
        }
      }
    },
    [isRefreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50); // Keep a small pull distance during refresh
      triggerHaptic(20);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
    startYRef.current = null;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const indicatorOpacity = Math.min(pullDistance / threshold, 1);
  const indicatorRotation = isRefreshing ? 'animate-spin' : '';
  const indicatorScale = Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-y-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 transition-all duration-200"
        style={{
          top: pullDistance - 40,
          opacity: indicatorOpacity,
          transform: `translateX(-50%) scale(${indicatorScale})`,
        }}
      >
        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center">
          <RefreshCw
            className={`w-5 h-5 text-orange-500 ${indicatorRotation}`}
          />
        </div>
      </div>

      {/* Content with pull offset */}
      <div
        className="transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 && !isRefreshing ? 'transform 0.2s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default PullToRefresh;
