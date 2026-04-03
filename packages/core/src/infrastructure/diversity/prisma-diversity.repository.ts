import { prisma } from '@thirty/db';
import type { DiversityRepository } from '../../domains/diversity/repositories/diversity.repository.js';

export class PrismaDiversityRepository implements DiversityRepository {
  async getPreviousPlantCount(userId: string, beforeDate: string): Promise<number | undefined> {
    const score = await prisma.dailyScore.findFirst({
      where: {
        userProfile: { userId },
        date: { lt: new Date(beforeDate) },
      },
      orderBy: { date: 'desc' },
      select: { rollingPlantCount: true },
    });

    return score?.rollingPlantCount ?? undefined;
  }
}
