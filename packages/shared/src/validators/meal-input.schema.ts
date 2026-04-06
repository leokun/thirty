import { z } from 'zod';
import { FoodCategory, MealMoment, PortionSize, PreparationMethod } from '../enums.js';

const FOOD_CATEGORY_VALUES = [
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
] as const;

const foodCategorySchema = z.enum(FOOD_CATEGORY_VALUES);

const preparationMethodSchema = z.enum([
  PreparationMethod.RAW,
  PreparationMethod.STEAMED,
  PreparationMethod.BOILED,
  PreparationMethod.ROASTED,
  PreparationMethod.FRIED,
  PreparationMethod.FERMENTED,
  PreparationMethod.LACTOFERMENTED,
  PreparationMethod.SPROUTED,
  PreparationMethod.SOAKED,
  PreparationMethod.DRIED,
  PreparationMethod.AGED,
  PreparationMethod.SMOKED,
]);

export const createMealInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moment: z.enum([MealMoment.BREAKFAST, MealMoment.LUNCH, MealMoment.DINNER, MealMoment.SNACK]),
  note: z.string().max(500).optional(),
});

export const addFoodLogInputSchema = z.object({
  foodId: z.string().min(1),
  preparationMethod: preparationMethodSchema,
  portionSize: z.enum([PortionSize.SMALL, PortionSize.MEDIUM, PortionSize.LARGE]).optional(),
});

export const quickAddInputSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    moment: z.enum([MealMoment.BREAKFAST, MealMoment.LUNCH, MealMoment.DINNER, MealMoment.SNACK]),
    preparationMethod: preparationMethodSchema,
    portionSize: z.enum([PortionSize.SMALL, PortionSize.MEDIUM, PortionSize.LARGE]).optional(),
    foodId: z.string().min(1).optional(),
    customFood: z
      .object({
        nameFr: z.string().min(1).max(120).trim(),
        category: foodCategorySchema,
      })
      .optional(),
  })
  .refine((d) => (d.foodId != null) !== (d.customFood != null), {
    path: ['foodId'],
    message: 'Provide exactly one of foodId or customFood',
  });
