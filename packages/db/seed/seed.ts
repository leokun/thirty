// =============================================================================
// Thirty - Database Seed Script
// =============================================================================
// Upserts curated foods, preparation modifiers, and a dev user profile.
// Run with: pnpm db:seed (via tsx seed/seed.ts)
// =============================================================================

import 'dotenv/config';
import { prisma } from '../src/client.js';
import { foods } from './data/index.js';
import { validateFoods } from './validate.js';

// Default preparation factors per method (ADR-005)
const PREPARATION_DEFAULTS: Record<
  string,
  {
    fiberFactor: number;
    prebioticFactor: number;
    polyphenolFactor: number;
    probioticsFactor: number;
    microbiomeBonus: number;
  }
> = {
  RAW: {
    fiberFactor: 1.0,
    prebioticFactor: 1.0,
    polyphenolFactor: 1.0,
    probioticsFactor: 1.0,
    microbiomeBonus: 0.5,
  },
  STEAMED: {
    fiberFactor: 0.95,
    prebioticFactor: 0.9,
    polyphenolFactor: 0.85,
    probioticsFactor: 1.0,
    microbiomeBonus: 0.3,
  },
  BOILED: {
    fiberFactor: 0.8,
    prebioticFactor: 0.75,
    polyphenolFactor: 0.7,
    probioticsFactor: 0.5,
    microbiomeBonus: 0,
  },
  ROASTED: {
    fiberFactor: 0.9,
    prebioticFactor: 0.85,
    polyphenolFactor: 0.8,
    probioticsFactor: 0.3,
    microbiomeBonus: 0.2,
  },
  FRIED: {
    fiberFactor: 0.7,
    prebioticFactor: 0.6,
    polyphenolFactor: 0.5,
    probioticsFactor: 0.1,
    microbiomeBonus: -1.5,
  },
  FERMENTED: {
    fiberFactor: 0.9,
    prebioticFactor: 1.1,
    polyphenolFactor: 1.0,
    probioticsFactor: 2.0,
    microbiomeBonus: 3,
  },
  LACTOFERMENTED: {
    fiberFactor: 0.9,
    prebioticFactor: 1.2,
    polyphenolFactor: 1.0,
    probioticsFactor: 2.5,
    microbiomeBonus: 4,
  },
  SPROUTED: {
    fiberFactor: 1.1,
    prebioticFactor: 1.3,
    polyphenolFactor: 1.1,
    probioticsFactor: 1.0,
    microbiomeBonus: 2,
  },
  SOAKED: {
    fiberFactor: 1.0,
    prebioticFactor: 1.1,
    polyphenolFactor: 0.95,
    probioticsFactor: 1.0,
    microbiomeBonus: 0.5,
  },
  DRIED: {
    fiberFactor: 1.2,
    prebioticFactor: 1.0,
    polyphenolFactor: 0.9,
    probioticsFactor: 0.3,
    microbiomeBonus: 0,
  },
  AGED: {
    fiberFactor: 1.0,
    prebioticFactor: 1.0,
    polyphenolFactor: 1.0,
    probioticsFactor: 1.5,
    microbiomeBonus: 2,
  },
  SMOKED: {
    fiberFactor: 0.8,
    prebioticFactor: 0.7,
    polyphenolFactor: 0.6,
    probioticsFactor: 0.2,
    microbiomeBonus: -1,
  },
};

async function seed() {
  console.log('Validating food definitions...');
  validateFoods(foods);
  console.log(`Validated ${foods.length} foods.`);

  let foodCount = 0;
  let modifierCount = 0;

  for (const food of foods) {
    // Upsert food
    const upsertedFood = await prisma.food.upsert({
      where: { id: `seed-${food.nameFr.toLowerCase().replace(/\s+/g, '-')}` },
      create: {
        id: `seed-${food.nameFr.toLowerCase().replace(/\s+/g, '-')}`,
        nameFr: food.nameFr,
        nameEn: food.nameEn,
        category: food.category,
        isPlant: food.isPlant,
        solubleFiberScore: food.solubleFiberScore,
        insolubleFiberScore: food.insolubleFiberScore,
        prebioticScore: food.prebioticScore,
        polyphenolScore: food.polyphenolScore,
        isFermented: food.isFermented,
        probioticsScore: food.probioticsScore,
        omega3Score: food.omega3Score,
        mucosalSupportScore: food.mucosalSupportScore,
        seasonMonths: food.seasonMonths,
        synonyms: food.synonyms,
        tags: food.tags,
        sources: food.sources,
        availablePreparations: food.availablePreparations,
        defaultPreparation: food.defaultPreparation,
      },
      update: {
        nameEn: food.nameEn,
        category: food.category,
        isPlant: food.isPlant,
        solubleFiberScore: food.solubleFiberScore,
        insolubleFiberScore: food.insolubleFiberScore,
        prebioticScore: food.prebioticScore,
        polyphenolScore: food.polyphenolScore,
        isFermented: food.isFermented,
        probioticsScore: food.probioticsScore,
        omega3Score: food.omega3Score,
        mucosalSupportScore: food.mucosalSupportScore,
        seasonMonths: food.seasonMonths,
        synonyms: food.synonyms,
        tags: food.tags,
        sources: food.sources,
        availablePreparations: food.availablePreparations,
        defaultPreparation: food.defaultPreparation,
      },
    });
    foodCount++;

    // Create preparation modifiers for each available preparation
    for (const method of food.availablePreparations) {
      const defaults = PREPARATION_DEFAULTS[method];
      if (!defaults) {
        console.warn(`No defaults for preparation method: ${method}`);
        continue;
      }

      const override = food.preparationOverrides?.[method];

      await prisma.preparationModifier.upsert({
        where: {
          foodId_method: {
            foodId: upsertedFood.id,
            method,
          },
        },
        create: {
          foodId: upsertedFood.id,
          method,
          fiberFactor: override?.fiberFactor ?? defaults.fiberFactor,
          prebioticFactor: override?.prebioticFactor ?? defaults.prebioticFactor,
          polyphenolFactor: override?.polyphenolFactor ?? defaults.polyphenolFactor,
          probioticsFactor: override?.probioticsFactor ?? defaults.probioticsFactor,
          microbiomeBonus: override?.microbiomeBonus ?? defaults.microbiomeBonus,
          overrideProfile: override?.overrideProfile ?? undefined,
        },
        update: {
          fiberFactor: override?.fiberFactor ?? defaults.fiberFactor,
          prebioticFactor: override?.prebioticFactor ?? defaults.prebioticFactor,
          polyphenolFactor: override?.polyphenolFactor ?? defaults.polyphenolFactor,
          probioticsFactor: override?.probioticsFactor ?? defaults.probioticsFactor,
          microbiomeBonus: override?.microbiomeBonus ?? defaults.microbiomeBonus,
          overrideProfile: override?.overrideProfile ?? undefined,
        },
      });
      modifierCount++;
    }
  }

  // Create dev user profile
  await prisma.userProfile.upsert({
    where: { userId: 'dev-user' },
    create: {
      id: 'dev-user',
      userId: 'dev-user',
      displayName: 'Dev User',
      timezone: 'Europe/Paris',
      locale: 'fr',
      weeklyPlantGoal: 30,
    },
    update: {
      displayName: 'Dev User',
    },
  });

  console.log(`Seeded ${foodCount} foods with ${modifierCount} preparation modifiers.`);
  console.log('Created dev user profile (id: dev-user).');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
