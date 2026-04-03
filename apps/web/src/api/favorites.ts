import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateFavoriteInput, FavoriteResponse } from '@thirty/shared';
import { queryKeys } from '../lib/constants.js';
import { api } from './client.js';

export function useFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites.list(),
    queryFn: () => api.get<FavoriteResponse[]>('/favorites'),
  });
}

export function useCreateFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFavoriteInput) => api.post<{ id: string }>('/favorites', input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites.list(),
      });
    },
  });
}

export function useApplyFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      api.post<void>(`/favorites/${id}/apply`, { date }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journal.day(variables.date),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.scores.daily(variables.date),
      });
    },
  });
}

export function useDeleteFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/favorites/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites.list(),
      });
    },
  });
}
