import type { AddFoodLogInput, DayData } from '@thirty/shared';
import { computeWindowStart } from '../../domains/diversity/services/rolling-window.service.js';
import type { FoodLogRepository } from '../../domains/journal/repositories/food-log.repository.js';

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

  async addFoodLog(mealId: string, input: AddFoodLogInput): Promise<string> {
    const id = `log-${Date.now()}`;
    // Find the day containing this meal and add the food log
    for (const [key, day] of this.days) {
      for (const meal of day.meals) {
        if (meal.id === mealId) {
          const updatedMeal = {
            ...meal,
            foodLogs: [
              ...meal.foodLogs,
              {
                id,
                foodId: input.foodId,
                foodName: '',
                category: 'OTHER' as const,
                isPlant: false,
                preparationMethod: input.preparationMethod,
                portionSize: input.portionSize ?? null,
                baseProfile: {
                  solubleFiberScore: 0,
                  insolubleFiberScore: 0,
                  prebioticScore: 0,
                  polyphenolScore: 0,
                  isFermented: false,
                  probioticsScore: 0,
                  omega3Score: 0,
                  mucosalSupportScore: 0,
                },
              },
            ],
          };
          const updatedDay = {
            ...day,
            meals: day.meals.map((m) => (m.id === mealId ? updatedMeal : m)),
          };
          this.days.set(key, updatedDay);
          return id;
        }
      }
    }
    return id;
  }

  async removeFoodLog(logId: string): Promise<void> {
    for (const [key, day] of this.days) {
      for (const meal of day.meals) {
        const idx = meal.foodLogs.findIndex((l) => l.id === logId);
        if (idx !== -1) {
          const updatedMeal = {
            ...meal,
            foodLogs: meal.foodLogs.filter((l) => l.id !== logId),
          };
          const updatedDay = {
            ...day,
            meals: day.meals.map((m) => (m.id === meal.id ? updatedMeal : m)),
          };
          this.days.set(key, updatedDay);
          return;
        }
      }
    }
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
