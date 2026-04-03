import type { FoodResponse, RecentFoodResponse } from '@thirty/shared';

export interface FoodRepository {
  search(query: string, options?: { category?: string; limit?: number }): Promise<FoodResponse[]>;
  getById(id: string): Promise<FoodResponse | null>;
  getRecent(userId: string, limit: number): Promise<RecentFoodResponse[]>;
}
