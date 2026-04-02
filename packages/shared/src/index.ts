// =============================================================================
// @thirty/shared - Shared types, DTOs, constants
// =============================================================================

// --- Enums ---

export const FoodCategory = {
  VEGETABLE: 'VEGETABLE',
  FRUIT: 'FRUIT',
  LEGUME: 'LEGUME',
  GRAIN: 'GRAIN',
  NUT_SEED: 'NUT_SEED',
  HERB_SPICE: 'HERB_SPICE',
  DAIRY: 'DAIRY',
  CHEESE: 'CHEESE',
  MEAT: 'MEAT',
  FISH: 'FISH',
  EGG: 'EGG',
  FERMENTED_CONDIMENT: 'FERMENTED_CONDIMENT',
  BEVERAGE: 'BEVERAGE',
  OTHER: 'OTHER',
} as const;
export type FoodCategory = (typeof FoodCategory)[keyof typeof FoodCategory];

export const PreparationMethod = {
  RAW: 'RAW',
  STEAMED: 'STEAMED',
  BOILED: 'BOILED',
  ROASTED: 'ROASTED',
  FRIED: 'FRIED',
  FERMENTED: 'FERMENTED',
  LACTOFERMENTED: 'LACTOFERMENTED',
  SPROUTED: 'SPROUTED',
  SOAKED: 'SOAKED',
  DRIED: 'DRIED',
  AGED: 'AGED',
  SMOKED: 'SMOKED',
} as const;
export type PreparationMethod = (typeof PreparationMethod)[keyof typeof PreparationMethod];

export const MealMoment = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  SNACK: 'SNACK',
} as const;
export type MealMoment = (typeof MealMoment)[keyof typeof MealMoment];

export const PortionSize = {
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
} as const;
export type PortionSize = (typeof PortionSize)[keyof typeof PortionSize];

export const Trend = {
  IMPROVING: 'IMPROVING',
  STABLE: 'STABLE',
  DECLINING: 'DECLINING',
} as const;
export type Trend = (typeof Trend)[keyof typeof Trend];

// --- Scoring Constants ---

export const SCORING_WEIGHTS = {
  diversity: 0.25,
  fiberPrebiotic: 0.2,
  fermented: 0.2,
  polyphenol: 0.1,
  mucosalSupport: 0.15,
  preparation: 0.1,
} as const;

export const WEEKLY_PLANT_GOAL = 30;
export const ROLLING_WINDOW_DAYS = 7;
