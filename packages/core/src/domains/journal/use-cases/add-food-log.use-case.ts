import type { AddFoodLogInput } from '@thirty/shared';
import type { DailyScoreRepository } from '../repositories/daily-score.repository.js';
import type { FoodLogRepository } from '../repositories/food-log.repository.js';
import { scoreDay } from './score-day.use-case.js';

export class AddFoodLogUseCase {
  constructor(
    private readonly foodLogRepo: FoodLogRepository,
    private readonly dailyScoreRepo: DailyScoreRepository,
  ) {}

  async execute(
    userId: string,
    mealId: string,
    date: string,
    input: AddFoodLogInput,
  ): Promise<string> {
    const logId = await this.foodLogRepo.addFoodLog(mealId, input);

    // Recompute daily score
    const [today, rollingWindow, previousScore] = await Promise.all([
      this.foodLogRepo.getDayData(userId, date),
      this.foodLogRepo.getRollingWindowData(userId, date),
      this.dailyScoreRepo.getPreviousScore(userId, date),
    ]);

    const breakdown = scoreDay({
      today,
      rollingWindow: { days: rollingWindow },
      ...(previousScore !== null && { previousDayScore: previousScore }),
    });
    await this.dailyScoreRepo.save(userId, date, breakdown);

    return logId;
  }
}
