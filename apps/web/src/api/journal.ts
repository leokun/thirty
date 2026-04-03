import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AddFoodLogInput, CreateMealInput, DayResponse, QuickAddInput } from '@thirty/shared';
import { queryKeys } from '../lib/constants.js';
import { api } from './client.js';

export function useDayJournal(date: string) {
  return useQuery({
    queryKey: queryKeys.journal.day(date),
    queryFn: () => api.get<DayResponse>(`/meals?date=${date}`),
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMealInput) => api.post<{ id: string }>('/meals', input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journal.day(variables.date),
      });
    },
  });
}

export function useAddFoodLog(mealId: string, date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddFoodLogInput) =>
      api.post<{ id: string }>(`/meals/${mealId}/foods`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journal.day(date),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.scores.daily(date),
      });
    },
  });
}

export function useDeleteFoodLog(mealId: string, date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logId: string) => api.delete<void>(`/meals/${mealId}/foods/${logId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journal.day(date),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.scores.daily(date),
      });
    },
  });
}

export function useQuickAdd() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: QuickAddInput) => api.post<{ id: string }>('/meals/quick-add', input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.journal.day(variables.date),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.scores.daily(variables.date),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.foods.recent(),
      });
    },
  });
}
