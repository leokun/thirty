// =============================================================================
// @thirty/core — Domaine Diversity
// =============================================================================

// --- Value Objects ---
export type { RollingWindowData } from './value-objects/rolling-window.vo.js';
export type { WeeklyDiversityResult } from './value-objects/weekly-diversity-result.vo.js';

// --- Repositories ---
export type { DiversityRepository } from './repositories/diversity.repository.js';

// --- Services ---
export {
  computeWindowStart,
  filterToWindow,
  flattenFoodLogs,
  countDistinct,
  uniqueFoodIds,
} from './services/rolling-window.service.js';

// --- Use Cases ---
export { computeWeeklyDiversity } from './use-cases/compute-weekly-diversity.use-case.js';
