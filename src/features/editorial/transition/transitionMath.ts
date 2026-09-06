/**
 * Helper mathematics and range mapping functions for Cover -> Story physical morph transition.
 */

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between a and b by factor t [0..1]
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Maps a progress value [0..1] within a specific sub-range [inMin..inMax] to an output range [outMin..outMax].
 */
export function mapRange(
  progress: number,
  inMin: number,
  inMax: number,
  outMin: number = 0,
  outMax: number = 1
): number {
  if (inMin === inMax) return outMin;
  const clampedProgress = clamp(progress, inMin, inMax);
  const normalized = (clampedProgress - inMin) / (inMax - inMin);
  return outMin + normalized * (outMax - outMin);
}

/**
 * Smooth ease-out cubic interpolation for spring-like completion/cancellation
 */
export function easeOutCubic(t: number): number {
  const p = 1 - t;
  return 1 - p * p * p * p * p;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export interface CoverDimensions {
  width: number;
  height: number;
  borderRadius: number;
  shadowOpacity: number;
}

/**
 * Calculates initial cover dimensions based on viewport size matching CSS [min(68vw,calc(55svh*5/7))]
 */
export function calculateCoverDimensions(windowWidth: number, windowHeight: number): CoverDimensions {
  // Mobile / Tablet / Desktop responsive magazine width
  const aspect = 5 / 7;
  let targetWidth = Math.min(windowWidth * 0.68, windowHeight * 0.55 * aspect);

  if (windowWidth >= 1024) {
    targetWidth = Math.min(330, windowHeight * 0.48 * aspect);
  } else if (windowWidth >= 768) {
    targetWidth = Math.min(windowWidth * 0.42, windowHeight * 0.50 * aspect);
  }

  // Ensure reasonable minimums
  const width = Math.max(220, Math.min(targetWidth, 380));
  const height = width / aspect;

  return {
    width,
    height,
    borderRadius: 4,
    shadowOpacity: 1
  };
}
