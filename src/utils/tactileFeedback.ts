/**
 * MANTA — Tactile Feedback Service & Pointer Utilities
 * T1 Touch Foundation
 *
 * Provides discrete, progressive enhancement haptic patterns via navigator.vibrate.
 * Fails silently and safely on non-supporting devices (e.g. iOS WebKit, desktop browsers).
 * Haptics are strictly reserved for discrete commit events (e.g. toggle favorite, add to cart,
 * confirmed edition switch), never called during scroll, pan, or continuous pointer moves.
 */

const canVibrate = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.vibrate === 'function'
  );
};

export const tactile = {
  /**
   * Light, discrete pulse (8ms) for discrete selections, tabs, or mode switches.
   */
  selection: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate(8);
      }
    } catch {
      // Silently ignore permission/environment restrictions
    }
  },

  /**
   * Soft impact (14ms) for state toggles (e.g. favorite toggle, filter apply/clear, drawer open/close).
   */
  softImpact: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate(14);
      }
    } catch {
      // Silently ignore
    }
  },

  /**
   * Success cadence (12ms vibration, 35ms pause, 18ms vibration) for confirmed operations like adding to cart.
   */
  success: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate([12, 35, 18]);
      }
    } catch {
      // Silently ignore
    }
  },

  soft: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate(8);
      }
    } catch {
      // Silently ignore
    }
  },

  medium: () => {
    try {
      if (canVibrate()) {
        navigator.vibrate(14);
      }
    } catch {
      // Silently ignore
    }
  }
};

/**
 * Checks if the current primary pointer is coarse (touch screen / finger).
 */
export const isCoarsePointer = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
};

/**
 * Checks if the current primary pointer is fine (mouse / trackpad).
 */
export const isFinePointer = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: fine)').matches;
};

/**
 * Checks if hover is supported natively without emulation.
 */
export const hasNativeHover = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
};
