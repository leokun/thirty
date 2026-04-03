import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApplyFavoriteUseCase,
  DeleteFavoriteUseCase,
  ListFavoritesUseCase,
  PrismaFavoriteRepository,
  SaveFavoriteUseCase,
} from '@thirty/core';
import type { CreateFavoriteInput, FavoriteResponse } from '@thirty/shared';
import { CurrentUser } from '../common/current-user.decorator';

@Controller('favorites')
export class FavoriteController {
  @Get()
  async list(@CurrentUser() userId: string): Promise<FavoriteResponse[]> {
    const repo = new PrismaFavoriteRepository();
    const useCase = new ListFavoritesUseCase(repo);
    return useCase.execute(userId);
  }

  @Post()
  async save(
    @CurrentUser() userId: string,
    @Body() input: CreateFavoriteInput,
  ): Promise<{ id: string }> {
    const repo = new PrismaFavoriteRepository();
    const useCase = new SaveFavoriteUseCase(repo);
    const id = await useCase.execute(userId, input);
    return { id };
  }

  @Post(':id/apply')
  async apply(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body('date') date: string,
  ): Promise<void> {
    const repo = new PrismaFavoriteRepository();
    const useCase = new ApplyFavoriteUseCase(repo);
    return useCase.execute(id, userId, date);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const repo = new PrismaFavoriteRepository();
    const useCase = new DeleteFavoriteUseCase(repo);
    return useCase.execute(id);
  }
}
