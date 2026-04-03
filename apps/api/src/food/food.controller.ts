import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  GetFoodUseCase,
  GetRecentFoodsUseCase,
  PrismaFoodRepository,
  SearchFoodsUseCase,
} from '@thirty/core';
import type { FoodResponse, RecentFoodResponse, SearchFoodQuery } from '@thirty/shared';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('foods')
export class FoodController {
  @Get('search')
  async search(@Query() query: SearchFoodQuery): Promise<FoodResponse[]> {
    const repo = new PrismaFoodRepository();
    const useCase = new SearchFoodsUseCase(repo);
    return useCase.execute(query.q, {
      ...(query.category !== undefined && { category: query.category }),
      ...(query.limit !== undefined && { limit: query.limit }),
    });
  }

  @Get('recent')
  async recent(@CurrentUser() userId: string): Promise<RecentFoodResponse[]> {
    const repo = new PrismaFoodRepository();
    const useCase = new GetRecentFoodsUseCase(repo);
    return useCase.execute(userId);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<FoodResponse | null> {
    const repo = new PrismaFoodRepository();
    const useCase = new GetFoodUseCase(repo);
    return useCase.execute(id);
  }
}
