import type {
  PortionSize as PgPortionSize,
  PreparationMethod as PgPreparationMethod,
  Prisma,
} from '@thirty/db';
import { prisma } from '@thirty/db';
import {
  type CreateFavoriteInput,
  type FavoriteResponse,
  MealMoment,
  type PortionSize,
  type PreparationMethod,
} from '@thirty/shared';
import type { FavoriteRepository } from '../../domains/favorite/repositories/favorite.repository.js';

interface FavoriteItem {
  foodId: string;
  preparationMethod: string;
  portionSize?: string;
}

type FavoriteRow = {
  id: string;
  name: string;
  moment: MealMoment | null;
  items: unknown;
  usageCount: number;
  lastUsedAt: Date;
};

export class PrismaFavoriteRepository implements FavoriteRepository {
  async list(userId: string): Promise<FavoriteResponse[]> {
    const favorites = (await prisma.favoriteMeal.findMany({
      where: { userId },
      orderBy: [{ usageCount: 'desc' }, { lastUsedAt: 'desc' }],
    })) as FavoriteRow[];

    // Resolve food names
    const allFoodIds = favorites.flatMap((f) => (f.items as FavoriteItem[]).map((i) => i.foodId));
    const foods = (await prisma.food.findMany({
      where: { id: { in: [...new Set(allFoodIds)] } },
      select: { id: true, nameFr: true },
    })) as { id: string; nameFr: string }[];
    const foodMap = new Map(foods.map((f) => [f.id, f.nameFr] as [string, string]));

    return favorites.map(
      (fav): FavoriteResponse => ({
        id: fav.id,
        name: fav.name,
        ...(fav.moment != null ? { moment: fav.moment } : {}),
        items: (fav.items as FavoriteItem[]).map((item) => ({
          foodId: item.foodId,
          foodName: foodMap.get(item.foodId) ?? 'Unknown',
          preparationMethod: item.preparationMethod as PreparationMethod,
          ...(item.portionSize != null && {
            portionSize: item.portionSize as PortionSize,
          }),
        })),
        usageCount: fav.usageCount,
      }),
    );
  }

  async create(userId: string, input: CreateFavoriteInput): Promise<string> {
    const fav = await prisma.favoriteMeal.create({
      data: {
        userId,
        name: input.name,
        ...(input.moment !== undefined && { moment: input.moment }),
        items: input.items as Prisma.InputJsonValue,
      },
    });
    return fav.id;
  }

  async apply(favoriteId: string, userId: string, date: string): Promise<void> {
    const fav = await prisma.favoriteMeal.findUniqueOrThrow({
      where: { id: favoriteId },
    });

    const items = fav.items as FavoriteItem[];
    const profile = (await prisma.userProfile.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    })) as { id: string };

    // Create meal
    const meal = await prisma.mealEntry.create({
      data: {
        userProfileId: profile.id,
        date: new Date(date),
        moment: fav.moment != null ? fav.moment : MealMoment.LUNCH,
      },
    });

    // Add all food logs
    await prisma.foodLog.createMany({
      data: items.map((item) => ({
        mealEntryId: meal.id,
        foodId: item.foodId,
        preparationMethod: item.preparationMethod as PgPreparationMethod,
        ...(item.portionSize != null && {
          portionSize: item.portionSize as PgPortionSize,
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
