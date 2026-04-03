import type { CreateFavoriteInput, FavoriteResponse } from '@thirty/shared';

export interface FavoriteRepository {
  list(userId: string): Promise<FavoriteResponse[]>;
  create(userId: string, input: CreateFavoriteInput): Promise<string>;
  apply(favoriteId: string, userId: string, date: string): Promise<void>;
  delete(favoriteId: string): Promise<void>;
}
