// =============================================================================
// Evaluate condition - evaluates a suggestion condition against context
// =============================================================================

import type { SuggestionCondition, SuggestionContext, SuggestionMetric } from '@thirty/shared';

export function evaluateCondition(
  condition: SuggestionCondition,
  context: SuggestionContext,
): boolean {
  const value = resolveMetric(condition.metric, context);

  switch (condition.operator) {
    case '>=':
      return value >= condition.value;
    case '<=':
      return value <= condition.value;
    case '>':
      return value > condition.value;
    case '<':
      return value < condition.value;
    case '==':
      return value === condition.value;
  }
}

export function resolveMetric(metric: SuggestionMetric, context: SuggestionContext): number {
  switch (metric) {
    case 'rolling_plant_count':
      return context.diversity.rollingPlantCount;
    case 'fermented_days_without':
      return context.fermentedDaysWithout;
    case 'fried_count_7d':
      return context.friedCount7d;
    case 'polyphenol_score':
      return context.breakdown.polyphenolScore;
    case 'mucosal_score':
      return context.breakdown.mucosalSupportScore;
    case 'diversity_score':
      return context.breakdown.diversityScore;
  }
}
