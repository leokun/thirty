import type { ComputedFoodScore } from '@thirty/shared';
import { describe, expect, it } from 'vitest';
import { applyPortionToAxisScores, portionAxisMultiplier } from './portion-multiplier.service.js';

const base: ComputedFoodScore = {
  fiber: 10,
  prebiotic: 8,
  polyphenol: 4,
  probiotics: 2,
  omega3: 1,
  mucosal: 1,
  bonus: 0.5,
};

describe('portionAxisMultiplier', () => {
  it('returns 1 for null or undefined', () => {
    expect(portionAxisMultiplier(null)).toBe(1);
    expect(portionAxisMultiplier(undefined)).toBe(1);
  });

  it('scales small and large relative to medium', () => {
    expect(portionAxisMultiplier('SMALL')).toBeLessThan(1);
    expect(portionAxisMultiplier('LARGE')).toBeGreaterThan(1);
    expect(portionAxisMultiplier('MEDIUM')).toBe(1);
  });
});

describe('applyPortionToAxisScores', () => {
  it('leaves probiotics, omega3, mucosal, bonus unchanged', () => {
    const out = applyPortionToAxisScores(base, 'SMALL');
    expect(out.probiotics).toBe(base.probiotics);
    expect(out.omega3).toBe(base.omega3);
    expect(out.mucosal).toBe(base.mucosal);
    expect(out.bonus).toBe(base.bonus);
  });

  it('scales fiber, prebiotic, polyphenol for SMALL', () => {
    const out = applyPortionToAxisScores(base, 'SMALL');
    const m = portionAxisMultiplier('SMALL');
    expect(out.fiber).toBeCloseTo(base.fiber * m);
    expect(out.prebiotic).toBeCloseTo(base.prebiotic * m);
    expect(out.polyphenol).toBeCloseTo(base.polyphenol * m);
  });
});
