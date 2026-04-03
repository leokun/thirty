import type { CreateMealInput, MealMoment } from '@thirty/shared';

export interface MealRepository {
  findByDateAndMoment(
    userId: string,
    date: string,
    moment: MealMoment,
  ): Promise<{ id: string } | null>;
  create(userId: string, input: CreateMealInput): Promise<string>;
  delete(mealId: string): Promise<void>;
  getMealsByDate(userId: string, date: string): Promise<{ id: string; moment: MealMoment }[]>;
}
