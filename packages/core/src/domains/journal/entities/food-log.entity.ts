import type { FoodCategory, PortionSize, PreparationMethod } from '@thirty/shared';
import type { MicrobiomeProfile } from '../../scoring/value-objects/microbiome-profile.vo.js';

export interface FoodLogEntry {
  readonly id: string;
  readonly foodId: string;
  readonly foodName: string;
  readonly category: FoodCategory;
  readonly isPlant: boolean;
  readonly preparationMethod: PreparationMethod;
  readonly portionSize: PortionSize | null;
  readonly baseProfile: MicrobiomeProfile;
  readonly customModifier?: {
    readonly fiberFactor: number;
    readonly prebioticFactor: number;
    readonly polyphenolFactor: number;
    readonly probioticsFactor: number;
    readonly microbiomeBonus: number;
    readonly overrideProfile?: Partial<MicrobiomeProfile>;
  };
}
