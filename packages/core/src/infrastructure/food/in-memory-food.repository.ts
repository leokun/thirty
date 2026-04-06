import type { CreateUserFoodInput, FoodResponse, RecentFoodResponse } from '@thirty/shared';
import { PreparationMethod } from '@thirty/shared';
import type { FoodRepository } from '../../domains/food/repositories/food.repository.js';
import {
  defaultMicrobiomeProfileForCategory,
  isPlantCategory,
} from '../../domains/food/services/default-user-food-profile.service.js';

export class InMemoryFoodRepository implements FoodRepository {
  private foods = new Map<string, FoodResponse>();
  private recentFoods = new Map<string, RecentFoodResponse[]>();
  private userFoodDedup = new Map<string, string>();
  private userFoodSeq = 0;

  async search(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<FoodResponse[]> {
    const lowerQuery = query.toLowerCase();
    const results: FoodResponse[] = [];

    for (const food of this.foods.values()) {
      if (options?.category && food.category !== options.category) continue;

      const matchesFr = food.nameFr.toLowerCase().includes(lowerQuery);
      const matchesEn = food.nameEn.toLowerCase().includes(lowerQuery);

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

  async createUserFood(userId: string, input: CreateUserFoodInput): Promise<string> {
    const nameFr = input.nameFr.trim();
    const dedupKey = `${userId}:${nameFr.toLowerCase()}`;
    const existingId = this.userFoodDedup.get(dedupKey);
    if (existingId) return existingId;

    const id = `uf-${++this.userFoodSeq}`;
    this.userFoodDedup.set(dedupKey, id);
    const baseProfile = defaultMicrobiomeProfileForCategory(input.category);
    this.foods.set(id, {
      id,
      nameFr,
      nameEn: nameFr,
      category: input.category,
      isPlant: isPlantCategory(input.category),
      availablePreparations: [...Object.values(PreparationMethod)],
      defaultPreparation: PreparationMethod.RAW,
      baseProfile,
      seasonMonths: [],
      tags: ['user-created'],
    });
    return id;
  }

  /** Test helper: read seeded food without async. */
  peek(id: string): FoodResponse | undefined {
    return this.foods.get(id);
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
    this.userFoodDedup.clear();
    this.userFoodSeq = 0;
  }
}
