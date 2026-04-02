// =============================================================================
// Rolling window — fenêtre glissante J-6 à J (ADR-004)
// =============================================================================

import { ROLLING_WINDOW_DAYS } from '@thirty/shared';
import type { FoodLogEntry } from '../../journal/entities/food-log.entity.js';
import type { RollingWindowData } from '../value-objects/rolling-window.vo.js';

/**
 * Calcule la date de début de la fenêtre glissante (J-6).
 * @param referenceDate - Date de référence au format YYYY-MM-DD
 * @returns Date de début au format YYYY-MM-DD
 */
export function computeWindowStart(referenceDate: string): string {
  const date = new Date(referenceDate);
  date.setDate(date.getDate() - (ROLLING_WINDOW_DAYS - 1));
  return date.toISOString().slice(0, 10);
}

/**
 * Filtre les jours pour ne garder que ceux dans la fenêtre J-6..J.
 */
export function filterToWindow(
  data: RollingWindowData,
  referenceDate: string,
): RollingWindowData {
  const start = computeWindowStart(referenceDate);
  return {
    days: data.days.filter((d) => d.date >= start && d.date <= referenceDate),
  };
}

/**
 * Extrait tous les FoodLogEntry d'une fenêtre, aplatis.
 */
export function flattenFoodLogs(data: RollingWindowData): readonly FoodLogEntry[] {
  return data.days.flatMap((d) => d.meals.flatMap((m) => m.foodLogs));
}

/**
 * Compte le nombre d'aliments distincts (par foodId) matchant un prédicat.
 */
export function countDistinct(
  data: RollingWindowData,
  predicate: (entry: FoodLogEntry) => boolean,
): number {
  const ids = new Set<string>();
  for (const day of data.days) {
    for (const meal of day.meals) {
      for (const entry of meal.foodLogs) {
        if (predicate(entry)) {
          ids.add(entry.foodId);
        }
      }
    }
  }
  return ids.size;
}

/**
 * Retourne les foodIds uniques matchant un prédicat.
 */
export function uniqueFoodIds(
  data: RollingWindowData,
  predicate: (entry: FoodLogEntry) => boolean,
): readonly string[] {
  const ids = new Set<string>();
  for (const day of data.days) {
    for (const meal of day.meals) {
      for (const entry of meal.foodLogs) {
        if (predicate(entry)) {
          ids.add(entry.foodId);
        }
      }
    }
  }
  return [...ids];
}
