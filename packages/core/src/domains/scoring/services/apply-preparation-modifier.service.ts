// =============================================================================
// Apply preparation modifiers to a food's base microbiome profile
// =============================================================================
// ADR-005: default multipliers + possible overrides
// =============================================================================

import type { MicrobiomeProfile } from '../value-objects/microbiome-profile.vo.js';
import type { PreparationModifier } from '../value-objects/preparation-modifier.vo.js';
import type { ComputedFoodScore } from '../value-objects/computed-food-score.vo.js';

/**
 * Applies a preparation modifier to a food's base microbiome profile.
 * If an override exists, it replaces the affected base scores.
 */
export function applyPreparationModifier(
  baseProfile: MicrobiomeProfile,
  modifier: PreparationModifier,
): ComputedFoodScore {
  const profile = modifier.overrideProfile
    ? { ...baseProfile, ...modifier.overrideProfile }
    : baseProfile;

  return {
    fiber: (profile.solubleFiberScore + profile.insolubleFiberScore) * modifier.fiberFactor,
    prebiotic: profile.prebioticScore * modifier.prebioticFactor,
    polyphenol: profile.polyphenolScore * modifier.polyphenolFactor,
    probiotics: profile.probioticsScore * modifier.probioticsFactor,
    omega3: profile.omega3Score,
    mucosal: profile.mucosalSupportScore,
    bonus: modifier.microbiomeBonus,
  };
}
