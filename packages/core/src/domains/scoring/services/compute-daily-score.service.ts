// =============================================================================
// Daily score - composite daily microbiome score (0-100)
// =============================================================================
// 6 weighted axes, ADR-002 (explicit business rules)
// =============================================================================

import { SCORING_WEIGHTS } from '@thirty/shared';
import type { DailyScoreBreakdown } from '../../journal/value-objects/daily-score-breakdown.vo.js';
import { computeTrend } from '../../shared/services/compute-trend.service.js';

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

  const trend = computeTrend(totalScore, input.previousScore, 3);

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
