// =============================================================================
// Portion size → multiplier for axis scores (F1 PRD: refine fiber / polyphenol)
// =============================================================================

import type { ComputedFoodScore, PortionSize } from '@thirty/shared';

const MULTIPLIER: Record<PortionSize, number> = {
  SMALL: 0.65,
  MEDIUM: 1,
  LARGE: 1.35,
};

/**
 * Multiplier applied to fiber, prebiotic, and polyphenol contributions only.
 * `null` / undefined = neutral (same as medium).
 */
export function portionAxisMultiplier(portionSize: PortionSize | null | undefined): number {
  if (portionSize == null) return 1;
  return MULTIPLIER[portionSize];
}

export function applyPortionToAxisScores(
  score: ComputedFoodScore,
  portionSize: PortionSize | null | undefined,
): ComputedFoodScore {
  const m = portionAxisMultiplier(portionSize);
  if (m === 1) return score;
  return {
    ...score,
    fiber: score.fiber * m,
    prebiotic: score.prebiotic * m,
    polyphenol: score.polyphenol * m,
  };
}
