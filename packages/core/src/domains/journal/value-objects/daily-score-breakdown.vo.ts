import type { Trend } from '@thirty/shared';

export interface DailyScoreBreakdown {
  readonly totalScore: number;
  readonly diversityScore: number;
  readonly fiberPrebioticScore: number;
  readonly fermentedScore: number;
  readonly polyphenolScore: number;
  readonly mucosalSupportScore: number;
  readonly preparationScore: number;
  readonly rollingPlantCount: number;
  readonly rollingTotalFoodCount: number;
  readonly trend: Trend;
}
