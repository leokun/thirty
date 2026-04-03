import type { FoodResponse } from '@thirty/shared';
import type { FoodRepository } from '../repositories/food.repository.js';

export class GetFoodUseCase {
  constructor(private readonly foodRepo: FoodRepository) {}

  async execute(id: string): Promise<FoodResponse | null> {
    return this.foodRepo.getById(id);
  }
}
