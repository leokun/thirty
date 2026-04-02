// =============================================================================
// Cooldown — vérifie si une règle est en cooldown pour un utilisateur
// =============================================================================

import type { SuggestionRuleDef } from '../entities/suggestion-rule.entity.js';
import type { DismissalRecord } from '../value-objects/dismissal-record.vo.js';

const MS_PER_HOUR = 3_600_000;

export function isOnCooldown(
  rule: SuggestionRuleDef,
  dismissals: readonly DismissalRecord[],
  now: Date,
): boolean {
  const dismissal = dismissals.find((d) => d.ruleId === rule.id);
  if (!dismissal) return false;

  const elapsed = now.getTime() - dismissal.dismissedAt.getTime();
  return elapsed < rule.cooldownHours * MS_PER_HOUR;
}
