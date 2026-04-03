// =============================================================================
// Use case: evaluate contextual suggestions
// =============================================================================

import type {
  DismissalRecord,
  Suggestion,
  SuggestionContext,
  SuggestionRuleDef,
} from '@thirty/shared';
import { isOnCooldown } from '../services/cooldown.service.js';
import { evaluateCondition } from '../services/evaluate-condition.service.js';

/**
 * Evaluates all active rules against the user context.
 * Filters out rules on cooldown, sorts by descending priority.
 */
export function evaluateSuggestions(
  rules: readonly SuggestionRuleDef[],
  context: SuggestionContext,
  dismissals: readonly DismissalRecord[],
  locale: 'fr' | 'en' = 'fr',
): readonly Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const rule of rules) {
    if (!rule.isActive) continue;
    if (isOnCooldown(rule, dismissals, context.now)) continue;
    if (!evaluateCondition(rule.condition, context)) continue;

    const message = locale === 'en' && rule.messageEn ? rule.messageEn : rule.messageFr;

    suggestions.push({
      ruleId: rule.id,
      type: rule.type,
      message,
      priority: rule.priority,
      suggestedFoodIds: rule.suggestedFoodIds,
    });
  }

  return suggestions.sort((a, b) => b.priority - a.priority);
}
