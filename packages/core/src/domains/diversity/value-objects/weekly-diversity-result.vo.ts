import type { Trend } from '@thirty/shared';

export interface WeeklyDiversityResult {
  readonly rollingPlantCount: number;
  readonly rollingTotalFoodCount: number;
  readonly uniquePlantIds: readonly string[];
  readonly uniquePlantNames: readonly string[];
  readonly trend: Trend;
}
