import type { DayData } from '../../journal/value-objects/day-data.vo.js';

export interface RollingWindowData {
  readonly days: readonly DayData[];
}
