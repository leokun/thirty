// =============================================================================
// @thirty/core - Domaine Scoring
// =============================================================================

// --- Constants ---
export { PREPARATION_DEFAULTS } from './constants/preparation-defaults.js';
export {
  aggregateFermentedScore,
  aggregateFiberPrebioticScore,
  aggregateMucosalSupportScore,
  aggregatePolyphenolScore,
  aggregatePreparationScore,
} from './services/aggregate-axes.service.js';
export { applyPreparationModifier } from './services/apply-preparation-modifier.service.js';
export type { DailyScoreInput } from './services/compute-daily-score.service.js';
// --- Services ---
export { computeDailyScore } from './services/compute-daily-score.service.js';
export { computeDiversityScore } from './services/compute-diversity-score.service.js';
