import type { MealMoment } from '@thirty/shared';
import type { FoodLogEntry } from '../entities/food-log.entity.js';

export interface MealData {
  readonly id: string;
  readonly moment: MealMoment;
  readonly date: string; // YYYY-MM-DD
  readonly foodLogs: readonly FoodLogEntry[];
}
