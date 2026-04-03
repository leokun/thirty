import { useQuery } from '@tanstack/react-query';
import type { FoodResponse, RecentFoodResponse } from '@thirty/shared';
import { queryKeys } from '../lib/constants.js';
import { api } from './client.js';

export function useSearchFoods(query: string) {
  return useQuery({
    queryKey: queryKeys.foods.search(query),
    queryFn: () => api.get<FoodResponse[]>(`/foods/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
  });
}

export function useRecentFoods() {
  return useQuery({
    queryKey: queryKeys.foods.recent(),
    queryFn: () => api.get<RecentFoodResponse[]>('/foods/recent'),
  });
}

export function useFood(id: string) {
  return useQuery({
    queryKey: queryKeys.foods.detail(id),
    queryFn: () => api.get<FoodResponse>(`/foods/${id}`),
    enabled: !!id,
  });
}
