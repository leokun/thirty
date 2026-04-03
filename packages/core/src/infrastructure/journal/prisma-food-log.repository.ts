import { prisma } from '@thirty/db';
import type { AddFoodLogInput, DayData, FoodLogEntry, MealData } from '@thirty/shared';
import type { FoodLogRepository } from '../../domains/journal/repositories/food-log.repository.js';
import { PREPARATION_DEFAULTS } from '../../domains/scoring/constants/preparation-defaults.js';
import { applyPreparationModifier } from '../../domains/scoring/services/apply-preparation-modifier.service.js';

export class PrismaFoodLogRepository implements FoodLogRepository {
  async getDayData(userId: string, date: string): Promise<DayData> {
    const meals = await prisma.mealEntry.findMany({
      where: {
        userProfile: { userId },
        date: new Date(date),
      },
      include: {
        foodLogs: {
          include: {
            food: {
              include: { preparationModifiers: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      date,
      meals: meals.map((meal) => this.mapMeal(meal)),
    };
  }

  async getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]> {
    const endDate = new Date(referenceDate);
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - 6);

    const meals = await prisma.mealEntry.findMany({
      where: {
        userProfile: { userId },
        date: { gte: startDate, lte: endDate },
      },
      include: {
        foodLogs: {
          include: {
            food: {
              include: { preparationModifiers: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    // Group meals by date
    const byDate = new Map<string, typeof meals>();
    for (const meal of meals) {
      const d = meal.date.toISOString().slice(0, 10);
      const existing = byDate.get(d) ?? [];
      existing.push(meal);
      byDate.set(d, existing);
    }

    return [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([d, dayMeals]) => ({
        date: d,
        meals: dayMeals.map((meal) => this.mapMeal(meal)),
      }));
  }

  async addFoodLog(mealId: string, input: AddFoodLogInput): Promise<string> {
    // Fetch food with its preparation modifier for the chosen method
    const food = await prisma.food.findUniqueOrThrow({
      where: { id: input.foodId },
      include: {
        preparationModifiers: {
          where: { method: input.preparationMethod },
        },
      },
    });

    // Compute score
    const baseProfile = {
      solubleFiberScore: food.solubleFiberScore,
      insolubleFiberScore: food.insolubleFiberScore,
      prebioticScore: food.prebioticScore,
      polyphenolScore: food.polyphenolScore,
      isFermented: food.isFermented,
      probioticsScore: food.probioticsScore,
      omega3Score: food.omega3Score,
      mucosalSupportScore: food.mucosalSupportScore,
    };

    const modifier = food.preparationModifiers[0]
      ? {
          method: input.preparationMethod,
          fiberFactor: food.preparationModifiers[0].fiberFactor,
          prebioticFactor: food.preparationModifiers[0].prebioticFactor,
          polyphenolFactor: food.preparationModifiers[0].polyphenolFactor,
          probioticsFactor: food.preparationModifiers[0].probioticsFactor,
          microbiomeBonus: food.preparationModifiers[0].microbiomeBonus,
          ...(food.preparationModifiers[0].overrideProfile != null && {
            overrideProfile: food.preparationModifiers[0].overrideProfile as Record<
              string,
              number | boolean
            >,
          }),
        }
      : {
          method: input.preparationMethod,
          ...PREPARATION_DEFAULTS[input.preparationMethod],
        };

    const computedScore = applyPreparationModifier(baseProfile, modifier);

    const log = await prisma.foodLog.create({
      data: {
        mealEntryId: mealId,
        foodId: input.foodId,
        preparationMethod: input.preparationMethod,
        ...(input.portionSize !== undefined && {
          portionSize: input.portionSize,
        }),
        computedScore: computedScore as unknown as Record<string, unknown>,
      },
    });

    return log.id;
  }

  async removeFoodLog(logId: string): Promise<void> {
    await prisma.foodLog.delete({ where: { id: logId } });
  }

  private mapMeal(meal: any): MealData {
    return {
      id: meal.id,
      moment: meal.moment,
      date: meal.date.toISOString().slice(0, 10),
      foodLogs: meal.foodLogs.map((log: any) => this.mapFoodLog(log)),
    };
  }

  private mapFoodLog(log: any): FoodLogEntry {
    const food = log.food;
    const customMod = food.preparationModifiers?.find(
      (m: any) => m.method === log.preparationMethod,
    );

    return {
      id: log.id,
      foodId: food.id,
      foodName: food.nameFr,
      category: food.category,
      isPlant: food.isPlant,
      preparationMethod: log.preparationMethod,
      portionSize: log.portionSize,
      baseProfile: {
        solubleFiberScore: food.solubleFiberScore,
        insolubleFiberScore: food.insolubleFiberScore,
        prebioticScore: food.prebioticScore,
        polyphenolScore: food.polyphenolScore,
        isFermented: food.isFermented,
        probioticsScore: food.probioticsScore,
        omega3Score: food.omega3Score,
        mucosalSupportScore: food.mucosalSupportScore,
      },
      ...(customMod && {
        customModifier: {
          fiberFactor: customMod.fiberFactor,
          prebioticFactor: customMod.prebioticFactor,
          polyphenolFactor: customMod.polyphenolFactor,
          probioticsFactor: customMod.probioticsFactor,
          microbiomeBonus: customMod.microbiomeBonus,
          ...(customMod.overrideProfile != null && {
            overrideProfile: customMod.overrideProfile as Record<string, number | boolean>,
          }),
        },
      }),
    };
  }
}
