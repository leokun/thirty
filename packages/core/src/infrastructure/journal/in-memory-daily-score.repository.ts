import type { DailyScoreBreakdown } from '@thirty/shared';
import type { DailyScoreRepository } from '../../domains/journal/repositories/daily-score.repository.js';

export class InMemoryDailyScoreRepository implements DailyScoreRepository {
  private scores = new Map<string, DailyScoreBreakdown>();

  async save(userId: string, date: string, breakdown: DailyScoreBreakdown): Promise<void> {
    this.scores.set(`${userId}:${date}`, breakdown);
  }

  async get(userId: string, date: string): Promise<DailyScoreBreakdown | null> {
    return this.scores.get(`${userId}:${date}`) ?? null;
  }

  async getPreviousScore(userId: string, beforeDate: string): Promise<number | null> {
    let latest: { date: string; score: number } | null = null;

    for (const [key, breakdown] of this.scores) {
      if (!key.startsWith(`${userId}:`)) continue;
      const date = key.slice(userId.length + 1);
      if (date < beforeDate) {
        if (!latest || date > latest.date) {
          latest = { date, score: breakdown.totalScore };
        }
      }
    }

    return latest?.score ?? null;
  }

  seed(userId: string, date: string, breakdown: DailyScoreBreakdown): void {
    this.scores.set(`${userId}:${date}`, breakdown);
  }

  clear(): void {
    this.scores.clear();
  }
}
