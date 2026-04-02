// =============================================================================
// Use case : scorer une entrée du journal alimentaire
// =============================================================================

import type { FoodLogEntry } from '../entities/food-log.entity.js';
import type { ScoredFoodLog } from '../value-objects/scored-food-log.vo.js';
import type { PreparationModifier } from '../../scoring/value-objects/preparation-modifier.vo.js';
import { applyPreparationModifier } from '../../scoring/services/apply-preparation-modifier.service.js';
import { PREPARATION_DEFAULTS } from '../../scoring/constants/preparation-defaults.js';

/**
 * Score une entrée du journal en résolvant le modifier approprié :
 * 1. customModifier de l'aliment (override spécifique en DB)
 * 2. PREPARATION_DEFAULTS (fallback par méthode de préparation)
 */
export function scoreFoodLog(entry: FoodLogEntry): ScoredFoodLog {
  const modifier: PreparationModifier = entry.customModifier
    ? { method: entry.preparationMethod, ...entry.customModifier }
    : { method: entry.preparationMethod, ...PREPARATION_DEFAULTS[entry.preparationMethod] };

  const score = applyPreparationModifier(entry.baseProfile, modifier);

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
