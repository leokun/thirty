import type { DailyScoreBreakdown } from '@thirty/shared';

export interface DailyScoreRepository {
  save(userId: string, date: string, breakdown: DailyScoreBreakdown): Promise<void>;
  get(userId: string, date: string): Promise<DailyScoreBreakdown | null>;
  getPreviousScore(userId: string, beforeDate: string): Promise<number | null>;
}
