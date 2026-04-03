import type { FoodCategory, PreparationMethod } from '@thirty/shared';

export interface FoodDefinition {
  readonly nameFr: string;
  readonly nameEn?: string;
  readonly category: FoodCategory;
  readonly isPlant: boolean;
  readonly solubleFiberScore: number;
  readonly insolubleFiberScore: number;
  readonly prebioticScore: number;
  readonly polyphenolScore: number;
  readonly isFermented: boolean;
  readonly probioticsScore: number;
  readonly omega3Score: number;
  readonly mucosalSupportScore: number;
  readonly seasonMonths: number[];
  readonly synonyms: string[];
  readonly tags: string[];
  readonly sources: string[];
  readonly availablePreparations: PreparationMethod[];
  readonly defaultPreparation: PreparationMethod;
  readonly preparationOverrides?: Record<
    string,
    {
      readonly fiberFactor?: number;
      readonly prebioticFactor?: number;
      readonly polyphenolFactor?: number;
      readonly probioticsFactor?: number;
      readonly microbiomeBonus?: number;
      readonly overrideProfile?: Record<string, number | boolean>;
    }
  >;
}
