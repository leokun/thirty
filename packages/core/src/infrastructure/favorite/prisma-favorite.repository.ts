import { prisma } from '@thirty/db';
import type { CreateFavoriteInput, FavoriteResponse } from '@thirty/shared';
import type { FavoriteRepository } from '../../domains/favorite/repositories/favorite.repository.js';

interface FavoriteItem {
  foodId: string;
  preparationMethod: string;
  portionSize?: string;
}

export class PrismaFavoriteRepository implements FavoriteRepository {
  async list(userId: string): Promise<FavoriteResponse[]> {
    const favorites = await prisma.favoriteMeal.findMany({
      where: { userId },
      orderBy: [{ usageCount: 'desc' }, { lastUsedAt: 'desc' }],
    });

    // Resolve food names
    const allFoodIds = favorites.flatMap((f) => (f.items as FavoriteItem[]).map((i) => i.foodId));
    const foods = await prisma.food.findMany({
      where: { id: { in: [...new Set(allFoodIds)] } },
      select: { id: true, nameFr: true },
    });
    const foodMap = new Map(foods.map((f) => [f.id, f.nameFr]));

    return favorites.map((fav) => ({
      id: fav.id,
      name: fav.name,
      ...(fav.moment != null && { moment: fav.moment }),
      items: (fav.items as FavoriteItem[]).map((item) => ({
        foodId: item.foodId,
        foodName: foodMap.get(item.foodId) ?? 'Unknown',
        preparationMethod: item.preparationMethod as any,
        ...(item.portionSize != null && {
          portionSize: item.portionSize as any,
        }),
      })),
      usageCount: fav.usageCount,
    }));
  }

  async create(userId: string, input: CreateFavoriteInput): Promise<string> {
    const fav = await prisma.favoriteMeal.create({
      data: {
        userId,
        name: input.name,
        ...(input.moment !== undefined && { moment: input.moment }),
        items: input.items as any,
      },
    });
    return fav.id;
  }

  async apply(favoriteId: string, userId: string, date: string): Promise<void> {
    const fav = await prisma.favoriteMeal.findUniqueOrThrow({
      where: { id: favoriteId },
    });

    const items = fav.items as FavoriteItem[];
    const profile = await prisma.userProfile.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    // Create meal
    const meal = await prisma.mealEntry.create({
      data: {
        userProfileId: profile.id,
        date: new Date(date),
        ...(fav.moment != null && { moment: fav.moment }),
      },
    });

    // Add all food logs
    await prisma.foodLog.createMany({
      data: items.map((item) => ({
        mealEntryId: meal.id,
        foodId: item.foodId,
        preparationMethod: item.preparationMethod as any,
        ...(item.portionSize != null && {
          portionSize: item.portionSize as any,
        }),
      })),
    });

    // Update usage stats
    await prisma.favoriteMeal.update({
      where: { id: favoriteId },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });
  }

  async delete(favoriteId: string): Promise<void> {
    await prisma.favoriteMeal.delete({ where: { id: favoriteId } });
  }
}
