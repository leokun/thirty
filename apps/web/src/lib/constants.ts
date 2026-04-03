export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const queryKeys = {
  foods: {
    search: (q: string) => ['foods', 'search', q] as const,
    recent: () => ['foods', 'recent'] as const,
    detail: (id: string) => ['foods', id] as const,
  },
  journal: {
    day: (date: string) => ['journal', 'day', date] as const,
  },
  scores: {
    daily: (date: string) => ['scores', 'daily', date] as const,
    weeklyDiversity: (date: string) => ['scores', 'weekly-diversity', date] as const,
  },
  favorites: {
    list: () => ['favorites'] as const,
  },
} as const;
