import { Controller, Get, Query } from '@nestjs/common';
import {
  GetDailyScoreUseCase,
  GetWeeklyDiversityUseCase,
  PrismaDailyScoreRepository,
  PrismaDiversityRepository,
  PrismaFoodLogRepository,
} from '@thirty/core';
import type { DailyScoreResponse, WeeklyDiversityResponse } from '@thirty/shared';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('scores')
export class ScoreController {
  @Get('daily')
  async getDailyScore(
    @CurrentUser() userId: string,
    @Query('date') date?: string,
  ): Promise<DailyScoreResponse> {
    const foodLogRepo = new PrismaFoodLogRepository();
    const dailyScoreRepo = new PrismaDailyScoreRepository();
    const useCase = new GetDailyScoreUseCase(foodLogRepo, dailyScoreRepo);
    return useCase.execute(userId, date ?? new Date().toISOString().slice(0, 10));
  }

  @Get('weekly-diversity')
  async getWeeklyDiversity(
    @CurrentUser() userId: string,
    @Query('date') date?: string,
  ): Promise<WeeklyDiversityResponse> {
    const foodLogRepo = new PrismaFoodLogRepository();
    const diversityRepo = new PrismaDiversityRepository();
    const useCase = new GetWeeklyDiversityUseCase(foodLogRepo, diversityRepo);
    return useCase.execute(userId, date ?? new Date().toISOString().slice(0, 10));
  }
}
