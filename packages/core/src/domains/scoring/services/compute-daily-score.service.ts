// =============================================================================
// Daily score — score microbiote quotidien composite (0-100)
// =============================================================================
// 6 axes pondérés, ADR-002 (règles métier explicites)
// =============================================================================

import { SCORING_WEIGHTS, type Trend } from '@thirty/shared';
import type { DailyScoreBreakdown } from '../../journal/value-objects/daily-score-breakdown.vo.js';

export interface DailyScoreInput {
  readonly diversityScore: number;
  readonly fiberPrebioticScore: number;
  readonly fermentedScore: number;
  readonly polyphenolScore: number;
  readonly mucosalSupportScore: number;
  readonly preparationScore: number;
  readonly rollingPlantCount: number;
  readonly rollingTotalFoodCount: number;
  readonly previousScore?: number;
}

export function computeDailyScore(input: DailyScoreInput): DailyScoreBreakdown {
  const totalScore = Math.round(
    input.diversityScore * SCORING_WEIGHTS.diversity +
    input.fiberPrebioticScore * SCORING_WEIGHTS.fiberPrebiotic +
    input.fermentedScore * SCORING_WEIGHTS.fermented +
    input.polyphenolScore * SCORING_WEIGHTS.polyphenol +
    input.mucosalSupportScore * SCORING_WEIGHTS.mucosalSupport +
    input.preparationScore * SCORING_WEIGHTS.preparation,
  );

  const trend = computeTrend(totalScore, input.previousScore);

  return {
    totalScore,
    diversityScore: input.diversityScore,
    fiberPrebioticScore: input.fiberPrebioticScore,
    fermentedScore: input.fermentedScore,
    polyphenolScore: input.polyphenolScore,
    mucosalSupportScore: input.mucosalSupportScore,
    preparationScore: input.preparationScore,
    rollingPlantCount: input.rollingPlantCount,
    rollingTotalFoodCount: input.rollingTotalFoodCount,
    trend,
  };
}

function computeTrend(current: number, previous?: number): Trend {
  if (previous === undefined) return 'STABLE';
  const delta = current - previous;
  if (delta > 3) return 'IMPROVING';
  if (delta < -3) return 'DECLINING';
  return 'STABLE';
}
