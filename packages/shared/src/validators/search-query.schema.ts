import { z } from 'zod';
import { FoodCategory } from '../enums.js';

export const searchFoodQuerySchema = z.object({
  q: z.string().min(1).max(100),
  category: z
    .enum([
      FoodCategory.VEGETABLE,
      FoodCategory.FRUIT,
      FoodCategory.LEGUME,
      FoodCategory.GRAIN,
      FoodCategory.NUT_SEED,
      FoodCategory.HERB_SPICE,
      FoodCategory.DAIRY,
      FoodCategory.CHEESE,
      FoodCategory.MEAT,
      FoodCategory.FISH,
      FoodCategory.EGG,
      FoodCategory.FERMENTED_CONDIMENT,
      FoodCategory.BEVERAGE,
      FoodCategory.OTHER,
    ])
    .optional(),
  limit: z.number().int().min(1).max(50).optional(),
});
