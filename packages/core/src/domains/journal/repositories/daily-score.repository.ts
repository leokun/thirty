import type { DailyScoreBreakdown } from '@thirty/shared';

export interface DatedDailyScore {
  readonly date: string;
  readonly breakdown: DailyScoreBreakdown;
}

export interface DailyScoreRepository {
  save(userId: string, date: string, breakdown: DailyScoreBreakdown): Promise<void>;
  get(userId: string, date: string): Promise<DailyScoreBreakdown | null>;
  getPreviousScore(userId: string, beforeDate: string): Promise<number | null>;
  getRange(userId: string, startDate: string, endDate: string): Promise<DatedDailyScore[]>;
}
