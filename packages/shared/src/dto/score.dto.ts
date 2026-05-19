import type { WeeklyDiversityResult } from '../types/diversity.js';
import type { DailyScoreBreakdown } from '../types/journal.js';

export type DailyScoreResponse = DailyScoreBreakdown;
export type WeeklyDiversityResponse = WeeklyDiversityResult;

export interface ScoreHistoryEntry {
  readonly date: string;
  readonly totalScore: number;
}

export type ScoreHistoryResponse = readonly ScoreHistoryEntry[];
