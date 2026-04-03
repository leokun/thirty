// =============================================================================
// Use case: score a full day -> DailyScoreBreakdown
// =============================================================================

import type { DailyScoreBreakdown, DayData, RollingWindowData } from '@thirty/shared';
import { countDistinct } from '../../diversity/services/rolling-window.service.js';
import {
  aggregateFermentedScore,
  aggregateFiberPrebioticScore,
  aggregateMucosalSupportScore,
  aggregatePolyphenolScore,
  aggregatePreparationScore,
} from '../../scoring/services/aggregate-axes.service.js';
import { computeDailyScore } from '../../scoring/services/compute-daily-score.service.js';
import { computeDiversityScore } from '../../scoring/services/compute-diversity-score.service.js';
import { scoreDayEntries } from './score-food-log.use-case.js';

export interface ScoreDayInput {
  readonly today: DayData;
  readonly rollingWindow: RollingWindowData;
  readonly previousDayScore?: number;
}

/**
 * Orchestrates the full scoring of a day:
 * 1. Score each food log
 * 2. Aggregate per axis (fiber, fermented, polyphenol, mucosal, preparation)
 * 3. Compute rolling diversity
 * 4. Delegate to computeDailyScore for final weighted score
 */
export function scoreDay(input: ScoreDayInput): DailyScoreBreakdown {
  // 1. Score today's entries
  const todayEntries = input.today.meals.flatMap((m) => m.foodLogs);
  const scoredLogs = scoreDayEntries(todayEntries);

  // 2. Aggregate per axis
  const fiberPrebioticScore = aggregateFiberPrebioticScore(scoredLogs);
  const fermentedScore = aggregateFermentedScore(scoredLogs);
  const polyphenolScore = aggregatePolyphenolScore(scoredLogs);
  const mucosalSupportScore = aggregateMucosalSupportScore(scoredLogs);
  const preparationScore = aggregatePreparationScore(scoredLogs);

  // 3. Rolling diversity
  const rollingPlantCount = countDistinct(input.rollingWindow, (e) => e.isPlant);
  const rollingTotalFoodCount = countDistinct(input.rollingWindow, () => true);
  const diversityScore = computeDiversityScore(rollingPlantCount);

  // 4. Final weighted score
  return computeDailyScore({
    diversityScore,
    fiberPrebioticScore,
    fermentedScore,
    polyphenolScore,
    mucosalSupportScore,
    preparationScore,
    rollingPlantCount,
    rollingTotalFoodCount,
    ...(input.previousDayScore !== undefined && { previousScore: input.previousDayScore }),
  });
}
