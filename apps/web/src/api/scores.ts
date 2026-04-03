import { useQuery } from '@tanstack/react-query';
import type { DailyScoreResponse, WeeklyDiversityResponse } from '@thirty/shared';
import { queryKeys } from '../lib/constants.js';
import { api } from './client.js';

export function useDailyScore(date: string) {
  return useQuery({
    queryKey: queryKeys.scores.daily(date),
    queryFn: () => api.get<DailyScoreResponse>(`/scores/daily?date=${date}`),
  });
}

export function useWeeklyDiversity(date: string) {
  return useQuery({
    queryKey: queryKeys.scores.weeklyDiversity(date),
    queryFn: () => api.get<WeeklyDiversityResponse>(`/scores/weekly-diversity?date=${date}`),
  });
}
