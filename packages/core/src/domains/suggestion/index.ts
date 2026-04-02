// =============================================================================
// @thirty/core — Domaine Suggestion
// =============================================================================

// --- Entities ---
export type { SuggestionRuleDef } from './entities/suggestion-rule.entity.js';
// --- Repositories ---
export type { SuggestionRepository } from './repositories/suggestion.repository.js';
export { isOnCooldown } from './services/cooldown.service.js';
// --- Services ---
export { evaluateCondition, resolveMetric } from './services/evaluate-condition.service.js';
// --- Use Cases ---
export { evaluateSuggestions } from './use-cases/evaluate-suggestions.use-case.js';
export type { DismissalRecord } from './value-objects/dismissal-record.vo.js';
// --- Value Objects ---
export type { Suggestion, SuggestionType } from './value-objects/suggestion.vo.js';
export type {
  SuggestionCondition,
  SuggestionMetric,
} from './value-objects/suggestion-condition.vo.js';
export type { SuggestionContext } from './value-objects/suggestion-context.vo.js';
