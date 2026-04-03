import type { CreateFavoriteInput, FavoriteResponse } from '@thirty/shared';
import type { FavoriteRepository } from '../../domains/favorite/repositories/favorite.repository.js';

export class InMemoryFavoriteRepository implements FavoriteRepository {
  private favorites = new Map<string, FavoriteResponse & { userId: string }>();
  private nextId = 1;

  async list(userId: string): Promise<FavoriteResponse[]> {
    const results: FavoriteResponse[] = [];
    for (const fav of this.favorites.values()) {
      if (fav.userId === userId) {
        const { userId: _, ...rest } = fav;
        results.push(rest);
      }
    }
    return results.sort((a, b) => b.usageCount - a.usageCount);
  }

  async create(userId: string, input: CreateFavoriteInput): Promise<string> {
    const id = `fav-${this.nextId++}`;
    this.favorites.set(id, {
      id,
      userId,
      name: input.name,
      ...(input.moment !== undefined && { moment: input.moment }),
      items: input.items.map((item) => ({
        foodId: item.foodId,
        foodName: '',
        preparationMethod: item.preparationMethod,
        ...(item.portionSize !== undefined && {
          portionSize: item.portionSize,
        }),
      })),
      usageCount: 0,
    });
    return id;
  }

  async apply(_favoriteId: string, _userId: string, _date: string): Promise<void> {
    const fav = this.favorites.get(_favoriteId);
    if (fav) {
      this.favorites.set(_favoriteId, {
        ...fav,
        usageCount: fav.usageCount + 1,
      });
    }
  }

  async delete(favoriteId: string): Promise<void> {
    this.favorites.delete(favoriteId);
  }

  clear(): void {
    this.favorites.clear();
    this.nextId = 1;
  }
}
