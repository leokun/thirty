import type { FoodDefinition } from '../types.js';

export const eggs: FoodDefinition[] = [
  {
    nameFr: 'Oeuf',
    nameEn: 'Egg',
    category: 'EGG',
    isPlant: false,
    solubleFiberScore: 0,
    insolubleFiberScore: 0,
    prebioticScore: 0,
    polyphenolScore: 0,
    isFermented: false,
    probioticsScore: 0,
    omega3Score: 1.5,
    mucosalSupportScore: 2.5,
    seasonMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    synonyms: ['oeuf de poule', 'oeuf bio'],
    tags: ['source de choline', 'source de zinc', 'source de glutamine'],
    sources: [],
    availablePreparations: ['RAW', 'BOILED', 'FRIED', 'STEAMED'],
    defaultPreparation: 'BOILED',
  },
];
