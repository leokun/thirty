import { Trend } from '@thirty/shared';
import { describe, expect, it } from 'vitest';
import { InMemoryDailyScoreRepository } from '../../../infrastructure/journal/in-memory-daily-score.repository.js';
import { GetScoreHistoryUseCase } from './get-score-history.use-case.js';

const BASE_BREAKDOWN = {
  totalScore: 0,
  diversityScore: 0,
  fiberPrebioticScore: 0,
  fermentedScore: 0,
  polyphenolScore: 0,
  mucosalSupportScore: 0,
  preparationScore: 0,
  rollingPlantCount: 0,
  rollingTotalFoodCount: 0,
  trend: Trend.STABLE,
};

describe('GetScoreHistoryUseCase', () => {
  it('retourne les scores sur 7 jours par défaut', async () => {
    const repo = new InMemoryDailyScoreRepository();
    repo.seed('user-1', '2026-04-10', { ...BASE_BREAKDOWN, totalScore: 40 });
    repo.seed('user-1', '2026-04-12', { ...BASE_BREAKDOWN, totalScore: 55 });
    repo.seed('user-1', '2026-04-14', { ...BASE_BREAKDOWN, totalScore: 70 });
    repo.seed('user-1', '2026-04-16', { ...BASE_BREAKDOWN, totalScore: 80 });

    const useCase = new GetScoreHistoryUseCase(repo);
    const result = await useCase.execute('user-1', '2026-04-16');

    expect(result).toHaveLength(4);
    expect(result[0]).toEqual({ date: '2026-04-10', totalScore: 40 });
    expect(result[3]).toEqual({ date: '2026-04-16', totalScore: 80 });
  });

  it('exclut les scores hors de la fenêtre', async () => {
    const repo = new InMemoryDailyScoreRepository();
    repo.seed('user-1', '2026-04-01', { ...BASE_BREAKDOWN, totalScore: 30 }); // hors fenêtre
    repo.seed('user-1', '2026-04-14', { ...BASE_BREAKDOWN, totalScore: 60 });

    const useCase = new GetScoreHistoryUseCase(repo);
    const result = await useCase.execute('user-1', '2026-04-16');

    expect(result).toHaveLength(1);
    expect(result[0]?.totalScore).toBe(60);
  });

  it('retourne un tableau vide si aucun score', async () => {
    const repo = new InMemoryDailyScoreRepository();
    const useCase = new GetScoreHistoryUseCase(repo);
    const result = await useCase.execute('user-1', '2026-04-16');
    expect(result).toEqual([]);
  });

  it('respecte le paramètre days', async () => {
    const repo = new InMemoryDailyScoreRepository();
    repo.seed('user-1', '2026-04-14', { ...BASE_BREAKDOWN, totalScore: 50 });
    repo.seed('user-1', '2026-04-15', { ...BASE_BREAKDOWN, totalScore: 60 });
    repo.seed('user-1', '2026-04-16', { ...BASE_BREAKDOWN, totalScore: 70 });

    const useCase = new GetScoreHistoryUseCase(repo);
    const result = await useCase.execute('user-1', '2026-04-16', 2);

    expect(result).toHaveLength(2);
    expect(result[0]?.date).toBe('2026-04-15');
    expect(result[1]?.date).toBe('2026-04-16');
  });

  it('n\'inclut pas les scores d\'autres utilisateurs', async () => {
    const repo = new InMemoryDailyScoreRepository();
    repo.seed('user-1', '2026-04-16', { ...BASE_BREAKDOWN, totalScore: 80 });
    repo.seed('user-2', '2026-04-16', { ...BASE_BREAKDOWN, totalScore: 50 });

    const useCase = new GetScoreHistoryUseCase(repo);
    const result = await useCase.execute('user-1', '2026-04-16');

    expect(result).toHaveLength(1);
    expect(result[0]?.totalScore).toBe(80);
  });
});
