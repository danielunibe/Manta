/**
 * Mathematical models for mechanical page folding, hinge rotation, paper curvature, and shadows.
 */

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Spring damping / cubic easing for page flipping completion
 */
export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

export function easeOutCubic(t: number): number {
  const p = 1 - t;
  return 1 - p * p * p;
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

/**
 * Calculates hinge rotation angles, shadows, and curvature parameters for vertical page flip.
 * 
 * In a vertical Flipboard-style flip:
 * - When direction is 'next':
 *   - Phase 1 (progress 0.0 -> 0.5):
 *     - Top half of current page stays stable.
 *     - Bottom half of current page folds UPwards around the center hinge (0 deg -> -90 deg).
 *     - Reveals bottom half of next page underneath.
 *   - Phase 2 (progress 0.5 -> 1.0):
 *     - Top half of next page unfolds downwards from the hinge (+90 deg -> 0 deg).
 *     - Bottom half of next page is already resting flat underneath.
 * 
 * - When direction is 'previous':
 *   - Inverse mechanical motion from top to bottom.
 */
export interface FoldParameters {
  // Angle of folding half in radians
  currentHalfAngle: number;
  nextHalfAngle: number;
  // Intensity of shadows [0..1]
  foldShadowIntensity: number;
  underPageShadowIntensity: number;
  edgeHighlightIntensity: number;
  // Curvature amount for subtle paper feel
  paperCurvature: number;
  // Which half is active in phase
  activePhase: 'first-half' | 'second-half';
}

export function calculateFoldParameters(progress: number, direction: 'next' | 'previous'): FoldParameters {
  const p = clamp(progress, 0, 1);
  const activePhase: 'first-half' | 'second-half' = p < 0.5 ? 'first-half' : 'second-half';

  // Symmetrical shadow bell curve peaking near progress = 0.5
  const bell = Math.sin(p * Math.PI);
  const foldShadowIntensity = Math.pow(bell, 1.2) * 0.75;
  const underPageShadowIntensity = (1 - p) * 0.45;
  const edgeHighlightIntensity = bell * 0.85;
  const paperCurvature = bell * 0.18; // Virtual paper flex in meters / units

  let currentHalfAngle = 0;
  let nextHalfAngle = 0;

  if (direction === 'next') {
    if (p <= 0.5) {
      // First half: 0 to -90 deg (or -PI/2)
      const subT = p / 0.5;
      currentHalfAngle = -subT * (Math.PI / 2);
      nextHalfAngle = Math.PI / 2; // Next page top half waiting at 90 deg
    } else {
      // Second half: Next top half unfolds +90 deg -> 0 deg
      const subT = (p - 0.5) / 0.5;
      currentHalfAngle = -Math.PI / 2; // Current bottom half fully folded
      nextHalfAngle = (1 - subT) * (Math.PI / 2);
    }
  } else {
    // Previous direction (pulling down)
    if (p <= 0.5) {
      // Current top half folds DOWNwards: 0 to +90 deg
      const subT = p / 0.5;
      currentHalfAngle = subT * (Math.PI / 2);
      nextHalfAngle = -Math.PI / 2;
    } else {
      const subT = (p - 0.5) / 0.5;
      currentHalfAngle = Math.PI / 2;
      nextHalfAngle = -(1 - subT) * (Math.PI / 2);
    }
  }

  return {
    currentHalfAngle,
    nextHalfAngle,
    foldShadowIntensity,
    underPageShadowIntensity,
    edgeHighlightIntensity,
    paperCurvature,
    activePhase
  };
}
