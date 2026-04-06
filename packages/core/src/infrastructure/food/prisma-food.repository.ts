import {
  type Food as FoodRow,
  type FoodCategory as PgFoodCategory,
  type PreparationMethod as PgPreparationMethod,
  Prisma,
  prisma,
} from '@thirty/db';
import type { CreateUserFoodInput, FoodResponse, RecentFoodResponse } from '@thirty/shared';
import { PreparationMethod } from '@thirty/shared';
import type { FoodRepository } from '../../domains/food/repositories/food.repository.js';
import {
  defaultMicrobiomeProfileForCategory,
  isPlantCategory,
} from '../../domains/food/services/default-user-food-profile.service.js';

const ALL_PREPARATIONS = Object.values(PreparationMethod);

export class PrismaFoodRepository implements FoodRepository {
  async search(
    query: string,
    options?: { category?: string; limit?: number },
  ): Promise<FoodResponse[]> {
    const trimmed = query.trim();
    if (trimmed.length === 0) return [];

    const limit = options?.limit ?? 20;

    try {
      if (trimmed.length >= 2) {
        const trgmIds = await this.searchTrgmIds(trimmed, options?.category, limit);
        const synonymIds = await this.searchSynonymIds(trimmed, options?.category, limit);
        const merged = mergeDistinctOrder(trgmIds, synonymIds).slice(0, limit);
        if (merged.length > 0) {
          return this.hydrateFoodsOrdered(merged);
        }
      }
    } catch {
      // e.g. pg_trgm not enabled — fall back to ILIKE
    }

    return this.searchContains(trimmed, options);
  }

  private async searchTrgmIds(
    q: string,
    category: string | undefined,
    limit: number,
  ): Promise<string[]> {
    const categoryFilter =
      category != null ? Prisma.sql`AND category = ${category}::"FoodCategory"` : Prisma.empty;

    const rows = await prisma.$queryRaw<{ id: string }[]>(
      Prisma.sql`
        SELECT id
        FROM foods
        WHERE (
          "nameFr" % ${q}
          OR "nameEn" % ${q}
        )
        ${categoryFilter}
        ORDER BY GREATEST(
          similarity("nameFr", ${q}),
          similarity("nameEn", ${q})
        ) DESC
        LIMIT ${limit}
      `,
    );
    return (rows as { id: string }[]).map((r) => r.id);
  }

  private async searchSynonymIds(
    q: string,
    category: string | undefined,
    limit: number,
  ): Promise<string[]> {
    const foods = await prisma.food.findMany({
      where: {
        synonyms: { has: q.toLowerCase() },
        ...(category != null && { category: category as PgFoodCategory }),
      },
      select: { id: true },
      take: limit,
      orderBy: { nameFr: 'asc' },
    });
    return (foods as { id: string }[]).map((f) => f.id);
  }

  private async searchContains(
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
        ...(options?.category && { category: options.category as PgFoodCategory }),
      },
      take: options?.limit ?? 20,
      orderBy: { nameFr: 'asc' },
    });

    return (foods as FoodRow[]).map((f) => this.mapFood(f));
  }

  private async hydrateFoodsOrdered(orderedIds: string[]): Promise<FoodResponse[]> {
    if (orderedIds.length === 0) return [];
    const foods = (await prisma.food.findMany({
      where: { id: { in: orderedIds } },
    })) as FoodRow[];
    const map = new Map(foods.map((f) => [f.id, f] as [string, FoodRow]));
    return orderedIds.flatMap((id) => {
      const f = map.get(id);
      return f ? [this.mapFood(f)] : [];
    });
  }

  async getById(id: string): Promise<FoodResponse | null> {
    const food = await prisma.food.findUnique({ where: { id } });
    if (!food) return null;
    return this.mapFood(food);
  }

  async createUserFood(userId: string, input: CreateUserFoodInput): Promise<string> {
    const nameFr = input.nameFr.trim();
    const existing = await prisma.food.findFirst({
      where: {
        isUserCreated: true,
        createdByUserId: userId,
        nameFr: { equals: nameFr, mode: 'insensitive' },
      },
    });
    if (existing) return existing.id;

    const p = defaultMicrobiomeProfileForCategory(input.category);

    const created = await prisma.food.create({
      data: {
        nameFr,
        nameEn: nameFr,
        category: input.category as PgFoodCategory,
        isPlant: isPlantCategory(input.category),
        solubleFiberScore: p.solubleFiberScore,
        insolubleFiberScore: p.insolubleFiberScore,
        prebioticScore: p.prebioticScore,
        polyphenolScore: p.polyphenolScore,
        isFermented: p.isFermented,
        probioticsScore: p.probioticsScore,
        omega3Score: p.omega3Score,
        mucosalSupportScore: p.mucosalSupportScore,
        seasonMonths: [],
        synonyms: [],
        tags: ['user-created'],
        sources: [],
        availablePreparations: [...ALL_PREPARATIONS] as PgPreparationMethod[],
        defaultPreparation: PreparationMethod.RAW,
        isUserCreated: true,
        createdByUserId: userId,
      },
    });

    return created.id;
  }

  async getRecent(userId: string, limit: number): Promise<RecentFoodResponse[]> {
    type GroupRow = {
      foodId: string;
      _count: { foodId: number };
      _max: { createdAt: Date | null };
    };
    type MiniFood = { id: string; nameFr: string; category: PgFoodCategory };

    const result = (await prisma.foodLog.groupBy({
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
    })) as GroupRow[];

    if (result.length === 0) return [];

    const foodIds = result.map((r) => r.foodId);
    const foods = (await prisma.food.findMany({
      where: { id: { in: foodIds } },
      select: { id: true, nameFr: true, category: true },
    })) as MiniFood[];

    const foodMap = new Map<string, MiniFood>(foods.map((f) => [f.id, f]));

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

  private mapFood(food: FoodRow): FoodResponse {
    return {
      id: food.id,
      nameFr: food.nameFr,
      nameEn: food.nameEn,
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
}

function mergeDistinctOrder(primary: string[], secondary: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of primary) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  for (const id of secondary) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}
