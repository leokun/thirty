import type { DismissalRecord, SuggestionRuleDef } from '@thirty/shared';

export interface SuggestionRepository {
  getActiveRules(): Promise<readonly SuggestionRuleDef[]>;
  getDismissals(userId: string): Promise<readonly DismissalRecord[]>;
  saveDismissal(userId: string, ruleId: string): Promise<void>;
}
