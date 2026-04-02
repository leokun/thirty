export interface DiversityRepository {
  getPreviousPlantCount(userId: string, beforeDate: string): Promise<number | undefined>;
}
