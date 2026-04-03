import type { FavoriteRepository } from '../repositories/favorite.repository.js';

export class ApplyFavoriteUseCase {
  constructor(private readonly favoriteRepo: FavoriteRepository) {}

  async execute(favoriteId: string, userId: string, date: string): Promise<void> {
    return this.favoriteRepo.apply(favoriteId, userId, date);
  }
}
