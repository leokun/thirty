import { prisma } from '@thirty/db';
import type { DailyScoreBreakdown } from '@thirty/shared';
import type { DailyScoreRepository } from '../../domains/journal/repositories/daily-score.repository.js';

export class PrismaDailyScoreRepository implements DailyScoreRepository {
  async save(userId: string, date: string, breakdown: DailyScoreBreakdown): Promise<void> {
    const profile = await prisma.userProfile.findUniqueOrThrow({
      where: { userId },
      select: { id: true },
    });

    await prisma.dailyScore.upsert({
      where: {
        userProfileId_date: {
          userProfileId: profile.id,
          date: new Date(date),
        },
      },
      create: {
        userProfileId: profile.id,
        date: new Date(date),
        totalScore: breakdown.totalScore,
        diversityScore: breakdown.diversityScore,
        fiberPrebioticScore: breakdown.fiberPrebioticScore,
        fermentedScore: breakdown.fermentedScore,
        polyphenolScore: breakdown.polyphenolScore,
        mucosalSupportScore: breakdown.mucosalSupportScore,
        preparationScore: breakdown.preparationScore,
        rollingPlantCount: breakdown.rollingPlantCount,
        rollingTotalFoodCount: breakdown.rollingTotalFoodCount,
        trend: breakdown.trend,
      },
      update: {
        totalScore: breakdown.totalScore,
        diversityScore: breakdown.diversityScore,
        fiberPrebioticScore: breakdown.fiberPrebioticScore,
        fermentedScore: breakdown.fermentedScore,
        polyphenolScore: breakdown.polyphenolScore,
        mucosalSupportScore: breakdown.mucosalSupportScore,
        preparationScore: breakdown.preparationScore,
        rollingPlantCount: breakdown.rollingPlantCount,
        rollingTotalFoodCount: breakdown.rollingTotalFoodCount,
        trend: breakdown.trend,
      },
    });
  }

  async get(userId: string, date: string): Promise<DailyScoreBreakdown | null> {
    const score = await prisma.dailyScore.findFirst({
      where: {
        userProfile: { userId },
        date: new Date(date),
      },
    });

    if (!score) return null;

    return {
      totalScore: score.totalScore,
      diversityScore: score.diversityScore,
      fiberPrebioticScore: score.fiberPrebioticScore,
      fermentedScore: score.fermentedScore,
      polyphenolScore: score.polyphenolScore,
      mucosalSupportScore: score.mucosalSupportScore,
      preparationScore: score.preparationScore,
      rollingPlantCount: score.rollingPlantCount,
      rollingTotalFoodCount: score.rollingTotalFoodCount,
      trend: score.trend,
    };
  }

  async getPreviousScore(userId: string, beforeDate: string): Promise<number | null> {
    const score = await prisma.dailyScore.findFirst({
      where: {
        userProfile: { userId },
        date: { lt: new Date(beforeDate) },
      },
      orderBy: { date: 'desc' },
      select: { totalScore: true },
    });

    return score?.totalScore ?? null;
  }
}
