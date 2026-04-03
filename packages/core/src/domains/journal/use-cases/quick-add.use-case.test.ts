import type { DayData, MicrobiomeProfile } from '@thirty/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryDailyScoreRepository } from '../../../infrastructure/journal/in-memory-daily-score.repository.js';
import { InMemoryFoodLogRepository } from '../../../infrastructure/journal/in-memory-food-log.repository.js';
import { InMemoryMealRepository } from '../../../infrastructure/journal/in-memory-meal.repository.js';
import { QuickAddUseCase } from './quick-add.use-case.js';

const USER_ID = 'user-1';
const DATE = '2026-04-02';

const baseProfile: MicrobiomeProfile = {
  solubleFiberScore: 2,
  insolubleFiberScore: 1,
  prebioticScore: 3,
  polyphenolScore: 2,
  isFermented: false,
  probioticsScore: 0,
  omega3Score: 1,
  mucosalSupportScore: 1,
};

function makeDayWithMeal(mealId: string): DayData {
  return {
    date: DATE,
    meals: [
      {
        id: mealId,
        moment: 'LUNCH',
        date: DATE,
        foodLogs: [
          {
            id: 'existing-log',
            foodId: 'broccoli',
            foodName: 'Broccoli',
            category: 'VEGETABLE',
            isPlant: true,
            preparationMethod: 'STEAMED',
            portionSize: null,
            baseProfile,
          },
        ],
      },
    ],
  };
}

describe('QuickAddUseCase', () => {
  let mealRepo: InMemoryMealRepository;
  let foodLogRepo: InMemoryFoodLogRepository;
  let dailyScoreRepo: InMemoryDailyScoreRepository;
  let useCase: QuickAddUseCase;

  beforeEach(() => {
    mealRepo = new InMemoryMealRepository();
    foodLogRepo = new InMemoryFoodLogRepository();
    dailyScoreRepo = new InMemoryDailyScoreRepository();
    useCase = new QuickAddUseCase(mealRepo, foodLogRepo, dailyScoreRepo);
  });

  it('creates a new meal when none exists for date+moment', async () => {
    // Seed an empty day so foodLogRepo has the day data
    foodLogRepo.seed(USER_ID, [{ date: DATE, meals: [] }]);

    const logId = await useCase.execute(USER_ID, {
      date: DATE,
      moment: 'BREAKFAST',
      foodId: 'oats',
      preparationMethod: 'BOILED',
    });

    expect(logId).toBeDefined();

    // Verify meal was created
    const meals = await mealRepo.getMealsByDate(USER_ID, DATE);
    expect(meals).toHaveLength(1);
    expect(meals[0]?.moment).toBe('BREAKFAST');
  });

  it('reuses existing meal for same date+moment', async () => {
    // Pre-create a meal in the meal repo
    const existingMealId = await mealRepo.create(USER_ID, {
      date: DATE,
      moment: 'LUNCH',
    });

    // Seed foodLogRepo with a day that has this meal
    foodLogRepo.seed(USER_ID, [makeDayWithMeal(existingMealId)]);

    const logId = await useCase.execute(USER_ID, {
      date: DATE,
      moment: 'LUNCH',
      foodId: 'carrot',
      preparationMethod: 'RAW',
    });

    expect(logId).toBeDefined();

    // Verify no new meal was created (still 1)
    const meals = await mealRepo.getMealsByDate(USER_ID, DATE);
    expect(meals).toHaveLength(1);
    expect(meals[0]?.id).toBe(existingMealId);
  });

  it('recomputes and saves the daily score', async () => {
    foodLogRepo.seed(USER_ID, [{ date: DATE, meals: [] }]);

    await useCase.execute(USER_ID, {
      date: DATE,
      moment: 'DINNER',
      foodId: 'salmon',
      preparationMethod: 'ROASTED',
    });

    const savedScore = await dailyScoreRepo.get(USER_ID, DATE);
    expect(savedScore).not.toBeNull();
    expect(savedScore?.totalScore).toBeGreaterThanOrEqual(0);
    expect(savedScore?.totalScore).toBeLessThanOrEqual(100);
  });
});
