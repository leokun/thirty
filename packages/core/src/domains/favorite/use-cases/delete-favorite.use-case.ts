import type { FavoriteRepository } from '../repositories/favorite.repository.js';

export class DeleteFavoriteUseCase {
  constructor(private readonly favoriteRepo: FavoriteRepository) {}

  async execute(favoriteId: string): Promise<void> {
    return this.favoriteRepo.delete(favoriteId);
  }
}
