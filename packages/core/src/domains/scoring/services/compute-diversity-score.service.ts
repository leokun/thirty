// =============================================================================
// Diversity score — compteur 30 plantes / semaine glissante
// =============================================================================

import { WEEKLY_PLANT_GOAL } from '@thirty/shared';

/**
 * Calcule le score de diversité végétale (0-100)
 * basé sur le nombre de plantes uniques sur 7 jours glissants.
 */
export function computeDiversityScore(plantCount: number): number {
  if (plantCount >= WEEKLY_PLANT_GOAL) return 100;
  if (plantCount >= 20) return 60 + (plantCount - 20) * 4;
  if (plantCount >= 10) return 20 + (plantCount - 10) * 4;
  return plantCount * 2;
}
