import type { DismissalRecord, SuggestionRuleDef } from '@thirty/shared';
import type { SuggestionRepository } from '../../domains/suggestion/repositories/suggestion.repository.js';

export class InMemorySuggestionRepository implements SuggestionRepository {
  private rules: SuggestionRuleDef[] = [];
  private dismissals = new Map<string, DismissalRecord[]>();

  async getActiveRules(): Promise<readonly SuggestionRuleDef[]> {
    return this.rules.filter((r) => r.isActive);
  }

  async getDismissals(userId: string): Promise<readonly DismissalRecord[]> {
    return this.dismissals.get(userId) ?? [];
  }

  async saveDismissal(userId: string, ruleId: string): Promise<void> {
    const existing = this.dismissals.get(userId) ?? [];
    const filtered = existing.filter((d) => d.ruleId !== ruleId);
    filtered.push({ ruleId, dismissedAt: new Date() });
    this.dismissals.set(userId, filtered);
  }

  seedRules(rules: SuggestionRuleDef[]): void {
    this.rules = [...rules];
  }

  seedDismissals(userId: string, dismissals: DismissalRecord[]): void {
    this.dismissals.set(userId, [...dismissals]);
  }

  clear(): void {
    this.rules = [];
    this.dismissals.clear();
  }
}
