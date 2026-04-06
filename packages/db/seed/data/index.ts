import type { FoodDefinition } from '../types.js';
import { beverages } from './beverages.js';
import { cheese } from './cheese.js';
import { dairy } from './dairy.js';
import { eggs } from './eggs.js';
import { fermentedCondiments } from './fermented-condiments.js';
import { fish } from './fish.js';
import { fruits } from './fruits.js';
import { grains } from './grains.js';
import { herbsSpices } from './herbs-spices.js';
import { legumes } from './legumes.js';
import { meat } from './meat.js';
import { nutsSeeds } from './nuts-seeds.js';
import { other } from './other.js';
import { vegetables } from './vegetables.js';

export const foods: FoodDefinition[] = [
  ...vegetables,
  ...fruits,
  ...legumes,
  ...grains,
  ...nutsSeeds,
  ...herbsSpices,
  ...dairy,
  ...cheese,
  ...fish,
  ...eggs,
  ...fermentedCondiments,
  ...beverages,
  ...meat,
  ...other,
];
