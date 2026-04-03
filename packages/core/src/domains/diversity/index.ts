// =============================================================================
// @thirty/core - Domaine Diversity
// =============================================================================

// --- Repositories ---
export type { DiversityRepository } from './repositories/diversity.repository.js';
// --- Services ---
export {
  computeWindowStart,
  countDistinct,
  filterToWindow,
  flattenFoodLogs,
  uniqueFoodIds,
} from './services/rolling-window.service.js';
// --- Use Cases ---
export { computeWeeklyDiversity } from './use-cases/compute-weekly-diversity.use-case.js';
