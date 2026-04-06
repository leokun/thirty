// =============================================================================
// Use case: score a food log entry
// =============================================================================

import type { FoodLogEntry, PreparationModifier, ScoredFoodLog } from '@thirty/shared';
import { PREPARATION_DEFAULTS } from '../../scoring/constants/preparation-defaults.js';
import { applyPreparationModifier } from '../../scoring/services/apply-preparation-modifier.service.js';
import { applyPortionToAxisScores } from '../../scoring/services/portion-multiplier.service.js';

/**
 * Scores a food log entry by resolving the appropriate modifier:
 * 1. customModifier of the food (specific DB override)
 * 2. PREPARATION_DEFAULTS (fallback per preparation method)
 */
export function scoreFoodLog(entry: FoodLogEntry): ScoredFoodLog {
  const modifier: PreparationModifier = entry.customModifier
    ? { method: entry.preparationMethod, ...entry.customModifier }
    : { method: entry.preparationMethod, ...PREPARATION_DEFAULTS[entry.preparationMethod] };

  const rawScore = applyPreparationModifier(entry.baseProfile, modifier);
  const score = applyPortionToAxisScores(rawScore, entry.portionSize);

  return {
    foodLogId: entry.id,
    foodId: entry.foodId,
    foodName: entry.foodName,
    category: entry.category,
    isPlant: entry.isPlant,
    preparationMethod: entry.preparationMethod,
    score,
  };
}

export function scoreDayEntries(entries: readonly FoodLogEntry[]): readonly ScoredFoodLog[] {
  return entries.map(scoreFoodLog);
}
