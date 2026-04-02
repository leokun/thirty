import type { PreparationMethod } from '@thirty/shared';
import type { MicrobiomeProfile } from './microbiome-profile.vo.js';

export interface PreparationModifier {
  readonly method: PreparationMethod;
  readonly fiberFactor: number;
  readonly prebioticFactor: number;
  readonly polyphenolFactor: number;
  readonly probioticsFactor: number;
  readonly microbiomeBonus: number;
  readonly overrideProfile?: Partial<MicrobiomeProfile>;
}
