import type { QuickAddInput } from '@thirty/shared';
import type { FoodRepository } from '../../food/repositories/food.repository.js';
import type { DailyScoreRepository } from '../repositories/daily-score.repository.js';
import type { FoodLogRepository } from '../repositories/food-log.repository.js';
import type { MealRepository } from '../repositories/meal.repository.js';
import { scoreDay } from './score-day.use-case.js';

export class QuickAddUseCase {
  constructor(
    private readonly mealRepo: MealRepository,
    private readonly foodLogRepo: FoodLogRepository,
    private readonly dailyScoreRepo: DailyScoreRepository,
    private readonly foodRepo: FoodRepository,
  ) {}

  async execute(userId: string, input: QuickAddInput): Promise<string> {
    // Find or create meal for this date + moment
    let meal = await this.mealRepo.findByDateAndMoment(userId, input.date, input.moment);
    if (!meal) {
      const mealId = await this.mealRepo.create(userId, {
        date: input.date,
        moment: input.moment,
      });
      meal = { id: mealId };
    }

    const foodId =
      'customFood' in input
        ? await this.foodRepo.createUserFood(userId, input.customFood)
        : input.foodId;

    const logId = await this.foodLogRepo.addFoodLog(meal.id, {
      foodId,
      preparationMethod: input.preparationMethod,
      ...(input.portionSize !== undefined && { portionSize: input.portionSize }),
    });

    // Recompute daily score
    const [today, rollingWindow, previousScore] = await Promise.all([
      this.foodLogRepo.getDayData(userId, input.date),
      this.foodLogRepo.getRollingWindowData(userId, input.date),
      this.dailyScoreRepo.getPreviousScore(userId, input.date),
    ]);

    const breakdown = scoreDay({
      today,
      rollingWindow: { days: rollingWindow },
      ...(previousScore !== null && { previousDayScore: previousScore }),
    });
    await this.dailyScoreRepo.save(userId, input.date, breakdown);

    return logId;
  }
}
