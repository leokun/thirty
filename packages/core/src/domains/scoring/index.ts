// =============================================================================
// @thirty/core — Domaine Scoring
// =============================================================================

// --- Value Objects ---
export type { ComputedFoodScore } from './value-objects/computed-food-score.vo.js';
export type { MicrobiomeProfile } from './value-objects/microbiome-profile.vo.js';
export type { PreparationModifier } from './value-objects/preparation-modifier.vo.js';

// --- Services ---
export { computeDailyScore } from './services/compute-daily-score.service.js';
export type { DailyScoreInput } from './services/compute-daily-score.service.js';
export { computeDiversityScore } from './services/compute-diversity-score.service.js';
export { applyPreparationModifier } from './services/apply-preparation-modifier.service.js';
export {
  aggregateFiberPrebioticScore,
  aggregateFermentedScore,
  aggregatePolyphenolScore,
  aggregateMucosalSupportScore,
  aggregatePreparationScore,
} from './services/aggregate-axes.service.js';

// --- Constants ---
export { PREPARATION_DEFAULTS } from './constants/preparation-defaults.js';
