// =============================================================================
// Preparation modifier defaults
// =============================================================================
// Source: scientific literature (reasoned approximations)
// These values will be refined iteratively.
// ADR-005
// =============================================================================

import type { PreparationMethod, PreparationModifier } from '@thirty/shared';

type PreparationDefaults = Record<PreparationMethod, Omit<PreparationModifier, 'method'>>;

export const PREPARATION_DEFAULTS: PreparationDefaults = {
  RAW: {
    fiberFactor: 1.0,
    prebioticFactor: 1.0,
    polyphenolFactor: 1.0,
    probioticsFactor: 0,
    microbiomeBonus: 1,
  },
  STEAMED: {
    fiberFactor: 0.9,
    prebioticFactor: 0.85,
    polyphenolFactor: 0.8,
    probioticsFactor: 0,
    microbiomeBonus: 0,
  },
  BOILED: {
    fiberFactor: 0.7,
    prebioticFactor: 0.7,
    polyphenolFactor: 0.6,
    probioticsFactor: 0,
    microbiomeBonus: 0,
  },
  ROASTED: {
    fiberFactor: 0.8,
    prebioticFactor: 0.75,
    polyphenolFactor: 0.7,
    probioticsFactor: 0,
    microbiomeBonus: 0,
  },
  FRIED: {
    fiberFactor: 0.6,
    prebioticFactor: 0.5,
    polyphenolFactor: 0.4,
    probioticsFactor: 0,
    microbiomeBonus: -2,
  },
  FERMENTED: {
    fiberFactor: 0.8,
    prebioticFactor: 1.2,
    polyphenolFactor: 1.1,
    probioticsFactor: 1.3,
    microbiomeBonus: 3,
  },
  LACTOFERMENTED: {
    fiberFactor: 0.8,
    prebioticFactor: 1.3,
    polyphenolFactor: 1.2,
    probioticsFactor: 1.5,
    microbiomeBonus: 4,
  },
  SPROUTED: {
    fiberFactor: 1.1,
    prebioticFactor: 1.2,
    polyphenolFactor: 1.0,
    probioticsFactor: 0,
    microbiomeBonus: 2,
  },
  SOAKED: {
    fiberFactor: 1.0,
    prebioticFactor: 1.1,
    polyphenolFactor: 0.9,
    probioticsFactor: 0,
    microbiomeBonus: 1,
  },
  DRIED: {
    fiberFactor: 1.2,
    prebioticFactor: 0.9,
    polyphenolFactor: 0.8,
    probioticsFactor: 0,
    microbiomeBonus: 0,
  },
  AGED: {
    fiberFactor: 0,
    prebioticFactor: 0,
    polyphenolFactor: 0,
    probioticsFactor: 1.4,
    microbiomeBonus: 3,
  },
  SMOKED: {
    fiberFactor: 0.7,
    prebioticFactor: 0.6,
    polyphenolFactor: 0.5,
    probioticsFactor: 0,
    microbiomeBonus: -1,
  },
};
