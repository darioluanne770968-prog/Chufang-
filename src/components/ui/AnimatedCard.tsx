import { useState, type ReactNode } from 'react';
import { triggerHaptic, isMobile } from '../../utils/platform';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function AnimatedCard({
  children,
  className = '',
  onClick,
  delay = 0,
  type = 'fade',
  direction = 'up',
}: AnimatedCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (isMobile()) {
      setIsPressed(true);
      triggerHaptic(5);
    }
  };

  const handleRelease = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (onClick) {
      triggerHaptic(10);
      onClick();
    }
  };

  const getAnimationClass = () => {
    const directionMap = {
      up: 'translate-y-4',
      down: '-translate-y-4',
      left: 'translate-x-4',
      right: '-translate-x-4',
    };

    switch (type) {
      case 'slide':
        return `animate-in slide-in-from-${direction === 'up' ? 'bottom' : direction === 'down' ? 'top' : direction === 'left' ? 'right' : 'left'}`;
      case 'scale':
        return 'animate-in zoom-in-95';
      case 'bounce':
        return 'animate-bounce';
      default:
        return `animate-in fade-in ${directionMap[direction]}`;
    }
  };

  return (
    <div
      className={`
        ${getAnimationClass()}
        duration-300
        fill-mode-both
        ${isPressed ? 'scale-[0.98] opacity-90' : 'scale-100 opacity-100'}
        transition-transform
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleClick}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// Stagger animation wrapper
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 50,
  className = '',
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
              style={{ animationDelay: `${index * staggerDelay}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

export default AnimatedCard;
