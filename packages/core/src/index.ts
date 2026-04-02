// =============================================================================
// @thirty/core — Logique métier, clean architecture DDD
// =============================================================================
// 4 domaines : scoring, journal, diversity, suggestion
// Pur TypeScript, framework-agnostic, testable isolément.
//
// ADR-008 : Fusion de @thirty/scoring, clean archi DDD par domaine.
// =============================================================================

// --- Domaines ---
export * from './domains/shared/index.js';
export * from './domains/scoring/index.js';
export * from './domains/journal/index.js';
export * from './domains/diversity/index.js';
export * from './domains/suggestion/index.js';

// --- Infrastructure (in-memory repos pour les tests) ---
export { InMemoryFoodLogRepository } from './infrastructure/repositories/in-memory-food-log.repository.js';
export { InMemoryDiversityRepository } from './infrastructure/repositories/in-memory-diversity.repository.js';
export { InMemorySuggestionRepository } from './infrastructure/repositories/in-memory-suggestion.repository.js';
