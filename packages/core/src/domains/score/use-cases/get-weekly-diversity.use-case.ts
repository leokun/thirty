import type { WeeklyDiversityResult } from '@thirty/shared';
import type { DiversityRepository } from '../../diversity/repositories/diversity.repository.js';
import { computeWeeklyDiversity } from '../../diversity/use-cases/compute-weekly-diversity.use-case.js';
import type { FoodLogRepository } from '../../journal/repositories/food-log.repository.js';

export class GetWeeklyDiversityUseCase {
  constructor(
    private readonly foodLogRepo: FoodLogRepository,
    private readonly diversityRepo: DiversityRepository,
  ) {}

  async execute(userId: string, date: string): Promise<WeeklyDiversityResult> {
    const [rollingWindow, previousPlantCount] = await Promise.all([
      this.foodLogRepo.getRollingWindowData(userId, date),
      this.diversityRepo.getPreviousPlantCount(userId, date),
    ]);

    return computeWeeklyDiversity({ days: rollingWindow }, previousPlantCount);
  }
}
