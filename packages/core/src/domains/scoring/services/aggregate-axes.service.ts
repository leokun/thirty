// =============================================================================
// Aggregate axes — food logs scorés → score par axe (0-100)
// =============================================================================

import type { ScoredFoodLog } from '../../journal/value-objects/scored-food-log.vo.js';

// Seuils de normalisation : score max atteignable en une journée "parfaite".
// Valeurs conservatrices, ajustables itérativement.
const MAX_DAILY_FIBER = 40;
const MAX_DAILY_PREBIOTIC = 20;
const MAX_DAILY_FERMENTED_ITEMS = 4;
const MAX_DAILY_POLYPHENOL = 15;
const MAX_DAILY_MUCOSAL = 20;
const MAX_DAILY_BONUS = 10;

function clamp100(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function aggregateFiberPrebioticScore(logs: readonly ScoredFoodLog[]): number {
  let fiberSum = 0;
  let prebioticSum = 0;
  for (const log of logs) {
    fiberSum += log.score.fiber;
    prebioticSum += log.score.prebiotic;
  }
  const fiberNorm = (fiberSum / MAX_DAILY_FIBER) * 50;
  const prebioticNorm = (prebioticSum / MAX_DAILY_PREBIOTIC) * 50;
  return clamp100(fiberNorm + prebioticNorm);
}

export function aggregateFermentedScore(logs: readonly ScoredFoodLog[]): number {
  const fermentedLogs = logs.filter((l) => l.score.probiotics > 0);
  const count = fermentedLogs.length;
  const uniqueFoods = new Set(fermentedLogs.map((l) => l.foodId));

  // Présence (50%) + variété (50%)
  const presenceScore = Math.min(count / MAX_DAILY_FERMENTED_ITEMS, 1) * 50;
  const varietyScore = Math.min(uniqueFoods.size / MAX_DAILY_FERMENTED_ITEMS, 1) * 50;
  return clamp100(presenceScore + varietyScore);
}

export function aggregatePolyphenolScore(logs: readonly ScoredFoodLog[]): number {
  let sum = 0;
  for (const log of logs) {
    sum += log.score.polyphenol;
  }
  return clamp100((sum / MAX_DAILY_POLYPHENOL) * 100);
}

export function aggregateMucosalSupportScore(logs: readonly ScoredFoodLog[]): number {
  let omega3Sum = 0;
  let mucosalSum = 0;
  for (const log of logs) {
    omega3Sum += log.score.omega3;
    mucosalSum += log.score.mucosal;
  }
  const combined = omega3Sum + mucosalSum;
  return clamp100((combined / MAX_DAILY_MUCOSAL) * 100);
}

export function aggregatePreparationScore(logs: readonly ScoredFoodLog[]): number {
  if (logs.length === 0) return 0;
  let bonusSum = 0;
  for (const log of logs) {
    bonusSum += log.score.bonus;
  }
  // Normalise autour de 50 (neutre) + bonus/malus
  const normalized = 50 + (bonusSum / MAX_DAILY_BONUS) * 50;
  return clamp100(normalized);
}
