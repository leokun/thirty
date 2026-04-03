import type { PreparationMethod } from '../enums.js';

export interface MicrobiomeProfile {
  readonly solubleFiberScore: number;
  readonly insolubleFiberScore: number;
  readonly prebioticScore: number;
  readonly polyphenolScore: number;
  readonly isFermented: boolean;
  readonly probioticsScore: number;
  readonly omega3Score: number;
  readonly mucosalSupportScore: number;
}

export interface ComputedFoodScore {
  readonly fiber: number;
  readonly prebiotic: number;
  readonly polyphenol: number;
  readonly probiotics: number;
  readonly omega3: number;
  readonly mucosal: number;
  readonly bonus: number;
}

export interface PreparationModifier {
  readonly method: PreparationMethod;
  readonly fiberFactor: number;
  readonly prebioticFactor: number;
  readonly polyphenolFactor: number;
  readonly probioticsFactor: number;
  readonly microbiomeBonus: number;
  readonly overrideProfile?: Partial<MicrobiomeProfile>;
}
