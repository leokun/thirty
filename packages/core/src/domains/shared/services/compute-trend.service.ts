import type { Trend } from '@thirty/shared';

/**
 * Computes a trend based on the delta between current and previous values.
 * Uses strict comparison: delta must exceed the threshold (not equal).
 */
export function computeTrend(
  current: number,
  previous: number | undefined,
  threshold: number,
): Trend {
  if (previous === undefined) return 'STABLE';
  const delta = current - previous;
  if (delta > threshold) return 'IMPROVING';
  if (delta < -threshold) return 'DECLINING';
  return 'STABLE';
}
