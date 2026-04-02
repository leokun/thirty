// =============================================================================
// Use case : scorer une journée complète → DailyScoreBreakdown
// =============================================================================

import type { DayData } from '../value-objects/day-data.vo.js';
import type { DailyScoreBreakdown } from '../value-objects/daily-score-breakdown.vo.js';
import type { RollingWindowData } from '../../diversity/value-objects/rolling-window.vo.js';
import { scoreDayEntries } from './score-food-log.use-case.js';
import { computeDiversityScore } from '../../scoring/services/compute-diversity-score.service.js';
import { computeDailyScore } from '../../scoring/services/compute-daily-score.service.js';
import {
  aggregateFiberPrebioticScore,
  aggregateFermentedScore,
  aggregatePolyphenolScore,
  aggregateMucosalSupportScore,
  aggregatePreparationScore,
} from '../../scoring/services/aggregate-axes.service.js';
import { flattenFoodLogs } from '../../diversity/services/rolling-window.service.js';
import { countDistinct } from '../../diversity/services/rolling-window.service.js';

export interface ScoreDayInput {
  readonly today: DayData;
  readonly rollingWindow: RollingWindowData;
  readonly previousDayScore?: number;
}

/**
 * Orchestre le scoring complet d'une journée :
 * 1. Score chaque food log
 * 2. Agrège par axe (fiber, fermented, polyphenol, mucosal, preparation)
 * 3. Calcule la diversité rolling
 * 4. Délègue à computeDailyScore pour la pondération finale
 */
export function scoreDay(input: ScoreDayInput): DailyScoreBreakdown {
  // 1. Scorer les entrées du jour
  const todayEntries = input.today.meals.flatMap((m) => m.foodLogs);
  const scoredLogs = scoreDayEntries(todayEntries);

  // 2. Agréger par axe
  const fiberPrebioticScore = aggregateFiberPrebioticScore(scoredLogs);
  const fermentedScore = aggregateFermentedScore(scoredLogs);
  const polyphenolScore = aggregatePolyphenolScore(scoredLogs);
  const mucosalSupportScore = aggregateMucosalSupportScore(scoredLogs);
  const preparationScore = aggregatePreparationScore(scoredLogs);

  // 3. Diversité rolling
  const rollingPlantCount = countDistinct(input.rollingWindow, (e) => e.isPlant);
  const rollingTotalFoodCount = countDistinct(input.rollingWindow, () => true);
  const diversityScore = computeDiversityScore(rollingPlantCount);

  // 4. Score final pondéré
  return computeDailyScore({
    diversityScore,
    fiberPrebioticScore,
    fermentedScore,
    polyphenolScore,
    mucosalSupportScore,
    preparationScore,
    rollingPlantCount,
    rollingTotalFoodCount,
    previousScore: input.previousDayScore,
  });
}
