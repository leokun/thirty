import type { WeeklyDiversityResult } from './diversity.js';
import type { DailyScoreBreakdown } from './journal.js';

export type SuggestionType =
  | 'DIVERSITY'
  | 'FERMENTED'
  | 'PREPARATION'
  | 'SEASONAL'
  | 'POLYPHENOL'
  | 'MUCOSAL_SUPPORT'
  | 'CHEESE';

export interface Suggestion {
  readonly ruleId: string;
  readonly type: SuggestionType;
  readonly message: string;
  readonly priority: number;
  readonly suggestedFoodIds: readonly string[];
}

export type SuggestionMetric =
  | 'rolling_plant_count'
  | 'fermented_days_without'
  | 'fried_count_7d'
  | 'polyphenol_score'
  | 'mucosal_score'
  | 'diversity_score';

export interface SuggestionCondition {
  readonly metric: SuggestionMetric;
  readonly operator: '>=' | '<=' | '>' | '<' | '==';
  readonly value: number;
}

export interface SuggestionContext {
  readonly breakdown: DailyScoreBreakdown;
  readonly diversity: WeeklyDiversityResult;
  readonly fermentedDaysWithout: number;
  readonly friedCount7d: number;
  readonly now: Date;
}

export interface DismissalRecord {
  readonly ruleId: string;
  readonly dismissedAt: Date;
}

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
