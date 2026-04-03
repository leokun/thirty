// =============================================================================
// @thirty/core - Business logic, clean architecture DDD
// =============================================================================
// 4 domains: scoring, journal, diversity, suggestion
// Pure TypeScript, framework-agnostic, testable in isolation.
//
// ADR-008: Merged @thirty/scoring, clean archi DDD per domain.
// Types and interfaces live in @thirty/shared (ADR-009).
// =============================================================================

// --- Domains ---
export * from './domains/diversity/index.js';
export * from './domains/favorite/index.js';
export * from './domains/food/index.js';
export * from './domains/journal/index.js';
export * from './domains/score/index.js';
export * from './domains/scoring/index.js';
export * from './domains/shared/index.js';
export * from './domains/suggestion/index.js';
export { InMemoryDiversityRepository } from './infrastructure/diversity/in-memory-diversity.repository.js';
export { PrismaDiversityRepository } from './infrastructure/diversity/prisma-diversity.repository.js';
export { InMemoryFavoriteRepository } from './infrastructure/favorite/in-memory-favorite.repository.js';
export { PrismaFavoriteRepository } from './infrastructure/favorite/prisma-favorite.repository.js';
export { InMemoryFoodRepository } from './infrastructure/food/in-memory-food.repository.js';
export { PrismaFoodRepository } from './infrastructure/food/prisma-food.repository.js';
export { InMemoryDailyScoreRepository } from './infrastructure/journal/in-memory-daily-score.repository.js';
// --- Infrastructure (in-memory repos for testing) ---
export { InMemoryFoodLogRepository } from './infrastructure/journal/in-memory-food-log.repository.js';
export { InMemoryMealRepository } from './infrastructure/journal/in-memory-meal.repository.js';
export { PrismaDailyScoreRepository } from './infrastructure/journal/prisma-daily-score.repository.js';
// --- Infrastructure (Prisma adapters) ---
export { PrismaFoodLogRepository } from './infrastructure/journal/prisma-food-log.repository.js';
export { PrismaMealRepository } from './infrastructure/journal/prisma-meal.repository.js';
export { InMemorySuggestionRepository } from './infrastructure/suggestion/in-memory-suggestion.repository.js';
