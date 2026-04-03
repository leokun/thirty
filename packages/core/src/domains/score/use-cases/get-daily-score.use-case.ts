import type { DailyScoreBreakdown } from '@thirty/shared';
import type { DailyScoreRepository } from '../../journal/repositories/daily-score.repository.js';
import type { FoodLogRepository } from '../../journal/repositories/food-log.repository.js';
import { scoreDay } from '../../journal/use-cases/score-day.use-case.js';

export class GetDailyScoreUseCase {
  constructor(
    private readonly foodLogRepo: FoodLogRepository,
    private readonly dailyScoreRepo: DailyScoreRepository,
  ) {}

  async execute(userId: string, date: string): Promise<DailyScoreBreakdown> {
    // Check cached score first
    const cached = await this.dailyScoreRepo.get(userId, date);
    if (cached) return cached;

    // Compute from scratch
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

    return breakdown;
  }
}
