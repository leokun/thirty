import type { FoodCategory, PreparationMethod } from '@thirty/shared';
import type { ComputedFoodScore } from '../../scoring/value-objects/computed-food-score.vo.js';

export interface ScoredFoodLog {
  readonly foodLogId: string;
  readonly foodId: string;
  readonly foodName: string;
  readonly category: FoodCategory;
  readonly isPlant: boolean;
  readonly preparationMethod: PreparationMethod;
  readonly score: ComputedFoodScore;
}
