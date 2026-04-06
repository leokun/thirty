import type { MealMoment, PortionSize, PreparationMethod } from '../enums.js';
import type { DailyScoreBreakdown } from '../types/journal.js';
import type { CreateUserFoodInput } from './food.dto.js';

export interface CreateMealInput {
  readonly date: string;
  readonly moment: MealMoment;
  readonly note?: string;
}

export interface AddFoodLogInput {
  readonly foodId: string;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize?: PortionSize;
}

/** Log a curated catalog food. */
export interface QuickAddCatalogInput {
  readonly date: string;
  readonly moment: MealMoment;
  readonly foodId: string;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize?: PortionSize;
}

/** Log a user-described food (creates or reuses a user-scoped Food row). */
export interface QuickAddCustomFoodInput {
  readonly date: string;
  readonly moment: MealMoment;
  readonly customFood: CreateUserFoodInput;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize?: PortionSize;
}

export type QuickAddInput = QuickAddCatalogInput | QuickAddCustomFoodInput;

export interface MealResponse {
  readonly id: string;
  readonly date: string;
  readonly moment: MealMoment;
  readonly note?: string;
  readonly foodLogs: readonly FoodLogResponse[];
}

export interface FoodLogResponse {
  readonly id: string;
  readonly foodId: string;
  readonly foodName: string;
  readonly category: string;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize?: PortionSize;
}

export interface DayResponse {
  readonly date: string;
  readonly meals: readonly MealResponse[];
  readonly score?: DailyScoreBreakdown;
}
