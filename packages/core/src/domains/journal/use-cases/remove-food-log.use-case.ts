import type { DailyScoreRepository } from '../repositories/daily-score.repository.js';
import type { FoodLogRepository } from '../repositories/food-log.repository.js';
import { scoreDay } from './score-day.use-case.js';

export class RemoveFoodLogUseCase {
  constructor(
    private readonly foodLogRepo: FoodLogRepository,
    private readonly dailyScoreRepo: DailyScoreRepository,
  ) {}

  async execute(userId: string, logId: string, date: string): Promise<void> {
    await this.foodLogRepo.removeFoodLog(logId);

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
  }
}
