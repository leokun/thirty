import type { MicrobiomeProfile, PreparationModifier } from '@thirty/shared';
import { describe, expect, it } from 'vitest';
import { applyPreparationModifier } from './apply-preparation-modifier.service.js';

const baseProfile: MicrobiomeProfile = {
  solubleFiberScore: 3,
  insolubleFiberScore: 2,
  prebioticScore: 4,
  polyphenolScore: 5,
  isFermented: false,
  probioticsScore: 0,
  omega3Score: 1,
  mucosalSupportScore: 2,
};

describe('applyPreparationModifier', () => {
  it('returns base scores directly when factors are 1.0', () => {
    const modifier: PreparationModifier = {
      method: 'RAW',
      fiberFactor: 1.0,
      prebioticFactor: 1.0,
      polyphenolFactor: 1.0,
      probioticsFactor: 1.0,
      microbiomeBonus: 0,
    };

    const result = applyPreparationModifier(baseProfile, modifier);

    expect(result.fiber).toBe(5); // 3 + 2
    expect(result.prebiotic).toBe(4);
    expect(result.polyphenol).toBe(5);
    expect(result.probiotics).toBe(0);
    expect(result.omega3).toBe(1);
    expect(result.mucosal).toBe(2);
    expect(result.bonus).toBe(0);
  });

  it('reduces scores with fried preparation factors', () => {
    const modifier: PreparationModifier = {
      method: 'FRIED',
      fiberFactor: 0.6,
      prebioticFactor: 0.5,
      polyphenolFactor: 0.4,
      probioticsFactor: 0,
      microbiomeBonus: -2,
    };

    const result = applyPreparationModifier(baseProfile, modifier);

    expect(result.fiber).toBeCloseTo(3); // (3+2) * 0.6
    expect(result.prebiotic).toBeCloseTo(2); // 4 * 0.5
    expect(result.polyphenol).toBeCloseTo(2); // 5 * 0.4
    expect(result.probiotics).toBe(0);
    expect(result.bonus).toBe(-2);
  });

  it('boosts probiotics with lactofermented modifier', () => {
    const fermentedProfile: MicrobiomeProfile = {
      ...baseProfile,
      isFermented: true,
      probioticsScore: 3,
    };

    const modifier: PreparationModifier = {
      method: 'LACTOFERMENTED',
      fiberFactor: 0.8,
      prebioticFactor: 1.3,
      polyphenolFactor: 1.2,
      probioticsFactor: 1.5,
      microbiomeBonus: 4,
    };

    const result = applyPreparationModifier(fermentedProfile, modifier);

    expect(result.probiotics).toBeCloseTo(4.5); // 3 * 1.5
    expect(result.prebiotic).toBeCloseTo(5.2); // 4 * 1.3
    expect(result.bonus).toBe(4);
  });

  it('applies override profile before multiplying', () => {
    const modifier: PreparationModifier = {
      method: 'FERMENTED',
      fiberFactor: 1.0,
      prebioticFactor: 1.0,
      polyphenolFactor: 1.0,
      probioticsFactor: 1.0,
      microbiomeBonus: 3,
      overrideProfile: {
        probioticsScore: 5,
        prebioticScore: 10,
      },
    };

    const result = applyPreparationModifier(baseProfile, modifier);

    // Override replaces base values
    expect(result.probiotics).toBe(5);
    expect(result.prebiotic).toBe(10);
    // Non-overridden values stay the same
    expect(result.fiber).toBe(5); // 3 + 2
    expect(result.polyphenol).toBe(5);
    expect(result.bonus).toBe(3);
  });

  it('passes through bonus from modifier', () => {
    const modifier: PreparationModifier = {
      method: 'SPROUTED',
      fiberFactor: 1.0,
      prebioticFactor: 1.0,
      polyphenolFactor: 1.0,
      probioticsFactor: 1.0,
      microbiomeBonus: 2,
    };

    const result = applyPreparationModifier(baseProfile, modifier);
    expect(result.bonus).toBe(2);
  });
});
