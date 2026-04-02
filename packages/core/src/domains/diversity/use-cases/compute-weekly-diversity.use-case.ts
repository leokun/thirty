// =============================================================================
// Use case : calculer la diversité hebdomadaire
// =============================================================================

import type { Trend } from '@thirty/shared';
import type { RollingWindowData } from '../value-objects/rolling-window.vo.js';
import type { WeeklyDiversityResult } from '../value-objects/weekly-diversity-result.vo.js';
import { countDistinct, uniqueFoodIds, flattenFoodLogs } from '../services/rolling-window.service.js';

/**
 * Calcule le snapshot de diversité pour une fenêtre glissante.
 */
export function computeWeeklyDiversity(
  currentWindow: RollingWindowData,
  previousPlantCount?: number,
): WeeklyDiversityResult {
  const plantIds = uniqueFoodIds(currentWindow, (e) => e.isPlant);
  const allLogs = flattenFoodLogs(currentWindow);
  const plantLogs = allLogs.filter((e) => e.isPlant);

  const uniquePlantNames = [...new Set(plantLogs.map((e) => e.foodName))];
  const rollingTotalFoodCount = countDistinct(currentWindow, () => true);
  const rollingPlantCount = plantIds.length;

  return {
    rollingPlantCount,
    rollingTotalFoodCount,
    uniquePlantIds: plantIds,
    uniquePlantNames,
    trend: computeDiversityTrend(rollingPlantCount, previousPlantCount),
  };
}

/**
 * Détermine la tendance : +3 = IMPROVING, -3 = DECLINING, sinon STABLE.
 */
export function computeDiversityTrend(
  currentCount: number,
  previousCount?: number,
): Trend {
  if (previousCount === undefined) return 'STABLE';
  const delta = currentCount - previousCount;
  if (delta >= 3) return 'IMPROVING';
  if (delta <= -3) return 'DECLINING';
  return 'STABLE';
}
