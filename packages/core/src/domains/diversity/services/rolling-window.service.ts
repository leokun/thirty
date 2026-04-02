// =============================================================================
// Rolling window - sliding window D-6 to D (ADR-004)
// =============================================================================

import { ROLLING_WINDOW_DAYS } from '@thirty/shared';
import type { FoodLogEntry } from '../../journal/entities/food-log.entity.js';
import type { RollingWindowData } from '../value-objects/rolling-window.vo.js';

/**
 * Computes the start date of the rolling window (D-6).
 * @param referenceDate - Reference date in YYYY-MM-DD format
 * @returns Start date in YYYY-MM-DD format
 */
export function computeWindowStart(referenceDate: string): string {
  const date = new Date(referenceDate);
  date.setDate(date.getDate() - (ROLLING_WINDOW_DAYS - 1));
  return date.toISOString().slice(0, 10);
}

/**
 * Filters days to keep only those within the D-6..D window.
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
 * Extracts all FoodLogEntry from a window, flattened.
 */
export function flattenFoodLogs(data: RollingWindowData): readonly FoodLogEntry[] {
  return data.days.flatMap((d) => d.meals.flatMap((m) => m.foodLogs));
}

/**
 * Counts the number of distinct foods (by foodId) matching a predicate.
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
 * Returns unique foodIds matching a predicate.
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
