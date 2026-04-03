import type { CreateMealInput, MealMoment } from '@thirty/shared';
import type { MealRepository } from '../../domains/journal/repositories/meal.repository.js';

interface StoredMeal {
  id: string;
  userId: string;
  date: string;
  moment: MealMoment;
  note?: string;
}

export class InMemoryMealRepository implements MealRepository {
  private meals = new Map<string, StoredMeal>();
  private nextId = 1;

  async findByDateAndMoment(
    userId: string,
    date: string,
    moment: MealMoment,
  ): Promise<{ id: string } | null> {
    for (const meal of this.meals.values()) {
      if (meal.userId === userId && meal.date === date && meal.moment === moment) {
        return { id: meal.id };
      }
    }
    return null;
  }

  async create(userId: string, input: CreateMealInput): Promise<string> {
    const id = `meal-${this.nextId++}`;
    const meal: StoredMeal = {
      id,
      userId,
      date: input.date,
      moment: input.moment,
      ...(input.note !== undefined && { note: input.note }),
    };
    this.meals.set(id, meal);
    return id;
  }

  async delete(mealId: string): Promise<void> {
    this.meals.delete(mealId);
  }

  async getMealsByDate(
    userId: string,
    date: string,
  ): Promise<{ id: string; moment: MealMoment }[]> {
    const result: { id: string; moment: MealMoment }[] = [];
    for (const meal of this.meals.values()) {
      if (meal.userId === userId && meal.date === date) {
        result.push({ id: meal.id, moment: meal.moment });
      }
    }
    return result;
  }

  clear(): void {
    this.meals.clear();
    this.nextId = 1;
  }
}
