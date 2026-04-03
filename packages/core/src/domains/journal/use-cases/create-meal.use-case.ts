import type { CreateMealInput } from '@thirty/shared';
import type { MealRepository } from '../repositories/meal.repository.js';

export class CreateMealUseCase {
  constructor(private readonly mealRepo: MealRepository) {}

  async execute(userId: string, input: CreateMealInput): Promise<string> {
    return this.mealRepo.create(userId, input);
  }
}
