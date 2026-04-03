import type { MealMoment, PortionSize, PreparationMethod } from '../enums.js';

export interface CreateFavoriteInput {
  readonly name: string;
  readonly moment?: MealMoment;
  readonly items: readonly FavoriteItemInput[];
}

export interface FavoriteItemInput {
  readonly foodId: string;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize?: PortionSize;
}

export interface FavoriteResponse {
  readonly id: string;
  readonly name: string;
  readonly moment?: MealMoment;
  readonly items: readonly FavoriteItemResponse[];
  readonly usageCount: number;
}

export interface FavoriteItemResponse {
  readonly foodId: string;
  readonly foodName: string;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize?: PortionSize;
}
