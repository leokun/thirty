import { z } from 'zod';

const score0to5 = z.number().min(0).max(5);
const month = z.number().int().min(1).max(12);

export const foodDefinitionSchema = z.object({
  nameFr: z.string().min(1),
  nameEn: z.string().optional(),
  category: z.string(),
  isPlant: z.boolean(),
  solubleFiberScore: score0to5,
  insolubleFiberScore: score0to5,
  prebioticScore: score0to5,
  polyphenolScore: score0to5,
  isFermented: z.boolean(),
  probioticsScore: score0to5,
  omega3Score: score0to5,
  mucosalSupportScore: score0to5,
  seasonMonths: z.array(month),
  synonyms: z.array(z.string()),
  tags: z.array(z.string()),
  sources: z.array(z.string()),
  availablePreparations: z.array(z.string()).min(1),
  defaultPreparation: z.string(),
  preparationOverrides: z
    .record(
      z.object({
        fiberFactor: z.number().optional(),
        prebioticFactor: z.number().optional(),
        polyphenolFactor: z.number().optional(),
        probioticsFactor: z.number().optional(),
        microbiomeBonus: z.number().optional(),
        overrideProfile: z
          .record(z.union([z.number(), z.boolean()]))
          .optional(),
      }),
    )
    .optional(),
});

export function validateFoods(foods: unknown[]): void {
  for (const [i, food] of foods.entries()) {
    const result = foodDefinitionSchema.safeParse(food);
    if (!result.success) {
      throw new Error(`Food #${i} validation failed: ${result.error.message}`);
    }
  }
}
