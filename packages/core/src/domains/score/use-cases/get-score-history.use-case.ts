import type { ScoreHistoryEntry } from '@thirty/shared';
import type { DailyScoreRepository } from '../../journal/repositories/daily-score.repository.js';

export class GetScoreHistoryUseCase {
  constructor(private readonly dailyScoreRepo: DailyScoreRepository) {}

  async execute(userId: string, endDate: string, days = 7): Promise<ScoreHistoryEntry[]> {
    const end = new Date(endDate);
    const start = new Date(endDate);
    start.setDate(end.getDate() - (days - 1));
    const startDate = start.toISOString().slice(0, 10);

    const entries = await this.dailyScoreRepo.getRange(userId, startDate, endDate);
    return entries.map((e) => ({ date: e.date, totalScore: e.breakdown.totalScore }));
  }
}
