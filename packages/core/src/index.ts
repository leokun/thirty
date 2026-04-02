// =============================================================================
// @thirty/core - Business logic, clean architecture DDD
// =============================================================================
// 4 domains: scoring, journal, diversity, suggestion
// Pure TypeScript, framework-agnostic, testable in isolation.
//
// ADR-008: Merged @thirty/scoring, clean archi DDD per domain.
// =============================================================================

// --- Domains ---
export * from './domains/shared/index.js';
export * from './domains/scoring/index.js';
export * from './domains/journal/index.js';
export * from './domains/diversity/index.js';
export * from './domains/suggestion/index.js';

// --- Infrastructure (in-memory repos for testing) ---
export { InMemoryFoodLogRepository } from './infrastructure/repositories/in-memory-food-log.repository.js';
export { InMemoryDiversityRepository } from './infrastructure/repositories/in-memory-diversity.repository.js';
export { InMemorySuggestionRepository } from './infrastructure/repositories/in-memory-suggestion.repository.js';
