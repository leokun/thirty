import type { DayData } from '../value-objects/day-data.vo.js';

export interface FoodLogRepository {
  getDayData(userId: string, date: string): Promise<DayData>;
  getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]>;
}
