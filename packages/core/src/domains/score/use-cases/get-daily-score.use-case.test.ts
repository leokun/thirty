import type { DailyScoreBreakdown, DayData, MicrobiomeProfile } from '@thirty/shared';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryDailyScoreRepository } from '../../../infrastructure/journal/in-memory-daily-score.repository.js';
import { InMemoryFoodLogRepository } from '../../../infrastructure/journal/in-memory-food-log.repository.js';
import { GetDailyScoreUseCase } from './get-daily-score.use-case.js';

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

const cachedScore: DailyScoreBreakdown = {
  totalScore: 65,
  diversityScore: 60,
  fiberPrebioticScore: 70,
  fermentedScore: 50,
  polyphenolScore: 80,
  mucosalSupportScore: 55,
  preparationScore: 60,
  rollingPlantCount: 20,
  rollingTotalFoodCount: 35,
  trend: 'IMPROVING',
};

function makeDayWithFood(): DayData {
  return {
    date: DATE,
    meals: [
      {
        id: 'meal-1',
        moment: 'LUNCH',
        date: DATE,
        foodLogs: [
          {
            id: 'log-1',
            foodId: 'spinach',
            foodName: 'Spinach',
            category: 'VEGETABLE',
            isPlant: true,
            preparationMethod: 'RAW',
            portionSize: null,
            baseProfile,
          },
        ],
      },
    ],
  };
}

describe('GetDailyScoreUseCase', () => {
  let foodLogRepo: InMemoryFoodLogRepository;
  let dailyScoreRepo: InMemoryDailyScoreRepository;
  let useCase: GetDailyScoreUseCase;

  beforeEach(() => {
    foodLogRepo = new InMemoryFoodLogRepository();
    dailyScoreRepo = new InMemoryDailyScoreRepository();
    useCase = new GetDailyScoreUseCase(foodLogRepo, dailyScoreRepo);
  });

  it('returns cached score when available', async () => {
    dailyScoreRepo.seed(USER_ID, DATE, cachedScore);

    const result = await useCase.execute(USER_ID, DATE);

    expect(result).toEqual(cachedScore);
  });

  it('computes from scratch when no cached score exists', async () => {
    foodLogRepo.seed(USER_ID, [makeDayWithFood()]);

    const result = await useCase.execute(USER_ID, DATE);

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    expect(result.trend).toBeDefined();
    expect(result.diversityScore).toBeGreaterThanOrEqual(0);
  });

  it('saves computed score to repo for future caching', async () => {
    foodLogRepo.seed(USER_ID, [makeDayWithFood()]);

    const result = await useCase.execute(USER_ID, DATE);

    const cached = await dailyScoreRepo.get(USER_ID, DATE);
    expect(cached).toEqual(result);
  });

  it('returns a valid breakdown for an empty day', async () => {
    // No food logs seeded - empty day
    const result = await useCase.execute(USER_ID, DATE);

    expect(result.totalScore).toBe(0);
    expect(result.diversityScore).toBe(0);
    expect(result.fiberPrebioticScore).toBe(0);
    expect(result.fermentedScore).toBe(0);
    expect(result.rollingPlantCount).toBe(0);
    expect(result.trend).toBe('STABLE');
  });
});
