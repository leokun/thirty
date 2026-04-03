import type { Trend } from '../enums.js';
import type { DayData } from './journal.js';

export interface RollingWindowData {
  readonly days: readonly DayData[];
}

export interface WeeklyDiversityResult {
  readonly rollingPlantCount: number;
  readonly rollingTotalFoodCount: number;
  readonly uniquePlantIds: readonly string[];
  readonly uniquePlantNames: readonly string[];
  readonly trend: Trend;
}
