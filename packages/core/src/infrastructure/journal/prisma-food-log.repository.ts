import { prisma } from '@thirty/db';
import type {
  AddFoodLogInput,
  DayData,
  FoodCategory,
  FoodLogEntry,
  MealData,
  MealMoment,
  PortionSize,
  PreparationMethod,
} from '@thirty/shared';
import type { FoodLogRepository } from '../../domains/journal/repositories/food-log.repository.js';
import { PREPARATION_DEFAULTS } from '../../domains/scoring/constants/preparation-defaults.js';
import { applyPreparationModifier } from '../../domains/scoring/services/apply-preparation-modifier.service.js';
import { applyPortionToAxisScores } from '../../domains/scoring/services/portion-multiplier.service.js';

/** Narrow shape returned by mealEntry.findMany with foodLogs → food → preparationModifiers */
type PreparationModifierRow = {
  method: PreparationMethod;
  fiberFactor: number;
  prebioticFactor: number;
  polyphenolFactor: number;
  probioticsFactor: number;
  microbiomeBonus: number;
  overrideProfile?: unknown;
};

type FoodForLogRow = {
  id: string;
  nameFr: string;
  category: FoodCategory;
  isPlant: boolean;
  solubleFiberScore: number;
  insolubleFiberScore: number;
  prebioticScore: number;
  polyphenolScore: number;
  isFermented: boolean;
  probioticsScore: number;
  omega3Score: number;
  mucosalSupportScore: number;
  preparationModifiers?: PreparationModifierRow[];
};

type FoodLogForMapRow = {
  id: string;
  preparationMethod: PreparationMethod;
  portionSize: PortionSize | null;
  food: FoodForLogRow;
};

type MealForMapRow = {
  id: string;
  moment: MealMoment;
  date: Date;
  foodLogs: FoodLogForMapRow[];
};

export class PrismaFoodLogRepository implements FoodLogRepository {
  async getDayData(userId: string, date: string): Promise<DayData> {
    const meals = (await prisma.mealEntry.findMany({
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
    })) as MealForMapRow[];

    return {
      date,
      meals: meals.map((meal) => this.mapMeal(meal)),
    };
  }

  async getRollingWindowData(userId: string, referenceDate: string): Promise<DayData[]> {
    const endDate = new Date(referenceDate);
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - 6);

    const meals = (await prisma.mealEntry.findMany({
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
    })) as MealForMapRow[];

    const byDate = new Map<string, MealForMapRow[]>();
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

    const computedScore = applyPortionToAxisScores(
      applyPreparationModifier(baseProfile, modifier),
      input.portionSize ?? null,
    );

    const log = await prisma.foodLog.create({
      data: {
        mealEntryId: mealId,
        foodId: input.foodId,
        preparationMethod: input.preparationMethod,
        portionSize: input.portionSize ?? null,
        computedScore: computedScore as unknown as Record<string, unknown>,
      },
    });

    return log.id;
  }

  async removeFoodLog(logId: string): Promise<void> {
    await prisma.foodLog.delete({ where: { id: logId } });
  }

  private mapMeal(meal: MealForMapRow): MealData {
    return {
      id: meal.id,
      moment: meal.moment,
      date: meal.date.toISOString().slice(0, 10),
      foodLogs: meal.foodLogs.map((log) => this.mapFoodLog(log)),
    };
  }

  private mapFoodLog(log: FoodLogForMapRow): FoodLogEntry {
    const food = log.food;
    const customMod = food.preparationModifiers?.find((m) => m.method === log.preparationMethod);

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
