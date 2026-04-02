import type { SuggestionType } from '../value-objects/suggestion.vo.js';
import type { SuggestionCondition } from '../value-objects/suggestion-condition.vo.js';

export interface SuggestionRuleDef {
  readonly id: string;
  readonly type: SuggestionType;
  readonly condition: SuggestionCondition;
  readonly messageFr: string;
  readonly messageEn?: string;
  readonly cooldownHours: number;
  readonly priority: number;
  readonly isActive: boolean;
  readonly suggestedFoodIds: readonly string[];
}
