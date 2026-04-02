import type { WeeklyDiversityResult } from '../../diversity/value-objects/weekly-diversity-result.vo.js';
import type { DailyScoreBreakdown } from '../../journal/value-objects/daily-score-breakdown.vo.js';

export interface SuggestionContext {
  readonly breakdown: DailyScoreBreakdown;
  readonly diversity: WeeklyDiversityResult;
  readonly fermentedDaysWithout: number;
  readonly friedCount7d: number;
  readonly now: Date;
}
