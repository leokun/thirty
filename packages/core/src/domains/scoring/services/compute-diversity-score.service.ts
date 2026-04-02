// =============================================================================
// Diversity score - 30 plants / rolling week counter
// =============================================================================

import { WEEKLY_PLANT_GOAL } from '@thirty/shared';

/**
 * Computes the plant diversity score (0-100)
 * based on the number of unique plants over a 7-day rolling window.
 */
export function computeDiversityScore(plantCount: number): number {
  if (plantCount >= WEEKLY_PLANT_GOAL) return 100;
  if (plantCount >= 20) return 60 + (plantCount - 20) * 4;
  if (plantCount >= 10) return 20 + (plantCount - 10) * 4;
  return plantCount * 2;
}
