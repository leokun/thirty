import { computeWindowStart } from '../../domains/diversity/services/rolling-window.service.js';
import type { FoodLogRepository } from '../../domains/journal/repositories/food-log.repository.js';
import type { DayData } from '../../domains/journal/value-objects/day-data.vo.js';

export class InMemoryFoodLogRepository implements FoodLogRepository {
  private days = new Map<string, DayData>();

  async getDayData(userId: string, date: string): Promise<DayData> {
    const key = `${userId}:${date}`;
    return this.days.get(key) ?? { date, meals: [] };
  }

  async getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]> {
    const start = computeWindowStart(referenceDate);
    const result: DayData[] = [];

    for (const [key, day] of this.days) {
      if (!key.startsWith(`${userId}:`)) continue;
      if (day.date >= start && day.date <= referenceDate) {
        result.push(day);
      }
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  seed(userId: string, days: DayData[]): void {
    for (const day of days) {
      this.days.set(`${userId}:${day.date}`, day);
    }
  }

  clear(): void {
    this.days.clear();
  }
}
