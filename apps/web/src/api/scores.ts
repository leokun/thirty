import { useQuery } from '@tanstack/react-query';
import type { DailyScoreResponse, ScoreHistoryResponse, WeeklyDiversityResponse } from '@thirty/shared';
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

export function useScoreHistory(date: string, days = 7) {
  return useQuery({
    queryKey: queryKeys.scores.history(date, days),
    queryFn: () => api.get<ScoreHistoryResponse>(`/scores/history?date=${date}&days=${days}`),
  });
}
