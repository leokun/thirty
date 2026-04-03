import type { FavoriteResponse } from '@thirty/shared';
import type { FavoriteRepository } from '../repositories/favorite.repository.js';

export class ListFavoritesUseCase {
  constructor(private readonly favoriteRepo: FavoriteRepository) {}

  async execute(userId: string): Promise<FavoriteResponse[]> {
    return this.favoriteRepo.list(userId);
  }
}
