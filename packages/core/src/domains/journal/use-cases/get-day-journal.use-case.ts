import type { DayData } from '@thirty/shared';
import type { FoodLogRepository } from '../repositories/food-log.repository.js';

export class GetDayJournalUseCase {
  constructor(private readonly foodLogRepo: FoodLogRepository) {}

  async execute(userId: string, date: string): Promise<DayData> {
    return this.foodLogRepo.getDayData(userId, date);
  }
}
