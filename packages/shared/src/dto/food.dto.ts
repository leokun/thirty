import type { FoodCategory, PreparationMethod } from '../enums.js';
import type { MicrobiomeProfile } from '../types/scoring.js';

export interface SearchFoodQuery {
  readonly q: string;
  readonly category?: FoodCategory;
  readonly limit?: number;
}

export interface FoodResponse {
  readonly id: string;
  readonly nameFr: string;
  readonly nameEn: string;
  readonly category: FoodCategory;
  readonly isPlant: boolean;
  readonly availablePreparations: PreparationMethod[];
  readonly defaultPreparation: PreparationMethod;
  readonly baseProfile: MicrobiomeProfile;
  readonly seasonMonths: number[];
  readonly tags: string[];
}

export interface RecentFoodResponse {
  readonly foodId: string;
  readonly nameFr: string;
  readonly category: FoodCategory;
  readonly lastUsed: string;
  readonly useCount: number;
}

/** User-defined food when logging an item not in the curated catalog (F1). */
export interface CreateUserFoodInput {
  readonly nameFr: string;
  readonly category: FoodCategory;
}
