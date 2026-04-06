import { z } from 'zod';
import { MealMoment, PortionSize, PreparationMethod } from '../enums.js';

const favoriteItemInputSchema = z.object({
  foodId: z.string().min(1),
  preparationMethod: z.enum([
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
  ]),
  portionSize: z.enum([PortionSize.SMALL, PortionSize.MEDIUM, PortionSize.LARGE]).optional(),
});

export const createFavoriteInputSchema = z.object({
  name: z.string().min(1).max(100),
  moment: z
    .enum([MealMoment.BREAKFAST, MealMoment.LUNCH, MealMoment.DINNER, MealMoment.SNACK])
    .optional(),
  items: z.array(favoriteItemInputSchema).min(1).max(20),
});
