import type { DiversityRepository } from '../../domains/diversity/repositories/diversity.repository.js';

export class InMemoryDiversityRepository implements DiversityRepository {
  private plantCounts = new Map<string, number>();

  async getPreviousPlantCount(userId: string, beforeDate: string): Promise<number | undefined> {
    const key = `${userId}:${beforeDate}`;
    return this.plantCounts.get(key);
  }

  seed(userId: string, beforeDate: string, count: number): void {
    this.plantCounts.set(`${userId}:${beforeDate}`, count);
  }

  clear(): void {
    this.plantCounts.clear();
  }
}
