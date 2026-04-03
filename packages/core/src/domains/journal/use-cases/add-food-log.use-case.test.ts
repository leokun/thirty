import type { DayData, MicrobiomeProfile } from '@thirty/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryDailyScoreRepository } from '../../../infrastructure/journal/in-memory-daily-score.repository.js';
import { InMemoryFoodLogRepository } from '../../../infrastructure/journal/in-memory-food-log.repository.js';
import { AddFoodLogUseCase } from './add-food-log.use-case.js';

const USER_ID = 'user-1';
const DATE = '2026-04-02';
const MEAL_ID = 'meal-1';

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

function makeDayWithMeal(): DayData {
  return {
    date: DATE,
    meals: [
      {
        id: MEAL_ID,
        moment: 'LUNCH',
        date: DATE,
        foodLogs: [
          {
            id: 'existing-log-1',
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

describe('AddFoodLogUseCase', () => {
  let foodLogRepo: InMemoryFoodLogRepository;
  let dailyScoreRepo: InMemoryDailyScoreRepository;
  let useCase: AddFoodLogUseCase;

  beforeEach(() => {
    foodLogRepo = new InMemoryFoodLogRepository();
    dailyScoreRepo = new InMemoryDailyScoreRepository();
    useCase = new AddFoodLogUseCase(foodLogRepo, dailyScoreRepo);
  });

  it('creates a food log and returns its id', async () => {
    foodLogRepo.seed(USER_ID, [makeDayWithMeal()]);

    const logId = await useCase.execute(USER_ID, MEAL_ID, DATE, {
      foodId: 'carrot',
      preparationMethod: 'RAW',
    });

    expect(logId).toBeDefined();
    expect(typeof logId).toBe('string');
  });

  it('recomputes and saves the daily score', async () => {
    foodLogRepo.seed(USER_ID, [makeDayWithMeal()]);

    await useCase.execute(USER_ID, MEAL_ID, DATE, {
      foodId: 'carrot',
      preparationMethod: 'RAW',
    });

    const savedScore = await dailyScoreRepo.get(USER_ID, DATE);
    expect(savedScore).not.toBeNull();
    expect(savedScore?.totalScore).toBeGreaterThanOrEqual(0);
    expect(savedScore?.totalScore).toBeLessThanOrEqual(100);
    expect(savedScore?.trend).toBeDefined();
  });

  it('uses previous score for trend computation', async () => {
    foodLogRepo.seed(USER_ID, [makeDayWithMeal()]);
    dailyScoreRepo.seed(USER_ID, '2026-04-01', {
      totalScore: 80,
      diversityScore: 80,
      fiberPrebioticScore: 80,
      fermentedScore: 80,
      polyphenolScore: 80,
      mucosalSupportScore: 80,
      preparationScore: 80,
      rollingPlantCount: 25,
      rollingTotalFoodCount: 40,
      trend: 'STABLE',
    });

    await useCase.execute(USER_ID, MEAL_ID, DATE, {
      foodId: 'carrot',
      preparationMethod: 'RAW',
    });

    const savedScore = await dailyScoreRepo.get(USER_ID, DATE);
    expect(savedScore).not.toBeNull();
    // Score from a single meal with basic profile will be much lower than 80
    // so trend should be DECLINING
    expect(savedScore?.trend).toBe('DECLINING');
  });
});
