import type { FoodCategory, MealMoment, PortionSize, PreparationMethod, Trend } from '../enums.js';
import type { ComputedFoodScore, MicrobiomeProfile } from './scoring.js';

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

export interface ScoredFoodLog {
  readonly foodLogId: string;
  readonly foodId: string;
  readonly foodName: string;
  readonly category: FoodCategory;
  readonly isPlant: boolean;
  readonly preparationMethod: PreparationMethod;
  readonly score: ComputedFoodScore;
}

export interface MealData {
  readonly id: string;
  readonly moment: MealMoment;
  readonly date: string;
  readonly foodLogs: readonly FoodLogEntry[];
}

export interface DayData {
  readonly date: string;
  readonly meals: readonly MealData[];
}

export interface DailyScoreBreakdown {
  readonly totalScore: number;
  readonly diversityScore: number;
  readonly fiberPrebioticScore: number;
  readonly fermentedScore: number;
  readonly polyphenolScore: number;
  readonly mucosalSupportScore: number;
  readonly preparationScore: number;
  readonly rollingPlantCount: number;
  readonly rollingTotalFoodCount: number;
  readonly trend: Trend;
}
