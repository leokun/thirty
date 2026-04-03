import type { ScoredFoodLog } from '@thirty/shared';
import { describe, expect, it } from 'vitest';
import {
  aggregateFermentedScore,
  aggregateFiberPrebioticScore,
  aggregateMucosalSupportScore,
  aggregatePolyphenolScore,
  aggregatePreparationScore,
} from './aggregate-axes.service.js';

function makeScoredLog(
  overrides: Partial<ScoredFoodLog['score']> & { foodId?: string } = {},
): ScoredFoodLog {
  return {
    foodLogId: `log-${Math.random()}`,
    foodId: overrides.foodId ?? `food-${Math.random()}`,
    foodName: 'Test Food',
    category: 'VEGETABLE',
    isPlant: true,
    preparationMethod: 'RAW',
    score: {
      fiber: overrides.fiber ?? 0,
      prebiotic: overrides.prebiotic ?? 0,
      polyphenol: overrides.polyphenol ?? 0,
      probiotics: overrides.probiotics ?? 0,
      omega3: overrides.omega3 ?? 0,
      mucosal: overrides.mucosal ?? 0,
      bonus: overrides.bonus ?? 0,
    },
  };
}

describe('aggregateFiberPrebioticScore', () => {
  it('returns 0 for empty logs', () => {
    expect(aggregateFiberPrebioticScore([])).toBe(0);
  });

  it('normalizes fiber and prebiotic correctly', () => {
    // MAX_DAILY_FIBER = 40, MAX_DAILY_PREBIOTIC = 20
    // fiberNorm = (40/40)*50 = 50, prebioticNorm = (20/20)*50 = 50 -> 100
    const logs = [makeScoredLog({ fiber: 40, prebiotic: 20 })];
    expect(aggregateFiberPrebioticScore(logs)).toBe(100);
  });

  it('sums across multiple logs', () => {
    const logs = [
      makeScoredLog({ fiber: 10, prebiotic: 5 }),
      makeScoredLog({ fiber: 10, prebiotic: 5 }),
    ];
    // fiber: 20/40*50=25, prebiotic: 10/20*50=25 -> 50
    expect(aggregateFiberPrebioticScore(logs)).toBe(50);
  });

  it('clamps at 100', () => {
    const logs = [makeScoredLog({ fiber: 80, prebiotic: 40 })];
    expect(aggregateFiberPrebioticScore(logs)).toBe(100);
  });
});

describe('aggregateFermentedScore', () => {
  it('returns 0 for empty logs', () => {
    expect(aggregateFermentedScore([])).toBe(0);
  });

  it('returns 0 when no logs have probiotics', () => {
    const logs = [makeScoredLog({ probiotics: 0 })];
    expect(aggregateFermentedScore(logs)).toBe(0);
  });

  it('scores presence and variety (50/50 split)', () => {
    // MAX_DAILY_FERMENTED_ITEMS = 4
    // 4 unique fermented foods: presence=50, variety=50 -> 100
    const logs = [
      makeScoredLog({ probiotics: 2, foodId: 'kimchi' }),
      makeScoredLog({ probiotics: 2, foodId: 'sauerkraut' }),
      makeScoredLog({ probiotics: 2, foodId: 'kefir' }),
      makeScoredLog({ probiotics: 2, foodId: 'miso' }),
    ];
    expect(aggregateFermentedScore(logs)).toBe(100);
  });

  it('penalizes low variety (duplicate foods)', () => {
    // 4 items but only 1 unique: presence=50, variety=(1/4)*50=12.5 -> 63
    const logs = [
      makeScoredLog({ probiotics: 2, foodId: 'kimchi' }),
      makeScoredLog({ probiotics: 2, foodId: 'kimchi' }),
      makeScoredLog({ probiotics: 2, foodId: 'kimchi' }),
      makeScoredLog({ probiotics: 2, foodId: 'kimchi' }),
    ];
    expect(aggregateFermentedScore(logs)).toBe(63);
  });
});

describe('aggregatePolyphenolScore', () => {
  it('returns 0 for empty logs', () => {
    expect(aggregatePolyphenolScore([])).toBe(0);
  });

  it('normalizes to 100 at MAX_DAILY_POLYPHENOL (15)', () => {
    const logs = [makeScoredLog({ polyphenol: 15 })];
    expect(aggregatePolyphenolScore(logs)).toBe(100);
  });

  it('returns proportional score', () => {
    // 7.5/15*100 = 50
    const logs = [makeScoredLog({ polyphenol: 7.5 })];
    expect(aggregatePolyphenolScore(logs)).toBe(50);
  });
});

describe('aggregateMucosalSupportScore', () => {
  it('returns 0 for empty logs', () => {
    expect(aggregateMucosalSupportScore([])).toBe(0);
  });

  it('combines omega3 and mucosal scores', () => {
    // MAX_DAILY_MUCOSAL = 20
    // (10+10)/20*100 = 100
    const logs = [makeScoredLog({ omega3: 10, mucosal: 10 })];
    expect(aggregateMucosalSupportScore(logs)).toBe(100);
  });

  it('sums across logs', () => {
    const logs = [
      makeScoredLog({ omega3: 3, mucosal: 2 }),
      makeScoredLog({ omega3: 2, mucosal: 3 }),
    ];
    // (5+5)/20*100 = 50
    expect(aggregateMucosalSupportScore(logs)).toBe(50);
  });
});

describe('aggregatePreparationScore', () => {
  it('returns 0 for empty logs', () => {
    expect(aggregatePreparationScore([])).toBe(0);
  });

  it('returns 50 (neutral) when bonuses sum to 0', () => {
    const logs = [makeScoredLog({ bonus: 0 })];
    expect(aggregatePreparationScore(logs)).toBe(50);
  });

  it('increases above 50 with positive bonuses', () => {
    // MAX_DAILY_BONUS = 10
    // 50 + (5/10)*50 = 75
    const logs = [makeScoredLog({ bonus: 5 })];
    expect(aggregatePreparationScore(logs)).toBe(75);
  });

  it('decreases below 50 with negative bonuses', () => {
    // 50 + (-5/10)*50 = 25
    const logs = [makeScoredLog({ bonus: -5 })];
    expect(aggregatePreparationScore(logs)).toBe(25);
  });

  it('clamps at 100', () => {
    const logs = [makeScoredLog({ bonus: 20 })];
    expect(aggregatePreparationScore(logs)).toBe(100);
  });

  it('clamps at 0', () => {
    const logs = [makeScoredLog({ bonus: -20 })];
    expect(aggregatePreparationScore(logs)).toBe(0);
  });
});
