import type { RecentFoodResponse } from '@thirty/shared';
import type { FoodRepository } from '../repositories/food.repository.js';

export class GetRecentFoodsUseCase {
  constructor(private readonly foodRepo: FoodRepository) {}

  async execute(userId: string, limit = 10): Promise<RecentFoodResponse[]> {
    return this.foodRepo.getRecent(userId, limit);
  }
}
