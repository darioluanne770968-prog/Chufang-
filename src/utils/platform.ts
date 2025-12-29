// Platform detection utilities for iOS, macOS, Android, and Web

export type Platform = 'ios' | 'macos' | 'android' | 'web';

export const getPlatform = (): Platform => {
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';

  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }
  if (/macintosh|macintel|macppc|mac68k/.test(platform) || /mac os x/.test(ua)) {
    return 'macos';
  }
  if (/android/.test(ua)) {
    return 'android';
  }
  return 'web';
};

export const isApplePlatform = (): boolean => {
  const platform = getPlatform();
  return platform === 'ios' || platform === 'macos';
};

export const isMobile = (): boolean => {
  const platform = getPlatform();
  return platform === 'ios' || platform === 'android';
};

export const isDesktop = (): boolean => {
  const platform = getPlatform();
  return platform === 'macos' || platform === 'web';
};

export const supportsHaptics = (): boolean => {
  return 'vibrate' in navigator;
};

export const triggerHaptic = (pattern: number | number[] = 10): void => {
  if (supportsHaptics()) {
    navigator.vibrate(pattern);
  }
};

export const supportsTouchEvents = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const isStandalone = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
};

// Safe area insets for notched devices
export const getSafeAreaInsets = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('--sat') || '0', 10),
    right: parseInt(computedStyle.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0', 10),
    left: parseInt(computedStyle.getPropertyValue('--sal') || '0', 10),
  };
};

// Platform-specific styling classes
export const getPlatformClasses = (): string => {
  const platform = getPlatform();
  const classes: string[] = [`platform-${platform}`];

  if (isMobile()) classes.push('is-mobile');
  if (isDesktop()) classes.push('is-desktop');
  if (isApplePlatform()) classes.push('is-apple');
  if (isStandalone()) classes.push('is-standalone');

  return classes.join(' ');
};
