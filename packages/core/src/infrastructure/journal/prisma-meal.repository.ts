import { prisma } from '@thirty/db';
import type { CreateMealInput, MealMoment } from '@thirty/shared';
import type { MealRepository } from '../../domains/journal/repositories/meal.repository.js';

export class PrismaMealRepository implements MealRepository {
  async findByDateAndMoment(
    userId: string,
    date: string,
    moment: MealMoment,
  ): Promise<{ id: string } | null> {
    const meal = await prisma.mealEntry.findFirst({
      where: {
        userProfile: { userId },
        date: new Date(date),
        moment,
      },
      select: { id: true },
    });
    return meal;
  }

  async create(userId: string, input: CreateMealInput): Promise<string> {
    // Resolve userProfileId from userId
    const profile = await prisma.userProfile.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    const meal = await prisma.mealEntry.create({
      data: {
        userProfileId: profile.id,
        date: new Date(input.date),
        moment: input.moment,
        ...(input.note !== undefined && { note: input.note }),
      },
    });
    return meal.id;
  }

  async delete(mealId: string): Promise<void> {
    await prisma.mealEntry.delete({ where: { id: mealId } });
  }

  async getMealsByDate(
    userId: string,
    date: string,
  ): Promise<{ id: string; moment: MealMoment }[]> {
    const meals = await prisma.mealEntry.findMany({
      where: {
        userProfile: { userId },
        date: new Date(date),
      },
      select: { id: true, moment: true },
      orderBy: { createdAt: 'asc' },
    });
    return meals;
  }
}
