import { Controller, Get, Query } from '@nestjs/common';
import {
  GetDailyScoreUseCase,
  GetScoreHistoryUseCase,
  GetWeeklyDiversityUseCase,
  PrismaDailyScoreRepository,
  PrismaDiversityRepository,
  PrismaFoodLogRepository,
} from '@thirty/core';
import type {
  DailyScoreResponse,
  ScoreHistoryResponse,
  WeeklyDiversityResponse,
} from '@thirty/shared';
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

  @Get('history')
  async getScoreHistory(
    @CurrentUser() userId: string,
    @Query('date') date?: string,
    @Query('days') days?: string,
  ): Promise<ScoreHistoryResponse> {
    const dailyScoreRepo = new PrismaDailyScoreRepository();
    const useCase = new GetScoreHistoryUseCase(dailyScoreRepo);
    return useCase.execute(
      userId,
      date ?? new Date().toISOString().slice(0, 10),
      days ? parseInt(days, 10) : 7,
    );
  }
}
