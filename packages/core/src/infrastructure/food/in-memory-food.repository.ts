import type { FoodResponse, RecentFoodResponse } from '@thirty/shared';
import type { FoodRepository } from '../../domains/food/repositories/food.repository.js';

export class InMemoryFoodRepository implements FoodRepository {
  private foods = new Map<string, FoodResponse>();
  private recentFoods = new Map<string, RecentFoodResponse[]>();

  async search(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<FoodResponse[]> {
    const lowerQuery = query.toLowerCase();
    const results: FoodResponse[] = [];

    for (const food of this.foods.values()) {
      if (options?.category && food.category !== options.category) continue;

      const matchesFr = food.nameFr.toLowerCase().includes(lowerQuery);
      const matchesEn = food.nameEn?.toLowerCase().includes(lowerQuery);

      if (matchesFr || matchesEn) {
        results.push(food);
      }
    }

    const limit = options?.limit ?? 20;
    return results.slice(0, limit);
  }

  async getById(id: string): Promise<FoodResponse | null> {
    return this.foods.get(id) ?? null;
  }

  async getRecent(userId: string, limit: number): Promise<RecentFoodResponse[]> {
    const recent = this.recentFoods.get(userId) ?? [];
    return recent.slice(0, limit);
  }

  seedFood(food: FoodResponse): void {
    this.foods.set(food.id, food);
  }

  seedFoods(foods: FoodResponse[]): void {
    for (const food of foods) {
      this.foods.set(food.id, food);
    }
  }

  seedRecentFoods(userId: string, recent: RecentFoodResponse[]): void {
    this.recentFoods.set(userId, recent);
  }

  clear(): void {
    this.foods.clear();
    this.recentFoods.clear();
  }
}
