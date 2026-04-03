import { describe, expect, it } from 'vitest';
import { computeDiversityScore } from './compute-diversity-score.service.js';

describe('computeDiversityScore', () => {
  it('returns 0 for 0 plants', () => {
    expect(computeDiversityScore(0)).toBe(0);
  });

  it('returns plantCount * 2 for 1-9 plants', () => {
    expect(computeDiversityScore(1)).toBe(2);
    expect(computeDiversityScore(5)).toBe(10);
    expect(computeDiversityScore(9)).toBe(18);
  });

  it('switches to 20 + (count-10)*4 for 10-19 plants', () => {
    expect(computeDiversityScore(10)).toBe(20);
    expect(computeDiversityScore(15)).toBe(40);
    expect(computeDiversityScore(19)).toBe(56);
  });

  it('switches to 60 + (count-20)*4 for 20-29 plants', () => {
    expect(computeDiversityScore(20)).toBe(60);
    expect(computeDiversityScore(25)).toBe(80);
    expect(computeDiversityScore(29)).toBe(96);
  });

  it('returns 100 for exactly 30 plants (WEEKLY_PLANT_GOAL)', () => {
    expect(computeDiversityScore(30)).toBe(100);
  });

  it('caps at 100 for more than 30 plants', () => {
    expect(computeDiversityScore(35)).toBe(100);
    expect(computeDiversityScore(50)).toBe(100);
  });
});
