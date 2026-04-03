import { describe, expect, it } from 'vitest';
import { computeDailyScore, type DailyScoreInput } from './compute-daily-score.service.js';

function makeInput(overrides: Partial<DailyScoreInput> = {}): DailyScoreInput {
  return {
    diversityScore: 0,
    fiberPrebioticScore: 0,
    fermentedScore: 0,
    polyphenolScore: 0,
    mucosalSupportScore: 0,
    preparationScore: 0,
    rollingPlantCount: 0,
    rollingTotalFoodCount: 0,
    ...overrides,
  };
}

describe('computeDailyScore', () => {
  it('returns 0 when all axes are 0', () => {
    const result = computeDailyScore(makeInput());
    expect(result.totalScore).toBe(0);
    expect(result.trend).toBe('STABLE');
  });

  it('returns 100 when all axes are 100', () => {
    const result = computeDailyScore(
      makeInput({
        diversityScore: 100,
        fiberPrebioticScore: 100,
        fermentedScore: 100,
        polyphenolScore: 100,
        mucosalSupportScore: 100,
        preparationScore: 100,
        rollingPlantCount: 30,
        rollingTotalFoodCount: 50,
      }),
    );
    expect(result.totalScore).toBe(100);
  });

  it('applies correct weights (25/20/20/10/15/10)', () => {
    // Only diversity at 100: 100 * 0.25 = 25
    expect(computeDailyScore(makeInput({ diversityScore: 100 })).totalScore).toBe(25);

    // Only fiber at 100: 100 * 0.20 = 20
    expect(computeDailyScore(makeInput({ fiberPrebioticScore: 100 })).totalScore).toBe(20);

    // Only fermented at 100: 100 * 0.20 = 20
    expect(computeDailyScore(makeInput({ fermentedScore: 100 })).totalScore).toBe(20);

    // Only polyphenol at 100: 100 * 0.10 = 10
    expect(computeDailyScore(makeInput({ polyphenolScore: 100 })).totalScore).toBe(10);

    // Only mucosal at 100: 100 * 0.15 = 15
    expect(computeDailyScore(makeInput({ mucosalSupportScore: 100 })).totalScore).toBe(15);

    // Only preparation at 100: 100 * 0.10 = 10
    expect(computeDailyScore(makeInput({ preparationScore: 100 })).totalScore).toBe(10);
  });

  it('passes through rolling counts', () => {
    const result = computeDailyScore(
      makeInput({
        rollingPlantCount: 22,
        rollingTotalFoodCount: 45,
      }),
    );
    expect(result.rollingPlantCount).toBe(22);
    expect(result.rollingTotalFoodCount).toBe(45);
  });

  it('returns IMPROVING when score exceeds previous by more than threshold', () => {
    // threshold is 3, score = 25, previous = 10 -> delta = 15 > 3
    const result = computeDailyScore(
      makeInput({
        diversityScore: 100,
        previousScore: 10,
      }),
    );
    expect(result.trend).toBe('IMPROVING');
  });

  it('returns DECLINING when score is below previous by more than threshold', () => {
    // score = 0, previous = 50 -> delta = -50 < -3
    const result = computeDailyScore(
      makeInput({
        previousScore: 50,
      }),
    );
    expect(result.trend).toBe('DECLINING');
  });

  it('returns STABLE when no previous score', () => {
    const result = computeDailyScore(makeInput({ diversityScore: 50 }));
    expect(result.trend).toBe('STABLE');
  });

  it('returns STABLE when delta is within threshold', () => {
    // score = 20 (fiber 100 * 0.2), previous = 20 -> delta = 0
    const result = computeDailyScore(
      makeInput({
        fiberPrebioticScore: 100,
        previousScore: 20,
      }),
    );
    expect(result.trend).toBe('STABLE');
  });
});
