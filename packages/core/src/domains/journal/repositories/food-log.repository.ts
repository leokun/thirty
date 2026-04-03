import type { AddFoodLogInput, DayData } from '@thirty/shared';

export interface FoodLogRepository {
  getDayData(userId: string, date: string): Promise<DayData>;
  getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]>;
  addFoodLog(mealId: string, input: AddFoodLogInput): Promise<string>;
  removeFoodLog(logId: string): Promise<void>;
}
