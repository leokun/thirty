import type { MealData } from './meal-data.vo.js';

export interface DayData {
  readonly date: string; // YYYY-MM-DD
  readonly meals: readonly MealData[];
}
