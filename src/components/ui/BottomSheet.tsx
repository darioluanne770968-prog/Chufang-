import { useEffect, useRef, useCallback, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { triggerHaptic } from '../../utils/platform';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPoints?: number[];
  defaultSnap?: number;
  showHandle?: boolean;
  showCloseButton?: boolean;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  defaultSnap = 0,
  showHandle = true,
  showCloseButton = true,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const [currentHeight, setCurrentHeight] = useState(snapPoints[defaultSnap] * 100);
  const [isDragging, setIsDragging] = useState(false);

  const snapToPoint = useCallback(
    (targetHeight: number) => {
      // Find nearest snap point
      let nearestSnap = snapPoints[0];
      let minDiff = Math.abs(targetHeight / 100 - snapPoints[0]);

      for (const snap of snapPoints) {
        const diff = Math.abs(targetHeight / 100 - snap);
        if (diff < minDiff) {
          minDiff = diff;
          nearestSnap = snap;
        }
      }

      // Close if below minimum
      if (nearestSnap < 0.2 || targetHeight < 15) {
        triggerHaptic(10);
        onClose();
        return;
      }

      setCurrentHeight(nearestSnap * 100);
      triggerHaptic(5);
    },
    [snapPoints, onClose]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      dragRef.current = {
        startY: touch.clientY,
        startHeight: currentHeight,
      };
      setIsDragging(true);
    },
    [currentHeight]
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragRef.current) return;

    const touch = e.touches[0];
    const deltaY = dragRef.current.startY - touch.clientY;
    const deltaPercent = (deltaY / window.innerHeight) * 100;
    const newHeight = Math.max(10, Math.min(95, dragRef.current.startHeight + deltaPercent));

    setCurrentHeight(newHeight);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragRef.current) {
      snapToPoint(currentHeight);
    }
    dragRef.current = null;
    setIsDragging(false);
  }, [currentHeight, snapToPoint]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white dark:bg-gray-900
          rounded-t-3xl shadow-2xl
          ${isDragging ? '' : 'transition-all duration-300 ease-out'}
        `}
        style={{ height: `${currentHeight}vh` }}
      >
        {/* Handle area */}
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {showHandle && (
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          )}
        </div>

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title || ''}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain" style={{ height: 'calc(100% - 60px)' }}>
          {children}
        </div>
      </div>
    </>
  );
}

export default BottomSheet;
