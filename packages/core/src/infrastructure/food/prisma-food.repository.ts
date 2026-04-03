import { prisma } from '@thirty/db';
import type { FoodResponse, RecentFoodResponse } from '@thirty/shared';
import type { FoodRepository } from '../../domains/food/repositories/food.repository.js';

export class PrismaFoodRepository implements FoodRepository {
  async search(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<FoodResponse[]> {
    const foods = await prisma.food.findMany({
      where: {
        OR: [
          { nameFr: { contains: query, mode: 'insensitive' } },
          { nameEn: { contains: query, mode: 'insensitive' } },
          { synonyms: { has: query.toLowerCase() } },
        ],
        ...(options?.category && { category: options.category as any }),
      },
      take: options?.limit ?? 20,
      orderBy: { nameFr: 'asc' },
    });

    return foods.map((food) => ({
      id: food.id,
      nameFr: food.nameFr,
      ...(food.nameEn != null && { nameEn: food.nameEn }),
      category: food.category,
      isPlant: food.isPlant,
      availablePreparations: [...food.availablePreparations],
      defaultPreparation: food.defaultPreparation,
      baseProfile: {
        solubleFiberScore: food.solubleFiberScore,
        insolubleFiberScore: food.insolubleFiberScore,
        prebioticScore: food.prebioticScore,
        polyphenolScore: food.polyphenolScore,
        isFermented: food.isFermented,
        probioticsScore: food.probioticsScore,
        omega3Score: food.omega3Score,
        mucosalSupportScore: food.mucosalSupportScore,
      },
      seasonMonths: [...food.seasonMonths],
      tags: [...food.tags],
    }));
  }

  async getById(id: string): Promise<FoodResponse | null> {
    const food = await prisma.food.findUnique({ where: { id } });
    if (!food) return null;

    return {
      id: food.id,
      nameFr: food.nameFr,
      ...(food.nameEn != null && { nameEn: food.nameEn }),
      category: food.category,
      isPlant: food.isPlant,
      availablePreparations: [...food.availablePreparations],
      defaultPreparation: food.defaultPreparation,
      baseProfile: {
        solubleFiberScore: food.solubleFiberScore,
        insolubleFiberScore: food.insolubleFiberScore,
        prebioticScore: food.prebioticScore,
        polyphenolScore: food.polyphenolScore,
        isFermented: food.isFermented,
        probioticsScore: food.probioticsScore,
        omega3Score: food.omega3Score,
        mucosalSupportScore: food.mucosalSupportScore,
      },
      seasonMonths: [...food.seasonMonths],
      tags: [...food.tags],
    };
  }

  async getRecent(userId: string, limit: number): Promise<RecentFoodResponse[]> {
    // Get recent food logs grouped by foodId
    const result = await prisma.foodLog.groupBy({
      by: ['foodId'],
      where: {
        mealEntry: {
          userProfile: { userId },
        },
      },
      _count: { foodId: true },
      _max: { createdAt: true },
      orderBy: { _max: { createdAt: 'desc' } },
      take: limit,
    });

    if (result.length === 0) return [];

    const foodIds = result.map((r) => r.foodId);
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds } },
      select: { id: true, nameFr: true, category: true },
    });

    const foodMap = new Map(foods.map((f) => [f.id, f]));

    return result
      .map((r) => {
        const food = foodMap.get(r.foodId);
        if (!food) return null;
        return {
          foodId: r.foodId,
          nameFr: food.nameFr,
          category: food.category,
          lastUsed: r._max.createdAt?.toISOString().slice(0, 10) ?? '',
          useCount: r._count.foodId,
        };
      })
      .filter((r): r is RecentFoodResponse => r !== null);
  }
}
