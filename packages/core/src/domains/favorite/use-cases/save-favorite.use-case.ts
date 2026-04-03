import type { CreateFavoriteInput } from '@thirty/shared';
import type { FavoriteRepository } from '../repositories/favorite.repository.js';

export class SaveFavoriteUseCase {
  constructor(private readonly favoriteRepo: FavoriteRepository) {}

  async execute(userId: string, input: CreateFavoriteInput): Promise<string> {
    return this.favoriteRepo.create(userId, input);
  }
}
