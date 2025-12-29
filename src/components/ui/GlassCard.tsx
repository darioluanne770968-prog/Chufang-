import type { ReactNode } from 'react';
import { isApplePlatform } from '../../utils/platform';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  onClick?: () => void;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = '',
  intensity = 'medium',
  onClick,
  hover = false,
}: GlassCardProps) {
  const isApple = isApplePlatform();

  const intensityClasses = {
    light: isApple
      ? 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm'
      : 'bg-white/80 dark:bg-gray-800/80',
    medium: isApple
      ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md'
      : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
    heavy: isApple
      ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg'
      : 'bg-white dark:bg-gray-800 backdrop-blur-md',
  };

  const hoverClass = hover
    ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]'
    : '';

  return (
    <div
      className={`
        ${intensityClasses[intensity]}
        rounded-2xl
        border border-white/20 dark:border-gray-700/50
        shadow-lg shadow-black/5 dark:shadow-black/20
        ${hoverClass}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export default GlassCard;
