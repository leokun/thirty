import type { FoodResponse } from '@thirty/shared';
import type { FoodRepository } from '../repositories/food.repository.js';

export class SearchFoodsUseCase {
  constructor(private readonly foodRepo: FoodRepository) {}

  async execute(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<FoodResponse[]> {
    return this.foodRepo.search(query, options);
  }
}
