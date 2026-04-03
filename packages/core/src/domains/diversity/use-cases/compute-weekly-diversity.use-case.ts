// =============================================================================
// Use case: compute weekly diversity
// =============================================================================

import type { RollingWindowData, WeeklyDiversityResult } from '@thirty/shared';
import { computeTrend } from '../../shared/services/compute-trend.service.js';
import {
  countDistinct,
  flattenFoodLogs,
  uniqueFoodIds,
} from '../services/rolling-window.service.js';

/**
 * Computes the diversity snapshot for a rolling window.
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
