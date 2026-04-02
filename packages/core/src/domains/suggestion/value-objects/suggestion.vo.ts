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
