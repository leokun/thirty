import type { SuggestionRuleDef } from '../entities/suggestion-rule.entity.js';
import type { DismissalRecord } from '../value-objects/dismissal-record.vo.js';

export interface SuggestionRepository {
  getActiveRules(): Promise<readonly SuggestionRuleDef[]>;
  getDismissals(userId: string): Promise<readonly DismissalRecord[]>;
  saveDismissal(userId: string, ruleId: string): Promise<void>;
}
