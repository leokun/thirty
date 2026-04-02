// =============================================================================
// @thirty/core — Domaine Journal
// =============================================================================

// --- Entities ---
export type { FoodLogEntry } from './entities/food-log.entity.js';

// --- Value Objects ---
export type { MealData } from './value-objects/meal-data.vo.js';
export type { DayData } from './value-objects/day-data.vo.js';
export type { ScoredFoodLog } from './value-objects/scored-food-log.vo.js';
export type { DailyScoreBreakdown } from './value-objects/daily-score-breakdown.vo.js';

// --- Repositories ---
export type { FoodLogRepository } from './repositories/food-log.repository.js';

// --- Use Cases ---
export { scoreFoodLog, scoreDayEntries } from './use-cases/score-food-log.use-case.js';
export { scoreDay } from './use-cases/score-day.use-case.js';
export type { ScoreDayInput } from './use-cases/score-day.use-case.js';
