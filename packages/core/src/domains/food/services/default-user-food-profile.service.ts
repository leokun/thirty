// =============================================================================
// Default microbiome profile for user-created (non-catalog) foods — F1
// =============================================================================

import { FoodCategory, type MicrobiomeProfile } from '@thirty/shared';

export function isPlantCategory(category: FoodCategory): boolean {
  switch (category) {
    case FoodCategory.VEGETABLE:
    case FoodCategory.FRUIT:
    case FoodCategory.LEGUME:
    case FoodCategory.GRAIN:
    case FoodCategory.NUT_SEED:
    case FoodCategory.HERB_SPICE:
    case FoodCategory.FERMENTED_CONDIMENT:
      return true;
    default:
      return false;
  }
}

/**
 * Conservative defaults when the user logs a food not in the curated DB.
 */
export function defaultMicrobiomeProfileForCategory(category: FoodCategory): MicrobiomeProfile {
  const base = (): MicrobiomeProfile => ({
    solubleFiberScore: 1,
    insolubleFiberScore: 1,
    prebioticScore: 1,
    polyphenolScore: 1,
    isFermented: false,
    probioticsScore: 0,
    omega3Score: 0,
    mucosalSupportScore: 0,
  });

  switch (category) {
    case FoodCategory.VEGETABLE:
    case FoodCategory.FRUIT:
      return {
        ...base(),
        solubleFiberScore: 2,
        insolubleFiberScore: 2,
        prebioticScore: 2,
        polyphenolScore: 2,
      };
    case FoodCategory.LEGUME:
      return {
        ...base(),
        solubleFiberScore: 2,
        insolubleFiberScore: 2,
        prebioticScore: 3,
        polyphenolScore: 1,
      };
    case FoodCategory.GRAIN:
    case FoodCategory.NUT_SEED:
      return {
        ...base(),
        solubleFiberScore: 2,
        insolubleFiberScore: 2,
        prebioticScore: 2,
        polyphenolScore: 1,
      };
    case FoodCategory.HERB_SPICE:
      return {
        ...base(),
        solubleFiberScore: 0.5,
        insolubleFiberScore: 0.5,
        prebioticScore: 0,
        polyphenolScore: 2,
      };
    case FoodCategory.DAIRY:
      return {
        ...base(),
        prebioticScore: 1,
        probioticsScore: 2,
        mucosalSupportScore: 1,
      };
    case FoodCategory.CHEESE:
      return {
        ...base(),
        probioticsScore: 2,
        mucosalSupportScore: 1,
      };
    case FoodCategory.MEAT:
      return {
        ...base(),
        mucosalSupportScore: 1,
      };
    case FoodCategory.FISH:
      return {
        ...base(),
        omega3Score: 3,
        mucosalSupportScore: 1,
      };
    case FoodCategory.EGG:
      return {
        ...base(),
        mucosalSupportScore: 1,
      };
    case FoodCategory.FERMENTED_CONDIMENT:
      return {
        ...base(),
        isFermented: true,
        prebioticScore: 1,
        probioticsScore: 3,
        polyphenolScore: 1,
      };
    case FoodCategory.BEVERAGE:
      return {
        ...base(),
        polyphenolScore: 2,
      };
    case FoodCategory.OTHER:
      return base();
    default:
      return base();
  }
}
