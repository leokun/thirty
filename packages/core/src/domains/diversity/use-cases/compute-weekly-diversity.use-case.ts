// =============================================================================
// Use case : calculer la diversité hebdomadaire
// =============================================================================

import type { RollingWindowData } from '../value-objects/rolling-window.vo.js';
import type { WeeklyDiversityResult } from '../value-objects/weekly-diversity-result.vo.js';
import { countDistinct, uniqueFoodIds, flattenFoodLogs } from '../services/rolling-window.service.js';
import { computeTrend } from '../../shared/services/compute-trend.service.js';

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
    trend: computeTrend(rollingPlantCount, previousPlantCount, 3),
  };
}

