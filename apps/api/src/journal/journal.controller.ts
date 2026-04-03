import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import {
  AddFoodLogUseCase,
  CreateMealUseCase,
  GetDayJournalUseCase,
  PrismaDailyScoreRepository,
  PrismaFoodLogRepository,
  PrismaMealRepository,
  QuickAddUseCase,
  RemoveFoodLogUseCase,
} from '@thirty/core';
import type { AddFoodLogInput, CreateMealInput, DayData, QuickAddInput } from '@thirty/shared';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('meals')
export class JournalController {
  @Post()
  async createMeal(
    @CurrentUser() userId: string,
    @Body() input: CreateMealInput,
  ): Promise<{ id: string }> {
    const repo = new PrismaMealRepository();
    const useCase = new CreateMealUseCase(repo);
    const id = await useCase.execute(userId, input);
    return { id };
  }

  @Get()
  async getDayJournal(
    @CurrentUser() userId: string,
    @Query('date') date?: string,
  ): Promise<DayData> {
    const repo = new PrismaFoodLogRepository();
    const useCase = new GetDayJournalUseCase(repo);
    return useCase.execute(userId, date ?? new Date().toISOString().slice(0, 10));
  }

  @Post(':mealId/foods')
  async addFoodLog(
    @CurrentUser() userId: string,
    @Param('mealId') mealId: string,
    @Body() input: AddFoodLogInput,
    @Query('date') date?: string,
  ): Promise<{ id: string }> {
    const foodLogRepo = new PrismaFoodLogRepository();
    const dailyScoreRepo = new PrismaDailyScoreRepository();
    const useCase = new AddFoodLogUseCase(foodLogRepo, dailyScoreRepo);
    const id = await useCase.execute(
      userId,
      mealId,
      date ?? new Date().toISOString().slice(0, 10),
      input,
    );
    return { id };
  }

  @Delete(':mealId/foods/:logId')
  async removeFoodLog(
    @CurrentUser() userId: string,
    @Param('logId') logId: string,
    @Query('date') date?: string,
  ): Promise<void> {
    const foodLogRepo = new PrismaFoodLogRepository();
    const dailyScoreRepo = new PrismaDailyScoreRepository();
    const useCase = new RemoveFoodLogUseCase(foodLogRepo, dailyScoreRepo);
    return useCase.execute(userId, logId, date ?? new Date().toISOString().slice(0, 10));
  }

  @Delete(':mealId')
  async deleteMeal(@Param('mealId') mealId: string): Promise<void> {
    const repo = new PrismaMealRepository();
    return repo.delete(mealId);
  }

  @Post('quick-add')
  async quickAdd(
    @CurrentUser() userId: string,
    @Body() input: QuickAddInput,
  ): Promise<{ id: string }> {
    const mealRepo = new PrismaMealRepository();
    const foodLogRepo = new PrismaFoodLogRepository();
    const dailyScoreRepo = new PrismaDailyScoreRepository();
    const useCase = new QuickAddUseCase(mealRepo, foodLogRepo, dailyScoreRepo);
    const id = await useCase.execute(userId, input);
    return { id };
  }
}
