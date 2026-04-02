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
